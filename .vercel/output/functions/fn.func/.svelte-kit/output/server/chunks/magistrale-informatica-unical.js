import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { M as Mdsvex } from "./mdsvex.js";
import { I as Img } from "./img.js";
const metadata = {
  "title": "Fine della magistrale in Informatica all'Unical",
  "description": "Wow, è finita la magistrale in Informatica all'Unical. Manca solo tesi e tirocinio e poi ci siamo!",
  "date": "09-12-2024-17:30",
  "categories": ["blog", "università", "vita"],
  "published": true
};
const Magistrale_informatica_unical = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Mdsvex, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {
    default: () => {
      return `<h1 id="la-fine" data-svelte-h="svelte-jqnpb3">La fine</h1> <p data-svelte-h="svelte-1pxtgag">Fa strano, ormai è praticamente finita. Sono riuscito a superare tutti gli esami e adesso mi manca solo la tesi e il tirocinio. E’ stato una bella esperienza, con non poche rogne e problemi, ma eccoci qua. Penso sia giusto fare un piccolo riassunto di questi due anni.</p> <h2 id="gli-esami" data-svelte-h="svelte-15lnt5j">Gli esami</h2> <p data-svelte-h="svelte-gi3vid">Devo fare la <strong>top 3</strong> degli esami più tosti della <em>magistrale</em>? Ma non ci sono dubbi a riguardo lol:</p> <ol data-svelte-h="svelte-cgda39"><li><code>Statistica</code>: Ma senza proprio nessun dubbio. Ho dovuto studiare come un pazzo per superare l’esame, andare contro ogni mio istinto e cercare di capire come funzionano le cose. Alla fine ce l’ho fatta e sono soddisfatto. Soddisfatto di cosa? Di non aver capito nulla? Forse.</li> <li><code>Informatica Teorica</code>: Che dire, letteralmente impossibile avere la testa per farci entrare tutto. Letteralmente la prima parte veniva sovrascritta dalla seconda, ma è stato sicuramente uno degli esami più fighi che ho fatto. Comunque, alla fine, <code>P = NP</code>, per dire.</li> <li><code>Ottimizzazione per Machine Learning</code>: Questo è stato un esame che mi ha fatto sudare freddo. Non tanto per la materia in sé, ma per il fatto che dovevo davvero capire tutto quanto di tutto. Alla fine ho capito quasi tutto di tutto, però <strong>ehi</strong>! Una matrice si semplifica moltiplicando per la sua inversa, giusto? Eh.</li></ol> <h2 id="la-tesi" data-svelte-h="svelte-1f05b2n">La tesi</h2> <p data-svelte-h="svelte-107if74">Un grosso</p> <p align="center" data-svelte-h="svelte-1f6xnx0">BOH</p> <p data-svelte-h="svelte-ogzs7j">Sto aspettando di ricevere conferma da un’azienda <strong>segreta</strong> per fare sia la tesi che il tirocinio. Spero che tutto vada bene, perché altrimenti dovrò cercare qualcosa di diverso. Ma non mi preoccupo, perché so che ce la farò.</p> ${validate_component(Img, "Components.img").$$render(
        $$result,
        {
          src: "https://staticg.sportskeeda.com/editor/2024/04/084e8-17121622204131-1920.jpg?w=640",
          alt: "AlMight"
        },
        {},
        {}
      )} <h2 id="il-futuro" data-svelte-h="svelte-k7wjaz">Il futuro</h2> <p data-svelte-h="svelte-wr1gwq">Sì, il futuro. Cosa ci sarà?</p> <h1 align="center" data-svelte-h="svelte-1y16bla">BOOOOOOOH</h1> <blockquote data-svelte-h="svelte-1lcwev2"><p align="center">🤙🤙🤙 Sicuramente non il dottorato 🤙🤙🤙</p></blockquote> <p data-svelte-h="svelte-1fachye">Al prossimo aggiornamento inutile! 🥳</p>`;
    }
  })}`;
});
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Magistrale_informatica_unical,
  metadata
}, Symbol.toStringTag, { value: "Module" }));
export {
  __vite_glob_0_4 as _
};
