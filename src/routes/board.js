import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import db from "../database.js";

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

router.post('/', (req, res) => {
    const id = uuidv4();
    const board = JSON.parse(req.body);

    var sql = 'INSERT INTO board (boardName, description) VALUES (?,?)'
    var params = [board.boardName, board.description]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message})
            return;
        }
        res.json(result)
    });

    return res.send(board);
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