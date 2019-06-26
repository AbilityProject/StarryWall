//serial communication
var serial;
var inData;
let data = [0,0,0];

var stars = [];
var Star;
var starsNum;

var star1;
var star2;
var colorstar1, colorstar2, colorstar3;

var colorstars = [];
var colorStar;
var colornum;

var shootingstars = [];
var ShootingStar;

function preload() {
  star1 = loadImage("images/star1.png");
  star2 = loadImage("images/star2.png");
  colorstar1 = loadImage("images/colorstar1.png");
  colorstar2 = loadImage("images/colorstar2.png");
  colorstar3 = loadImage("images/colorstar3.png");

}

function keyPressed(){
  if(key == '0')
    data[0] = 1;
  else if(key == '1')
      data[1] = 1;
  else if(key == '2')
      data[2] = 1;
  print(data);
  // serialEvent();
  return false; // prevent any default behavior
}

function keyReleased() {
  if(key == '0')
    data[0] = 0;
  else if(key == '1')
      data[1] = 0;
  else if(key == '2')
      data[2] = 0;
  print(data);
  // serialEvent();
  return false; // prevent any default behavior
}

function setup() {
  let fs = fullscreen();
  //Serial Communication
  serial = new p5.SerialPort(); // make a new instance of  serialport librar
  // serial.on('data', serialEvent); // callback for new data coming in
  serial.open("/dev/cu.usbmodem141101"); // open a port

  // serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  starsNum = 100;
  imageMode(CENTER);
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < starsNum; i++) {
    stars[i] = new Star(random(width), random(height), random(1, 25));
  }
}


function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialEvent() {
  if(serial){
    inData = serial.readLine();
    // print(data);
    if (inData !== "") {
      data = inData.split(',');
      // print(data);
    }
  }


}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}

function mousePressed() {
  let num = int(random(1, 5));
  for (let j = num - 1; j >= 0; j--) {
    var ss = [];
    ss[j] = new ShootingStar(random(width, 2 * width), random(-height, 0));
    shootingstars.push(ss[j]);
  }
}

function draw() {
  background(0, 90);

  for (let j = shootingstars.length - 1; j >= 0; j--) {
    shootingstars[j].update();
    shootingstars[j].display();
  }

  for (let i = 0; i < stars.length - 1; i++) {
    stars[i].update();
    stars[i].checkEdge();
    stars[i].display();
  }

  for (let q = colorstars.length - 1; q >= 0; q--) {
    colorstars[q].update();
    colorstars[q].checkEdge();

    if (q % 3 == 0) colorstars[q].display1();
    if (q % 3 == 1) colorstars[q].display2();
    if (q % 3 == 2) colorstars[q].display3();
  }

  let num = int(random(1, 3));
  // print(num);
  for (let q = num - 1; q >= 0; q--) {
    var color1 = [];
    var color2 = [];
    var color3 = [];
    if (q % 3 == 0) {
      color1[q] = new colorStar(random(width), random(height), 20);
      colorstars.push(color1[q]);
    } else if (q % 3 == 1) {
      color2[q] = new colorStar(random(width), random(height), 20);
      colorstars.push(color2[q]);
    } else {
      color3[q] = new colorStar(random(width), random(height), 20);
      colorstars.push(color3[q]);
    }
  }
}

function colorStar(x, y, s) {
  this.x = x;
  this.y = y;

  this.s = s;
  this.splus = 0;
  this.soffset = 0.005;

  this.update = function() {
    this.splus += this.soffset;
    this.s -= this.splus;
  }

  this.checkEdge = function() {
    if (this.s <= 0) {
      this.splus = 0;
      this.soffset = 0;
    }
  }


  this.display1 = function() {
    if (data[0] == 1) {
      image(colorstar1, this.x, this.y, this.s, this.s);
    }
  }

  this.display2 = function() {

    if (data[1] == 1) {
      image(colorstar2, this.x, this.y, this.s, this.s);
    }
  }

  this.display3 = function() {
    if (data[2] == 1) {
      image(colorstar3, this.x, this.y, this.s, this.s);
    }
  }
}

function ShootingStar(x, y) {

  this.pos = createVector(x, y);
  this.vel = createVector(-1, 1);
  this.acc = createVector(-0.3, 0.3);

  this.update = function() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
  }

  this.display = function() {
    // ellipse(this.x,this.y,20,20);
    image(star1, this.pos.x, this.pos.y, 20, 20);
  }
}

function Star(x, y, s) {
  this.x = x;
  this.y = y;

  this.s = s;
  this.splus = 0;
  this.soffset = 0.005;
  this.a = this.a;
  this.update = function() {
    this.splus += this.soffset;
    this.s += this.splus;
  }
  this.checkEdge = function() {

    //if(positionX>width-scale || positionX<scale){
    // xspd*=-1;
    //}

    if (this.splus >= 0.2 || this.splus <= -0.2) {
      this.soffset *= -1;
    }
  }

  this.display = function() {
    // console.log("here");



    // scale(this.s);
    image(star2, this.x, this.y, this.s, this.s);
    image(star1, this.y, this.x, this.s, this.s);


    // ellipse(this.x,this.y,this.s,this.s);
    // fill(255);
    // ellipse(this.x,this.y,10,10);

  }
}
