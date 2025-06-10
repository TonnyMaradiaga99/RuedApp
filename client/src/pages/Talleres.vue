<template>
  <div class="talleres-container">
    <h1>Gestión de Talleres</h1>

    <button class="agregar-btn" @click="mostrarModal = true">Agregar Taller</button>

    <BaseModal v-if="mostrarModal" @close="cerrarModal">
      <form class="talleres-form" @submit.prevent="guardarTaller">
        <h2>{{ editando ? 'Editar Taller' : 'Agregar Taller' }}</h2>
        <input v-model="nuevoTaller.nombre" type="text" placeholder="Nombre del Taller" required />
        <input v-model="nuevoTaller.direccion" type="text" placeholder="Dirección" />
        <input v-model="nuevoTaller.telefono" type="text" placeholder="Teléfono" />
        <button type="submit">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
        <button v-if="editando" type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </BaseModal>

    <table class="talleres-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="taller in talleres" :key="taller._id">
          <td>{{ taller.nombre }}</td>
          <td>{{ taller.direccion }}</td>
          <td>{{ taller.telefono }}</td>
          <td>
            <button @click="editarTaller(taller)">Editar</button>
            <button @click="confirmarEliminarTaller(taller._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import BaseModal from '@/components/BaseModal.vue';

export default {
  name: 'TalleresPage',
  components: { BaseModal },
  data() {
    return {
      talleres: [],
      nuevoTaller: {
        nombre: '',
        direccion: '',
        telefono: '',
      },
      editando: false,
      tallerIdEditando: null,
      mostrarModal: false,
    };
  },
  async mounted() {
    this.cargarTalleres();
  },
  methods: {
    async cargarTalleres() {
      try {
        const res = await axios.get('http://localhost:3000/api/talleres');
        this.talleres = res.data;
      } catch (err) {
        console.error('Error al cargar talleres:', err);
      }
    },
    async guardarTaller() {
      try {
        if (this.editando) {
          const res = await axios.put(
            `http://localhost:3000/api/talleres/${this.tallerIdEditando}`,
            this.nuevoTaller
          );
          const index = this.talleres.findIndex((t) => t._id === this.tallerIdEditando);
          this.talleres[index] = res.data;
          this.cancelarEdicion();
        } else {
          const res = await axios.post('http://localhost:3000/api/talleres', this.nuevoTaller);
          this.talleres.push(res.data);
        }
        this.nuevoTaller = { nombre: '', direccion: '', telefono: '' };
        this.mostrarModal = false;
      } catch (err) {
        console.error('Error al guardar taller:', err);
      }
    },
    editarTaller(taller) {
      this.nuevoTaller = { ...taller };
      this.editando = true;
      this.tallerIdEditando = taller._id;
      this.mostrarModal = true;
    },
    cancelarEdicion() {
      this.nuevoTaller = { nombre: '', direccion: '', telefono: '' };
      this.editando = false;
      this.tallerIdEditando = null;
      this.mostrarModal = false;
    },
    cerrarModal() {
      this.cancelarEdicion();
    },
    async confirmarEliminarTaller(id) {
      const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este taller?');
      if (confirmar) {
        this.eliminarTaller(id);
      }
    },
    async eliminarTaller(id) {
      try {
        await axios.delete(`http://localhost:3000/api/talleres/${id}`);
        this.talleres = this.talleres.filter((t) => t._id !== id);
      } catch (err) {
        console.error('Error al eliminar taller:', err);
      }
    },
  },
};
</script>

<style scoped>
.talleres-container {
  padding: 2rem;
  color: white;
  font-family: 'Poppins', sans-serif;
}

.agregar-btn {
  background: #42b983;
  color: #fff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1rem;
  transition: background 0.2s;
}
.agregar-btn:hover {
  background: #369870;
}

.talleres-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.talleres-form h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.talleres-form input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.7rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
}

.talleres-form button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.talleres-form button:hover {
  background: #163a5f;
}

.talleres-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.talleres-table th,
.talleres-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.talleres-table th {
  background: rgba(0, 0, 0, 0.2);
}

.talleres-table tr:hover {
  background: rgba(255, 255, 255, 0.1);
}

.talleres-table button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.talleres-table button:hover {
  background: #163a5f;
}
</style>