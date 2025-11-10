import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import { M as Mdsvex } from "./mdsvex.js";
import { G as Gallery, a as Grading } from "./Grading.js";
import { I as Img } from "./img.js";
const metadata = {
  "title": "Recensione Outer Wilds",
  "description": "Un'avventura spaziale che viaggia tra lo spazio/tempo e un oscuro mistero nascosto tra un bagliore stellare.",
  "date": "10-23-2024",
  "categories": ["videogiochi", "recensioni", "indie", "puzzle", "pc", "ps4", "xbox one"],
  "image": "https://i.imgur.com/uvbEnwH.png",
  "published": true,
  "isReview": true,
  "gameName": "Outer Wilds",
  "gameImage": "https://i.imgur.com/uvbEnwH.png",
  "ratingValue": 9,
  "reviewBody": "Outer Wilds è un'esperienza unica e coinvolgente, un viaggio interstellare che sfida i giocatori con degli enigmi unici e una narrazione non lineare. Un gioco che si distingue per la sua originalità e la sua capacità di trasportare i giocatori in un mondo misterioso e affascinante.",
  "developer": "Mobius Digital"
};
const { title, description, date, categories, image, published, isReview, gameName, gameImage, ratingValue, reviewBody, developer } = metadata;
const Recensione_outer_wilds = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let gallery1 = [
    "https://i.imgur.com/3MWKU42.png",
    "https://i.imgur.com/fWHEd2P.png",
    "https://i.imgur.com/2UQIgKG.png",
    "https://i.imgur.com/Mq9Ulhh.png",
    "https://i.imgur.com/KsfxRl3.png"
  ];
  return `${validate_component(Mdsvex, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign({}, $$props, metadata), {}, {
    default: () => {
      return `<h3 id="il-fascino-dellesplorazione" data-svelte-h="svelte-vptr05">Il Fascino dell’Esplorazione</h3> <p data-svelte-h="svelte-7x17jd"><strong>Outer Wilds</strong> è il nome di un’organizzazione che invia esploratori nello spazio per scoprire i segreti dell’universo. Una <em>razza</em> ormai estinta ha lasciato dei cimeli sparsi per il sistema solare in cui il giocatore si trova; il loro nome è <strong><code>Nomai</code></strong>. Il suo compito è quello di partire alla <em>scoperta</em> dell’universo per scoprire i suoi segreti e misteri nascosti, il tutto accompagnato da una colonna sonora che trasporta il giocatore in un viaggio spaziale unico. Ma c’è qualcosa che non va, qualcosa che non torna; uno strano <strong>evento</strong> che accade ad ogni playthrough. Un <code>reset</code>, un ritorno al punto di partenza da dove tutto ha avuto inizio: un caldo falò e un cielo stellato.</p> <p data-svelte-h="svelte-1ncsdgl">Il gioco è un <strong>avventura</strong> spaziale in cui il giocatore esplora un sistema solare in continua evoluzione, scoprendo nuovi <strong>pianeti</strong>, esplorando antiche rovine e risolvendo <strong>enigmi</strong> complessi. Il <code>gameplay</code> è incentrato sull’esplorazione e la risoluzione di puzzle ambientali, che richiedono al giocatore di osservare attentamente l’ambiente circostante e di utilizzare la propria intelligenza per trovare la soluzione giusta. Questo approccio non convenzionale rende l’esperienza di gioco molto più coinvolgente e gratificante, e permette al giocatore di immergersi completamente nel mondo di gioco e di sentirsi parte integrante di esso.</p> ${validate_component(Img, "Components.img").$$render(
        $$result,
        {
          src: "https://i.imgur.com/4YhLNoM.png",
          alt: "Camp"
        },
        {},
        {}
      )} <center data-svelte-h="svelte-1gnydze">Sfrido, la luna di Cuore Legnoso</center> <h3 id="una-narrazione-circolare" data-svelte-h="svelte-19vulwe">Una Narrazione Circolare</h3> <p data-svelte-h="svelte-oj48fr">In <strong>Outer Wilds</strong> ciò che sembra un semplice viaggio di esplorazione si trasforma in qualcosa che va oltre il solito concetto di <em>narrativa</em>. L’elemento principale è la presenza di un <strong><code>loop</code></strong> temporale che avviene ad ogni sessione di gioco, il che è il <strong>cuore</strong> del gameplay, che permette al giocatore di poter esplorare più volte le varie sezioni del gioco quando non si è riusciti a compiere una determinata azione in tempo. Questo però ha anche degli <code>svantaggi</code>; se da una parte si ha la possibilità di ripetere determinate azioni, dall’altra si ha comunque un vincolo di risolvere determinati <strong>puzzle</strong> e <strong>misteri</strong> in un un range di tempo che, per evitare spoiler, manterrò indefinito.</p> <p data-svelte-h="svelte-1sp2r60">La storia della razza <strong>nomai</strong> e del loro trascorso nell’universo è raccontata attraverso dei <strong>messaggi</strong> che si trovano sparsi per il sistema solare, in un alfabeto unico sconosciuto al giocatore, che tradurrà mediante l’uso di un traduttore portatile. Questo permette al giocatore di scoprire la storia di questa razza e di cosa sia successo loro, e come questo sia legato al mistero che circonda il sistema solare.</p> ${validate_component(Img, "Components.img").$$render(
        $$result,
        {
          src: "https://i.imgur.com/XVREAVb.png",
          alt: "Inizio"
        },
        {},
        {}
      )} <center data-svelte-h="svelte-11bskrh">Il punto di partenza</center> <hr> <h3 id="la-libertà-nel-gameplay" data-svelte-h="svelte-1i2ble5">La Libertà nel Gameplay</h3> <p data-svelte-h="svelte-tlh6gq">Una delle caratteristiche più interessanti di <strong>Outer Wilds</strong> è la totale <code>libertà</code> di esplorazione che il gioco offre al giocatore. Non ci sono obiettivi prefissati o missioni da completare, ma solo un vasto universo da esplorare e scoprire. Il giocatore è <code>libero</code> di decidere cosa fare e dove andare,e questo approccio non lineare rende l’esperienza di gioco estremamente coinvolgente e permette al giocatore di vivere il gioco a proprio ritmo, senza sentirsi mai guidato o limitato.</p> <p data-svelte-h="svelte-1mp9lzp">Per evitare di perdersi o di non sapere cosa fare, il gioco offre una <strong><code>mappa</code></strong> che permette al giocatore di tenere traccia delle varie località da esplorare e di pianificare i propri spostamenti futuri. Inoltre ogni luogo ha una propria <strong><code>lista</code></strong> di cose da fare in quel luogo, che si aggiorna man mano che il giocatore scopre nuove informazioni o risolve nuovi enigmi. Questo rende l’esperienza molto più piacevole e meno frustrante, anche se la difficoltà del gioco è comunque molto alta e richiede una buona dose di pazienza e dedizione per essere completato. In particolare, durante gli anni sono stati rilasciati <strong><code>aggiornamenti</code></strong> che hanno reso il gioco più accessibile a tutti quanti, con messaggi più chiari e più dettagli sulle varie meccaniche di gioco.</p> ${validate_component(Img, "Components.img").$$render(
        $$result,
        {
          src: "https://i.imgur.com/9RnBfmS.png",
          alt: "Mappa"
        },
        {},
        {}
      )} <center data-svelte-h="svelte-13d5dtr">Diario di Bordo</center> <h3 id="risolvere-gli-enigmi-del-tempo-e-dello-spazio" data-svelte-h="svelte-ugezpv">Risolvere gli Enigmi del Tempo e dello Spazio</h3> <p data-svelte-h="svelte-19npof7"><strong>Outer Wilds</strong> è principalmente un gioco di <strong>esplorazione</strong> e <strong>risoluzione di enigmi</strong>, e la sua struttura non lineare e non convenzionale richiede al giocatore di sforzarsi e di pensare in modo creativo per trovare le soluzioni giuste. I puzzle ambientali sono ben progettati e offrono una <strong><code>sfida</code></strong> non banale, che richiede al giocatore di osservare attentamente l’ambiente circostante. Inoltre, il <code>loop</code> temporale aggiunge un ulteriore livello di complessità ai puzzle, poiché il giocatore deve tenere conto del tempo e delle azioni che ha compiuto in passato per risolvere i misteri del gioco.</p> <p data-svelte-h="svelte-kbm6t">Alcune sezioni del gioco sono particolarmente <em>complicate</em> e richiedono una particolare attenzione alla <strong>storia</strong> che viene raccontata e ai dettagli che si trovano sparsi per il sistema solare. Questo perché comunque la <strong>narrazione</strong> è forse la parte più importante del gioco e il messaggio che vuole lasciare al giocatore durante il finale è qualcosa di unico che ho raramente visto in un videogioco.</p> <h3 id="un-silenzio-inquietante" data-svelte-h="svelte-qim0v8">Un Silenzio Inquietante</h3> <p data-svelte-h="svelte-n5hu6t">Siamo soli. Nell’immensità dello spazio, il silenzio è l’unico compagno di viaggio. Non ci saranno altri personaggi con cui interagire, al di fuori di alcuni <strong>esploratori</strong> come noi che si troveranno ognuno in un determinato pianeta. Sarà possibile ascoltare la loro <em><code>musica</code></em> che suona in sottofondo attraverso il <strong><code>segnaloscopio</code></strong>, uno strumento utile sia per trovare gli esploratori che per risolvere alcuni enigmi.</p> <p data-svelte-h="svelte-z5dnr7">Un elemento per me fondamentale del gioco è proprio questo dover affrontare questo viaggio da <code>soli</code>, senza una guida che ci dica cosa fare o dove andare. Non è un gioco che vi terrà per mano e che vi indicherà il prossimo punto in cui recarsi, bensì vi lascerà liberi di esplorare e scoprire il mondo di gioco a vostro piacimento. Nonostante tutto, non è un gioco che può piacere a tutti, in quanto questa mancanza di interazione potrebbe risultare noiosa per alcuni giocatori e <code>frustrante</code> in alcune sezioni di gioco.</p> <p data-svelte-h="svelte-ddapzm">Ma fondamentalmente è proprio questo che lo rende, a mio parere, unico. Il dover risolvere enigmi e misteri senza l’aiuto di nessuno, il dover esplorare un universo sconosciuto e misterioso senza sapere cosa ci aspetta, è ciò che rende <strong>Outer Wilds</strong> un gioco che è destinato a rimanere impresso nella memoria di chi lo gioca, e non solo.</p> ${validate_component(Gallery, "Gallery").$$render($$result, { images: gallery1 }, {}, {})} <hr> <h3 id="suoni-dallo-spazio" data-svelte-h="svelte-8lo0lg">Suoni dallo Spazio</h3> <p data-svelte-h="svelte-13r0fm">La colonna sonora di <strong>Outer Wilds</strong> composta da <a href="http://www.andrewprahlow.com/" rel="nofollow">Andrew Prahlow</a> è un capolavoro musicale che arricchisce gli ambienti del gioco e trasporta il giocatore in un viaggio indimenticabile. Tutt’ora ascoltando alcune tracce mi ritrovo catapultato in quelle sezioni che mi sono rimaste più impresse, e che mi hanno fatto provare emozioni <strong>rare</strong> in un videogioco. Ogni singola canzone è azzeccata per il determinato momento in cui viene suonata. Ogni momento diventa magico quando si scopre qualcosa di nuovo e si sente quella musica che ti accompagna in ogni singolo passo.</p> <p data-svelte-h="svelte-1aamjzb">Ho amato da morire la <code>colonna sonora</code> di questo gioco, non per altro gli astronauti che si trovano in giro per il sistema solare suonano la loro musica, che in realtà è la colonna sonora del gioco se ascoltata insieme. Ognuno di loro crea una sezione della canzone, e quando si incontrano tutti insieme si crea un’armonia unica che ti colpisce dritto al cuore.</p> <p data-svelte-h="svelte-wtkobp">Ci sarebbe tantissimo da dire sulla colonna sonora di questo gioco, ma preferisco lasciare a voi la scoperta di queste meravigliose tracce che vi accompagneranno durante il vostro viaggio spaziale</p> <iframe title="Outer Wilds Soundtrack" style="border-radius:12px" src="https://open.spotify.com/embed/album/1U0A6RPNJB05PtuBcaTM7o?utm_source=generator" width="100%" height="352" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe> <h3 id="once-in-a-lifetime" data-svelte-h="svelte-1betdax">Once in a Lifetime</h3> <p data-svelte-h="svelte-43icrs"><strong>Outer Wilds</strong> è un videogioco che non potete giocare più di una volta. Una volta finito, è capolinea. La meccanica base del gioco è <strong>la conoscenza</strong>. Non sbloccherete nuove abilità o potenziamenti, ma solo la conoscenza di ciò che vi circonda. Tutti gli enigmi, tutti i puzzle, tutti i misteri possono essere risolti in un batter d’occhio se si conosce la soluzione no? Ecco, questo è il punto di forza del gioco. Non ci sarà la possibilità di ripetere l’esperienza, quindi vi consiglio fortemente di <code>evitare spoiler</code> e di <code>non cercare guide</code> su internet, altrimenti vi rovinerete l’esperienza.</p> <p data-svelte-h="svelte-12wa02c">Questo elemento di <code>unicità</code> e <code>irripetibilità</code> è anche alla base del messaggio che vuole lasciare il gioco al giocatore. Se qualcosa è <code>finito</code>, è <code>finito</code>. Non c’è modo di tornare indietro, di farlo rimanere in sospeso. E’ un gioco che vi lascerà con un vuoto dentro, ma che allo stesso tempo vi farà sentire <code>completi</code> e <code>soddisfatti</code> di ciò che avete fatto. Nella sezione di <a href="#il-verdetto-finale"><strong>Il Verdetto Finale</strong></a> vi spiegherò meglio cosa intendo con questo.</p> <h3 id="la-paura-dellignoto" data-svelte-h="svelte-axz1x">La Paura dell’Ignoto</h3> <p data-svelte-h="svelte-13u1bfp">Oltre al gioco base è stato rilasciato un <code>DLC</code> chiamato <strong><code>Echoes of the Eye</code></strong> che aggiunge una sezione di gioco, un nuovo luogo da esplorare e nuovi misteri da risolvere. Ma siamo sicuri che sia effettivamente qualcosa di <strong>nuovo</strong>?
