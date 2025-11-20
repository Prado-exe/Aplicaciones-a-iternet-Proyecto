//Logica y BD
const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Solicitudes = require('../models/Solicitudes');
const Proyecto = require('../models/Proyecto');

//Crear Usuario
exports.createUser = async ({ NombreUsuario, CorreoUsuario, ContraUsuario }) => {
  // Validacion de campos vacios
  if (!NombreUsuario || !CorreoUsuario || !ContraUsuario) {
    const e = new Error('Faltan campos');
    e.status = 400;
    throw e;
  }
  //Convertir a min
  CorreoUsuario = CorreoUsuario.trim().toLowerCase();

  //Validacion de correo Unico
  const existe = await Usuario.findOne({ CorreoUsuario }).lean();
  if (existe) {
    const e = new Error('El correo ya está registrado');
    e.status = 409;
    throw e;
  }

  try {
    const doc = await Usuario.create({ NombreUsuario, CorreoUsuario, ContraUsuario });

    const { ContraUsuario: _, ...safe } = doc.toObject();
    return safe;

} catch (err) {
  if (err.name === 'ValidationError') {
    const errores = Object.values(err.errors).map(x => ({
      campo: x.path,
      mensaje: x.message,
    }));
    const e = new Error(errores[0].mensaje);
    e.status = 400;
    e.errors = errores;
    throw e;
  }
  throw err;
}

};


//Login usuario
exports.login = async ({ CorreoUsuario, ContraUsuario }) => {
  if (!CorreoUsuario || !ContraUsuario) {
    const e = new Error('Faltan credenciales'); e.status = 400; throw e;
  }

  const correo = CorreoUsuario.trim().toLowerCase();

  // Trae la contraseña 
  const user = await Usuario.findOne({ CorreoUsuario: correo }).select('+ContraUsuario');
  if (!user) { const e = new Error('Credenciales inválidas'); e.status = 401; throw e; }

  const ok = await bcrypt.compare(ContraUsuario, user.ContraUsuario);
  if (!ok) { const e = new Error('Credenciales inválidas'); e.status = 401; throw e; }

  // Ultima sesion
  user.FechaUltimaSesion = new Date();
  await user.save();

  // JWT -- Token de la sesion del usuario
  const token = jwt.sign(
    { id: user._id, tipo: user.TipoUsuario },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const { ContraUsuario: _, __v, ...safe } = user.toObject();
  return { token, user: safe };
};


//Obetener perfil usuario //
exports.getProfile = async (userId) => {
  const [user, ultimoProyecto, reservaReciente, totalProyectos, totalReservas] = await Promise.all([
    Usuario.findById(userId)
      .select('-ContraUsuario -__v')
      .lean(),
    Proyecto
      .findOne({ IDR_Usuario: userId })        
      .sort({ FechaCreacion: -1 })         
      .select('NombreProyecto FechaCreacion')  
      .lean(),
    Solicitudes
      .findOne({ IDR_Usuario: userId })        
      .sort({ FechaReserva: -1 })          
      .select('TipoSolicitud FechaReserva') 
      .lean(),
    Proyecto.countDocuments({ IDR_Usuario: userId }),     
    Solicitudes.countDocuments({ IDR_Usuario: userId }),   
  ]);

  if (!user) {
    const e = new Error('Usuario no encontrado');
    e.status = 404;
    throw e;
  }

  return {
    ...user,
    UltimoProyecto: ultimoProyecto ? ultimoProyecto.NombreProyecto : null,
    ReservaMasReciente: reservaReciente ? reservaReciente.TipoSolicitud : null,
    TotalProyectos: totalProyectos,
    TotalReservas: totalReservas,
  };
};


//Actualizar perfil
exports.updateProfile = async (userId, { nombre, nickname, correo }) => {
  const updates = {};
  //Actualizar nombres y Nicknames
  if (nombre !== undefined) updates.NombreUsuario = nombre;
  if (nickname !== undefined) updates.Nickname = nickname;


  if (correo !== undefined) {
    correo = correo.trim().toLowerCase();

    // Validar correo único
    const existe = await Usuario.findOne({
      CorreoUsuario: correo,
      _id: { $ne: userId },
    }).lean();

    if (existe) {
      const e = new Error("El correo ya está registrado");
      e.status = 409;
      throw e;
    }

    updates.CorreoUsuario = correo;
  }

  try {
    const user = await Usuario.findByIdAndUpdate(
      userId,
      updates,
      {
        new: true,
        runValidators: true, // ✅ corre las validaciones del schema
        context: "query",
      }
    )
      .select("-ContraUsuario -__v")
      .lean();

    if (!user) {
      const e = new Error("Usuario no encontrado");
      e.status = 404;
      throw e;
    }

    return user;
  } catch (err) {
    //Los errores del modelo
    if (err.name === "ValidationError") {
      const errores = Object.values(err.errors).map(x => ({
        campo: x.path,
        mensaje: x.message,
      }));

      const e = new Error(errores[0].mensaje);
      e.status = 400;
      e.errors = errores;
      throw e;
    }

    throw err;
  }
};


//Cambiar Password
exports.changePassword = async (userId, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    const e = new Error("Debes ingresar contraseña actual y nueva");
    e.status = 400;
    throw e;
  }

  // regla mínima
  if (newPassword.length < 8) {
    const e = new Error("La nueva contraseña debe tener al menos 8 caracteres");
    e.status = 400;
    throw e;
  }

  // traemos usuario con contraseña
  const user = await Usuario.findById(userId).select("+ContraUsuario");
  if (!user) {
    const e = new Error("Usuario no encontrado");
    e.status = 404;
    throw e;
  }

  // verificar coincidencia entre nuevas contras
  const ok = await bcrypt.compare(currentPassword, user.ContraUsuario);
  if (!ok) {
    const e = new Error("La contraseña actual no es correcta");
    e.status = 401;
    throw e;
  }

  //Guardar
  user.ContraUsuario = newPassword;

  //Guardar Cambios
  await user.save(); 

  return { message: "Contraseña actualizada correctamente" };
};
