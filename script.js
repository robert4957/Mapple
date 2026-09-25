// Wait for images to load
async function loadImages() {
  await Promise.all(
    Array.from(document.images).map((image) => {
      if (image.complete) return Promise.resolve(); 
      return new Promise((resolve) => image.addEventListener("load", resolve));
    }),
  );
}

await loadImages();
const canvas = document.querySelector("canvas")
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
  if (!previousTimestamp) previousTimestamp = timestamp
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(document.querySelector("#background"), 0, 0);
  const StartPosition = [130, 138];
  const appleTexture = document.querySelector("#apple");
  const AppleSize = 67;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 17; x++) {
      const xPos = StartPosition[0] + AppleSize * x;
      const yPos = StartPosition[1] + AppleSize * y;
      ctx.drawImage(appleTexture, xPos, yPos);
      ctx.fillText(appleArr[y][x], xPos + 27 - textWidth / 2, yPos + 33); // Create good constants for this positioning later
    }
  }
  requestAnimationFrame(draw);
} 
requestAnimationFrame(draw);
console.log("good morning");
