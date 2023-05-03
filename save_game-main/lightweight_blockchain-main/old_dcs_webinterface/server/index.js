const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');
const { IncomingForm } = require('formidable');
const QRReader = require('qrcode-reader');
const jimp = require('jimp');
const pool = require('./pool');
const writer = require('./writerConnection');

// var someObj = require('../test_objects/client2writer_verify_old.json');
// function genHexString(len) {
//     const hex = '0123456789ABCDEF';
//     let output = '';
//     for (let i = 0; i < len; ++i) {
//         output += hex.charAt(Math.floor(Math.random() * hex.length));
//     }
//     return output;
// }
// someObj.forEach(payload => {
//     payload.hash = '0x' + genHexString(64);
//     payload.body.files.forEach(file => {
//         file.hash = genHexString(64);
//     })
// })
// var json = JSON.stringify(someObj)
// fs.writeFile('./test_objects/client2writer_verify.json', json, (err) => {
//     if (err) {
//         throw err;
//     }
//     console.log("JSON data is saved.");
// });

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

async function fileHash(filename, algorithm = 'sha256') {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
        const shasum = crypto.createHash(algorithm);
        try {
            const s = fs.ReadStream(filename);
            s.on('data', (data) => {
                shasum.update(data);
            });
            // making digest
            s.on('end', () => {
                const hash = shasum.digest('hex');
                return resolve(hash);
            });
        } catch (error) {
            return reject(error);
        }
    });
}

// async function readQr(filePath) {
//     const buffer = fs.readFileSync(filePath);
//     jimp.read(buffer, (err, image) => {
//         if (err) {
//             console.error(err);
//             console.log('error NOT in async');
//             // TODO handle error
//         }
//         // console.log(image.bitmap);
//         const qr = new QRReader();
//         qr.callback = function (err, value) {
//             if (err) {
//                 console.error(err);
//                 console.log(`error in async${err}`);
//                 return;
//                 // TODO handle error
//             }
//             // console.log(value.result);
//             // console.log(value);
//             return value;
//         };
//         qr.decode(image.bitmap);
//     });
// }

