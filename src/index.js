const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const PORT = 3000;

const vacinas = [];

app.use(express.json());

function verificarEstoque(request, response, next) {
    const { nome } = request.headers;
    const verificaNome = vacinas.find(verificaNome => verificaNome.nome == nome)

    if (!verificaNome) {
        return response.status(404).json({ error: "Not found" })
    }

    request.verificaNome = verificaNome;

    return next();
}

app.post('/users', (request, response) => {
    const { fabricante, nome, doses, intervalo } = request.body;
    const userExists = vacinas.some(
        userExists => userExists.nome == nome
    )

    if (userExists) {
        return response.status(400).json({ error: "Bad request" })
    }

    vacinas.push({
        id: uuidv4(),
        fabricante,
        nome,
        doses,
        intervalo,
    })

    return response.status(201).send()
})

app.get('/todos', verificarEstoque, (request, response) => {
    const { verificaNome } = request;

    return response.status(200).json(verificaNome);
})

app.put('/todos', verificarEstoque, (request, response) => {
    const { verificaNome } = request;
    const { fabricante, nome } = request.body;

    if (!verificaNome)
        return response.status(404).json({ error: "Not found" })

    verificaNome.fabricante = fabricante;
    verificaNome.nome = nome;

    return response.status(201).json(verificaNome)
})

app.delete('/todos', (request, response) => {
    const { id } = request.body;

    const index = vacinas.findIndex(index => index.id == id)

    if (index == -1) {
        return response.status(404).json({ error: "Not found" })
    }

    vacinas.splice(index, 1);

    return response.status(204).send()
})


app.listen(PORT);
console.info(`Server created on PORT : ${PORT}`);