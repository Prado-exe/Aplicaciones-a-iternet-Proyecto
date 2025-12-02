//Logica y BD
const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Solicitudes = require('../models/Solicitudes');
const Proyecto = require('../models/Proyecto');
const crypto = require("crypto");
const transporter = require("../config/email"); // nodemailer


//Crear Usuario
exports.createUser = async ({ NombreUsuario, Nickname, CorreoUsuario, ContraUsuario }) => {
  // Validacion de campos vacios
  if (!NombreUsuario || !Nickname || !ContraUsuario || !CorreoUsuario ) {
    const e = new Error('Faltan campos');
    e.status = 400;
    throw e;
  }
  //eliminar espacios y convertir a min
  CorreoUsuario = CorreoUsuario.trim().toLowerCase();
  Nickname = Nickname.trim();

  //Validacion de correo Unico
  const existe = await Usuario.findOne({ CorreoUsuario }).lean();
  if (existe) {
    const e = new Error('El correo ya está registrado');
    e.status = 409;
    throw e;
  }

  //Validacion de Nick unico
  const existeNick = await Usuario.findOne({ Nickname }).lean();
  if (existeNick) {
    const e = new Error('El nickname ya está en uso');
    e.status = 409;
    throw e;
  }

  try {
    const doc = await Usuario.create({ NombreUsuario, Nickname, CorreoUsuario, ContraUsuario});

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
  if (err.code === 11000) {
        const campo = Object.keys(err.keyPattern)[0];
        const e = new Error(
          campo === "CorreoUsuario"
            ? "El correo ya está registrado"
            : "El nickname ya está en uso"
        );
        e.status = 409;
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
  const user = await Usuario.findById(userId)
    .select('-ContraUsuario -__v')
    .populate('Proyectos', 'NombreProyecto FechaCreacion')
    .populate('Solicitudes', 'TipoSolicitud FechaReserva')
    .lean();

  if (!user) {
    const e = new Error('Usuario no encontrado');
    e.status = 404;
    throw e;
  }

  const totalProyectos = user.Proyectos?.length || 0;
  const totalSolicitudes = user.Solicitudes?.length || 0;
  const totalActividades = user.Actividades?.length || 0; 

  const ultimoProyecto = totalProyectos > 0
    ? user.Proyectos[user.Proyectos.length - 1]
    : null;

  const reservaReciente = totalSolicitudes > 0
    ? user.Solicitudes[user.Solicitudes.length - 1]
    : null;

  return {
    ...user,
    UltimoProyecto: ultimoProyecto ? ultimoProyecto.NombreProyecto : null,
    ReservaMasReciente: reservaReciente ? reservaReciente.TipoSolicitud : null,
    TotalProyectos: totalProyectos,
    TotalReservas: totalSolicitudes,
    TotalActividades: totalActividades,  
  };
};


exports.updateProfile = async (userId, { nombre, nickname, correo }) => {
  const update = {};

  if (nombre !== undefined) update.NombreUsuario = nombre;
  if (nickname !== undefined) update.Nickname = nickname.trim();
  if (correo !== undefined) update.CorreoUsuario = correo.trim().toLowerCase();

  try {
    const user = await Usuario.findByIdAndUpdate(
      userId,
      update,
      {
        new: true,
        runValidators: true,  
        context: "query"
      }
    ).select("-ContraUsuario -__v").lean();

    if (!user) {
      const e = new Error("Usuario no encontrado");
      e.status = 404;
      throw e;
    }

    return user;

  } catch (err) {
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors)[0].message;
      const e = new Error(msg);
      e.status = 400;
      throw e;
    }

    if (err.code === 11000) {
      const campo = Object.keys(err.keyPattern)[0];
      const e = new Error(
        campo === "CorreoUsuario"
          ? "El correo ya está registrado"
          : "El nickname ya está en uso"
      );
      e.status = 409;
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


exports.forgotPassword = async ({ email }) => {

  if (!email) {
    const e = new Error("Debes ingresar un correo");
    e.status = 400;
    throw e;
  }

  //Normaliza el correo
  const correoNormalizado = email.trim().toLowerCase();

  //Buscamos si existe en la bd
  const user = await Usuario.findOne({ CorreoUsuario: correoNormalizado });
  if (!user) return;

  //Generar token aleatorio y su expiracion
  const token = crypto.randomBytes(32).toString("hex"); //Cadena aleatoria
  const expires = Date.now() + 60 * 60 * 1000; // 1 hora

  //Agregamos a user
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(expires);

  //Guardamos en bd
  await user.save(); 

  //Para redirigir al usuario(url)
  const baseUrl = process.env.FRONT_URL || "http://localhost:5173";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  // Enviar correo
  await transporter.sendMail({
    from: `"FabLab" <${process.env.SMTP_USER}>`,
    to: correoNormalizado,
    subject: "Recuperación de contraseña - FabLab",
    html: `
      <p>Hola,</p>
      <p>Recibimos una solicitud para restablecer tu contraseña en el sistema del FabLab.</p>
      <p>Puedes establecer una nueva contraseña haciendo clic en el siguiente enlace:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Este enlace es válido por 1 hora.</p>
    `,
  });
};

//Establecer nueva contraseña
exports.resetPassword = async ({ token, newPassword }) => {

  //Verificar existencia de token y nueva password
  if (!token || !newPassword) {
    const e = new Error("Faltan datos (token o nueva contraseña)");
    e.status = 400;
    throw e;
  }

  //Respetar las reglas del modelo
  if (newPassword.length < 8) {
    const e = new Error("La nueva contraseña debe tener al menos 8 caracteres");
    e.status = 400;
    throw e;
  }

  // Buscar usuario con ese token y que no este vencido
  const user = await Usuario.findOne({
    //Mismo token
    passwordResetToken: token,
    //Mayor que el hora actual (dentro del plazo de 1h)
    passwordResetExpires: { $gt: new Date() }, 
  });

  if (!user) {
    const e = new Error("Token inválido o expirado");
    e.status = 400;
    throw e;
  }

  //Actualiza la contra
  user.ContraUsuario = newPassword;

  // Limpiar token y expiración
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await user.save(); //Actualizamos documento del usuario en mongo
  return { message: "Contraseña actualizada correctamente" };
};

