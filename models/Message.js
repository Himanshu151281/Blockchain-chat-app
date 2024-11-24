const mongoose = require('mongoose');
const crypto = require('crypto');

// Blockchain structure for messages
const MessageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    content: String,
    hash: String,
    previousHash: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Function to generate a hash
MessageSchema.methods.generateHash = function () {
    const data = this.sender + this.receiver + this.content + this.previousHash + this.timestamp;
    return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = mongoose.model('Message', MessageSchema);
