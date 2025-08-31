import { EmpresaModel } from "./empresa_model.js";

export const EmpresaService = {
    async create(data) {
        const empresa = new EmpresaModel(data);
        return await empresa.save();
    },

    async getAll() {
        return await EmpresaModel.find();
    },

    async getById(id) {
        return await EmpresaModel.findById(id);
    },

    async update(id, data) {
        return await EmpresaModel.findByIdAndUpdate(id, data, { new: true });
    },

    async delete(id) {
        return await EmpresaModel.findByIdAndDelete(id);
    }
};
