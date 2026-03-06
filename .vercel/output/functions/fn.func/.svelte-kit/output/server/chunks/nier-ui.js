import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { M as Mdsvex } from "./mdsvex.js";
const metadata = {
  "title": "UI di NieR Automata",
  "description": "Nuova UI fresca per il diario",
  "date": "08-12-2023-13:00",
  "categories": ["programmazione", "web"],
  "published": true
};
const Nier_ui = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Mdsvex, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {
    default: () => {
      return `<h1 id="cambio-improvviso" data-svelte-h="svelte-9udtv3">Cambio Improvviso</h1> <p data-svelte-h="svelte-1jk2w6f">Ho deciso di passare da una palette di colori <em>completamente scura</em> a una <em>leggermente diversa</em>. Sono passato da un tema interamente scuro con occasionali accenti di colori più chiari a un tema completamente chiaro ispirato a <strong>NieR Automata</strong>.</p> <h2 id="come-ho-fatto" data-svelte-h="svelte-1sv5q8q">Come Ho Fatto</h2> <p data-svelte-h="svelte-1bpbzvw">Devo ringraziare l’utente che ha creato questo <strong>progetto</strong> su <a href="https://www.codepen.io" rel="nofollow">CodePen</a>, che mi ha aiutato a capire come strutturare tutto.</p> <p data-svelte-h="svelte-wp34i6">Puoi trovare il progetto direttamente a questo link: <a href="https://codepen.io/levise/pen/vMzEwr" rel="nofollow">FONTE</a>.</p> <p data-svelte-h="svelte-7ywprr">Mi sta piacendo molto come sta venendo fuori il progetto, anche se ancora <em>non so esattamente cosa pubblicare</em>. Per ora, diciamo solo che sto trascorrendo il tempo scrivendo post e costruendo la struttura del sito. Devo ammettere che ho sempre voluto creare qualcosa nello stile di <strong>NieR:Automata</strong>.</p> <h3 id="idea-per-il-futuro" data-svelte-h="svelte-t2mxfn">Idea per il Futuro</h3> <p data-svelte-h="svelte-14b237k">Letteralmente, ho appena avuto un’idea mentre scrivevo questo post! Forse potrei aggiungere un componente al sito che mostri il contenuto dei post in forma riassunta, evidenziando i <strong>titoli</strong>. Non so ancora come farlo, ma tecnicamente dovrebbe essere molto fattibile.</p> <ul data-svelte-h="svelte-1ipoqeh"><li>Aggiungere un componente per mostrare il contenuto dei post in forma riassunta</li> <li>Aggiungere una ricerca per i post tramite tag</li> <li>Aggiungere una ricerca per i post tramite data</li> <li>Vincere alla lotteria e ottenere 10.000€</li></ul>`;
    }
  })}`;
});
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nier_ui,
  metadata
}, Symbol.toStringTag, { value: "Module" }));
export {
  __vite_glob_0_5 as _
};
