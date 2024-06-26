const express = require('express');
const jwt = require('jsonwebtoken');

// initialize app
const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
    
});

app.post('/api/login', async (req, res) => {
   // Mock user
   const user = {
    id: 1,
    username: 'Brad',
    email: 'brad@gmail.com'
   }
    jwt.sign({ user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token
        });
    });
    
});

//FORMAT OF TOKEN
// authorization: bearer <access_token>
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // split at the space
        const bearer = bearerHeader.split(' ');
        // get token from array
        const bearerToken = bearer[1];
        // set the token
        req.token = bearerToken;
        next();
    } else {
        // res.json({ message: 'Bearer header is undefined'});
        res.sendStatus(403);
    }
}

app.listen(3000, () => console.log('Server started on port 3000'))