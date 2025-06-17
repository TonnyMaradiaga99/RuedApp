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
        <label>Estado actual:</label>
        <select v-model="orden.estado" @change="onEstadoChange" class="select-estado">
          <option v-for="op in estados" :key="op" :value="op">{{ op }}</option>
        </select>
      </div>
    </div>
    <div v-if="orden.estado === 'Aprobación de presupuesto'" class="presupuesto-campos">
      <label>Monto estimado:</label>
      <input v-model.number="montoPresupuesto" type="number" class="input-presupuesto" />
      <label>Comentario:</label>
      <textarea v-model="comentarioPresupuesto" class="input-presupuesto"></textarea>
      <button @click="guardarPresupuesto">Guardar presupuesto</button>
    </div>
    <div>
      <h3>Imágenes</h3>
      <div v-if="orden.fotos && orden.fotos.length">
        <img v-for="foto in orden.fotos" :src="getFotoUrl(foto)" :key="foto" style="max-width: 80px; margin: 5px;" />
      </div>
      <!-- Botón para subir nuevas imágenes -->
    </div>
    <div>
      <h3>Bitácora / Historial</h3>
      <ul>
        <li v-for="evento in orden.historialEstados" :key="evento.fecha">
          <strong>{{ evento.estado }}</strong> - {{ new Date(evento.fecha).toLocaleString() }}
          <span v-if="evento.comentario">({{ evento.comentario }})</span>
          <span v-if="evento.montoPresupuesto"> - L {{ evento.montoPresupuesto }}</span>
        </li>
      </ul>
    </div>
    <button @click="guardarCambios">Guardar Cambios</button>

    <BaseModal v-if="mostrarDetalle" @close="cerrarDetalle">
      <div class="detalle-orden">
        <h2>Detalle de Orden</h2>
        <p><strong>Cliente:</strong> {{ obtenerNombreCliente(orden.clienteId) }}</p>
        <p><strong>Vehículo:</strong> {{ obtenerDescripcionVehiculo(orden.vehiculoId) }}</p>
        <p><strong>Empleado:</strong> {{ obtenerNombreEmpleado(orden.empleadoId) }}</p>
        <p><strong>Estado:</strong> <span :class="['estado', orden.estado.toLowerCase()]">{{ orden.estado }}</span></p>
        <div class="fotos">
          <img v-for="foto in orden.fotos" :src="getFotoUrl(foto)" :key="foto" class="foto-grande" />
        </div>
        <div>
          <h3>Historial de Estados</h3>
          <!-- Aquí el timeline del historial -->
          <div class="historial-timeline">
            <div v-for="item in orden.historial" :key="item._id" class="historial-item">
              <span :class="['estado', item.estado.toLowerCase()]">{{ item.estado }}</span>
              <span class="fecha">{{ new Date(item.fecha).toLocaleString() }}</span>
              <span class="usuario">{{ item.usuario || 'Sistema' }}</span>
              <span class="comentario">{{ item.comentario }}</span>
            </div>
          </div>
        </div>
        <div v-if="puedeActualizarEstado(orden.estado)">
          <button @click="actualizarEstado('Entregado')">Marcar como Entregado</button>
          <button @click="actualizarEstado('Cancelado')">Cancelar</button>
          <!-- Otros estados según lógica -->
        </div>
      </div>
    </BaseModal>
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
      estados: [
        'Recepción',
        'Diagnóstico',
        'Aprobación de presupuesto',
        'En reparación',
        'Listo para entrega',
        'Entregado',
        'Finalizado',
        'Cancelado'
      ],
      montoPresupuesto: null,
      comentarioPresupuesto: '',
      mostrarDetalle: false
    };
  },
  async created() {
    const [ordenRes, clientesRes, vehiculosRes] = await Promise.all([
      axios.get(`http://localhost:3000/api/ordenes-servicio/${this.id}`),
      axios.get('http://localhost:3000/api/clientes'),
      axios.get('http://localhost:3000/api/vehiculos')
    ]);
    this.orden = ordenRes.data;
    this.clientes = clientesRes.data;
    this.vehiculos = vehiculosRes.data;
    this.montoPresupuesto = this.orden.montoPresupuesto || null;
  },
  methods: {
    obtenerNombreCliente(clienteId) {
      const cliente = this.clientes?.find(c => c._id === clienteId);
      return cliente ? `${cliente.nombre} ${cliente.apellido}` : clienteId;
    },
    obtenerDescripcionVehiculo(vehiculoId) {
      const vehiculo = this.vehiculos?.find(v => v._id === vehiculoId);
      return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placa}` : vehiculoId;
    },
    onEstadoChange() {
      // Si cambia a presupuesto, puedes mostrar el input
    },
    async recargarOrden() {
      const res = await axios.get(`http://localhost:3000/api/ordenes-servicio/${this.orden._id}`);
      this.orden = res.data;
      this.montoPresupuesto = this.orden.montoPresupuesto || null;
    },
    async guardarPresupuesto() {
      await axios.put(`http://localhost:3000/api/ordenes-servicio/${this.orden._id}`, {
        estado: 'Aprobación de presupuesto',
        montoPresupuesto: this.montoPresupuesto,
        comentarioEstado: this.comentarioPresupuesto
      });
      await this.recargarOrden();
      this.comentarioPresupuesto = '';
      alert('Presupuesto guardado');
    },
    async guardarCambios() {
      try {
        // Recarga la orden antes de guardar para obtener el estado actual del backend
        const resActual = await axios.get(`http://localhost:3000/api/ordenes-servicio/${this.orden._id}`);
        const estadoOriginal = resActual.data.estado;

        // Prepara el payload
        const payload = {
          clienteId: this.orden.clienteId,
          vehiculoId: this.orden.vehiculoId,
          empleadoId: this.orden.empleadoId,
          fechaIngreso: this.orden.fechaIngreso,
          fechaEstimadaEntrega: this.orden.fechaEstimadaEntrega,
          estado: this.orden.estado,
          diagnostico: this.orden.diagnostico,
          trabajosRealizados: this.orden.trabajosRealizados,
          comentariosAdicionales: this.orden.comentariosAdicionales,
          fotos: this.orden.fotos,
        };

        // Si el estado cambió, pide un comentario y agrégalo
        if (this.orden.estado !== estadoOriginal) {
          const comentario = prompt('Agrega un comentario para el cambio de estado:', '');
          payload.comentarioEstado = comentario || '';
        }

        await axios.put(
          `http://localhost:3000/api/ordenes-servicio/${this.orden._id}`,
          payload
        );
        await this.recargarOrden();
        alert('Cambios guardados correctamente');
      } catch (err) {
        alert('Error al guardar cambios');
        console.error(err);
      }
    },
    getFotoUrl(foto) {
      if (foto.startsWith('http')) return foto;
      return `http://localhost:3000${foto}`;
    },
    cerrarDetalle() {
      this.mostrarDetalle = false;
    },
    puedeActualizarEstado(estado) {
      const estadosEditables = ['En reparación', 'Listo para entrega'];
      return estadosEditables.includes(estado);
    },
    async actualizarEstado(nuevoEstado) {
      const comentario = prompt('Comentario para el cambio de estado:', '');
      if (comentario !== null) {
        await axios.put(`http://localhost:3000/api/ordenes-servicio/${this.orden._id}`, {
          estado: nuevoEstado,
          comentarioEstado: comentario
        });
        await this.recargarOrden();
        this.mostrarDetalle = false;
        alert('Estado actualizado a ' + nuevoEstado);
      }
    }
  }
};
</script>

