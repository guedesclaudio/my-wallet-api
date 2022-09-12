import express from "express"
import { deleteMove, updateMove } from "../controllers/editMovement.controller.js"
import { userTokenValidation } from "../middlewares/userMovementsValidation.middleware.js"
import editSchemaValidation from "../middlewares/editMovementsValidation.middleware.js"

const router = express.Router()

router.delete("/deletemove/:id", userTokenValidation, deleteMove)
router.put("/putmove/:id", editSchemaValidation, userTokenValidation, updateMove)

export default router