'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Lock, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export interface SkillNodeItem {
  id: string;
  name: string;
  category: 'DEV' | 'FITNESS' | 'MIND';
  unlocked: boolean;
  parents: string[];
  description: string;
  xpReward: number;
}

const initialNodes: SkillNodeItem[] = [
  // DEV Track
  {
    id: 'dev-1',
    name: 'Core Java Syntax & OOP',
    category: 'DEV',
    unlocked: true,
    parents: [],
    description: 'Master variables, data structures, classes, and inheritance patterns.',
    xpReward: 200,
  },
  {
    id: 'dev-2',
    name: 'Data Structures & Algorithms',
    category: 'DEV',
    unlocked: true,
    parents: ['dev-1'],
    description: 'Arrays, Trees, Graphs, Dynamic Programming, and time complexities.',
    xpReward: 400,
  },
  {
    id: 'dev-3',
    name: 'Spring Boot Microservices',
    category: 'DEV',
    unlocked: true,
    parents: ['dev-2'],
    description: 'REST APIs, Dependency Injection, JPA Hibernate, and security filters.',
    xpReward: 600,
  },
  {
    id: 'dev-4',
    name: 'Distributed System Design',
    category: 'DEV',
    unlocked: false,
    parents: ['dev-3'],
    description: 'Kafka message brokers, Redis caching, database sharding, and fault tolerance.',
    xpReward: 1000,
  },

  // FITNESS Track
  {
    id: 'fit-1',
    name: 'Bodyweight & Mobility',
    category: 'FITNESS',
    unlocked: true,
    parents: [],
    description: 'Core push-ups, pull-ups, joint mobility, and posture alignment.',
    xpReward: 200,
  },
  {
    id: 'fit-2',
    name: 'Progressive Overload Iron',
    category: 'FITNESS',
    unlocked: true,
    parents: ['fit-1'],
    description: 'Compound barbell squats, bench press, deadlifts, and hypertrophy logs.',
    xpReward: 500,
  },
  {
    id: 'fit-3',
    name: 'Titan Conditioning Engine',
    category: 'FITNESS',
    unlocked: false,
    parents: ['fit-2'],
    description: 'VO2 Max sprinting, Zone 2 endurance, and peak physical power output.',
    xpReward: 900,
  },
];

export const SkillTree: React.FC = () => {
  const [nodes, setNodes] = useState<SkillNodeItem[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<SkillNodeItem | null>(null);

  const handleUnlockNode = (id: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unlocked: true } : n))
    );
    if (selectedNode?.id === id) {
      setSelectedNode({ ...selectedNode, unlocked: true });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[#08080A] border border-[#1E1E26] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.8)] space-y-6 font-mono select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E1E26] pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#FFFFFF]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
            VISUAL RPG SKILL PROGRESSION TREE
          </h2>
        </div>
        <span className="text-[10px] text-[#FFFFFF] bg-[#000000] px-2 py-0.5 rounded border border-[#383848] font-bold">
          5 NODE BRANCHES MASTERED
        </span>
      </div>

      {/* Visual Canvas Representation */}
      <div className="space-y-6">
        {/* Track 1: SOFTWARE ARCHITECTURE (DEV) */}
        <div className="space-y-3">
          <div className="text-[10px] font-bold text-[#FFFFFF] uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFFFFF] shadow-[0_0_8px_#FFFFFF]" />
            BRANCH 01: SOFTWARE ENGINEERING & ARCHITECTURE
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
            {nodes
              .filter((n) => n.category === 'DEV')
              .map((node, idx) => {
                const isSelected = selectedNode?.id === node.id;

                return (
                  <div key={node.id} className="flex flex-col items-center">
                    <button
                      onClick={() => setSelectedNode(node)}
                      className={`w-full p-3.5 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all duration-200 ${
                        node.unlocked
                          ? 'bg-[#18181F] border-[#FFFFFF] text-[#FFFFFF] shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                          : 'bg-[#000000] border-[#1E1E26] text-[#8E8E93] hover:border-[#8E8E93]'
                      } ${isSelected ? 'ring-2 ring-[#FFFFFF]' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#8E8E93]">
                          NODE 0{idx + 1}
                        </span>
                        {node.unlocked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FFFFFF]" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-[#8E8E93]" />
                        )}
                      </div>

                      <h4 className={`text-xs font-bold ${node.unlocked ? 'text-[#FFFFFF]' : 'text-[#8E8E93]'}`}>
                        {node.name}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1E1E26]/40">
                        <span className="text-[#8E8E93]">REWARD</span>
                        <span className="text-[#FFFFFF] font-bold">+{node.xpReward} XP</span>
                      </div>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Track 2: PHYSICAL CONDITIONING (FITNESS) */}
        <div className="space-y-3 pt-2">
          <div className="text-[10px] font-bold text-[#E4E4E7] uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E4E4E7] shadow-[0_0_8px_#FFFFFF]" />
            BRANCH 02: PHYSICAL CONDITIONING & OVERLOAD
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nodes
              .filter((n) => n.category === 'FITNESS')
              .map((node, idx) => {
                const isSelected = selectedNode?.id === node.id;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all duration-200 ${
                      node.unlocked
                        ? 'bg-[#18181F] border-[#FFFFFF] text-[#FFFFFF] shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                        : 'bg-[#000000] border-[#1E1E26] text-[#8E8E93] hover:border-[#8E8E93]'
                    } ${isSelected ? 'ring-2 ring-[#FFFFFF]' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8E8E93]">
                        NODE 0{idx + 1}
                      </span>
                      {node.unlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFFFFF]" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#8E8E93]" />
                      )}
                    </div>

                    <h4 className={`text-xs font-bold ${node.unlocked ? 'text-[#FFFFFF]' : 'text-[#8E8E93]'}`}>
                      {node.name}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1E1E26]/40">
                      <span className="text-[#8E8E93]">REWARD</span>
                      <span className="text-[#FFFFFF] font-bold">+{node.xpReward} XP</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Selected Node Details Card */}
      <AnimatePresence mode="wait">
        {selectedNode ? (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-[#000000] border border-[#1E1E26] space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[#FFFFFF] font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current text-[#FFFFFF]" /> {selectedNode.name}
              </span>

              {selectedNode.unlocked ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#000000] text-[#FFFFFF] border border-[#383848]">
                  NODE UNLOCKED & ACTIVE
                </span>
              ) : (
                <button
                  onClick={() => handleUnlockNode(selectedNode.id)}
                  className="px-3 py-1 rounded bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-bold text-[10px] uppercase shadow-[0_0_10px_#FFFFFF]"
                >
                  UNLOCK SKILL NODE (+{selectedNode.xpReward} XP)
                </button>
              )}
            </div>

            <p className="text-[#8E8E93] text-[11px] leading-relaxed">
              {selectedNode.description}
            </p>
          </motion.div>
        ) : (
          <div className="p-3 rounded-lg bg-[#000000] border border-[#1E1E26] text-xs text-[#8E8E93] flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-[#FFFFFF]" /> CLICK ANY SKILL NODE IN THE MATRIX TO VIEW PREREQUISITES & SPECS
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SkillTree;
