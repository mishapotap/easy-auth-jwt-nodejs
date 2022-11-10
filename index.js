require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 5004

const app = express()

//сервер может парсить json который будет прилетать в запросах
app.use(express.json())
// 1 параметр - по которому роутер будет слушаться, 2 - сам роутер
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => console.log(`Server started on ${PORT} port`))
    } catch (e) {
        console.log(e)
    }
}

start()
