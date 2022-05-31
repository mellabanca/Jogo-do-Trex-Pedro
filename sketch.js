var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOver, gameOverImage,restart,restartImage;

var jumpSong, deathSong, pointSong;

var mensagem = "Na minha cidade não para de chover";

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
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  jumpSong = loadSound("jump.mp3");
  deathSong = loadSound("die.mp3");
  pointSong = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  ground = createSprite(width/2,height-80,width,125);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;

  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 40);
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //console.log("Hello" + 5);
  
  score = 0;

  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImage);
  restart = createSprite(width/2,height/2);
  restart.scale = 0.5
  restart.addImage(restartImage);
  
}

function draw() {
  background(180);
 
  //console.log(mensagem);
  
  
  if(gameState === PLAY){
    //mover o solo
    ground.velocityX = -(5.5 +4* score / 100);
    score = score + Math.round(frameRate()/60);
    if(keyDown("space")&& trex.y >= height-120 || touches.length > 0 && trex.y >= height-120){
      trex.velocityY = -11;
      jumpSong.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    spawnClouds();
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
      gameState = END
      deathSong.play();
    }
    gameOver.visible = false;
    restart.visible = false;
    if(score%100 === 0&& score>0){
      pointSong.play();
      pointSong.setVolume(0.5)
    }

  }
  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;

    //parar o solo
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    trex.changeAnimation("collided");
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    if(mousePressedOver(restart) || touches.length > 0){
      reset();
      touches = [];
    }
  }
  
  trex.collide(invisibleGround);
  
  //gere as nuvens
  
  
  //gere obstáculos no solo
 
  
  drawSprites();
  text("Score: "+ score, 50,height/2-200);
}

function reset(){
  gameState = PLAY;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running");
  score = 0;

}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-95,10,40);
   obstacle.velocityX = -(6+4*score /100);

   
    // //gerar obstáculos aleatórios
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
   
    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width+10,height/2,40,10);
    cloud.y = Math.round(random(10,height/2+100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir vida útil à variável
    cloud.lifetime = 250;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
  }
  
}
