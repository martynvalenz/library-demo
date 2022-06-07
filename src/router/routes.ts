import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/Auth.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/auth/login', name:'Login', component: () => import('pages/auth/login.vue') },
      { path: '/auth/register', name:'Register', component: () => import('pages/auth/register.vue') },
    ],
  },

  {
    path: '/admin',
    component: () => import('layouts/Admin.vue'),
    children: [
      { path: '', name:'Admin', component: () => import('pages/admin/dashboard.vue'), meta: { requireAuth: true } },
      { path: '/admin/my-loans', name:'Loans', component: () => import('pages/admin/loans.vue'), meta: { requireAuth: true } },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
