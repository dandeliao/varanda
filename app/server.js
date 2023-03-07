const express = require("express");
const path = require("path");
const porta = process.env.PORT || 4200;

const app = express();

// permite acesso direto ao conteúdo de /assets
app.use("/assets", express.static(__dirname + "/assets"));

// redireciona rotas do app
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(porta, () => console.log(`cliente rodando na porta ${porta}...`));