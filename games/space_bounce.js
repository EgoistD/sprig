/*
@title: space_bounce
@Created by: Vineet Papnai
@ig: architectofbrain
@tags: ['retro', 'space']
@addedOn: 2024-11-01

Controls--

Use W/S for left paddle
Use I/K for right paddle

Rules--

Keep the meteor from reaching the left or right edge!
Avoid space debris!

*/

const leftPaddle = "l";
const rightPaddle = "r";
const meteor = "m";
const wall = "w";
const debris = "d";

let leftScore = 0;
let rightScore = 0;

const intervalTime = 80;
let meteorDx = 1;
let meteorDy = 1;

setLegend(
  [ leftPaddle, bitmap`
3000003...............
0333330...............
3000003...............
0333330...............
3000003...............
0333330...............
3000003...............
0333330...............
3000003...............
0333330...............
3000003...............
0333330...............
3000003...............
0333330...............
3000003...............
0333330...............` ],
  [ rightPaddle, bitmap`
5000005...............
0555550...............
5000005...............
0555550...............
5000005...............
0555550...............
5000005...............
0555550...............
5000005...............
0555550...............
5000005...............
0555550...............
5000005...............
0555550...............
5000005...............
0555550...............` ],
  [ meteor, bitmap`
................
.....555555.....
....55555555....
...5555555555...
...5555555555...
..555555555555..
..555555555555..
.555555555555...
.555555555555...
..555555555555..
...55555555555..
...555555555....
....55555555....
......5555......
................
................` ],
  [ wall, bitmap`
1111111111111111
1111111111111111` ],
  [ debris, bitmap`
................
....33333333....
....33333333....
................
....33333333....
....33333333....
................
................` ]
);

setSolids([leftPaddle, rightPaddle, wall, debris]);

const level = map`
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
........................................
.....................d..................
........................................
.......d.........d......................
........................................
........................................
........................................
...........................d............
........................................
................d.......................
........................................
........................................
........................................
........................................
.......................d................
........................................
........................................
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`;

setMap(level);

addSprite(2, Math.round(height() / 2), leftPaddle);
addSprite(width() - 3, Math.round(height() / 2), rightPaddle);
addSprite(Math.round(width() / 2), Math.round(height() / 2), meteor);

// Controls
onInput("w", () => {
    getAll(leftPaddle).forEach(p => p.y = Math.max(1, p.y - 1));
});

onInput("s", () => {
    getAll(leftPaddle).forEach(p => p.y = Math.min(height() - 2, p.y + 1));
});

onInput("i", () => {
    getAll(rightPaddle).forEach(p => p.y = Math.max(1, p.y - 1));
});

onInput("k", () => {
    getAll(rightPaddle).forEach(p => p.y = Math.min(height() - 2, p.y + 1));
});

function restartMeteor() {
  const meteorSprite = getFirst(meteor);
  meteorSprite.x = Math.round(width() / 2);
  meteorSprite.y = Math.round(height() / 2);
}

function updateMeteorPositionAndScore() {
  
  const meteorSprite = getFirst(meteor);
  meteorSprite.x += meteorDx;
  meteorSprite.y += meteorDy;

  // Bounce off walls
  if (meteorSprite.y <= 1 || meteorSprite.y >= height() - 2) {
    meteorDy *= -1;
  }

  // Bounce off paddles
  const leftPaddleSprites = getAll(leftPaddle);
  const rightPaddleSprites = getAll(rightPaddle);
  if (leftPaddleSprites.some(p => p.x === meteorSprite.x - 1 && p.y === meteorSprite.y) && meteorDx < 0) {
    meteorDx *= -1;
  } else if (rightPaddleSprites.some(p => p.x === meteorSprite.x + 1 && p.y === meteorSprite.y) && meteorDx > 0) {
    meteorDx *= -1;
  }

  // Bounce off debris
  getAll(debris).forEach(debrisPiece => {
    if (debrisPiece.x === meteorSprite.x && debrisPiece.y === meteorSprite.y) {
      meteorDx *= -1;
      meteorDy *= -1;
    }
  });

  // Update score
  if (meteorSprite.x < 1) {
    rightScore++;
    restartMeteor();
  } else if (meteorSprite.x > width() - 2) {
    leftScore++;
    restartMeteor();
  }
}

setInterval(updateMeteorPositionAndScore, intervalTime);