let truck, truckTrailer;
let truckY, truckX = -80, truckSpeed = 2.5;
let products = [];
let collected = 0, totalTime = 60, startTime, remaining;
let isNight = false;
let clouds = [], hills = [];

function setup() {
  createCanvas(900, 500);
  truckY = height/2 + 60;
  startTime = millis();
  
  // estoque de produtos
  for(let i=0;i<10;i++) products.push({ x: random(50, width/2-50), y: random(height/2+30, height-60), c: 0, caught: false });
  
  // nuvens
  for(let i=0;i<7;i++) clouds.push({ x: random(width), y: random(50,150), s: random(0.3,1.0), size: random(60,100) });
  
  // morros
  for(let x=0; x<width; x+=200) hills.push({ x, y: height/2 + 120, h: random(80,150) })
}

function draw() {
  updateTimer();
  drawSky();
  drawClouds();
  drawHills();
  drawCampo();
  drawCidade();
  drawEstrada();
  moveTruck();
  drawTruck();
  drawProducts();
  drawHUD();
  checkGameOver();
}

function updateTimer(){
  remaining = max(0, totalTime - floor((millis()-startTime)/1000));
}

function drawSky(){
  let c1 = isNight ? color(15,24,56) : color(135,206,250);
  let c2 = isNight ? color(30,40,80) : color(200,240,255);
  for(let y=0;y<height/2;y++){
    let inter = map(y,0,height/2,0,1);
    stroke(lerpColor(c1,c2,inter)); line(0,y,width,y);
  }
  noStroke();
  if(isNight) drawMoon(); else drawSun();
}

function drawSun(){
  fill(255,204,0); ellipse(width-150,80,80);
}

function drawMoon(){
  fill(230); ellipse(width-150,80,60);
  fill(isNight?color(15,24,56):color(200));
  ellipse(width-160,70,30);
}

function drawClouds(){
  fill(255,255,255,200);
  noStroke();
  for(let c of clouds){
    ellipse(c.x,c.y,c.size,c.size*0.6);
    ellipse(c.x+c.size*0.4,c.y+10,c.size*0.7,c.size*0.5);
    c.x += c.s;
    if(c.x>width+50) c.x=-100;
  }
}

function drawHills(){
  fill(70,150,70);
  noStroke();
  for(let h of hills){
    ellipse(h.x,h.y,h.h*2,h.h);
  }
}

function drawCampo(){
  fill(80,160,100); rect(0,height/2,width/2,height/2);
}

function drawCidade(){
  fill(160); rect(width/2,height/2,width/2,height/2);
  for(let i=width/2+20;i<width;i+=80){
    let h = map(sin(frameCount*0.01+i), -1,1,100,180);
    fill(100); rect(i,height-h,50,h);
    for(let j=height-h+20;j<height-10;j+=25){
      fill(isNight?255:220,220,100);
      rect(i+10,j,12,12,3);
    }
  }
}

function drawEstrada(){
  fill(50); rect(0,height/2+100,width,60);
  stroke(255); strokeWeight(4);
  for(let i=0;i<width;i+=50) line(i,height/2+130,i+25,height/2+130);
  noStroke();
}

function moveTruck(){
  truckX += truckSpeed;
  if(truckX>width+50) truckX=-80;
}

function drawTruck(){
  fill(200,30,30);
  rect(truckX,truckY,80,35,6);
  fill(15,90,200); rect(truckX+60,truckY-5,25,25,4);
  fill(0); ellipse(truckX+20,truckY+38,20); ellipse(truckX+60,truckY+38,20);
}

function drawProducts(){
  for(let p of products){
    if(!p.caught){
      push();
      fill(255,230,0,200);
      let b = sin(p.c*0.1)*4;
      ellipse(p.x, p.y + b, 18,18);
      pop();
      if(dist(truckX+40, truckY+20, p.x, p.y) < 35){
        p.caught = true; collected++;
      }
      p.c++;
    }
  }
}

function drawHUD(){
  let sc = collected * 10;
  fill(255,255,255,180); noStroke();
  rect(10,10,260,80,8);
  fill(50); textSize(18);
  text(`Produtos: ${collected}`, 20,35);
  text(`Pontuação: ${sc}`, 20,60);
  text(`Tempo: ${remaining}s`, 20,85);
}

function checkGameOver(){
  if(remaining===0){
    noLoop();
    fill(0,180); rect(0,0,width,height);
    fill(255); textAlign(CENTER, CENTER); textSize(36);
    text(`Fim de jogo!\nVocê fez ${collected*10} pontos`, width/2, height/2);
  }
}

function keyPressed(){
  if(keyCode === UP_ARROW) truckY = max(height/2+20, truckY-50);
  if(keyCode === DOWN_ARROW) truckY = min(height-40, truckY+50);
}

function mousePressed(){
  if(mouseY < height/2) isNight = !isNight;
}