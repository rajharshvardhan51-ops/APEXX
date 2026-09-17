export interface SemesterNode {
  id: string;
  semesterNumber: number; // 1 to 8
  year: number; // 1 to 4
  yearLabel: string;
  title: string;
  phaseCategory: 'FOUNDATIONS' | 'CORE_COMPETENCY' | 'INDUSTRY_READY' | 'PRODUCTION_PLACEMENT';
  description: string;
  checklists: {
    id: string;
    label: string;
    xpReward: number;
  }[];
  xpRequired: number;
}

export const semesterRoadmap: SemesterNode[] = [
  // Year 1 (Foundations)
  {
    id: 'sem-1',
    semesterNumber: 1,
    year: 1,
    yearLabel: 'Year 1: Foundations',
    title: 'Core Java & OOP Fundamentals',
    phaseCategory: 'FOUNDATIONS',
    description: 'Master imperative programming syntax, object-oriented principles, and version control.',
    checklists: [
      { id: 'm-1-1', label: 'Core Java Variables, Control Flow & Arrays', xpReward: 150 },
      { id: 'm-1-2', label: 'Object-Oriented Programming (Inheritance, Polymorphism, Abstraction)', xpReward: 200 },
      { id: 'm-1-3', label: 'Git & GitHub Version Control Syntax', xpReward: 150 },
      { id: 'm-1-4', label: 'Discrete Mathematics & Logic Foundations', xpReward: 100 },
    ],
    xpRequired: 600,
  },
  {
    id: 'sem-2',
    semesterNumber: 2,
    year: 1,
    yearLabel: 'Year 1: Foundations',
    title: 'Basic Data Structures & Algorithms',
    phaseCategory: 'FOUNDATIONS',
    description: 'Build core linear data structures and recursion problem-solving skills.',
    checklists: [
      { id: 'm-2-1', label: 'Dynamic Arrays & Linked List Implementations', xpReward: 200 },
      { id: 'm-2-2', label: 'Stacks & Queues Data Structures', xpReward: 200 },
      { id: 'm-2-3', label: 'Recursion & Time Complexity Analysis (Big-O)', xpReward: 250 },
      { id: 'm-2-4', label: 'Basic Sorting & Searching Algorithms', xpReward: 150 },
    ],
    xpRequired: 800,
  },

  // Year 2 (Core Competency)
  {
    id: 'sem-3',
    semesterNumber: 3,
    year: 2,
    yearLabel: 'Year 2: Core Competency',
    title: 'Advanced DSA & Problem Solving',
    phaseCategory: 'CORE_COMPETENCY',
    description: 'Master non-linear trees, graphs, dynamic programming, and LeetCode Mediums.',
    checklists: [
      { id: 'm-3-1', label: 'Binary Search Trees & Heap Priority Queues', xpReward: 300 },
      { id: 'm-3-2', label: 'Graph Traversals (BFS/DFS) & Shortest Path', xpReward: 350 },
      { id: 'm-3-3', label: 'Dynamic Programming & Memoization Patterns', xpReward: 400 },
      { id: 'm-3-4', label: 'LeetCode 50+ Medium Problems Milestone', xpReward: 500 },
    ],
    xpRequired: 1550,
  },
  {
    id: 'sem-4',
    semesterNumber: 4,
    year: 2,
    yearLabel: 'Year 2: Core Competency',
    title: 'Database Engineering & Web Basics',
    phaseCategory: 'CORE_COMPETENCY',
    description: 'Relational database architecture, SQL queries, indexing, and HTTP web protocols.',
    checklists: [
      { id: 'm-4-1', label: 'PostgreSQL Relational Schema Design & Normalization', xpReward: 300 },
      { id: 'm-4-2', label: 'Complex SQL Joins, Subqueries & B-Tree Indexes', xpReward: 350 },
      { id: 'm-4-3', label: 'Web Fundamentals: HTTP Methods, Headers & REST APIs', xpReward: 250 },
      { id: 'm-4-4', label: 'Frontend Foundations: HTML5, CSS3, JavaScript ES6+', xpReward: 200 },
    ],
    xpRequired: 1100,
  },

  // Year 3 (Industry Ready)
  {
    id: 'sem-5',
    semesterNumber: 5,
    year: 3,
    yearLabel: 'Year 3: Industry Ready',
    title: 'Spring Boot & Microservices',
    phaseCategory: 'INDUSTRY_READY',
    description: 'Enterprise Java frameworks, REST APIs, JPA Hibernate ORM, and Spring Security.',
    checklists: [
      { id: 'm-5-1', label: 'Spring Boot Dependency Injection & Bean Lifecycle', xpReward: 400 },
      { id: 'm-5-2', label: 'Spring Data JPA ORM & Repository Pattern', xpReward: 450 },
      { id: 'm-5-3', label: 'Spring Security JWT Authentication & Authorization', xpReward: 500 },
      { id: 'm-5-4', label: 'Microservice Communication: REST & Feign Clients', xpReward: 500 },
    ],
    xpRequired: 1850,
  },
  {
    id: 'sem-6',
    semesterNumber: 6,
    year: 3,
    yearLabel: 'Year 3: Industry Ready',
    title: 'Full-Stack Integration & Architecture',
    phaseCategory: 'INDUSTRY_READY',
    description: 'Connect React/Next.js frontends with Spring Boot backends and design full production applications.',
    checklists: [
      { id: 'm-6-1', label: 'Next.js App Router & Server Components Integration', xpReward: 450 },
      { id: 'm-6-2', label: 'State Management & API Data Fetching Patterns', xpReward: 400 },
      { id: 'm-6-3', label: 'Production Full-Stack Capstone Project 01', xpReward: 700 },
      { id: 'm-6-4', label: 'Unit Testing (JUnit 5, Mockito, Jest)', xpReward: 350 },
    ],
    xpRequired: 1900,
  },

  // Year 4 (Production & Placement)
  {
    id: 'sem-7',
    semesterNumber: 7,
    year: 4,
    yearLabel: 'Year 4: Production & Placement',
    title: 'High-Level System Design & Cloud',
    phaseCategory: 'PRODUCTION_PLACEMENT',
    description: 'Scalable system architecture, distributed caching, messaging queues, and Cloud DevOps.',
    checklists: [
      { id: 'm-7-1', label: 'High-Level System Design (HLD): Scalability & Sharding', xpReward: 600 },
      { id: 'm-7-2', label: 'Distributed Caching (Redis) & Messaging (Apache Kafka)', xpReward: 650 },
      { id: 'm-7-3', label: 'Docker Containerization & Kubernetes Basics', xpReward: 500 },
      { id: 'm-7-4', label: 'AWS Cloud Deployment (EC2, S3, RDS, CloudFront)', xpReward: 600 },
    ],
    xpRequired: 2350,
  },
  {
    id: 'sem-8',
    semesterNumber: 8,
    year: 4,
    yearLabel: 'Year 4: Production & Placement',
    title: 'Placement & Capstone Mastery',
    phaseCategory: 'PRODUCTION_PLACEMENT',
    description: 'Mock technical interviews, system design interviews, and senior software engineer placement.',
    checklists: [
      { id: 'm-8-1', label: '100+ LeetCode Medium/Hard Problem Sprint', xpReward: 800 },
      { id: 'm-8-2', label: 'Mock Technical & Behavioral Interview Mastery', xpReward: 700 },
      { id: 'm-8-3', label: 'Final Distributed Architecture Capstone Deployment', xpReward: 1000 },
      { id: 'm-8-4', label: 'Senior Java Full-Stack Placement Secured', xpReward: 1500 },
    ],
    xpRequired: 4000,
  },
];

/**
 * Calculates Overall Graduation Readiness Percentage (0 - 100%)
 * based on completed checklist IDs and accumulated Engineering XP.
 */
export function calculateGraduationReadiness(
  completedChecklistIds: string[],
  engineeringXp: number
): number {
  let totalChecklistItems = 0;

  semesterRoadmap.forEach((node) => {
    totalChecklistItems += node.checklists.length;
  });

  if (totalChecklistItems === 0) return 0;

  const completedCount = completedChecklistIds.length;
  const checklistPercentage = (completedCount / totalChecklistItems) * 70; // 70% weight on milestones

  // 30% weight on accumulated Engineering XP (target: 14,200 XP for 100%)
  const xpPercentage = Math.min(30, (engineeringXp / 14200) * 30);

  const totalReadiness = Math.min(100, Math.round((checklistPercentage + xpPercentage) * 10) / 10);
  return totalReadiness;
}
