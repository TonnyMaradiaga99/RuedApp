<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <img src="@/assets/logo.png" alt="RuedApp Logo" class="logo" />
      <h1>RUEDAAPP</h1>
    </header>
    <nav class="dashboard-nav">
      <router-link to="/dashboard/clientes" class="nav-link">Clientes</router-link>
      <router-link to="/dashboard/inventario" class="nav-link">Inventario</router-link>
      <router-link to="/dashboard/ordenes-servicio" class="nav-link">Órdenes de Servicio</router-link>
      <router-link to="/dashboard/vehiculos" class="nav-link">Vehículos</router-link>
    </nav>
    <main class="dashboard-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage', // Cumple con la regla multi-word
};
</script>

<style scoped>
/* Fondo con degradado */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298); /* Azul metálico */
  color: white;
  font-family: 'Poppins', sans-serif;
}

/* Encabezado del dashboard */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2); /* Fondo semitransparente */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.dashboard-header .logo {
  width: 50px;
  height: auto;
  margin-right: 1rem;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  margin: 0;
}

/* Navegación del dashboard */
.dashboard-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.1); /* Fondo semitransparente */
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s, color 0.3s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #f5f5f5;
}

/* Contenido principal */
.dashboard-content {
  flex: 1;
  padding: 2rem;
}
</style>