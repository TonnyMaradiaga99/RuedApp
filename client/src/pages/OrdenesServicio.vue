<template>
  <div class="ordenes-servicio-container">
    <h1>Gestión de Órdenes de Servicio</h1>

    <!-- Formulario para agregar o editar órdenes -->
    <form class="ordenes-servicio-form" @submit.prevent="guardarOrden">
      <h2>{{ editando ? 'Editar Orden' : 'Agregar Orden' }}</h2>
      <label for="cliente">Cliente</label>
      <select id="cliente" v-model="nuevaOrden.clienteId" @change="filtrarVehiculos" required>
        <option disabled value="">Seleccione un Cliente</option>
        <option v-for="cliente in clientes" :key="cliente._id" :value="cliente._id">
          {{ cliente.nombre }} {{ cliente.apellido }}
        </option>
      </select>

      <label for="vehiculo">Vehículo</label>
      <select id="vehiculo" v-model="nuevaOrden.vehiculoId" required>
        <option disabled value="">Seleccione un Vehículo</option>
        <option v-for="vehiculo in vehiculosFiltrados" :key="vehiculo._id" :value="vehiculo._id">
          {{ vehiculo.marca }} {{ vehiculo.modelo }} - {{ vehiculo.placa }}
        </option>
      </select>

      <label for="empleado">Empleado</label>
      <select id="empleado" v-model="nuevaOrden.empleadoId" required>
        <option disabled value="">Seleccione un Empleado</option>
        <option v-for="empleado in empleados" :key="empleado._id" :value="empleado._id">
          {{ empleado.nombre }} {{ empleado.apellido }}
        </option>
      </select>

      <label for="fechaIngreso">Fecha de Ingreso</label>
      <input id="fechaIngreso" v-model="nuevaOrden.fechaIngreso" type="date" required />

      <label for="fechaEstimadaEntrega">Fecha Estimada de Entrega</label>
      <input id="fechaEstimadaEntrega" v-model="nuevaOrden.fechaEstimadaEntrega" type="date" />

      <label for="estado">Estado</label>
      <input id="estado" v-model="nuevaOrden.estado" type="text" placeholder="Estado" />

      <label for="diagnostico">Diagnóstico</label>
      <textarea id="diagnostico" v-model="nuevaOrden.diagnostico" placeholder="Diagnóstico"></textarea>

      <label for="trabajosRealizados">Trabajos Realizados</label>
      <textarea id="trabajosRealizados" v-model="nuevaOrden.trabajosRealizados" placeholder="Trabajos Realizados"></textarea>

      <label for="comentariosAdicionales">Comentarios Adicionales</label>
      <textarea id="comentariosAdicionales" v-model="nuevaOrden.comentariosAdicionales" placeholder="Comentarios Adicionales"></textarea>

      <button type="submit">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
      <button v-if="editando" type="button" @click="cancelarEdicion">Cancelar</button>
    </form>

    <!-- Tabla para listar órdenes -->
    <table class="ordenes-servicio-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Vehículo</th>
          <th>Empleado</th>
          <th>Fecha Ingreso</th>
          <th>Fecha Estimada de Entrega</th>
          <th>Estado</th>
          <th>Diagnóstico</th>
          <th>Trabajos Realizados</th>
          <th>Comentarios Adicionales</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="orden in ordenes" :key="orden._id">
          <td>{{ obtenerNombreCliente(orden.clienteId) }}</td>
          <td>{{ obtenerDescripcionVehiculo(orden.vehiculoId) }}</td>
          <td>{{ obtenerNombreEmpleado(orden.empleadoId) }}</td>
          <td>{{ orden.fechaIngreso }}</td>
          <td>{{ orden.fechaEstimadaEntrega }}</td>
          <td>{{ orden.estado }}</td>
          <td>{{ orden.diagnostico }}</td>
          <td>{{ orden.trabajosRealizados }}</td>
          <td>{{ orden.comentariosAdicionales }}</td>
          <td>
            <button @click="editarOrden(orden)">Editar</button>
            <button @click="confirmarEliminarOrden(orden._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OrdenesServicio',
  data() {
    return {
      ordenes: [],
      clientes: [],
      vehiculos: [],
      vehiculosFiltrados: [],
      empleados: [],
      nuevaOrden: {
        clienteId: '',
        vehiculoId: '',
        empleadoId: '',
        fechaIngreso: '',
        fechaEstimadaEntrega: '',
        estado: '',
        diagnostico: '',
        trabajosRealizados: '',
        comentariosAdicionales: '',
      },
      editando: false,
      ordenIdEditando: null,
    };
  },
  async mounted() {
    await this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      try {
        const [ordenesRes, clientesRes, vehiculosRes, empleadosRes] = await Promise.all([
          axios.get('http://localhost:3000/api/ordenes-servicio'),
          axios.get('http://localhost:3000/api/clientes'),
          axios.get('http://localhost:3000/api/vehiculos'),
          axios.get('http://localhost:3000/api/empleados'),
        ]);
        this.ordenes = ordenesRes.data;
        this.clientes = clientesRes.data;
        this.vehiculos = vehiculosRes.data;
        this.empleados = empleadosRes.data;
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    },
    filtrarVehiculos() {
      this.vehiculosFiltrados = this.vehiculos.filter(
        (vehiculo) => vehiculo.clienteId === this.nuevaOrden.clienteId
      );
    },
    async guardarOrden() {
      try {
        if (this.editando) {
          const res = await axios.put(
            `http://localhost:3000/api/ordenes-servicio/${this.ordenIdEditando}`,
            this.nuevaOrden
          );
          const index = this.ordenes.findIndex((orden) => orden._id === this.ordenIdEditando);
          this.ordenes[index] = res.data;
          this.cancelarEdicion();
        } else {
          const res = await axios.post('http://localhost:3000/api/ordenes-servicio', this.nuevaOrden);
          this.ordenes.push(res.data);
        }
        this.nuevaOrden = {
          clienteId: '',
          vehiculoId: '',
          empleadoId: '',
          fechaIngreso: '',
          fechaEstimadaEntrega: '',
          estado: '',
          diagnostico: '',
          trabajosRealizados: '',
          comentariosAdicionales: '',
        };
        this.vehiculosFiltrados = [];
      } catch (err) {
        console.error('Error al guardar orden:', err);
      }
    },
    editarOrden(orden) {
      this.nuevaOrden = {
        ...orden,
        fechaIngreso: orden.fechaIngreso ? orden.fechaIngreso.split('T')[0] : '',
        fechaEstimadaEntrega: orden.fechaEstimadaEntrega ? orden.fechaEstimadaEntrega.split('T')[0] : '',
      };
      this.editando = true;
      this.ordenIdEditando = orden._id;
      this.filtrarVehiculos();
    },
    cancelarEdicion() {
      this.nuevaOrden = {
        clienteId: '',
        vehiculoId: '',
        empleadoId: '',
        fechaIngreso: '',
        fechaEstimadaEntrega: '',
        estado: '',
        diagnostico: '',
        trabajosRealizados: '',
        comentariosAdicionales: '',
      };
      this.editando = false;
      this.ordenIdEditando = null;
      this.vehiculosFiltrados = [];
    },
    async confirmarEliminarOrden(id) {
      const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta orden?');
      if (confirmar) {
        this.eliminarOrden(id);
      }
    },
    async eliminarOrden(id) {
      try {
        await axios.delete(`http://localhost:3000/api/ordenes-servicio/${id}`);
        this.ordenes = this.ordenes.filter((orden) => orden._id !== id);
      } catch (err) {
        console.error('Error al eliminar orden:', err);
      }
    },
    obtenerNombreCliente(clienteId) {
      const cliente = this.clientes.find((c) => c._id === clienteId);
      return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
    },
    obtenerDescripcionVehiculo(vehiculoId) {
      const vehiculo = this.vehiculos.find((v) => v._id === vehiculoId);
      return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'Desconocido';
    },
    obtenerNombreEmpleado(empleadoId) {
      const empleado = this.empleados.find((e) => e._id === empleadoId);
      return empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Desconocido';
    },
  },
};
</script>

<style scoped>
/* Estilos similares a Inventario.vue */
.ordenes-servicio-container {
  padding: 2rem;
  color: white;
  font-family: 'Poppins', sans-serif;
}

.ordenes-servicio-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.ordenes-servicio-form h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.ordenes-servicio-form input,
.ordenes-servicio-form select,
.ordenes-servicio-form textarea {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.7rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
}

.ordenes-servicio-form button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.ordenes-servicio-form button:hover {
  background: #163a5f;
}

.ordenes-servicio-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.ordenes-servicio-table th,
.ordenes-servicio-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.ordenes-servicio-table th {
  background: rgba(0, 0, 0, 0.2);
}

.ordenes-servicio-table tr:hover {
  background: rgba(255, 255, 255, 0.1);
}

.ordenes-servicio-table button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.ordenes-servicio-table button:hover {
  background: #163a5f;
}
</style>