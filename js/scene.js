

var scene = new soya2d.Scene({
    balloons:[],
    allStep:0,  //计算所需要点的气球总数，点击气球会-1，如果为0，则表示可以升级了
    nowlv:1,
    allBoon:0,
    gamepause:0,
    loopInterval:null,  //添加气球的定时器
    leaveStep:0,        //还剩下多少个气球没有添加
    failballoon:0,      // 在飘出去之前没有戳破的地球个数
    onInit:function(game){
         var _this = this;

        // now level state
        var leveltex = game.textureManager.find('lv');
        var level = new soya2d.Sprite({
            textures:leveltex,
            w:gameW,
            h:gameH,
            x:0,
            y:0
        });
        _this.add(level);
        // level text
        
        var lv = new soya2d.Text({
            text:_this.nowlv.toString(),
            x:gameW*0.17,
            y:gameH*0.025,
            w:120,
            fillStyle:'#fff',
            font:'normal normal 28px/normal 黑体',
            onUpdate:function(){
                this.setText(_this.nowlv.toString());
            }
        });
        _this.add(lv);

        // 已经消灭的气球
        var sm_balloon_tex = game.textureManager.find('sm_balloon');
        var sm_balloon = new soya2d.Sprite({
            textures:sm_balloon_tex,
            w:gameW,
            h:gameH,
            x:0,
            y:0
        });
        _this.add(sm_balloon);
        // 消灭气球的个数
        var balloon_txt = _this.allBoon + '个';
        var balloon_count = new soya2d.Text({
            text:balloon_txt,
            y:gameH*0.04,
            fillStyle:'#fff',
            font:'normal normal 15px/normal 黑体',
            onUpdate:function(e){

                this.setText(_this.allBoon + '个');
                balloon_count.w = 8*(_this.allBoon.toString().length) + 16;
                balloon_count.x = gameW - balloon_count.w - gameW*0.088;
                
            }
        });
        
        _this.add(balloon_count); 

        // Time area
        // var time_tex = game.textureManager.find('time');
        // var timebg = new soya2d.Sprite({
        //     textures:time_tex,
        //     w:gameW,
        //     h:gameH,
        //     x:0,
        //     y:0
        // });
        // _this.add(timebg);

        // var time_txt = '00:00:10';
        // var time = new soya2d.Text({
        //     text:time_txt,
        //     x:gameW/2,
        //     y:gameH*0.036,
        //     fillStyle:'#fff',
        //     w:100,
        //     font:'normal normal 15px/normal 黑体'
        // });
        // timebg.add(time);


        // rulebutton
       
        var ruletex = game.textureManager.find('rule_btn');

        var rulebtn = new soya2d.Sprite({
            textures:ruletex,
            w:gameW*0.284,
            h:gameH*0.06,
            x:gameW*0.667,
            y:gameH - gameH*0.06 - gameH*0.027
        });
        _this.add(rulebtn);
        rulebtn.on(tap,function(){
            _this.pauseGame();
            
            rule.style.display = 'block';
        });
        

		//pause botton
        var _this = this;
        var pause = game.textureManager.find('pause');

        var pausebtn = new soya2d.Sprite({
            textures:pause,
            w:gameW*0.146,
            h:gameW*0.146,
            x:gameW*0.03,
            y:gameH - gameH*0.016 - gameW*0.146 
        });
        _this.add(pausebtn);

        pausebtn.on(tap,function(e){
            _this.pauseGame();
            playbtn.style.display = 'block';
        });
        


        /* 气球生成 */
        if(localStorage.lv){
            _this.nowlv = parseInt(localStorage.lv);
        }

        _this.createBalloon(_this.nowlv);
        
    },

    createBalloon:function(lv){
        var _this = this;   
        _this.balloons = [];
        // 保存关卡
        localStorage.lv = lv;

        _this.allStep = lv*2;
        console.log('=================');
        console.log('【新关卡】第' + lv + '关总步数：' + _this.allStep);

        _this.failballoon = 0;
        
        var edgeLeft = 0,
            edgeRight = gameW - gameW*0.179,
            edgeTop = gameH*0.1,
            edgeBottom = gameH - gameH*0.168 - gameH*0.1;
        
        
        for(var i = 0; i < _this.allStep; i++){
            var random_tex = 'balloon_'+(Math.round(Math.random()*3)+1),
                balloon_tex = game.textureManager.find(random_tex);

            var randomX = Math.round(Math.random()*(edgeRight - edgeLeft)) + edgeLeft,
            randomY = Math.round(Math.random()*(edgeBottom -edgeTop)) + edgeTop,
            randomW = gameW*0.179,
            randomH = gameH*0.168;
            var rotationGap = 0.25;
            var randomRo = Math.round(Math.random()*120-60);


           
            (function(index){
                index = i;

                _this.balloons[index] = new soya2d.Sprite({
                    textures:balloon_tex,
                    x:randomX,
                    y:gameH*0.8,
                    w:randomW,
                    h:randomH,
                    rotation:randomRo,
                    onUpdate:function(){
                        if(_this.gamepause == 0){
                            this.y = this.y - gapUp;

                            if(this.y < gameH*0.168*-1){
                                _this.remove(this);
                                _this.remove(this);
                                _this.allStep = _this.allStep - 1
                                _this.failballoon++;
                                console.log('●▽● 已经有'+_this.failballoon + '个气球飞出去了 ●▽●');

                                if(_this.allStep == 0){
                                    _this.isOver();
                                }else if((_this.nowlv < 10 && _this.failballoon > 2) || (_this.failballoon > 5 && _this.nowlv < 10)){
                                   _this.isOver();
                                   console.log('超出了可以飘出去的气球个数');

                                  
                                }
                            }

                            this.rotation += rotationGap;
                            if(this.rotation == -65){
                                rotationGap = 0.25;
                            }
                            if(this.rotation == 60){
                                rotationGap = -0.25;
                            }
                        }
                        

                    }
                });
                 _this.balloons[index].on(tap,function(){

                    //创建消失的气球粒子
                    //_this.createBalloonDie(_this.balloons[index].textures,_this.balloons[index].x,_this.balloons[index].y);

                    boon.pause();
                    boon.currentTime = 0.0; 
                    _this.remove(this);
                    boon.play();

                    _this.allBoon+= 1;
                    _this.balloons[index].w = 0;
                    _this.balloons[index].h = 0;
                    _this.allStep = _this.allStep - 1;
                    console.log('【点击】待消灭的气球：'+_this.allStep)
                    if(_this.allStep == 0){
                        _this.isOver();
                    }
                });
            })();
           
        }

        
        _this.leaveStep = _this.allStep;
        // console.log(_this.leaveStep);
        _this.playGame();
        


    },

    //判断是否闯关失败了
    isOver:function(){
        var _this = this;

        _this.loopInterval = clearInterval(_this.loopInterval);

        _this.gamepause = 1;

        var fail = 0;

        if(_this.nowlv < 10 && _this.failballoon > 2){
            //小于10关的，如果超过2个飘出去就失败
            fail = 1;
        }else if(_this.failballoon > 5){
            //大于10关的，如果超过5个飘出去了则失败
            fail = 1;
        }
        

        if(fail){
           
            //alert('你失败了');
            _this.pauseGame();
            replaybtn.style.display = 'block';

            console.log('***************');
            console.log('已经飘出去的气球 = '+_this.failballoon);
            console.log('已经生成的气球 = '+_this.balloons.length);
            console.log('还在屏幕上的气球 = '+(_this.balloons.length - _this.failballoon));
            console.log('***************');

            var ben = _this.balloons.length - _this.failballoon;
            for(var f = ben; f >=0; f--){
                //console.log(_this.balloons[f]);
                _this.balloons[f].remove();
                _this.balloons[f].w = 0;
                _this.balloons[f].h = 0;
                _this.balloons[f].y = gameH*0.168*-1;
            }

         
           
           
        }else{
            levelUp.style.display = 'block';

            //_this.loopInterval = clearInterval(_this.loopInterval);

            // 等级上升1
            _this.nowlv+=1;
            _this.createBalloon(_this.nowlv);

            setTimeout(function(){
                levelUp.className = 'fadeOutUp';
            }, 800);
            setTimeout(function(){
                levelUp.style.display = 'none';
                levelUp.className = 'fadeInUp';
            }, 1300);
        }

        
    },

    /* 暂停游戏*/
    pauseGame:function(){
        var _this = this;
        _this.gamepause = 1;
        _this.loopInterval = clearInterval(_this.loopInterval);
        console.log('【暂停】已经生成的气球：'+_this.allStep)
    },

    /* 继续游戏 */
    playGame:function(){
       
        var _this = this;
         _this.gamepause = 0;

        console.log('【继续】剩下没有生成的气球个数：' + _this.leaveStep);


         _this.loopInterval = setInterval(function(){
           
            if(_this.leaveStep > 0){
                _this.leaveStep = _this.leaveStep - 1;
                _this.add(_this.balloons[_this.leaveStep]);
                
            }

        }, 500);
    },

    createBalloonDie:function(tex,x,y){


        // 气球粒子
        var texs = tex;
        var emitter = new soya2d.Emitter({
            //粒子参数
            emissionCount:5,
            lifeSpan:1.5,
            MSPE:100,
            speed:5,
            startSpinVar:360,
            angle:270,
            x:x - gameW*0.179,
            y:y - gameH*0.168/1.5,
            xVar:40,
            //使用精灵作为模版
            template:soya2d.Sprite,

            //绘图参数
            textures:texs,
            //每次激活时，随机更换一个纹理
            onActive:function(){
                this.frameIndex = soya2d.Math.randomi(0,texs.length-1);
            },
            //根据死亡率显示透明度
            onUpdate:function(){
                this.opacity = this.deadRate - 0.3;
                this.scaleTo(this.deadRate/3 * 0.5);
            }
        });

        //加入场景
        emitter.addTo(this).emit();
        setTimeout(function(){
            emitter.stop();
        }, 1000);

    }

});
