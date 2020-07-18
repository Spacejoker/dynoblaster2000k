class Player{constructor(x, y,p){let t=this;t.x=x;t.y=y;t.m=1;t.r=2;t.p=p;t.l=0;t.t=0
}pos=()=>[this.x, this.y]}
s1=new Image()
s1.src='img/playersprite.png'
bgsheet=new Image()
bgsheet.src='img/13.png'
lt=0
W=undefined
bombs=[]
fire=[]
crosses=[]
powerups=[[1,2,0],[2,1,1]]
B=[];for(y=0;y<13;y++){r=[];for(x=0;x<15;x++)r.push(!x|!y|y==12|x==14|(x%2==0&y%2==0)?'#':'x');B.push(r);}B[11][12]=B[10][13]=B[11][13]=B[1][2]=B[1][1]=B[2][1]='.'
for(i=0;i<45;i++){nx=(MR=(M=Math).random)()*15|0,ny=MR()*13|0
if(B[ny][nx]!='#'){i%4>2?powerups.push([nx,ny,i%2]):(B[ny][nx]='.')}
}
P=[new Player(40,40,1),new Player(40*13,40*11,2)]
D=document
C=D[Q='querySelector']('canvas').getContext('2d')
align=val=>M.round(val/40)*40
FA=(p)=>{
m=13
if(p.dir&&p.dir%2)
if(M.abs(p.x%40)<=m|p.x%40>=(40-m)){p.x+=m
p.x-=(p.x%40)
}else p.dir=0
if(p.dir==2||p.dir==4)
if(M.abs(p.y%40)<=m|p.y%40>=(40-m)){p.y+=m
p.y-=(p.y%40)
}else p.dir=0
p.x=M.max(40,p.x)
p.y=M.max(40,p.y)}
explodeBomb=([x,y,_,r])=>recFire(x-1, y, [1,0], 1)*[[0,1],[1,0],[0,-1],[-1,0]].forEach(e=>recFire(x,y,e,r))
addListener=(u,r,d,l,space,p)=>{
(ae=D.addEventListener)('keydown',e=>{q=P[p]
if(q.dead)return
switch(e.code){case u:q.dir=1;break
case r:q.dir=2;break
case d:q.dir=3;break
case l:q.dir=4;break
case space:curbombs=bombs.filter(b=>b[4]==p).length
if(curbombs<q.m)bombs.push([align(q.x)/40,align(q.y)/40,Date.now()+2000,q.r,p,true])}})
ae('keyup',e=>{c=P[p].dir
switch(e.code){case u:P[p].dir=c==1?0:c;break
case r:P[p].dir=c==2?0:c;break
case d:P[p].dir=c==3?0:c;break
case l:P[p].dir=c==4?0:c;break}})}
addListener('ArrowUp','ArrowRight','ArrowDown','ArrowLeft','Space',0)
addListener('KeyW','KeyD','KeyS','KeyA','Backquote',1)
PT=(s,x,y,t,f=0,m=0)=>{[u,v]={'b':[544,17],'r':[561,17],'g':[254,17],'w':[663,0],'f':{0:[408,0],1:[425,0],2:[442,0],3:[459,0]}[f],'B':{0:[612,0],1:[629,0],2:[646,0]}[f]}[t]||[493,0];
C.drawImage(s,u,v,16,16,x+m,y+m,40-m-m,40-m-m)}
DR=()=>{
for(x=0;x<15;x++)for(y=0;y<13;y++)if(B[y][x]==='#')PT(bgsheet,x*40,y*40,'w',0,0)
else if(B[y][x]==='x')PT(bgsheet,x*40,y*40,0,0,0)
else PT(bgsheet,x*40,y*40,'g')
drawItems(bombs);
for (const p of P) {
if (p.dead !== true) {
d=p.dir
f={0:-1,1:9,2:3,3:0,4:6}[d]
r=p.l;
if(f>=0){
if(p.l!=f)p.t=Date.now()
p.l=f
r=p.l+{0:0,1:1,2:0,3:2}[(((Date.now()-p.t)/200)%4)|0]}
C.drawImage(s1,(p.p-1)*24,r*24,24,24,p.x,p.y,40,40)}}
if(W){C.fillStyle='#fff'
C.font='64pxserif'
C.fillText(`Player${W}won!`,120,250)
C.strokeText(`Player${W}won!`,120,250)}}

const drawItems = (bombs)  => {
for (const b of bombs) {
PT(bgsheet, b[0]*40, b[1]*40, 'B', ((Date.now()/150)%3)|0, 1);
}
for (const f of fire) {
PT(bgsheet, f[0]*40, f[1]*40, 'f', (((500-(f[2]-Date.now()))/130)%4)|0, 0);
}
for (const  c of crosses) {
timePassed = Date.now() - c[2];
frame = (timePassed/300)|0
frame+=12
if (frame < 20) {
C.drawImage(s1, (c[3]-1)*24, frame*24, 24, 24, c[0]*40, c[1]*40, 40, 40);
}
break;
}
for (const rp of powerups) {
if (B[rp[1]][rp[0]] == '.') {
if (rp[2] == 1) {
PT(bgsheet, rp[0]*40, rp[1]*40, 'r', 0, 1);
} else {
PT(bgsheet, rp[0]*40, rp[1]*40, 'b',0,1);
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
if (!overlapsBlock(tmpPos,player.p)) {
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
if ((x1=M.floor(p[0]/40))== f[0] && (x2=M.floor(p[1]/40))== f[1]) {
player.dead = true;
crosses.push([x1, x2,Date.now(), player.p]);
return;
}
}
}
};

const step = (t) => {
if(!W&&t-lt>16)for (i=0;i<P.length;updatePlayer(P[i]),FA(P[i]),i++)lt=t
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
for(p of P)checkForDeath(p)
if(P.filter(p=>!p.dead).length==1)W=P.find(p=>!p.dead).p
RA(step)
DR()};
(RA=requestAnimationFrame)(step);

