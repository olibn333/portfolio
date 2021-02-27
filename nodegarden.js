const SCREEN_WIDTH = document.body.clientWidth;
const SCREEN_HEIGHT = document.body.clientHeight;
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d',{ alpha: false });
canvas.width = SCREEN_WIDTH
canvas.height = SCREEN_HEIGHT

let nodes;
let thisFrame = 0
const INIT_NODES = 20
const MAX_NODES = 50
const MIN_DIST = SCREEN_HEIGHT / 5
const SPRING_AMOUNT = 0.1
const FRAMERATE = 1000 / 20
const NODE_RADIUS = SCREEN_HEIGHT / 200
const MAX_RADIUS = SCREEN_WIDTH / 50
const MIN_RADIUS = SCREEN_WIDTH / 150
const NEW_NODES_CLICK = 3
const BOUNCE_FORCE = 0.9
const RESISTANCE = 0.001
const GRAVYITY_CONSTANT = -0.0005
const MAX_VEL = 2
const SPAWN_DIST = SCREEN_HEIGHT / 10


// Explosion Options

const REL_PARTICLE_SIZE = 30
const REL_PARTICLE_COUNT = 1.5
const PARTICLE_EROSION = 0.1
const particlesPerExplosion = 5;
const particlesMinSpeed     = 3;
const particlesMaxSpeed     = 6;
const particlesMinSize      = 1;
const particlesMaxSize      = 2;
let explosions            = [];

let clicked = false

const titleText = 'Oliver Belfitt-Nash'

nodes_init();

function nodes_init() {
  nodes = createNodes();
  context.lineWidth = 1.5;
  for (i = 0; i < nodes.length; i++) {
    nodes[i].draw();
  }
  document.addEventListener('click', (e) => {
    
    
    if (nodes.length > MAX_NODES) {
      nodes = nodes.slice(-30)
    }

    if (!clicked)  {
    Array.from(titleText).map((char,i)=>{
      const centerX = canvas.width/2
      const centerY = canvas.height/2
      const lineX = context.measureText(titleText).width / 2
      const subTotalX = Array.from(titleText).slice(0,i).reduce((acc,char)=>context.measureText(char).width+acc,0)
      const offsetX = subTotalX + context.measureText(char).width / 2
      const charX = centerX - lineX + offsetX
      const thisColor = `255, 255, 255`
      
      explosions.push(new explosion(charX,centerY,5,10,thisColor))
      if (i%3==0) createNode(charX,centerY,thisColor,8)
    })

    } else {
      const color = `255, 255, 255`
    const radius = clamp(Math.random()*MAX_RADIUS,MIN_RADIUS,MAX_RADIUS)
    const thisNewNodes = 5
      createNode(Math.floor(e.clientX), Math.floor(e.clientY), color, radius)
      createNode(Math.floor(e.clientX), Math.floor(e.clientY) + SPAWN_DIST, color, radius)
      createNode(Math.floor(e.clientX) + SPAWN_DIST, Math.floor(e.clientY), color, radius)
      createNode(Math.floor(e.clientX) - SPAWN_DIST, Math.floor(e.clientY), color, radius)
      createNode(Math.floor(e.clientX), Math.floor(e.clientY) - SPAWN_DIST, color, radius)
     

    }

    clicked = true
  })
  drawFrame()

}

function drawFrame(){
  
  nodes_loop()
  
  drawExplosion()
  if (!clicked){
  drawText(titleText)
  }
  
window.requestAnimationFrame(drawFrame)
}

function drawText(text){
  
  context.font = '2.5rem EB Garamond';
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(text, canvas.width/2, canvas.height/2);

}

