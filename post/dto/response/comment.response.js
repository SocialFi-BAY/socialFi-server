class CommentResponse {
    constructor(comment) {
        this.id = comment.id;
        this.userId = comment.userId;
        this.content = comment.content;
        this.postId = comment.postId;
        this.createdAt = comment.createdAt;
        this.updatedAt = comment.updatedAt;
    }
}

module.exports = CommentResponse;
