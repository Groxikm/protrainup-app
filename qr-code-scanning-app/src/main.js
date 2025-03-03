import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import your router

//import Vue from 'vue';
//import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';


const app = createApp(App);
app.use(router); // Use Vue Router
app.mount('#app'); // Mount the Vue app
