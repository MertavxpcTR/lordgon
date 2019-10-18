var PlayerL = null

try { PlayerL = require('./player.js')}
catch {PlayerL = Player}

class PlayerList{

    constructor(){
        this.Players = []
        this.PlayerUserNames = []
        this.addPlayer = (player)=>{
            this.Players.push(player)
            this.PlayerUserNames.push(player.UserName)
        }
        this.checkPlayer = (UserName)=>{
            return this.PlayerUserNames.includes(UserName)
        }
        this.indexOf = (UserName)=>{
            if (this.checkPlayer(UserName)) {
                return this.PlayerUserNames.indexOf(UserName)
            }
            else{
                return -1
            }
        }
        this.getPlayer = (UserName)=>{
            if (this.checkPlayer(UserName)) {
                return this.Players[this.indexOf(UserName)]
            }
        }
        this.setPlayer = (UserName,Player)=>{
            if (this.checkPlayer(UserName)) {
                this.Players[this.indexOf(UserName)] = Player
            }
        }
        this.removePlayer = (UserName)=>{
            if (this.checkPlayer(UserName)) {
                this.Players.splice(this.indexOf(UserName),1)
                this.PlayerUserNames.splice(this.indexOf(UserName),1)
            }
        }
    }
}
try { module.exports = PlayerList} catch{}