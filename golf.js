class Player{constructor(x, y,playerid){this.x=x
  this.y=y
  this.m=1
  this.r=2
  this.playerid=playerid
  this.lastframe=0
  this.timer=0;
}pos=()=>[this.x, this.y]}
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
spritesheet = new Image();
spritesheet.src='img/playersprite.png';
bgsheet = new Image();
bgsheet.src='img/13.png';

lastTick = 0;
winningPlayer=undefined;
bombs = []
fire = []
crosses = []
powerups = []
B=[];for (y=0;y<13;y++){r=[];for(x=0;x<15;x++)r.push(!x|!y|y==12|x==14|(x%2==0&y%2==0)?'#':'x');B.push(r);}B[11][12]=B[10][13]=B[11][13]=B[1][2]=B[1][1]=B[2][1]='.'
for(i=0;i<45;i++){nx=(MR=(M=Math).random)()*15|0,ny=MR()*13|0
  if (B[ny][nx] != '#'){
    if (i%4>2) {
      powerups.push([nx,ny,i%2])
    }else {
      B[ny][nx]='.';
    }
  }
}
P=[new Player(40,40,1),new Player(40*13,40*11,2)]
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
    for (let i = 0; i < powerups.length; i++) {
      const p = powerups[i];
      if (collides(player, p)) {
        powerups.splice(i, 1);
        if (p[2] == 1) {
          player.r += 1;
        } else {
          player.m += 1;
        }
      }
    }
  }
  for (const b of bombs) {
    free = true;
    for (const p of P) {
      if (collides(p, b)) {
        free = false;
      }
    }
    if(free)b[5] = false;
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
        if(curbombs<q.m)bombs.push([align(q.x)/40, align(q.y)/40, Date.now()+2000, q.r, p, true])}})
  ae('keyup',e=>{c=P[p].dir
    switch(e.code){case u:P[p].dir=c==1?0:c;break
      case r:P[p].dir=c==2?0:c;break
      case d:P[p].dir=c==3?0:c;break
      case l:P[p].dir=c==4?0:c;break}})}
addListener( 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Space', 0);
addListener( 'KeyW', 'KeyD', 'KeyS', 'KeyA', 'Backquote', 1);

paintTile= (sheet, x, y, tile, frame=0, mod=0) => {
  let sx = 493;
  let sy = 0;
  if (tile == 'bombpower') {
    sx = 544;
    sy = 17;
  }
  if (tile == 'rangepower') {
    sx = 561;
    sy = 17;
  }
  if (tile == 'bomb') {
    sx = 612
    if (frame == 1) {
      sx = 629
    }
    if (frame == 2) {
      sx = 646
    }
  }
  if (tile == 'grass') {
    sx=254
    sy=17
  }

  if (tile == 'wall') {
    sx=663
  }
  if (tile=='fire') {
    sx={0:408,1:425,2:442,3:459}[frame];
    sy=0
  }
  C.drawImage(sheet, sx, sy, 16, 16, x+mod, y+mod, 40-2*mod, 40-2*mod);
}

const Dr=()=>{
  C.fillStyle='#009100';
  C.fillRect(0,0,600,520);
  C.fillStyle='#bbb';
  for (x = 0; x < 15; x++){
    for (y = 0; y < 13; y++) {
      if (B[y][x] === '#') {
        paintTile(bgsheet, x*40, y*40, 'wall',0,0);
      } else if (B[y][x] === 'x') {
        paintTile(bgsheet, x*40, y*40, 'stone',0,0);
      } else {
        paintTile(bgsheet, x*40, y*40, 'grass');
      }
    }
  }

  getSprite=(p) => {
    const d = p.dir;
    frame={ 0:-1, 1:9, 2:3, 3:0, 4:6, }[d];

    let renderFrame = p.lastframe;
    if (frame >= 0) {
      if (p.lastframe != frame) {
        p.timer = Date.now();
      }
      p.lastframe = frame;
      renderFrame = p.lastframe + {0:0,1:1,2:0,3:2}[(((Date.now() - p.timer)/200)%4)|0]
    } 
    return [p.playerid-1,renderFrame]
  };

  drawItems(bombs);
  for (const p of P) {
    if (p.dead !== true) {
      [sx, sy] = getSprite(p);
      C.drawImage(spritesheet, sx*24, sy*24, 24, 24, p.x, p.y, 40, 40);
    }
  }
  if (winningPlayer) {
    C.fillStyle='#fff';
    C.font = '64px serif';
    C.fillText(`Player ${winningPlayer} won!`, 120, 250);
    C.strokeText(`Player ${winningPlayer} won!`, 120, 250);
  }
};

const drawItems = (bombs)  => {
  for (const b of bombs) {
    paintTile(bgsheet, b[0]*40, b[1]*40, 'bomb', ((Date.now()/150)%3)|0, 1);
  }
  for (const f of fire) {
    paintTile(bgsheet, f[0]*40, f[1]*40, 'fire', (((500-(f[2]-Date.now()))/130)%4)|0, 0);
  }
  for (const  c of crosses) {
    timePassed = Date.now() - c[2];
    frame = (timePassed/300)|0
    frame+=12
    if (frame < 20) {
      C.drawImage(spritesheet, (c[3]-1)*24, frame*24, 24, 24, c[0]*40, c[1]*40, 40, 40);
    }
    break;
  }
  for (const rp of powerups) {
    if (B[rp[1]][rp[0]] == '.') {
      if (rp[2] == 1) {
        paintTile(bgsheet, rp[0]*40, rp[1]*40, 'rangepower', 0, 1);
      } else {
        paintTile(bgsheet, rp[0]*40, rp[1]*40, 'bombpower',0,1);
      }
    }
  }
};

const collides = (player, [x2, y2]) => {
  const minX = M.floor((x=player.x)/40);
  const maxX = M.ceil(x/40);
  const minY = M.floor((y=player.y)/40);
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

const overlapsBlock = ([x, y], p) => {
  blockingKeys = '#x'
  const minX = (M=Math).floor(x/40);
  const maxX = M.ceil(x/40);
  const minY = M.floor(y/40);
  const maxY = M.ceil(y/40);
  for(let x = minX; x <= maxX; x++) {
    for(let y = minY; y <= maxY; y++) {
      if(blockingKeys.indexOf(B[y][x]) >= 0) {
        return true;
      }
      for (const b of bombs) {
        if (b[0] == x && b[1] == y && !b[5]) {
          return true;
        }
      }
    } 
  }
  return false;
};

const updatePlayer = (player) => {
  let tmpPos = [player.x, player.y];
  if(player.dir == 1) { tmpPos[1] -= 2; }
  if(player.dir == 2) { tmpPos[0] += 2; }
  if(player.dir == 3) { tmpPos[1] += 2; }
  if(player.dir == 4) { tmpPos[0] -= 2; }
  if (!overlapsBlock(tmpPos,player.playerid)) {
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
  pts = [[(x=player.x)+5,(y=player.y)+5],[x+35,y+5], [x+5, y+35], [x+35, y+35]];
  for (const p of pts) {
    for (const f of fire) {
      if ((grid = toGrid(p[0], p[1]))[0] == f[0] && grid [1] == f[1]) {
        player.dead = true;
        crosses.push([grid[0], grid[1], Date.now(), player.playerid]);
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
  }
  checkItems();
  for (const p of P) {
    checkForDeath(p);
  }
  if ( P.filter(p=>!p.dead).length == 1) {
    winningPlayer = P.find(p=>!p.dead).playerid;
  }
  RA(step)
  Dr()};
(RA=requestAnimationFrame)(step);
