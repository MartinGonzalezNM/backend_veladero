import { TareaModel } from "./tarea_model.js";

export const TareaService = {
  async crearTarea(data) {
    const tarea = new TareaModel(data);
    return await tarea.save();
  },

  async obtenerTareas() {
    return await TareaModel.find()
      .populate("id_area", "nombre_area")
      .populate("id_sector", "nombre_sector")
      .populate("id_empresa", "nombre_empresa")
      .populate("id_descripcion", "nombre_descripcion")
      .populate("id_item", "nombre_item")
      .populate("responsable", "nombre_usuario email");
  },

  async obtenerTareaPorId(id) {
    return await TareaModel.findById(id)
      .populate("id_area")
      .populate("id_sector")
      .populate("id_empresa")
      .populate("responsable", "nombre_usuario email");
  },


  //obteneer tareas por usuario que esten activas
  async obtenerTareaPorUsuario(usuarioId) {
    return await TareaModel.find({ responsable: usuarioId, estado: "activa" })
      .populate("id_area", "nombre_area")
      .populate("id_sector", "nombre_sector")
      .populate("id_empresa", "nombre_empresa")
      .populate("id_descripcion", "nombre_descripcion")
      .populate("id_item", "nombre_item")
      .populate("responsable", "nombre_usuario email");
  },

  //obteneer tareas por usuario que esten finalizadas
async obtenerTareaActivasPorUsuario(usuarioId) {
  const tareas = await TareaModel.find({ responsable: usuarioId, estado: "activo" })
    .populate("id_area", "nombre_area -_id")
    .populate("id_sector", "nombre_sector -_id")
    .populate("id_empresa", "nombre_empresa -_id")
    .populate("id_descripcion", "nombre_descripcion -_id")
    .populate("id_item", "nombre_item -_id")
    .populate("responsable", "nombre_usuario email -_id");

  // Transformar para devolver un string en lugar de un objeto
  return tareas.map(t => ({
    ...t.toObject(),
    id_item: t.id_item?.nombre_item ?? null,
    id_descripcion: t.id_descripcion?.nombre_descripcion ?? null,
    id_area: t.id_area?.nombre_area ?? null,
    id_sector: t.id_sector?.nombre_sector ?? null,
    id_empresa: t.id_empresa?.nombre_empresa ?? null,
    responsable: t.responsable ? { nombre_usuario: t.responsable.nombre_usuario, email: t.responsable.email } : null
  }));
},
  async eliminarTarea(id) {
    return await TareaModel.findByIdAndDelete(id);
  },
  async actualizarTarea(id, data) {
  // Excluir campos que no deben ser actualizados
  const { _id, createdAt, updatedAt, ...datosActualizables } = data;
  
  return await TareaModel.findByIdAndUpdate(
    id,
    { 
      ...datosActualizables,
      ultima_modificacion: new Date() // Actualizar la fecha de última modificación
    },
    { 
      new: true, // Retornar el documento actualizado
      runValidators: true // Ejecutar validaciones del schema
    }
  )
  .populate("id_area", "nombre_area")
  .populate("id_sector", "nombre_sector")
  .populate("id_empresa", "nombre_empresa")
  .populate("responsable", "nombre_usuario email");
}
};
