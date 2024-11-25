<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { useTimeStore } from '../stores/timeStore';
import type { Project, TaskType } from '../types';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const store = useTimeStore();

const newProjectName = ref('');
const newTaskTypeName = ref('');
const selectedProject = ref<Project | null>(null);
const selectedTaskType = ref<TaskType | null>(null);
const elapsedTime = ref('00:00:00');
const currentTime = ref(new Date());
let timerInterval: number | null = null;

const formatTime = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const updateTimer = () => {
  if (store.activeTimer) {
    const elapsed = Date.now() - store.activeTimer.startTime.getTime();
    elapsedTime.value = formatTime(elapsed);
  } else {
    currentTime.value = new Date();
    elapsedTime.value = formatTime(0);
  }
};

// Start the timer display immediately
timerInterval = window.setInterval(updateTimer, 1000);

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

const addNewProject = () => {
  if (!newProjectName.value) return;
  const project = store.addProject(newProjectName.value);
  selectedProject.value = project;
  newProjectName.value = '';
};

const addNewTaskType = () => {
  if (!newTaskTypeName.value) return;
  const taskType = store.addTaskType(newTaskTypeName.value);
  selectedTaskType.value = taskType;
  newTaskTypeName.value = '';
};

const startTracking = () => {
  if (!selectedProject.value || !selectedTaskType.value) return;
  store.startTimer(selectedProject.value.id, selectedTaskType.value.id);
};

const stopTracking = () => {
  store.stopTimer();
};

const showManualEntryDialog = () => {
  $q.dialog({
    title: '手動で時間を記録',
    message: '開始時間と終了時間を選択してください',
    prompt: {
      model: '',
      type: 'time'
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    console.log('>>>> OK, received', data)
  });
};

const isStartDisabled = computed(() => {
  return !!store.activeTimer || !selectedProject.value || !selectedTaskType.value;
});

const isStopDisabled = computed(() => {
  return !store.activeTimer;
});
</script>

<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">時間記録</div>
      </q-card-section>

      <q-card-section class="text-center q-py-lg">
        <div class="timer-display">
          {{ elapsedTime }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="selectedProject"
              :options="store.projects"
              option-label="name"
              label="プロジェクト"
              class="q-mb-sm"
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="add"
                  @click.stop="$q.dialog({
                    title: '新規プロジェクト',
                    prompt: {
                      model: newProjectName,
                      type: 'text'
                    },
                    cancel: true,
                    persistent: true
                  }).onOk(data => {
                    newProjectName = data;
                    addNewProject();
                  })"
                />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="selectedTaskType"
              :options="store.taskTypes"
              option-label="name"
              label="作業種別"
              class="q-mb-sm"
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="add"
                  @click.stop="$q.dialog({
                    title: '新規作業種別',
                    prompt: {
                      model: newTaskTypeName,
                      type: 'text'
                    },
                    cancel: true,
                    persistent: true
                  }).onOk(data => {
                    newTaskTypeName = data;
                    addNewTaskType();
                  })"
                />
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="text-center">
        <div class="row justify-center q-gutter-md">
          <q-btn
            size="lg"
            color="positive"
            :class="{ 'disabled-btn': isStartDisabled }"
            icon="play_arrow"
            label="開始"
            :disable="isStartDisabled"
            @click="startTracking"
          />
          <q-btn
            size="lg"
            color="negative"
            :class="{ 'disabled-btn': isStopDisabled }"
            icon="stop"
            label="停止"
            :disable="isStopDisabled"
            @click="stopTracking"
          />
          <q-btn
            size="lg"
            color="primary"
            icon="edit"
            label="手動入力"
            @click="showManualEntryDialog"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
.timer-display {
  font-family: 'Roboto Mono', monospace;
  font-size: 5rem;
  font-weight: 700;
  color: #1976D2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 2px;
  line-height: 1.2;
  margin: 1rem 0;
}

.disabled-btn {
  opacity: 0.6;
}

/* ダークモード対応 */
:deep(.q-dark) .timer-display {
  color: #64B5F6;
}
</style>