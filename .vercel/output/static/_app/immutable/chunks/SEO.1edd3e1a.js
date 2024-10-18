import{s as O,f as _,e as w,O as k,g as b,d as u,j as a,r as d,u as M,I as W,H as P,F as B,i as D}from"./scheduler.eca58bb1.js";import{S as H,i as S}from"./index.4250a4ca.js";import{p as I}from"./stores.5d5c5a58.js";function z(t){let n,i=`
		<script type="application/ld+json">
		{
			{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "${t[0]}",
			"description": "${t[1]}",
			"url": "${t[7]}",
			"image": "${t[2]}"
			}
		}
		<\/script>
	`,l;return{c(){n=new P(!1),l=w(),this.h()},l(e){n=B(e,!1),l=w(),this.h()},h(){n.a=l},m(e,m){n.m(i,e,m),D(e,l,m)},p(e,m){m&135&&i!==(i=`
		<script type="application/ld+json">
		{
			{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "${e[0]}",
			"description": "${e[1]}",
			"url": "${e[7]}",
			"image": "${e[2]}"
			}
		}
		<\/script>
	`)&&n.p(i)},d(e){e&&(u(l),n.d())}}}function K(t){let n,i=`
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "${t[7]}"
				},
			"headline": "${t[0]}",
			"image": ["${t[2]}"],
			"datePublished": "${t[5]}",
			"author": {
				"@type": "Person",
				"name": "${t[4]}"
				},
			"publisher": {
				"@type": "Organization",
				"name": "${t[4]} Blog",
				"logo": {
					"@type": "ImageObject",
					"url": "https://i.imgur.com/HjK8Wmp.png"
					}
				},

			"description": "${t[1]}",
			"articleBody": "${t[6]}"
			}
		}
		<\/script>
	`,l;return{c(){n=new P(!1),l=w(),this.h()},l(e){n=B(e,!1),l=w(),this.h()},h(){n.a=l},m(e,m){n.m(i,e,m),D(e,l,m)},p(e,m){m&247&&i!==(i=`
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "${e[7]}"
				},
			"headline": "${e[0]}",
			"image": ["${e[2]}"],
			"datePublished": "${e[5]}",
			"author": {
				"@type": "Person",
				"name": "${e[4]}"
				},
			"publisher": {
				"@type": "Organization",
				"name": "${e[4]} Blog",
				"logo": {
					"@type": "ImageObject",
					"url": "https://i.imgur.com/HjK8Wmp.png"
					}
				},

			"description": "${e[1]}",
			"articleBody": "${e[6]}"
			}
		}
		<\/script>
	`)&&n.p(i)},d(e){e&&(u(l),n.d())}}}function q(t){let n,i,l,e,m,E,h,p,A,f,g,y,r;document.title=n=t[0];function j(c,o){return c[3]?K:z}let T=j(t),s=T(t);return{c(){i=_("meta"),l=_("meta"),e=_("meta"),m=_("meta"),h=_("meta"),p=_("meta"),A=_("meta"),f=_("meta"),g=_("meta"),y=_("meta"),s.c(),r=w(),this.h()},l(c){const o=k("svelte-1o7b1wj",document.head);i=b(o,"META",{name:!0,content:!0}),l=b(o,"META",{property:!0,content:!0}),e=b(o,"META",{property:!0,content:!0}),m=b(o,"META",{property:!0,content:!0}),h=b(o,"META",{property:!0,content:!0}),p=b(o,"META",{property:!0,content:!0}),A=b(o,"META",{name:!0,content:!0}),f=b(o,"META",{name:!0,content:!0}),g=b(o,"META",{name:!0,content:!0}),y=b(o,"META",{name:!0,content:!0}),s.l(o),r=w(),o.forEach(u),this.h()},h(){a(i,"name","description"),a(i,"content",t[1]),a(l,"property","og:title"),a(l,"content",t[0]),a(e,"property","og:description"),a(e,"content",t[1]),a(m,"property","og:type"),a(m,"content",E=t[3]?"article":"website"),a(h,"property","og:url"),a(h,"content",t[7]),a(p,"property","og:image"),a(p,"content",t[2]),a(A,"name","twitter:card"),a(A,"content","summary_large_image"),a(f,"name","twitter:title"),a(f,"content",t[0]),a(g,"name","twitter:description"),a(g,"content",t[1]),a(y,"name","twitter:image"),a(y,"content",t[2])},m(c,o){d(document.head,i),d(document.head,l),d(document.head,e),d(document.head,m),d(document.head,h),d(document.head,p),d(document.head,A),d(document.head,f),d(document.head,g),d(document.head,y),s.m(document.head,null),d(document.head,r)},p(c,[o]){o&1&&n!==(n=c[0])&&(document.title=n),o&2&&a(i,"content",c[1]),o&1&&a(l,"content",c[0]),o&2&&a(e,"content",c[1]),o&8&&E!==(E=c[3]?"article":"website")&&a(m,"content",E),o&128&&a(h,"content",c[7]),o&4&&a(p,"content",c[2]),o&1&&a(f,"content",c[0]),o&2&&a(g,"content",c[1]),o&4&&a(y,"content",c[2]),T===(T=j(c))&&s?s.p(c,o):(s.d(1),s=T(c),s&&(s.c(),s.m(r.parentNode,r)))},i:M,o:M,d(c){u(i),u(l),u(e),u(m),u(h),u(p),u(A),u(f),u(g),u(y),s.d(c),u(r)}}}function C(t,n,i){let l;W(t,I,r=>i(9,l=r));let{title:e=""}=n,{description:m=""}=n,{image:E=""}=n,{isArticle:h=!1}=n,{author:p=""}=n,{publishDate:A=""}=n,{modifiedDate:f=""}=n,{articleBody:g=""}=n,y;return t.$$set=r=>{"title"in r&&i(0,e=r.title),"description"in r&&i(1,m=r.description),"image"in r&&i(2,E=r.image),"isArticle"in r&&i(3,h=r.isArticle),"author"in r&&i(4,p=r.author),"publishDate"in r&&i(5,A=r.publishDate),"modifiedDate"in r&&i(8,f=r.modifiedDate),"articleBody"in r&&i(6,g=r.articleBody)},t.$$.update=()=>{t.$$.dirty&512&&i(7,y=l.url.href)},[e,m,E,h,p,A,g,y,f,l]}class G extends H{constructor(n){super(),S(this,n,C,q,O,{title:0,description:1,image:2,isArticle:3,author:4,publishDate:5,modifiedDate:8,articleBody:6})}}export{G as S};
