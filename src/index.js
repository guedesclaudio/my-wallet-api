import express from "express"
import cors from "cors"
import userRouter from "./routers/user.router.js"
import cashFlowRouter from "./routers/cashflow.router.js"
import editMovementeRouter from "./routers/editMovement.router.js"

const app = express()

app
    .use(cors())
    .use(express.json())
    .use(userRouter)
    .use(cashFlowRouter)
    .use(editMovementeRouter)

//Para criar rotas privadas, crie um statusPost aqui para receber atualizações do status vindo do front,
//calcule o tempo minimo para ter esse status recebido e se nao ta recebendo mais exclua a session do usuario
//No front, la na rota privada o front vai mandar um token, porem esse token nao é mais valido e assim negue acesso a outras rotas

app.listen(5000, () => console.log("Server listening on port 5000"))