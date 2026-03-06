import { f as fail } from "../../../../chunks/index.js";
import fs from "fs";
import path from "path";
const prerender = false;
const STACK_ELEMENTS_JSON_PATH = path.resolve("src/lib/stackElements.json");
const STACK_ELEMENTS_DIR = path.resolve("src/stackElements");
const ADMIN_PASSWORD = "password";
function load() {
  const stackElements = JSON.parse(fs.readFileSync(STACK_ELEMENTS_JSON_PATH, "utf-8"));
  const stackElementContents = {};
  stackElements.forEach((element) => {
    const filePath = path.join(STACK_ELEMENTS_DIR, `${element.slug}.md`);
    if (fs.existsSync(filePath)) {
      stackElementContents[element.slug] = fs.readFileSync(filePath, "utf-8");
    }
  });
  return { stackElements, stackElementContents };
}
const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const password = data.get("password");
    const stackElements = JSON.parse(data.get("stackElements"));
    const stackElementContents = JSON.parse(data.get("stackElementContents"));
    if (password !== ADMIN_PASSWORD) {
      return fail(401, { message: "Password non valida" });
    }
    try {
      fs.writeFileSync(STACK_ELEMENTS_JSON_PATH, JSON.stringify(stackElements, null, 2));
      for (const slug in stackElementContents) {
        const filePath = path.join(STACK_ELEMENTS_DIR, `${slug}.md`);
        fs.writeFileSync(filePath, stackElementContents[slug]);
      }
      return { message: "Stack salvato con successo!" };
    } catch (error) {
      return fail(500, { message: "Errore durante il salvataggio dello stack" });
    }
  }
};
export {
  actions,
  load,
  prerender
};
