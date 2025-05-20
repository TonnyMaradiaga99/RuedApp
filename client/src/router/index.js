import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import Dashboard from '../pages/Dashboard.vue';
import Clientes from '../pages/Clientes.vue';
import Inventario from '../pages/Inventario.vue';
import OrdenesServicio from '../pages/OrdenesServicio.vue';
import Vehiculos from '../pages/Vehiculos.vue';

const routes = [
  { path: '/', component: LoginForm },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: 'clientes', component: Clientes },
      { path: 'inventario', component: Inventario },
      { path: 'ordenes-servicio', component: OrdenesServicio },
      { path: 'vehiculos', component: Vehiculos },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;