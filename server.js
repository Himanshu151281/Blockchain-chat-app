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
const dburl = "mongodb://127.0.0.1:27017/blockchainChat";
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

async function initializeLastHash() {
    // const oldestMessage = await Message.find().sort({ createdAt: 1 }).limit(1);
    const oldestMessage = await Message.find().sort({ createdAt: 1 });
    console.log(oldestMessage);
    if (oldestMessage.length > 0) {
        lastHash = oldestMessage[oldestMessage.length-1].hash;
    }
}

initializeLastHash();

// Send a message
// POST http://localhost:3000/send
// {
//     "sender": "Alice",
//     "receiver": "Bob",
//     "content": "Hello, Bob!"
// }
app.post('/send', async (req, res) => {
    const { sender, receiver, content } = req.body;

    try {
        // Check if there are any existing messages between sender and receiver
        const existingMessages = await Message.find({ sender, receiver }).sort({ createdAt: 1 });
        console.log(existingMessages);
        let isHashExists = null;
        if (existingMessages.length > 0) {
            isHashExists = existingMessages[existingMessages.length-1].hash;
        } else{
            isHashExists = '0';
        }
        // isHashExists = existingMessages ? existingMessages.hash : '0';

        const message = new Message({
            sender,
            receiver,
            content,
            previousHash: isHashExists,
        });

        // Generate hash for the new message
        message.hash = message.generateHash();
        // lastHash = message.hash;

        await message.save();
        res.status(200).json({ message: 'Message sent!', data: message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Retrieve messages
// GET http://localhost:3000/messages
app.get('/messages', async (req, res) => {
    const messages = await Message.find();
    res.status(200).json({ messages });
});





app.get('/validate', async (req, res) => {
    const messages = await Message.find().sort({ timestamp: 1 });
    const userPairs = {};

    // Group messages by sender-receiver pairs and receiver-sender pairs
    messages.forEach((msg) => {
        const pairKey1 = `${msg.sender}-${msg.receiver}`;
        const pairKey2 = `${msg.receiver}-${msg.sender}`;
        if (!userPairs[pairKey1]) {
            userPairs[pairKey1] = [];
        }
        if (!userPairs[pairKey2]) {
            userPairs[pairKey2] = [];
        }
        userPairs[pairKey1].push(msg);
        userPairs[pairKey2].push(msg);
    });

    let overallValid = true;
    const validationResults = {};

    // Validate each user pair's chat history
    for (const pairKey in userPairs) {
        const pairMessages = userPairs[pairKey];
        let pairValid = true;

        for (let i = 1; i < pairMessages.length; i++) {
            if (pairMessages[i].previousHash !== pairMessages[i - 1].hash) {
                pairValid = false;
                overallValid = false;
                break;
            }
        }

        validationResults[pairKey] = pairValid;
    }

    res.status(200).json({ valid: overallValid, validationResults });
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

app.get('/',(req,res)=>{
    res.render("index.ejs");
})