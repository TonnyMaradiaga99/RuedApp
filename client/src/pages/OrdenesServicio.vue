<template>
  <div class="ordenes-servicio-container">
    <h1>Gestión de Órdenes de Servicio</h1>

    <button class="agregar-btn" @click="abrirModalNuevaOrden">Agregar Orden</button>

    <div class="filtros-ordenes">
      <input v-model="busqueda" placeholder="Buscar por cliente, vehículo o estado..." />
      <select v-model="filtroEstado">
        <option value="">Todos los estados</option>
        <option v-for="estado in estadosUnicos" :key="estado" :value="estado">{{ estado }}</option>
      </select>
    </div>

    <BaseModal v-if="mostrarModal" @close="cerrarModal">
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

        <label for="empleado" v-if="userRol === 'admin' || userRol === 'propietario'">Mecánico</label>
        <select
          id="empleado"
          v-model="nuevaOrden.empleadoId"
          required
          v-if="userRol === 'admin' || userRol === 'propietario'"
        >
          <option disabled value="">Seleccione un Mecánico</option>
          <option v-for="empleado in empleadosMecanicos" :key="empleado._id" :value="empleado._id">
            {{ empleado.nombre }} {{ empleado.apellido }}
          </option>
        </select>
        <!-- Si es mecánico, muestra solo su nombre -->
        <div v-else>
          <label>Mecánico</label>
          <input type="text" :value="nombreUsuario" disabled />
        </div>

        <label for="comentariosAdicionales">Comentarios Adicionales</label>
        <textarea id="comentariosAdicionales" v-model="nuevaOrden.comentariosAdicionales" placeholder="Comentarios Adicionales"></textarea>

        <label for="fotos" v-if="!editando">Adjuntar Fotos</label>
        <input
          id="fotos"
          type="file"
          multiple
          @change="onFileChange"
          v-if="!editando"
        />
        <div v-if="!editando && nuevaOrden.fotos && nuevaOrden.fotos.length">
          <img v-for="foto in nuevaOrden.fotos" :src="foto" :key="foto" style="max-width: 80px; margin: 5px;" />
        </div>

        <button type="submit">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
        <button v-if="editando" type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </BaseModal>

    <BaseModal v-if="mostrarHistorial" @close="cerrarHistorial">
      <h2>Historial de Estados</h2>
      <div v-if="ordenHistorialSeleccionada && ordenHistorialSeleccionada.historialEstados" class="historial-timeline">
        <div v-for="item in ordenHistorialSeleccionada.historialEstados" :key="item._id" class="historial-item">
          <span :class="['estado', item.estado.toLowerCase()]">{{ item.estado }}</span>
          <span class="fecha">{{ new Date(item.fecha).toLocaleString() }}</span>
          <span class="usuario">{{ item.usuario || 'Sistema' }}</span>
          <span class="comentario">{{ item.comentario }}</span>
        </div>
      </div>
      <div v-else>No hay historial disponible.</div>
    </BaseModal>

    <table class="ordenes-servicio-table">
      <thead>
        <tr>
          <th>Orden de Servicio</th>
          <th>Cliente</th>
          <th>Vehículo</th>
          <th>Empleado</th>
          <th>Fecha Ingreso</th>
          <th>Estado</th>
          <th>Fotos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="orden in ordenesFiltradas" :key="orden._id">
          <td>{{ orden._id.slice(-8) }}</td>
          <td>{{ obtenerNombreCliente(orden.clienteId) }}</td>
          <td>{{ obtenerDescripcionVehiculo(orden.vehiculoId) }}</td>
          <td>{{ obtenerNombreEmpleado(orden.empleadoId) }}</td>
          <td>{{ orden.fechaIngreso }}</td>
          <td>{{ orden.estado }}</td>
          <td>
            <div v-if="orden.historialEstados && orden.historialEstados.length">
              <img
                v-for="item in orden.historialEstados.filter(e => e.foto)"
                :src="getFotoUrl(item.foto)"
                :key="item.fecha"
                style="max-width: 50px; max-height: 50px; margin: 2px; border-radius: 4px;"
              />
            </div>
          </td>
          <td>
            <button @click="verHistorial(orden)">Ver historial</button>
            <button @click="confirmarEliminarOrden(orden._id)">Eliminar</button>
            <button @click="$router.push({ path: `/dashboard/ordenes-servicio/${orden._id}` })">Ver</button>
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
  name: 'OrdenesServicio',
  components: { BaseModal },
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
        comentariosAdicionales: '',
        fotos: [],
      },
      editando: false,
      ordenIdEditando: null,
      mostrarModal: false,
      mostrarHistorial: false,
      ordenHistorialSeleccionada: null,
      busqueda: '',
      filtroEstado: '',
    };
  },
  computed: {
    userRol() {
      return localStorage.getItem('rol');
    },
    userId() {
      return localStorage.getItem('userId');
    },
    nombreUsuario() {
      const empleado = this.empleados.find(e => e._id === this.userId);
      return empleado ? `${empleado.nombre} ${empleado.apellido}` : '';
    },
    empleadosMecanicos() {
      return this.empleados.filter(e => e.rol === 'mecanico');
    },
    ordenesFiltradas() {
      return this.ordenes.filter(orden => {
        const coincideEstado = this.filtroEstado ? orden.estado === this.filtroEstado : true;
        const texto = this.busqueda.toLowerCase();
        const clienteNombre = this.obtenerNombreCliente(orden.clienteId).toLowerCase();
        const vehiculoDesc = this.obtenerDescripcionVehiculo(orden.vehiculoId).toLowerCase();
        const coincideBusqueda =
          clienteNombre.includes(texto) ||
          vehiculoDesc.includes(texto) ||
          orden.estado?.toLowerCase().includes(texto);
        return coincideEstado && (!this.busqueda || coincideBusqueda);
      });
    },
    estadosUnicos() {
      // Devuelve los estados únicos de las órdenes
      return [...new Set(this.ordenes.map(o => o.estado))];
    }
  },
  async mounted() {
    await this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [ordenesRes, clientesRes, vehiculosRes, empleadosRes] = await Promise.all([
        axios.get('http://localhost:3000/api/ordenes-servicio', config),
        axios.get('http://localhost:3000/api/clientes'),
        axios.get('http://localhost:3000/api/vehiculos'),
        axios.get('http://localhost:3000/api/empleados'),
      ]);
      this.ordenes = ordenesRes.data.sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso));
      this.clientes = clientesRes.data;
      this.vehiculos = vehiculosRes.data;
      this.empleados = empleadosRes.data;
    },
    filtrarVehiculos() {
      this.vehiculosFiltrados = this.vehiculos.filter(
        (vehiculo) => vehiculo.clienteId === this.nuevaOrden.clienteId
      );
    },
    async guardarOrden() {
      try {
        const empleadoId = this.userRol === 'mecanico'
          ? this.userId
          : this.nuevaOrden.empleadoId;
        const ordenData = {
          clienteId: this.nuevaOrden.clienteId,
          vehiculoId: this.nuevaOrden.vehiculoId,
          empleadoId, 
          comentariosAdicionales: this.nuevaOrden.comentariosAdicionales,
          ...(this.editando ? {} : { fotos: this.nuevaOrden.fotos }),
        };

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        if (!this.editando) {
          ordenData.estado = 'Recepción';
          await axios.post('http://localhost:3000/api/ordenes-servicio', ordenData, config);
        } else {
          await axios.put(
            `http://localhost:3000/api/ordenes-servicio/${this.ordenIdEditando}`,
            ordenData,
            config
          );
        }
        await this.cargarDatos();
        this.nuevaOrden = {
          clienteId: '',
          vehiculoId: '',
          empleadoId: '',
          comentariosAdicionales: '',
          fotos: [],
        };
        this.vehiculosFiltrados = [];
        this.mostrarModal = false;
        this.editando = false;
        this.ordenIdEditando = null;
      } catch (err) {
        alert('Error al guardar orden: ' + (err.response?.data?.error || err.message));
        console.error('Error al guardar orden:', err);
      }
    },
    editarOrden(orden) {
      this.nuevaOrden = {
        clienteId: orden.clienteId,
        vehiculoId: orden.vehiculoId,
        empleadoId: orden.empleadoId,
        comentariosAdicionales: orden.comentariosAdicionales || '',
        fotos: [],
      };
      this.editando = true;
      this.ordenIdEditando = orden._id;
      this.filtrarVehiculos();
      this.mostrarModal = true;
    },
    cancelarEdicion() {
      this.nuevaOrden = {
        clienteId: '',
        vehiculoId: '',
        empleadoId: '',
        comentariosAdicionales: '',
        fotos: [],
      };
      this.editando = false;
      this.ordenIdEditando = null;
      this.vehiculosFiltrados = [];
      this.mostrarModal = false;
    },
    cerrarModal() {
      this.cancelarEdicion();
    },
    abrirModalNuevaOrden() {
      this.cancelarEdicion();
      // Si es mecánico, asigna su propio ID
      if (this.userRol === 'mecanico') {
        this.nuevaOrden.empleadoId = this.userId;
      } else {
        this.nuevaOrden.empleadoId = '';
      }
      this.mostrarModal = true;
    },
    async confirmarEliminarOrden(id) {
      const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta orden?');
      if (confirmar) {
        this.eliminarOrden(id);
      }
    },
    async eliminarOrden(id) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:3000/api/ordenes-servicio/${id}`, config);
        this.ordenes = this.ordenes.filter((orden) => orden._id !== id);
      } catch (err) {
        console.error('Error al eliminar orden:', err);
      }
    },
    obtenerNombreCliente(clienteId) {
      const cliente = this.clientes.find(c => c._id === clienteId);
      return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
    },
    obtenerDescripcionVehiculo(vehiculoId) {
      const vehiculo = this.vehiculos.find(v => v._id === vehiculoId);
      return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa})` : 'Desconocido';
    },
    obtenerNombreEmpleado(empleadoId) {
      const empleado = this.empleados.find((e) => e._id === empleadoId);
      return empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Desconocido';
    },
    async onFileChange(e) {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('foto', files[i]);
        const res = await axios.post('http://localhost:3000/api/orden-foto', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (!this.nuevaOrden.fotos) this.nuevaOrden.fotos = [];
        this.nuevaOrden.fotos.push(res.data.url);
      }
    },
    getFotoUrl(foto) {
      if (foto.startsWith('http')) return foto;
      return `http://localhost:3000${foto}`;
    },
    verHistorial(orden) {
      this.ordenHistorialSeleccionada = orden;
      this.mostrarHistorial = true;
    },
    cerrarHistorial() {
      this.ordenHistorialSeleccionada = null;
      this.mostrarHistorial = false;
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

.filtros-ordenes {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filtros-ordenes input,
.filtros-ordenes select {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
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

.historial-timeline {
  margin: 1rem 0;
  border-left: 3px solid #42b983;
  padding-left: 1rem;
}
.historial-item {
  margin-bottom: 1rem;
  position: relative;
}
.estado {
  font-weight: bold;
  margin-right: 1rem;
}
.estado.entregado { color: #42b983; }
.estado.cancelado { color: #e74c3c; }
.estado.en-reparacion { color: #f1c40f; }
.fecha, .usuario, .comentario {
  display: inline-block;
  margin-right: 1rem;
  color: #ccc;
}
</style>