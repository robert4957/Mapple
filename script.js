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

const ctx = document.querySelector("canvas").getContext("2d");

function draw() {
  ctx.drawImage(document.querySelector("#background"), 0, 0);
  ctx.drawImage(document.querySelector("#apple"), 135, 138);
} 
draw();
console.log("good morning");