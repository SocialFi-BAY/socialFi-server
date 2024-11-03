const CommentResponse = require('./comment.response'); // CommentResponse 클래스 import

class PostResponse {
    constructor(post, reactionCounts, userReactions) {
        if (!post.status) {
            throw new Error("Inactive post");
        }

        this.id = post.id;
        this.title = post.title;
        this.content = post.content;
        this.photos = post.photos && post.photos.length > 0
            ? post.photos.map(photo => photo.url) // status 체크 없이 URL만 매핑
            : [];

        // 최상위 댓글만 필터링하고, 자식 댓글은 CommentResponse에서 처리
        this.comments = post.comments && post.comments.length > 0
            ? post.comments
                .filter(comment => comment.parentId === null && comment.status)
                .map(comment => new CommentResponse(comment))
            : [];

        // 리액션 수 추가
        this.likeCount = reactionCounts.likeCount || 0;
        this.dislikeCount = reactionCounts.dislikeCount || 0;
        this.scrapCount = reactionCounts.scrapCount || 0;

        // 사용자 리액션 여부 추가
        this.isLiked = userReactions.isLiked || false;
        this.isDisliked = userReactions.isDisliked || false;
        this.isScrapped = userReactions.isScrapped || false;

        this.createdAt = post.createdAt;
        this.updatedAt = post.updatedAt;
    }
}

module.exports = PostResponse;
