import express from "express"
import cors from "cors"
import userRouter from "./routers/user.router.js"
import cashFlowRouter from "./routers/cashflow.router.js"
import editMovementRouter from "./routers/editMovement.router.js"

const app = express()

app
    .use(cors())
    .use(express.json())
    .use(userRouter)
    .use(cashFlowRouter)
    .use(editMovementRouter)

app.listen(5000, () => console.log("Server listening on port 5000"))