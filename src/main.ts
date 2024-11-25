import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Dialog } from 'quasar';
import router from './router';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: { Dialog },
  config: {
    brand: {
      primary: '#1976D2',
      secondary: '#26A69A',
      accent: '#9C27B0',
      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037'
    }
  }
});
app.mount('#app');