<style scoped>
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
.detalle-orden-container button {
  background: #1e3c72;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
}
.detalle-orden-container button:hover {
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
.select-estado {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 1px solid #1e3c72;
  font-size: 1rem;
  margin-top: 0.3rem;
}
.presupuesto-campos {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.input-presupuesto {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 1px solid #1e3c72;
  font-size: 1rem;
  margin-top: 0.3rem;
}
.detalle-orden {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.fotos {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}
.foto-grande {
  max-width: 100%;
  border-radius: 5px;
}
.historial-timeline {
  border-left: 2px solid #1e3c72;
  padding-left: 1.5rem;
  margin: 1rem 0;
}
.historial-item {
  margin-bottom: 1rem;
}
.historial-item .estado {
  font-weight: bold;
}
.historial-item .fecha {
  font-size: 0.9rem;
  color: #666;
}
.historial-item .usuario {
  font-style: italic;
  color: #333;
}
.historial-item .comentario {
  margin-top: 0.2rem;
}
.estado {
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.9rem;
  color: #fff;
}
.estado.recepcion {
  background: #f59e0b;
}
.estado.diagnostico {
  background: #3b82f6;
}
.estado.aprobacion {
  background: #10b981;
}
.estado.en-reparacion {
  background: #3f83f8;
}
.estado.listo {
  background: #4ade80;
}
.estado.entregado {
  background: #34d399;
}
.estado.finalizado {
  background: #6ee7b7;
}
.estado.cancelado {
  background: #f87171;
}
</style>