class CommentResponse {
    constructor(comment) {
        this.id = comment.id;
        this.userId = comment.userId;
        this.content = comment.content;
        this.postId = comment.postId;
        this.createdAt = comment.createdAt;
        this.updatedAt = comment.updatedAt;
        this.status = comment.status;

        // 자식 댓글(reply)을 status가 true일 때만 포함
        if (comment.status && comment.children && comment.children.length > 0) {
            this.reply = comment.children.map(childComment => new CommentResponse(childComment));
        } else {
            this.reply = [];
        }
    }
}

module.exports = CommentResponse;
