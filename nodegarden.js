const SCREEN_WIDTH = document.body.clientWidth;
const SCREEN_HEIGHT = document.body.clientHeight;
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
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
const MAX_RADIUS = SCREEN_HEIGHT / 50
const NEW_NODES_CLICK = 3
const BOUNCE_FORCE = 0.9
const RESISTANCE = 0.001
const GRAVYITY_CONSTANT = -0.001
const MAX_VEL = 5
const SPAWN_DIST = 50


// Explosion Options

const REL_PARTICLE_SIZE = 100
const REL_PARTICLE_COUNT = 2
const PARTICLE_EROSION = 0.1
const particlesPerExplosion = 10;
const particlesMinSpeed     = 3;
const particlesMaxSpeed     = 6;
const particlesMinSize      = 1;
const particlesMaxSize      = 2;
let explosions            = [];


nodes_init();

function nodes_init() {
  nodes = createNodes();
  context.lineWidth = 1.5;
  for (i = 0; i < nodes.length; i++) {
    nodes[i].draw();
  }
  document.addEventListener('click', (e) => {
    const color = `255, 255, 255`
    const radius = Math.random() * MAX_RADIUS
    const thisNewNodes = 5
    // for (let i = 0; i < thisNewNodes; i++) {
      createNode(e.clientX + SPAWN_DIST, e.clientY, color, radius)
      createNode(e.clientX, e.clientY + SPAWN_DIST, color, radius)
      createNode(e.clientX + SPAWN_DIST, e.clientY + SPAWN_DIST, color, radius)
      createNode(e.clientX - SPAWN_DIST, e.clientY, color, radius)
      createNode(e.clientX, e.clientY - SPAWN_DIST, color, radius)
      createNode(e.clientX - SPAWN_DIST, e.clientY - SPAWN_DIST, color, radius)
    // }
    if (nodes.length > MAX_NODES) {
      nodes = nodes.slice(-30)
    }
  })

  setInterval(drawFrame, FRAMERATE);
}

function drawFrame(){
  nodes_loop()
  drawExplosion()
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
      x: Math.round(Math.random() * SCREEN_WIDTH),
      y: Math.round(Math.random() * SCREEN_HEIGHT),
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
          const thisParticleSize = 5
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
          const thisParticleSize = 5
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

    const particlesAfterRemoval = particles.slice();
    for (let ii = 0; ii < particles.length; ii++) {

      const particle = particles[ii];

      // Check particle size
      // If 0, remove
      if (particle.size <= 0.5) {
        particlesAfterRemoval.splice(ii, 1);
        continue;
      }
      
      context.fillStyle = `rgb(${particle.color})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
      context.closePath();
      context.fill();

      // Update
      particle.x += particle.xv;
      particle.y += particle.yv;
      particle.size -= particle.size*PARTICLE_EROSION;
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