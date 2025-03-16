const fs = require("fs");
const path = require("path");

// Ensure the dist directory exists
if (!fs.existsSync(path.join(__dirname, "dist"))) {
  fs.mkdirSync(path.join(__dirname, "dist"));
}

// Create a .gitignore in the dist folder to ensure it gets uploaded
fs.writeFileSync(path.join(__dirname, "dist", ".gitkeep"), "");

console.log("Vercel build script completed");
