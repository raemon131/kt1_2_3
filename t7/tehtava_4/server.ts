import express from "express";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";

const app = express();
const port = 3000;
const FILE_PATH = "./sanakirja.txt";

interface Sana {
  fin: string;
  eng: string;
}

function readDictionary(): Sana[] {
  const dictionary: Sana[] = [];

  const data = fs.readFileSync(FILE_PATH, { encoding: "utf8", flag: "r" });

  const lines = data.split(/\r?\n/);

  lines.forEach((line) => {
    if (line.trim() === "") return;

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-type", "application/json");
  next();
});

app.get("/sanakirja", (req: Request, res: Response) => {
  const dictionary = readDictionary();
  res.json(dictionary);
});

app.get("/sanakirja/:sana", (req: Request, res: Response) => {
  const searchWord = String(req.params.sana).toLowerCase();
  const dictionary = readDictionary();

  const found = dictionary.find(
    (item) => item.fin.toLowerCase() === searchWord
  );

  if (found) {
    res.json(found);
  } else {
    res.status(404).json({ error: `Sanaa "${req.params.sana}" ei löytynyt` });
  }
});

app.post("/sanakirja", (req: Request, res: Response) => {
  const { fin, eng } = req.body as { fin: string; eng: string };

  if (!fin || !eng) {
    res.status(400).json({ error: "Kentät fin ja eng vaaditaan" });
    return;
  }

  const dictionary = readDictionary();
  const exists = dictionary.find(
    (item) => item.fin.toLowerCase() === fin.toLowerCase()
  );

  if (exists) {
    res.status(409).json({ error: `Sana "${fin}" on jo sanakirjassa` });
    return;
  }

  fs.appendFileSync(FILE_PATH, `\n${fin} ${eng}`, { encoding: "utf8" });

  res.status(201).json({ fin, eng, message: "Sana lisätty" });
});

app.listen(port, () => {
  console.log(`Kuunnellaan portissa ${port}`);
});
