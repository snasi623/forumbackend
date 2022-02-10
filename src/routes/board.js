import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    return res.send(Object.values(req.context.models.boards));
});

router.get('/:boardId', (req, res) => {
    return res.send(req.context.models.boards[req.params.boardId]);
});

router.post('/', (req, res) => {
    const id = uuidv4();
    const board = {
        id,
        text: req.body.text,
        userId: req.context.me.id,
    };

    req.context.models.boards[id] = board;

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