const net = require('net');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
// The info about email that is sending from
const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '147f51c055e339',
        pass: '664d0e2ec3d0db',
    },
});
const QRCode = require('qrcode');
const pool = require('./pool');

const writerPort = 5005;
const writerHost = '127.0.0.1';
const socket = new net.Socket();
socket.connect(writerPort, writerHost);
let connected = false;
const queue = [];
async function createObj(obj) {
    // console.log(obj.payload_id);
    const newObj = obj;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM files WHERE payload_id = $1', [newObj.payload_id]);
    client.release();
    const files = [];
    if (result.rowCount > 0) {
        result.rows.forEach((file) => files.push(file));
    }
    newObj.files = files;
    queue.push({
        payload_id: newObj.payload_id, name: 'dcs', type: 'dcs', body: newObj,
    });
}
async function write(obj) {
    try {
        // if(queue.length > 0){
        //     socket.write(obj);
        // }
        console.log(`Sending to writer: ${JSON.stringify(obj)}`);
        // console.log('Data sent to be added to chain: ');
        // console.log(obj);
        // console.log(obj.body.files);
        socket.write(JSON.stringify(obj));
        const client = await pool.connect();
        // Saves into database that the payload was sent
        client.query('UPDATE payloads SET sent = true WHERE payload_id = $1', [obj.payload_id]);
        client.release();
    } catch (e) {
        console.log(e);
    }
}
const send = (obj) => {
    if (connected) {
        write(obj);
    }
};
// Sends an obj to writer that the writer is supposed to verfy is in the chain and then waits for
// response and sends that back to the client
const verify = async (obj, res) => {
    if (connected) {
        console.log(`Data sent for verification: ${JSON.stringify(obj)}`);
        // console.log(obj);
        socket.write(JSON.stringify(obj));
        socket.on('data', (data) => {
            const parsedData = JSON.parse(data);
            try {
                if (Object.prototype.hasOwnProperty.call(parsedData, 'verified')) {
                    res.send(parsedData);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
};
socket.on('error', (err) => {
    // console.log(err);
});
socket.on('connect', async () => {
    connected = true;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM payloads WHERE sent = false');
    client.release();
    if (result.rowCount > 0) {
        const promises = [];
        for (const row of result.rows) {
            promises.push(createObj(row));
        }
        await Promise.all(promises);
        write(queue.shift());
    }
});
socket.on('data', async (data) => {
    console.log(`RESPONSE: ${data}`);
    const parsedData = JSON.parse(data);
    // Waits for message recieved before sending more data
    if (Object.prototype.hasOwnProperty.call(parsedData, 'message_received')
        && parsedData.message_received) {
        if (queue.length > 0) {
            write(queue.shift());
        }
    }
    // Checks if data format is for when confirming payload has been added to chain
    if (
        Object.prototype.hasOwnProperty.call(parsedData, 'payload_id')
        && Object.prototype.hasOwnProperty.call(parsedData, 'hash')
        && Object.prototype.hasOwnProperty.call(parsedData, 'time_added_to_chain')
    ) {
        try {
            const client = await pool.connect();
            // updates payload in database to add that it is varified and the ticket
            const text = 'UPDATE payloads SET verified = true, hash = $1, time_added_to_chain = $2 WHERE payload_id = $3';
            const values = [parsedData.hash, parsedData.time_added_to_chain, parsedData.payload_id];
            await client.query(text, values);
            // Get the email of the user that initially uploaded the payload
            const text2 = 'SELECT u.email FROM users u INNER JOIN payloads p ON p.user_id = u.user_id WHERE p.payload_id = $1';
            const values2 = [parsedData.payload_id];
            const result = await client.query(text2, values2);

            client.release();
            // const mycanvas = createCanvas(200, 200)
            if (!fs.existsSync(`${__dirname}/qrcodes`)) { // this check if qrcodes folder exists and creates it if it doesnt
                fs.mkdirSync(`${__dirname}/qrcodes`);
            }
            const newPath = `${path.join(__dirname, 'qrcodes')}/qr${data.hash}.png`;
            // Generates QRCode and then sends it via email
            QRCode.toFile(newPath, data.hash, (err) => {
                if (err) {
                    console.log(err);
                }
                // console.log(mycanvas)
                const message = {
                    from: 'dsc@dcs.is', // Sender address
                    to: result.rows[0].email, // List of recipients
                    subject: 'data.hash', // Subject line
                    text: data.hash,
                    attachments: [
                        { // Use a URL as an attachment
                            filename: `qr${data.hash}.png`,
                            path: newPath,
                        },
                    ],
                };
                transport.sendMail(message, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(info);
                    }
                });
            });
        } catch (e) {
            console.log(e);
        }
    }
});
socket.on('end', () => {
    console.log('DONE');
    connected = false;
});
socket.on('drain', () => {
    console.log('drain!');
});
socket.on('close', (hadError) => {
    if (hadError) {
        // console.log('Closed because of error')
        socket.connect(writerPort, writerHost);
    }
    connected = false;
});

exports.send = send;
exports.verify = verify;
