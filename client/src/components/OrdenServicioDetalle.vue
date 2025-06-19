<template>
  <div class="detalle-orden-container" v-if="orden">
    <button class="cerrar-detalle-btn" @click="$router.push('/dashboard/ordenes-servicio')">
      ← Volver a Órdenes de Servicio
    </button>
    <h2>Orden de Servicio #{{ orden._id.slice(-8) }}</h2>
    <div class="detalle-campos">
      <div>
        <label>Cliente:</label>
        <span>{{ obtenerNombreCliente(orden.clienteId) }}</span>
      </div>
      <div>
        <label>Vehículo:</label>
        <span>{{ obtenerDescripcionVehiculo(orden.vehiculoId) }}</span>
      </div>
      <div>
        <label>Empleado:</label>
        <span>{{ obtenerNombreEmpleado(orden.empleadoId) }}</span>
      </div>
      <div>
        <label>Estado actual:</label>
        <span :class="['estado', orden.estado.toLowerCase().replace(/\s/g, '-')]">{{ orden.estado }}</span>
      </div>
    </div>

    <h3>Bitácora de Estados</h3>
    <div class="historial-timeline">
      <div v-for="item in orden.historialEstados" :key="item.fecha" class="historial-item">
        <div class="historial-header">
          <span
            :class="['estado', item.estado.toLowerCase().replace(/\s/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')]"
          >
            {{ item.estado }}
          </span>
          <span class="fecha">{{ new Date(item.fecha).toLocaleString() }}</span>
        </div>
        <div class="historial-body">
          <span class="comentario"><strong>Comentario:</strong> {{ item.comentario }}</span>
          <div v-if="item.foto" class="historial-foto">
            <img :src="getFotoUrl(item.foto)" alt="Foto del estado" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="puedeAvanzarEstado" class="avance-estado-form">
      <h3>Avanzar al siguiente estado</h3>
      <form @submit.prevent="avanzarEstado">
        <label>Nuevo estado:</label>
        <input type="text" :value="siguienteEstado" disabled />
        <label>Comentario <span style="color:red">*</span>:</label>
        <textarea v-model="comentarioEstado" required></textarea>
        <label>Foto (opcional):</label>
        <input type="file" @change="onFileChange" />
        <button type="submit" :disabled="cargandoAvance">Guardar y avanzar</button>
      </form>
    </div>

    <div v-if="orden.estado !== 'Finalizado' && orden.estado !== 'Cancelado'" class="cancelar-orden">
      <button @click="cancelarOrden" style="background:#e74c3c; color:white; border:none; border-radius:5px; padding:0.7rem 1.5rem; margin-top:1rem;">
        Cancelar orden
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      orden: null,
      clientes: [],
      vehiculos: [],
      empleados: [],
      comentarioEstado: '',
      fotoEstado: null,
      cargandoAvance: false,
      estados: [
        'Recepción',
        'Diagnóstico',
        'Aprobación de presupuesto',
        'En reparación',
        'Listo para entrega',
        'Entregado',
        'Finalizado',
        'Cancelado'
      ]
    };
  },
  computed: {
    puedeAvanzarEstado() {
      const idx = this.estados.indexOf(this.orden?.estado);
      return idx >= 0 && idx < this.estados.length - 2; // No permite avanzar desde Finalizado/Cancelado
    },
    siguienteEstado() {
      const idx = this.estados.indexOf(this.orden?.estado);
      return idx >= 0 && idx < this.estados.length - 1 ? this.estados[idx + 1] : '';
    }
  },
  async created() {
    await this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      const [ordenRes, clientesRes, vehiculosRes, empleadosRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/ordenes-servicio/${this.id}`),
        axios.get('http://localhost:3000/api/clientes'),
        axios.get('http://localhost:3000/api/vehiculos'),
        axios.get('http://localhost:3000/api/empleados'),
      ]);
      this.orden = ordenRes.data; 
      this.clientes = clientesRes.data;
      this.vehiculos = vehiculosRes.data;
      this.empleados = empleadosRes.data;
    },
    obtenerNombreCliente(clienteId) {
      const cliente = this.clientes.find(c => c._id === clienteId);
      return cliente ? `${cliente.nombre} ${cliente.apellido}` : clienteId;
    },
    obtenerDescripcionVehiculo(vehiculoId) {
      const vehiculo = this.vehiculos.find(v => v._id === vehiculoId);
      return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placa}` : vehiculoId;
    },
    obtenerNombreEmpleado(empleadoId) {
      const empleado = this.empleados.find(e => e._id === empleadoId);
      return empleado ? `${empleado.nombre} ${empleado.apellido}` : empleadoId;
    },
    onFileChange(e) {
      this.fotoEstado = e.target.files[0] || null;
    },
    getFotoUrl(foto) {
      if (!foto) return '';
      if (foto.startsWith('http')) return foto;
      return `http://localhost:3000${foto}`;
    },
    async avanzarEstado() {
      if (!this.comentarioEstado.trim()) {
        alert('El comentario es obligatorio.');
        return;
      }
      if (this.cargandoAvance) return;
      this.cargandoAvance = true;
      try {
        let fotoUrl = null;
        if (this.fotoEstado) {
          const formData = new FormData();
          formData.append('foto', this.fotoEstado);
          const res = await axios.post('http://localhost:3000/api/orden-foto', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          fotoUrl = res.data.url;
        }
        await axios.put(`http://localhost:3000/api/ordenes-servicio/${this.orden._id}`, {
          estado: this.siguienteEstado,
          comentarioEstado: this.comentarioEstado,
          fotoEstado: fotoUrl,
          usuario: localStorage.getItem('userId')
        });
        this.comentarioEstado = '';
        this.fotoEstado = null;
        await this.cargarDatos(); // Refresca la orden y el historial
      } catch (err) {
        alert('Error al avanzar estado: ' + (err.response?.data?.error || err.message));
      } finally {
        this.cargandoAvance = false;
      }
    },
    async cancelarOrden() {
      const comentario = prompt('¿Por qué se cancela la orden? (motivo)');
      if (!comentario) return;
      await axios.put(`http://localhost:3000/api/ordenes-servicio/${this.orden._id}`, {
        estado: 'Cancelado',
        comentarioEstado: comentario,
        fotoEstado: null
      });
      await this.cargarDatos();
      alert('Orden cancelada');
    }
  }
};
</script>

