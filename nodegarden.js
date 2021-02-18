const SCREEN_WIDTH = document.body.clientWidth;
const SCREEN_HEIGHT = document.body.clientHeight;
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = SCREEN_WIDTH
canvas.height = SCREEN_HEIGHT

let nodes;
const INIT_NODES = 10
const MAX_NODES = 50
const MIN_DIST = SCREEN_HEIGHT/5
const SPRING_AMOUNT = 0.1
const FRAMERATE = 1000/40
const NODE_RADIUS = SCREEN_HEIGHT/200
const MAX_RADIUS = SCREEN_HEIGHT/20
const NEW_NODES_CLICK = 2


nodes_init();

function nodes_init() {
  nodes = createNodes();
  context.lineWidth = 1.5;
  for (i=0; i<nodes.length; i++) {
    nodes[i].draw();
  }
  document.addEventListener('click',(e)=>{
    console.log(nodes.length)
    const color = randomRGB()
    const radius = Math.random()*MAX_RADIUS
    const thisNewNodes = nodes.length == INIT_NODES ?  (NEW_NODES_CLICK * 5) : NEW_NODES_CLICK
    for (i=0;i<thisNewNodes;i++){
      createNode(e.clientX+i*5, e.clientY+i*5,color,radius)
    }
    if (nodes.length > MAX_NODES){
      nodes = nodes.slice(-30)
    }
  })
  
  setInterval(nodes_loop, FRAMERATE);
}

function createNode(x,y,rgb,radius){
  var node = {
    radius: radius,
    x: x,
    y: y,
    vx: Math.random()*6-3,
    vy: Math.random()*6-3,
    update: function() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x > SCREEN_WIDTH) {
        this.x = 0;
      } else if (this.x < 0) {
        this.x = SCREEN_WIDTH;
      }
      if (this.y > SCREEN_HEIGHT) {
        this.y = 0;
      } else if (this.y < 0) {
        this.y = SCREEN_HEIGHT;
      }
    },
    draw: function() {
      context.fillStyle = `rgb(${rgb})`;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
      context.closePath();
      context.fill();
    }
  }
  nodes.push(node)
}

function createNodes() {
  var nodes = [];
  for (var i=0; i<INIT_NODES; i++) {
    var node = {
      radius: NODE_RADIUS,
      x: Math.round(Math.random()*SCREEN_WIDTH),
      y: Math.round(Math.random()*SCREEN_HEIGHT),
      vx: Math.random()*6-3,
      vy: Math.random()*6-3,
      update: function() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > SCREEN_WIDTH) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = SCREEN_WIDTH;
        }
        if (this.y > SCREEN_HEIGHT) {
          this.y = 0;
        } else if (this.y < 0) {
          this.y = SCREEN_HEIGHT;
        }
      },
      draw: function() {
        context.fillStyle = 'rgb(255,255,255)';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
      }
    };
    nodes.push(node);
  }
  return nodes;
}

function nodes_loop() {
  
context.lineWidth = NODE_RADIUS/1.1
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (i=0; i<nodes.length; i++) {
    nodes[i].update();
    nodes[i].draw();

    var node1 = nodes[i];
    for (var j=i+1; j<nodes.length; j++) {
      var node2 = nodes[j];

      var dx = node1.x - node2.x
      var dy = node1.y - node2.y
      var dist = Math.sqrt(dx*dx + dy*dy)
      const gravityPull = ((node1.radius*node2.radius)/dist^2)*-0.001

      if (dist<MIN_DIST) {
        context.beginPath();
        context.strokeStyle = `rgba(255,255,255,`+(1-dist/MIN_DIST)+')';
        context.moveTo(node1.x, node1.y);
        context.lineTo(node2.x, node2.y);
        context.stroke();
        context.closePath();

        var ax = dx*SPRING_AMOUNT*gravityPull;
        var ay = dy*SPRING_AMOUNT*gravityPull;
        node1.vx += dx * gravityPull/node1.radius;
        node1.vy += dy * gravityPull/node1.radius;
        node2.vx -= dx * gravityPull/node2.radius;
        node2.vy -= dy * gravityPull/node2.radius;
      }
    }
  }
}

function randomColor(){
  return Math.round(Math.random()*255)
}
function randomRGB(){
  const r = randomColor()
  const g = randomColor()
  const b = randomColor()
  return `${r}, ${g}, ${b}`
}

// module.exports = {createNode}