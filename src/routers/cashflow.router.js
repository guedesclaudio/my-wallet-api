import express from "express"
import { registerEntry, registerExit, getCashFlow } from "../controllers/cashFlow.controller.js"
import {userTokenValidation, moveSchemaValidation} from "../middlewares/userMovementsValidation.middleware.js"

const router = express.Router()

router.post("/entries", moveSchemaValidation, userTokenValidation, registerEntry)
router.post("/exits", moveSchemaValidation, userTokenValidation, registerExit)
router.get("/cashflow", userTokenValidation, getCashFlow)

export default router