# Blockchain Chat Application

This project is a simple chat application that uses a blockchain structure to store messages. Each message is stored as a block in the blockchain, ensuring data integrity and security.

## Features

- Send and receive messages between users.
- Messages are stored in a blockchain structure.
- View all chats grouped by sender and receiver.
- Validate the integrity of the blockchain.

## Setup

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/blockchain-chat.git
    cd blockchain-chat
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start MongoDB:

    ```bash
    mongod
    ```

4. Start the server:

    ```bash
    npm start
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Example

- ### Adam homepage `/adam` 👇
![image](https://github.com/Himanshu151281/Project_Attachments/blob/690d69c7804106c6c41a2b0a35b81a4ca28f0087/Adam_chat_1.png)

- ### Bob homepage `/bob` 👇
![image](https://github.com/Himanshu151281/Project_Attachments/blob/690d69c7804106c6c41a2b0a35b81a4ca28f0087/Bob_chat_1.png)

- ### Both homepages are shown together 👇
![image](https://github.com/Himanshu151281/Project_Attachments/blob/690d69c7804106c6c41a2b0a35b81a4ca28f0087/AB_02.png)

- ### Adam's message to send 👇
![image](https://github.com/Himanshu151281/Project_Attachments/blob/690d69c7804106c6c41a2b0a35b81a4ca28f0087/AB_03.png)

- ### A message was sent from Adam and received by Bob 👇
![image](https://github.com/Himanshu151281/Project_Attachments/blob/690d69c7804106c6c41a2b0a35b81a4ca28f0087/AB_04.png)

- ### Bob's message to send 👇
![image](https://github.com/Himanshu151281/Project_Attachments/blob/690d69c7804106c6c41a2b0a35b81a4ca28f0087/AB_05.png)

- ### A message was sent from Bob and received by Adam 👇
![image](https://github.com/Himanshu151281/Project_Attachments/blob/690d69c7804106c6c41a2b0a35b81a4ca28f0087/AB_06.png)

## Routes

### POST `/send`

- **Description**: Send a message.
- **Request Body**:
    ```json
    {
      "sender": "Alice",
      "receiver": "Bob",
      "content": "Hello, Bob!"
    }
    ```
- **Response**:
    ```json
    {
      "message": "Message sent!",
      "data": {
        "sender": "Alice",
        "receiver": "Bob",
        "content": "Hello, Bob!",
        "hash": "generated_hash",
        "previousHash": "previous_hash",
        "timestamp": "timestamp"
      }
    }
    ```

### GET `/messages`

- **Description**: Retrieve all messages.
- **Response**:
    ```json
    {
      "messages": [
        {
          "sender": "Alice",
          "receiver": "Bob",
          "content": "Hello, Bob!",
          "hash": "generated_hash",
          "previousHash": "previous_hash",
          "timestamp": "timestamp"
        },
        ...
      ]
    }
    ```

### GET `/validate`

- **Description**: Validate the integrity of the blockchain.
- **Response**:
    ```json
    {
      "valid": true
    }
    ```

### GET `/chats`

- **Description**: View all chats grouped by sender and receiver.
- **Response**: Renders the `home.ejs` template with the chats data.

### GET `/adam`

- **Description**: View Adam's chat.
- **Response**: Renders the `adam.ejs` template with the chats data.

### POST `/adam`

- **Description**: Send a message from Adam to Bob.
- **Request Body**:
    ```json
    {
      "content": "Hello, Bob!"
    }
    ```
- **Response**: Redirects to the `/adam` route.

### GET `/bob`

- **Description**: View Bob's chat.
- **Response**: Renders the `bob.ejs` template with the chats data.

### POST `/bob`

- **Description**: Send a message from Bob to Adam.
- **Request Body**:
    ```json
    {
      "content": "Hello, Adam!"
    }
    ```
- **Response**: Redirects to the `/bob` route.

## File Structure

- `server.js`: Main server file.
- `models/Message.js`: Mongoose schema and model for messages.
- `views/`: EJS templates for rendering the chat pages.
- `public/css/style.css`: CSS file for styling.
- `public/js/app.js`: JavaScript file for client-side functionality.

## License

This project is licensed under the MIT License.
