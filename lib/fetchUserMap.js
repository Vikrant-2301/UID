import { parse } from "csv-parse/sync";

export async function fetchUserMap() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  try {
    const res = await fetch(sheetUrl);
    if (!res.ok) throw new Error("Failed to fetch the sheet");

    const csvText = await res.text();

    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });

    const userMap = {};
    for (const row of records) {
      const email = row["Email"]?.trim().toLowerCase();
      const uid = row["UID"]?.trim();
      if (email && uid) {
        userMap[email] = uid;
      }
    }

    return userMap;
  } catch (error) {
    console.error("Error fetching user map:", error);
    return {};
  }
}
