import { EmpresaService } from "./empresa_service.js";

export const EmpresaController = {
    async create(req, res) {
        try {
            const empresa = await EmpresaService.create(req.body);
            res.status(201).json(empresa);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const empresas = await EmpresaService.getAll();
            res.json(empresas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const empresa = await EmpresaService.getById(req.params.id);
            if (!empresa) return res.status(404).json({ error: "Empresa no encontrada" });
            res.json(empresa);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const empresa = await EmpresaService.update(req.params.id, req.body);
            if (!empresa) return res.status(404).json({ error: "Empresa no encontrada" });
            res.json(empresa);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const empresa = await EmpresaService.delete(req.params.id);
            if (!empresa) return res.status(404).json({ error: "Empresa no encontrada" });
            res.json({ message: "Empresa eliminada correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
