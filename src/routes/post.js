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

router.post('/', (req, res) => {
    const post = req.body;
    console.log(post)

    var sql = 'INSERT INTO posts (topicId, text, postDate, userId) VALUES (?,?,?,?)'
    var params = [post.topicId, post.text, new Date(), 1]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(500).json({"error": err.message})
        } else {
            res.json(result)
        }
    });
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