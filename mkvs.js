const fs = require("fs");
const path = require("path");

const ENV_FILE_PATH = path.join(__dirname, ".env");

const command = process.argv[2];
const key = process.argv[3];
const value = process.argv[4];

function createEnvFile() {
  if (!fs.existsSync(ENV_FILE_PATH)) {
    fs.writeFileSync(ENV_FILE_PATH, "");
  }
}

function addKeyValue(key, value) {
  if (!key || !value) {
    console.log("Please provide both key and value.");
    return;
  }

  let envData = fs.readFileSync(ENV_FILE_PATH, "utf8");
  const lines = envData.split("\n");
  for (let line of lines) {
    const [k, v] = line.split("=");
    if (k === key) {
      console.log(`Key '${key}' already exists.`);
      return;
    }
  }

  envData += `${key}="${value}"\n`;

  fs.writeFileSync(ENV_FILE_PATH, envData);
  console.log(`Key '${key}' added with value '${value}'.`);
}

function removeKey(key) {
  let envData = fs.readFileSync(ENV_FILE_PATH, "utf8");
  const lines = envData.split("\n");
  const newData = lines
    .filter((line) => {
      const parts = line.split("=");
      return parts[0] !== key;
    })
    .join("\n");

  fs.writeFileSync(ENV_FILE_PATH, newData);
  console.log(`Key '${key}' removed.`);
}

function getValue(key) {
  let envData = fs.readFileSync(ENV_FILE_PATH, "utf8");
  const lines = envData.split("\n");
  for (let line of lines) {
    const [k, v] = line.split("=");
    if (k === key) {
      console.log(`Value for key '${key}': ${v}`);
      return;
    }
  }
  console.log(`Key '${key}' not found.`);
}

createEnvFile();

switch (command) {
  case "add":
    addKeyValue(key, value);
    break;
  case "remove":
    removeKey(key);
    break;
  case "get":
    getValue(key);
    break;
  default:
    console.log("Invalid command. Please use one of: add, remove, get.");
}
