const fs = require('fs')
const path = require('path')
const http = require('http')
const express = require("express")
const socketio = require("socket.io")


const app = express()
const server = http.createServer(app) 
const io = socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Run when a client connects
io.on('connect', socket => {
    console.log("New connection")

    socket.emit('sendTasks', getData())

    socket.on('updateList', (sended) => {
        console.log(sended)
        fs.writeFile('Output.txt', sended, (err) => { 
            // In case of a error throw err. 
            if (err) throw err; 
            console.log("printed")
        }) 

    })
})

function getData(){
    
    return fs.readFileSync("./Output.txt", "utf8")
    
}


const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server running on ${PORT}`))