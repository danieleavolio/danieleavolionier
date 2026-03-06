import { f as fail } from "../../../../chunks/index.js";
import fs from "fs";
import path from "path";
const prerender = false;
const POSTS_DIR = path.resolve("src/posts");
const ADMIN_PASSWORD = "password";
async function load() {
  const modules = /* @__PURE__ */ Object.assign({ "/src/posts/erasmus.md": () => import("../../../../chunks/erasmus.js").then((n) => n._), "/src/posts/filter-system.md": () => import("../../../../chunks/filter-system.js").then((n) => n._), "/src/posts/how-to-fix-pixel-7-pro-volume-button-falling-off.md": () => import("../../../../chunks/how-to-fix-pixel-7-pro-volume-button-falling-off.js").then((n) => n._), "/src/posts/implementare-search-engine-sveltekit.md": () => import("../../../../chunks/implementare-search-engine-sveltekit.js").then((n) => n._), "/src/posts/magistrale-informatica-unical.md": () => import("../../../../chunks/magistrale-informatica-unical.js").then((n) => n._), "/src/posts/nier-ui.md": () => import("../../../../chunks/nier-ui.js").then((n) => n._), "/src/posts/primo-modello-di-machine-learning.md": () => import("../../../../chunks/primo-modello-di-machine-learning.js").then((n) => n._), "/src/posts/recensione-chants-of-sennaar.md": () => import("../../../../chunks/recensione-chants-of-sennaar.js").then((n) => n._), "/src/posts/recensione-nier-automata.md": () => import("../../../../chunks/recensione-nier-automata.js").then((n) => n._), "/src/posts/recensione-outer-wilds.md": () => import("../../../../chunks/recensione-outer-wilds.js").then((n) => n._) });
  const posts = await Promise.all(
    Object.entries(modules).map(async ([path2, resolver]) => {
      const resolved = await resolver();
      const { metadata, default: content } = resolved;
      const slug = path2.split("/").pop()?.replace(".md", "");
      return {
        slug,
        title: metadata.title,
        description: metadata.description,
        categories: metadata.categories,
        content
      };
    })
  );
  return { posts };
}
const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const password = data.get("password");
    const title = data.get("title");
    const description = data.get("description");
    const categories = data.get("categories");
    const content = data.get("content");
    const slug = data.get("slug");
    if (password !== ADMIN_PASSWORD) {
      return fail(401, { message: "Password non valida" });
    }
    if (!title || !description || !categories || !content) {
      return fail(400, { message: "Tutti i campi sono obbligatori" });
    }
    const newSlug = slug || title.toString().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    const today = /* @__PURE__ */ new Date();
    const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const categoriesArray = categories.toString().split(",").map((c) => c.trim());
    const fileContent = `---
title: "${title}"
description: "${description}"
date: "${date}"
categories: [${categoriesArray.map((c) => `"${c}"`).join(", ")}]
published: true
---

${content}`;
    try {
      fs.writeFileSync(path.join(POSTS_DIR, `${newSlug}.md`), fileContent);
      return { message: "Post salvato con successo!" };
    } catch (error) {
      return fail(500, { message: "Errore during il salvataggio del post" });
    }
  }
};
export {
  actions,
  load,
  prerender
};
