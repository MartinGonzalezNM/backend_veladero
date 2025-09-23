import { ItemModel } from "./item_model.js";

export const ItemService = {
  async crearItem(data) {
    const item = new ItemModel(data);
    return await item.save();
  },

  async obtenerItems() {
    return await ItemModel.find();
  },

  async obtenerItemPorId(id) {
    const item = await ItemModel.findById(id);
    return item ? item.nombre_item : null;
  },
  

  async actualizarItem(id, data) {
    return await ItemModel.findByIdAndUpdate(id, data, { new: true });
  },

  async eliminarItem(id) {
    return await ItemModel.findByIdAndDelete(id);
  }
};
