import express from "express"
import { SignIn, SignUp } from "../controllers/signIn&Up.controller.js"
import { signupSchemaValidation, signinSchemaValidation } from "../middlewares/userSchemaValidation.middleware.js"

const router = express.Router()

router.post("/signin", signinSchemaValidation, SignIn)
router.post("/signup", signupSchemaValidation, SignUp)

export default router