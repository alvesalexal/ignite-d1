const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {

  if (request.body.name) {
    const { username } = request.body;
    if (username) {
      const userExists = users.some((user) => user.username === username);

      if (userExists) {
        return response.status(400).json({ error: "user already exists" });
      }
      return next();
    }
  }

  const { username } = request.headers;
  if (username) {
    const user = users.find((user) => user.username === username);
    if (user) {
      request.user = user;
      return next();
    }
  }
  return response.status(400).json({ error: "user already not exists" });
}

app.post('/users', checksExistsUserAccount, (request, response) => {
  const id = uuidv4();
  const { username, name } = request.body;
  const user = {
    name, username, id, todos: []
  }
  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  if (user) {
    return response.json(user.todos);
  }
  return response.status(400).json({ error: "user already not exists" });
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const id = uuidv4();

  const todo = {
    title, deadline: new Date(deadline), done: false, id, created_at: new Date()
  }

  user.todos.push(todo)
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  if (user) {
    const { id } = request.params;
    const { title, deadline } = request.body;
    const todo = user.todos.find(todo => todo.id === id);
    if (todo) {
      todo.title = title;
      todo.deadline = new Date(deadline);
      return response.status(201).json(todo);
    }
    return response.status(404).send({ error: "todo already not exists with id" });
  }
  return response.status(400).send({ error: "user already not exists" });
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find(todo => todo.id === id);
  if (todo) {
    todo.done = true;
    return response.status(201).json(todo);
  }
  return response.status(404).json({ error: "todo already not exists with id" });


});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find((tod) => tod.id === id);
  if (todo) {
    user.todos.splice(todo, 1);
    return response.status(204).send({ message: "todo deleted" });
  }
  return response.status(404).json({ error: "todo already not exists" });
});

module.exports = app;