const { MongoClient } = require('mongodb');
const mongoString = process.env.DATABASE_URL;
const Sib = require('sib-api-v3-sdk')

require('dotenv').config()

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

async function sendEmailToRecoverPassword(email) {
    const code = genCode();

    const client = Sib.ApiClient.instance
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.API_KEY
    const tranEmailApi = new Sib.TransactionalEmailsApi()
    const sender = {
        email: 'jr@windmillapp.com',
        name: 'Windmill App',
    }
    const receivers = [
        {
            email: email,
        },
    ]
    tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Restablecer la contraseña',
        textContent: `
            Solicitaste recuperar la contraseña, :         
        `,
        htmlContent: `
        <h2>Restablecer la contraseña</h2>
        <p>Solicitaste recuperar la contraseña ingresa al siguiente link</p>
        <a href="http://localhost:4200/recover-password/${code}">Link</a>
                `,
        // params: {
        //     role: 'Frontend',
        // },
    })
    .then(console.log)
    .catch(console.log)


    const clientdb = new MongoClient(mongoString);
    try {
        const database = clientdb.db("windmill");
        const codes = database.collection("codes");
        return await codes.insertOne({ code, email });

    }
    finally {
        await clientdb.close();
    }
}

async function changePassword(code, newPassword) {
    const client = new MongoClient(mongoString);
    try {
        const database = client.db("windmill");
        const codes = database.collection("codes");
        const res = await codes.findOne({ code })
        if(!res) {
            return null;
        }
        const email = res.email
        await codes.deleteMany({ code });
        if (email) {
            const users = database.collection("users");
            const res = await users.updateOne({ name: email }, { $set: {password: newPassword} })
            return res
        } else {
            return null;
        }
    }
    finally {
        await client.close();
    }
}

function genCode() {
    var chars = "abcdefghijklmnopqrstuvwxyz";
    var passwordLength = 20;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
};



module.exports = { auth, sendEmailToRecoverPassword, changePassword }