import{s as le,a as I,f as w,H as ae,d as $,c as N,g as C,h as B,j as k,i as D,r as E,J as Z,l as U,m as z,n as F,B as re}from"../chunks/scheduler.69ed1edc.js";import{S as oe,i as ne,b as x,d as ee,m as te,a as P,c as J,t as y,e as se,f as M,g as V}from"../chunks/index.7977ad0e.js";import{e as H}from"../chunks/each.e59479a4.js";import{C as ie,B as ce}from"../chunks/CategoriesFilter.6d73c416.js";import{t as fe}from"../chunks/config.2fe9a967.js";import{f as G}from"../chunks/utils.b7b94089.js";import{s as K}from"../chunks/index.de1b60e2.js";async function he({fetch:f}){return{posts:await(await f("api/posts")).json()}}const be=Object.freeze(Object.defineProperty({__proto__:null,load:he},Symbol.toStringTag,{value:"Module"}));function Q(f,e,s){const t=f.slice();return t[5]=e[s],t[7]=s,t}function R(f,e,s){const t=f.slice();return t[8]=e[s],t}function W(f){let e,s=f[8].toUpperCase()+"",t;return{c(){e=w("p"),t=U(s),this.h()},l(o){e=C(o,"P",{class:!0});var r=B(e);t=z(r,s),r.forEach($),this.h()},h(){k(e,"class","tag svelte-150g7vt")},m(o,r){D(o,e,r),E(e,t)},p(o,r){r&2&&s!==(s=o[8].toUpperCase()+"")&&F(t,s)},d(o){o&&$(e)}}}function X(f){let e,s,t=f[5].title+"",o,r,u,b,_=G(f[5].date)+"",a,j,n,l=f[5].description+"",h,d,i,v,S,T=H(f[5].categories),g=[];for(let c=0;c<T.length;c+=1)g[c]=W(R(f,T,c));return{c(){e=w("li"),s=w("a"),o=U(t),u=I(),b=w("p"),a=U(_),j=I(),n=w("p"),h=U(l),d=I(),i=w("div");for(let c=0;c<g.length;c+=1)g[c].c();this.h()},l(c){e=C(c,"LI",{class:!0});var m=B(e);s=C(m,"A",{href:!0,class:!0});var p=B(s);o=z(p,t),p.forEach($),u=N(m),b=C(m,"P",{class:!0});var O=B(b);a=z(O,_),O.forEach($),j=N(m),n=C(m,"P",{class:!0});var q=B(n);h=z(q,l),q.forEach($),d=N(m),i=C(m,"DIV",{class:!0});var A=B(i);for(let L=0;L<g.length;L+=1)g[L].l(A);A.forEach($),m.forEach($),this.h()},h(){k(s,"href",r="pagine/"+f[5].slug),k(s,"class","title svelte-150g7vt"),k(b,"class","date svelte-150g7vt"),k(n,"class","description svelte-150g7vt"),k(i,"class","tags svelte-150g7vt"),k(e,"class","post svelte-150g7vt")},m(c,m){D(c,e,m),E(e,s),E(s,o),E(e,u),E(e,b),E(b,a),E(e,j),E(e,n),E(n,h),E(e,d),E(e,i);for(let p=0;p<g.length;p+=1)g[p]&&g[p].m(i,null);S=!0},p(c,m){if((!S||m&2)&&t!==(t=c[5].title+"")&&F(o,t),(!S||m&2&&r!==(r="pagine/"+c[5].slug))&&k(s,"href",r),(!S||m&2)&&_!==(_=G(c[5].date)+"")&&F(a,_),(!S||m&2)&&l!==(l=c[5].description+"")&&F(h,l),m&2){T=H(c[5].categories);let p;for(p=0;p<T.length;p+=1){const O=R(c,T,p);g[p]?g[p].p(O,m):(g[p]=W(O),g[p].c(),g[p].m(i,null))}for(;p<g.length;p+=1)g[p].d(1);g.length=T.length}},i(c){S||(c&&re(()=>{S&&(v||(v=M(e,K,{},!0)),v.run(1))}),S=!0)},o(c){c&&(v||(v=M(e,K,{},!1)),v.run(0)),S=!1},d(c){c&&$(e),Z(g,c),c&&v&&v.end()}}}function Y(f){let e,s,t,o;return t=new ce({props:{size:"2em"}}),{c(){e=w("h1"),s=U("No post found "),x(t.$$.fragment),this.h()},l(r){e=C(r,"H1",{class:!0});var u=B(e);s=z(u,"No post found "),ee(t.$$.fragment,u),u.forEach($),this.h()},h(){k(e,"class","svelte-150g7vt")},m(r,u){D(r,e,u),E(e,s),te(t,e,null),o=!0},i(r){o||(P(t.$$.fragment,r),o=!0)},o(r){y(t.$$.fragment,r),o=!1},d(r){r&&$(e),se(t)}}}function ue(f){let e,s,t,o,r,u,b;document.title=fe+" Blog";let _=H(f[1]),a=[];for(let l=0;l<_.length;l+=1)a[l]=X(Q(f,_,l));const j=l=>y(a[l],1,1,()=>{a[l]=null});let n=f[1].length==0&&Y();return u=new ie({props:{categories:f[0]}}),u.$on("filter",f[4]),{c(){e=I(),s=w("section"),t=w("ul");for(let l=0;l<a.length;l+=1)a[l].c();o=I(),n&&n.c(),r=I(),x(u.$$.fragment),this.h()},l(l){ae("svelte-2y4ip6",document.head).forEach($),e=N(l),s=C(l,"SECTION",{class:!0});var d=B(s);t=C(d,"UL",{class:!0});var i=B(t);for(let v=0;v<a.length;v+=1)a[v].l(i);o=N(i),n&&n.l(i),i.forEach($),r=N(d),ee(u.$$.fragment,d),d.forEach($),this.h()},h(){k(t,"class","posts"),k(s,"class","svelte-150g7vt")},m(l,h){D(l,e,h),D(l,s,h),E(s,t);for(let d=0;d<a.length;d+=1)a[d]&&a[d].m(t,null);E(t,o),n&&n.m(t,null),E(s,r),te(u,s,null),b=!0},p(l,[h]){if(h&2){_=H(l[1]);let i;for(i=0;i<_.length;i+=1){const v=Q(l,_,i);a[i]?(a[i].p(v,h),P(a[i],1)):(a[i]=X(v),a[i].c(),P(a[i],1),a[i].m(t,o))}for(V(),i=_.length;i<a.length;i+=1)j(i);J()}l[1].length==0?n?h&2&&P(n,1):(n=Y(),n.c(),P(n,1),n.m(t,null)):n&&(V(),y(n,1,1,()=>{n=null}),J());const d={};h&1&&(d.categories=l[0]),u.$set(d)},i(l){if(!b){for(let h=0;h<_.length;h+=1)P(a[h]);P(n),P(u.$$.fragment,l),b=!0}},o(l){a=a.filter(Boolean);for(let h=0;h<a.length;h+=1)y(a[h]);y(n),y(u.$$.fragment,l),b=!1},d(l){l&&($(e),$(s)),Z(a,l),n&&n.d(),se(u)}}}function _e(f,e,s){let{data:t}=e,o=[],r=t.posts;t.posts.forEach(_=>{_.categories.forEach(a=>{o.push(a)})}),o.sort(),o=[...new Set(o)];const u=_=>{let a=_.detail;if(a.length===0){s(1,r=t.posts);return}s(1,r=t.posts.filter(j=>{let n=j.categories,l=0;if(a.forEach(h=>{n.includes(h)&&l++}),l===a.length)return!0}))},b=_=>u(_);return f.$$set=_=>{"data"in _&&s(3,t=_.data)},[o,r,u,t,b]}class ke extends oe{constructor(e){super(),ne(this,e,_e,ue,le,{data:3})}}export{ke as component,be as universal};