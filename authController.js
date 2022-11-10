const User = require("./models/User")
const Role = require("./models/Role")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
// validationResult возвращает ошибки полученные в ходе валидации
const { validationResult } = require("express-validator")
const { secret } = require("./config")

const generateAccessToken = (id, roles) => {
    const payload = { id, roles }
    // 1 параметр - обьект с данными который мы прячем в токен
    // 2 - секретный ключ по которому будет расшифровываться токен
    // 3 - обьект опций
    return jwt.sign(payload, secret, { expiresIn: "24h" })
}

//тут все функции по взаимодействию с пользователем (регистрация, авторизация, получение пользователей)
class authController {
    async registration(req, res) {
        try {
            // Сам вытащит необходимые поля из запроса и провалидирует, если есть ошибки в массиве ошибок то вернет 400 ответ
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Ошибка при регистрации", errors })
            }
            // Из тела запроса вытащили имя и пароль
            const { username, password } = req.body
            // Проверяем есть ли пользователь уже у нас в базе и возвращаем ответ если такой пользователь уже есть
            const candidate = await User.findOne({ username })
            if (candidate) {
                return res.status(400).json({
                    message: "Пользователь с таким именем уже существует",
                })
            }
            // Хешируем пароль (1 - пароль пользователя, 2 - степень хеширования) Чтобы пароль не был в БД в открытом виде
            const hashPassword = bcrypt.hashSync(password, 7)
            // Получили роль из БД
            const userRole = await Role.findOne({ value: "USER" })
            // Создаем нового пользователя
            const user = new User({
                username,
                password: hashPassword,
                roles: [userRole.value],
            })
            // Сохраняем пользователя
            await user.save()
            // Возвращаем ответ на клиент
            return res.json({
                message: "Пользователь был успешно зарегистрирован",
            })
        } catch (e) {
            console.log(e)
            // Оповестили клиента что есть ошибка
            res.status(400).json({ message: "Registration error" })
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res
                    .status(401)
                    .json({ message: `Пользователь ${username} не найден` })
            }
            // Сравниваем пароли (1 пароль из тела запроса, 2 - захешированный из базы данных который былу нас в user)
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res
                    .status(400)
                    .json({ message: "Введен неверный пароль" })
            }
            // _id всегда константа и берется из mongo
            const token = generateAccessToken(user._id, user.roles)
            // Отдаем токен на клиент
            return res.json({ token })
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: "Login error" })
        }
    }
    async getUsers(req, res) {
        try {
            // Удалили роли после того как создали их в базе данных mongo
            // const userRole = new Role()
            // const adminRole = new Role({ value: 'ADMIN' })
            // await userRole.save()
            // await adminRole.save()
            const users = await User.find()
            res.json(users) // возвращает массив пользователей
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new authController()
