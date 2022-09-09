import express from "express"
import cors from "cors"
import { SignIn, SignUp } from "./controllers/signIn&Up.controller.js"
import { getCashFlow, registerEntry, registerExit } from "./controllers/cashFlow.controller.js"
import { deleteMove, updateMove } from "./controllers/editMovement.controller.js"

const app = express()

app
    .use(cors())
    .use(express.json())

app.post("/signin", SignIn)

app.post("/signup", SignUp)

app.post("/entries", registerEntry)

app.post("/exits", registerExit)

app.get("/cashflow", getCashFlow)

app.delete("/deletemove/:id", deleteMove)

app.put("/putmove/:id", updateMove)

//Para criar rotas privadas, crie um statusPost aqui para receber atualizações do status vindo do front,
//calcule o tempo minimo para ter esse status recebido e se nao ta recebendo mais exclua a session do usuario
//No front, la na rota privada o front vai mandar um token, porem esse token nao é mais valido e assim negue acesso a outras rotas

app.listen(5000, () => console.log("Server listening on port 5000"))