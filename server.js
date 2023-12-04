const express = require("express")
const fs = require("fs/promises")
const path = require("path")

const app = express()

app.use(express.urlencoded({extended: false})) 
app.use(express.json())

app.use(express.static(path.join(__dirname, "View")))


app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "/view/index.html"))
})


app.get("/cargainicial", async (req, res)=>{

    const candidatosData = await fs.readFile("config.csv", "utf-8")

    const candidatos = candidatosData.split("\r\n")
    
    const candidatosDetails = []
    candidatos.forEach(candidato =>{
        let candidatoDados = candidato.split(",")

        let candidatoObj = {
            tipoEleicao: candidatoDados[0],
            numeroCandidato : candidatoDados[1], 
            nomeCandidato: candidatoDados[2],
            urlFoto: candidatoDados[3]
        }
        candidatosDetails.push(candidatoObj)
    })    
    
    res.send(candidatosDetails)

})

app.post("/voto", async (req, res)=>{

    let dado = JSON.stringify(req.body)

    try {
        await fs.appendFile("votacao.txt", dado + "\n")

        res.status(201).json({
            "Status" : "200",
            "mensagem" : "Voto Registrado Com sucesso"
           })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "Status" : "500",
            "mensagem" : "Erro ao registrar voto, contate o administrador do sistema"
        })
    }

})


const PORT = 3000
app.listen(PORT, ()=> {
    console.log(`Servidor Urna Eletrônica rodando na porta ${PORT}`);
})