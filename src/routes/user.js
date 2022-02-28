import { Router } from 'express';
import db from '../database.js';
import crypto from 'crypto';

const router = Router();

router.get('/', (req, res) => {
    var sql = "select * from users"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json(rows)
    });
});

router.get('/:userId', (req, res) => {
    return res.send(req.context.models.users[req.params.userId]);
});

router.post('/', (req, res) => {
    const user = req.body;
    var cleanUsername = user.username.trim();
    var cleanEmail = user.email.trim();
    var encryptedPassword = crypto.createHash('sha256').update(user.password).digest('hex');

    if (!cleanUsername || !cleanEmail || !encryptedPassword) {
        return res.status(500).json({"error": "Username, email, or password are empty."})
    }

    var checkUserSql = "SELECT * FROM users WHERE email = ? OR username = ?";
    var checkUserParams = [cleanEmail, cleanUsername];
    var registerSql = 'INSERT INTO users (email, username, password, gender, birthday) VALUES (?,?,?,?,?)'
    var registerParams = [cleanEmail, cleanUsername, encryptedPassword, user.gender, user.birthday]
 
    db.get(checkUserSql, checkUserParams, function (err, result) {
        if (err) {
            return res.status(500).json({"error": err.message})
        }
        if (result) {
            return res.status(500).json({"error": "User already registered."})
        }

        db.run(registerSql, registerParams, function (err, result) {
            if (err) {
                return res.status(500).json({"error": err.message})
            } else {
                console.log("New User Registered: %s", cleanUsername)
                return res.json({"username": cleanUsername})
            }
        });
    });
});

router.post('/login', (req, res) => {
    const user = req.body;
    var cleanEmail = user.email.trim();
    var encryptedPassword = crypto.createHash('sha256').update(user.password).digest('hex');

    if (!cleanEmail || !encryptedPassword) {
        return res.status(500).json({"error": "Email or password are empty."})
    }

    var checkUserSql = "SELECT * FROM users WHERE email = ? AND password = ?";
    var checkUserParams = [cleanEmail, encryptedPassword];
    
    db.get(checkUserSql, checkUserParams, function (err, result) {
        if (err) {
            return res.status(500).json({"error": err.message})
        } else if (result) {
            // Todo: create session
            return res.json(result)
        } else {
            return res.status(500).json({"error": "Invalid username or password"})
        }
    });
});

router.get('/me', (req, res) => {
    return res.send(req.context.models.users[req.params.userId]);
});

export default router;