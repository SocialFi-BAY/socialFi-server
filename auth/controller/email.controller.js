const service = require('../service/email.service');

// 인증번호 전송 API
async function sendVerificationCode(req, res) {
    const { email } = req.body;

    try {
        await service.sendVerificationCode(email);
        res.status(200).json({ message: 'Verification code sent' });
    } catch (error) {
        console.error('Failed to send code:', error);

        const statusCode = error.status || 500;
        res.status(statusCode).json({ message: error.message});
    }
}

// 인증번호 검증 API
async function checkVerificationCode(req, res) {
    const { email, code } = req.body;

    try {
        await service.checkVerificationCode(email, code);
        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        console.error('Verification failed:', error.message);

        const statusCode = error.status || 500;
        res.status(statusCode).json({ message: error.message});
    }
}

module.exports = { sendVerificationCode, checkVerificationCode };