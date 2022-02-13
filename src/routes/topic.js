import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import db from "../database.js";

const router = Router();

router.get('/', (req, res) => {
    var sql = "select * from topics"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json(rows)
    });
});

router.get('/:topicId', (req, res) => {
    return res.send(req.context.models.topics[req.params.topicId]);
});

router.post('/', (req, res) => {
    const id = uuidv4();
    const topic = {
        id,
        text: req.body.text,
        userId: req.context.me.id,
    };

    req.context.models.topics[id] = topic;

    return res.send(topic);
});

router.delete('/:topicId', (req, res) => {
    const {
        [req.params.topicId]: topic,
        ...othertopics
    } = req.context.models.topics;

    req.context.models.topics = othertopics;

    return res.send(topic);
});

export default router;