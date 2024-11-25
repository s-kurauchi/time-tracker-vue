export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

export interface TaskType {
  id: string;
  name: string;
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  taskTypeId: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  isManualEntry: boolean;
  createdAt: Date;
}