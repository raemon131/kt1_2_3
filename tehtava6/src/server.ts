import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import express from "express";
import mysql from "mysql2/promise";

// Tietokantayhteys, kirjautumistiedot luetaan .env tiedostosta
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const app = express();
app.use(express.json());
app.use(async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token",
  );

  res.setHeader("Content-Type", "application/json");

  next();
});

app.post("/", async (req, res) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    // Create an MCP server
    const server = new McpServer({
      name: "opinnaytetyot",
      version: "1.0.0",
    });

    // Työkalu 1: kaikki vaiheet
    server.registerTool(
      "hae-vaiheet",
      {
        title: "hae-vaiheet",
        description: "Hakee opinnaytetöiden vaiheet tietokannasta lyhyesti",
      },
      async () => {
        try {
          const [rows] = await pool.query<mysql.RowDataPacket[]>(
            "SELECT vaihe FROM vaiheet;",
          );

          if (rows.length === 0) {
            return {
              content: [{ type: "text", text: "Vaiheita ei löytynyt." }],
            };
          }

          const lista = rows.map((r) => `- ${r.vaihe}`).join("\n");
          return { content: [{ type: "text", text: lista }] };
        } catch (error) {
          console.error("Virhe haettaessa vaiheita:", error);
          return {
            isError: true,
            content: [{ type: "text", text: "Tietokantavirhe." }],
          };
        }
      },
    );

    // Työkalu 2: yhden vaiheen selitys
    server.registerTool(
      "hae-selitys",
      {
        title: "hae-selitys",
        description:
          "Hakee opinnaytetyon vaiheen selityksen tietokannasta vaiheen nimen perusteella",
        inputSchema: {
          vaihe: z
            .string()
            .min(1)
            .describe(
              "Vaiheen nimi, esim. suunnitteluvaihe, toteutusvaihe tai viimeistelyvaihe",
            ),
        },
      },
      async ({ vaihe }) => {
        try {
          const like = `%${vaihe}%`;
          const [rows] = await pool.query<mysql.RowDataPacket[]>(
            "SELECT selitys FROM vaiheet WHERE vaihe LIKE ?;",
            [like],
          );

          if (rows.length === 0) {
            return {
              content: [{ type: "text", text: `Vaihetta "${vaihe}" ei löytynyt.` }],
            };
          }

          const selitykset = rows.map((r) => r.selitys).join("\n");
          return { content: [{ type: "text", text: selitykset }] };
        } catch (error) {
          console.error("Virhe haettaessa selitystä:", error);
          return {
            isError: true,
            content: [{ type: "text", text: "Tietokantavirhe." }],
          };
        }
      },
    );

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);

    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

// Serveri ei käytä sessioita, joten GET ja DELETE eivät ole sallittuja
const eiSallittu = (req: express.Request, res: express.Response) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
};
app.get("/", eiSallittu);
app.delete("/", eiSallittu);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP-serveri kuuntelee portissa ${PORT}`);
});
