import { f as fail } from "../../../../chunks/index.js";
import fs from "fs";
import path from "path";
const prerender = false;
const POSTS_DIR = path.resolve("src/posts");
const ADMIN_PASSWORD = "password";
function parseFrontmatter(content) {
  const match = content.match(/---\r?\n([\s\S]+?)\r?\n---/);
  if (match) {
    const frontmatter = match[1];
    const body = content.slice(match[0].length);
    const data = {};
    frontmatter.split("\n").forEach((line) => {
      const [key, ...value] = line.split(":");
      if (key && value) {
        data[key.trim()] = value.join(":").trim();
      }
    });
    return { frontmatter: data, body };
  }
  return { frontmatter: {}, body: content };
}
function load() {
  const posts = fs.readdirSync(POSTS_DIR).map((file) => {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
    return {
      slug: file.replace(/\.md$/, ""),
      title: frontmatter.title,
      description: frontmatter.description,
      categories: frontmatter.categories ? frontmatter.categories.replace(/[\[\]]/g, "").split(",").map((c) => c.trim().replace(/"/g, "")) : [],
      content: body.trim()
    };
  });
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
