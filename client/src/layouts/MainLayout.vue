<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <img src="@/assets/logo.png" alt="RuedApp Logo" class="logo" />
      <router-link to="/dashboard" class="dashboard-title-link">
        <h1>RUEDAAPP</h1>
      </router-link>
      <button class="logout-btn" @click="logout">Cerrar sesión</button>
    </header>
    <nav class="dashboard-nav">
      <router-link to="/dashboard" class="nav-link">Inicio</router-link>
      <router-link v-if="userRol === 'admin' || userRol === 'mecanico'" to="/dashboard/clientes" class="nav-link">Clientes</router-link>
      <router-link v-if="userRol === 'admin' || userRol === 'mecanico'" to="/dashboard/inventario" class="nav-link">Inventario</router-link>
      <router-link v-if="userRol === 'admin' || userRol === 'mecanico'" to="/dashboard/ordenes-servicio" class="nav-link">Órdenes de Servicio</router-link>
      <router-link v-if="userRol === 'admin' || userRol === 'mecanico'" to="/dashboard/vehiculos" class="nav-link">Vehículos</router-link>
      <router-link v-if="userRol === 'admin' || userRol === 'propietario'" to="/dashboard/empleados" class="nav-link">Empleados</router-link>
      <router-link v-if="userRol === 'admin'" to="/dashboard/talleres" class="nav-link">Talleres</router-link>
    </nav>
    <main class="dashboard-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  computed: {
    userRol() {
      return localStorage.getItem('rol');
    }
  },
  mounted() {
    window.addEventListener('storage', () => {
      this.$forceUpdate();
    });
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298); 
  color: white;
  font-family: 'Poppins', sans-serif;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2); 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: relative;
}

.dashboard-header .logo {
  width: 50px;
  height: auto;
  margin-right: 1rem;
}

.dashboard-title-link {
  text-decoration: none;
  color: inherit;
}

.dashboard-title-link h1 {
  margin: 0;
  font-size: 1.8rem;
  transition: color 0.2s;
  cursor: pointer;
}

.dashboard-title-link:hover h1 {
  color: #42b983;
}

.dashboard-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.1);  
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

.dashboard-content {
  flex: 1;
  padding: 2rem;
}

.logout-btn {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #b71c1c;
}
</style>