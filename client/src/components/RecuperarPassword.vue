<template>
  <div class="recuperar-bg">
    <div class="recuperar-card">
      <img src="@/assets/logo.png" alt="RuedApp Logo" class="recuperar-logo" />
      <h2>Recuperar contraseña</h2>
      <form @submit.prevent="solicitarCodigo" v-if="!codigoEnviado">
        <input v-model="email" type="email" placeholder="Correo electrónico" required />
        <button type="submit">Enviar código</button>
      </form>
      <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="codigoEnviado">
        <h3>Ingresa el código recibido y tu nueva contraseña</h3>
        <form @submit.prevent="restablecerPassword">
          <input v-model="codigo" type="text" placeholder="Código recibido" required />
          <input v-model="nuevaPassword" type="password" placeholder="Nueva contraseña" required />
          <input v-model="confirmarPassword" type="password" placeholder="Confirmar contraseña" required />
          <button type="submit">Restablecer contraseña</button>
        </form>
      </div>
      <router-link to="/" class="volver-login">Volver a iniciar sesión</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      email: '',
      codigo: '',
      nuevaPassword: '',
      confirmarPassword: '',
      mensaje: '',
      error: '',
      codigoEnviado: false,
    };
  },
  methods: {
    async solicitarCodigo() {
      this.mensaje = '';
      this.error = '';
      try {
        await axios.post('http://localhost:3000/api/solicitar-reset-password', { email: this.email });
        this.mensaje = 'Código enviado a tu correo.';
        this.codigoEnviado = true;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al enviar el código';
      }
    },
    async restablecerPassword() {
      this.mensaje = '';
      this.error = '';
      if (this.nuevaPassword !== this.confirmarPassword) {
        this.error = 'Las contraseñas no coinciden';
        return;
      }
      try {
        await axios.post('http://localhost:3000/api/restablecer-password', {
          email: this.email,
          token: this.codigo,
          nuevaPassword: this.nuevaPassword,
        });
        this.mensaje = '¡Contraseña restablecida! Ahora puedes iniciar sesión.';
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al restablecer la contraseña';
      }
    },
  },
};
</script>

<style scoped>
.recuperar-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  display: flex;
  align-items: center;
  justify-content: center;
}
.recuperar-card {
  background: #fff;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(30,60,114,0.13);
  max-width: 400px;
  width: 100%;
  text-align: center;
}
.recuperar-logo {
  width: 110px;
  margin-bottom: 1rem;
}
.recuperar-card h2 {
  margin-bottom: 1.2rem;
  color: #1e3c72;
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
}
.recuperar-card h3 {
  font-size: 1.1rem;
  color: #1e3c72;
  margin: 1.2rem 0 0.7rem 0;
}
.recuperar-card form {
  margin-bottom: 1rem;
}
.recuperar-card input {
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
.recuperar-card button {
  background: #1e3c72;
  color: #fff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}
.recuperar-card button:hover {
  background: #42b983;
}
.mensaje {
  color: #42b983;
  margin-bottom: 1rem;
}
.error {
  color: #e74c3c;
  margin-bottom: 1rem;
}
.volver-login {
  display: block;
  margin-top: 1.2rem;
  color: #1e3c72;
  text-decoration: underline;
  font-size: 1rem;
  transition: color 0.2s;
}
.volver-login:hover {
  color: #42b983;
}
</style>