// Moves file to upload directory and returns object with the new path and name of file
function fileWrite(file) {
    const oldPath = file.path;
    if (!fs.existsSync(`${__dirname}/uploads`)) { // this check if uploads folder exists and creates it if it doesnt
        fs.mkdirSync(`${__dirname}/uploads`);
    }
    let newPath = `${path.join(__dirname, 'uploads')}/${file.name}`;
    let i = 1;
    let newFileName = file.name;
    // this checks if file already exists and if it does adds a incrementing number to filename
    while (fs.existsSync(newPath)) {
        const n = path.parse(file.name).name;
        const e = path.parse(file.name).ext;
        newFileName = n + i + e;
        newPath = `${path.join(__dirname, 'uploads')}/${newFileName}`;
        i += 1;
    }
    // if (fs.existsSync(newPath)) {
    //     console.log(newPath);
    //     console.log(path.parse(file.name).name);
    // }
    const rawData = fs.readFileSync(oldPath);
    fs.writeFileSync(newPath, rawData, (err) => {
        if (err) console.log(`I am an ERROR${err}`);
    });
    return { newPath, newFileName };
}

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
    console.error(`Node cluster master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });
} else {
    const app = express();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(bodyParser.json()); // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded());
    app.use(cors(corsOptions));
    // Priority serve any static files.
    app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
    app.use(cookieParser('29e4e33820735fdbf61d985fd3b575af'));

    // Answer API requests.
    app.get('/api', (req, res) => {
        res.set('Content-Type', 'application/json');
        res.send('{"message":"Hello from the custom server!"}');
    });

    app.get('/api/auth', (req, res) => {
        console.log('Get request /api/auth');
        if (req.signedCookies.name === 'admin') {
            res.send({ auth: 'admin', user_id: req.signedCookies.user_id });
        } else if (req.signedCookies.name === 'user') {
            res.send({ auth: 'user', user_id: req.signedCookies.user_id });
        } else {
            res.send({ auth: 'auth' });
        }
    });

    app.delete('/api/auth', (req, res) => {
        console.log('Delete request /api/auth');
        res.clearCookie('name').end();
    });

    app.get('/api/users', async (req, res) => {
        console.log('Get request /api/users/');
        if (req.signedCookies.name === 'admin') {
            try {
                const client = await pool.connect();
                const result = await client.query('SELECT user_id, username, email, isadmin, name, ssn FROM users');
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                client.release();
            } catch (err) {
                console.error(err);
                res.send(`Error ${err}`);
            }
        }
    });

    app.get('/api/users/:user_id', async (req, res) => {
        console.log(`Get request /api/users/${req.params.user_id}`);
        if (req.signedCookies.name === 'user') {
            try {
                const client = await pool.connect();
                const text = 'SELECT * FROM users WHERE user_id = $1';
                const values = [req.params.user_id];
                const result = await client.query(text, values);
                // console.log(result.rows);
                res.set('Content-Type', 'application/json');
                res.send(result.rows[0]);
                client.release();
            } catch (err) {
                console.error(err);
                res.send(`Error ${err}`);
            }
        }
    });

    app.post('/api/users', async (req, res) => {
        console.log('Post request /api/users/');
        if (req.signedCookies.name === 'admin') {
            try {
                const client = await pool.connect();
                const text = 'INSERT INTO users (username, password, email, isAdmin, name, ssn) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
                const values = [
                    req.body.username,
                    req.body.password,
                    req.body.email,
                    req.body.isAdmin,
                    req.body.name,
                    req.body.ssn,
                ];
                const result = await client.query(text, values);
                res.status(201);
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                client.release();
            } catch (err) {
                console.error(err);
                res.send(`Error ${err}`);
            }
        }
    });

    app.delete('/api/users/:user_id', async (req, res) => {
        console.log('Delete request /api/users/');
        if (req.signedCookies.name === 'admin') {
            try {
                const client = await pool.connect();
                const text = 'DELETE FROM users WHERE user_id=$1';
                const values = [req.params.user_id];
                const result = await client.query(text, values);
                res.status(200);
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                client.release();
            } catch (err) {
                console.error(err);
                res.send(`Error ${err}`);
            }
        }
    });

    app.post('/api/login', async (req, res) => {
        console.log('Post request /api/login/');
        const options = {
            httpOnly: true,
            signed: true,
            maxAge: 60 * 60 * 1000, // 1 hour
        };
        try {
            const client = await pool.connect();
            const text = 'SELECT * FROM users WHERE username=$1 AND password=$2';
            const values = [req.body.username, req.body.password];
            const result = await client.query(text, values);
            // console.log(result.rows[0])
            if (result.rowCount !== 0) {
                res.status(200);
                res.set('Content-Type', 'application/json');
                res.cookie('user_id', result.rows[0].user_id, options);
                if (result.rows[0].isadmin) {
                    res.cookie('name', 'admin', options).send(result.rows[0]);
                } else {
                    res.cookie('name', 'user', options).send(result.rows[0]);
                }
            } else {
                res.sendStatus(401);
            }
            client.release();
        } catch (err) {
            console.error(err);
            res.send(`Error ${err}`);
        }
    });

    app.get('/api/payloads/:user_id', async (req, res) => {
        console.log(`Get request /api/payloads/${req.params.user_id}`);
        if (req.signedCookies.name === 'user') {
            try {
                const client = await pool.connect();
                const text = 'SELECT f.file_id, p.name, p.email, p.ssn, p.sent, p.verified, p.hash, f.name file_name FROM payloads p INNER JOIN files f ON p.payload_id = f.payload_id WHERE p.user_id = $1';
                const values = [req.params.user_id];
                const result = await client.query(text, values);
                // console.log(result.rows);
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                client.release();
            } catch (err) {
                console.error(err);
                res.send(`Error ${err}`);
            }
        }
    });

    app.delete('/api/payloads', async (req, res) => {
        console.log('Delete request /api/payloads');
        if (req.signedCookies.name === 'user') {
            try {
                const client = await pool.connect();
                const text = 'DELETE FROM payloads WHERE id=$1';
                const values = [req.body.id];
                const result = await client.query(text, values);
                res.status(200);
                res.set('Content-Type', 'application/json');
                res.send(result.rows);
                client.release();
            } catch (err) {
                console.error(err);
                res.send(`Error ${err}`);
            }
        }
    });

    app.post('/api/payloads', (req, res) => {
        console.log('Post request /api/payloads');

        if (req.signedCookies.name === 'user') {
            const form = new IncomingForm();
            let payloadId = -1;
            const obj = {};
            const files = [];
            form.on('field', (field, data) => {
                obj[field] = data;
            });
            form.on('file', async (field, file) => {
                try {
                    const client = await pool.connect();
                    // This is here to prevent the payload from being added multipla times to db
                    if (payloadId === -1) {
                        const pText = 'INSERT INTO payloads (user_id, name, ssn, email, other, init_date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
                        const pValues = [
                            obj.user_id,
                            obj.name,
                            obj.ssn,
                            obj.email,
                            obj.other,
                            obj.init_date,
                        ];
                        const pResult = await client.query(pText, pValues);
                        payloadId = pResult.rows[0].payload_id;
                    }
                    const newFile = fileWrite(file);
                    const hash = await fileHash(newFile.newPath);
                    const text = 'INSERT INTO files (name, type, size, path, hash, payload_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
                    const values = [
                        newFile.newFileName,
                        file.type,
                        file.size,
                        newFile.newPath,
                        hash,
                        payloadId,
                    ];
                    const fResult = await client.query(text, values);
                    client.release();
                    files.push({ hash: fResult.rows[0].hash });
                    // obj.ssn = parseInt(obj.ssn, 10)
                    delete obj.user_id;
                    delete obj.email;
                    delete obj.init_date;
                    delete obj.other;
                    if (files.length >= form.openedFiles.length) {
                        obj.files = files;
                        // Sends the payload to writerconnection
                        // that then sends it to writer of the blockchain
                        writer.send({
                            request_type: 'submit', payload_id: payloadId, name: 'dcs', type: 'dcs', body: obj,
                        });
                    }
                } catch (err) {
                    console.error(err);
                }
            });
            form.on('end', () => {
                // console.log(files);
                res.json();
            });
            form.parse(req);
        }
    });

    app.post('/api/verify', (req, res) => {
        console.log('Post request /api/verify');
        const form = new IncomingForm();
        const obj = {};
        const msg = {
            hash: '',
            request_type: 'verify',
            name: 'dcs',
            type: 'dcs',
            body: obj,
        };
        const files = [];
        form.on('field', (field, data) => {
            obj[field] = data;
        });
        form.on('file', async (field, file) => {
            try {
                // Saves file locally temporarily to be able to use qr reader or filehash
                const newFile = fileWrite(file);
                const buffer = fs.readFileSync(newFile.newPath);
                if (file.name.startsWith('qrFile')) {
                    jimp.read(buffer, (err, image) => {
                        if (err) {
                            console.error(`${err}am I here?`);
                            res.send({ verified: false });
                            return;
                        }
                        const qr = new QRReader();
                        console.log(image.bitmap);
                        qr.callback = async (error, value) => {
                            if (error) {
                                console.error(error);
                            }
                            msg.hash = value.result;
                            // Deletes file after use
                            fs.unlinkSync(newFile.newPath);
                            if (files.length >= form.openedFiles.length - 1 && msg.hash !== '') {
                                obj.files = files;
                                msg.body = obj;
                                await writer.verify(msg, res);
                            }
                        };
                        qr.decode(image.bitmap);
                    });
                } else {
                    const hash = await fileHash(newFile.newPath);
                    // Deletes file after use
                    fs.unlinkSync(newFile.newPath);
                    files.push({ hash });
                    if (files.length >= form.openedFiles.length - 1 && msg.hash !== '') {
                        obj.files = files;
                        msg.body = obj;
                        await writer.verify(msg, res);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        });
        form.on('end', () => {
            // console.log(files);
            // res.json();
        });
        form.parse(req);
    });

    // All remaining requests return the React app, so it can handle routing.
    app.get('*', (request, response) => {
        response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
    });

    app.listen(PORT, () => {
        console.error(`Node ${isDev ? 'dev server' : `cluster worker ${process.pid}`}: listening on port ${PORT}`);
    });
}
