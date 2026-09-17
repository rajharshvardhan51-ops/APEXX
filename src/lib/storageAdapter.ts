import { StateStorage } from 'zustand/middleware';

export interface SyncQueueItem {
  id: string;
  actionType: 'addXp' | 'logHabit' | 'toggleQuest' | 'toggleGraduationMilestone' | 'stateUpdate' | string;
  payload: Record<string, unknown>;
  timestamp: number;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
}

export interface SyncStatusState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
}

const DB_NAME = 'apexx_db';
const DB_VERSION = 1;
const STATE_STORE = 'state_store';
const SYNC_QUEUE_STORE = 'sync_queue';

type SyncStatusCallback = (status: SyncStatusState) => void;
const syncStatusListeners: Set<SyncStatusCallback> = new Set();

let currentSyncStatus: SyncStatusState = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  pendingCount: 0,
};

function notifySyncListeners() {
  syncStatusListeners.forEach((cb) => cb(currentSyncStatus));
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in current environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STATE_STORE)) {
        db.createObjectStore(STATE_STORE);
      }
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const queueStore = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id' });
        queueStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        queueStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Low-level IndexedDB Store helper
async function getStoreItem<T>(storeName: string, key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[storageAdapter] Read error from ${storeName}:`, err);
    return null;
  }
}

async function setStoreItem(storeName: string, key: string, value: unknown): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[storageAdapter] Write error to ${storeName}:`, err);
  }
}

async function removeStoreItem(storeName: string, key: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[storageAdapter] Delete error from ${storeName}:`, err);
  }
}

// Zustand StateStorage Implementation
export const indexedDBStorageAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const val = await getStoreItem<string>(STATE_STORE, name);
    if (val !== null) return val;
    // Fallback read from localStorage if present
    if (typeof localStorage !== 'undefined') {
      const fallback = localStorage.getItem(name);
      if (fallback) {
        // Migrate fallback into IndexedDB
        setStoreItem(STATE_STORE, name, fallback);
        return fallback;
      }
    }
    return null;
  },

  setItem: async (name: string, value: string): Promise<void> => {
    await setStoreItem(STATE_STORE, name, value);
    // Mirror to localStorage as instant sync safeguard
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(name, value);
      } catch (e) {
        // Ignore localStorage quota errors
      }
    }
  },

  removeItem: async (name: string): Promise<void> => {
    await removeStoreItem(STATE_STORE, name);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
};

// Offline Sync Queue Engine
export async function enqueueSyncItem(
  actionType: SyncQueueItem['actionType'],
  payload: Record<string, unknown>
): Promise<SyncQueueItem> {
  const item: SyncQueueItem = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    actionType,
    payload,
    timestamp: Date.now(),
    syncStatus: 'PENDING',
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
      const store = tx.objectStore(SYNC_QUEUE_STORE);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    await updatePendingCount();
    
    // Trigger immediate sync attempt if online
    if (navigator.onLine) {
      processSyncQueue();
    }
  } catch (err) {
    console.warn('[storageAdapter] Error enqueuing sync item:', err);
  }

  return item;
}

export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(SYNC_QUEUE_STORE, 'readonly');
      const store = tx.objectStore(SYNC_QUEUE_STORE);
      const index = store.index('syncStatus');
      const req = index.getAll('PENDING');
      req.onsuccess = () => resolve((req.result as SyncQueueItem[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    return [];
  }
}

export async function updatePendingCount(): Promise<number> {
  const items = await getPendingSyncItems();
  currentSyncStatus = {
    ...currentSyncStatus,
    pendingCount: items.length,
  };
  notifySyncListeners();
  return items.length;
}

export async function processSyncQueue(): Promise<number> {
  if (currentSyncStatus.isSyncing) return 0;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 0;

  const pendingItems = await getPendingSyncItems();
  if (pendingItems.length === 0) return 0;

  currentSyncStatus = { ...currentSyncStatus, isSyncing: true };
  notifySyncListeners();

  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: pendingItems }),
    });

    if (response.ok) {
      // Mark items as SYNCED in IndexedDB
      const db = await openDB();
      const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
      const store = tx.objectStore(SYNC_QUEUE_STORE);

      for (const item of pendingItems) {
        store.delete(item.id);
      }

      await new Promise((res) => {
        tx.oncomplete = res;
      });
    }
  } catch (err) {
    console.warn('[storageAdapter] Sync upload failed (device offline or server unreachable):', err);
  } finally {
    const remaining = await getPendingSyncItems();
    currentSyncStatus = {
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isSyncing: false,
      pendingCount: remaining.length,
    };
    notifySyncListeners();
  }

  return currentSyncStatus.pendingCount;
}

// Atomic Export / Import Safeguard Functions
export async function exportDatabaseBackup(): Promise<string> {
  try {
    const db = await openDB();
    
    // Read state_store
    const stateItems: Record<string, unknown> = {};
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STATE_STORE, 'readonly');
      const store = tx.objectStore(STATE_STORE);
      const req = store.openCursor();
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          stateItems[cursor.key as string] = cursor.value;
          cursor.continue();
        } else {
          resolve();
        }
      };
      req.onerror = () => reject(req.error);
    });

    // Read pending sync_queue
    const syncItems: SyncQueueItem[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(SYNC_QUEUE_STORE, 'readonly');
      const store = tx.objectStore(SYNC_QUEUE_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as SyncQueueItem[]) || []);
      req.onerror = () => reject(req.error);
    });

    const backupPayload = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      stateStore: stateItems,
      syncQueue: syncItems,
    };

    return JSON.stringify(backupPayload, null, 2);
  } catch (err) {
    console.error('[storageAdapter] Export backup error:', err);
    throw new Error('Failed to export database backup from IndexedDB.');
  }
}

export async function importDatabaseBackup(jsonString: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonString);
    const db = await openDB();

    // Restore state_store
    if (parsed.stateStore) {
      const tx = db.transaction(STATE_STORE, 'readwrite');
      const store = tx.objectStore(STATE_STORE);
      for (const [key, val] of Object.entries(parsed.stateStore)) {
        store.put(val, key);
      }
      await new Promise((res) => { tx.oncomplete = res; });
    } else if (parsed.state) {
      // Compatibility with legacy backup JSON format
      await setStoreItem(STATE_STORE, 'apexx_user_state', JSON.stringify({ state: parsed.state, version: 0 }));
    }

    // Restore sync_queue
    if (Array.isArray(parsed.syncQueue)) {
      const tx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
      const store = tx.objectStore(SYNC_QUEUE_STORE);
      for (const item of parsed.syncQueue) {
        store.put(item);
      }
      await new Promise((res) => { tx.oncomplete = res; });
    }

    await updatePendingCount();
    return true;
  } catch (err) {
    console.error('[storageAdapter] Import backup error:', err);
    throw new Error('Failed to parse or restore database backup.');
  }
}

// Global Network Event Listener Initialization
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    currentSyncStatus = { ...currentSyncStatus, isOnline: true };
    notifySyncListeners();
    processSyncQueue();
  });

  window.addEventListener('offline', () => {
    currentSyncStatus = { ...currentSyncStatus, isOnline: false };
    notifySyncListeners();
  });

  // Initial pending check
  updatePendingCount();
}

export function subscribeSyncStatus(callback: SyncStatusCallback): () => void {
  syncStatusListeners.add(callback);
  callback(currentSyncStatus);
  return () => {
    syncStatusListeners.delete(callback);
  };
}
