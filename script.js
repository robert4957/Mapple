const AppleSize = 55;

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
  if (!selector.draw) {
    // Scale by 2 because css makes canvas half size
    selector.xStart = e.offsetX * 2;
    selector.yStart = e.offsetY * 2;
    selector.draw = true;
  }
  selector.xEnd = e.offsetX * 2;
  selector.yEnd = e.offsetY * 2;
}

function removeSelector() {
  // Check if fruit selection sums to 10
  // to implement
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
ctx.fillStyle = "white";
const measurement = ctx.measureText("9");
const textWidth = measurement.width;
let previousTimestamp = null;
const appleArr = [];
for (let y = 0; y < 10; y++) {
  const row = [];
  for (let x = 0; x < 17; x++) {
    row.push(Math.floor(Math.random() * 9) + 1);
  }
  appleArr.push(row);
}

function draw(timestamp) {
  if (!previousTimestamp) {previousTimestamp = timestamp;}
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(document.querySelector("#background"), 0, 0);

  // Draw fruit grid
  const StartPosition = [130, 138];
  const appleTexture = document.querySelector("#apple");
  const AppleSeperation = 67;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 17; x++) {
      const xPos = StartPosition[0] + AppleSeperation * x;
      const yPos = StartPosition[1] + AppleSeperation * y;
      ctx.drawImage(appleTexture, xPos, yPos);
      ctx.fillText(appleArr[y][x], xPos + 27 - textWidth / 2, yPos + 33); // Create good constants for this positioning later
    }
  }

  // Draw selector
  if (selector.draw) {    
    let [selX, selWidth] = (selector.xStart < selector.xEnd) 
    ? [selector.xStart, selector.xEnd - selector.xStart] 
    : [selector.xEnd, selector.xStart - selector.xEnd];

    let [selY, selHeight] = (selector.yStart < selector.yEnd) 
    ? [selector.yStart, selector.yEnd - selector.yStart] 
    : [selector.yEnd, selector.yStart - selector.yEnd];
    ctx.fillRect(selX, selY, selWidth, selHeight);
  }

  requestAnimationFrame(draw);
} 
requestAnimationFrame(draw);
console.log("good morning");
