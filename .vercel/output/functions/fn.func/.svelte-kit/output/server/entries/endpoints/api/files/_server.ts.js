import { readdirSync } from "fs";
import { resolve, relative } from "path";
function getAllFiles(dirPath, baseDir = dirPath) {
  let files = [];
  const items = readdirSync(dirPath, { withFileTypes: true });
  for (let item of items) {
    const fullPath = resolve(dirPath, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, baseDir));
    } else if (item.isFile()) {
      const relativePath = relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }
  return files;
}
async function GET() {
  const projectRoot = resolve(process.cwd(), "src");
  const allFiles = getAllFiles(projectRoot);
  return new Response(JSON.stringify(allFiles), {
    headers: { "Content-Type": "application/json" }
  });
}
export {
  GET
};
