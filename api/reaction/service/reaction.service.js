const { PrismaClient, ReactionType } = require('@prisma/client');
const prisma = new PrismaClient();

class ReactionService {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async createReaction(data) {
        const { userId, targetId, targetType, reactionType } = data;

        // 반대 타입의 리액션을 비활성화
        await this.deactivateOppositeReaction(userId, targetId, targetType, reactionType);

        // 기존에 동일한 리액션이 있는지 확인
        const existingReaction = await this.getExistingReaction(userId, targetId, targetType, reactionType);

        if (existingReaction) {
            // 동일한 리액션이 있을 경우 덮어쓰기
            return this.updateExistingReaction(existingReaction.id);
        } else {
            // 새 리액션 생성
            return this.createNewReaction(data);
        }
    }


    async deleteReaction({ targetType, targetId, reactionType, userId }) {
        return prisma.reaction.updateMany({
            where: {
                targetType,
                targetId,
                reactionType,
                userId,
                status: true,
            },
            data: { status: false },
        });
    }


    // 기존의 동일한 리액션을 찾는 함수
    async getExistingReaction(userId, targetId, targetType, reactionType) {
        return prisma.reaction.findFirst({
            where: {
                userId,
                targetId,
                targetType,
                reactionType,
            },
        });
    }

    // 기존 리액션을 업데이트하는 함수 (덮어쓰기)
    async updateExistingReaction(id) {
        return prisma.reaction.update({
            where: { id },
            data: {
                status: true,
                updatedAt: new Date(),
            },
        });
    }

    // 반대 타입의 리액션을 비활성화하는 함수
    async deactivateOppositeReaction(userId, targetId, targetType, reactionType) {
        if (reactionType === ReactionType.LIKE || reactionType === ReactionType.DISLIKE) {
            await prisma.reaction.updateMany({
                where: {
                    userId,
                    targetId,
                    targetType,
                    reactionType: reactionType === ReactionType.LIKE ? ReactionType.DISLIKE : ReactionType.LIKE,
                    status: true,
                },
                data: {
                    status: false,
                },
            });
        }
    }

    // 새 리액션을 생성하는 함수
    async createNewReaction(data) {
        return prisma.reaction.create({
            data,
        });
    }
}

module.exports = new ReactionService();
