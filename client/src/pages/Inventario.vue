<template>
  <div class="inventario-container">
    <h1>Gestión de Inventario</h1>

    <button class="agregar-btn" @click="mostrarModal = true">Agregar Item</button>

    <BaseModal v-if="mostrarModal" @close="cerrarModal">
      <form class="inventario-form" @submit.prevent="guardarItem">
        <h2>{{ editando ? 'Editar Item' : 'Agregar Item' }}</h2>
        <input v-model="nuevoItem.nombre" type="text" placeholder="Nombre del Item" required />
        <textarea v-model="nuevoItem.descripcion" placeholder="Descripción"></textarea>
        <input v-model.number="nuevoItem.stock" type="number" placeholder="Stock" min="0" required />
        <input v-model.number="nuevoItem.precio" type="number" placeholder="Precio" min="0" step="0.01" required />
        <input v-model="nuevoItem.proveedor" type="text" placeholder="Proveedor" />
        <button type="submit">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
        <button v-if="editando" type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </BaseModal>

    <table class="inventario-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Proveedor</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in inventario" :key="item._id">
          <td>{{ item.nombre }}</td>
          <td>{{ item.descripcion }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ formatoMoneda(item.precio) }}</td>
          <td>{{ item.proveedor }}</td>
          <td>
            <button @click="editarItem(item)">Editar</button>
            <button @click="confirmarEliminarItem(item._id)">Eliminar</button>
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
  name: 'InventarioPage',
  components: { BaseModal },
  data() {
    return {
      inventario: [],
      nuevoItem: {
        nombre: '',
        descripcion: '',
        stock: null,
        precio: null,
        proveedor: '',
      },
      editando: false,
      itemIdEditando: null,
      mostrarModal: false,
    };
  },
  async mounted() {
    this.cargarInventario();
  },
  methods: {
    async cargarInventario() {
      try {
        const res = await axios.get('http://localhost:3000/api/inventario');
        this.inventario = res.data;
      } catch (err) {
        console.error('Error al cargar inventario:', err);
      }
    },
    async guardarItem() {
      try {
        if (this.editando) {
          const res = await axios.put(
            `http://localhost:3000/api/inventario/${this.itemIdEditando}`,
            this.nuevoItem
          );
          const index = this.inventario.findIndex((item) => item._id === this.itemIdEditando);
          this.inventario[index] = res.data;
          this.cancelarEdicion();
        } else {
          const res = await axios.post('http://localhost:3000/api/inventario', this.nuevoItem);
          this.inventario.push(res.data);
        }
        this.nuevoItem = { nombre: '', descripcion: '', stock: null, precio: null, proveedor: '' };
        this.mostrarModal = false;
      } catch (err) {
        console.error('Error al guardar item:', err);
      }
    },
    editarItem(item) {
      this.nuevoItem = { ...item };
      this.editando = true;
      this.itemIdEditando = item._id;
      this.mostrarModal = true;
    },
    cancelarEdicion() {
      this.nuevoItem = { nombre: '', descripcion: '', stock: null, precio: null, proveedor: '' };
      this.editando = false;
      this.itemIdEditando = null;
      this.mostrarModal = false;
    },
    cerrarModal() {
      this.cancelarEdicion();
    },
    async confirmarEliminarItem(id) {
      const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este item?');
      if (confirmar) {
        this.eliminarItem(id);
      }
    },
    async eliminarItem(id) {
      try {
        await axios.delete(`http://localhost:3000/api/inventario/${id}`);
        this.inventario = this.inventario.filter((item) => item._id !== id);
      } catch (err) {
        console.error('Error al eliminar item:', err);
      }
    },
    formatoMoneda(valor) {
      return `L ${valor.toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
.inventario-container {
  padding: 2rem;
  color: white;
  font-family: 'Poppins', sans-serif;
}

.inventario-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.inventario-form h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.inventario-form input,
.inventario-form textarea {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.7rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
}

.inventario-form input.empty,
.inventario-form textarea.empty {
  color: gray;
}

.inventario-form button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.inventario-form button:hover {
  background: #163a5f;
}

/* Estilo de la tabla */
.inventario-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.inventario-table th,
.inventario-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.inventario-table th {
  background: rgba(0, 0, 0, 0.2);
}

.inventario-table tr:hover {
  background: rgba(255, 255, 255, 0.1);
}

.inventario-table button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.inventario-table button:hover {
  background: #163a5f;
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
</style>