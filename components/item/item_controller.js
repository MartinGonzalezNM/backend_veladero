import { ItemService } from "./item_service.js";

export const ItemController = {
  async crear(req, res) {
    try {
      const item = await ItemService.crearItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async obtenerTodos(req, res) {
    try {
      const items = await ItemService.obtenerItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const item = await ItemService.obtenerItemPorId(req.params.id);
      if (!item) return res.status(404).json({ error: "Item no encontrado" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const item = await ItemService.actualizarItem(req.params.id, req.body);
      if (!item) return res.status(404).json({ error: "Item no encontrado" });
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const item = await ItemService.eliminarItem(req.params.id);
      if (!item) return res.status(404).json({ error: "Item no encontrado" });
      res.json({ message: "Item eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
