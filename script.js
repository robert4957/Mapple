const AppleSize = 55;
const CanvasWidth = 1440;
const CanvasHeight = 940;
const filter = 780;
let boardSum = null;
let score = 0;
let gameMode = "filtered";

// Wait for images to load
async function loadImages() {
  await Promise.all(
    Array.from(document.images).map((image) => {
      if (image.complete) {return Promise.resolve();}
      return new Promise((resolve) => image.addEventListener("load", resolve));
    }),
  );
}

await loadImages();
const canvas = document.querySelector("canvas")

let selector = {
  xStart: null,
  yStart: null,
  xEnd: null,
  yEnd: null,
  draw: false,
};

let inGame = false;

function updateSelector(e) {
  // Scaleing because css makes canvas half size
  const scaleX = canvas.width / canvas.clientWidth;
  const scaleY = canvas.height / canvas.clientHeight;
  if (!selector.draw) {
    selector.xStart = e.offsetX * scaleX;
    selector.yStart = e.offsetY * scaleY;
    selector.draw = true;
  }
  selector.xEnd = e.offsetX * scaleX;
  selector.yEnd = e.offsetY * scaleY;
}

function checkCollision(remove) {
  const timePassed = currentTime - startTime;
  if (timePassed >= 120000) {
    false;
  }
  let [xStart, xEnd] = (selector.xStart < selector.xEnd)
  ? [selector.xStart, selector.xEnd]
  : [selector.xEnd, selector.xStart];

  let [yStart, yEnd] = (selector.yStart < selector.yEnd)
  ? [selector.yStart, selector.yEnd]
  : [selector.yEnd, selector.yStart];

  const selectedApples = appleArr.flat().filter((apple) => apple.active && apple.xCollision >= xStart && apple.xCollision <= xEnd && apple.yCollision >= yStart && apple.yCollision <= yEnd);
  const sum = selectedApples.reduce((runningSum, apple) => runningSum + apple.number, 0);

  
  if (sum === 10) {
    if (remove) {
      let previous = null;
      selectedApples.forEach((apple) => {
        if (previous) {
          apple.xVel = Math.sign(apple.xVel) === Math.sign(previous.xVel) ? -apple.xVel : apple.xVel;
        }
        previous = apple;
        apple.active = false;
        score++;
      });
    }
    return true;
  }
  return false
}

function removeSelector() {
  // Check if fruit selection sums to 10
  checkCollision(true);
  selector.draw = false;
  canvas.removeEventListener("mousemove", updateSelector);
  canvas.removeEventListener("mouseup", removeSelector);
}

canvas.addEventListener("mousedown", () => {
  if (inGame) {
    canvas.addEventListener("mousemove", updateSelector);
    canvas.addEventListener("mouseup", removeSelector);
  }
});

function changeGameState(e) {
  // Scaleing because css makes canvas half size
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;
    ctx.font = "bold 64px \"Times New Roman\""
    const playWidth = ctx.measureText("Play").width;
    const xPlayButton = CanvasWidth / 2 - playWidth / 2 - 20;
    const yPlayButton  = CanvasHeight / 2 - 64 / 2 - 10;
    const xPlayButtonEnd = xPlayButton + playWidth + 40;
    const yPlaybuttonEnd = yPlayButton + 64 + 20;
    const offsetX = e.offsetX * scaleX;
    const offsetY = e.offsetY * scaleY
    ctx.font = "bold 36px \"Times New Roman\"";
  if (!inGame) {
    if (offsetX >= xPlayButton && offsetX <= xPlayButtonEnd && offsetY >= yPlayButton && offsetY <= yPlaybuttonEnd) {
      createAppleArray();
      inGame = true;
      startTime = Date.now();
      score = 0;
    }
  } else {
    // 110, CanvasHeight - 55, 95, 40
    if (offsetX >= 110 && offsetX <= 110 + 95 && offsetY >= CanvasHeight - 55 && offsetY <= CanvasHeight - 55 + 40) {
      inGame = false;
    }
  }
}

