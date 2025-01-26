import { resolve } from 'path';
import { readdirSync, readFile, readFileSync } from 'fs';

// function getAllFiles(dirPath, baseDir = dirPath) {
//   let files = [];
//   const items = readdirSync(dirPath, { withFileTypes: true });

//   for (let item of items) {
//     const fullPath = resolve(dirPath, item.name);
    
//     if (item.isDirectory()) {
//       // Recursively get files from subdirectories
//       files = files.concat(getAllFiles(fullPath, baseDir));
//     } else if (item.isFile()) {
//       // Get relative path from base directory
//       const relativePath = relative(baseDir, fullPath);
//       files.push(relativePath);
//     }
//   }

//   return files;
// }

export async function GET() {
  // const projectRoot = resolve(process.cwd(), 'src'); // Adjust based on your folder structure
  // const allFiles = getAllFiles(projectRoot); // Get all files with relative paths

  // Open file from static
  let filePath = resolve('static/files/files.json');
  let allFiles = readFileSync(filePath, 'utf8');
  allFiles = JSON.parse(allFiles);
  

  return new Response(JSON.stringify(allFiles), {
    headers: { 'Content-Type': 'application/json' }
  });
}
