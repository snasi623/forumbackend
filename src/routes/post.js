import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import db from "../database.js";
import { checkSession } from "../util.js";

const router = Router();

router.get('/byTopicId/:topicId', (req, res) => {
    var sql = "SELECT p.*, u.username AS createdByUsername FROM posts AS p LEFT JOIN users AS u ON (u.id = p.userId) WHERE p.topicId = ?"
    var params = [req.params.topicId]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json(rows)
    });
});

router.post('/', (req, res) => {
    checkSession(req).then(r => {
        const post = req.body;
        console.log(post)

        var sql = 'INSERT INTO posts (topicId, text, postDate, userId) VALUES (?,?,?,?)'
        var params = [post.topicId, post.text, Date.now(), r.userId]
        db.run(sql, params, function (err, result) {
            if (err) {
                res.status(500).json({"error": err.message})
            } else {
                res.json(result)
            }
        });
    })
});

router.delete('/:postId', (req, res) => {
    checkSession(req).then(r => {
        var sql = 'DELETE FROM posts WHERE id = ? AND userId = ?'
        var params = [req.params.postId, r.userId]
        db.run(sql, params, function (err, result) {
            if (err) {
                res.status(500).json({"error": err.message})
            } else {
                res.json({"success": true})
            }
        });
    }).catch(r => {
        console.log(r)
        res.status(500).json({"error": "Please log in."})
    })
});

export default router;