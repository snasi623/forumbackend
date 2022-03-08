import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import db from "../database.js";
import { checkSession } from "../util.js";

const router = Router();

router.get('/:topicId', (req, res) => {
    var sql = "SELECT t.*, u.username AS createdByUsername FROM topics AS t LEFT JOIN users AS u ON (u.id = t.userId) WHERE t.id = ?"
    var params = [req.params.topicId]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err});
            return;
        }
        res.json(rows[0])
    });
});

router.get('/byBoardId/:boardId', (req, res) => {
    var sql = "SELECT t.*, u.username AS createdByUsername FROM topics AS t LEFT JOIN users AS u ON (u.id = t.userId) WHERE t.boardId = ?"
    var params = [req.params.boardId]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err});
            return;
        }
        res.json(rows)
    });
});

router.post('/', (req, res) => {
    checkSession(req).then(r => {
        const topic = req.body;
        console.log(topic)

        var sql = 'INSERT INTO topics (boardId, threadName, firstPost, createdDate, userId) VALUES (?,?,?,?,?)'
        var params = [topic.boardId, topic.threadName, topic.firstPost, Date.now(), r.userId]
        db.run(sql, params, function (err, result) {
            if (err) {
                console.log(err)
                res.status(500).json({"error": err})
            } else {
                res.json(result)
            }
        });
    })
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