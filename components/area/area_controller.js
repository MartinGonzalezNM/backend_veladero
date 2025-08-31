// components/area/area_controller.js
import { AreaService } from "./area_service.js";

export const AreaController = {
  async getAll(req, res) {
    try {
      const areas = await AreaService.getAll();
      res.json(areas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const area = await AreaService.getById(req.params.id);
      if (!area) return res.status(404).json({ message: "Área no encontrada" });
      res.json(area);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const nuevaArea = await AreaService.create(req.body);
      res.status(201).json(nuevaArea);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const areaActualizada = await AreaService.update(req.params.id, req.body);
      if (!areaActualizada) return res.status(404).json({ message: "Área no encontrada" });
      res.json(areaActualizada);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const areaEliminada = await AreaService.delete(req.params.id);
      if (!areaEliminada) return res.status(404).json({ message: "Área no encontrada" });
      res.json({ message: "Área eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
