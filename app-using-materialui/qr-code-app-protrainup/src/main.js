import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

//import Vue from 'vue';
//import VueMaterial from 'vue-material';
import '@mdi/font/css/materialdesignicons.css';


const app = createApp(App);
app.use(router);
app.mount('#app');