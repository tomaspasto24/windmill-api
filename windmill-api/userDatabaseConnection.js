const { MongoClient } = require('mongodb');
const mongoString = process.env.DATABASE_URL;

async function addUser(user) {
    MongoClient.connect(
        mongoString,
        (err, client) => {
            if (err) {
                return console.log(err)
            }
            const db = client.db('windmill')
            userCollection = db.collection('users')
            userCollection.insertOne(user);
        },
    )
}

async function getUser(userId) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const users = database.collection("users");
        const res = await users.findOne({ _id: userId })
        return res;
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
            result.push(obj);
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

module.exports = { addUser, getUser, getAllUsers, deleteUser }