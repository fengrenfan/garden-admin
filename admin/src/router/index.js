import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'Odometer' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory('/admin'),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title 
    ? `${to.meta.title} - 我的花园管理后台` 
    : '我的花园管理后台';

  const token = localStorage.getItem('admin_token');
  if (to.path !== '/login' && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
