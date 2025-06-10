<template>
  <div class="login-container">
    <h1 class="app-title">RuedApp</h1>
    <div class="logo-container" :class="{ slideIn: showLogo }">
      <img src="@/assets/logo.png" alt="RuedApp Logo" class="logo" />
    </div>
    <form class="login-form" @submit.prevent="handleLogin">
      <h2>Iniciar Sesión</h2>
      <input v-model="email" type="email" placeholder="Correo" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      showLogo: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.showLogo = true;
    }, 100);
  },
  methods: {
    async handleLogin() {
      this.error = '';
      try {
        const res = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password,
        });
        // Guarda el token y el rol
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('rol', res.data.empleado.rol);

        this.$router.push('/dashboard');
      } catch (err) {
        this.error = 'Credenciales inválidas';
      }
    },
  },
};
</script>

<style scoped>

html, body {
  margin: 0;
  padding: 0;
  height: 100%; 
  overflow: hidden; 
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; 
  width: 100vw; 
  margin: 0; 
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  padding: 0; 
  overflow: hidden; 
}

.app-title {
  font-family: 'Poppins', sans-serif; 
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 10px;
  text-align: center;
}


.logo-container {
  margin-bottom: 20px;
  opacity: 0;
  transform: translateX(-100%); 
  transition: all 0.8s ease-in-out;
}

.logo-container.slideIn {
  opacity: 1;
  transform: translateX(0); 
}

.logo {
  width: 150px; 
  height: auto;
}


.login-form {
  max-width: 350px;
  width: 100%;
  padding: 2rem 2.5rem;
  border-radius: 10px;
  background: #f5f5f5; 
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); 
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form h2 {
  font-family: 'Poppins', sans-serif; 
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #1e3c72;
}

.login-form input {
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.login-form button {
  padding: 0.7rem;
  background: #1e3c72; 
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.login-form button:hover {
  background: #163a5f; 
}

.error {
  color: #d32f2f;
  text-align: center;
}
</style>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">