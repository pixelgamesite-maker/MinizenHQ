import type { VercelRequest, VercelResponse } from "@vercel/node";

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRkRO2EKJLdO6M4fqOfgWlII1EqMSrQalfCpyxElJacrgjNLF11o9vZ6EP1IZFyK_FbTF4shPEzQ7eC/pub?output=csv";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: "Wallet address required" });

  try {
    const response = await fetch(SHEET_CSV_URL);
    const text = await response.text();
    const rows = text.trim().split("\n").map(row => row.split(","));
    const lower = wallet.toLowerCase().trim();

    for (const row of rows) {
      const sheetWallet = row[0]?.trim().toLowerCase();
      if (sheetWallet === lower) {
        return res.status(200).json({ found: true });
      }
    }

    return res.status(200).json({ found: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}