<template>
  <div class="vehiculos-container">
    <h1>Gestión de Vehículos</h1>

    <button class="agregar-btn" @click="abrirModalNuevoVehiculo">Agregar Vehículo</button>

    <BaseModal v-if="mostrarModal" @close="cerrarModal">
      <form class="vehiculos-form" @submit.prevent="guardarVehiculo">
        <h2>{{ editando ? 'Editar Vehículo' : 'Agregar Vehículo' }}</h2>
        <select v-model="nuevoVehiculo.clienteId" required>
          <option disabled value="">Seleccione un Cliente</option>
          <option v-for="cliente in clientes" :key="cliente._id" :value="cliente._id">
            {{ cliente.nombre }} {{ cliente.apellido }}
          </option>
        </select>
        <input v-model="nuevoVehiculo.marca" type="text" placeholder="Marca" required />
        <input v-model="nuevoVehiculo.modelo" type="text" placeholder="Modelo" required />
        <input v-model="nuevoVehiculo.año" type="number" placeholder="Año" min="1900" max="2100" />
        <input v-model="nuevoVehiculo.placa" type="text" placeholder="Placa" />
        <input v-model="nuevoVehiculo.color" type="text" placeholder="Color" />
        <input v-model="nuevoVehiculo.kilometraje" type="number" placeholder="Kilometraje" min="0" />
        <input v-model="nuevoVehiculo.VIN" type="text" placeholder="VIN" />
        <button type="submit">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
        <button v-if="editando" type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </BaseModal>

    <table class="vehiculos-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Placa</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vehiculo in vehiculos" :key="vehiculo._id">
          <td>{{ obtenerNombreCliente(vehiculo.clienteId) }}</td>
          <td>{{ vehiculo.marca }}</td>
          <td>{{ vehiculo.modelo }}</td>
          <td>{{ vehiculo.año }}</td>
          <td>{{ vehiculo.placa }}</td>
          <td>
            <button @click="editarVehiculo(vehiculo)">Editar</button>
            <button @click="confirmarEliminarVehiculo(vehiculo._id)">Eliminar</button>
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
  name: 'VehiculosPage',
  components: { BaseModal },
  data() {
    return {
      vehiculos: [],
      clientes: [],
      nuevoVehiculo: {
        clienteId: '',
        marca: '',
        modelo: '',
        año: null,
        placa: '',
        color: '',
        kilometraje: null,
        VIN: '',
      },
      editando: false,
      vehiculoIdEditando: null,
      mostrarModal: false,
    };
  },
  async mounted() {
    await this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      try {
        const [vehiculosRes, clientesRes] = await Promise.all([
          axios.get('http://localhost:3000/api/vehiculos'),
          axios.get('http://localhost:3000/api/clientes'),
        ]);
        this.vehiculos = vehiculosRes.data;
        this.clientes = clientesRes.data;
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    },
    async guardarVehiculo() {
      try {
        if (this.editando) {
          const res = await axios.put(
            `http://localhost:3000/api/vehiculos/${this.vehiculoIdEditando}`,
            this.nuevoVehiculo
          );
          const index = this.vehiculos.findIndex((v) => v._id === this.vehiculoIdEditando);
          this.vehiculos[index] = res.data;
          this.cancelarEdicion();
        } else {
          const res = await axios.post('http://localhost:3000/api/vehiculos', this.nuevoVehiculo);
          this.vehiculos.push(res.data);
        }
        this.nuevoVehiculo = {
          clienteId: '',
          marca: '',
          modelo: '',
          año: null,
          placa: '',
          color: '',
          kilometraje: null,
          VIN: '',
        };
        this.mostrarModal = false;
      } catch (err) {
        console.error('Error al guardar vehículo:', err);
      }
    },
    editarVehiculo(vehiculo) {
      this.nuevoVehiculo = { ...vehiculo };
      this.editando = true;
      this.vehiculoIdEditando = vehiculo._id;
      this.mostrarModal = true;
    },
    cancelarEdicion() {
      this.nuevoVehiculo = {
        clienteId: '',
        marca: '',
        modelo: '',
        año: null,
        placa: '',
        color: '',
        kilometraje: null,
        VIN: '',
      };
      this.editando = false;
      this.vehiculoIdEditando = null;
      this.mostrarModal = false;
    },
    cerrarModal() {
      this.cancelarEdicion();
    },
    async confirmarEliminarVehiculo(id) {
      const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este vehículo?');
      if (confirmar) {
        this.eliminarVehiculo(id);
      }
    },
    async eliminarVehiculo(id) {
      try {
        await axios.delete(`http://localhost:3000/api/vehiculos/${id}`);
        this.vehiculos = this.vehiculos.filter((v) => v._id !== id);
      } catch (err) {
        console.error('Error al eliminar vehículo:', err);
      }
    },
    obtenerNombreCliente(clienteId) {
      const cliente = this.clientes.find((c) => c._id === clienteId);
      return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
    },
    abrirModalNuevoVehiculo() {
      this.cancelarEdicion();
      this.mostrarModal = true;
    },
  },
};
</script>

<style scoped>
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

.vehiculos-container {
  padding: 2rem;
  color: white;
  font-family: 'Poppins', sans-serif;
}

.vehiculos-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.vehiculos-form h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.vehiculos-form input,
.vehiculos-form select {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.7rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
}

.vehiculos-form button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.vehiculos-form button:hover {
  background: #163a5f;
}

.vehiculos-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.vehiculos-table th,
.vehiculos-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.vehiculos-table th {
  background: rgba(0, 0, 0, 0.2);
}

.vehiculos-table tr:hover {
  background: rgba(255, 255, 255, 0.1);
}

.vehiculos-table button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.vehiculos-table button:hover {
  background: #163a5f;
}
</style>