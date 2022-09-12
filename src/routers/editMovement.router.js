import express from "express"
import { deleteMove, updateMove } from "../controllers/editMovement.controller.js"

const router = express.Router()

router.delete("/deletemove/:id", deleteMove)
router.put("/putmove/:id", updateMove)

export default router



