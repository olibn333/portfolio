var SCREEN_WIDTH = document.body.clientWidth;
var SCREEN_HEIGHT = document.body.clientHeight;
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight; //document.height is obsolete

var nodes; // node
var NUM_NODES = 35; // nodeの数
var MIN_DIST = 100; // node同士が繋がる閾値
var SPRING_AMOUNT = 0.001; // 弾く量

nodes_init();

function nodes_init() {
  nodes = createNodes();
  context.lineWidth = 1.5;
  for (i=0; i<NUM_NODES; i++) {
    nodes[i].draw();
  }
  setInterval(nodes_loop, 1000/30); // アニメーション開始
}

function createNodes() {
  var nodes = [];
  for (var i=0; i<NUM_NODES; i++) {
    var node = {
      radius: 3,
      x: Math.round(Math.random()*SCREEN_WIDTH),
      y: Math.round(Math.random()*SCREEN_HEIGHT),
      vx: Math.random()*6-3, // -3 から 3 までのランダムな数値
      vy: Math.random()*6-3,
      update: function() {
        this.x += this.vx;
        this.y += this.vy;
        // 画面の端に到達したら反対側へ
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
  context.clearRect(0, 0, canvas.width, canvas.height);
  // 移動させる
  for (i=0; i<NUM_NODES; i++) {
    nodes[i].update();
    nodes[i].draw();

    // 同じnode同士にならないように1つずらして総当たり
    var node1 = nodes[i];
    for (var j=i+1; j<NUM_NODES; j++) {
      var node2 = nodes[j];

      // node同士の距離を求める
      var dx = node1.x - node2.x;
      var dy = node1.y - node2.y;
      var dist = Math.sqrt(dx*dx + dy*dy);

      // 2つのnodeの距離が閾値を下回ったらつなげる
      if (dist<MIN_DIST) {
        // 2つの間に線を引く
        context.beginPath();
        // 距離が近いほど透明度を下げる
        context.strokeStyle = 'rgba(255,255,255,'+(1-dist/MIN_DIST)+')';
        context.moveTo(node1.x, node1.y);
        context.lineTo(node2.x, node2.y);
        context.stroke();
        context.closePath();

        // お互いに逃げる
        var ax = dx*SPRING_AMOUNT;
        var ay = dy*SPRING_AMOUNT;
        node1.vx += ax;
        node1.vy += ay;
        node2.vx -= ax;
        node2.vy -= ay;
      }
    }
  }
}