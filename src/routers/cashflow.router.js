import express from "express"
import { registerEntry, registerExit, getCashFlow } from "../controllers/cashFlow.controller.js"

const router = express.Router()

router.post("/entries", registerEntry)
router.post("/exits", registerExit)
router.get("/cashflow", getCashFlow)

export default router