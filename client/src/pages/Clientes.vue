<template>
  <div class="clientes-container">
    <h1>Gestión de Clientes</h1>

    <!-- Formulario para agregar o editar clientes -->
    <form class="clientes-form" @submit.prevent="guardarCliente">
      <h2>{{ editando ? 'Editar Cliente' : 'Agregar Cliente' }}</h2>
      <input v-model="nuevoCliente.nombre" type="text" placeholder="Nombre" required />
      <input v-model="nuevoCliente.apellido" type="text" placeholder="Apellido" required />
      <input v-model="nuevoCliente.email" type="email" placeholder="Correo Electrónico" required />
      <input v-model="nuevoCliente.telefono" type="text" placeholder="Teléfono" />
      <input v-model="nuevoCliente.direccion" type="text" placeholder="Dirección" />
      <button type="submit">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
      <button v-if="editando" type="button" @click="cancelarEdicion">Cancelar</button>
    </form>

    <!-- Tabla para listar clientes -->
    <table class="clientes-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Teléfono</th>
          <th>Dirección</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientes" :key="cliente._id">
          <td>{{ cliente.nombre }}</td>
          <td>{{ cliente.apellido }}</td>
          <td>{{ cliente.email }}</td>
          <td>{{ cliente.telefono }}</td>
          <td>{{ cliente.direccion }}</td>
          <td>
            <button @click="editarCliente(cliente)">Editar</button>
            <button @click="confirmarEliminarCliente(cliente._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClientesPage',
  data() {
    return {
      clientes: [],
      nuevoCliente: {
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
      },
      editando: false, // Bandera para saber si estamos editando
      clienteIdEditando: null, // ID del cliente que se está editando
    };
  },
  async mounted() {
    // Cargar clientes al montar el componente
    this.cargarClientes();
  },
  methods: {
    async cargarClientes() {
      try {
        const res = await axios.get('http://localhost:3000/api/clientes');
        this.clientes = res.data;
      } catch (err) {
        console.error('Error al cargar clientes:', err);
      }
    },
    async guardarCliente() {
      try {
        if (this.editando) {
          // Actualizar cliente existente
          const res = await axios.put(
            `http://localhost:3000/api/clientes/${this.clienteIdEditando}`,
            this.nuevoCliente
          );
          // Actualizar la lista de clientes
          const index = this.clientes.findIndex((c) => c._id === this.clienteIdEditando);
          this.clientes[index] = res.data;
          this.cancelarEdicion();
        } else {
          // Crear cliente nuevo
          const res = await axios.post('http://localhost:3000/api/clientes', this.nuevoCliente);
          this.clientes.push(res.data); // Agregar el nuevo cliente a la lista
        }
        // Limpiar el formulario
        this.nuevoCliente = { nombre: '', apellido: '', email: '', telefono: '', direccion: '' };
      } catch (err) {
        console.error('Error al guardar cliente:', err);
      }
    },
    editarCliente(cliente) {
      // Llenar el formulario con los datos del cliente para editar
      this.nuevoCliente = { ...cliente };
      this.editando = true;
      this.clienteIdEditando = cliente._id;
    },
    cancelarEdicion() {
      // Limpiar el formulario y cancelar la edición
      this.nuevoCliente = { nombre: '', apellido: '', email: '', telefono: '', direccion: '' };
      this.editando = false;
      this.clienteIdEditando = null;
    },
    async confirmarEliminarCliente(id) {
      // Mostrar confirmación antes de eliminar
      const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
      if (confirmar) {
        this.eliminarCliente(id);
      }
    },
    async eliminarCliente(id) {
      try {
        await axios.delete(`http://localhost:3000/api/clientes/${id}`);
        this.clientes = this.clientes.filter((cliente) => cliente._id !== id); // Eliminar cliente de la lista
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
      }
    },
  },
};
</script>

<style scoped>
.clientes-container {
  padding: 2rem;
  color: white;
  font-family: 'Poppins', sans-serif;
}

/* Estilo del formulario */
.clientes-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.clientes-form h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.clientes-form input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.7rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
}

.clientes-form button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.clientes-form button:hover {
  background: #163a5f;
}

/* Estilo de la tabla */
.clientes-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.clientes-table th,
.clientes-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.clientes-table th {
  background: rgba(0, 0, 0, 0.2);
}

.clientes-table tr:hover {
  background: rgba(255, 255, 255, 0.1);
}

.clientes-table button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.clientes-table button:hover {
  background: #163a5f;
}
</style>