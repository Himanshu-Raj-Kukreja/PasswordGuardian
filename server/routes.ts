import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPasswordSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Password CRUD routes
  app.get("/api/passwords", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const passwords = await storage.getPasswords(req.user.id);
    res.json(passwords);
  });

  app.post("/api/passwords", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const password = await storage.createPassword(req.user.id, parsed.data);
    res.status(201).json(password);
  });

  app.patch("/api/passwords/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id);
    const password = await storage.getPassword(id);
    if (!password || password.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    const updated = await storage.updatePassword(id, req.body);
    res.json(updated);
  });

  app.delete("/api/passwords/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id);
    const password = await storage.getPassword(id);
    if (!password || password.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    await storage.deletePassword(id);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}
