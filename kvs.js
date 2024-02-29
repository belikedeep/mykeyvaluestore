#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const CURRENT_DIR = process.cwd();
const ENV_FILE_PATH = path.join(CURRENT_DIR, ".env");

const command = process.argv[2];
const key = process.argv[3];
const value = process.argv[4];

function createEnvFile() {
  if (!fs.existsSync(ENV_FILE_PATH)) {
    fs.writeFileSync(ENV_FILE_PATH, "");
  }
}

function addKeyValue(key, value) {
  const envContent = fs.readFileSync(ENV_FILE_PATH, "utf8");
  const keyValuePairs = envContent.split("\n");
  let keyExists = false;

  // Check if the key already exists
  for (let i = 0; i < keyValuePairs.length; i++) {
    const pair = keyValuePairs[i];
    const [k, v] = pair.split("=");
    if (k === key) {
      keyExists = true;
      break;
    }
  }

  if (keyExists) {
    console.log(
      `Key '${key}' already exists. Use 'edit' command to modify its value.`
    );
  } else {
    // Append the key-value pair to .env file
    const keyValue = `${key}=${value}\n`;
    fs.appendFileSync(ENV_FILE_PATH, keyValue);
    console.log(`Added key '${key}' with value '${value}'.`);
  }
}

function removeKey(key) {
  // Read .env file
  let envContent = fs.readFileSync(ENV_FILE_PATH, "utf8");

  // Remove the line containing the key
  envContent = envContent.replace(new RegExp(`${key}=.*\n`), "");

  // Write back to .env file
  fs.writeFileSync(ENV_FILE_PATH, envContent);

  console.log(`Removed key '${key}'.`);
}

function getValue(key) {
  const envContent = fs.readFileSync(ENV_FILE_PATH, "utf8");
  const keyValuePairs = envContent.split("\n");

  for (let i = 0; i < keyValuePairs.length; i++) {
    const pair = keyValuePairs[i];
    const [k, v] = pair.split("=");
    if (k === key) {
      console.log(`Value for key '${key}' is '${v}'.`);
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
    console.log("Invalid command. Please use one of: add, remove, get, edit.");
}
