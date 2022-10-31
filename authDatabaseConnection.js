const { MongoClient } = require('mongodb');
const mongoString = process.env.DATABASE_URL;



async function auth(user, password) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const pieces = database.collection("users");
        const res = await pieces.findOne({ name: user });
        if (res) {
            if (res.password === password) {
                return res;
            }
        }
        return null;
    }
    finally {
        await client.close();
    }
}



module.exports = { auth }