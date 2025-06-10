import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import LoginForm from '../components/LoginForm.vue';
import Dashboard from '@/pages/Dashboard.vue';
import Clientes from '@/pages/Clientes.vue';
import Vehiculos from '@/pages/Vehiculos.vue';
import Inventario from '@/pages/Inventario.vue';
import OrdenesServicio from '@/pages/OrdenesServicio.vue';
import OrdenServicioDetalle from '@/components/OrdenServicioDetalle.vue';

const routes = [
  { path: '/', component: LoginForm },
  {
    path: '/dashboard',
    component: MainLayout,
    children: [
      { path: '', component: Dashboard }, 
      { path: 'clientes', component: Clientes },
      { path: 'vehiculos', component: Vehiculos },
      { path: 'inventario', component: Inventario },
      { path: 'ordenes-servicio', component: OrdenesServicio },
      { path: 'ordenes-servicio/:id', component: OrdenServicioDetalle, props: true },
    ],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.path.startsWith('/dashboard') && !token) {
    next('/');
  } else {
    next();
  }
});

export default router;