class Player {
  constructor(x, y,playerid) {
    this.x = x;
    this.y = y;
    this.maxbomb = 1;
    this.r = 2;
    this.playerid=playerid;
  }
  pos() {
    return [this.x, this.y];
  }
}
Ib=new Image();
Ib.src='img/bomb.png';
Ip1=new Image();
Ip1.src='img/p1.png';
If=new Image();
If.src='img/fire.png';
crossImg=new Image();
crossImg.src='img/cross.png';
bombPowerup=new Image();
bombPowerup.src='img/bomb_powerup.png';
rangePowerup=new Image();
rangePowerup.src='img/range_powerup.png';

lastTick = 0;
winningPlayer=undefined;
bombs = []
fire = []
crosses = []
rangePowerups = [[1,2,0],[2,1,1]]
B=[];for (y=0;y<13;y++){r=[];for(x=0;x<15;x++)r.push(!x|!y|y==12|x==14|(x%2==0&y%2==0)?'#':'x');B.push(r);}B[11][12]=B[10][13]=B[11][13]=B[1][2]=B[1][1]=B[2][1]='.'
for(i=0;i<30;i++){nx=(MR=(M=Math).random)()*15|0,ny=MR()*13|0
if (B[ny][nx] != '#')rangePowerups.push([nx,ny,i%2])}P=[new Player(40,40,1),new Player(40*13,40*11,2)]
D=document
C=D[Q='querySelector']('canvas').getContext('2d')
align=val=>Math.round(val/40)*40
const toGrid = (x, y) => {
  return [Math.floor(x/40), Math.floor(y/40)]
};
const atBoard = ([x, y]) => {
  return B[y][x];
};

const paintSquare = (x, y, color) => {
  C.fillStyle='#333';
  C.fillRect(x,y,40,40);
  C.fillStyle=color;
  C.fillRect(x+1,y+1,40-2,40-2);
};

const fixAlignment = (player) =>{
  maxFix = 13;
  if (player.dir==1 || player.dir == 3) {
    if (Math.abs(player.x%40)<=maxFix || player.x%40 >= (40-maxFix)){
      player.x+=maxFix;
      player.x-= (player.x%40);
    } else {
      player.dir = 0;
    }
  }
  if (player.dir==2 || player.dir == 4) {
    if (Math.abs(player.y%40)<=maxFix || player.y%40 >= (40-maxFix)){
      player.y+=maxFix;
      player.y-= (player.y%40);
    } else {
      player.dir = 0;
    }
  }
  player.x = Math.max(40, player.x);
  player.y = Math.max(40, player.y);
  return player;
};

const explodeBomb = ([x, y,_,r,id]) => {
  recFire(x-1, y, [1,0], 1);
  recFire(x, y, [0,1], r);
  recFire(x, y, [1,0], r);
  recFire(x, y, [0,-1], r);
  recFire(x, y, [-1,0], r);
};

const checkItems = () => {
  const now = Date.now();
  for (const b of bombs) {
    for (const f of fire) {
      if (f[0] == b[0] && f[1] == b[1]) {
        b[2] = 0;
      }
    }
    if (now >= b[2]) {
      explodeBomb(b);
      continue;
    }
  }
  bombs = bombs.filter((b) => now < b[2]);
  fire = fire.filter((f) => now < f[2]);
  for (const player of P) {
    for (let i = 0; i < rangePowerups.length; i++) {
      const p = rangePowerups[i];
      if (collides([player.x, player.y], p)) {
        rangePowerups.splice(i, 1);
        if (p[2] == 1) {
          player.r += 1;
        } else {
          player.maxbomb += 1;
        }
      }
    }
  }
};

const getFireOpacity = (timestamp) => {
  const res =  (timestamp-Date.now())/500;
  return Math.max(0, res/2+0.5);
};

