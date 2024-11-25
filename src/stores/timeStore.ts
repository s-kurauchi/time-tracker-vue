import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Project, TaskType, TimeEntry } from '../types';

export const useTimeStore = defineStore('time', () => {
  const projects = ref<Project[]>([]);
  const taskTypes = ref<TaskType[]>([]);
  const timeEntries = ref<TimeEntry[]>([]);
  const activeTimer = ref<TimeEntry | null>(null);

  const addProject = (name: string) => {
    const project: Project = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date()
    };
    projects.value.push(project);
    return project;
  };

  const addTaskType = (name: string) => {
    const taskType: TaskType = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date()
    };
    taskTypes.value.push(taskType);
    return taskType;
  };

  const startTimer = (projectId: string, taskTypeId: string) => {
    if (activeTimer.value) return;

    const entry: TimeEntry = {
      id: crypto.randomUUID(),
      projectId,
      taskTypeId,
      startTime: new Date(),
      endTime: null,
      duration: null,
      isManualEntry: false,
      createdAt: new Date()
    };
    
    timeEntries.value.push(entry);
    activeTimer.value = entry;
  };

  const stopTimer = () => {
    if (!activeTimer.value) return;

    const endTime = new Date();
    const duration = endTime.getTime() - activeTimer.value.startTime.getTime();
    
    activeTimer.value.endTime = endTime;
    activeTimer.value.duration = duration;
    activeTimer.value = null;
  };

  const addManualEntry = (projectId: string, taskTypeId: string, startTime: Date, endTime: Date) => {
    const entry: TimeEntry = {
      id: crypto.randomUUID(),
      projectId,
      taskTypeId,
      startTime,
      endTime,
      duration: endTime.getTime() - startTime.getTime(),
      isManualEntry: true,
      createdAt: new Date()
    };
    
    timeEntries.value.push(entry);
  };

  return {
    projects,
    taskTypes,
    timeEntries,
    activeTimer,
    addProject,
    addTaskType,
    startTimer,
    stopTimer,
    addManualEntry
  };
});