import db from "./database.js";

function checkSession(req) {
    return new Promise((resolve, reject) => {
        var sessionId = req.get("X-Forum-Session-Id") ?? ""
        var checkUserSql = "SELECT * FROM sessions WHERE id = ?";
        var checkUserParams = [sessionId];

        db.get(checkUserSql, checkUserParams, function (err, result) {
            if (err) {
                return reject({"error": err})
            }
            if (!result) {
                return reject({"error": "Invalid session."})
            }
            return resolve({
                sessionId: sessionId,
                userId: result.userId
            });
        });
    })
}

export {
    checkSession,
}