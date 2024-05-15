const mongoose = require('mongoose')
const HOST = process.env.DB_HOST
const PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME

const connectDB = () => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`mongodb://${HOST}:${PORT}/${DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(conn => console.log(`MongoDB Connected: ${conn.connection.host}`))
        .catch(err => {
            console.log(`DB connection failed: ${err.message}`);
            process.exit()
        })
}

module.exports = connectDB
