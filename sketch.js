var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth,displayHeight);

 
  
  trex = createSprite(displayWidth-1300,displayHeight-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(camera.x,displayHeight-20,displayWidth+10000000000000,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(camera.x,displayHeight/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(camera.x,displayHeight/2+120);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 1
  restart.scale = 1
  
  invisibleGround = createSprite(camera.x,displayHeight-10,displayWidth+10000000,20);
  invisibleGround.visible = false;
  
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  score = 0;
  
}

function draw() {
  
  background(180);
  
  text("Score: "+ score, displayWidth/2+300,displayHeight/2-100);
  console.log(getFrameRate());
  
  camera.x=trex.x
  if(gameState === PLAY){
trex.changeAnimation("running", trex_running);
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
  
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2
    }
    
    
    if(keyDown("space")&& trex.y >= displayHeight/2+300) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    
    trex.velocityY = trex.velocityY + 1
  
    
    spawnClouds();
  
    
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     if(mousePressedOver(restart)) {
      reset();
    }


     
    
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
 
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
   trex.changeAnimation("running", trex_running);
  score=0;
  
}





function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(camera.x+displayWidth/2,displayHeight-35,10,40);
   obstacle.velocityX = -(6 + score/100);
   
   
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
         
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
 
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x+displayWidth/2,displayHeight/2,40,10);
    cloud.y = Math.round(random(displayHeight/2,displayHeight/2+100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     
    cloud.lifetime = displayWidth;
    
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    
    cloudsGroup.add(cloud);
  }
}

