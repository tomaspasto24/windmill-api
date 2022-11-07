const { MongoClient } = require('mongodb');
const mongoString = process.env.DATABASE_URL;

async function addPrototype(prototype) {

    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const prototypeList = database.collection("prototypes");
        const res = await prototypeList.insertOne(prototype);
        return res;
    }
    finally {
        await client.close();
    }
}

async function getPrototype(prototypeId) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const prototypes = database.collection("prototypes");
        const res = await prototypes.findOne({ _id: prototypeId })
        return res;
    }
    finally {
        await client.close();
    }
}

async function getAllPrototypes() {
    const client = new MongoClient(mongoString);
    const result = [];
    try {
        const database = client.db("windmill");
        const prototypes = database.collection("prototypes");
        const cursor = prototypes.find();
        await cursor.forEach(obj => {
            result.push(obj);
        });
    }
    finally {
        await client.close();
    }
    return result;
}

async function putPrototype(pieceId, newPiece) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const prototypes = database.collection("prototypes");
        const res = await prototypes.replaceOne({ _id: pieceId }, newPiece)
        return res;
    }
    finally {
        await client.close();
    }
}

async function deletePrototype(pieceId) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const prototypes = database.collection("prototypes");
        const res = await prototypes.deleteOne({ _id: pieceId })
        return res;
    }
    finally {
        await client.close();
    }
}

module.exports = { addPrototype, getPrototype, getAllPrototypes, putPrototype, deletePrototype }