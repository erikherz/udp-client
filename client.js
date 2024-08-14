const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const SPLITTER_HOST = '18.205.176.175';  // Replace with your splitter's IP if different
const SPLITTER_PORT = 443;           // The port you bound the splitter to
const CLIENT_PORT = 5006;            // The port for the client to bind and listen on
const KEY = 'key123';                // The key you want to send
const MESSAGE_INTERVAL = 5000;       // Interval in milliseconds (5000 ms = 5 seconds)

// Bind the client to a specific port to listen for incoming data
client.bind(CLIENT_PORT, () => {
    console.log(`Client bound to port ${CLIENT_PORT}`);
    
    // Send the key to the splitter after binding
    client.send(KEY, SPLITTER_PORT, SPLITTER_HOST, (err) => {
        if (err) {
            console.error(`Error sending key: ${err.message}`);
            client.close();
        } else {
            console.log(`Key "${KEY}" sent to ${SPLITTER_HOST}:${SPLITTER_PORT}`);
        }
    });

    // Function to send a message every 5 seconds
    function sendMessage() {
        const message = 'Hello, this is some data!';
        client.send(message, SPLITTER_PORT, SPLITTER_HOST, (err) => {
            if (err) {
                console.error(`Error sending message: ${err.message}`);
                client.close();
            } else {
                console.log(`Message sent: "${message}"`);
            }
        });
    }

    // Wait 5 seconds, then start sending data in a loop
    setTimeout(() => {
        sendMessage();
        setInterval(sendMessage, MESSAGE_INTERVAL);
    }, MESSAGE_INTERVAL);
});

// Listen for incoming messages from the splitter
client.on('message', (msg, rinfo) => {
    console.log(`Received message from ${rinfo.address}:${rinfo.port} - ${msg.toString()}`);
});

// Handle any errors
client.on('error', (err) => {
    console.error(`Client error: ${err.stack}`);
    client.close();
});

