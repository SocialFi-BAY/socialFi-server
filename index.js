const express = require('express');
const app = express();
const cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const {createAuth, VerifyLoginPayloadParams} = require('thirdweb/auth');
const {privateKeyToAccount} = require('thirdweb/wallets');
const {thirdwebClient} = require('./thirdwebClient');

module.exports.thirdwebAuth = createAuth({
    domain: process.env.CLIENT_DOMAIN,
    client: thirdwebClient,
    adminAccount: privateKeyToAccount({
        client: thirdwebClient,
        privateKey: process.env.ADMIN_PRIVATE_KEY,
    }),
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
    cors({
        origin: `${
            process.env.NODE_ENV === "development" ? "http" : "https"
        }://${process.env.CLIENT_DOMAIN}`,
        credentials: true,
    })
);


const auth = require('./auth/route');
const verifyToken = require('./middleware/interceptor');

app.use(verifyToken);
app.use('/api/auth', auth);

// 서버 실행
const port = 8080;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

module.exports = app;