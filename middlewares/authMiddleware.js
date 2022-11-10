// Принимает в себя запрос, ответ, функцию next которая запускает следующий middleWare (их может быть несколько)
const jwt = require("jsonwebtoken")
const { secret } = require("../config")

// Только авторизованный пользователь может получать users
module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        // Вид токена в заголовке: Bearer HGjkbHJghjkBVgiuiuh.IUbhfgsdkGKgjkGiHh
        //Bearer - тип токена, и сам токен, поэтому достаем только сам токен
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res
                .status(403)
                .json({ message: "Пользователь не авторизован" })
        }
        // Тут в decodedData теперь лежит обьект который мы в него засовывали c id и ролями пользователей const payload = { id, roles }
        const decodedData = jwt.verify(token, secret)
        req.user = decodedData
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({ message: "Пользователь не авторизован" })
    }
}
