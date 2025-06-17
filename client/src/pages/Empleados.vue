<template>
  <div class="empleados-container">
    <h1>Gestión de Empleados</h1>

    <button class="agregar-btn" @click="mostrarModal = true">Agregar Empleado</button>

    <BaseModal v-if="mostrarModal" @close="cerrarModal">
      <form class="empleados-form" @submit.prevent="guardarEmpleado">
        <h2>{{ editando ? 'Editar Empleado' : 'Agregar Empleado' }}</h2>
        <input v-model="nuevoEmpleado.nombre" type="text" placeholder="Nombre" required />
        <input v-model="nuevoEmpleado.apellido" type="text" placeholder="Apellido" required />
        <input v-model="nuevoEmpleado.email" type="email" placeholder="Correo Electrónico" required />
        <input v-model="nuevoEmpleado.telefono" type="text" placeholder="Teléfono" />
        <input v-model="nuevoEmpleado.especialidad" type="text" placeholder="Especialidad" />
        <select v-model="nuevoEmpleado.rol" required>
          <option disabled value="">Seleccione un Rol</option>
          <option value="admin">Administrador</option>
          <option value="propietario">Propietario</option>
          <option value="mecanico">Mecánico</option>
        </select>
        <select v-model="nuevoEmpleado.tallerId" required>
          <option disabled value="">Seleccione un Taller</option>
          <option v-for="taller in talleres" :key="taller._id" :value="taller._id">
            {{ taller.nombre }}
          </option>
        </select>
        <input v-model="nuevoEmpleado.password" type="password" placeholder="Contraseña" :required="!editando" />
        <button type="submit">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
        <button v-if="editando" type="button" @click="cancelarEdicion">Cancelar</button>
      </form>
    </BaseModal>

    <table class="empleados-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Teléfono</th>
          <th>Especialidad</th>
          <th>Rol</th>
          <th>Taller</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="empleado in empleados" :key="empleado._id">
          <td>{{ empleado.nombre }}</td>
          <td>{{ empleado.apellido }}</td>
          <td>{{ empleado.email }}</td>
          <td>{{ empleado.telefono }}</td>
          <td>{{ empleado.especialidad }}</td>
          <td>{{ empleado.rol }}</td>
          <td>{{ obtenerNombreTaller(empleado.tallerId) }}</td>
          <td>
            <button @click="editarEmpleado(empleado)">Editar</button>
            <button @click="confirmarEliminarEmpleado(empleado._id)">Eliminar</button>
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
  name: 'EmpleadosPage',
  components: { BaseModal },
  data() {
    return {
      empleados: [],
      talleres: [],
      nuevoEmpleado: {
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        especialidad: '',
        rol: '',
        tallerId: '',
        password: ''
      },
      editando: false,
      empleadoIdEditando: null,
      mostrarModal: false,
    };
  },
  async mounted() {
    await this.cargarDatos();
  },
  methods: {
    async cargarDatos() {
      const [empleadosRes, talleresRes] = await Promise.all([
        axios.get('http://localhost:3000/api/empleados'),
        axios.get('http://localhost:3000/api/talleres')
      ]);
      this.empleados = empleadosRes.data;
      this.talleres = talleresRes.data;
    },
    async guardarEmpleado() {
      try {
        if (this.editando) {
          const payload = { ...this.nuevoEmpleado };
          if (!payload.password) delete payload.password;
          const res = await axios.put(
            `http://localhost:3000/api/empleados/${this.empleadoIdEditando}`,
            payload
          );
          const index = this.empleados.findIndex((e) => e._id === this.empleadoIdEditando);
          this.empleados[index] = res.data;
          this.cancelarEdicion();
        } else {
          const res = await axios.post('http://localhost:3000/api/empleados', this.nuevoEmpleado);
          this.empleados.push(res.data);
        }
        this.nuevoEmpleado = {
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          especialidad: '',
          rol: '',
          tallerId: '',
          password: ''
        };
        this.mostrarModal = false;
      } catch (err) {
        alert('Error al guardar empleado: ' + (err.response?.data?.error || err.message));
      }
    },
    editarEmpleado(empleado) {
      this.nuevoEmpleado = {
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        email: empleado.email,
        telefono: empleado.telefono,
        especialidad: empleado.especialidad,
        rol: empleado.rol,
        tallerId: empleado.tallerId,
        password: ''
      };
      this.editando = true;
      this.empleadoIdEditando = empleado._id;
      this.mostrarModal = true;
    },
    cancelarEdicion() {
      this.nuevoEmpleado = {
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        especialidad: '',
        rol: '',
        tallerId: '',
        password: ''
      };
      this.editando = false;
      this.empleadoIdEditando = null;
      this.mostrarModal = false;
    },
    cerrarModal() {
      this.cancelarEdicion();
    },
    async confirmarEliminarEmpleado(id) {
      const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este empleado?');
      if (confirmar) {
        this.eliminarEmpleado(id);
      }
    },
    async eliminarEmpleado(id) {
      try {
        await axios.delete(`http://localhost:3000/api/empleados/${id}`);
        this.empleados = this.empleados.filter((e) => e._id !== id);
      } catch (err) {
        alert('Error al eliminar empleado: ' + (err.response?.data?.error || err.message));
      }
    },
    obtenerNombreTaller(tallerId) {
      const taller = this.talleres.find((t) => t._id === tallerId);
      return taller ? taller.nombre : 'Sin asignar';
    }
  },
};
</script>

<style scoped>
.empleados-container {
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

.empleados-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.empleados-form h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.empleados-form input,
.empleados-form select {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.7rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
}

.empleados-form button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.empleados-form button:hover {
  background: #163a5f;
}

.empleados-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.empleados-table th,
.empleados-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.empleados-table th {
  background: rgba(0, 0, 0, 0.2);
}

.empleados-table tr:hover {
  background: rgba(255, 255, 255, 0.1);
}

.empleados-table button {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.empleados-table button:hover {
  background: #163a5f;
}
</style>