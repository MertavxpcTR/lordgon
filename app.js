var fs = require('fs');
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
                socket.broadcast.emit('playerupdate',localPlayer)
            }
            else {
                PlayersList.addPlayer(localPlayer)
                PlayerIDs.push(socket.id);
                socket.broadcast.emit('newplayer',localPlayer)
            }
        }
        catch(err){
            console.log(err);
        }
    });
    socket.on('HitTo',(a)=>{
        socket.broadcast.to(PlayerIDs[PlayersList.indexOf(a.UserName)]).emit("Hit",a.hitval);
        c
    });
    socket.on('disconnect',()=>{
        var i = PlayerIDs.indexOf(socket.id)
        PlayerIDs.splice(i,1)
        socket.broadcast.emit('playerdisconnect',PlayersList.PlayerUserNames[i])
        PlayersList.removePlayer(PlayersList.PlayerUserNames[i]);
       
    })
    socket.on('err',(errst,err,pl)=>{
        const fs = require('fs');

        fs.writeFile("/logs/error_log.txt","***********Error***********\nError State:'"+errst+"'\nPlayer Name: '"+pl+"'\n Error:\n"+err,{'flag':'a'}, function(err) {
            if(err) {
                return console.log(err);
            }
        }); 
    })

})

