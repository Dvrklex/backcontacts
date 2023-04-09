const express = require('express');
const app = express();
const contactsRouter = require('./routes/contacts.js'); // importar el enrutador de contacts.js

app.use(express.json());
// Middleware personalizado
const myLogger = (req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
}

// Usar el middleware personalizado
app.use(myLogger);

// Usar el enrutador de contacts.js
app.use('/contacts', contactsRouter);

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
});
