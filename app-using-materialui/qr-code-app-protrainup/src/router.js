import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from './components/LoginForm.vue';
import WelcomePage from './components/WelcomePage.vue';
import AdminPage from "./components/AdminPage.vue";
import ScanPage from "./components/ScanPage.vue";

const routes = [
  { path: '/', component: LoginForm },
  { path: '/welcome', name: 'welcome', component: WelcomePage },
  { path: '/qrscanner', name: 'qrscanner', component: ScanPage },
  { path: '/admin', name: 'admin', component: AdminPage, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;