const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const transporter = require('../../index');
const prisma = new PrismaClient();

class EmailService {
    async sendVerificationCode(email) {
        // 회원 존재 여부 확인
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            const error = new Error('Already registered User');
            error.status = 409;
            throw error;
        }

        const code = crypto.randomInt(100000, 999999).toString(); // 6자리 코드 생성
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 만료 시간 (5분 후)

        await prisma.verificationCode.upsert({
            where: { email },
            update: { code, expiresAt },
            create: { email, code, expiresAt },
        });

        // 이메일 전송
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Q.BE : 회원가입 인증번호 안내',
            text: `안녕하세요? Q.BE입니다. 인증번호를 확인하시고 회원가입을 진행해주세요\n인증번호 : ${code}`,
        });
    }

    async checkVerificationCode(email, code) {
        const record = await prisma.verificationCode.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' },
        });

        if (!record) {
            const error = new Error('Verification code not found');
            error.status = 404;
            throw error;
        }

        if (record.code !== code) {
            const error = new Error('Invalid verification code');
            error.status = 409; // 409 Conflict
            throw error;
        }

        if (record.expiresAt < new Date()) {
            const error = new Error('Verification code expired');
            error.status = 410; // 410 Gone
            throw error;
        }
    }
}

module.exports = new EmailService();
