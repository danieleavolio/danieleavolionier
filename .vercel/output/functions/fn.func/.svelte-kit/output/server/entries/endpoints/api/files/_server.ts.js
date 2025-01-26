import { resolve } from "path";
import { readFileSync } from "fs";
async function GET() {
  let filePath = resolve("static/files/files.json");
  let allFiles = readFileSync(filePath, "utf8");
  allFiles = JSON.parse(allFiles);
  return new Response(JSON.stringify(allFiles), {
    headers: { "Content-Type": "application/json" }
  });
}
export {
  GET
};
