// components/area/area_service.js
import { AreaModel } from "./area_model.js";

export const AreaService = {
  async getAll() {
    return await AreaModel.find().populate("id_sector").populate("id_empresa");
  },

  async getById(id) {
    return await AreaModel.findById(id).populate("id_sector").populate("id_empresa");
  },

  async create(data) {
    const nuevaArea = new AreaModel(data);
    return await nuevaArea.save();
  },

  async update(id, data) {
    return await AreaModel.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id) {
    return await AreaModel.findByIdAndDelete(id);
  }
};
