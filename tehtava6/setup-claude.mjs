import fs from "fs";
import path from "path";

const appData = process.env.APPDATA;
if (!appData) {
  console.error("APPDATA ei ole asetettu. Skripti on tarkoitettu Windowsille.");
  process.exit(1);
}

const dir = path.join(appData, "Claude");
const file = path.join(dir, "claude_desktop_config.json");

let config = {};

if (fs.existsSync(file)) {
  // Windows saattaa lisätä tiedoston alkuun BOM-merkin
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");

  if (text.trim() !== "") {
    try {
      config = JSON.parse(text);
    } catch (error) {
      console.error("Asetustiedoston JSON on rikki, mitään ei muutettu:");
      console.error(file);
      process.exit(1);
    }
  }

  fs.copyFileSync(file, file + ".bak");
} else {
  fs.mkdirSync(dir, { recursive: true });
}

config.mcpServers = config.mcpServers ?? {};
config.mcpServers.opinnaytetyot = {
  command: "npx",
  args: ["-y", "mcp-remote", "http://localhost:3000"],
};

fs.writeFileSync(file, JSON.stringify(config, null, 2));

console.log("Valmis. Kirjoitettu tiedostoon:");
console.log(file);
console.log("Käynnistä Claude Desktop kokonaan uudelleen.");
