//маршруты по которым отправляются роуты
const Router = require("express")
const router = new Router()
const controller = require("./authController")
const { check } = require("express-validator")
const authMiddleware = require("./middlewares/authMiddleware")
const roleMiddleware = require("./middlewares/roleMiddleware")

router.post(
    "/registration",
    [
        check("username", "Имя пользователя не может быть пустым").notEmpty(),
        check(
            "password",
            "Пароль должен быть больше 4 и меньше 10 символов"
        ).isLength({
            min: 4,
            max: 10,
        }),
    ],
    controller.registration
) //запрос на регистрацию, 2 аргумент - фукнция которая должна отрабатывать на каждый запрос
router.post("/login", controller.login) //запрос на логин
// Только user будет иметь доступ к запросу юзеров
router.get("/users", roleMiddleware(["USER"]), controller.getUsers) //гет запрос доступов

module.exports = router
