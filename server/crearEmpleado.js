const mongoose = require('mongoose');
const Empleado = require('./models/Empleado');

// Usa la URI de tu .env o la de Atlas
mongoose.connect('mongodb+srv://anthonyigor2009:Dillom2024@cluster0.dawz7.mongodb.net/ruedapp')
  .then(async () => {
    const empleado = new Empleado({
      nombre: 'Admin',
      apellido: 'Principal',
      rol: 'admin',
      especialidad: 'Administrador',
      telefono: '123456789',
      email: 'admin@admin.com',
      password: '12345' 
    });
    await empleado.save();
    console.log('Empleado creado');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });