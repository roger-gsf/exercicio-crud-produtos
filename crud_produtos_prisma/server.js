const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const prisma = new PrismaClient();

// Endpoint para adicionar um Produto (POST) POST /produtos
app.post("/produtos", async (req, res) => {
  const { produto_nome, produto_desc, produto_preco } = req.body;
  try {
    await prisma.produto.create({
      data: {
        produto_nome,
        produto_desc,
        produto_preco,
      },
    });
    res.status(201).send("Produto adicionado com sucesso.");
  } catch (error) {
    res.status(500).send("Erro ao adicionar produto.");
  }
});

// Endpoint para obter todos os Produtos (GET) --> GET /produtos
app.get("/produtos", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    res.status(500).send("Erro ao obter produtos.");
  }
});

// Endpoint para obter um Produto por ID (GET) --> GET /produtos/:id
app.get("/produtos/:produto_id", async (req, res) => {
  const { produto_id } = req.params;
  try {
    const produto = await prisma.produto.findUnique({
      where: { produto_id: parseInt(produto_id) },
    });
    if (!produto) {
      return res.status(404).send("Produto inexistente.");
    }
    res.json(produto);
  } catch (error) {
    res.status(500).send("Erro ao obter produto.");
  }
});

// Endpoint para atualizar um Produto (PUT) --> PUT /produtos/:id
app.put("/produtos/:produto_id", async (req, res) => {
  const { produto_id } = req.params;
  const { produto_nome, produto_desc, produto_preco } = req.body;
  try {
    await prisma.produto.update({
      where: { produto_id: parseInt(produto_id) },
      data: {
        produto_nome,
        produto_desc,
        produto_preco,
      },
    });
    res.send("Produto atualizado com sucesso.");
  } catch (error) {
    res.status(500).send("Erro ao atualizar produto.");
  }
});

// Endpoint para deletar um Produto (DELETE) --> DELETE /produtos/:id
app.delete("/produtos/:produto_id", async (req, res) => {
  const { produto_id } = req.params;
  try {
    await prisma.produto.delete({
      where: { produto_id: parseInt(produto_id) },
    });
    res.send("Produto deletado com sucesso.");
  } catch (error) {
    res.status(500).send("Erro ao deletar produto.");
  }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
