import { parse } from "csv-parse/sync";

export async function fetchUserMap() {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1pTRVBUoKwM48CJr3EY_ciJuvjyUbb9CacA6CWQtLBc4/export?format=csv";

  const res = await fetch(sheetUrl);
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
}
