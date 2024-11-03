const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CommentService {
    async createComment({ userId, postId, content, parentId }) {
        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post || !post.status) {
            const error = new Error('Invalid or deleted post');
            error.status = 404;
            throw error;
        }

        return prisma.comment.create({
            data: { userId, postId, content, parentId },
        });
    }

    async updateComment(commentId, userId, content) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { userId: true, status: true }  // 필요한 필드만 선택하여 조회
        });

        if (!comment || comment.userId !== userId || !comment.status) {
            const error = new Error('Comment not found or unauthorized');
            error.status = 403;
            throw error;
        }

        return prisma.comment.update({
            where: { id: commentId },
            data: { content, updatedAt: new Date() },
        });
    }


    async deleteComment(commentId, userId) {
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });

        if (!comment || comment.userId !== userId) {
            const error = new Error('Comment not found or unauthorized');
            error.status = 403;
            throw error;
        }

        return prisma.comment.update({
            where: { id: commentId },
            data: { status: false },
        });
    }
}

module.exports = new CommentService();
