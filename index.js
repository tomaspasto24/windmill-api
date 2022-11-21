require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const Model = require('./model');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { addPiece, getPiece, getAllPieces, putPiece, deletePiece } = require('./pieceDatabaseConnection');
const { addUser, getUser, getAllUsers, deleteUser, putUser } = require('./userDatabaseConnection');
const { addPrototype, getPrototype, getAllPrototypes, putPrototype, deletePrototype, changeValidatePrototype } = require('./prototypeDatabaseConnection');
const { auth, sendEmailToRecoverPassword, changePassword } = require('./authDatabaseConnection');
const { MongoClient } = require('mongodb');
const mongoString = process.env.DATABASE_URL;
var bodyParser = require('body-parser');

// Create multer object

const app = express()
var corsOptions = {
    origin: ['http://localhost:4200', 'http://localhost:8100'],
    optionsSuccessStatus: 200,
    methods: "GET, PUT, DELETE"
}
const port = 3000;

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log(`Method: ${req.method} - Route: ${req.originalUrl} - Date: ${Date.now()}`)
    if(req.originalUrl !== '/auth') {
        const bearerHeader = req.headers['authorization'];
        if(bearerHeader !== undefined) {
            const bearer = bearerHeader.split(' ')[1];
            var decoded = jwt.verify(bearer, 'secreto', Date.now());

            const rol = parseInt(decoded.data.split(' ')[1])
            if (rol === 1 || rol === 2 || rol === 3) {
                next();
            } else {
            }
        } else {
        }
    } else {
        next();
    }
})


// IMAGE
const imageUpload = multer({
    storage: multer.diskStorage(
        {
            destination: function (req, file, cb) {
                cb(null, 'images/');
            },
            filename: function (req, file, cb) {
                cb(
                    null,
                    new Date().valueOf() +
                    '_' +
                    file.originalname
                );
            }
        }
    ),
});

app.get('/image/:filename', (req, res) => {
    const { filename } = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'images/' + filename);
    return res.sendFile(fullfilepath);
});

app.post('/image', imageUpload.single('image'), (req, res) => {
    res.json(req.file);
});

// IMAGE

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
        type: req.body.type
    };
    addPiece(newPiece);
    res.sendStatus(200);
})

app.get('/pieces/:id', async (req, res) => {
    const result = await getPiece(req.params.id);
    if (result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

app.delete('/pieces/:id', async (req, res) => {
    const result = await deletePiece(req.params.id);
    if (result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

app.put('/pieces/:id', async (req, res) => {
    let result;
    if (req.body.photo === "") {
        const oldPhoto = await getPiece(req.params.id);
        result = await putPiece(req.params.id, {
            name: req.body.name,
            airResistance: req.body.airResistance,
            photo: oldPhoto.photo,
            material: req.body.material,
            type: req.body.type
        });
    } else {
        result = await putPiece(req.params.id, req.body);
    }
    if (result === null) {
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

app.put('/users/:id', async (req, res) => {
    const { name, password, rol } = req.body;
    const r = await putUser(req.params.id, name, password, rol);
    res.send(r);
})

app.get('/users/:id', async (req, res) => {
    const result = await getUser(req.params.id);
    if (result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

app.delete('/users/:id', async (req, res) => {
    const result = await deleteUser(req.params.id);
    if (result === null) {
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

app.post('/prototypes', async (req, res) => {
    const newPrototype = {
        _id: uuidv4().toString(),
        name: req.body.name,
        description: req.body.description,
        blade: req.body.blade,
        body: req.body.body,
        base: req.body.base,
        creator: req.body.creator,
        validated: 'Pendiente'
    };
    const result = await addPrototype(newPrototype);
    res.send(result);
})

app.post('/prototypes/changeValidate/:id', async (req, res) => {
    const { id } = req.params;
    const { validated } = req.body;
    const result = await changeValidatePrototype(id, validated);
    res.send(result);
})

app.get('/prototypes/:id', async (req, res) => {
    const result = await getPrototype(req.params.id);
    if (result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

app.delete('/prototypes/:id', async (req, res) => {
    const result = await deletePrototype(req.params.id);
    if (result === null) {
        res.send("No encontrado.");
    } else {
        res.send(result);
    }
})

app.put('/prototypes/:id', async (req, res) => {
    const result = await putPrototype(req.params.id, req.body);
    if (result === null) {
        res.send("Error");
    } else {
        res.send(result);
    }
})
// PROTOTYPES

// AUTH

app.post('/auth', async (req, res) => {
    const username = req.body.user;
    const password = req.body.password;

    console.log(username, password)

    const userData = await auth(username, password);

    if (userData) {
        var token = jwt.sign({
            data: `{rol: ${userData.rol}}`
        }, 'secreto');
        console.log(token)
        res.send({
            token,
            userData
        });
    } else {
        res.send({
            error: 'Usuario o contraseña incorrectos.'
        });
    }
})

app.post('/register', async (req, res) => {
    const username = req.body.user;
    const password = req.body.password;
    const rol = req.body.rol;

    const result = await addUser({
        _id: uuidv4().toString(),
        name: username,
        password,
        rol: (!isNaN(rol)) ? rol : 0
    });

    res.send(result);
})

app.post('/sendemail', async (req, res) => {
    const email = req.body.email;
    const result = await sendEmailToRecoverPassword(email);

    res.send(result);
});

app.post('/changePassword', async (req, res) => {
    const code = req.body.code;
    const newPassword = req.body.newPassword;
    const result = await changePassword(code, newPassword);
    if (result) {
        res.send(result);
    } else {
        res.send({ error: "No se encuentra el código." });
    }
});

// AUTH

app.listen(port, () => {
});