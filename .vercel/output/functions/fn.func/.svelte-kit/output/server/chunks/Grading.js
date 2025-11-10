import { c as create_ssr_component, d as add_attribute, v as validate_component, e as escape, g as each } from "./ssr.js";
import { M as Modal } from "./Modal.js";
const Gallery_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".gallery.svelte-1cvi287.svelte-1cvi287{display:flex;flex-direction:column;align-items:center;width:100%;max-width:1000px;margin:0 auto;padding:1.2em}.image-container.svelte-1cvi287.svelte-1cvi287{width:100%;overflow:hidden;border:1px solid var(--automataBlackOpacity);border-radius:5px}.image-container.svelte-1cvi287 img.svelte-1cvi287,.image-container.svelte-1cvi287 video.svelte-1cvi287{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}.controls.svelte-1cvi287.svelte-1cvi287{display:flex;justify-content:space-between;width:100%;margin-top:10px}.controls.svelte-1cvi287 button.svelte-1cvi287{padding:10px}.indicator.svelte-1cvi287.svelte-1cvi287{margin-top:10px;height:100%;display:flex;align-items:center}.indicator.svelte-1cvi287 p.svelte-1cvi287{margin:0}button.svelte-1cvi287.svelte-1cvi287{background-color:var(--automataBlackOpacity);color:var(--automataWhite);text-transform:uppercase;transition:background-color 0.3s;width:100px}button.svelte-1cvi287.svelte-1cvi287:hover{background-color:var(--automataBlackO)}.image-container.svelte-1cvi287 img.svelte-1cvi287{cursor:pointer}.modal-image.svelte-1cvi287.svelte-1cvi287{max-width:100%;height:auto;cursor:auto !important}",
  map: null
};
const Gallery = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { images = [] } = $$props;
  let currentIndex = 0;
  let imageClicked = false;
  if ($$props.images === void 0 && $$bindings.images && images !== void 0)
    $$bindings.images(images);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="gallery svelte-1cvi287"><div class="image-container svelte-1cvi287"> ${images.length > 0 ? `  ${images[currentIndex].includes("mp4") ? ` <video controls${add_attribute("src", images[currentIndex], 0)} class="svelte-1cvi287"></video>` : `<img${add_attribute("src", images[currentIndex], 0)} alt="Image Gallery" class="svelte-1cvi287">`}  ${validate_component(Modal, "Modal").$$render(
      $$result,
      { isSearch: false, showModal: imageClicked },
      {
        showModal: ($$value) => {
          imageClicked = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return ` ${images[currentIndex].includes("mp4") ? ` <video controls${add_attribute("src", images[currentIndex], 0)} class="svelte-1cvi287"></video>` : `<img class="modal-image svelte-1cvi287"${add_attribute("src", images[currentIndex], 0)} alt="Image Gallery">`}`;
        }
      }
    )}` : `<p data-svelte-h="svelte-1m3e6e2">Qualcosa è andato stortissimo...</p>`}</div> <div class="controls svelte-1cvi287"><button ${images.length === 0 ? "disabled" : ""} class="svelte-1cvi287"><span class="material-symbols-outlined" data-svelte-h="svelte-8i2ihc">arrow_back</span></button> <div class="indicator svelte-1cvi287">${images.length > 0 ? `<p class="svelte-1cvi287">${escape(currentIndex + 1)}/${escape(images.length)}</p>` : ``}</div> <button ${images.length === 0 ? "disabled" : ""} class="svelte-1cvi287"><span class="material-symbols-outlined" data-svelte-h="svelte-jcdo4c">arrow_forward</span></button></div> </div>`;
  } while (!$$settled);
  return $$rendered;
});
const Grading_svelte_svelte_type_style_lang = "";
const css = {
  code: "h2.svelte-xm0bgq.svelte-xm0bgq{font-weight:bold;text-align:center;margin:1em}.container.svelte-xm0bgq.svelte-xm0bgq{display:grid;grid-template-columns:1fr 1fr;gap:2rem;padding:1rem;border-radius:8px;width:100%}.grade.svelte-xm0bgq.svelte-xm0bgq{font-size:4rem;font-weight:bold;text-align:center;grid-column:span 2;margin-bottom:1rem;color:var(--automataBlack0);margin:auto;width:100px;height:100px;border-radius:100%;padding:2rem;box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);display:flex;justify-content:center;align-items:center}.pros.svelte-xm0bgq.svelte-xm0bgq,.cons.svelte-xm0bgq.svelte-xm0bgq{padding:1rem;border-radius:8px;background-color:var(--automataBlack);color:var(--automataWhite);box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);width:100%}.pros.svelte-xm0bgq h3.svelte-xm0bgq,.cons.svelte-xm0bgq h3.svelte-xm0bgq{margin-top:0;font-size:1.5rem;font-weight:bold}.pros.svelte-xm0bgq.svelte-xm0bgq{border-left:5px solid var(--automataYellow)}.pros.svelte-xm0bgq h3.svelte-xm0bgq{color:var(--automataYellow)}.pros.svelte-xm0bgq li.svelte-xm0bgq::marker{color:var(--automataYellow)}.cons.svelte-xm0bgq h3.svelte-xm0bgq{color:var(--automataRed)}.cons.svelte-xm0bgq li.svelte-xm0bgq::marker{color:var(--automataRed)}.cons.svelte-xm0bgq.svelte-xm0bgq{border-left:5px solid var(--automataRed)}.final-comment.svelte-xm0bgq.svelte-xm0bgq{padding:1rem;border-radius:8px;background-color:var(--automataBlack);color:var(--automataWhite);box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);grid-column:span 2;width:100%}@media(max-width: 900px){.container.svelte-xm0bgq.svelte-xm0bgq{grid-template-columns:1fr}.grade.svelte-xm0bgq.svelte-xm0bgq{grid-column:span 1}.pros.svelte-xm0bgq.svelte-xm0bgq{grid-column:span 1}.cons.svelte-xm0bgq.svelte-xm0bgq{grid-column:span 1}.final-comment.svelte-xm0bgq.svelte-xm0bgq{grid-column:span 1}.final-comment.svelte-xm0bgq h2.svelte-xm0bgq{word-break:break-word}}",
  map: null
};
const Grading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let gradeColor;
  let { grade = 0 } = $$props;
  let { pros = [] } = $$props;
  let { cons = [] } = $$props;
  let { title = "" } = $$props;
  if ($$props.grade === void 0 && $$bindings.grade && grade !== void 0)
    $$bindings.grade(grade);
  if ($$props.pros === void 0 && $$bindings.pros && pros !== void 0)
    $$bindings.pros(pros);
  if ($$props.cons === void 0 && $$bindings.cons && cons !== void 0)
    $$bindings.cons(cons);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css);
  gradeColor = grade <= 4 ? "#cd674d" : grade <= 7 ? "#ece7d5" : "#e1d8aa";
  return `<div class="container svelte-xm0bgq"><div class="grade svelte-xm0bgq" style="${"background-color: " + escape(gradeColor, true) + ";"}"><span>${escape(grade)}</span></div> <div class="pros svelte-xm0bgq"><h3 class="svelte-xm0bgq" data-svelte-h="svelte-16fmi0k">Pros</h3> <ul>${each(pros, (pro) => {
    return `<li class="svelte-xm0bgq">${escape(pro)}</li>`;
  })}</ul></div> <div class="cons svelte-xm0bgq"><h3 class="svelte-xm0bgq" data-svelte-h="svelte-67r87p">Cons</h3> <ul>${each(cons, (con) => {
    return `<li class="svelte-xm0bgq">${escape(con)}</li>`;
  })}</ul></div> <div class="final-comment svelte-xm0bgq"><h2 style="${"color: " + escape(gradeColor, true) + ";"}" class="svelte-xm0bgq">${escape(title)}</h2> ${slots.default ? slots.default({}) : ``}</div> </div>`;
});
export {
  Gallery as G,
  Grading as a
};
