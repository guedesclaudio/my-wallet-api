import express from "express"
import cors from "cors"
import userRouter from "./routers/user.router.js"
import cashFlowRouter from "./routers/cashflow.router.js"
import editMovementRouter from "./routers/editMovement.router.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app
    .use(cors())
    .use(express.json())
    .use(userRouter)
    .use(cashFlowRouter)
    .use(editMovementRouter)

app.get("/status", (req, res) => {
    res.send("Aplicação rodando")
})

app.listen(process.env.PORT, () => console.log("Server listening on port 5000"))