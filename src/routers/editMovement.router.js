import express from "express"
import { deleteMove, updateMove } from "../controllers/editMovement.controller.js"
import { userTokenValidation } from "../middlewares/userMovementsValidation.middleware.js"

const router = express.Router()

router.delete("/deletemove/:id", userTokenValidation, deleteMove)
router.put("/putmove/:id", userTokenValidation, updateMove)

export default router



