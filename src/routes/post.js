import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import db from "../database.js";

const router = Router();

router.get('/byTopicId/:topicId', (req, res) => {
    var sql = "select * from posts where topicId = " + req.params.topicId
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json(rows)
    });
});

router.post('/byTopicId/:topicId', (req, res) => {
    const id = uuidv4();
    const post = {
        id,
        text: req.body.text,
        userId: req.context.me.id,
    };

    req.context.models.posts[id] = post;

    return res.send(post);
});

router.delete('/:postId', (req, res) => {
    const {
        [req.params.postId]: post,
        ...otherposts
    } = req.context.models.posts;

    req.context.models.posts = otherposts;

    return res.send(post);
});

export default router;