import express from "express"
import { SignIn, SignUp } from "../controllers/signIn&Up.controller.js"

const router = express.Router()

router.post("/signin", SignIn)
router.post("/signup", SignUp)

export default router