addListener=(u,r,d,l,space,p)=>{
(ae=D.addEventListener)('keydown',e=>{q=P[p]
if (q.dead)return
switch(e.code){case u:q.dir=1;break
case r:q.dir=2;break
case d:q.dir=3;break
case l:q.dir=4;break
case space:curbombs=bombs.filter(b=>b[4]==p).length
if(curbombs<q.maxbomb)bombs.push([align(q.x)/40, align(q.y)/40, Date.now()+2000, q.r, p])}})
ae('keyup',e=>{c=P[p].dir
switch(e.code){case u:P[p].dir=c==1?0:c;break
case r:P[p].dir=c==2?0:c;break
case d:P[p].dir=c==3?0:c;break
case l:P[p].dir=c==4?0:c;break}})}
addListener( 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Space', 0);
addListener( 'KeyW', 'KeyD', 'KeyS', 'KeyA', 'Backquote', 1);

const draw=()=>{
  C.fillStyle='#FFF';
  C.fillRect(0,0,600,520);
  C.fillStyle='#bbb';
  for (x = 0; x < 15; x++){
    for (y = 0; y < 13; y++) {
      if (B[y][x] === '#') {
        paintSquare(x*40, y*40, '#bbb');
      } else if (B[y][x] === 'x') {
        paintSquare(x*40, y*40, '#cfa');
      } else {
        paintSquare(x*40, y*40, '#0b0');
      }
    }
  }
  drawItems(bombs);
  for (const p of P) {
    if (p.dead !== true) {
      C.drawImage(Ip1, p.x, p.y);
    }
  }
  if (winningPlayer) {
    C.fillStyle='#000';
    C.font = '48px serif';
    C.fillText(`Player ${winningPlayer} won!`, 160, 250);
  }
};

const drawItems = (bombs)  => {
  for (const b of bombs) {
    C.drawImage(Ib, b[0]*40, b[1]*40);
  }
  for (const f of fire) {
    C.save();
    C.globalAlpha = getFireOpacity(f[2]);
    C.drawImage(If, f[0]*40, f[1]*40);
    C.restore();
  }
  for (const  c of crosses) {
    C.drawImage(crossImg, c[0]*40, c[1]*40);
  }
  for (const rp of rangePowerups) {
    //if (B[rp[1]][rp[0]] == '.') {
    if (rp[2] == 1) {
      C.drawImage(rangePowerup, rp[0]*40, rp[1]*40);
    } else {
      C.drawImage(bombPowerup, rp[0]*40, rp[1]*40);
    }
    //}
  }
};

const collides = ([x,y], [x2, y2]) => {
  const minX = M.floor(x/40);
  const maxX = M.ceil(x/40);
  const minY = M.floor(y/40);
  const maxY = M.ceil(y/40);
  for(let x = minX; x <= maxX; x++) {
    for(let y = minY; y <= maxY; y++) {
      if (x == x2 && y == y2) {
        return true;
      }
    } 
  }
  return false;
}

const overlapsBlock = ([x, y], blockingKeys = '#x') => {
  const minX = (M=Math).floor(x/40);
  const maxX = M.ceil(x/40);
  const minY = M.floor(y/40);
  const maxY = M.ceil(y/40);
  for(let x = minX; x <= maxX; x++) {
    for(let y = minY; y <= maxY; y++) {
      if(blockingKeys.indexOf(B[y][x]) >= 0) {
        return true;
      }
    } 
  }
  return false;
};

const updatePlayer = (player) => {
  let tmpPos = [player.x, player.y];
  if(player.dir == 1) { tmpPos[1] -= 4; }
  if(player.dir == 2) { tmpPos[0] += 4; }
  if(player.dir == 3) { tmpPos[1] += 4; }
  if(player.dir == 4) { tmpPos[0] -= 4; }
  if (!overlapsBlock(tmpPos)) {
    player.x = tmpPos[0];
    player.y = tmpPos[1];
  }
  return player;
}

const recFire = (x, y, [xmod, ymod], stepsLeft) => {
  if (stepsLeft == 0) {
    return;
  }
  let newx = x + xmod;
  let newy = y + ymod;
  if (B[newy][newx] != '#') {
    fire.push([newx, newy, Date.now() + 500]);
  } else {
    return;
  }
  if (B[newy][newx] == 'x') {
    B[newy][newx] = '.';
    return;
  }
  recFire(newx, newy, [xmod, ymod], stepsLeft-1);
}

const checkForDeath = (player) => {
  let x = player.x;
  let y = player.y;

  const pts = [[x+5,y+5],[x+35,y+5], [x+5, y+35], [x+35, y+35]];
  for (const p of pts) {
    const grid = toGrid(p[0], p[1]);
    for (const f of fire) {
      if (grid[0] == f[0] && grid [1] == f[1]) {
        player.dead = true;
        crosses.push([grid[0], grid[1]]);
        return;
      }
    }
  }
};

const step = (t) => {
  if (!winningPlayer) {
    if (t - lastTick > 16) {
      for (let i = 0; i < P.length; i++) {
        P[i] = fixAlignment(P[i]);
        P[i] = updatePlayer(P[i]);
        P[i] = fixAlignment(P[i]);
      }
      lastTick = t;
    }
    checkItems();
    for (const p of P) {
      checkForDeath(p);
    }
  }
  if ( P.filter(p=>!p.dead).length == 1) {
    winningPlayer = P.find(p=>!p.dead).playerid;
  }
  requestAnimationFrame(step);
  draw();
};
requestAnimationFrame(step);
