const CommentResponse = require('./comment.response'); // CommentResponse 클래스 import

class PostResponse {
    constructor(post) {
        this.id = post.id;
        this.title = post.title;
        this.content = post.content;
        this.photos = post.photos && post.photos.length > 0
            ? post.photos.map(photo => photo.url)
            : [];
        this.comments = post.comments && post.comments.length > 0
            ? post.comments.map(comment => new CommentResponse(comment))
            : [];
        this.createdAt = post.createdAt;
        this.updatedAt = post.updatedAt;
    }
}

module.exports = PostResponse;
