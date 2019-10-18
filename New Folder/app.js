
var express = require('express')
var app = express()

var PlayerList = require('./public/JS/objects/playerlist.js')
app.use(express.static('public'))
var PlayersList = new PlayerList()
var PlayerIDs = []



var socket = require('socket.io')
var server = app.listen(8080)

var io = socket(server)

io.on('connection',(socket)=>{

    socket.on('sendplayer',(localPlayer)=>{
        try{
            if (PlayersList.checkPlayer(localPlayer.UserName)){
                PlayersList.setPlayer(localPlayer.UserName,localPlayer)
            }
            else {
                PlayersList.addPlayer(localPlayer)
                PlayerIDs.push(socket.id);
            }
        }
        catch(err){
            console.log(err);
        }
    });
    setInterval(()=>{
        socket.emit('getplayers',PlayersList)
    },10)
    socket.on('disconnect',()=>{
        var i = PlayerIDs.indexOf(socket.id)
        PlayerIDs.splice(i,1)
        PlayersList.removePlayer(PlayersList.PlayerUserNames[i]);
    })


})