canvas.addEventListener("click", changeGameState);

const ctx = canvas.getContext("2d");
ctx.font = "bold 36px \"Times New Roman\""
ctx.textBaseline = "middle";
const measurement = ctx.measureText("9");
const textWidth = measurement.width;

class Apple {
  constructor(number, xPos, yPos) {
    this.active = true;
    this.draw = true;
    this.number = number;
    this.xPos = xPos;
    this.yPos = yPos;
    this.xCollision = xPos + AppleSize / 2;
    this.yCollision = yPos + AppleSize / 2;
    this.xVel = Math.floor(Math.random() * 3001) - 1500;
    this.yVel = -Math.floor(Math.random() * 1001) - 500;
    this.spin = this.xVel / 100;
    this.angle = 0;
  }
}

// Create fruit
const appleArr = [];
const StartPosition = [130, 138];
const AppleSeperation = 67;

function createAppleArray() {
  console.log(gameMode);
  while (true) {
    appleArr.length = 0;
    let sum = 0;
    for (let y = 0; y < 10; y++) {
      const row = [];
      for (let x = 0; x < 17; x++) {
        const xPos = StartPosition[0] + AppleSeperation * x;
        const yPos = StartPosition[1] + AppleSeperation * y;
        let number = Math.floor(Math.random() * 9) + 1;
        if (y === 9 && x === 16) { // Last apple
          number = 10 - sum % 10;
          // console.log(sum);
        }
        row.push(new Apple(number, xPos, yPos));
        sum += number;
      }
      appleArr.push(row);
    }
    if (appleArr[9][16].number !== 10) {
      if (gameMode === "classic") {
        console.log(sum);
        boardSum = sum;
        break;
      } else if (gameMode === "filtered" && sum <= filter) {
        console.log(sum);
        boardSum = sum;
        break;
      }
    }
  }
}


