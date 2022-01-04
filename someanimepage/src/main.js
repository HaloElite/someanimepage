import { createApp } from 'vue';
import App from './App.vue';
import './style/index.css';
import store from './store.js';
import VueLazyLoad from 'vue3-lazyload'

var app = createApp(App);

app.use(store);
app.use(VueLazyLoad, {
    preLoad: 1.3,
    attempt: 2
  })
app.mount('#app');
