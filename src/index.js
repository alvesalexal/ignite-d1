const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { userName } = request.body;
  if (userName) {
    const userExists = users.some((user) => user.userName === userName);

    if (userExists) {
      return response.status(400).json({ error: "user already exists" });
    }
    return next();
  }

  const { username } = request.headers;
  const user = users.find((user) => user.userName === username);
  if (user) {
    request.user = user;
    return next();
  }

  return response.status(400).json({ error: "user already not exists" });
}

app.post('/users', checksExistsUserAccount, (request, response) => {
  const id = uuidv4();
  const { userName, name } = request.body;
  users.push({
    name, userName: userName, id, todos: []
  });

  return response.status(201).json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  console.log(username);
  const user = users.find((user) => user.userName === username);
  if (user) {
    return response.json(user.todos);
  }
  return response.status(400).json({ error: "user already not exists" });
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request.headers;
  const user = users.find((user) => user.userName === username);
  const id = uuidv4();

  if (user) {
    user.todos.push({
      title, deadline: new Date(deadline), done: false, id, created_at: new Date()
    })
    console.log(user)
    return response.status(201).json(user.todos);
  }
  return response.status(400).json({ error: "user already not exists" });
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.userName === username);
  console.log(user)
  if (user) {
    const { id } = request.params;
    const { title, deadline } = request.body;
    const todo = user.todos.find((tod) => tod.id === id);
    if (todo) {
      todo.title = title;
      todo.deadline = deadline;
      return response.status(201).json(user.todos);
    }
    return response.status(400).json({ error: "todo already not exists with id" });
  }
  return response.status(400).json({ error: "user already not exists" });
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  if (user) {
    const todo = user.todos.find((tod) => tod.id === id);
    if (todo) {
      todo.done = true;
      return response.status(201).json(user.todo);
    }
    return response.status(400).json({ error: "todo already not exists with id" });
  }
  return response.status(400).json({ error: "user already not exists" });
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find((tod) => tod.id === id);
  if (todo) {
    user.todos.splice(todo,1);
    return response.status(204).json({ message: "todo deleted" });
  }
  return response.status(400).json({ error: "todo already not exists" });
});

module.exports = app;