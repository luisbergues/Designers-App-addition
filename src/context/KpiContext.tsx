import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Project, Designer } from '../types';
import { calculateDesignerStats } from '../utils/scoreCalculator';

interface KpiContextType {
  projects: Project[];
  designers: Designer[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
}

const mockDesigners = [
  'Alice Johnson',
  'Bob Smith',
  'Charlie Davis',
  'Diana Miller'
];

const initialProjects: Project[] = [];

const KpiContext = createContext<KpiContextType | undefined>(undefined);

export const KpiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Compute designers dynamically from mock list and current projects
  const designers: Designer[] = mockDesigners.map(name => 
    calculateDesignerStats(name, projects)
  );

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  return (
    <KpiContext.Provider value={{ projects, designers, addProject, updateProject }}>
      {children}
    </KpiContext.Provider>
  );
};

export const useKpi = () => {
  const context = useContext(KpiContext);
  if (context === undefined) {
    throw new Error('useKpi must be used within a KpiProvider');
  }
  return context;
};
