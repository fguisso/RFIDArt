let colors = [
    "#919191",
    "#7c7c7c",
    "#939393",
    "#474747",
    "#9e9e9e"
    // "#E37B40",
    // "#46B29D",
    // "#DE5B49",
    // "#324D5C",
    // "#F0CA4D"
];

// Canvas
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Options
const c = canvas.getContext('2d');

const mouse = {
    x:innerWidth/2,
    y:innerHeight/2
};
minradius=1;
maxradius=30;

// Lisnteners
self.window.addEventListener("resize",function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
self.window.addEventListener("mousemove",function (event) {
    mouse.x=event.x;
    mouse.y=event.y;
});
self.window.addEventListener("touchmove",function (event) {
    mouse.x=parseInt(event.changedTouches[0].clientX);
    mouse.y=parseInt(event.changedTouches[0].clientY);
});
self.window.addEventListener("touchend",function(){
    mouse.x=undefined;
    mouse.y=undefined;
});

// Circles
class Circle {
    constructor(x,y,r,dx,dy) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.dx = dx;
        this.dy = dy;
        this.min = minradius;
        this.max = maxradius;
        this.col = colors[Math.floor((Math.random() * colors.length))];
        this.draw = () => {
            c.beginPath();
            c.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
            c.fillStyle = this.col;
            c.fill();
        };
        this.update=function (){
            this.x+=this.dx;
            this.y+=this.dy;
            if(mouse.x - this.x < 100 && mouse.x - this.x > - 100 && mouse.y - this.y < 100 && mouse.y - this.y > - 100){
                if(this.r < this.max){
                    this.r += 1;
                }
            }else if(this.r > this.min){
                this.r -= 1;
            }
            this.draw();
        }
    }
}

const circles= [];

// Animation
const ani = () => {
    requestAnimationFrame(ani);
    c.clearRect(0,0,innerWidth,innerHeight);
    const x = mouse.x;
    const y = mouse.y;
    const dx = (Math.random() - 0.5) * 5 + (Math.random() < 0.5 ? -2 : 2);
    const dy = (Math.random() - 0.5) * 5 + (Math.random() < 0.5 ? -2 : 2);
    const radi = (Math.random()) * 3+10;
    circles.push(new Circle(x,y,radi,dx,dy));
    for(i = 0; i < circles.length; i++){
        if(circles[i].r < minradius){
            circles.splice(i,1);
        }
        circles[i].update();
    };
};
ani();

// Helper functions
function shiftColor(base, change, direction) {
  const colorRegEx = /^\#?[A-Fa-f0-9]{6}$/;

  // Missing parameter(s)
  if (!base || !change) {
    return '000000';
  }

  // Invalid parameter(s)
  if (!base.match(colorRegEx) || !change.match(colorRegEx)) {
    return '000000';
  }

  // Remove any '#'s
  base = base.replace(/\#/g, '');
  change = change.replace(/\#/g, '');

  // Build new color
  let newColor = '';
  for (let i = 0; i < 3; i++) {
    const basePiece = parseInt(base.substring(i * 2, i * 2 + 2), 16);
    const changePiece = parseInt(change.substring(i * 2, i * 2 + 2), 16);
    let newPiece = '';

    if (direction === 'add') {
      newPiece = (basePiece + changePiece);
      newPiece = newPiece > 255 ? 255 : newPiece;
    }
    if (direction === 'sub') {
      newPiece = (basePiece - changePiece);
      newPiece = newPiece < 0 ? 0 : newPiece;
    }

    newPiece = newPiece.toString(16);
    newPiece = newPiece.length < 2 ? '0' + newPiece : newPiece;
    newColor += newPiece;
  }

  return newColor;
}

// Query options
const queryString = document.location.search;
const urlParams = new URLSearchParams(queryString);
const shiftType = queryString ? urlParams.get("op") : "sub";

// Web NFC API
const ndef = new NDEFReader();
ndef.scan();

ndef.addEventListener("readingerror", () => {
    console.log("Argh! Cannot read data from the NFC tag. Try another one?");
});

ndef.addEventListener("reading", ({ serialNumber }) => {
    console.log(`> Serial Number: ${serialNumber}`);
    const serialColor = `${serialNumber.split(":")[0]}${serialNumber.split(":")[1]}${serialNumber.split(":")[2]}`;
    colors[0] = `#${shiftColor("919191", serialColor, shiftType)}`;
    colors[1] = `#${shiftColor("7c7c7c", serialColor, shiftType)}`;
    colors[2] = `#${shiftColor("939393", serialColor, shiftType)}`;
    colors[3] = `#${shiftColor("474747", serialColor, shiftType)}`;
    colors[4] = `#${shiftColor("9e9e9e", serialColor, shiftType)}`;
});
