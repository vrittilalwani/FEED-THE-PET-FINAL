
var gameStates;
var readState;
var dog,hungryDog,happyDog,sleepingDog,deadDog; 
var rightDog,leftDog;
var canvas,database;
var credit,creditRem;
var foodS,foodStock;
var buyFood;
var fedTime,lastFed,currentTime;
var feed;
var score,credit1;
var h;


function preload(){
hungryDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/Happy.png");
sleepingDog=loadImage("Images/Lazy.png");
deadDog=loadImage("Images/deadDog.png");

//Dog going to right and left side
rightDog=loadImage("Images/running.png");
leftDog=loadImage("Images/runningLeft.png");
}


function setup() {
  database=firebase.database();
  canvas=createCanvas(displayWidth-20,displayHeight-20);

  dog=createSprite(displayWidth/2,displayHeight-100,20,20);
  dog.scale=0.2;

score = new Score();
credit1 = new Credit();

 foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  credit=database.ref('Credit');
  credit.on("value",function(data){
    creditRem=data.val();
  });

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameStates=data.val();
  });
 

  buyFood=createButton("Buy Food");
  buyFood.position(displayWidth-300,200);
  buyFood.mousePressed(buyaFood);

  feed=createButton("Feed the dog");
  feed.position(displayWidth-300,250);
  feed.mousePressed(feeddog);
}

function draw() {
  background("white");  
  console.log(gameStates);

  if(gameStates==="playing"){
  
  edges=createEdgeSprites();
  dog.collide(edges[0]);
  dog.collide(edges[1]);
}

  if(gameStates==="hungry"){
    dog.addImage(hungryDog);
    text("I AM HUNGRY",200,400);
  }
 
currentTime=hour();
 if(lastFed===currentTime){
   text("Thank You", 200,400);
  dog.addImage(happyDog);
   gameStates="playing";
   //let the dog move 
   if(keyDown(LEFT_ARROW)){
    dog.addImage(leftDog);
    dog.position.x=dog.position.x-20;
  }
  if(keyDown(RIGHT_ARROW)){
    dog.addImage(rightDog);
    dog.position.x=dog.position.x+20;
  }
   update("playing");
 } 
 else
 if(currentTime<(lastFed+2) && currentTime>(lastFed+4)){
   text("Sleeping",200,400);
   gameStates="sleeping";
   dog.addImage(sleepingDog);
   update("sleeping");
 }
 else 
 if(currentTime<(lastFed+5) && currentTime>(lastFed+7)){
   gameStates="hungry";
   dog.addImage(hungryDog);
   update("hungry");
 }
 else
 if(currentTime>(lastFed+8)&& lastFed>0){
   text("GoodBye",200,400);
   gameStates="end";
   dog.addImage(deadDog);
   update("end");
 }
 if(gameStates==="end"){
    buyFood.hide();
    feed.hide();
  }

  //If credit or food Stock is 0 hide the buttons 
  if(creditRem<0){
    buyFood.hide();
  }
  if(foodS===0){
    feed.hide();
  }
 score.display();
 credit1.display();
  drawSprites();
}

//function to update gamestates in database
function update(state){
  database.ref('/').update({
    gameState:state
  });
}

function readStock(data){
  foodS=data.val();
}

function buyaFood(){
  creditRem=creditRem-5;
  foodS++;
  database.ref('/').update({
    Credit:creditRem,
    Food:foodS
  })
}

function feeddog(){
  h=hour();
  dog.addImage(happyDog);
  foodS--;
  database.ref('/').update({
    Food:foodS,
    FeedTime:h,
    gameState:"playing"
  })
}


/*function writeStock(x){
  database.ref('/').update({
    Food:x
  })
}*/