import express from "express";
import http from "http";
import { prismaClient } from "db/client";

const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
  prismaClient.user.findMany()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.post("/user", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  prismaClient.user.create({
    data: {
      username,
      password
    }
  })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.get("/todos/:userId", (req, res) => {
  const { userId } = req.params;

  prismaClient.todo.findMany({
    where: { userId }
  })
    .then(todos => {
      res.json(todos);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.post("/todo", (req, res) => {
  const { task, userId } = req.body;

  if (!task || !userId) {
    res.status(400).json({ error: "Task and userId are required" });
    return;
  }

  prismaClient.todo.create({
    data: {
      task,
      userId
    }
  })
    .then(todo => {
      res.status(201).json(todo);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.put("/todo/:id", (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  prismaClient.todo.update({
    where: { id },
    data: { done }
  })
    .then(todo => {
      res.json(todo);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.delete("/todo/:id", (req, res) => {
  const { id } = req.params;

  prismaClient.todo.delete({
    where: { id }
  })
    .then(() => {
      res.json({ message: "Todo deleted" });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("Server is running on port 8000");
});