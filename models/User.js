const { Schema, model } = require('mongoose')

//Schema - описывает как пользователь будет храниться в базе данных
// У пользователя есть username, тип строковый, это поле уникально тк нет одинаковых пользователей, и оно будет обязательным
const User = new Schema({
    //Для каждого пользователя монго создает id, его можно не указывать, генерируется автоматически
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // В ролях указали ссылку на другую сущность Role.js
    roles: [{ type: String, ref: 'Role' }],
})

// Модель создастся на основании схемы выше
module.exports = model('User', User)
