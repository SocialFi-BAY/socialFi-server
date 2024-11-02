const emailService = require('../service/email.service');

class EmailController {
    async sendVerificationCode(req, res) {
        const { email } = req.body;

        try {
            await emailService.sendVerificationCode(email);
            res.status(200).json({ message: 'Verification code sent' });
        } catch (error) {
            console.error('Failed to send code:', error);
            const statusCode = error.status || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    async checkVerificationCode(req, res) {
        const { email, code } = req.body;

        try {
            await emailService.checkVerificationCode(email, code);
            res.status(200).json({ message: 'Verification successful' });
        } catch (error) {
            console.error('Verification failed:', error.message);
            const statusCode = error.status || 500;
            res.status(statusCode).json({ message: error.message });
        }
    }
}

module.exports = new EmailController();
