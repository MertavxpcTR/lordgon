socket = io["connect"](self['location']['protocol']+'//'+self["location"]["host"])
app = angular["module"]("lordgon", [])
$.Username = "";
clud=()=>{}
app["controller"]("mainController", ($scope) => {
    clud = (a)=>{
        $scope["clud"] = a
    }
    clud("HTML/login.html")
})
app["controller"]("loginController",($scope)=>{
    $scope["start"] = ()=>{
        $.Username = $scope["UserName"]
        clud("HTML/game.html")
    }
})

app["controller"]("gameController",($scope)=>{
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    if (!isMobile.any()){
        console.log("your device dedected as non-mobile device so you will play with mouse and keyboard\nif this is an issue please contact with us");
    } 
    else{
        console.log("your device dedected as mobile device so you will play with touch screen\nif this is an issue please contact with us");
    }
    $("canvas")[0].width = innerWidth;
    $("canvas")[0].height = innerHeight;
    move = {
        touchindex: -1,
        x1: innerWidth / 2,
        y1: innerHeight / 2,
        x2: innerWidth / 2,
        y2: innerHeight / 2
    }
    look = {
        touchindex: -1,
        x1: innerWidth / 2,
        y1: innerHeight / 2,
        x2: innerWidth / 2,
        y2: innerHeight / 2
    }
    mouse = {
        x: innerWidth / 2,
        y: innerHeight / 2
    }
    camerax = cameray = 0;
    addEventListener('click', event => {
        $.LocalPlayer.Attack($.PList);
    })
    addEventListener('mousemove', event => {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
    })
    addEventListener('touchstart',event=>{
        if(event.touches.length == 1){
            if(event.touches[0].pageX <= (canvas.width/2)){
                move.touchindex = 0;
                look.touchindex = -1;
            }
            else{
                look.touchindex = 0;
                move.touchindex = -1;
            }
        }
        else if(event.touches.length == 2){
            if(event.touches[0].pageX <= (canvas.width/2)){
                move.touchindex = 0;

            }
            else{
                look.touchindex = 0;
            }
            if(event.touches[1].pageX <= (canvas.width/2)){
                move.touchindex = 1;
            }
            else{
                look.touchindex = 1;
            }
        }
        else{
            move.touchindex = -1;
            look.touchindex = -1;
            return;
        }
        if(move.touchindex != -1){
            move.x2 = event.touches[move.touchindex].pageX;
            move.y2 = event.touches[move.touchindex].pageY
        }
        if(look.touchindex != -1){
            look.x2 = event.touches[look.touchindex].pageX;
            look.y2 = event.touches[look.touchindex].pageY
        }
    })
    addEventListener('touchend',event=>{
        if(event.touches.length == 0){
            move.touchindex = -1;
            look.touchindex = -1;
            $.LocalPlayer.Up = $.LocalPlayer.Right = $.LocalPlayer.Down = $.LocalPlayer.Left = false;
        }
        else if (event.touches.length == 1){
            if (event.touches[0].pageX <= (canvas.width/2)){
                look.touchindex = -1;
            }
            else{
                move.touchindex = -1;
                $.LocalPlayer.Up = $.LocalPlayer.Right = $.LocalPlayer.Down = $.LocalPlayer.Left = false;
            }
        }
        else{
            return
        }
    })
    addEventListener('touchmove', event=>{
        if(move.touchindex != -1){
            move.x1 = event.touches[move.touchindex].pageX;
            move.y1 = event.touches[move.touchindex].pageY;

            moveangle = (Math.atan2(move.y2 - move.y1 , move.x2 - move.x1) * (180 / Math.PI));

            (moveangle >= 22.5 && moveangle <= 157.5) ? ($.LocalPlayer.MoveUp()) : ($.LocalPlayer.Up = false);
            ((moveangle >= 112.5 && moveangle <= 180) || (moveangle <= -112.5 && moveangle >= -180)) ? ($.LocalPlayer.MoveRight()) : ($.LocalPlayer.Right = false);
            (moveangle <= -22.5 && moveangle >= -157.5) ? ($.LocalPlayer.MoveDown()) : ($.LocalPlayer.Down = false);
            (moveangle >= -67.5 && moveangle <= 67.5) ? ($.LocalPlayer.MoveLeft()) : ($.LocalPlayer.Left = false);
        }
        if(look.touchindex != -1){
            look.x1 = event.touches[look.touchindex].pageX;
            look.y1 = event.touches[look.touchindex].pageY;
        }
    })
    
    addEventListener('resize', () => {
        $("canvas")[0].width = innerWidth
        $("canvas")[0].height = innerHeight
    })


    $.PList = new PlayerList()
    $.LocalPlayer = new Player($.Username, {Angle:30,X:-35,Y:-10,Type:1}, 1, 100, 30, 30, "Teamless",(Math.random()*360)*Math.PI/180)
    socket["on"]('Hit',(val)=>{
        $.LocalPlayer.Hit(val);
    });
    socket["on"]('playerupdate',(ServerPlayer)=>{
        
        try{
            if($.LocalPlayer.UserName != ServerPlayer.UserName){
                if ($.PList.checkPlayer(ServerPlayer.UserName)){
                    $.PList.setPlayer(ServerPlayer);
                }
                else{
                    $.PList.addPlayer(ServerPlayer);
                }
            }
            
        }
        catch(err){
            socket.emit("err",err,$.LocalPlayer.UserName,"playerupdate error",Date(Date.now()));
        }
    })
    socket["on"]('newplayer',(ServerPlayer)=>{
        try{
            if($.LocalPlayer.UserName != ServerPlayer.UserName) $.PList.addPlayer(ServerPlayer);
        }
        catch(err){
            socket.emit("err",err,$.LocalPlayer.UserName,"newplayer error",Date(Date.now()));
        }
    })
    socket["on"]('playerdisconnect',(UserName)=>{
        try{
            if($.LocalPlayer.UserName != UserName) $.PList.removePlayer(UserName);
        }
        catch(err){
            socket.emit("err",err,$.LocalPlayer.UserName,"playerdisconnect error",Date(Date.now()));
        }
    })
    
    $(window).on('keydown keyup',(e)=>{
        if (e["keyCode"] === 38 /* up */ || e["keyCode"] === 87 /* w */) ((e.type == "keydown") ? ($.LocalPlayer.MoveUp()) : ($.LocalPlayer.Up = false));
        if (e[" keyCode"] === 39 /* right */ || e["keyCode"] === 68 /* d */) ((e.type == "keydown") ? ($.LocalPlayer.MoveRight()) : ($.LocalPlayer.Right = false));
        if (e["keyCode"] === 40 /* down */ || e["keyCode"] === 83 /* s */) ((e.type == "keydown") ? ($.LocalPlayer.MoveDown()) : ($.LocalPlayer.Down = false));
        if (e["keyCode"] === 37 /* left */ || e["keyCode"] === 65 /* a */) ((e.type == "keydown") ? ($.LocalPlayer.MoveLeft()) : ($.LocalPlayer.Left = false));
    })
    frameUpdate = ()=>{
        
        canvas = $("canvas")[0]
        c = canvas.getContext('2d')
        c.save();



        $.LocalPlayer.Move();
        if (!isMobile.any()) {
            $.LocalPlayer.Rotate(mouse.x,mouse.y,canvas.width/2,canvas.height/2);
        }
        else{
            $.LocalPlayer.Rotate(look.x1,look.y1,look.x2,look.y2);
        }
        
        c.clearRect(0, 0, canvas.width, canvas.height);
        
        
        camerax = (canvas.width/2)-($.LocalPlayer.X);
        cameray = (canvas.height/2)-($.LocalPlayer.Y);
    
        c.save();
        c.translate(Math.max(Math.min(camerax,3000),0), Math.max(Math.min(cameray,3000),0));
        
        $.PList.Update();
        $.LocalPlayer.Update();

        c.restore();

        if ($.LocalPlayer) {socket.emit('sendplayer',$.LocalPlayer);}

        requestAnimationFrame(frameUpdate);
    }
    requestAnimationFrame(frameUpdate)
    
})

app["controller"]("gameGuiController",($scope)=>{
})
/*
app["controller"]("",($scope)=>{
    
})
app["controller"]("",($scope)=>{
    
})
app["controller"]("",($scope)=>{
    
})
app["controller"]("",($scope)=>{
    
})


*/