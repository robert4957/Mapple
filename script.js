const AppleSize = 55;
let score = 0;

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

let inGame = true;

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
  let [xStart, xEnd] = (selector.xStart < selector.xEnd)
  ? [selector.xStart, selector.xEnd]
  : [selector.xEnd, selector.xStart];

  let [yStart, yEnd] = (selector.yStart < selector.yEnd)
  ? [selector.yStart, selector.yEnd]
  : [selector.yEnd, selector.yStart];

  const selectedApples = appleArr.flat().filter((apple) => apple.xCollision >= xStart && apple.xCollision <= xEnd && apple.yCollision >= yStart && apple.yCollision <= yEnd);
  const sum = selectedApples.reduce((runningSum, apple) => runningSum + apple.number, 0);

  console.log(selectedApples);
  
  if (sum === 10) {
    if (remove) {
      selectedApples.forEach((apple) => {
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
  }
}

// Create fruit
const appleArr = [];
const StartPosition = [130, 138];
const AppleSeperation = 67;
for (let y = 0; y < 10; y++) {
  const row = [];
  for (let x = 0; x < 17; x++) {
    const xPos = StartPosition[0] + AppleSeperation * x;
    const yPos = StartPosition[1] + AppleSeperation * y;
    const number = Math.floor(Math.random() * 9) + 1;
    row.push(new Apple(number, xPos, yPos));
    console.log(row[x].xCollision, row[x].yCollision);
  }
  appleArr.push(row);
}

let previousTimestamp = null;
function draw(timestamp) {
  if (!previousTimestamp) {previousTimestamp = timestamp;}
  ctx.fillStyle = "white";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(document.querySelector("#background"), 0, 0);

  // Draw fruit grid
  const appleTexture = document.querySelector("#apple");
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 17; x++) {
      const apple = appleArr[y][x]
      if (apple.active) {
        ctx.drawImage(appleTexture, apple.xPos, apple.yPos);
        ctx.fillText(apple.number, apple.xPos + 27 - textWidth / 2, apple.yPos + 33); // Create good constants for this positioning later
      }
    }
  }

  // Draw score
  const scoreWidth = ctx.measureText(`${score}`).width;
  ctx.direction = "rtl";
  ctx.fillText(`${score}`, 1440 - 40 + scoreWidth, 40); // 120 for original parity
  ctx.direction = "ltr";

  // Draw selector
  if (selector.draw) {    
    let [selX, selWidth] = (selector.xStart < selector.xEnd) 
    ? [selector.xStart, selector.xEnd - selector.xStart] 
    : [selector.xEnd, selector.xStart - selector.xEnd];

    let [selY, selHeight] = (selector.yStart < selector.yEnd) 
    ? [selector.yStart, selector.yEnd - selector.yStart] 
    : [selector.yEnd, selector.yStart - selector.yEnd];
    if (selWidth === 0 && selHeight !== 0) selWidth = 1;
    if (selWidth !== 0 && selHeight === 0) selHeight = 1;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(3, 132, 252)";
    ctx.fillStyle = checkCollision() ? "rgb(255 0 0 / 40%)" : "rgb(255 180 0 / 30%)";
    ctx.strokeRect(Math.round(selX) + 0.5, Math.round(selY) + 0.5, Math.round(selWidth), Math.round(selHeight));
    ctx.fillRect(Math.round(selX) + 1, Math.round(selY) + 1, Math.round(selWidth) - 1 , Math.round(selHeight) - 1);
  }

 

  requestAnimationFrame(draw);
} 
requestAnimationFrame(draw);
console.log("good morning");
