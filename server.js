const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/blockchainChat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});


const Message = require('./models/Message');




// //////////////////////////////////


app.set("view engine","ejs");
const path = require("path");
app.set("views",path.join(__dirname,"/views"));


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
        console.log(chats);
        res.render('home.ejs', { chats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve chats' });
    }
});

