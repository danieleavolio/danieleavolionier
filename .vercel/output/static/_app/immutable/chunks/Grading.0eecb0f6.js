import{s as he,f as b,a as A,g as k,h as D,d as m,c as L,B as F,j as d,i as S,r as h,C as K,J as ve,l as Y,m as z,n as Q,u as le,p as ge,D as pe,K as B,e as oe,x as be,k as $,y as ke,z as Ee,A as Ce,M as ie}from"./scheduler.38e9bcec.js";import{S as de,i as me,g as Ie,t as ee,c as we,a as te,f as De,b as Me,d as Te,m as qe,e as ye}from"./index.fa6e9378.js";import{M as Ve}from"./Modal.b484dbeb.js";import{e as x}from"./each.ae5ef580.js";function Ge(a){let e,l="Qualcosa è andato stortissimo...";return{c(){e=b("p"),e.textContent=l},l(t){e=k(t,"P",{"data-svelte-h":!0}),F(e)!=="svelte-1m3e6e2"&&(e.textContent=l)},m(t,s){S(t,e,s)},p:le,i:le,o:le,d(t){t&&m(e)}}}function Ne(a){let e,l,t,s,n;function o(f,v){return v&3&&(e=null),e==null&&(e=!!f[0][f[1]].includes("mp4")),e?Pe:Se}let r=o(a,-1),u=r(a);function y(f){a[8](f)}let p={isSearch:!1,$$slots:{default:[Le]},$$scope:{ctx:a}};return a[2]!==void 0&&(p.showModal=a[2]),t=new Ve({props:p}),ge.push(()=>De(t,"showModal",y)),{c(){u.c(),l=A(),Me(t.$$.fragment)},l(f){u.l(f),l=L(f),Te(t.$$.fragment,f)},m(f,v){u.m(f,v),S(f,l,v),qe(t,f,v),n=!0},p(f,v){r===(r=o(f,v))&&u?u.p(f,v):(u.d(1),u=r(f),u&&(u.c(),u.m(l.parentNode,l)));const T={};v&16387&&(T.$$scope={dirty:v,ctx:f}),!s&&v&4&&(s=!0,T.showModal=f[2],pe(()=>s=!1)),t.$set(T)},i(f){n||(te(t.$$.fragment,f),n=!0)},o(f){ee(t.$$.fragment,f),n=!1},d(f){f&&m(l),u.d(f),ye(t,f)}}}function Se(a){let e,l,t,s;return{c(){e=b("img"),this.h()},l(n){e=k(n,"IMG",{src:!0,alt:!0,class:!0}),this.h()},h(){B(e.src,l=a[0][a[1]])||d(e,"src",l),d(e,"alt","Image Gallery"),d(e,"class","svelte-1cvi287")},m(n,o){S(n,e,o),t||(s=K(e,"click",a[7]),t=!0)},p(n,o){o&3&&!B(e.src,l=n[0][n[1]])&&d(e,"src",l)},d(n){n&&m(e),t=!1,s()}}}function Pe(a){let e,l;return{c(){e=b("video"),this.h()},l(t){e=k(t,"VIDEO",{src:!0,class:!0}),D(e).forEach(m),this.h()},h(){e.controls=!0,B(e.src,l=a[0][a[1]])||d(e,"src",l),d(e,"class","svelte-1cvi287")},m(t,s){S(t,e,s)},p(t,s){s&3&&!B(e.src,l=t[0][t[1]])&&d(e,"src",l)},d(t){t&&m(e)}}}function je(a){let e,l;return{c(){e=b("img"),this.h()},l(t){e=k(t,"IMG",{class:!0,src:!0,alt:!0}),this.h()},h(){d(e,"class","modal-image svelte-1cvi287"),B(e.src,l=a[0][a[1]])||d(e,"src",l),d(e,"alt","Image Gallery")},m(t,s){S(t,e,s)},p(t,s){s&3&&!B(e.src,l=t[0][t[1]])&&d(e,"src",l)},d(t){t&&m(e)}}}function Ae(a){let e,l;return{c(){e=b("video"),this.h()},l(t){e=k(t,"VIDEO",{src:!0,class:!0}),D(e).forEach(m),this.h()},h(){e.controls=!0,B(e.src,l=a[0][a[1]])||d(e,"src",l),d(e,"class","svelte-1cvi287")},m(t,s){S(t,e,s)},p(t,s){s&3&&!B(e.src,l=t[0][t[1]])&&d(e,"src",l)},d(t){t&&m(e)}}}function Le(a){let e,l;function t(o,r){return r&3&&(e=null),e==null&&(e=!!o[0][o[1]].includes("mp4")),e?Ae:je}let s=t(a,-1),n=s(a);return{c(){n.c(),l=oe()},l(o){n.l(o),l=oe()},m(o,r){n.m(o,r),S(o,l,r)},p(o,r){s===(s=t(o,r))&&n?n.p(o,r):(n.d(1),n=s(o),n&&(n.c(),n.m(l.parentNode,l)))},d(o){o&&m(l),n.d(o)}}}function re(a){let e,l=a[1]+1+"",t,s,n=a[0].length+"",o;return{c(){e=b("p"),t=Y(l),s=Y("/"),o=Y(n),this.h()},l(r){e=k(r,"P",{class:!0});var u=D(e);t=z(u,l),s=z(u,"/"),o=z(u,n),u.forEach(m),this.h()},h(){d(e,"class","svelte-1cvi287")},m(r,u){S(r,e,u),h(e,t),h(e,s),h(e,o)},p(r,u){u&2&&l!==(l=r[1]+1+"")&&Q(t,l),u&1&&n!==(n=r[0].length+"")&&Q(o,n)},d(r){r&&m(e)}}}function Oe(a){let e,l,t,s,n,o,r,u,y="arrow_back",p,f,v,T,V,G,P="arrow_forward",q,I,N,H;const J=[Ne,Ge],M=[];function O(E,g){return E[0].length>0?0:1}t=O(a),s=M[t]=J[t](a);let _=a[0].length>0&&re(a);return{c(){e=b("div"),l=b("div"),s.c(),n=A(),o=b("div"),r=b("button"),u=b("span"),u.textContent=y,f=A(),v=b("div"),_&&_.c(),T=A(),V=b("button"),G=b("span"),G.textContent=P,this.h()},l(E){e=k(E,"DIV",{class:!0});var g=D(e);l=k(g,"DIV",{class:!0});var j=D(l);s.l(j),j.forEach(m),n=L(g),o=k(g,"DIV",{class:!0});var w=D(o);r=k(w,"BUTTON",{class:!0});var i=D(r);u=k(i,"SPAN",{class:!0,"data-svelte-h":!0}),F(u)!=="svelte-8i2ihc"&&(u.textContent=y),i.forEach(m),f=L(w),v=k(w,"DIV",{class:!0});var C=D(v);_&&_.l(C),C.forEach(m),T=L(w),V=k(w,"BUTTON",{class:!0});var c=D(V);G=k(c,"SPAN",{class:!0,"data-svelte-h":!0}),F(G)!=="svelte-jcdo4c"&&(G.textContent=P),c.forEach(m),w.forEach(m),g.forEach(m),this.h()},h(){d(l,"class","image-container svelte-1cvi287"),d(u,"class","material-symbols-outlined"),r.disabled=p=a[0].length===0,d(r,"class","svelte-1cvi287"),d(v,"class","indicator svelte-1cvi287"),d(G,"class","material-symbols-outlined"),V.disabled=q=a[0].length===0,d(V,"class","svelte-1cvi287"),d(o,"class","controls svelte-1cvi287"),d(e,"class","gallery svelte-1cvi287")},m(E,g){S(E,e,g),h(e,l),M[t].m(l,null),h(e,n),h(e,o),h(o,r),h(r,u),h(o,f),h(o,v),_&&_.m(v,null),h(o,T),h(o,V),h(V,G),I=!0,N||(H=[K(r,"click",a[4]),K(V,"click",a[3]),K(e,"touchstart",a[5]),K(e,"touchmove",Xe),K(e,"touchend",a[6])],N=!0)},p(E,[g]){let j=t;t=O(E),t===j?M[t].p(E,g):(Ie(),ee(M[j],1,1,()=>{M[j]=null}),we(),s=M[t],s?s.p(E,g):(s=M[t]=J[t](E),s.c()),te(s,1),s.m(l,null)),(!I||g&1&&p!==(p=E[0].length===0))&&(r.disabled=p),E[0].length>0?_?_.p(E,g):(_=re(E),_.c(),_.m(v,null)):_&&(_.d(1),_=null),(!I||g&1&&q!==(q=E[0].length===0))&&(V.disabled=q)},i(E){I||(te(s),I=!0)},o(E){ee(s),I=!1},d(E){E&&m(e),M[t].d(),_&&_.d(),N=!1,ve(H)}}}let Ue=50,Be=160,He=500;function Xe(a){a.preventDefault()}function Ye(a,e,l){let{images:t=[]}=e,s=0,n=!1;function o(){l(1,s=(s+1)%t.length)}function r(){l(1,s=(s-1+t.length)%t.length)}let u,y,p,f,v;function T(q){let I=q.changedTouches[0];p=0,u=I.pageX,y=I.pageY,v=new Date().getTime()}function V(q){let I=q.changedTouches[0];p=I.pageX-u,f=new Date().getTime()-v,f<=He&&Math.abs(p)>=Ue&&Math.abs(I.pageY-y)<=Be&&(p>0?r():o())}const G=()=>l(2,n=!n);function P(q){n=q,l(2,n)}return a.$$set=q=>{"images"in q&&l(0,t=q.images)},[t,s,n,o,r,T,V,G,P]}class We extends de{constructor(e){super(),me(this,e,Ye,Oe,he,{images:0})}}function ce(a,e,l){const t=a.slice();return t[7]=e[l],t}function ue(a,e,l){const t=a.slice();return t[10]=e[l],t}function fe(a){let e,l=a[10]+"",t;return{c(){e=b("li"),t=Y(l),this.h()},l(s){e=k(s,"LI",{class:!0});var n=D(e);t=z(n,l),n.forEach(m),this.h()},h(){d(e,"class","svelte-xm0bgq")},m(s,n){S(s,e,n),h(e,t)},p(s,n){n&2&&l!==(l=s[10]+"")&&Q(t,l)},d(s){s&&m(e)}}}function _e(a){let e,l=a[7]+"",t;return{c(){e=b("li"),t=Y(l),this.h()},l(s){e=k(s,"LI",{class:!0});var n=D(e);t=z(n,l),n.forEach(m),this.h()},h(){d(e,"class","svelte-xm0bgq")},m(s,n){S(s,e,n),h(e,t)},p(s,n){n&4&&l!==(l=s[7]+"")&&Q(t,l)},d(s){s&&m(e)}}}function ze(a){let e,l,t,s,n,o,r,u="Pros",y,p,f,v,T,V="Cons",G,P,q,I,N,H,J,M,O=x(a[1]),_=[];for(let i=0;i<O.length;i+=1)_[i]=fe(ue(a,O,i));let E=x(a[2]),g=[];for(let i=0;i<E.length;i+=1)g[i]=_e(ce(a,E,i));const j=a[6].default,w=be(j,a,a[5],null);return{c(){e=b("div"),l=b("div"),t=b("span"),s=Y(a[0]),n=A(),o=b("div"),r=b("h3"),r.textContent=u,y=A(),p=b("ul");for(let i=0;i<_.length;i+=1)_[i].c();f=A(),v=b("div"),T=b("h3"),T.textContent=V,G=A(),P=b("ul");for(let i=0;i<g.length;i+=1)g[i].c();q=A(),I=b("div"),N=b("h2"),H=Y(a[3]),J=A(),w&&w.c(),this.h()},l(i){e=k(i,"DIV",{class:!0});var C=D(e);l=k(C,"DIV",{class:!0,style:!0});var c=D(l);t=k(c,"SPAN",{});var U=D(t);s=z(U,a[0]),U.forEach(m),c.forEach(m),n=L(C),o=k(C,"DIV",{class:!0});var R=D(o);r=k(R,"H3",{class:!0,"data-svelte-h":!0}),F(r)!=="svelte-16fmi0k"&&(r.textContent=u),y=L(R),p=k(R,"UL",{});var se=D(p);for(let X=0;X<_.length;X+=1)_[X].l(se);se.forEach(m),R.forEach(m),f=L(C),v=k(C,"DIV",{class:!0});var W=D(v);T=k(W,"H3",{class:!0,"data-svelte-h":!0}),F(T)!=="svelte-67r87p"&&(T.textContent=V),G=L(W),P=k(W,"UL",{});var ae=D(P);for(let X=0;X<g.length;X+=1)g[X].l(ae);ae.forEach(m),W.forEach(m),q=L(C),I=k(C,"DIV",{class:!0});var Z=D(I);N=k(Z,"H2",{style:!0,class:!0});var ne=D(N);H=z(ne,a[3]),ne.forEach(m),J=L(Z),w&&w.l(Z),Z.forEach(m),C.forEach(m),this.h()},h(){d(l,"class","grade svelte-xm0bgq"),$(l,"background-color",a[4]),d(r,"class","svelte-xm0bgq"),d(o,"class","pros svelte-xm0bgq"),d(T,"class","svelte-xm0bgq"),d(v,"class","cons svelte-xm0bgq"),$(N,"color",a[4]),d(N,"class","svelte-xm0bgq"),d(I,"class","final-comment svelte-xm0bgq"),d(e,"class","container svelte-xm0bgq")},m(i,C){S(i,e,C),h(e,l),h(l,t),h(t,s),h(e,n),h(e,o),h(o,r),h(o,y),h(o,p);for(let c=0;c<_.length;c+=1)_[c]&&_[c].m(p,null);h(e,f),h(e,v),h(v,T),h(v,G),h(v,P);for(let c=0;c<g.length;c+=1)g[c]&&g[c].m(P,null);h(e,q),h(e,I),h(I,N),h(N,H),h(I,J),w&&w.m(I,null),M=!0},p(i,[C]){if((!M||C&1)&&Q(s,i[0]),(!M||C&16)&&$(l,"background-color",i[4]),C&2){O=x(i[1]);let c;for(c=0;c<O.length;c+=1){const U=ue(i,O,c);_[c]?_[c].p(U,C):(_[c]=fe(U),_[c].c(),_[c].m(p,null))}for(;c<_.length;c+=1)_[c].d(1);_.length=O.length}if(C&4){E=x(i[2]);let c;for(c=0;c<E.length;c+=1){const U=ce(i,E,c);g[c]?g[c].p(U,C):(g[c]=_e(U),g[c].c(),g[c].m(P,null))}for(;c<g.length;c+=1)g[c].d(1);g.length=E.length}(!M||C&8)&&Q(H,i[3]),(!M||C&16)&&$(N,"color",i[4]),w&&w.p&&(!M||C&32)&&ke(w,j,i,i[5],M?Ce(j,i[5],C,null):Ee(i[5]),null)},i(i){M||(te(w,i),M=!0)},o(i){ee(w,i),M=!1},d(i){i&&m(e),ie(_,i),ie(g,i),w&&w.d(i)}}}function Je(a,e,l){let t,{$$slots:s={},$$scope:n}=e,{grade:o=0}=e,{pros:r=[]}=e,{cons:u=[]}=e,{title:y=""}=e;return a.$$set=p=>{"grade"in p&&l(0,o=p.grade),"pros"in p&&l(1,r=p.pros),"cons"in p&&l(2,u=p.cons),"title"in p&&l(3,y=p.title),"$$scope"in p&&l(5,n=p.$$scope)},a.$$.update=()=>{a.$$.dirty&1&&l(4,t=o<=4?"#cd674d":o<=7?"#ece7d5":"#e1d8aa")},[o,r,u,y,t,n,s]}class Ze extends de{constructor(e){super(),me(this,e,Je,ze,he,{grade:0,pros:1,cons:2,title:3})}}export{We as G,Ze as a};