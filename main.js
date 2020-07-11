initAssets();
initGlobals();

// Player 1
D.addEventListener('keydown', (e) => {
  if (players[0].dead) {
    return;
  }
  switch(e.code){
    case 'ArrowUp': 
      players[0].dir = 1;
      break;
    case 'ArrowRight': 
      players[0].dir = 2;
      break;
    case 'ArrowDown': 
      players[0].dir = 3;
      break;
    case 'ArrowLeft': 
      players[0].dir = 4;
      break;
    case 'Space':
      bombs.push([align(players[0].x)/40, align(players[0].y)/40, Date.now()+BOMB_TIME]);
      break;
  }});
D.addEventListener('keyup', (e) => {
  const curdir = players[0].dir;
  switch(e.code) {
    case 'ArrowUp': 
      players[0].dir = curdir == 1 ? 0 :curdir;
      break;
    case 'ArrowRight': 
      players[0].dir = curdir == 2 ? 0 :curdir;
      break;
    case 'ArrowDown': 
      players[0].dir = curdir == 3 ? 0 :curdir;
      break;
    case 'ArrowLeft': 
      players[0].dir = curdir == 4 ? 0 :curdir;
      break;
  }});

// Player 2
D.addEventListener('keydown', (e) => {
  console.log('e', e);
  const player = players[1];
  if (player.dead) {
    return;
  }
  switch(e.code){
    case 'KeyW': 
      player.dir = 1;
      break;
    case 'KeyD': 
      player.dir = 2;
      break;
    case 'KeyS': 
      player.dir = 3;
      break;
    case 'KeyA': 
      player.dir = 4;
      break;
    case 'Backquote':
      bombs.push([align(player.x)/40, align(player.y)/40, Date.now()+BOMB_TIME]);
      break;
  }});
D.addEventListener('keyup', (e) => {
  const curdir = players[1].dir;
  switch(e.code) {
    case 'KeyW': 
      players[1].dir = curdir == 1 ? 0 : curdir;
      break;
    case 'KeyD': 
      players[1].dir = curdir == 2 ? 0 :curdir;
      break;
    case 'KeyS': 
      players[1].dir = curdir == 3 ? 0 :curdir;
      break;
    case 'KeyA': 
      players[1].dir = curdir == 4 ? 0 :curdir;
      break;
  }});



const draw=()=>{
  C.fillStyle='#FFF';
  C.fillRect(0,0,600,520);
  C.fillStyle='#bbb';
  for (x = 0; x < 15; x++){
    for (y = 0; y < 13; y++) {
      if (board[y][x] === '#') {
        paintSquare(x*dim, y*dim, '#bbb');
      } else if (board[y][x] === 'x') {
        paintSquare(x*dim, y*dim, '#cfa');
      } else {
        paintSquare(x*dim, y*dim, '#0b0');

      }
    }
  }
  drawItems(bombs);
  for (const p of players) {
    if (p.dead !== true) {
      C.drawImage(p1Img, p.x, p.y);
    }
  }
};

const drawItems = (bombs)  => {
  for (const b of bombs) {
    C.drawImage(bombImg, b[0]*40, b[1]*40);
  }
  for (const f of fire) {
    C.save();
    C.globalAlpha = getFireOpacity(f[2]);
    C.drawImage(fireImg, f[0]*40, f[1]*40);
    C.restore();
  }
  for (const  c of crosses) {
    C.drawImage(crossImg, c[0]*40, c[1]*40);
  }
};

const overlapsBlock = ([x, y], blockingKeys = '#x') => {
  const minX = Math.floor(x/40);
  const maxX = Math.ceil(x/40);
  const minY = Math.floor(y/40);
  const maxY = Math.ceil(y/40);
  for(let x = minX; x <= maxX; x++) {
    for(let y = minY; y <= maxY; y++) {
      if(blockingKeys.indexOf(board[y][x]) >= 0) {
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
  if (board[newy][newx] != '#') {
    fire.push([newx, newy, Date.now() + FIRE_TIME]);
  } else {
    return;
  }
  if (board[newy][newx] == 'x') {
    board[newy][newx] = '.';
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

let lastTick = 0;
const step = (t) => {
  if (t - lastTick > 16) {
    for (let i = 0; i < players.length; i++) {
      players[i] = fixAlignment(players[i]);
      players[i] = updatePlayer(players[i]);
      players[i] = fixAlignment(players[i]);
    }
    lastTick = t;
  }
  checkItems();
  for (const p of players) {
    checkForDeath(p);
  }
  requestAnimationFrame(step);
  draw();
};

requestAnimationFrame(step);
