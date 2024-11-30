if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());

// // MongoDB connection
// 'mongodb://127.0.0.1:27017/blockchainChat'
const dburl = process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("Connected to MongoDB ATLAS");
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

async function main(){
    await mongoose.connect(dburl);
}

const Message = require('./models/Message');




// //////////////////////////////////


app.set("view engine","ejs");
const path = require("path");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"public/js"))); // if public folder have js folder in which script file is there   //it will work from any folder
app.use(express.static(path.join(__dirname,"public/css"))); // if public folder have css folder in which css file is there   //it will work from any folder

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON data
app.use(express.json());


// ////////////////////////////////////////

let lastHash = '0'; // Genesis block hash

// Send a message
// POST http://localhost:3000/send
// {
//     "sender": "Alice",
//     "receiver": "Bob",
//     "content": "Hello, Bob!"
// }
app.post('/send', async (req, res) => {
    const { sender, receiver, content } = req.body;

    const message = new Message({
        sender,
        receiver,
        content,
        previousHash: lastHash,
    });

    // Generate hash and update lastHash
    message.hash = message.generateHash();
    lastHash = message.hash;

    await message.save();
    res.status(200).json({ message: 'Message sent!', data: message });
});

// Retrieve messages
// GET http://localhost:3000/messages
app.get('/messages', async (req, res) => {
    const messages = await Message.find();
    res.status(200).json({ messages });
});





app.get('/validate', async (req, res) => {
    const messages = await Message.find().sort({ timestamp: 1 });
    let valid = true;

    for (let i = 1; i < messages.length; i++) {
        if (messages[i].previousHash !== messages[i - 1].hash) {
            valid = false;
            break;
        }
    }

    res.status(200).json({ valid });
});






// Route to view all chats grouped by sender and receiver
app.get('/chats', async (req, res) => {
    try {
        // Retrieve all messages from the database
        const messages = await Message.find().sort({ timestamp: 1 });

        // Group messages by sender and receiver
        const chats = {};
        messages.forEach((msg) => {
            const key = [msg.sender, msg.receiver].sort().join('-'); // Unique chat key for two users
            if (!chats[key]) {
                chats[key] = [];
            }
            chats[key].push({
                sender: msg.sender,
                receiver: msg.receiver,
                content: msg.content,
                timestamp: msg.timestamp,
                hash: msg.hash,
                previousHash: msg.previousHash,
            });
        });

        // Render the home.ejs template with the chats data
        // console.log(chats);
        res.render('home.ejs', { chats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve chats' });
    }
});

// app.get('/view',(req,res)=>{
//     console.log("view route");
//     res.render("view.ejs");
// })

app.get('/adam',async (req,res)=>{
    try {
        // Retrieve all messages from the database
        const messages = await Message.find().sort({ timestamp: 1 });

        // Group messages by sender and receiver
        const chats = {};
        messages.forEach((msg) => {
            const key = [msg.sender, msg.receiver].sort().join('-'); // Unique chat key for two users
            if (!chats[key]) {
                chats[key] = [];
            }
            chats[key].push({
                sender: msg.sender,
                receiver: msg.receiver,
                content: msg.content,
                timestamp: msg.timestamp,
                hash: msg.hash,
                previousHash: msg.previousHash,
            });
        });

        // Render the home.ejs template with the chats data
        // console.log(chats);
        res.render('adam.ejs', { chats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve chats' });
    }
    // res.render("adam.ejs");
});

app.post('/adam', async(req,res)=>{
    console.log("adam route");
    const { content } = req.body;
    console.log(content);
    if(content){
        const message = new Message({
            sender:"Adam",
            receiver:"Bob",
            content,
            previousHash: lastHash,
        });    
        // Generate hash and update lastHash
        message.hash = message.generateHash();
        lastHash = message.hash;
    
        await message.save();
        // res.status(200).json({ message: 'Message sent!', data: message });
        res.redirect('adam');
    } else {
        res.redirect('adam');
    }
});



// const { sender, receiver, content } = req.body;

    // const message = new Message({
    //     sender,
    //     receiver,
    //     content,
    //     previousHash: lastHash,
    // });

//     // Generate hash and update lastHash
//     message.hash = message.generateHash();
//     lastHash = message.hash;

//     await message.save();
//     res.status(200).json({ message: 'Message sent!', data: message });



app.get('/bob', async(req,res)=>{
    try {
        // Retrieve all messages from the database
        const messages = await Message.find().sort({ timestamp: 1 });

        // Group messages by sender and receiver
        const chats = {};
        messages.forEach((msg) => {
            const key = [msg.sender, msg.receiver].sort().join('-'); // Unique chat key for two users
            if (!chats[key]) {
                chats[key] = [];
            }
            chats[key].push({
                sender: msg.sender,
                receiver: msg.receiver,
                content: msg.content,
                timestamp: msg.timestamp,
                hash: msg.hash,
                previousHash: msg.previousHash,
            });
        });

        // Render the home.ejs template with the chats data
        // console.log(chats);
        res.render('bob.ejs', { chats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve chats' });
    }
    // res.render("bob.ejs");
});

app.post('/bob', async(req,res)=>{
    console.log("bob route");
    const { content } = req.body;
    console.log(content);
    if(content){
        const message = new Message({
            sender:"Bob",
            receiver:"Adam",
            content,
            previousHash: lastHash,
        });    
        // Generate hash and update lastHash
        message.hash = message.generateHash();
        lastHash = message.hash;
    
        await message.save();
        // res.status(200).json({ message: 'Message sent!', data: message });
        res.redirect('bob');
    } else {
        res.redirect('bob');
    }
});


// New Feature - Reload only messages section
// v - 0.1.0
app.get('/reload', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        const chats = {};
        messages.forEach((msg) => {
            const key = [msg.sender, msg.receiver].sort().join('-');
            if (!chats[key]) {
                chats[key] = [];
            }
            chats[key].push(msg);
        });
        res.json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve chats' });
    }
});