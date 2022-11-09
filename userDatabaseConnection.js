const { MongoClient } = require('mongodb');
const mongoString = process.env.DATABASE_URL;

async function addUser(user) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const users = database.collection("users");
        const res = await users.insertOne(user)
        return res;
    }
    finally {
        await client.close();
    }
}

async function putUser(id, name, password, rol) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const users = database.collection("users");
        const res = await users.replaceOne({ _id: id }, { name, password, rol })
        return res;
    }
    finally {
        await client.close();
    }
}

async function getUser(userId) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const users = database.collection("users");
        const res = await users.findOne({ _id: userId })
        return {
            _id: res._id,
            name: res.name,
            password: res.password,
            role: res.rol
        };
    }
    finally {
        await client.close();
    }
}

async function getAllUsers() {
    const client = new MongoClient(mongoString);
    const result = [];
    try {
        const database = client.db("windmill");
        const users = database.collection("users");
        const cursor = users.find();
        await cursor.forEach(obj => {
            result.push({
                _id: obj._id,
                name: obj.name,
                password: obj.password,
                role: obj.rol
            });
        });
    }
    finally {
        await client.close();
    }
    return result;
}

async function deleteUser(userId) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const users = database.collection("users");
        const res = await users.deleteOne({ _id: userId })
        return res;
    }
    finally {
        await client.close();
    }
}

module.exports = { addUser, getUser, getAllUsers, deleteUser, putUser }