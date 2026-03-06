import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { M as Mdsvex } from "./mdsvex.js";
import { I as Img } from "./img.js";
const metadata = {
  "title": "Erasmus a Lisbona",
  "description": "Sparito nell'ignoto e iniziato una nuova esperienza a Lisbona con l'Erasmus",
  "date": "03-29-2024-14:30",
  "categories": ["blog", "università", "vita"],
  "published": true
};
const Erasmus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Mdsvex, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {
    default: () => {
      return `<h1 id="linizio" data-svelte-h="svelte-qviphb">L’inizio</h1> <p data-svelte-h="svelte-d71xu8">Ciao a tutti! Sono Daniele e sto scrivendo questo per rendere il sito un po’ più vivo. Attualmente mi trovo a Lisbona, Portogallo, per un’esperienza Erasmus. Sto studiando presso l’<strong>Instituto Superior Técnico</strong> e sto avendo un po’ di <strong>difficoltà</strong> con il sistema di periodi che hanno qui.</p> <p data-svelte-h="svelte-gfdd29">In questo momento sta andando abbastanza bene, ma sto ancora cercando di capire come VIVERE davvero. Voglio dire, non sono abituato a questo tipo di vita, quindi sto cercando di adattarmi il più possibile.</p> <h2 id="instituto-superior-técnico" data-svelte-h="svelte-c7fvh8">Instituto Superior Técnico</h2> <p data-svelte-h="svelte-14mz60j">L’università è davvero bella e allo stesso tempo molto difficile. Studio <strong>Ingegneria Elettrica e Informatica</strong> e mi sto davvero divertendo con le materie. Voglio dire, c’è questa cosa chiamata <strong>Julia</strong> che è un po’ MHHHHHHHHHHHHHHHHHHHHH.
Ma almeno mi sto divertendo con le materie di <strong>programmazione</strong>. Avere tempo per sviluppare nuove competenze in <em>Information Retrieval</em> e <em>Compilatori</em> è davvero interessante. Per fortuna ero in un gruppo con DIO in persona che mi ha aiutato molto con Julia. Anche l’Information Retrieval è interessante e il progetto è stato molto coinvolgente.</p> ${validate_component(Img, "Components.img").$$render(
        $$result,
        {
          src: "https://i.imgur.com/DCCfN5V.png",
          alt: "Clustering"
        },
        {},
        {}
      )} <p data-svelte-h="svelte-m6fa7l">Volevo solo mettere qui la foto del clustering.</p> <h2 id="la-città" data-svelte-h="svelte-144h3bn">La città</h2> <p data-svelte-h="svelte-1m673if"><strong>Lisbona</strong> è fantastica. Sembra davvero <em>sicura</em> per essere una capitale e le persone sono piuttosto tranquille. In realtà non ho incontrato molti portoghesi, ma quelli che ho incontrato sono stati davvero gentili. Inoltre, ci sono molti studenti Erasmus qui, e intendo DAVVERO TANTI. Italiani, tedeschi, spagnoli, nord europei, e così via. Un saluto a Teo per essere un ragazzo pazzo e gentile. Sì, un saluto anche a Michele alias <strong>Maiku22</strong> per essere qui con me, anche se è un po’ dormiglione.</p> <h2 id="il-futuro" data-svelte-h="svelte-k7wjaz">Il futuro</h2> <p data-svelte-h="svelte-1y0jbbd">Sì, dovrei lavorare alla mia tesi, ma per <strong>alcuni eventi sfortunati</strong> sto ancora aspettando. Non ho un argomento particolare in mente, anche se ce ne sono alcuni che mi interessano. Ovviamente è qualcosa legato all’<em>Intelligenza Artificiale</em>, più focalizzato su alcune cose di Deep Learning. Sto aspettando di vedere se tutti gli esami vanno bene, e poi comincerò a pensarci.</p> <p data-svelte-h="svelte-114meq0">Non ho molto da dire, ma cercherò di mantenere aggiornato questo blog. Sto anche cercando di scrivere alcuni articoli su alcune cose che sto imparando, quindi rimanete sintonizzati! Ecco una foto di un piccione.</p> ${validate_component(Img, "Components.img").$$render(
        $$result,
        {
          src: "https://i.imgur.com/9FkJH7S.png",
          alt: "Pidgeon"
        },
        {},
        {}
      )}`;
    }
  })}`;
});
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Erasmus,
  metadata
}, Symbol.toStringTag, { value: "Module" }));
export {
  __vite_glob_0_0 as _
};
