import{s as m,v as l,w as d,f as c,g as u,B as _,i as f,u as g,d as p}from"./scheduler.ef8ee926.js";import{S,i as v,b as h,d as y,m as b,a as T,t as $,e as x}from"./index.97c34b88.js";import{g as C,a as M}from"./spread.8a54911c.js";import{M as L}from"./mdsvex.87e4c260.js";function P(o){let t,n="<thead><tr><th>Category</th> <th>Skills</th></tr></thead> <tbody><tr><td><strong>Data Science &amp; ML</strong></td> <td>Pandas, NumPy, Scikit‑learn, Matplotlib, Seaborn, TensorFlow, Keras, PyTorch, OpenCV, Gradio, NLTK, Spark, Hadoop</td></tr> <tr><td><strong>Programming</strong></td> <td>Python, JavaScript, TypeScript, Java, C++, SQL, Node.js, HTML5, CSS3, Svelte, Angular, TailwindCSS, Bootstrap, Git, Firebase, Vercel, Hugging Face, Pentaho, Tableau</td></tr> <tr><td><strong>Soft Skills</strong></td> <td>Problem Solving, Teamwork, Communication, Adaptability, Time Management, Self-motivation</td></tr></tbody>";return{c(){t=c("table"),t.innerHTML=n},l(a){t=u(a,"TABLE",{"data-svelte-h":!0}),_(t)!=="svelte-y40jlc"&&(t.innerHTML=n)},m(a,r){f(a,t,r)},p:g,d(a){a&&p(t)}}}function k(o){let t,n;const a=[o[0]];let r={$$slots:{default:[P]},$$scope:{ctx:o}};for(let e=0;e<a.length;e+=1)r=l(r,a[e]);return t=new L({props:r}),{c(){h(t.$$.fragment)},l(e){y(t.$$.fragment,e)},m(e,s){b(t,e,s),n=!0},p(e,[s]){const i=s&1?C(a,[M(e[0])]):{};s&2&&(i.$$scope={dirty:s,ctx:e}),t.$set(i)},i(e){n||(T(t.$$.fragment,e),n=!0)},o(e){$(t.$$.fragment,e),n=!1},d(e){x(t,e)}}}function w(o,t,n){return o.$$set=a=>{n(0,t=l(l({},t),d(a)))},t=d(t),[t]}class F extends S{constructor(t){super(),v(this,t,w,k,m,{})}}export{F as default};