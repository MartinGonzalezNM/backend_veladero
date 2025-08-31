// components/sector/sector_controller.js
import { SectorService } from "./sector_service.js";

export const SectorController = {
  async crear(req, res) {
    try {
      const sector = await SectorService.crearSector(req.body);
      res.status(201).json(sector);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const sectores = await SectorService.obtenerSectores();
      res.json(sectores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const sector = await SectorService.obtenerSectorPorId(req.params.id);
      if (!sector) return res.status(404).json({ error: "Sector no encontrado" });
      res.json(sector);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const sector = await SectorService.actualizarSector(req.params.id, req.body);
      if (!sector) return res.status(404).json({ error: "Sector no encontrado" });
      res.json(sector);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const sector = await SectorService.eliminarSector(req.params.id);
      if (!sector) return res.status(404).json({ error: "Sector no encontrado" });
      res.json({ message: "Sector eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
