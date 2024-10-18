import{s as O,f as _,e as w,O as k,g as b,d as u,j as a,r as s,u as P,I as S,H as j,F as B,i as D}from"./scheduler.eca58bb1.js";import{S as W,i as H}from"./index.4250a4ca.js";import{p as I}from"./stores.a334303b.js";function q(t){let n,i=`
		<script type="application/ld+json">
			{
				
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "${t[0]}",
          "description": "${t[1]}",
          "url": "${t[8]}",
          "image": "${t[2]}"
        }
        ;
			}
		<\/script>
	`,l;return{c(){n=new j(!1),l=w(),this.h()},l(e){n=B(e,!1),l=w(),this.h()},h(){n.a=l},m(e,m){n.m(i,e,m),D(e,l,m)},p(e,m){m&263&&i!==(i=`
		<script type="application/ld+json">
			{
				
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "${e[0]}",
          "description": "${e[1]}",
          "url": "${e[8]}",
          "image": "${e[2]}"
        }
        ;
			}
		<\/script>
	`)&&n.p(i)},d(e){e&&(u(l),n.d())}}}function z(t){let n,i=`
		<script type="application/ld+json">
			{
				
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${t[8]}"
          },
          "headline": "${t[0]}",
          "image": ["${t[2]}"],
          "datePublished": "${t[5]}",
          "dateModified": "${t[6]}",
          "author": {
            "@type": "Person",
            "name": "${t[4]}"
          },
          "publisher": {
            "@type": "Organization",
            "name": "${t[4]} Blog",
            "logo": {
              "@type": "ImageObject",
              "url": "/path/to/logo.png"
            }
          },
          "description": "${t[1]}",
          "articleBody": "${t[7]}"
        }
        ;
			}
		<\/script>
	`,l;return{c(){n=new j(!1),l=w(),this.h()},l(e){n=B(e,!1),l=w(),this.h()},h(){n.a=l},m(e,m){n.m(i,e,m),D(e,l,m)},p(e,m){m&503&&i!==(i=`
		<script type="application/ld+json">
			{
				
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${e[8]}"
          },
          "headline": "${e[0]}",
          "image": ["${e[2]}"],
          "datePublished": "${e[5]}",
          "dateModified": "${e[6]}",
          "author": {
            "@type": "Person",
            "name": "${e[4]}"
          },
          "publisher": {
            "@type": "Organization",
            "name": "${e[4]} Blog",
            "logo": {
              "@type": "ImageObject",
              "url": "/path/to/logo.png"
            }
          },
          "description": "${e[1]}",
          "articleBody": "${e[7]}"
        }
        ;
			}
		<\/script>
	`)&&n.p(i)},d(e){e&&(u(l),n.d())}}}function C(t){let n,i,l,e,m,E,h,p,A,f,g,y,r;document.title=n=t[0];function T(c,o){return c[3]?z:q}let M=T(t),d=M(t);return{c(){i=_("meta"),l=_("meta"),e=_("meta"),m=_("meta"),h=_("meta"),p=_("meta"),A=_("meta"),f=_("meta"),g=_("meta"),y=_("meta"),d.c(),r=w(),this.h()},l(c){const o=k("svelte-wwj5q5",document.head);i=b(o,"META",{name:!0,content:!0}),l=b(o,"META",{property:!0,content:!0}),e=b(o,"META",{property:!0,content:!0}),m=b(o,"META",{property:!0,content:!0}),h=b(o,"META",{property:!0,content:!0}),p=b(o,"META",{property:!0,content:!0}),A=b(o,"META",{name:!0,content:!0}),f=b(o,"META",{name:!0,content:!0}),g=b(o,"META",{name:!0,content:!0}),y=b(o,"META",{name:!0,content:!0}),d.l(o),r=w(),o.forEach(u),this.h()},h(){a(i,"name","description"),a(i,"content",t[1]),a(l,"property","og:title"),a(l,"content",t[0]),a(e,"property","og:description"),a(e,"content",t[1]),a(m,"property","og:type"),a(m,"content",E=t[3]?"article":"website"),a(h,"property","og:url"),a(h,"content",t[8]),a(p,"property","og:image"),a(p,"content",t[2]),a(A,"name","twitter:card"),a(A,"content","summary_large_image"),a(f,"name","twitter:title"),a(f,"content",t[0]),a(g,"name","twitter:description"),a(g,"content",t[1]),a(y,"name","twitter:image"),a(y,"content",t[2])},m(c,o){s(document.head,i),s(document.head,l),s(document.head,e),s(document.head,m),s(document.head,h),s(document.head,p),s(document.head,A),s(document.head,f),s(document.head,g),s(document.head,y),d.m(document.head,null),s(document.head,r)},p(c,[o]){o&1&&n!==(n=c[0])&&(document.title=n),o&2&&a(i,"content",c[1]),o&1&&a(l,"content",c[0]),o&2&&a(e,"content",c[1]),o&8&&E!==(E=c[3]?"article":"website")&&a(m,"content",E),o&256&&a(h,"content",c[8]),o&4&&a(p,"content",c[2]),o&1&&a(f,"content",c[0]),o&2&&a(g,"content",c[1]),o&4&&a(y,"content",c[2]),M===(M=T(c))&&d?d.p(c,o):(d.d(1),d=M(c),d&&(d.c(),d.m(r.parentNode,r)))},i:P,o:P,d(c){u(i),u(l),u(e),u(m),u(h),u(p),u(A),u(f),u(g),u(y),d.d(c),u(r)}}}function F(t,n,i){let l;S(t,I,r=>i(9,l=r));let{title:e=""}=n,{description:m=""}=n,{image:E=""}=n,{isArticle:h=!1}=n,{author:p=""}=n,{publishDate:A=""}=n,{modifiedDate:f=""}=n,{articleBody:g=""}=n,y;return t.$$set=r=>{"title"in r&&i(0,e=r.title),"description"in r&&i(1,m=r.description),"image"in r&&i(2,E=r.image),"isArticle"in r&&i(3,h=r.isArticle),"author"in r&&i(4,p=r.author),"publishDate"in r&&i(5,A=r.publishDate),"modifiedDate"in r&&i(6,f=r.modifiedDate),"articleBody"in r&&i(7,g=r.articleBody)},t.$$.update=()=>{t.$$.dirty&512&&i(8,y=l.url.href)},[e,m,E,h,p,A,f,g,y,l]}class J extends W{constructor(n){super(),H(this,n,F,C,O,{title:0,description:1,image:2,isArticle:3,author:4,publishDate:5,modifiedDate:6,articleBody:7})}}export{J as S};
