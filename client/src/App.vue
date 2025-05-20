<template>
  <div id="app">
    <LoginForm v-if="!empleado" @login-success="empleado = $event" />
    <div v-else>
      <h2>Bienvenido, {{ empleado.nombre }} {{ empleado.apellido }}</h2>
      <!-- Aquí puedes mostrar el resto de la app -->
    </div>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue';

export default {
  name: 'App',
  components: {
    LoginForm
  },
  data() {
    return {
      empleado: null
    };
  }
};
</script>