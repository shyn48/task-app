const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const routers = require('./routers');
const path = require('path')
const app = express()
const cors = require('cors')

const publicDirectoryPath = path.join(__dirname, '../public/client')
app.use(express.static(publicDirectoryPath))
app.use(cors())
app.use(express.json())
app.use(routers)

module.exports = app