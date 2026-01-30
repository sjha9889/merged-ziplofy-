import { Router } from "express";
import {
  createStore,
  getStoresByUserId,
  updateStore
} from "../controllers/store.controller";
import { protect } from "../middlewares/auth.middleware";

export const storeRouter = Router();

// Protected routes (authentication required)
storeRouter.use(protect);

// Get stores for authenticated user
storeRouter.get("/my-stores", getStoresByUserId);

// Create a new store
storeRouter.post("/", createStore);

// Update a store
storeRouter.put('/:id', updateStore);
