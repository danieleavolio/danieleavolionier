import{s as ae,a as y,f as O,O as re,d as v,c as z,g as P,h as B,j as w,i as F,r as E,M as le,l as L,m as N,n as U,G as oe}from"../chunks/scheduler.eca58bb1.js";import{S as ie,i as ne,b as M,d as q,m as G,a as j,c as J,t as T,e as H,h as K,g as R}from"../chunks/index.4250a4ca.js";import{e as A}from"../chunks/each.c3b5ef73.js";import{C as ce,B as fe}from"../chunks/CategoriesFilter.dd7a2b15.js";import{t as W}from"../chunks/config.2fe9a967.js";import{f as X}from"../chunks/utils.b7b94089.js";import{s as Y}from"../chunks/index.5c25f273.js";import{S as ue}from"../chunks/SEO.1edd3e1a.js";async function he({fetch:u}){return{posts:await(await u("api/posts")).json()}}const ke=Object.freeze(Object.defineProperty({__proto__:null,load:he},Symbol.toStringTag,{value:"Module"}));function Z(u,e,l){const s=u.slice();return s[5]=e[l],s[7]=l,s}function x(u,e,l){const s=u.slice();return s[8]=e[l],s}function ee(u){let e,l=u[8].toUpperCase()+"",s;return{c(){e=O("p"),s=L(l),this.h()},l(r){e=P(r,"P",{class:!0});var a=B(e);s=N(a,l),a.forEach(v),this.h()},h(){w(e,"class","tag svelte-150g7vt")},m(r,a){F(r,e,a),E(e,s)},p(r,a){a&2&&l!==(l=r[8].toUpperCase()+"")&&U(s,l)},d(r){r&&v(e)}}}function te(u){let e,l,s=u[5].title+"",r,a,_,k,h=X(u[5].date)+"",$,b,o,C=u[5].description+"",c,t,f,p,i,S=A(u[5].categories),m=[];for(let n=0;n<S.length;n+=1)m[n]=ee(x(u,S,n));return{c(){e=O("li"),l=O("a"),r=L(s),_=y(),k=O("p"),$=L(h),b=y(),o=O("p"),c=L(C),t=y(),f=O("div");for(let n=0;n<m.length;n+=1)m[n].c();this.h()},l(n){e=P(n,"LI",{class:!0});var d=B(e);l=P(d,"A",{href:!0,class:!0});var g=B(l);r=N(g,s),g.forEach(v),_=z(d),k=P(d,"P",{class:!0});var I=B(k);$=N(I,h),I.forEach(v),b=z(d),o=P(d,"P",{class:!0});var Q=B(o);c=N(Q,C),Q.forEach(v),t=z(d),f=P(d,"DIV",{class:!0});var V=B(f);for(let D=0;D<m.length;D+=1)m[D].l(V);V.forEach(v),d.forEach(v),this.h()},h(){w(l,"href",a="pagine/"+u[5].slug),w(l,"class","title svelte-150g7vt"),w(k,"class","date svelte-150g7vt"),w(o,"class","description svelte-150g7vt"),w(f,"class","tags svelte-150g7vt"),w(e,"class","post svelte-150g7vt")},m(n,d){F(n,e,d),E(e,l),E(l,r),E(e,_),E(e,k),E(k,$),E(e,b),E(e,o),E(o,c),E(e,t),E(e,f);for(let g=0;g<m.length;g+=1)m[g]&&m[g].m(f,null);i=!0},p(n,d){if((!i||d&2)&&s!==(s=n[5].title+"")&&U(r,s),(!i||d&2&&a!==(a="pagine/"+n[5].slug))&&w(l,"href",a),(!i||d&2)&&h!==(h=X(n[5].date)+"")&&U($,h),(!i||d&2)&&C!==(C=n[5].description+"")&&U(c,C),d&2){S=A(n[5].categories);let g;for(g=0;g<S.length;g+=1){const I=x(n,S,g);m[g]?m[g].p(I,d):(m[g]=ee(I),m[g].c(),m[g].m(f,null))}for(;g<m.length;g+=1)m[g].d(1);m.length=S.length}},i(n){i||(n&&oe(()=>{i&&(p||(p=K(e,Y,{},!0)),p.run(1))}),i=!0)},o(n){n&&(p||(p=K(e,Y,{},!1)),p.run(0)),i=!1},d(n){n&&v(e),le(m,n),n&&p&&p.end()}}}function se(u){let e,l,s,r;return s=new fe({props:{size:"2em"}}),{c(){e=O("h1"),l=L("No post found "),M(s.$$.fragment),this.h()},l(a){e=P(a,"H1",{class:!0});var _=B(e);l=N(_,"No post found "),q(s.$$.fragment,_),_.forEach(v),this.h()},h(){w(e,"class","svelte-150g7vt")},m(a,_){F(a,e,_),E(e,l),G(s,e,null),r=!0},i(a){r||(j(s.$$.fragment,a),r=!0)},o(a){T(s.$$.fragment,a),r=!1},d(a){a&&v(e),H(s)}}}function pe(u){let e,l,s,r,a,_,k,h,$;document.title=W+" Blog",l=new ue({props:{title:W,description:"La pagina dei post del blog. Qui potete trovare tutti i post scritti da me medesimo su vari argomenti che vanno dalla programmazione, alle recensioni di videogiochi e fino ad aggiornamenti generici sulla mia vita.",image:"https://i.imgur.com/juSgfgF.png",isArticle:!1}});let b=A(u[1]),o=[];for(let t=0;t<b.length;t+=1)o[t]=te(Z(u,b,t));const C=t=>T(o[t],1,1,()=>{o[t]=null});let c=u[1].length==0&&se();return h=new ce({props:{categories:u[0]}}),h.$on("filter",u[4]),{c(){e=y(),M(l.$$.fragment),s=y(),r=O("section"),a=O("ul");for(let t=0;t<o.length;t+=1)o[t].c();_=y(),c&&c.c(),k=y(),M(h.$$.fragment),this.h()},l(t){re("svelte-2y4ip6",document.head).forEach(v),e=z(t),q(l.$$.fragment,t),s=z(t),r=P(t,"SECTION",{class:!0});var p=B(r);a=P(p,"UL",{class:!0});var i=B(a);for(let S=0;S<o.length;S+=1)o[S].l(i);_=z(i),c&&c.l(i),i.forEach(v),k=z(p),q(h.$$.fragment,p),p.forEach(v),this.h()},h(){w(a,"class","posts"),w(r,"class","svelte-150g7vt")},m(t,f){F(t,e,f),G(l,t,f),F(t,s,f),F(t,r,f),E(r,a);for(let p=0;p<o.length;p+=1)o[p]&&o[p].m(a,null);E(a,_),c&&c.m(a,null),E(r,k),G(h,r,null),$=!0},p(t,[f]){if(f&2){b=A(t[1]);let i;for(i=0;i<b.length;i+=1){const S=Z(t,b,i);o[i]?(o[i].p(S,f),j(o[i],1)):(o[i]=te(S),o[i].c(),j(o[i],1),o[i].m(a,_))}for(R(),i=b.length;i<o.length;i+=1)C(i);J()}t[1].length==0?c?f&2&&j(c,1):(c=se(),c.c(),j(c,1),c.m(a,null)):c&&(R(),T(c,1,1,()=>{c=null}),J());const p={};f&1&&(p.categories=t[0]),h.$set(p)},i(t){if(!$){j(l.$$.fragment,t);for(let f=0;f<b.length;f+=1)j(o[f]);j(c),j(h.$$.fragment,t),$=!0}},o(t){T(l.$$.fragment,t),o=o.filter(Boolean);for(let f=0;f<o.length;f+=1)T(o[f]);T(c),T(h.$$.fragment,t),$=!1},d(t){t&&(v(e),v(s),v(r)),H(l,t),le(o,t),c&&c.d(),H(h)}}}function ge(u,e,l){let{data:s}=e,r=[],a=s.posts;s.posts.forEach(h=>{h.categories.forEach($=>{r.push($)})}),r.sort(),r=[...new Set(r)];const _=h=>{let $=h.detail;if($.length===0){l(1,a=s.posts);return}l(1,a=s.posts.filter(b=>{let o=b.categories,C=0;if($.forEach(c=>{o.includes(c)&&C++}),C===$.length)return!0}))},k=h=>_(h);return u.$$set=h=>{"data"in h&&l(3,s=h.data)},[r,a,_,s,k]}class we extends ie{constructor(e){super(),ne(this,e,ge,pe,ae,{data:3})}}export{we as component,ke as universal};