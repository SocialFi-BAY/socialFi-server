const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const PostResponse = require('../dto/response/post.response');

class PostService {

    async createPost({title, content, photos, userId}) {
        const post = await prisma.post.create({
            data: {
                userId,
                title,
                content,
                photos: {
                    create: photos.map((photo) => ({url: photo}))
                },
                status: true
            },
            include: {
                photos: true,
                comments: true
            }
        });
        return new PostResponse(post);
    }

    async getPostById(id) {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(id),
                status: true
            },
            include: {
                photos: true,
                comments: true
            }
        });

        if (!post) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
        }

        return post;
    }

    async updatePost(id, userId, {title, content, photos}) {
        // 게시글 존재 여부 확인
        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(id),
                status: true
            },
            include: {photos: true}
        });

        if (!existingPost) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
        }

        // 작성자 확인
        if (existingPost.userId !== userId) {
            const error = new Error('Unauthorized: You are not the author of this post');
            error.status = 403;
            throw error;
        }

        // 게시글 업데이트
        const updatedPost = await prisma.post.update({
            where: {id: Number(id)},
            data: {
                title,
                content,
                photos: {
                    deleteMany: {}, // 기존 사진 삭제
                    create: photos.map((photo) => ({url: photo})) // 새 사진 추가
                }
            },
            include: {
                photos: true // photos 관계 데이터를 포함하여 반환
            }
        });

        return new PostResponse(updatedPost);
    }

    async deletePost(id, userId) {
        const post = await prisma.post.findUnique({
            where: {id: Number(id)}
        });

        if (!post) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
        }

        if (post.userId !== userId) {
            const error = new Error('Unauthorized: You are not the author of this post');
            error.status = 403;
            throw error;
        }

        // 작성자가 맞으면 status를 'deleted'로 변경하여 soft delete
        await prisma.post.update({
            where: {id: Number(id)},
            data: {status: false} // 상태를 'deleted'로 변경 (boolean 값 예시)
        });
    }


}

module.exports = new PostService();
