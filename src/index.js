import models from './models/index.js';
import routes from './routes/index.js';
import cors from 'cors';
import express from 'express';
import db from './database.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', routes.user);
app.use('/post', routes.post);
app.use('/board', routes.board);
app.use('/topic', routes.topic);

app.listen(3001, () => {
    console.log('Backend listening on port 3001')

    setInterval(() => {
        const now = Date.now()

        var sql = 'DELETE FROM sessions WHERE ? >= expiresOn'
        var params = [now]
        db.run(sql, params, function (err, result) {
            if (err) {
                console.log("Session cleaner error: " + err)
            } else {
                console.log("Session cleaner was successful")
            }
        });
    }, 5000)
});