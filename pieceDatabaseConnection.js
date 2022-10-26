const { MongoClient } = require('mongodb');
const mongoString = process.env.DATABASE_URL;

async function addPiece(piece) {
    MongoClient.connect(
        mongoString,
        (err, client) => {
            if (err) {
                return console.log(err)
            }
            const db = client.db('windmill')
            pieceCollection = db.collection('pieces')
            pieceCollection.insertOne(piece);
        },
    )
}

async function getPiece(pieceId) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const pieces = database.collection("pieces");
        const res = await pieces.findOne({ _id: pieceId })
        return res;
    }
    finally {
        await client.close();
    }
}

async function getAllPieces() {
    const client = new MongoClient(mongoString);
    const result = [];
    try {
        const database = client.db("windmill");
        const pieces = database.collection("pieces");
        const cursor = pieces.find();
        await cursor.forEach(obj => {
            result.push(obj);
        });
    }
    finally {
        await client.close();
    }
    return result;
}

async function putPiece(pieceId, newPiece) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const pieces = database.collection("pieces");
        const res = await pieces.replaceOne({ _id: pieceId }, newPiece)
        return res;
    }
    finally {
        await client.close();
    }
}

async function deletePiece(pieceId) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const pieces = database.collection("pieces");
        const res = await pieces.deleteOne({ _id: pieceId })
        return res;
    }
    finally {
        await client.close();
    }
}

module.exports = { addPiece, getPiece, getAllPieces, putPiece, deletePiece }