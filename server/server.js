require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const clienteRoutes = require('./routes/cliente.routes');
const vehiculoRoutes = require('./routes/vehiculo.routes');
const empleadoRoutes = require('./routes/empleado.routes');
const ordenServicioRoutes = require('./routes/ordenServicio.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const authRoutes = require('./routes/auth.routes');

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Conectado a MongoDB'))
  .catch(err => console.error(' Error de conexión', err));

app.use('/api/clientes', clienteRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/ordenes-servicio', ordenServicioRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});