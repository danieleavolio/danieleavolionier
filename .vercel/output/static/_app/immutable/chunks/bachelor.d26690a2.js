import{s as p,v as c,w as d,f as m,a as g,g as _,E as f,c as h,j as v,i as r,u as x,d as u}from"./scheduler.69ed1edc.js";import{S as $,i as b,b as L,d as T,m as y,a as C,t as S,e as w}from"./index.7977ad0e.js";import{g as H,a as M}from"./spread.8a54911c.js";import{M as U}from"./mdsvex.cf024404.js";function k(n){let e,s="DATI",i,l,t='<li><p><strong>Università</strong>: Università della Calabria</p> <ul><li><strong>Laurea</strong>: Laurea Triennale in Informatica</li> <li><strong>Voto</strong>: 94/110</li> <li><strong>Data</strong>: 2018 - 2022</li></ul></li> <li><p><strong>Tesi</strong>: ”<em>Link4Students</em> - Una rete sociale per studenti”</p> <ul><li>Tecnologie utilizzate:<ul><li>SvelteKit (versione precedente)</li> <li>NodeJS</li> <li>Firebase</li> <li>TypeScript</li></ul></li> <li>Repository: <a href="https://github.com/danieleavolio/link4students" rel="nofollow">GitHub</a></li> <li>Link (Italiano): <a href="https://danieleavolio.it/bachelor-thesis.pdf" rel="nofollow">PDF</a></li></ul></li>';return{c(){e=m("h3"),e.textContent=s,i=g(),l=m("ul"),l.innerHTML=t,this.h()},l(a){e=_(a,"H3",{id:!0,"data-svelte-h":!0}),f(e)!=="svelte-1saiuh0"&&(e.textContent=s),i=h(a),l=_(a,"UL",{"data-svelte-h":!0}),f(l)!=="svelte-mqs0t2"&&(l.innerHTML=t),this.h()},h(){v(e,"id","dati")},m(a,o){r(a,e,o),r(a,i,o),r(a,l,o)},p:x,d(a){a&&(u(e),u(i),u(l))}}}function D(n){let e,s;const i=[n[0]];let l={$$slots:{default:[k]},$$scope:{ctx:n}};for(let t=0;t<i.length;t+=1)l=c(l,i[t]);return e=new U({props:l}),{c(){L(e.$$.fragment)},l(t){T(e.$$.fragment,t)},m(t,a){y(e,t,a),s=!0},p(t,[a]){const o=a&1?H(i,[M(t[0])]):{};a&2&&(o.$$scope={dirty:a,ctx:t}),e.$set(o)},i(t){s||(C(e.$$.fragment,t),s=!0)},o(t){S(e.$$.fragment,t),s=!1},d(t){w(e,t)}}}function I(n,e,s){return n.$$set=i=>{s(0,e=c(c({},e),d(i)))},e=d(e),[e]}class A extends ${constructor(e){super(),b(this,e,I,D,p,{})}}export{A as default};