<style scoped>
.detalle-orden-container {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  color: #222;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}
.cerrar-detalle-btn {
  background: #1e3c72;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: background 0.2s;
}
.cerrar-detalle-btn:hover {
  background: #163a5f;
}
.detalle-campos {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  align-items: center;
}
.detalle-campos > div {
  display: flex;
  flex-direction: column;
}
.estado {
  padding: 0.2rem 0.7rem;
  border-radius: 3px;
  font-size: 1rem;
  color: #fff;
  font-weight: bold;
}
.estado.recepcion { background: #f59e0b; }
.estado.diagnostico { background: #3b82f6; }
.estado.aprobacion { background: #10b981; }
.estado.aprobacion-de-presupuesto { background: #059669; } /* verde oscuro */
.estado.en-reparacion { background: #3f83f8; }
.estado.listo-para-entrega { background: #4ade80; }
.estado.entregado { background: #34d399; }
.estado.finalizado { background: #6ee7b7; }
.estado.cancelado { background: #f87171; }

.historial-timeline {
  border-left: 3px solid #42b983;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
}
.historial-item {
  margin-bottom: 2rem;
  position: relative;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.historial-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.historial-body {
  margin-left: 1.5rem;
}
.historial-foto img {
  max-width: 120px;
  border-radius: 6px;
  margin-top: 0.5rem;
}
.avance-estado-form {
  margin-top: 2rem;
  background: #e0e7ff;
  padding: 1.5rem;
  border-radius: 8px;
}
.avance-estado-form textarea {
  width: 100%;
  min-height: 60px;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 0.5rem;
}
.avance-estado-form button {
  background: #1e3c72;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.avance-estado-form button:hover {
  background: #163a5f;
}
.cancelar-orden {
  margin-top: 2rem;
  text-align: center;
}
</style>