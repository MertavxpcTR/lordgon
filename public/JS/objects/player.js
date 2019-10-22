class Player {
    constructor(UserName, Sword, ArmorType, Health, X, Y, Team,LookAngle,Role){
        this.CanUp = this.CanDown = this.CanRight = this.CanLeft = true;
        this.Up = this.Down = this.Right = this.Left = false;
        this.UserName = UserName
        this.ArmorType = ArmorType
        this.Health = Health
        this.Speed = 4
        this.X = X
        this.Y = Y
        this.Role = Role
        this.LookAngle = LookAngle;
        this.Stamina = 100
        this.OnDefend = false
        this.OnAttack = false
        this.StaminaDown = false
        this.HealthDown = false
        this.Team = Team;
        this.Sword = Sword;
        this.Hit = (value)=>{
            this.Health = this.Health - value
        }
        this.Defend = ()=>{
            if (!(this.OnAttack || this.OnDefend)){
                this.OnDefend = true
            }
        }
        this.Attack = ()=>{
            if (!(this.OnAttack || this.OnDefend)){

                this.OnAttack = true
                var i = 1;
                setTimeout(()=>{
                    for(var val in $.PList.PlayerUserNames){
                        var Victim = $.PList.Players[val];
                        if (this.UserName == Victim.UserName){
                            continue;
                        }
                        if(Math.sqrt(Math.pow((this.X-Victim.X),2),Math.pow((this.Y-Victim.Y),2)) <= 100){
                            var angle = Math.atan2(this.X - Victim.X , this.Y - Victim.Y) * (180 / Math.PI);
                            var hitval = (this.SwordType == 1) ? 5 : (this.SwordType == 2) ? 10 : (this.SwordType == 3) && 20;
                            hitval=((hitval/100)*(100-((Victim.ArmorType == 1) ? 10 : (Victim.ArmorType == 2) ? 20 : (Victim.ArmorType == 1) && 40)))
                            if(/*angle > this.LookAngle-80 && angle < this.LookAngle+80*/true ){
                                socket.emit('HitTo',{UserName:Victim.UserName,hitval:20});
                            }
                        }
                    }
                },150);
                var sss = setInterval(()=>{
                     if(i <= 5){
                        this.Sword.Y = this.Sword.Y + 4;
                     }
                     else if(i <= 30){
                        this.Sword.Angle = this.Sword.Angle - 3
                     }
                     else if (i <= 55){
                        this.Sword.Angle = this.Sword.Angle + 3
                     }
                     else if(i <= 60){
                        this.Sword.Y = this.Sword.Y - 4;
                     }
                     else{
                         this.OnAttack = false;
                         clearInterval(sss);
                     }
                     i++;
                },5)
            }
        }
        this.MoveRight = ()=>{
            (this.CanRight) ? (this.Right = true) : (this.Right = false); 
        }
        this.MoveDown = ()=>{
            (this.CanDown) ? (this.Down = true) : (this.Down = false); 
        }
        this.MoveUp = ()=>{
            (this.CanUp) ? (this.Up = true) : (this.Up = false); 
        }
        this.MoveLeft = ()=>{
            (this.CanLeft) ? (this.Left = true) : (this.Left = false); 
        }
        this.Move = ()=>{
            (this.Up) && (this.Y = this.Y - this.Speed);
            (this.Right) && (this.X = this.X + this.Speed);
            (this.Down) && (this.Y = this.Y + this.Speed);
            (this.Left) && (this.X = this.X - this.Speed);
        }
        this.Rotate = (x1,y1, x2, y2)=>{
            this.LookAngle = (Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI)-90;
        }
        var avatar,sword;
        try{ avatar = new Image(75,50);sword = new Image(20,40)}catch{}
        this.Update = ()=>{
            
            avatar.src="../../Files/"+this.Team+"/"+this.ArmorType+".svg";
            sword.src ="../../Files/Sword/"+this.Sword.Type+".svg";
            var c = $("canvas")[0].getContext('2d')

            c.save();
            c.translate(this.X, this.Y);
            
            c.rotate(this.LookAngle * (Math.PI/180));

            c.beginPath()
            c.drawImage(avatar,-25,-25,50,50)
            c.translate(this.Sword.X,this.Sword.Y);
            c.rotate(this.Sword.Angle * (Math.PI/180));
            c.drawImage(sword,0,0,15,75);
            c.closePath();
            c.restore();

            c.font = "20px Arial";
            c.fillStyle = "Black";
            c.textAlign = "center";
            c.fillText(this.UserName, this.X,this.Y-60);
            c.fillStyle = "Red";
            c.fillRect(this.X-25, this.Y-50, 50, 10);
            c.fillStyle = "Green";
            c.fillRect(this.X-25, this.Y-50, this.Health/2, 10);

        }
    }
};

try { module.exports = Player } catch{}