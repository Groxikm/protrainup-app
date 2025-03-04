import { createRouter, createWebHistory } from 'vue-router';
import AdminPage from '../views/AdminPage.vue';
import CreateUser from '../views/CreateUser.vue';
import FindUser from '../views/FindUser.vue';
import ChangeUser from '../views/ChangeUser.vue';
import ScanPage from '../views/ScanPage.vue';
import RegistrationLogPage from '../views/RegistrationLogPage.vue';

// Define routes with a default "/" path
const routes = [
  { path: '/', redirect: '/admin' }, // ✅ Redirect "/" to "/admin"
  { path: '/admin', component: AdminPage },
  { path: '/admin/create-user', component: CreateUser },
  { path: '/admin/find-user', component: FindUser },
  { path: '/admin/change-user', component: ChangeUser },
  { path: '/admin/scan', component: ScanPage },
  { path: '/admin/log', component: RegistrationLogPage },
  { path: '/:pathMatch(.*)*', redirect: '/admin' } // ✅ Redirect unknown routes
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
