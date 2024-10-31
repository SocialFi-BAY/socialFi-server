const { validationResult } = require('express-validator');
const authService = require('../service/auth.service');

class AuthController {
    async getLogin(req, res) {
        const address = req.query.address;
        const chainId = req.query.chainId;

        if (typeof address !== 'string') {
            return res.status(400).send('Address is required');
        }

        const payload = await authService.generatePayload(address, chainId);
        return res.send(payload);
    }

    async postLogin(req, res) {
        try {
            const tokens = await authService.postLogin(req.body);

            res.setHeader('Authorization', `Bearer ${tokens.accessToken}`);
            return res.status(200).json({
                message: 'Login successful',
                refreshToken: tokens.refreshToken,
            });
        } catch (error) {
            const statusCode = error.message === 'User not found' ? 404 : 400;
            return res.status(statusCode).json({ message: error.message });
        }
    }

    async isLoggedIn(req, res) {
        return res.send(true);
    }

    async register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }

        try {
            const user = await authService.createUser(req.body);
            return res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            res.status(400).json({ message: 'Registration failed', error: error.message });
        }
    }

    async refresh(req, res) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        try {
            const { address, valid } = await authService.verifyRefreshToken(refreshToken);

            if (!valid) {
                return res.status(404).json({ message: 'Invalid refresh token' });
            }
            const { newAccessToken, newRefreshToken } = await authService.updateRefreshToken(address);

            return res.status(200).json({
                message: 'Tokens refreshed successfully',
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        } catch (error) {
            console.log(error.message);
            return res.status(401).json({ message: 'Invalid refresh token', error: error.message });
        }
    }
}

module.exports = new AuthController();
