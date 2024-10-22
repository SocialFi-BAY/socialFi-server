const {createThirdwebClient} = require('thirdweb');

const secretKey = process.env.THIRDWEB_SECRET_KEY;

module.exports.thirdwebClient = createThirdwebClient({ secretKey });