Il contenuto aggiuntivo di Echoes of the Eye aggiunge una componente <strong><code>horror</code></strong> al gioco, che passa da essere un’avventura spaziale a un’esperienza inquietante e con ambientazioni più cupe e oscure. Vengono aggiunte nuove meccaniche di gioco non presenti nel gioco base, sempre rimanendo fedeli al concetto di esplorazione e risoluzione di enigmi. La narrazione qui è ancora più importante, infatti il DLC si basa proprio sul capire cosa sia successo in quel determinato luogo e come questo sia legato al mistero che circonda il sistema solare. La storia passa dall’essere narrata tramite delle scritte sui muri a essere narrata tramite delle <strong><code>rullini</code></strong> contenenti delle immagini che raccontano la storia degli abitanti di quel luogo. Starà al giocatore scoprire cosa sia successo…</p> <p data-svelte-h="svelte-1qiip7y">Personalmente ho avuto un rapporto di amore/odio con questo DLC. L’aggiunta della parte horror ha messo a dura prova la mia resistenza non essendo io un grande fan del genere, ma allo stesso tempo affrontare questa esperienza mi ha aperto gli occhi su quello che voleva essere proprio il messaggio del gioco. Non posso dire altro senza rovinarvi la sorpresa, quindi vi consiglio di provarlo e di scoprire da soli cosa vi aspetta e di provare a <strong>combattere</strong> la <code>paura</code> che vi assale quando non sapete cosa si nasconde dietro l’angolo e dietro l’oscurità.</p> ${validate_component(Img, "Components.img").$$render(
        $$result,
        {
          src: "https://i.imgur.com/FcJD9jx.png",
          alt: "Echoes"
        },
        {},
        {}
      )} <center data-svelte-h="svelte-1wuy8we">Echoes of the Eye</center> <hr> <h3 id="qualche-critica" data-svelte-h="svelte-nietab">Qualche critica</h3> <p data-svelte-h="svelte-1py7hlf">Nonostante sia un gioco che mi ha colpito nel profondo, ci sono alcune cose che non mi hanno convinto del tutto. La <strong>difficoltà</strong> del gioco è molto alta e potrebbe risultare <code>frustrante</code> per alcuni giocatori, in particolare per coloro che non sono abituati a risolvere enigmi complessi o che non hanno molta pazienza. Inoltre, la mancanza di una guida o di un tutorial iniziale potrebbe rendere difficile per i nuovi giocatori capire come funzionano le meccaniche di gioco e come risolvere i vari puzzle.</p> <p data-svelte-h="svelte-4yv36q">Avendo visto e condiviso il gioco con varie tipologie di videogiocatori, dal più <code>esperto</code> al più <code>casuale</code>, posso dire che la difficoltà del gioco è molto soggettiva e che dipende molto dall’approccio che si ha nei confronti del gioco. Ho notato però che per i giocatori più casuali la difficoltà del gioco potrebbe risultare <code>troppo alta</code> e potrebbe scoraggiarli dal continuare a giocare, rendendo necessario il dover intervenire lasciando qualche indizio in più per aiutarli a risolvere i vari enigmi.</p> <p data-svelte-h="svelte-1mbrmfj">Oltre alla questione della difficoltà del gioco avrei citato la mancanza della possibilità di rivedere alcuni dei filmati o di scene che avrebbero richiesto del tempo per essere riprodotte. Forunatamente gli aggiornamenti hanno portato ad avere una quality of life migliore, ma inizialmente era un problema che mi ha dato abbastanza noia.</p> ${validate_component(Img, "Components.img").$$render(
        $$result,
        {
          src: "https://i.imgur.com/GubT8Z8.png",
          alt: "Metacritic"
        },
        {},
        {}
      )} <center data-svelte-h="svelte-1rcu4px">Recensioni negative su Metacritic</center> <h3 id="il-verdetto-finale" data-svelte-h="svelte-16yl8bu">Il Verdetto Finale</h3> <p data-svelte-h="svelte-4kt7b2">Outer Wilds è entrato nella mia <strong><code>top 3</code></strong> di giochi preferiti, piazzandosi al <strong>3° posto</strong> sotto i due NieR. E’ un gioco che mi ha colpito nel profondo, che mi ha fatto riscoprire il genere dei giochi con enigmi, che mi ha portato ad andare oltre il semplice concetto di risoluzione di puzzle. E’ un gioco che mi ha dato tanto, e che mi ha lasciato un messaggio molto pesante addosso, un messaggio che non mi aspettavo di ricevere mai e che ancora oggi mi fa riflettere su molte cose e mi aiuta ad affrontare diverse sfide che la vita mi pone davanti. Il DLC mi ha fatto capire che non bisogna mai avere paura dell’ignoto, che bisogna sempre affrontare le sfide che ci vengono poste davanti e che bisogna credere in se stessi e nelle proprie idee.</p> <p data-svelte-h="svelte-14qycb">Il gioco è un capolavoro, un’esperienza che se viene ancora oggi consigliata è perché è effettivamente un gioco che va giocato. Un gioco indie che nonostante il piccolissimo budget ha saputo raggiungere il cuore di moltissimi giocatori che tramandano ancora oggi la bellezza di questo gioco.</p> <p data-svelte-h="svelte-fjrlf9">La non rigiocabilità citata nel paragrafo <a href="#once-in-a-lifetime"><strong>Once in a Lifetime</strong></a> è un qualcosa a cui tengo molto, perché ho mezzo mentito quando ho detto che non si può rigiocare. In realtà si può, ma non saremo noi direttamente a rigiocarlo, bensì una persona a cui teniamo, che possiamo accompagnare in questo viaggio e, in un certo modo, rivivere le emozioni che abbiamo provato noi. Questo rende ancora più speciale la condivisione di questo gioco con qualcuno, e vi consiglio di farlo se avete la possibilità. Anzi, penso che sia proprio un dovere trasmettere questo messaggio a chiunque.</p> ${validate_component(Grading, "Grading").$$render(
        $$result,
        {
          grade: ratingValue,
          pros: [
            "Enigmi ben progettati",
            "Colonna sonora coinvolgente",
            "Libertà di esplorazione",
            "Messaggio profondo",
            "Unicità dell'esperienza"
          ],
          cons: [
            "Difficoltà elevata",
            "Problemi di quality of life iniziali",
            "Gatekeeping per i casuals"
          ],
          title: "Un viaggio indimenticabile"
        },
        {},
        {
          default: () => {
            return `<p data-svelte-h="svelte-if588l">Outer Wilds è un’esperienza unica e coinvolgente, un viaggio interstellare che sfida i giocatori con degli enigmi unici e una narrazione non lineare. Un gioco che si distingue per la sua originalità e la sua capacità di trasportare i giocatori in un mondo misterioso e affascinante. La sua colonna sonora coinvolgente e la sua libertà di esplorazione lo rendono un’esperienza indimenticabile, anche se la sua difficoltà elevata e i problemi di quality of life iniziali potrebbero scoraggiare alcuni giocatori. In definitiva, Outer Wilds è un viaggio che vale la pena intraprendere, un’esperienza che vi lascerà con un messaggio profondo e un ricordo indelebile.</p>`;
          }
        }
      )}`;
    }
  })}`;
});
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Recensione_outer_wilds,
  metadata
}, Symbol.toStringTag, { value: "Module" }));
export {
  __vite_glob_0_9 as _
};
