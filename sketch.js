// creating variables
var trex, trexImage, trexCollide
var ground, groundImage
var invisbleground
var clouds, cloudsImage
var obstcales
var obstcalesImage1, obstcalesImage2, obstcalesImage3, obstcalesImage4, obstcalesImage5, obstcalesImage6

var PLAY = 0
var END = 1

var gameState = PLAY
var score = 0

var obstacleGroup;
var cloudsGroup;

var gameOver, gameOverImage;
var restart, restartImage;

var jumpsound, diesound, checkPointsound
localStorage["HighestScore"]=0

// to load the images, audio video an gif we use preload function
function preload() {
  trexImage = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  groundImage = loadImage("ground2.png")
  cloudsImage = loadImage("cloud.png")
  obstcalesImage1 = loadImage("obstacle1.png")
  obstcalesImage2 = loadImage("obstacle2.png")
  obstcalesImage3 = loadImage("obstacle3.png")
  obstcalesImage5 = loadImage("obstacle4.png")
  obstcalesImage4 = loadImage("obstacle5.png")
  obstcalesImage6 = loadImage("obstacle6.png")

  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")

  trexCollide = loadAnimation("trex_collided.png")

  jumpsound = loadSound("jump.mp3")
  diesound = loadSound("die.mp3")
  checkPointsound = loadSound("checkpoint (1).mp3")


}

// to create sprite only on time we use setup functions
function setup() {
  createCanvas(windowWidth,windowHeight)

  trex = createSprite(40, height-100, 40, 40)
  trex.addAnimation("trex", trexImage)
  trex.addAnimation("collide", trexCollide)
  trex.scale = 0.5

  ground = createSprite(300, height-50, 600, 20)
  ground.addImage("ground", groundImage)

  invisbleground = createSprite(300, height-40, 600, 20)
  invisbleground.visible = false

  // console.log(trex.depth)

  //  creating Group , new Group(), createGroup()

  obstacleGroup = new Group()
  cloudsGroup = new Group()


  //GameOver Image
  gameOver = createSprite(width/2, height/2+100)
  gameOver.addImage("over", gameOverImage)
  gameOver.scale = 0.5

  restart = createSprite(width/2,height/2+150)
  restart.addImage("start", restartImage)
  restart.scale = 0.5

  trex.debug = false
  trex.setCollider("circle", 0, 10, 45)




}


//  to assign function multiple time we use draw function 
function draw() {
  // recgonse coordinates
  background("white")
  text(mouseX + " " + mouseY, mouseX, mouseY)
  textSize(20)

  fill("black")
  text("Score:  " + score, width/4+200,height/2+50)
  textStyle("bold")
  text("Highest Score: " +localStorage["HighestScore"], width/4-100,height/2+50)

  if (gameState === PLAY) {
    gameOver.visible = false
    restart.visible = false
    score = score + Math.round(frameCount % 2 === 0)
    // ground velocity
    ground.velocityX = -(4 + score / 100)
    //  jump trex
    if (keyDown("space") && trex.y >= height-130) {
      trex.velocityY = -6
      jumpsound.play()
      
    }
    else if(touches.length>0 && trex.y >= height-130 ){
      trex.velocityY = -6
      jumpsound.play()
      touches=[]
    }




    // gravity to trex
    trex.velocityY = trex.velocityY + 0.5


    // infinite background
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }



    if (trex.isTouching(obstacleGroup)) {
      gameState = END
      trex.changeAnimation("collide", trexCollide)
      diesound.play()
    }

    // calling function
    spawclouds()
    spawnObstcales()


    if (score > 0 && score % 100 === 0) {
      checkPointsound.play()
    }
  }


  else if (gameState === END) {

    ground.velocityX = 0
    trex.velocityY = 0
    obstacleGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)

    cloudsGroup.setLifetimeEach(10)
    obstacleGroup.setLifetimeEach(10)


    gameOver.visible = true
    restart.visible = true

    if (touches.length> 0 || mousePressedOver(restart)) {
      restartGame()
      touches=[]
    }
    
  }

  // console.log(trex.y)
  // trex collide
  trex.collide(invisbleground)
  drawSprites()

}


function spawclouds() {
  if (frameCount % 40 === 0) {
    clouds = createSprite(width-45, height+400, 80, 20)
    clouds.addImage("clouds", cloudsImage)
    clouds.velocityX = -6
    // math random and round
    clouds.y = Math.round(random((height-200),(height-300)))
    // console.log(clouds.depth)

    clouds.depth = trex.depth
    trex.depth += 1


    // adding clouds to clouds Group
    cloudsGroup.add(clouds)
    // console.log(cloudsGroup.length)



    // lifetime= distance/ speed(velocity)
    // lifetime= 470/6
    // lifetime=78.33 =78
    clouds.lifetime = width/6
  }
}



function spawnObstcales() {
  if (frameCount % 60 === 0) {
    obstcales = createSprite(520, height-75, 10, 50)
    obstcales.velocityX = -(6 + score / 100)
    obstcales.scale = 0.7
    obstcales.lifetime = 75
    obstacleGroup.add(obstcales)
    // console.log(obstacleGroup.length)

    // total
    var rand = Math.round(random(1, 6))
    switch (rand) {
      case 1: obstcales.addImage(obstcalesImage1)
        break;
      case 2: obstcales.addImage(obstcalesImage2)
        break;
      case 3: obstcales.addImage(obstcalesImage3)
        break;
      case 4: obstcales.addImage(obstcalesImage4)
        break;
      case 5: obstcales.addImage(obstcalesImage5)
        break;
      case 6: obstcales.addImage(obstcalesImage6)
        break;
      default: break;

    }

  }
}



function restartGame() {
  gameState = PLAY
  // gameOver.visible=false
  // restart.visible=false
  obstacleGroup.destroyEach()
  cloudsGroup.destroyEach()
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score

  }

  score = 0
  trex.changeAnimation("trex", trexImage)
}

