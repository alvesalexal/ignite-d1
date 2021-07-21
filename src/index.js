const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { userName } = request.body;
  console.log(userName);
  const user = users.find((user) => user.userName === userName );
  if (user) {
    return response.status(400).json({ message: "user already exists" });
  }

  request.user = user;
  return next();
}

app.post('/users', checksExistsUserAccount, (request, response) => {
  const id = uuidv4();
  const { userName, name } = request.body;
  users.push({
    name, userName, id,todo: []
  });

  return response.status(201).json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  console.log(username);
  const user = users.find((user) => user.userName === username );
  if (user) {
    return response.json(user.todo);
  }
  return response.status(400).json({ message: "user already not exists" });
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request.headers;
  const user = users.find((user) => user.userName === username );
  const id = uuidv4();
  console.log(user)
  if (user) {
    user.todo.push({
      title, deadline, done: false, id
    })
    return response.status(201).json(user.todo);
  }
  return response.status(400).json({ message: "user already not exists" });
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;