import{s as ys,v as we,w as es,f as p,a,a8 as A,g as i,E as r,c as n,a9 as C,j as u,i as t,u as us,d as l}from"./scheduler.69ed1edc.js";import{S as ms,i as As,b as Cs,d as Fs,m as _s,a as fs,t as vs,e as xs}from"./index.7977ad0e.js";import{g as zs,a as ss}from"./spread.8a54911c.js";import{M as Ds}from"./mdsvex.cf024404.js";function bs(S){let o,F="Guida alla Creazione di un Modello di Predizione del Prezzo delle Case",m,d,c="In questo post, vedremo come creare un semplice modello di predizione del prezzo delle case utilizzando Python e scikit-learn. L’obiettivo è fornire una guida passo-passo per costruire un modello predittivo utilizzando regressione lineare.",B,y,ge="Passaggi Principali",ie,h,He="<li><strong>Importazione delle librerie necessarie</strong></li> <li><strong>Caricamento del dataset</strong></li> <li><strong>Esplorazione e pulizia dei dati</strong></li> <li><strong>Preparazione dei dati per il modello</strong></li> <li><strong>Addestramento del modello di regressione lineare</strong></li> <li><strong>Valutazione del modello</strong></li> <li><strong>Utilizzo del modello per fare predizioni</strong></li>",re,_,qe="1. Importazione delle Librerie Necessarie",ce,E,Me="Iniziamo importando le librerie essenziali per il nostro progetto:",Be,j,ls=`<pre class="shiki one-dark-pro" style="background-color: #282c34" tabindex="0"><code><span class="line"><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> pandas </span><span style="color: #C678DD">as</span><span style="color: #ABB2BF"> pd</span></span>
<span class="line"><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> numpy </span><span style="color: #C678DD">as</span><span style="color: #ABB2BF"> np</span></span>
<span class="line"><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> matplotlib.pyplot </span><span style="color: #C678DD">as</span><span style="color: #ABB2BF"> plt</span></span>
<span class="line"><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> seaborn </span><span style="color: #C678DD">as</span><span style="color: #ABB2BF"> sns</span></span>
<span class="line"><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> sklearn.model_selection </span><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> train_test_split</span></span>
<span class="line"><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> sklearn.linear_model </span><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> LinearRegression</span></span>
<span class="line"><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> sklearn.metrics </span><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> mean_squared_error</span></span></code></pre>`,U,f,Le="2. Caricamento del Dataset",de,w,Ie="Per questo esempio, utilizzeremo il famoso dataset “Boston Housing”. È possibile caricarlo direttamente da scikit-learn:",ye,V,as=`<pre class="shiki one-dark-pro" style="background-color: #282c34" tabindex="0"><code><span class="line"><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> sklearn.datasets </span><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> load_boston</span></span>
<span class="line"><span style="color: #ABB2BF">boston </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #61AFEF">load_boston</span><span style="color: #ABB2BF">()</span></span>
<span class="line"><span style="color: #ABB2BF">df </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> pd.</span><span style="color: #61AFEF">DataFrame</span><span style="color: #ABB2BF">(boston.data, </span><span style="color: #E06C75; font-style: italic">columns</span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF">boston.feature_names)</span></span>
<span class="line"><span style="color: #ABB2BF">df[</span><span style="color: #98C379">&#39;PRICE&#39;</span><span style="color: #ABB2BF">] </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> boston.target</span></span></code></pre>`,G,v,$e="3. Esplorazione e Pulizia dei Dati",ue,g,Re="Diamo un’occhiata ai primi record del dataset e alle statistiche descrittive:",me,N,ns=`<pre class="shiki one-dark-pro" style="background-color: #282c34" tabindex="0"><code><span class="line"><span style="color: #56B6C2">print</span><span style="color: #ABB2BF">(df.</span><span style="color: #61AFEF">head</span><span style="color: #ABB2BF">())</span></span>
<span class="line"><span style="color: #56B6C2">print</span><span style="color: #ABB2BF">(df.</span><span style="color: #61AFEF">describe</span><span style="color: #ABB2BF">())</span></span></code></pre>`,O,H,Te="È importante verificare la presenza di valori mancanti e, se presenti, gestirli adeguatamente:",Ae,Q,os='<pre class="shiki one-dark-pro" style="background-color: #282c34" tabindex="0"><code><span class="line"><span style="color: #56B6C2">print</span><span style="color: #ABB2BF">(df.</span><span style="color: #61AFEF">isnull</span><span style="color: #ABB2BF">().</span><span style="color: #61AFEF">sum</span><span style="color: #ABB2BF">())</span></span></code></pre>',J,x,Xe="4. Preparazione dei Dati per il Modello",Ce,q,Se="Selezioniamo le caratteristiche (features) e la variabile target (il prezzo delle case):",Fe,K,ps=`<pre class="shiki one-dark-pro" style="background-color: #282c34" tabindex="0"><code><span class="line"><span style="color: #ABB2BF">X </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> df.</span><span style="color: #61AFEF">drop</span><span style="color: #ABB2BF">(</span><span style="color: #98C379">&#39;PRICE&#39;</span><span style="color: #ABB2BF">, </span><span style="color: #E06C75; font-style: italic">axis</span><span style="color: #56B6C2">=</span><span style="color: #D19A66">1</span><span style="color: #ABB2BF">)</span></span>
<span class="line"><span style="color: #ABB2BF">y </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> df[</span><span style="color: #98C379">&#39;PRICE&#39;</span><span style="color: #ABB2BF">]</span></span></code></pre>`,W,M,je="Dividiamo i dati in set di addestramento e di test:",_e,Y,is='<pre class="shiki one-dark-pro" style="background-color: #282c34" tabindex="0"><code><span class="line"><span style="color: #ABB2BF">X_train, X_test, y_train, y_test </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #61AFEF">train_test_split</span><span style="color: #ABB2BF">(X, y, </span><span style="color: #E06C75; font-style: italic">test_size</span><span style="color: #56B6C2">=</span><span style="color: #D19A66">0.2</span><span style="color: #ABB2BF">, </span><span style="color: #E06C75; font-style: italic">random_state</span><span style="color: #56B6C2">=</span><span style="color: #D19A66">42</span><span style="color: #ABB2BF">)</span></span></code></pre>',Z,z,Ue="5. Addestramento del Modello di Regressione Lineare",fe,L,Ve="Creiamo un’istanza del modello di regressione lineare e addestriamolo con i dati di addestramento:",ve,ee,rs=`<pre class="shiki one-dark-pro" style="background-color: #282c34" tabindex="0"><code><span class="line"><span style="color: #ABB2BF">model </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #61AFEF">LinearRegression</span><span style="color: #ABB2BF">()</span></span>
<span class="line"><span style="color: #ABB2BF">model.</span><span style="color: #61AFEF">fit</span><span style="color: #ABB2BF">(X_train, y_train)</span></span></code></pre>`,se,D,Ge="6. Valutazione del Modello",xe,I,Ne="Utilizziamo i dati di test per valutare le prestazioni del modello:",ze,te,cs=`<pre class="shiki one-dark-pro" style="background-color: #282c34" tabindex="0"><code><span class="line"><span style="color: #ABB2BF">y_pred </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> model.</span><span style="color: #61AFEF">predict</span><span style="color: #ABB2BF">(X_test)</span></span>
<span class="line"><span style="color: #ABB2BF">mse </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #61AFEF">mean_squared_error</span><span style="color: #ABB2BF">(y_test, y_pred)</span></span>
<span class="line"><span style="color: #56B6C2">print</span><span style="color: #ABB2BF">(</span><span style="color: #C678DD">f</span><span style="color: #98C379">&#39;Mean Squared Error: </span><span style="color: #D19A66">&#123;</span><span style="color: #ABB2BF">mse</span><span style="color: #D19A66">&#125;</span><span style="color: #98C379">&#39;</span><span style="color: #ABB2BF">)</span></span></code></pre>`,le,$,Oe="Possiamo anche visualizzare i risultati con un grafico:",De,ae,Bs=`<pre class="shiki one-dark-pro" style="background-color: #282c34" tabindex="0"><code><span class="line"><span style="color: #ABB2BF">plt.</span><span style="color: #61AFEF">scatter</span><span style="color: #ABB2BF">(y_test, y_pred)</span></span>
<span class="line"><span style="color: #ABB2BF">plt.</span><span style="color: #61AFEF">xlabel</span><span style="color: #ABB2BF">(</span><span style="color: #98C379">&#39;True Prices&#39;</span><span style="color: #ABB2BF">)</span></span>
<span class="line"><span style="color: #ABB2BF">plt.</span><span style="color: #61AFEF">ylabel</span><span style="color: #ABB2BF">(</span><span style="color: #98C379">&#39;Predicted Prices&#39;</span><span style="color: #ABB2BF">)</span></span>
<span class="line"><span style="color: #ABB2BF">plt.</span><span style="color: #61AFEF">title</span><span style="color: #ABB2BF">(</span><span style="color: #98C379">&#39;True vs Predicted Prices&#39;</span><span style="color: #ABB2BF">)</span></span>
<span class="line"><span style="color: #ABB2BF">plt.</span><span style="color: #61AFEF">show</span><span style="color: #ABB2BF">()</span></span></code></pre>`,ne,b,Qe="7. Utilizzo del Modello per Fare Predizioni",be,R,Je="Ora possiamo utilizzare il nostro modello per predire i prezzi delle case su nuovi dati:",ke,oe,ds=`<pre class="shiki one-dark-pro" style="background-color: #282c34" tabindex="0"><code><span class="line"><span style="color: #ABB2BF">new_data </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> [[</span><span style="color: #D19A66">0.00632</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">18.00</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">2.31</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">0</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">0.538</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">6.575</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">65.2</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">4.0900</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">1</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">296</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">15.3</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">396.90</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">4.98</span><span style="color: #ABB2BF">]]  </span><span style="color: #7F848E; font-style: italic"># Nuovi dati</span></span>
<span class="line"><span style="color: #ABB2BF">predicted_price </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> model.</span><span style="color: #61AFEF">predict</span><span style="color: #ABB2BF">(new_data)</span></span>
<span class="line"><span style="color: #56B6C2">print</span><span style="color: #ABB2BF">(</span><span style="color: #C678DD">f</span><span style="color: #98C379">&#39;Predicted Price: </span><span style="color: #D19A66">&#123;</span><span style="color: #ABB2BF">predicted_price</span><span style="color: #D19A66">&#125;</span><span style="color: #98C379">&#39;</span><span style="color: #ABB2BF">)</span></span></code></pre>`,pe,k,Ke="Conclusione",Pe,T,We="Abbiamo visto come creare un semplice modello di predizione del prezzo delle case utilizzando regressione lineare. Questo esempio può essere un punto di partenza per modelli più complessi che utilizzano tecniche di machine learning più avanzate.",he,P,Ye="Aggiunta finale",Ee,X,Ze="Ho provato a generare questo post utilizzando ChatGPT 4o per vedere se effettivamente un post venisse indicizzato e quanto effettivamente sarebe stato trovato nelle ricerche. Chiaramente il contenuto è fittizio e non rappresenta un vero post di machine learning, però comunque da un’idea abbastanza semplice del topic discusso. Vabbè, ciao!";return{c(){o=p("h1"),o.textContent=F,m=a(),d=p("p"),d.textContent=c,B=a(),y=p("h2"),y.textContent=ge,ie=a(),h=p("ol"),h.innerHTML=He,re=a(),_=p("h2"),_.textContent=qe,ce=a(),E=p("p"),E.textContent=Me,Be=a(),j=new A(!1),U=a(),f=p("h2"),f.textContent=Le,de=a(),w=p("p"),w.textContent=Ie,ye=a(),V=new A(!1),G=a(),v=p("h2"),v.textContent=$e,ue=a(),g=p("p"),g.textContent=Re,me=a(),N=new A(!1),O=a(),H=p("p"),H.textContent=Te,Ae=a(),Q=new A(!1),J=a(),x=p("h2"),x.textContent=Xe,Ce=a(),q=p("p"),q.textContent=Se,Fe=a(),K=new A(!1),W=a(),M=p("p"),M.textContent=je,_e=a(),Y=new A(!1),Z=a(),z=p("h2"),z.textContent=Ue,fe=a(),L=p("p"),L.textContent=Ve,ve=a(),ee=new A(!1),se=a(),D=p("h2"),D.textContent=Ge,xe=a(),I=p("p"),I.textContent=Ne,ze=a(),te=new A(!1),le=a(),$=p("p"),$.textContent=Oe,De=a(),ae=new A(!1),ne=a(),b=p("h2"),b.textContent=Qe,be=a(),R=p("p"),R.textContent=Je,ke=a(),oe=new A(!1),pe=a(),k=p("h2"),k.textContent=Ke,Pe=a(),T=p("p"),T.textContent=We,he=a(),P=p("h2"),P.textContent=Ye,Ee=a(),X=p("p"),X.textContent=Ze,this.h()},l(e){o=i(e,"H1",{id:!0,"data-svelte-h":!0}),r(o)!=="svelte-8b7kgb"&&(o.textContent=F),m=n(e),d=i(e,"P",{"data-svelte-h":!0}),r(d)!=="svelte-17gyhid"&&(d.textContent=c),B=n(e),y=i(e,"H2",{id:!0,"data-svelte-h":!0}),r(y)!=="svelte-1ht0r0r"&&(y.textContent=ge),ie=n(e),h=i(e,"OL",{"data-svelte-h":!0}),r(h)!=="svelte-e7ty7"&&(h.innerHTML=He),re=n(e),_=i(e,"H2",{id:!0,"data-svelte-h":!0}),r(_)!=="svelte-12c0pu6"&&(_.textContent=qe),ce=n(e),E=i(e,"P",{"data-svelte-h":!0}),r(E)!=="svelte-etlp22"&&(E.textContent=Me),Be=n(e),j=C(e,!1),U=n(e),f=i(e,"H2",{id:!0,"data-svelte-h":!0}),r(f)!=="svelte-xqxi1n"&&(f.textContent=Le),de=n(e),w=i(e,"P",{"data-svelte-h":!0}),r(w)!=="svelte-1lftp0p"&&(w.textContent=Ie),ye=n(e),V=C(e,!1),G=n(e),v=i(e,"H2",{id:!0,"data-svelte-h":!0}),r(v)!=="svelte-3orucl"&&(v.textContent=$e),ue=n(e),g=i(e,"P",{"data-svelte-h":!0}),r(g)!=="svelte-1q6mb4t"&&(g.textContent=Re),me=n(e),N=C(e,!1),O=n(e),H=i(e,"P",{"data-svelte-h":!0}),r(H)!=="svelte-sgdudw"&&(H.textContent=Te),Ae=n(e),Q=C(e,!1),J=n(e),x=i(e,"H2",{id:!0,"data-svelte-h":!0}),r(x)!=="svelte-4pfjgi"&&(x.textContent=Xe),Ce=n(e),q=i(e,"P",{"data-svelte-h":!0}),r(q)!=="svelte-17ism7d"&&(q.textContent=Se),Fe=n(e),K=C(e,!1),W=n(e),M=i(e,"P",{"data-svelte-h":!0}),r(M)!=="svelte-531i5a"&&(M.textContent=je),_e=n(e),Y=C(e,!1),Z=n(e),z=i(e,"H2",{id:!0,"data-svelte-h":!0}),r(z)!=="svelte-1a8yne2"&&(z.textContent=Ue),fe=n(e),L=i(e,"P",{"data-svelte-h":!0}),r(L)!=="svelte-1t2qf6g"&&(L.textContent=Ve),ve=n(e),ee=C(e,!1),se=n(e),D=i(e,"H2",{id:!0,"data-svelte-h":!0}),r(D)!=="svelte-1hbenv7"&&(D.textContent=Ge),xe=n(e),I=i(e,"P",{"data-svelte-h":!0}),r(I)!=="svelte-gpsksc"&&(I.textContent=Ne),ze=n(e),te=C(e,!1),le=n(e),$=i(e,"P",{"data-svelte-h":!0}),r($)!=="svelte-k07737"&&($.textContent=Oe),De=n(e),ae=C(e,!1),ne=n(e),b=i(e,"H2",{id:!0,"data-svelte-h":!0}),r(b)!=="svelte-fck4kq"&&(b.textContent=Qe),be=n(e),R=i(e,"P",{"data-svelte-h":!0}),r(R)!=="svelte-1t5pigu"&&(R.textContent=Je),ke=n(e),oe=C(e,!1),pe=n(e),k=i(e,"H2",{id:!0,"data-svelte-h":!0}),r(k)!=="svelte-1famsre"&&(k.textContent=Ke),Pe=n(e),T=i(e,"P",{"data-svelte-h":!0}),r(T)!=="svelte-gsoguv"&&(T.textContent=We),he=n(e),P=i(e,"H2",{id:!0,"data-svelte-h":!0}),r(P)!=="svelte-1pkvut9"&&(P.textContent=Ye),Ee=n(e),X=i(e,"P",{"data-svelte-h":!0}),r(X)!=="svelte-1tqdm8n"&&(X.textContent=Ze),this.h()},h(){u(o,"id","guida-alla-creazione-di-un-modello-di-predizione-del-prezzo-delle-case"),u(y,"id","passaggi-principali"),u(_,"id","1-importazione-delle-librerie-necessarie"),j.a=U,u(f,"id","2-caricamento-del-dataset"),V.a=G,u(v,"id","3-esplorazione-e-pulizia-dei-dati"),N.a=O,Q.a=J,u(x,"id","4-preparazione-dei-dati-per-il-modello"),K.a=W,Y.a=Z,u(z,"id","5-addestramento-del-modello-di-regressione-lineare"),ee.a=se,u(D,"id","6-valutazione-del-modello"),te.a=le,ae.a=ne,u(b,"id","7-utilizzo-del-modello-per-fare-predizioni"),oe.a=pe,u(k,"id","conclusione"),u(P,"id","aggiunta-finale")},m(e,s){t(e,o,s),t(e,m,s),t(e,d,s),t(e,B,s),t(e,y,s),t(e,ie,s),t(e,h,s),t(e,re,s),t(e,_,s),t(e,ce,s),t(e,E,s),t(e,Be,s),j.m(ls,e,s),t(e,U,s),t(e,f,s),t(e,de,s),t(e,w,s),t(e,ye,s),V.m(as,e,s),t(e,G,s),t(e,v,s),t(e,ue,s),t(e,g,s),t(e,me,s),N.m(ns,e,s),t(e,O,s),t(e,H,s),t(e,Ae,s),Q.m(os,e,s),t(e,J,s),t(e,x,s),t(e,Ce,s),t(e,q,s),t(e,Fe,s),K.m(ps,e,s),t(e,W,s),t(e,M,s),t(e,_e,s),Y.m(is,e,s),t(e,Z,s),t(e,z,s),t(e,fe,s),t(e,L,s),t(e,ve,s),ee.m(rs,e,s),t(e,se,s),t(e,D,s),t(e,xe,s),t(e,I,s),t(e,ze,s),te.m(cs,e,s),t(e,le,s),t(e,$,s),t(e,De,s),ae.m(Bs,e,s),t(e,ne,s),t(e,b,s),t(e,be,s),t(e,R,s),t(e,ke,s),oe.m(ds,e,s),t(e,pe,s),t(e,k,s),t(e,Pe,s),t(e,T,s),t(e,he,s),t(e,P,s),t(e,Ee,s),t(e,X,s)},p:us,d(e){e&&(l(o),l(m),l(d),l(B),l(y),l(ie),l(h),l(re),l(_),l(ce),l(E),l(Be),j.d(),l(U),l(f),l(de),l(w),l(ye),V.d(),l(G),l(v),l(ue),l(g),l(me),N.d(),l(O),l(H),l(Ae),Q.d(),l(J),l(x),l(Ce),l(q),l(Fe),K.d(),l(W),l(M),l(_e),Y.d(),l(Z),l(z),l(fe),l(L),l(ve),ee.d(),l(se),l(D),l(xe),l(I),l(ze),te.d(),l(le),l($),l(De),ae.d(),l(ne),l(b),l(be),l(R),l(ke),oe.d(),l(pe),l(k),l(Pe),l(T),l(he),l(P),l(Ee),l(X))}}}function ks(S){let o,F;const m=[S[0],ts];let d={$$slots:{default:[bs]},$$scope:{ctx:S}};for(let c=0;c<m.length;c+=1)d=we(d,m[c]);return o=new Ds({props:d}),{c(){Cs(o.$$.fragment)},l(c){Fs(o.$$.fragment,c)},m(c,B){_s(o,c,B),F=!0},p(c,[B]){const y=B&1?zs(m,[B&1&&ss(c[0]),B&0&&ss(ts)]):{};B&2&&(y.$$scope={dirty:B,ctx:c}),o.$set(y)},i(c){F||(fs(o.$$.fragment,c),F=!0)},o(c){vs(o.$$.fragment,c),F=!1},d(c){xs(o,c)}}}const ts={title:"Primo Modello di Machine Learning [AI]",description:"In questo post, vedremo come creare un semplice modello di predizione del prezzo delle case utilizzando Python e scikit-learn. L'obiettivo è fornire una guida passo-passo per costruire un modello predittivo utilizzando regressione lineare.",date:"06-19-2024-19:30",categories:["machine-learning","python","scikit-learn"],published:!0};function Ps(S,o,F){return S.$$set=m=>{F(0,o=we(we({},o),es(m)))},o=es(o),[o]}class Hs extends ms{constructor(o){super(),As(this,o,Ps,ks,ys,{})}}export{Hs as default,ts as metadata};