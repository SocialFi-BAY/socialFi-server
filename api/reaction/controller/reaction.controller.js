const reactionService = require('../service/reaction.service');

class ReactionController {

    async createReaction(req, res) {
        const { targetType, targetId, reactionType } = req.body;
        const userId = req.user.userId;

        try {
            const reaction = await reactionService.createReaction({
                targetType,
                targetId,
                reactionType,
                userId,
            });
            res.json(reaction);
        } catch (error) {
            console.error('Error creating reaction:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteReaction(req, res) {
        const { targetType, targetId, reactionType } = req.body;
        const userId = req.user.userId;

        try {
            await reactionService.deleteReaction({
                targetType,
                targetId,
                reactionType,
                userId,
            });
            res.json({ message: 'Reaction has been canceled.'});
        } catch (error) {
            console.error('Error deleting reaction:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ReactionController();
