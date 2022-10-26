require('dotenv').config();
const express = require('express');
const Model = require('./model');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { addPiece, getPiece, getAllPieces, putPiece, deletePiece } = require('./pieceDatabaseConnection');
const { addUser, getUser, getAllUsers, deleteUser } = require('./userDatabaseConnection');
const { addPrototype, getPrototype, getAllPrototypes, putPrototype, deletePrototype } = require('./prototypeDatabaseConnection');
const { MongoClient } = require('mongodb');
const mongoString = process.env.DATABASE_URL;
var bodyParser = require('body-parser')

const app = express()
const port = 3000;

app.use(bodyParser.json())

// PIECES
app.get('/pieces', async (req, res) => {
    const result = await getAllPieces();
    res.send(result);
})

app.post('/pieces', (req, res) => {
    const newPiece = {
        _id: uuidv4().toString(),
        name: req.body.name,
        photo: req.body.photo,
        airResistance: req.body.airResistance,
        material: req.body.material,
    };
    addPiece(newPiece);
    res.sendStatus(200);
})

app.get('/pieces/:id', async (req, res) => {
    const result = await getPiece(req.params.id);
    if(result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

app.delete('/pieces/:id', async (req, res) => {
    const result = await deletePiece(req.params.id);
    if(result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

app.put('/pieces/:id', async (req, res) => {
    const result = await putPiece(req.params.id, req.body);
    if(result === null) {
        res.send("Error");
    } else {
        res.send(result);
    }
})
// PIECES

// USERS
app.get('/users', async (req, res) => {
    const result = await getAllUsers();
    res.send(result);
})

app.post('/users', (req, res) => {
    const newUser = {
        _id: uuidv4().toString(),
        name: req.body.name,
        password: req.body.password,
        rol: req.body.rol,
    };
    addUser(newUser);
    res.sendStatus(200);
})

app.get('/users/:id', async (req, res) => {
    const result = await getUser(req.params.id);
    if(result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

app.delete('/users/:id', async (req, res) => {
    const result = await deleteUser(req.params.id);
    if(result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

// USERS

// PROTOTYPES
app.get('/prototypes', async (req, res) => {
    const result = await getAllPrototypes();
    res.send(result);
})

app.post('/prototypes', (req, res) => {
    const newPrototype = {
        _id: uuidv4().toString(),
        blade: req.body.blade,
        body: req.body.body,
        base: req.body.base,
        creator: req.body.creator,
    };
    addPrototype(newPrototype);
    res.sendStatus(200);
})

app.get('/prototypes/:id', async (req, res) => {
    const result = await getPrototype(req.params.id);
    if(result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

app.delete('/prototypes/:id', async (req, res) => {
    const result = await deletePrototype(req.params.id);
    if(result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

app.put('/prototypes/:id', async (req, res) => {
    const result = await putPrototype(req.params.id, req.body);
    if(result === null) {
        res.send("Error");
    } else {
        res.send(result);
    }
})
// PROTOTYPES

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});