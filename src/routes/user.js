import { Router } from 'express';
import db from '../database.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { checkSession } from "../util.js";

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

// router.get('/:userId', (req, res) => {
//     return res.send(req.context.models.users[req.params.userId]);
// });

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

        db.run(registerSql, registerParams, function (err) {
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
    var registerSql = 'INSERT INTO sessions (id, userId, startedOn, expiresOn) VALUES (?,?,?,?)'
    var sessionId = uuidv4();
    var startedOn = Date.now();


    db.get(checkUserSql, checkUserParams, function (err, result) {
        if (err) {
            return res.status(500).json({"error": err.message})
        }
        if (!result) {
            return res.status(500).json({"error": "Invalid username or password."})
        }

        var registerParams = [sessionId, result.id, startedOn, startedOn + (3600 * 1000)]
        db.get(registerSql, registerParams, function (err, result2) {
            if (err) {
                return res.status(500).json({"error": err.message})
            } else {
                console.log("Session Started for User %s : %s", result.username, sessionId)
                return res.json({"sessionId": sessionId, "userId": result.id})
            }
        });
    });
});

router.get('/me', (req, res) => {
    checkSession(req).then(r => {
        var sql = 'SELECT u.id, u.username FROM sessions AS s LEFT JOIN users AS u ON (u.id = s.userId) WHERE s.id = ?'
        var params = [r.sessionId]
        db.get(sql, params, function (err, result) {
            if (err) {
                res.status(500).json({"error": err.message})
            } else if (result) {
                res.json(result)
            } else {
                res.status(500).json({"error": "User Not Found"})
            }
        });
    }).catch(r => {
        console.log(r)
        res.status(500).json({"error": "Please log in."})
    })
});

router.put('/me', (req, res) => {
    checkSession(req).then(r => {
        var sql = 'UPDATE users SET username = ?, password = ? WHERE id = ?'
        var params = [r.userId]
        db.run(sql, params, function (err, result) {
            if (err) {
                res.status(500).json({"error": err.message})
            } else if (result) {
                res.json(result)
            } else {
                res.status(500).json({"error": "Unsuccessful"})
            }
        });
    }).catch(r => {
        console.log(r)
        res.status(500).json({"error": "Please log in."})
    })
});

router.post('/logout', (req, res) => {
    checkSession(req).then(r => {
        var sql = 'DELETE FROM sessions WHERE id = ?'
        var params = [r.sessionId]
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