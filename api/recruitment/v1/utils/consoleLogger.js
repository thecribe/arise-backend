import fs from "fs";
import path from "path";
import util from "util";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const stream = fs.createWriteStream(path.join(logDir, "console.log"), {
  flags: "a",
});

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  originalLog(...args);
  stream.write(`[${new Date().toISOString()}] LOG: ${util.format(...args)}\n`);
};

console.error = (...args) => {
  originalError(...args);
  stream.write(
    `[${new Date().toISOString()}] ERROR: ${util.format(...args)}\n`,
  );
};

console.warn = (...args) => {
  originalWarn(...args);
  stream.write(`[${new Date().toISOString()}] WARN: ${util.format(...args)}\n`);
};
