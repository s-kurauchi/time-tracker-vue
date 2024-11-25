import { createRouter, createWebHistory } from 'vue-router';
import TimerView from '../views/TimerView.vue';
import AnalysisView from '../views/AnalysisView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/timer'
    },
    {
      path: '/timer',
      name: 'timer',
      component: TimerView
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: AnalysisView
    }
  ]
});

export default router;