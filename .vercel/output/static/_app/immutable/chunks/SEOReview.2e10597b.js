import{s as ne,f as b,a as B,g as k,h as P,d as m,c as S,B as Q,j as r,i as G,r as h,C as F,J as ge,l as X,m as Y,n as J,u as K,p as ve,D as pe,K as H,e as te,x as be,k as x,y as ke,z as we,A as Ee,M as ue,H as ye,T as Te,F as Ie}from"./scheduler.38e9bcec.js";import{S as se,i as ie,g as Me,t as le,c as Ce,a as ae,f as Ve,b as Pe,d as De,m as ze,e as Ae}from"./index.e37b2c25.js";import{M as Ge}from"./Modal.7f77fb98.js";import{e as ee}from"./each.51a03826.js";function Re(a){let e,l="Qualcosa è andato stortissimo...";return{c(){e=b("p"),e.textContent=l},l(t){e=k(t,"P",{"data-svelte-h":!0}),Q(e)!=="svelte-1m3e6e2"&&(e.textContent=l)},m(t,n){G(t,e,n)},p:K,i:K,o:K,d(t){t&&m(e)}}}function Ne(a){let e,l,t,n,s;function i(o,g){return g&3&&(e=null),e==null&&(e=!!o[0][o[1]].includes("mp4")),e?Se:Be}let c=i(a,-1),u=c(a);function T(o){a[8](o)}let d={isSearch:!1,$$slots:{default:[He]},$$scope:{ctx:a}};return a[2]!==void 0&&(d.showModal=a[2]),t=new Ge({props:d}),ve.push(()=>Ve(t,"showModal",T)),{c(){u.c(),l=B(),Pe(t.$$.fragment)},l(o){u.l(o),l=S(o),De(t.$$.fragment,o)},m(o,g){u.m(o,g),G(o,l,g),ze(t,o,g),s=!0},p(o,g){c===(c=i(o,g))&&u?u.p(o,g):(u.d(1),u=c(o),u&&(u.c(),u.m(l.parentNode,l)));const M={};g&16387&&(M.$$scope={dirty:g,ctx:o}),!n&&g&4&&(n=!0,M.showModal=o[2],pe(()=>n=!1)),t.$set(M)},i(o){s||(ae(t.$$.fragment,o),s=!0)},o(o){le(t.$$.fragment,o),s=!1},d(o){o&&m(l),u.d(o),Ae(t,o)}}}function Be(a){let e,l,t,n;return{c(){e=b("img"),this.h()},l(s){e=k(s,"IMG",{src:!0,alt:!0,class:!0}),this.h()},h(){H(e.src,l=a[0][a[1]])||r(e,"src",l),r(e,"alt","Image Gallery"),r(e,"class","svelte-1cvi287")},m(s,i){G(s,e,i),t||(n=F(e,"click",a[7]),t=!0)},p(s,i){i&3&&!H(e.src,l=s[0][s[1]])&&r(e,"src",l)},d(s){s&&m(e),t=!1,n()}}}function Se(a){let e,l;return{c(){e=b("video"),this.h()},l(t){e=k(t,"VIDEO",{src:!0,class:!0}),P(e).forEach(m),this.h()},h(){e.controls=!0,H(e.src,l=a[0][a[1]])||r(e,"src",l),r(e,"class","svelte-1cvi287")},m(t,n){G(t,e,n)},p(t,n){n&3&&!H(e.src,l=t[0][t[1]])&&r(e,"src",l)},d(t){t&&m(e)}}}function Oe(a){let e,l;return{c(){e=b("img"),this.h()},l(t){e=k(t,"IMG",{class:!0,src:!0,alt:!0}),this.h()},h(){r(e,"class","modal-image svelte-1cvi287"),H(e.src,l=a[0][a[1]])||r(e,"src",l),r(e,"alt","Image Gallery")},m(t,n){G(t,e,n)},p(t,n){n&3&&!H(e.src,l=t[0][t[1]])&&r(e,"src",l)},d(t){t&&m(e)}}}function je(a){let e,l;return{c(){e=b("video"),this.h()},l(t){e=k(t,"VIDEO",{src:!0,class:!0}),P(e).forEach(m),this.h()},h(){e.controls=!0,H(e.src,l=a[0][a[1]])||r(e,"src",l),r(e,"class","svelte-1cvi287")},m(t,n){G(t,e,n)},p(t,n){n&3&&!H(e.src,l=t[0][t[1]])&&r(e,"src",l)},d(t){t&&m(e)}}}function He(a){let e,l;function t(i,c){return c&3&&(e=null),e==null&&(e=!!i[0][i[1]].includes("mp4")),e?je:Oe}let n=t(a,-1),s=n(a);return{c(){s.c(),l=te()},l(i){s.l(i),l=te()},m(i,c){s.m(i,c),G(i,l,c)},p(i,c){n===(n=t(i,c))&&s?s.p(i,c):(s.d(1),s=n(i),s&&(s.c(),s.m(l.parentNode,l)))},d(i){i&&m(l),s.d(i)}}}function fe(a){let e,l=a[1]+1+"",t,n,s=a[0].length+"",i;return{c(){e=b("p"),t=X(l),n=X("/"),i=X(s),this.h()},l(c){e=k(c,"P",{class:!0});var u=P(e);t=Y(u,l),n=Y(u,"/"),i=Y(u,s),u.forEach(m),this.h()},h(){r(e,"class","svelte-1cvi287")},m(c,u){G(c,e,u),h(e,t),h(e,n),h(e,i)},p(c,u){u&2&&l!==(l=c[1]+1+"")&&J(t,l),u&1&&s!==(s=c[0].length+"")&&J(i,s)},d(c){c&&m(e)}}}function Le(a){let e,l,t,n,s,i,c,u,T="arrow_back",d,o,g,M,v,p,R="arrow_forward",z,C,A,L;const q=[Ne,Re],D=[];function O(y,E){return y[0].length>0?0:1}t=O(a),n=D[t]=q[t](a);let w=a[0].length>0&&fe(a);return{c(){e=b("div"),l=b("div"),n.c(),s=B(),i=b("div"),c=b("button"),u=b("span"),u.textContent=T,o=B(),g=b("div"),w&&w.c(),M=B(),v=b("button"),p=b("span"),p.textContent=R,this.h()},l(y){e=k(y,"DIV",{class:!0});var E=P(e);l=k(E,"DIV",{class:!0});var N=P(l);n.l(N),N.forEach(m),s=S(E),i=k(E,"DIV",{class:!0});var V=P(i);c=k(V,"BUTTON",{class:!0});var f=P(c);u=k(f,"SPAN",{class:!0,"data-svelte-h":!0}),Q(u)!=="svelte-8i2ihc"&&(u.textContent=T),f.forEach(m),o=S(V),g=k(V,"DIV",{class:!0});var I=P(g);w&&w.l(I),I.forEach(m),M=S(V),v=k(V,"BUTTON",{class:!0});var _=P(v);p=k(_,"SPAN",{class:!0,"data-svelte-h":!0}),Q(p)!=="svelte-jcdo4c"&&(p.textContent=R),_.forEach(m),V.forEach(m),E.forEach(m),this.h()},h(){r(l,"class","image-container svelte-1cvi287"),r(u,"class","material-symbols-outlined"),c.disabled=d=a[0].length===0,r(c,"class","svelte-1cvi287"),r(g,"class","indicator svelte-1cvi287"),r(p,"class","material-symbols-outlined"),v.disabled=z=a[0].length===0,r(v,"class","svelte-1cvi287"),r(i,"class","controls svelte-1cvi287"),r(e,"class","gallery svelte-1cvi287")},m(y,E){G(y,e,E),h(e,l),D[t].m(l,null),h(e,s),h(e,i),h(i,c),h(c,u),h(i,o),h(i,g),w&&w.m(g,null),h(i,M),h(i,v),h(v,p),C=!0,A||(L=[F(c,"click",a[4]),F(v,"click",a[3]),F(e,"touchstart",a[5]),F(e,"touchmove",qe),F(e,"touchend",a[6])],A=!0)},p(y,[E]){let N=t;t=O(y),t===N?D[t].p(y,E):(Me(),le(D[N],1,1,()=>{D[N]=null}),Ce(),n=D[t],n?n.p(y,E):(n=D[t]=q[t](y),n.c()),ae(n,1),n.m(l,null)),(!C||E&1&&d!==(d=y[0].length===0))&&(c.disabled=d),y[0].length>0?w?w.p(y,E):(w=fe(y),w.c(),w.m(g,null)):w&&(w.d(1),w=null),(!C||E&1&&z!==(z=y[0].length===0))&&(v.disabled=z)},i(y){C||(ae(n),C=!0)},o(y){le(n),C=!1},d(y){y&&m(e),D[t].d(),w&&w.d(),A=!1,ge(L)}}}let Ue=50,Xe=160,Ye=500;function qe(a){a.preventDefault()}function Fe(a,e,l){let{images:t=[]}=e,n=0,s=!1;function i(){l(1,n=(n+1)%t.length)}function c(){l(1,n=(n-1+t.length)%t.length)}let u,T,d,o,g;function M(z){let C=z.changedTouches[0];d=0,u=C.pageX,T=C.pageY,g=new Date().getTime()}function v(z){let C=z.changedTouches[0];d=C.pageX-u,o=new Date().getTime()-g,o<=Ye&&Math.abs(d)>=Ue&&Math.abs(C.pageY-T)<=Xe&&(d>0?c():i())}const p=()=>l(2,s=!s);function R(z){s=z,l(2,s)}return a.$$set=z=>{"images"in z&&l(0,t=z.images)},[t,n,s,i,c,M,v,p,R]}class tt extends se{constructor(e){super(),ie(this,e,Fe,Le,ne,{images:0})}}function he(a,e,l){const t=a.slice();return t[7]=e[l],t}function me(a,e,l){const t=a.slice();return t[10]=e[l],t}function de(a){let e,l=a[10]+"",t;return{c(){e=b("li"),t=X(l),this.h()},l(n){e=k(n,"LI",{class:!0});var s=P(e);t=Y(s,l),s.forEach(m),this.h()},h(){r(e,"class","svelte-96zic1")},m(n,s){G(n,e,s),h(e,t)},p(n,s){s&2&&l!==(l=n[10]+"")&&J(t,l)},d(n){n&&m(e)}}}function _e(a){let e,l=a[7]+"",t;return{c(){e=b("li"),t=X(l),this.h()},l(n){e=k(n,"LI",{class:!0});var s=P(e);t=Y(s,l),s.forEach(m),this.h()},h(){r(e,"class","svelte-96zic1")},m(n,s){G(n,e,s),h(e,t)},p(n,s){s&4&&l!==(l=n[7]+"")&&J(t,l)},d(n){n&&m(e)}}}function Je(a){let e,l,t,n,s,i,c,u="Pros",T,d,o,g,M,v="Cons",p,R,z,C,A,L,q,D,O=ee(a[1]),w=[];for(let f=0;f<O.length;f+=1)w[f]=de(me(a,O,f));let y=ee(a[2]),E=[];for(let f=0;f<y.length;f+=1)E[f]=_e(he(a,y,f));const N=a[6].default,V=be(N,a,a[5],null);return{c(){e=b("div"),l=b("div"),t=b("span"),n=X(a[0]),s=B(),i=b("div"),c=b("h3"),c.textContent=u,T=B(),d=b("ul");for(let f=0;f<w.length;f+=1)w[f].c();o=B(),g=b("div"),M=b("h3"),M.textContent=v,p=B(),R=b("ul");for(let f=0;f<E.length;f+=1)E[f].c();z=B(),C=b("div"),A=b("h2"),L=X(a[3]),q=B(),V&&V.c(),this.h()},l(f){e=k(f,"DIV",{class:!0});var I=P(e);l=k(I,"DIV",{class:!0,style:!0});var _=P(l);t=k(_,"SPAN",{});var j=P(t);n=Y(j,a[0]),j.forEach(m),_.forEach(m),s=S(I),i=k(I,"DIV",{class:!0});var W=P(i);c=k(W,"H3",{class:!0,"data-svelte-h":!0}),Q(c)!=="svelte-16fmi0k"&&(c.textContent=u),T=S(W),d=k(W,"UL",{});var oe=P(d);for(let U=0;U<w.length;U+=1)w[U].l(oe);oe.forEach(m),W.forEach(m),o=S(I),g=k(I,"DIV",{class:!0});var Z=P(g);M=k(Z,"H3",{class:!0,"data-svelte-h":!0}),Q(M)!=="svelte-67r87p"&&(M.textContent=v),p=S(Z),R=k(Z,"UL",{});var re=P(R);for(let U=0;U<E.length;U+=1)E[U].l(re);re.forEach(m),Z.forEach(m),z=S(I),C=k(I,"DIV",{class:!0});var $=P(C);A=k($,"H2",{style:!0,class:!0});var ce=P(A);L=Y(ce,a[3]),ce.forEach(m),q=S($),V&&V.l($),$.forEach(m),I.forEach(m),this.h()},h(){r(l,"class","grade svelte-96zic1"),x(l,"background-color",a[4]),r(c,"class","svelte-96zic1"),r(i,"class","pros svelte-96zic1"),r(M,"class","svelte-96zic1"),r(g,"class","cons svelte-96zic1"),x(A,"color",a[4]),r(A,"class","svelte-96zic1"),r(C,"class","final-comment svelte-96zic1"),r(e,"class","container svelte-96zic1")},m(f,I){G(f,e,I),h(e,l),h(l,t),h(t,n),h(e,s),h(e,i),h(i,c),h(i,T),h(i,d);for(let _=0;_<w.length;_+=1)w[_]&&w[_].m(d,null);h(e,o),h(e,g),h(g,M),h(g,p),h(g,R);for(let _=0;_<E.length;_+=1)E[_]&&E[_].m(R,null);h(e,z),h(e,C),h(C,A),h(A,L),h(C,q),V&&V.m(C,null),D=!0},p(f,[I]){if((!D||I&1)&&J(n,f[0]),(!D||I&16)&&x(l,"background-color",f[4]),I&2){O=ee(f[1]);let _;for(_=0;_<O.length;_+=1){const j=me(f,O,_);w[_]?w[_].p(j,I):(w[_]=de(j),w[_].c(),w[_].m(d,null))}for(;_<w.length;_+=1)w[_].d(1);w.length=O.length}if(I&4){y=ee(f[2]);let _;for(_=0;_<y.length;_+=1){const j=he(f,y,_);E[_]?E[_].p(j,I):(E[_]=_e(j),E[_].c(),E[_].m(R,null))}for(;_<E.length;_+=1)E[_].d(1);E.length=y.length}(!D||I&8)&&J(L,f[3]),(!D||I&16)&&x(A,"color",f[4]),V&&V.p&&(!D||I&32)&&ke(V,N,f,f[5],D?Ee(N,f[5],I,null):we(f[5]),null)},i(f){D||(ae(V,f),D=!0)},o(f){le(V,f),D=!1},d(f){f&&m(e),ue(w,f),ue(E,f),V&&V.d(f)}}}function Ke(a,e,l){let t,{$$slots:n={},$$scope:s}=e,{grade:i=0}=e,{pros:c=[]}=e,{cons:u=[]}=e,{title:T=""}=e;return a.$$set=d=>{"grade"in d&&l(0,i=d.grade),"pros"in d&&l(1,c=d.pros),"cons"in d&&l(2,u=d.cons),"title"in d&&l(3,T=d.title),"$$scope"in d&&l(5,s=d.$$scope)},a.$$.update=()=>{a.$$.dirty&1&&l(4,t=i<=4?"#cd674d":i<=7?"#ece7d5":"#e1d8aa")},[i,c,u,T,t,s,n]}class lt extends se{constructor(e){super(),ie(this,e,Ke,Je,ne,{grade:0,pros:1,cons:2,title:3})}}function Qe(a){let e,l,t,n,s,i,c,u,T,d,o,g=`
    <script type="application/ld+json">{
      "@context": "https://schema.org",
      "@type": "Review",
      "image": "${a[3]}",
      "itemReviewed": {
        "@type": "VideoGame",
        "name": "${a[2]}",
        "image": "${a[3]}",
        "author": "Platinum Games",
        "datePublished": "${a[7]}",
        "platform": "${a[6]}"
      },
      "author": {
        "@type": "Person",
        "name": "${a[1]}"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "${a[4]}",
        "bestRating": "10"
      },
      "publisher": {
        "@type": "Organization",
        "name": "${a[1]} Reviews"
      },
      "reviewBody": "${a[5]}"
    }
    <\/script>
  `,M;return document.title=e=a[0],{c(){l=b("meta"),t=b("meta"),n=b("meta"),s=b("meta"),i=b("meta"),c=b("meta"),u=b("meta"),T=b("meta"),d=b("meta"),o=new ye(!1),M=te(),this.h()},l(v){const p=Te("svelte-cxx2pn",document.head);l=k(p,"META",{name:!0,content:!0}),t=k(p,"META",{property:!0,content:!0}),n=k(p,"META",{property:!0,content:!0}),s=k(p,"META",{property:!0,content:!0}),i=k(p,"META",{property:!0,content:!0}),c=k(p,"META",{name:!0,content:!0}),u=k(p,"META",{name:!0,content:!0}),T=k(p,"META",{name:!0,content:!0}),d=k(p,"META",{name:!0,content:!0}),o=Ie(p,!1),M=te(),p.forEach(m),this.h()},h(){r(l,"name","description"),r(l,"content",a[5]),r(t,"property","og:title"),r(t,"content",a[0]),r(n,"property","og:description"),r(n,"content",a[5]),r(s,"property","og:type"),r(s,"content","review"),r(i,"property","og:image"),r(i,"content",a[3]),r(c,"name","twitter:card"),r(c,"content","summary_large_image"),r(u,"name","twitter:title"),r(u,"content",a[0]),r(T,"name","twitter:description"),r(T,"content",a[5]),r(d,"name","twitter:image"),r(d,"content",a[3]),o.a=M},m(v,p){h(document.head,l),h(document.head,t),h(document.head,n),h(document.head,s),h(document.head,i),h(document.head,c),h(document.head,u),h(document.head,T),h(document.head,d),o.m(g,document.head),h(document.head,M)},p(v,[p]){p&1&&e!==(e=v[0])&&(document.title=e),p&32&&r(l,"content",v[5]),p&1&&r(t,"content",v[0]),p&32&&r(n,"content",v[5]),p&8&&r(i,"content",v[3]),p&1&&r(u,"content",v[0]),p&32&&r(T,"content",v[5]),p&8&&r(d,"content",v[3]),p&254&&g!==(g=`
    <script type="application/ld+json">{
      "@context": "https://schema.org",
      "@type": "Review",
      "image": "${v[3]}",
      "itemReviewed": {
        "@type": "VideoGame",
        "name": "${v[2]}",
        "image": "${v[3]}",
        "author": "Platinum Games",
        "datePublished": "${v[7]}",
        "platform": "${v[6]}"
      },
      "author": {
        "@type": "Person",
        "name": "${v[1]}"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "${v[4]}",
        "bestRating": "10"
      },
      "publisher": {
        "@type": "Organization",
        "name": "${v[1]} Reviews"
      },
      "reviewBody": "${v[5]}"
    }
    <\/script>
  `)&&o.p(g)},i:K,o:K,d(v){v&&o.d(),m(l),m(t),m(n),m(s),m(i),m(c),m(u),m(T),m(d),m(M)}}}function We(a,e,l){let{title:t=""}=e,{author:n=""}=e,{gameName:s=""}=e,{gameImage:i=""}=e,{ratingValue:c=0}=e,{reviewBody:u=""}=e,{platform:T=""}=e,{datePublished:d=""}=e;return a.$$set=o=>{"title"in o&&l(0,t=o.title),"author"in o&&l(1,n=o.author),"gameName"in o&&l(2,s=o.gameName),"gameImage"in o&&l(3,i=o.gameImage),"ratingValue"in o&&l(4,c=o.ratingValue),"reviewBody"in o&&l(5,u=o.reviewBody),"platform"in o&&l(6,T=o.platform),"datePublished"in o&&l(7,d=o.datePublished)},[t,n,s,i,c,u,T,d]}class at extends se{constructor(e){super(),ie(this,e,We,Qe,ne,{title:0,author:1,gameName:2,gameImage:3,ratingValue:4,reviewBody:5,platform:6,datePublished:7})}}export{tt as G,at as S,lt as a};