import{s as re,a as T,f as z,c as B,g as w,h as C,d as b,j as k,i as N,r as $,M as le,l as I,m as L,n as U,G as se}from"../chunks/scheduler.eca58bb1.js";import{S as ae,i as oe,b as q,d as A,m as G,a as j,c as J,t as P,e as H,h as K,g as R}from"../chunks/index.4250a4ca.js";import{e as D}from"../chunks/each.c3b5ef73.js";import{f as W}from"../chunks/utils.b7b94089.js";import{t as ie}from"../chunks/config.2fe9a967.js";import{C as ne,B as ce}from"../chunks/CategoriesFilter.dd7a2b15.js";import{s as X}from"../chunks/index.5c25f273.js";import{S as fe}from"../chunks/SEO.1edd3e1a.js";async function ue({fetch:u}){return{progetti:await(await u("api/progetti")).json()}}const Se=Object.freeze(Object.defineProperty({__proto__:null,load:ue},Symbol.toStringTag,{value:"Module"}));function Y(u,e,s){const t=u.slice();return t[4]=e[s],t}function Z(u,e,s){const t=u.slice();return t[7]=e[s],t}function x(u){let e,s=u[7].toUpperCase()+"",t;return{c(){e=z("p"),t=I(s),this.h()},l(r){e=w(r,"P",{class:!0});var a=C(e);t=L(a,s),a.forEach(b),this.h()},h(){k(e,"class","tag svelte-1gn9eoy")},m(r,a){N(r,e,a),$(e,t)},p(r,a){a&2&&s!==(s=r[7].toUpperCase()+"")&&U(t,s)},d(r){r&&b(e)}}}function ee(u){let e,s,t=u[4].title+"",r,a,v,h,d=W(u[4].date)+"",E,o,y,n=u[4].description+"",l,f,g,i,S,O=D(u[4].categories),_=[];for(let c=0;c<O.length;c+=1)_[c]=x(Z(u,O,c));return{c(){e=z("li"),s=z("a"),r=I(t),v=T(),h=z("p"),E=I(d),o=T(),y=z("p"),l=I(n),f=T(),g=z("div");for(let c=0;c<_.length;c+=1)_[c].c();this.h()},l(c){e=w(c,"LI",{class:!0});var m=C(e);s=w(m,"A",{href:!0,class:!0});var p=C(s);r=L(p,t),p.forEach(b),v=B(m),h=w(m,"P",{class:!0});var F=C(h);E=L(F,d),F.forEach(b),o=B(m),y=w(m,"P",{class:!0});var Q=C(y);l=L(Q,n),Q.forEach(b),f=B(m),g=w(m,"DIV",{class:!0});var V=C(g);for(let M=0;M<_.length;M+=1)_[M].l(V);V.forEach(b),m.forEach(b),this.h()},h(){k(s,"href",a="progetti/"+u[4].slug),k(s,"class","title svelte-1gn9eoy"),k(h,"class","date svelte-1gn9eoy"),k(y,"class","description svelte-1gn9eoy"),k(g,"class","tags svelte-1gn9eoy"),k(e,"class","post svelte-1gn9eoy")},m(c,m){N(c,e,m),$(e,s),$(s,r),$(e,v),$(e,h),$(h,E),$(e,o),$(e,y),$(y,l),$(e,f),$(e,g);for(let p=0;p<_.length;p+=1)_[p]&&_[p].m(g,null);S=!0},p(c,m){if((!S||m&2)&&t!==(t=c[4].title+"")&&U(r,t),(!S||m&2&&a!==(a="progetti/"+c[4].slug))&&k(s,"href",a),(!S||m&2)&&d!==(d=W(c[4].date)+"")&&U(E,d),(!S||m&2)&&n!==(n=c[4].description+"")&&U(l,n),m&2){O=D(c[4].categories);let p;for(p=0;p<O.length;p+=1){const F=Z(c,O,p);_[p]?_[p].p(F,m):(_[p]=x(F),_[p].c(),_[p].m(g,null))}for(;p<_.length;p+=1)_[p].d(1);_.length=O.length}},i(c){S||(c&&se(()=>{S&&(i||(i=K(e,X,{},!0)),i.run(1))}),S=!0)},o(c){c&&(i||(i=K(e,X,{},!1)),i.run(0)),S=!1},d(c){c&&b(e),le(_,c),c&&i&&i.end()}}}function te(u){let e,s,t,r;return t=new ce({props:{size:"2em"}}),{c(){e=z("h1"),s=I("No project found "),q(t.$$.fragment),this.h()},l(a){e=w(a,"H1",{class:!0});var v=C(e);s=L(v,"No project found "),A(t.$$.fragment,v),v.forEach(b),this.h()},h(){k(e,"class","svelte-1gn9eoy")},m(a,v){N(a,e,v),$(e,s),G(t,e,null),r=!0},i(a){r||(j(t.$$.fragment,a),r=!0)},o(a){P(t.$$.fragment,a),r=!1},d(a){a&&b(e),H(t)}}}function he(u){let e,s,t,r,a,v,h,d;e=new fe({props:{title:ie,description:"La pagina che contiene tutti i miei progetti. Qui puoi trovare i progetti che ho realizzato, i progetti che sto realizzando e i progetti che realizzerò.",image:"https://i.imgur.com/juSgfgF.png"}});let E=D(u[1]),o=[];for(let l=0;l<E.length;l+=1)o[l]=ee(Y(u,E,l));const y=l=>P(o[l],1,1,()=>{o[l]=null});let n=u[1].length==0&&te();return h=new ne({props:{categories:u[0]}}),h.$on("filter",u[2]),{c(){q(e.$$.fragment),s=T(),t=z("section"),r=z("ul");for(let l=0;l<o.length;l+=1)o[l].c();a=T(),n&&n.c(),v=T(),q(h.$$.fragment),this.h()},l(l){A(e.$$.fragment,l),s=B(l),t=w(l,"SECTION",{class:!0});var f=C(t);r=w(f,"UL",{class:!0});var g=C(r);for(let i=0;i<o.length;i+=1)o[i].l(g);a=B(g),n&&n.l(g),g.forEach(b),v=B(f),A(h.$$.fragment,f),f.forEach(b),this.h()},h(){k(r,"class","posts"),k(t,"class","svelte-1gn9eoy")},m(l,f){G(e,l,f),N(l,s,f),N(l,t,f),$(t,r);for(let g=0;g<o.length;g+=1)o[g]&&o[g].m(r,null);$(r,a),n&&n.m(r,null),$(t,v),G(h,t,null),d=!0},p(l,[f]){if(f&2){E=D(l[1]);let i;for(i=0;i<E.length;i+=1){const S=Y(l,E,i);o[i]?(o[i].p(S,f),j(o[i],1)):(o[i]=ee(S),o[i].c(),j(o[i],1),o[i].m(r,a))}for(R(),i=E.length;i<o.length;i+=1)y(i);J()}l[1].length==0?n?f&2&&j(n,1):(n=te(),n.c(),j(n,1),n.m(r,null)):n&&(R(),P(n,1,1,()=>{n=null}),J());const g={};f&1&&(g.categories=l[0]),h.$set(g)},i(l){if(!d){j(e.$$.fragment,l);for(let f=0;f<E.length;f+=1)j(o[f]);j(n),j(h.$$.fragment,l),d=!0}},o(l){P(e.$$.fragment,l),o=o.filter(Boolean);for(let f=0;f<o.length;f+=1)P(o[f]);P(n),P(h.$$.fragment,l),d=!1},d(l){l&&(b(s),b(t)),H(e,l),le(o,l),n&&n.d(),H(h)}}}function ge(u,e,s){let{data:t}=e,r=[],a=t.progetti;t.progetti.forEach(h=>{h.categories.forEach(d=>{r.push(d)})}),r.sort(),r=[...new Set(r)];const v=h=>{let d=h.detail;if(d.length===0){s(1,a=t.progetti);return}s(1,a=t.progetti.filter(E=>{let o=E.categories,y=0;if(d.forEach(n=>{o.includes(n)&&y++}),y===d.length)return!0}))};return u.$$set=h=>{"data"in h&&s(3,t=h.data)},[r,a,v,t]}class ye extends ae{constructor(e){super(),oe(this,e,ge,he,re,{data:3})}}export{ye as component,Se as universal};