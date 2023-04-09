const express = require('express');
const app = express();
const contacts = require('./contacts.json');

app.use(express.json());

const fs = require('fs');

// Ver todos los contactos
app.get('/contacts', (req, res) => {
  res.json(contacts.contacts);
});

// Ver un contacto por id
app.get('/contacts/:id', (req, res) => {
  const contact = contacts.contacts.find(c => c.id === parseInt(req.params.id));
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});



  
// Crear contacto
app.post('/contacts', (req, res) => {
    if (!req.body) {
      return res.status(400).send('Missing request body');
    }
  
    if (!req.body.name || !req.body.phone) {
      return res.status(400).send('Missing required fields: name, phone');
    }
  
    // Crear un nuevo contacto con los datos recibidos
    const newContact = {
      id: contacts.contacts.length + 1,
      date: new Date().toISOString(),
      favourite: req.body.favourite || false,
      name: req.body.name,
      phone: req.body.phone
    };
  
    // Agregar el nuevo contacto al array de contactos
    contacts.contacts.push(newContact);
    fs.writeFile('contacts.json', JSON.stringify(contacts), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
      }
  
      console.log('New contact has been created', newContact);
      res.send(newContact);
    });
  });
  
  

// Editar contacto

app.put('/contacts/:id', (req, res) => {
  const id = req.params.id;
  if (!req.body) {
    return res.status(400).send('Missing request body');
  }
 
  const updatedContact = req.body;
  const contactIndex = contacts.contacts.findIndex(c => c.id === parseInt(id));
  if (contactIndex === -1) {
    return res.status(404).send('Contact not found');
  }

  // Actualizar datos del  contacto 
  const oldContact = contacts.contacts[contactIndex];
  const newContact = {
    id: oldContact.id,
    date: oldContact.date,
    favourite: oldContact.favourite,
    name: oldContact.name,
    phone: oldContact.phone,
    ...updatedContact
  };
  contacts.contacts[contactIndex] = newContact;

  // Escribir los datos en contacts.json
  fs.writeFile('./contacts.json', JSON.stringify(contacts), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing data to file');
    }
    console.log('Data written to file');
  });

  res.send(newContact);
  console.log('Nuevo contacto', newContact);
  console.log('Contacto antiguo', oldContact);
});


// Eliminar contacto
app.delete('/contacts/:id', (req, res) => {
    const id = req.params.id;
    const contactIndex = contacts.contacts.findIndex(c => c.id === parseInt(id));
  
    if (contactIndex === -1) {
      return res.status(404).send('Contact not found');
    }
  
    // Elimino el contacto con el método splice
    const deletedContact = contacts.contacts.splice(contactIndex, 1)[0];
    fs.writeFileSync('contacts.json', JSON.stringify(contacts, null, 2));
  
    res.send(deletedContact);
    console.log('Contacts has been deleted', deletedContact);
});
  



//Seteo del puerto

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
});
