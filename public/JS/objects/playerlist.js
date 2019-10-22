var PlayerL = null
try { PlayerL = require('./player.js')}
catch {PlayerL = Player}
class PlayerList{
    constructor(){
        this.Players = []
        this.PlayerUserNames = []
        this.addPlayer = (Player)=>{
            var plr = new PlayerL(Player.UserName, Player.Sword, Player.ArmorType, Player.Health, Player.X, Player.Y, Player.Team,Player.LookAngle,Player.Role);
            this.Players.push(plr)
            this.PlayerUserNames.push(plr.UserName)
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
        this.setPlayer = (Player)=>{
            if (this.checkPlayer(Player.UserName)) {
                var plr = new PlayerL(Player.UserName, Player.Sword, Player.ArmorType, Player.Health, Player.X, Player.Y, Player.Team,Player.LookAngle,Player.Role);
                this.Players[this.indexOf(Player.UserName)] = plr
            }
        }
        this.removePlayer = (UserName)=>{
            if (this.checkPlayer(UserName)) {
                this.Players.splice(this.indexOf(UserName),1)
                this.PlayerUserNames.splice(this.indexOf(UserName),1)
            }
        }
        this.Update = ()=>{
            this.Players.forEach(element => {
                element.Update();
            });
        }
    }
}
try { module.exports = PlayerList} catch{}