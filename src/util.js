import db from "./database.js";

function checkSession(sessionId) {
    return new Promise((resolve, reject) => {
        var checkUserSql = "SELECT * FROM sessions WHERE id = ?";
        var checkUserParams = [sessionId];

        db.get(checkUserSql, checkUserParams, function (err, result) {
            if (err) {
                return reject({"error": err.message})
            }
            if (!result) {
                return reject({"error": "Invalid session."})
            }
            return resolve();
        });
    })
}

export {
    checkSession,
}