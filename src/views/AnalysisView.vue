<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import { useTimeStore } from '../stores/timeStore';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const store = useTimeStore();
const startDate = ref(new Date());
const endDate = ref(new Date());

const filteredEntries = computed(() => {
  return store.timeEntries.filter(entry => {
    return isWithinInterval(entry.startTime, {
      start: startOfDay(startDate.value),
      end: endOfDay(endDate.value)
    });
  });
});

const chartData = computed(() => {
  const projectData = new Map();
  
  filteredEntries.value.forEach(entry => {
    const project = store.projects.find(p => p.id === entry.projectId);
    if (!project || !entry.duration) return;
    
    const hours = entry.duration / (1000 * 60 * 60);
    projectData.set(project.name, (projectData.get(project.name) || 0) + hours);
  });

  return {
    labels: Array.from(projectData.keys()),
    datasets: [{
      label: '作業時間（時間）',
      data: Array.from(projectData.values()),
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  };
});
</script>

<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">作業時間分析</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="startDate"
              type="date"
              label="開始日"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="endDate"
              type="date"
              label="終了日"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section style="height: 400px">
        <Bar
          :data="chartData"
          :options="{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>