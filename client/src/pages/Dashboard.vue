<template>
  <div>
    <div class="dashboard-welcome">
      <h2>¡Bienvenido a RuedApp!</h2>
      <p>Selecciona una sección del menú para comenzar a gestionar tu taller.</p>
    </div>
    <div class="dashboard-kpis">
      <div class="kpi-card">
        <h3>{{ totalClientes }}</h3>
        <p>Clientes</p>
      </div>
      <div class="kpi-card">
        <h3>{{ totalVehiculos }}</h3>
        <p>Vehículos</p>
      </div>
      <div class="kpi-card">
        <h3>{{ totalOrdenes }}</h3>
        <p>Órdenes activas</p>
      </div>
      <div class="kpi-card">
        <h3>{{ totalInventario }}</h3>
        <p>Items en Inventario</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DashboardPage',
  data() {
    return {
      totalClientes: 0,
      totalVehiculos: 0,
      totalOrdenes: 0,
      totalInventario: 0,
    };
  },
  async mounted() {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [clientes, vehiculos, ordenes, inventario] = await Promise.all([
      axios.get('http://localhost:3000/api/clientes'),
      axios.get('http://localhost:3000/api/vehiculos'),
      axios.get('http://localhost:3000/api/ordenes-servicio', config),
      axios.get('http://localhost:3000/api/inventario'),
    ]);
    this.totalClientes = clientes.data.length;
    this.totalVehiculos = vehiculos.data.length;
    this.totalOrdenes = ordenes.data.length;
    this.totalInventario = inventario.data.length;
  }
}
</script>

<style scoped>
.dashboard-welcome {
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-welcome h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.dashboard-welcome p {
  font-size: 1.2rem;
  color: #e0e0e0;
}

.dashboard-kpis {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.kpi-card {
  background: rgba(255,255,255,0.13);
  border-radius: 12px;
  padding: 2rem 2.5rem;
  min-width: 180px;
  text-align: center;
  color: #fff;
  box-shadow: 0 2px 10px rgba(30,60,114,0.08);
  font-family: 'Poppins', sans-serif;
}

.kpi-card h3 {
  font-size: 2.2rem;
  margin: 0 0 0.5rem 0;
  color: #42b983;
}

.kpi-card p {
  margin: 0;
  font-size: 1.1rem;
  color: #e0e0e0;
}

@media (max-width: 700px) {
  .dashboard-kpis {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
}
</style>