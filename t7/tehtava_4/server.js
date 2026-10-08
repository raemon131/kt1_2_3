"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
const FILE_PATH = "./sanakirja.txt";
function readDictionary() {
    const dictionary = [];
    const data = fs_1.default.readFileSync(FILE_PATH, { encoding: "utf8", flag: "r" });
    const lines = data.split(/\r?\n/);
    lines.forEach((line) => {
        if (line.trim() === "")
            return;
        const words = line.split(" ");
        if (words.length >= 2) {
            dictionary.push({
                fin: words[0],
                eng: words[1],
            });
        }
    });
    return dictionary;
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Content-type", "application/json");
    next();
});
app.get("/sanakirja", (req, res) => {
    const dictionary = readDictionary();
    res.json(dictionary);
});
app.get("/sanakirja/:sana", (req, res) => {
    const searchWord = String(req.params.sana).toLowerCase();
    const dictionary = readDictionary();
    const found = dictionary.find((item) => item.fin.toLowerCase() === searchWord);
    if (found) {
        res.json(found);
    }
    else {
        res.status(404).json({ error: `Sanaa "${req.params.sana}" ei löytynyt` });
    }
});
app.post("/sanakirja", (req, res) => {
    const { fin, eng } = req.body;
    if (!fin || !eng) {
        res.status(400).json({ error: "Kentät fin ja eng vaaditaan" });
        return;
    }
    const dictionary = readDictionary();
    const exists = dictionary.find((item) => item.fin.toLowerCase() === fin.toLowerCase());
    if (exists) {
        res.status(409).json({ error: `Sana "${fin}" on jo sanakirjassa` });
        return;
    }
    fs_1.default.appendFileSync(FILE_PATH, `\n${fin} ${eng}`, { encoding: "utf8" });
    res.status(201).json({ fin, eng, message: "Sana lisätty" });
});
app.listen(port, () => {
    console.log(`Kuunnellaan portissa ${port}`);
});
//# sourceMappingURL=server.js.map