import { readdirSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';

function getAllFiles(dirPath, baseDir = dirPath) {
  let files = [];
  const items = readdirSync(dirPath, { withFileTypes: true });

  for (let item of items) {
    const fullPath = resolve(dirPath, item.name);
    
    if (item.isDirectory()) {
      // Recursively get files from subdirectories
      files = files.concat(getAllFiles(fullPath, baseDir));
    } else if (item.isFile()) {
      // Get relative path from base directory
      const relativePath = relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }

  return files;
}

export async function GET() {
  const projectRoot = resolve(process.cwd(), 'src'); // Adjust based on your folder structure
  const allFiles = getAllFiles(projectRoot); // Get all files with relative paths

  return new Response(JSON.stringify(allFiles), {
    headers: { 'Content-Type': 'application/json' }
  });
}
