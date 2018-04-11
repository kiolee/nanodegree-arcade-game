
//生成随机数方法
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

//冲刺后播放的动画
//这里我只能做到显示固定的文字，如果做动画要怎么实现？比如不同颜色闪烁或者文字放大缩小
function winAnimate(){
	pop_text.content='GOAL!!!';
	pop_text.font_size=60;
	pop_text.x=document.getElementsByTagName('canvas')[0].width/2;
	pop_text.y=document.getElementsByTagName('canvas')[0].height/2;;
	pop_text.align='center';
	pop_text.color='#ffeb3b';
	pop_text.display_times=1;
}


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
	//添加了速度和宽高属性，生成时随机速度和在随机的行里出现
    this.sprite = 'images/enemy-bug.png';
	this.x=-getRandomIntInclusive(0,402);
	this.y=83*getRandomIntInclusive(1,3)-20;
	this.speed=getRandomIntInclusive(30,120);
	this.width=0;
	this.height=0;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	
	//根据速度移动，超出右边界时以随机速度出现在随机的行里继续移动
	this.x+=this.speed*dt;
	if(this.x>document.getElementsByTagName('canvas')[0].width){
		this.x=-101;
		this.y=83*getRandomIntInclusive(1,3)-20;
		this.speed=getRandomIntInclusive(60,220);
	}
	
	//如果和plyaer在同一行，判断碰撞，执行player die方法
	if(this.y==player.y){
		//设置enemy前后2点，2个点有一个在player范围内即判断为碰撞，根据小虫图片设置前后边距25和15
		let front_point=this.x+this.width, back_point=this.x;
		let front_touch=(front_point>=player.x+25 && front_point<=player.x+player.width-25);
		let back_touch=(back_point>=player.x+15 && back_point<=player.x+player.width-15);
		console.log(back_point);
		if(front_touch || back_touch){
			console.log('touch!');
			player.die();
		}
	}
};

// Draw the enemy on the screen, required method for game
//加载时记录图片宽高，用于计算碰撞
Enemy.prototype.render = function() {
	let img=new Image();
	let that=this;
	img.onload=function(){
		that.width=this.width;
		that.height=this.height;
	};
	img.src=this.sprite;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


//增加了目标坐标，用于移动动画
var Player = function(){
	Enemy.call(this);
	this.sprite='images/char-boy.png';
	this.speed=560;
	this.x=101*2;
	this.y=83*5-20;
	this.moveto_x=null;
	this.moveto_y=null;
	this.moving=false;
};

Player.prototype=Object.create(Enemy.prototype);
Player.constructor=Player;

//碰撞到归位
Player.prototype.die=function(){
	this.moveto_x=101*2;
	this.moveto_y=83*5-20;
	this.moving=true;
};

//冲刺后归位并播放动画
Player.prototype.win=function(){
	this.moveto_x=101*2;
	this.moveto_y=83*5-20;
	this.moving=true;
	winAnimate();
};


Player.prototype.update=function(dt){
	if(this.moving==false){
		return;
	}
	
	//设置了目标位置即开始移动，动太目的位置后移动目标属性设为空
	//x轴
	if(this.moveto_x!=null){
		if(this.moveto_x<=this.x){
			this.x-=this.speed*dt;
			if(this.x<=this.moveto_x){
				this.x=this.moveto_x;
				this.moveto_x=null;
			}
		}
		else if(this.moveto_x>=this.x){
			this.x+=this.speed*dt;
			if(this.x>=this.moveto_x){
				this.x=this.moveto_x;
				this.moveto_x=null;
			}
		}
		
	}
	//y轴
	if(this.moveto_y!=null){
		if(this.moveto_y<=this.y){
			this.y-=this.speed*dt;
			if(this.y<=this.moveto_y){
				this.y=this.moveto_y;
				this.moveto_y=null;
			}
		}
		else if(this.moveto_y>=this.y){
			this.y+=this.speed*dt;
			if(this.y>=this.moveto_y){
				this.y=this.moveto_y;
				this.moveto_y=null;
			}
		}
	}
	//如果到达最北侧判断为冲刺
	if(this.moveto_x==null && this.moveto_y==null){
		this.moving=false;
		if(this.y==-20){
			console.log('win');
			this.win();
		}
	}
	
};

Player.prototype.handleInput=function(key){
	if(this.moving){
		return;
	}
	let x=null, y=null;
	if(key=='up'){
		y=this.y-83;
	}
	else if(key=='down'){
		y=this.y+83;
	}
	else if(key=='left'){
		x=this.x-101;
	}
	else if(key=='right'){
		x=this.x+101;
	}
	console.log('move to'+x+','+y);
	//不能移出边界
	if(y<-83 || y >5*83 || x<0 || x>4*101){
		return;
	}
	if(x!=null){
		this.moveto_x=x;
	}
	if(y!=null){
		this.moveto_y=y;
	}
	//每按一次按钮设置目标位置坐标用于移动动面
	if(this.moveto_x!=null || this.moveto_y!=null){
		console.log('start move');
		this.moving=true;
	}
	
};

//文字元件
var Text=function(){
	this.content='';
	this.font_size=16;
	this.font_family='arial';
	this.font_color='#333333';
	this.x=0;
	this.y=0;
	this.align='left';
	this.display_times=1;	//文字显示时间
};

Text.prototype.update=function(dt){
	this.display_times-=dt;
	if(this.display_times<=0){
		this.content='';
	}
	return;
};

Text.prototype.render=function(){
	ctx.font = this.font_size+'px '+this.font_family;
	ctx.fillText(this.content,this.x,this.y);
	ctx.textAlign=this.align; 
	ctx.fillStyle=this.color;
};

var pop_text=new Text();

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var allEnemies=[];
for(let i=0; i<6; i++){
	allEnemies.push(new Enemy());
}

allEnemies.push(pop_text);

var player=new Player();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


