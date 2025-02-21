import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from './components/LoginForm.vue';
import WelcomePage from './components/WelcomePage.vue';

const routes = [
  { path: '/', component: LoginForm },
  { path: '/welcome', name: 'welcome', component: WelcomePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;