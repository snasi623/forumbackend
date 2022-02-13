import models from './models/index.js';
import routes from './routes/index.js';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.context = {
        models,
        me: models.users[1],
    };
    next();
});

app.use('/session', routes.session);
app.use('/user', routes.user);
app.use('/post', routes.post);
app.use('/board', routes.board);
app.use('/topic', routes.topic);

app.listen(3001, () =>
    console.log('Example app listening on port 3001!'),
);