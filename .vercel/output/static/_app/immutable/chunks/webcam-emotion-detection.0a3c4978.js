import{s as Ie,v as le,w as we,f as s,a as o,g as m,E as r,c as a,j as c,i,u as ye,d as l}from"./scheduler.69ed1edc.js";import{S as je,i as Ue,b as ne,d as oe,m as ae,a as se,t as me,e as re}from"./index.7977ad0e.js";import{g as De,a as Te}from"./spread.8a54911c.js";import{M as Re}from"./mdsvex.cf024404.js";import{I as Ee}from"./img.83bfa82c.js";function Se(D){let n,x="Sistema di Rilevamento delle Emozioni",f,d,u="Questo progetto è progettato per rilevare e analizzare le emozioni dai flussi video in tempo reale. Utilizza un <strong>pretrained</strong> per identificare i volti umani e <strong>FER</strong> per classificare le loro emozioni in diverse categorie come <em>neutro, felice, triste, sorpresa, paura, disgusto e arrabbiato</em>. Il sistema traccia anche l’andamento delle emozioni dominanti nel tempo, fornendo preziose informazioni sulle dinamiche emotive.",p,v,ue="Caratteristiche",R,L,pe="<li>Rilevamento delle emozioni in tempo reale dai flussi video.</li> <li>Identificazione di emozioni multiple.</li> <li>Analisi dell’andamento delle emozioni dominanti nel tempo.</li> <li>Leggero ed efficiente, adatto per essere eseguito su varie piattaforme hardware.</li>",S,_,de="Esempio",W,C,ve="Esempio di Rilevamento delle Emozioni",k,M,F,P,V,z,fe="Installazione",A,w,ce="Controllare la repository <em>github</em> per clonare il progetto e installare le dipendenze necessarie. Tutte le informazioni sono disponibili nel file <code>requirements.txt</code>.",G,h,xe="Utilizzo",N,T,_e="Per avviare il sistema di rilevamento delle emozioni, esegui lo script principale dal terminale.",O,g,Ce="Parametri",Q,E,ze="<li><code>--analyze_video</code>: Dopo aver premuto <code>q</code> per interrompere il flusso video, verrà salvato un file PNG con l’andamento delle emozioni nel tempo.</li>",B,b,he="Complicazioni e Limitazioni",J,q,ge="Attualmente il progetto funziona solamente con 1 volto alla volta e non è in grado di rilevare emozioni da volti parzialmente visibili o coperti. Inoltre, la precisione del rilevamento delle emozioni può variare in base alla qualità dell’immagine e alla luce ambientale. Il modello è molto molto leggero appunto per funzionare in tempo reale, quindi non è il più accurato in assoluto; piuttosto è un buon compromesso tra accuratezza e velocità.",K,I,be="Posso dire che in condizioni di scarsa luce si comporta comunque in modo accettabile e con una webcam abbastanza di scarsa qualità, quindi è un buon compromesso per un uso generale.",X,$,$e="Future implementazioni",Y,y,He="<li>Migliorare la precisione del rilevamento delle emozioni.</li> <li>Supporto per il rilevamento di più volti contemporaneamente.</li> <li>Possibilità di usare un file video come input.</li> <li>Possibilità d i usare un’immagine come input.</li>",Z,H,Le="Conclusione",ee,j,Me='Puoi trovare il progetto sulla pagina <strong>github</strong> qui <a href="https://github.com/danieleavolio/WebcamEmotionDetection" rel="nofollow">Webcam Emotion Detection</a>!',te,U,Pe="Per qualsiasi domanda o suggerimento, non esitare a contattarmi!",ie;return M=new Ee({props:{src:"https://i.imgur.com/iImMGgz.png",alt:"Esempio di Emozioni"}}),P=new Ee({props:{src:"https://i.imgur.com/el8560V.png",alt:"Esempio di Emozioni"}}),{c(){n=s("h1"),n.textContent=x,f=o(),d=s("p"),d.innerHTML=u,p=o(),v=s("h2"),v.textContent=ue,R=o(),L=s("ul"),L.innerHTML=pe,S=o(),_=s("h2"),_.textContent=de,W=o(),C=s("h3"),C.textContent=ve,k=o(),ne(M.$$.fragment),F=o(),ne(P.$$.fragment),V=o(),z=s("h2"),z.textContent=fe,A=o(),w=s("p"),w.innerHTML=ce,G=o(),h=s("h2"),h.textContent=xe,N=o(),T=s("p"),T.textContent=_e,O=o(),g=s("h3"),g.textContent=Ce,Q=o(),E=s("ul"),E.innerHTML=ze,B=o(),b=s("h2"),b.textContent=he,J=o(),q=s("p"),q.textContent=ge,K=o(),I=s("p"),I.textContent=be,X=o(),$=s("h2"),$.textContent=$e,Y=o(),y=s("ul"),y.innerHTML=He,Z=o(),H=s("h2"),H.textContent=Le,ee=o(),j=s("p"),j.innerHTML=Me,te=o(),U=s("p"),U.textContent=Pe,this.h()},l(e){n=m(e,"H1",{id:!0,"data-svelte-h":!0}),r(n)!=="svelte-1r7rl0"&&(n.textContent=x),f=a(e),d=m(e,"P",{"data-svelte-h":!0}),r(d)!=="svelte-fj710f"&&(d.innerHTML=u),p=a(e),v=m(e,"H2",{id:!0,"data-svelte-h":!0}),r(v)!=="svelte-hno1ww"&&(v.textContent=ue),R=a(e),L=m(e,"UL",{"data-svelte-h":!0}),r(L)!=="svelte-16z3ds8"&&(L.innerHTML=pe),S=a(e),_=m(e,"H2",{id:!0,"data-svelte-h":!0}),r(_)!=="svelte-1ay61m6"&&(_.textContent=de),W=a(e),C=m(e,"H3",{id:!0,"data-svelte-h":!0}),r(C)!=="svelte-erv5k0"&&(C.textContent=ve),k=a(e),oe(M.$$.fragment,e),F=a(e),oe(P.$$.fragment,e),V=a(e),z=m(e,"H2",{id:!0,"data-svelte-h":!0}),r(z)!=="svelte-x3cgds"&&(z.textContent=fe),A=a(e),w=m(e,"P",{"data-svelte-h":!0}),r(w)!=="svelte-1wa35lg"&&(w.innerHTML=ce),G=a(e),h=m(e,"H2",{id:!0,"data-svelte-h":!0}),r(h)!=="svelte-o1srji"&&(h.textContent=xe),N=a(e),T=m(e,"P",{"data-svelte-h":!0}),r(T)!=="svelte-tbrrdg"&&(T.textContent=_e),O=a(e),g=m(e,"H3",{id:!0,"data-svelte-h":!0}),r(g)!=="svelte-90amaq"&&(g.textContent=Ce),Q=a(e),E=m(e,"UL",{"data-svelte-h":!0}),r(E)!=="svelte-1c179l6"&&(E.innerHTML=ze),B=a(e),b=m(e,"H2",{id:!0,"data-svelte-h":!0}),r(b)!=="svelte-2cxvy8"&&(b.textContent=he),J=a(e),q=m(e,"P",{"data-svelte-h":!0}),r(q)!=="svelte-1og4eag"&&(q.textContent=ge),K=a(e),I=m(e,"P",{"data-svelte-h":!0}),r(I)!=="svelte-1hd7gj2"&&(I.textContent=be),X=a(e),$=m(e,"H2",{id:!0,"data-svelte-h":!0}),r($)!=="svelte-kk0duz"&&($.textContent=$e),Y=a(e),y=m(e,"UL",{"data-svelte-h":!0}),r(y)!=="svelte-1npq77p"&&(y.innerHTML=He),Z=a(e),H=m(e,"H2",{id:!0,"data-svelte-h":!0}),r(H)!=="svelte-1famsre"&&(H.textContent=Le),ee=a(e),j=m(e,"P",{"data-svelte-h":!0}),r(j)!=="svelte-ihfpv4"&&(j.innerHTML=Me),te=a(e),U=m(e,"P",{"data-svelte-h":!0}),r(U)!=="svelte-19fwvc1"&&(U.textContent=Pe),this.h()},h(){c(n,"id","sistema-di-rilevamento-delle-emozioni"),c(v,"id","caratteristiche"),c(_,"id","esempio"),c(C,"id","esempio-di-rilevamento-delle-emozioni"),c(z,"id","installazione"),c(h,"id","utilizzo"),c(g,"id","parametri"),c(b,"id","complicazioni-e-limitazioni"),c($,"id","future-implementazioni"),c(H,"id","conclusione")},m(e,t){i(e,n,t),i(e,f,t),i(e,d,t),i(e,p,t),i(e,v,t),i(e,R,t),i(e,L,t),i(e,S,t),i(e,_,t),i(e,W,t),i(e,C,t),i(e,k,t),ae(M,e,t),i(e,F,t),ae(P,e,t),i(e,V,t),i(e,z,t),i(e,A,t),i(e,w,t),i(e,G,t),i(e,h,t),i(e,N,t),i(e,T,t),i(e,O,t),i(e,g,t),i(e,Q,t),i(e,E,t),i(e,B,t),i(e,b,t),i(e,J,t),i(e,q,t),i(e,K,t),i(e,I,t),i(e,X,t),i(e,$,t),i(e,Y,t),i(e,y,t),i(e,Z,t),i(e,H,t),i(e,ee,t),i(e,j,t),i(e,te,t),i(e,U,t),ie=!0},p:ye,i(e){ie||(se(M.$$.fragment,e),se(P.$$.fragment,e),ie=!0)},o(e){me(M.$$.fragment,e),me(P.$$.fragment,e),ie=!1},d(e){e&&(l(n),l(f),l(d),l(p),l(v),l(R),l(L),l(S),l(_),l(W),l(C),l(k),l(F),l(V),l(z),l(A),l(w),l(G),l(h),l(N),l(T),l(O),l(g),l(Q),l(E),l(B),l(b),l(J),l(q),l(K),l(I),l(X),l($),l(Y),l(y),l(Z),l(H),l(ee),l(j),l(te),l(U)),re(M,e),re(P,e)}}}function We(D){let n,x;const f=[D[0],qe];let d={$$slots:{default:[Se]},$$scope:{ctx:D}};for(let u=0;u<f.length;u+=1)d=le(d,f[u]);return n=new Re({props:d}),{c(){ne(n.$$.fragment)},l(u){oe(n.$$.fragment,u)},m(u,p){ae(n,u,p),x=!0},p(u,[p]){const v=p&1?De(f,[p&1&&Te(u[0]),p&0&&Te(qe)]):{};p&2&&(v.$$scope={dirty:p,ctx:u}),n.$set(v)},i(u){x||(se(n.$$.fragment,u),x=!0)},o(u){me(n.$$.fragment,u),x=!1},d(u){re(n,u)}}}const qe={title:"Webcam Emotion Detection",description:"Piccolo progettod di Machine Learning per rilevare le emozioni umane tramite la webcam, lightweigth e facile da usare.",date:"07-04-2024-16:00",categories:["Machine Learning","Computer Vision","Python","OpenCV","TensorFlow"],published:!0};function ke(D,n,x){return D.$$set=f=>{x(0,n=le(le({},n),we(f)))},n=we(n),[n]}class Oe extends je{constructor(n){super(),Ue(this,n,ke,We,Ie,{})}}export{Oe as default,qe as metadata};