let startTime = Date.now();
let currentTime = Date.now();
let previousTimestamp = null;
function draw(timestamp) {
  if (!previousTimestamp) {previousTimestamp = timestamp;}
  let dt = (timestamp - previousTimestamp) / 1000;
  previousTimestamp = timestamp;
  ctx.fillStyle = "white";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(document.querySelector("#background"), 0, 0);

  if (!inGame) {
    ctx.fillStyle = "rgb(0 204 102)";
    ctx.font = "bold 64px \"Times New Roman\""
    const playWidth = ctx.measureText("Play").width;
    // PLAY BUTTON
    const xPlayButton = CanvasWidth / 2 - playWidth / 2 - 20;
    const yPlayButton  = CanvasHeight / 2 - 64 / 2 - 10;
    ctx.fillRect(xPlayButton, yPlayButton, playWidth + 40, 64 + 20);
    ctx.fillStyle = "white";
    ctx.fillText("Play", CanvasWidth / 2 - playWidth / 2, CanvasHeight / 2);
    ctx.font = "bold 36px \"Times New Roman\""

    // Draw reset button
    ctx.strokeStyle = "white";
    ctx.strokeRect(110, CanvasHeight - 55, 95, 40);
    ctx.fillStyle = "white";
    ctx.font = "bold 30px \"Times New Roman\""
    ctx.fillText("Reset", 122, CanvasHeight - 55 + 22,)
    ctx.font = "bold 36px \"Times New Roman\""

    requestAnimationFrame(draw);
    return;
  }

  // Draw fruit grid
  const appleTexture = document.querySelector("#apple");
  const inactiveFruit = [];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 17; x++) {
      const apple = appleArr[y][x]
      if (apple.active) {
        ctx.drawImage(appleTexture, apple.xPos, apple.yPos);
        ctx.fillText(apple.number, apple.xPos + 27 - textWidth / 2, apple.yPos + 33); // Create good constants for this positioning later
      } else if (apple.draw) {
        inactiveFruit.push(apple);
        apple.yVel += 6000 * dt;
        apple.yPos += apple.yVel * dt;
        apple.xPos += apple.xVel * dt;
      }
    }
  }
  // Draw already selected fruit after so appears on top
  for (let apple of inactiveFruit) {
    if (apple.yPos <= CanvasHeight) {
      ctx.save();
      ctx.translate(apple.xPos + AppleSize / 2, apple.yPos + AppleSize / 2);
      apple.angle += apple.spin * dt;
      console.log(apple.angle)
      ctx.rotate(apple.angle);
      ctx.drawImage(appleTexture, -AppleSize / 2, -AppleSize / 2);
      ctx.fillText(apple.number, -AppleSize / 2 + 27 - textWidth / 2, -AppleSize / 2 + 33);
      ctx.restore();
    } else {
      apple.draw = false;
    }
  }

  currentTime = Date.now();

  // Draw score
  const scoreWidth = ctx.measureText(`${score}`).width;
  ctx.fillStyle = "rgb(9 204 9)";
  ctx.lineWidth = 2;
  if (currentTime - startTime < 120000) {
    ctx.fillText(`${score}`, CanvasWidth - 110 - scoreWidth / 2, 110); // 120 for original parity
  }
  ctx.direction = "ltr";

  // Draw timer
  // 18 x 600
  const timePassed = currentTime - startTime;
  ctx.strokeStyle = "rgb(9 204 9";
  if (timePassed < 120000) {
    ctx.strokeRect(CanvasWidth - 120, 180, 18, 600);
    ctx.fillRect(CanvasWidth - 119, 181 + (598 / 120000) * timePassed, 16, 598 - (598 / 120000) * timePassed);
  } else {
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${score} - Board: ${boardSum}`, 122, 40);
  }

  // Draw reset button
  ctx.strokeStyle = "white";
  ctx.strokeRect(110, CanvasHeight - 55, 95, 40);
  ctx.fillStyle = "white";
  ctx.font = "bold 30px \"Times New Roman\""
  ctx.fillText("Reset", 122, CanvasHeight - 55 + 22,)
  ctx.font = "bold 36px \"Times New Roman\""

  

  // Draw selector
  if (selector.draw && currentTime - startTime <= 120000) {    
    let [selX, selWidth] = (selector.xStart < selector.xEnd) 
    ? [selector.xStart, selector.xEnd - selector.xStart] 
    : [selector.xEnd, selector.xStart - selector.xEnd];

    let [selY, selHeight] = (selector.yStart < selector.yEnd) 
    ? [selector.yStart, selector.yEnd - selector.yStart] 
    : [selector.yEnd, selector.yStart - selector.yEnd];
    if (selWidth === 0 && selHeight !== 0) selWidth = 1;
    if (selWidth !== 0 && selHeight === 0) selHeight = 1;
    ctx.strokeStyle = "rgb(3, 132, 252)";
    ctx.fillStyle = checkCollision() ? "rgb(255 0 0 / 40%)" : "rgb(255 180 0 / 30%)";
    ctx.strokeRect(Math.round(selX) + 0.5, Math.round(selY) + 0.5, Math.round(selWidth), Math.round(selHeight));
    ctx.fillRect(Math.round(selX) + 1, Math.round(selY) + 1, Math.round(selWidth) - 1 , Math.round(selHeight) - 1);
  }

 

  requestAnimationFrame(draw);
} 

requestAnimationFrame(draw);


// Change game mode
const button = document.querySelector("#switch");
const filtered = document.querySelector("#filtered");
const classic = document.querySelector("#classic");
filtered.classList.add("selected");

function switchMode() {
  if (gameMode === "filtered") {
    filtered.classList.remove("selected");
    classic.classList.add("selected");
    gameMode = "classic";
  } else {
    classic.classList.remove("selected");
    filtered.classList.add("selected");
    gameMode = "filtered";
  }
  console.log(`Mode switched to ${gameMode}`);
}

button.addEventListener("click", switchMode);
console.log(`Current mode is ${gameMode}`);