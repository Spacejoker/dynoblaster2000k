/**
 * Library
 */
const newBoard = () => {
  let board = [];
  for (let y = 0; y < 13; y++) {
    row = [];
    for (let x = 0; x < 15; x++) {
      if (x == 0 || y == 0 || y == 12 || x == 14 || (x%2 == 0 && y % 2 ==0)) {
        row.push('#');
      } else {
        row.push('x');
      }
    }
    board.push(row);
  }
  board[1][1] = '.';
  board[2][1] = '.';
  board[1][2] = '.';
  board[11][13] = '.';
  board[10][13] = '.';
  board[11][12] = '.';
  return board;
};


const initAssets = () => {
  bombImg = new Image();
  bombImg.src = 'img/bomb.png';
  p1Img = new Image();
  p1Img.src = 'img/p1.png';
  fireImg = new Image();
  fireImg.src = 'img/fire.png';
  crossImg = new Image();
  crossImg.src = 'img/cross.png';
};

const initGlobals = () => {
  bombs = []
  fire = []
  crosses = []
  board = newBoard();
  players = [new Player(40, 40), new Player(40*13,40*11)]
  p2 = [40*13,40*11]
  p2dir = 0;
  D=document;
  C=D[Q='querySelector']('canvas').getContext('2d');
  dim = 40;
  BOMB_TIME = 2000;
  FIRE_TIME = 1000;
};

const align = (val) => {
  return Math.round(val/40)*40;
};
const toGrid = (x, y) => {
  return [Math.floor(x/40), Math.floor(y/40)]
};
const atBoard = ([x, y]) => {
  return board[y][x];
};

const paintSquare = (x, y, color) => {
  C.fillStyle='#333';
  C.fillRect(x,y,dim,dim);
  C.fillStyle=color;
  C.fillRect(x+1,y+1,dim-2,dim-2);
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

const explodeBomb = ([x, y,_]) => {
  let fireReach = 2;
  recFire(x-1, y, [1,0], 1);
  recFire(x, y, [0,1], fireReach);
  recFire(x, y, [1,0], fireReach);
  recFire(x, y, [0,-1], fireReach);
  recFire(x, y, [-1,0], fireReach);
};

const checkItems = () => {
  const now = Date.now();
  for (const b of bombs) {
    if (now >= b[2]) {
      explodeBomb(b);
    }
  }
  bombs = bombs.filter((b) => now < b[2]);
  fire = fire.filter((f) => now < f[2]);

};

const getFireOpacity = (timestamp) => {
  const res =  (timestamp-Date.now())/FIRE_TIME;
  return Math.max(0, res/2+0.5);
};
