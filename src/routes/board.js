import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import db from "../database.js";
import { checkSession } from "../util.js";

const router = Router();

router.get('/', (req, res) => {
    var sql = "select * from boards"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json(rows)
    });
});

router.get('/:boardId', (req, res) => {
    var sql = "select * from boards where id = ?"
    var params = [req.params.boardId]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json(rows[0])
    });
});

router.post('/', (req, res) => {
    checkSession(req).then(r => {
        const board = req.body;
        console.log(board)

        var sql = 'INSERT INTO boards (boardName, description) VALUES (?,?)'
        var params = [board.boardName, board.description]
        db.run(sql, params, function (err, result) {
            if (err) {
                res.status(500).json({"error": err.message})
            } else {
                res.json(result)
            }
        });
    }).catch(r => {
        console.log(r)
        res.status(500).json({"error": "Please log in."})
    })
});

router.delete('/:boardId', (req, res) => {
    const {
        [req.params.boardId]: board,
        ...otherboards
    } = req.context.models.boards;

    req.context.models.boards = otherboards;

    return res.send(board);
});

export default router;