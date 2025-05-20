<template>
  <form class="login-form" @submit.prevent="handleLogin">
    <h2>Iniciar Sesión</h2>
    <input v-model="email" type="email" placeholder="Correo" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <button type="submit">Entrar</button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';
      try {
        const res = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password
        });
        this.$emit('login-success', res.data.empleado);
      } catch (err) {
        this.error = 'Credenciales inválidas';
      }
    }
  }
};
</script>

<style scoped>
.login-form {
  max-width: 350px;
  margin: 60px auto;
  padding: 2rem 2.5rem;
  border-radius: 10px;
  background: #f7f7f7;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.login-form h2 {
  text-align: center;
  margin-bottom: 1rem;
}
.login-form input {
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}
.login-form button {
  padding: 0.7rem;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.login-form button:hover {
  background: #369870;
}
.error {
  color: #d32f2f;
  text-align: center;
}
</style>