function createNode(x, y, rgb, radius) {
  var node = {
    color: rgb,
    radius: radius,
    x: x,
    y: y,
    vx: Math.random() * 6 - 3,
    vy: Math.random() * 6 - 3,
    update: function () {
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
    draw: function () {
      context.fillStyle = `rgb(${this.color})`;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    }
  }
  nodes.push(node)
}

function createNodes() {
  var nodes = [];
  for (var i = 0; i < INIT_NODES; i++) {
    var node = {
      color:`255,255,255`,
      radius: NODE_RADIUS,
      x: Math.floor(Math.random() * SCREEN_WIDTH),
      y: Math.floor(Math.random() * SCREEN_HEIGHT),
      vx: Math.random() * 6 - 3,
      vy: Math.random() * 6 - 3,
      update: function () {
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
      draw: function () {
        context.fillStyle = 'rgb(255,255,255)';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
      }
    };
    nodes.push(node);
  }
  return nodes;
}

function nodes_loop() {

  context.lineWidth = NODE_RADIUS / 1.1
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].update();
    nodes[i].draw();

    const node1 = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const node2 = nodes[j];

      const dx = node1.x - node2.x
      const dy = node1.y - node2.y
      const dist = Math.sqrt(dx * dx + dy * dy) - node1.radius - node2.radius
      const gravityPull = ((node1.radius * node2.radius) / dist ^ 2) * GRAVYITY_CONSTANT

      if (dist < MIN_DIST) {
        context.beginPath();
        context.strokeStyle = `rgba(255,255,255,` + (1 - dist / MIN_DIST) + ')';
        context.moveTo(node1.x, node1.y);
        context.lineTo(node2.x, node2.y);
        context.stroke();
        context.closePath();

        node1.vx += dx * gravityPull / node1.radius
        node1.vy += dy * gravityPull / node1.radius
        node2.vx -= dx * gravityPull / node2.radius
        node2.vy -= dy * gravityPull / node2.radius
      }

      if (dist <= 0 && !node1.isColliding) {
        const entropy = Math.random()
        // console.log(entropy)
        node1.isColliding = true
        node2.isColliding = true
        const biggerNode = node1.radius >= node2.radius ? node1 : node2
        const smallerNode = node1.radius >= node2.radius ? node2 : node1
        
        if (entropy <= 0.3) {
          // console.log('Explode')
          const smallerArea = Math.PI*smallerNode.radius^2
          // const thisParticleSize = Math.floor(Math.max(smallerArea / (gravityPull*REL_PARTICLE_SIZE),5))
          // const thisParticleCount = Math.floor(Math.max(smallerArea/thisParticleSize,3))
          const thisParticleCount = 10
          const thisParticleSize = smallerNode.radius*1.5
          const thisColor = smallerNode.color
          // console.log('Explode Particles:', thisParticleCount, 'Size:', thisParticleSize, 'Color:',smallerNode.color)
          explosions.push(
            new explosion(smallerNode.x, smallerNode.y, thisParticleCount , thisParticleSize, thisColor)
          );
          nodes = nodes.filter(n => !(n.x == smallerNode.x && n.y == smallerNode.y))
          biggerNode.vx = -smallerNode.vx * smallerNode.radius/biggerNode.radius
          biggerNode.vy = -smallerNode.vy * smallerNode.radius/biggerNode.radius
        }
        if (0.8 > entropy > 0.3) {
          // console.log('Bounce')
          const smallerArea = Math.PI*smallerNode.radius^2
          // const thisParticleSize = Math.floor(Math.max(smallerArea / (gravityPull*REL_PARTICLE_SIZE),5)/2)
          // const thisParticleCount = Math.floor(Math.max(smallerArea/thisParticleSize,3)/2)
          const thisParticleCount = 5
          const thisParticleSize = smallerNode.radius*1.5
          const thisColor = `255, 255, 255`
          explosions.push(
            new explosion(smallerNode.x, smallerNode.y, thisParticleCount , thisParticleSize, thisColor)
          );

          biggerNode.vx -= -smallerNode.vx * smallerNode.radius/biggerNode.radius * 2
          biggerNode.vy -= -smallerNode.vy * smallerNode.radius/biggerNode.radius * 2
        }
        if (entropy > 0.8) {
          // console.log('Merge')
          const biggerNode = node1.radius >= node2.radius ? node1 : node2
          const smallerNode = node1.radius >= node2.radius ? node2 : node1
          biggerNode.radius += smallerNode.radius
          nodes = nodes.filter(n => !(n.x == smallerNode.x && n.y == smallerNode.y))
        }
      } else {
        node1.isColliding = false
        node2.isColliding = false
      }
      
    }

    nodes[i].vx = clamp(nodes[i].vx,-MAX_VEL,MAX_VEL)
    nodes[i].vy = clamp(nodes[i].vy,-MAX_VEL,MAX_VEL)
    nodes[i].radius = Math.min(nodes[i].radius,MAX_RADIUS)
  }

  
}

// Explosion
function explosion(x, y, particlesCount, particleSize, particleColor) {

  this.particles = [];

  for (let i = 0; i < particlesCount; i++) {
    this.particles.push(
      new particle(x, y, particleColor, particleSize)
    );
  }

}


// Particle
function particle(x, y, color, particleSize) {
  this.x    = x;
  this.y    = y;
  this.xv   = randInt(particlesMinSpeed, particlesMaxSpeed, false);
  this.yv   = randInt(particlesMinSpeed, particlesMaxSpeed, false);
  this.size = randInt(1,particleSize,true);
  this.color = color
}

function drawExplosion() {
  
  if (explosions.length === 0) {
    return;
  }

  for (let i = 0; i < explosions.length; i++) {

    const explosion = explosions[i];
    const particles = explosion.particles;

    if (particles.length === 0) {
      explosions.splice(i, 1);
      return;
    }

    let particlesAfterRemoval = particles.slice();
    for (let ii = 0; ii < particles.length; ii++) {

      const particle = particles[ii];

      // Check particle size
      // If 0, remove
      if (particle.size <= 1) {
        particlesAfterRemoval.splice(ii, 1);
        continue;
      }
      
      context.fillStyle = `rgb(${particle.color})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
      context.closePath();
      context.fill();

      // Update
      particle.x += Math.floor(particle.xv);
      particle.y += Math.floor(particle.yv);
      particle.size -= 0.2;
    }

    explosion.particles = particlesAfterRemoval;

  }

}

function randomColor() {
  return Math.round(Math.random() * 155) + 100
}
function randRGB() {
  const r = randomColor()
  const g = randomColor()
  const b = randomColor()
  return `${r}, ${g}, ${b}`
  // return `255, 255, 255`
}

function randInt(min, max, positive) {

  let num;
  if (positive === false) {
    num = Math.floor(Math.random() * max) - min;
    num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
  } else {
    num = Math.floor(Math.random() * max) + min;
  }

  return num;

}

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

// module.exports = {createNode}