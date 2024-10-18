import{s as I,f as _,e as T,O as W,g as y,d as p,j as l,r as A,u as w,I as H,a as M,c as P,i as E,H as B,F as O}from"./scheduler.eca58bb1.js";import{S as D,i as S}from"./index.4250a4ca.js";import{p as q}from"./stores.08faf6a0.js";function k(n){let t,a,i,e,o;return{c(){t=_("meta"),a=M(),i=_("meta"),e=M(),o=_("meta"),this.h()},l(r){t=y(r,"META",{property:!0,content:!0}),a=P(r),i=y(r,"META",{name:!0,content:!0}),e=P(r),o=y(r,"META",{name:!0,content:!0}),this.h()},h(){l(t,"property","og:image"),l(t,"content",n[2]),l(i,"name","twitter:image"),l(i,"content",n[2]),l(o,"name","twitter:card"),l(o,"content","summary_large_image")},m(r,s){E(r,t,s),E(r,a,s),E(r,i,s),E(r,e,s),E(r,o,s)},p(r,s){s&4&&l(t,"content",r[2]),s&4&&l(i,"content",r[2])},d(r){r&&(p(t),p(a),p(i),p(e),p(o))}}}function z(n){let t,a=`
		<script type="application/ld+json">
		{
			{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "${n[0]}",
			"description": "${n[1]}",
			"url": "${n[8]}",
			"image": "${n[2]}"
			}
		}
		<\/script>
	`,i;return{c(){t=new B(!1),i=T(),this.h()},l(e){t=O(e,!1),i=T(),this.h()},h(){t.a=i},m(e,o){t.m(a,e,o),E(e,i,o)},p(e,o){o&263&&a!==(a=`
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
		}
		<\/script>
	`)&&t.p(a)},d(e){e&&(p(i),t.d())}}}function K(n){let t,a=`
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "${n[8]}"
				},
			"headline": "${n[0]}",
			"image": ["${n[2]}"],
			"datePublished": "${n[6]}",
			"author": {
				"@type": "Person",
				"name": "${n[5]}"
				},
			"publisher": {
				"@type": "Organization",
				"name": "${n[5]} Blog",
				"logo": {
					"@type": "ImageObject",
					"url": "https://i.imgur.com/HjK8Wmp.png"
					}
				},

			"description": "${n[1]}",
			"articleBody": "${n[7]}"
			}
		}
		<\/script>
	`,i;return{c(){t=new B(!1),i=T(),this.h()},l(e){t=O(e,!1),i=T(),this.h()},h(){t.a=i},m(e,o){t.m(a,e,o),E(e,i,o)},p(e,o){o&487&&a!==(a=`
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "${e[8]}"
				},
			"headline": "${e[0]}",
			"image": ["${e[2]}"],
			"datePublished": "${e[6]}",
			"author": {
				"@type": "Person",
				"name": "${e[5]}"
				},
			"publisher": {
				"@type": "Organization",
				"name": "${e[5]} Blog",
				"logo": {
					"@type": "ImageObject",
					"url": "https://i.imgur.com/HjK8Wmp.png"
					}
				},

			"description": "${e[1]}",
			"articleBody": "${e[7]}"
			}
		}
		<\/script>
	`)&&t.p(a)},d(e){e&&(p(i),t.d())}}}function N(n){let t,a,i,e,o,r,s,f,g,b;document.title=t=n[0];let h=!n[4]&&k(n);function j(u,c){return u[3]?K:z}let m=j(n),d=m(n);return{c(){a=_("meta"),i=_("meta"),e=_("meta"),o=_("meta"),s=_("meta"),h&&h.c(),f=_("meta"),g=_("meta"),d.c(),b=T(),this.h()},l(u){const c=W("svelte-1hqglj4",document.head);a=y(c,"META",{name:!0,content:!0}),i=y(c,"META",{property:!0,content:!0}),e=y(c,"META",{property:!0,content:!0}),o=y(c,"META",{property:!0,content:!0}),s=y(c,"META",{property:!0,content:!0}),h&&h.l(c),f=y(c,"META",{name:!0,content:!0}),g=y(c,"META",{name:!0,content:!0}),d.l(c),b=T(),c.forEach(p),this.h()},h(){l(a,"name","description"),l(a,"content",n[1]),l(i,"property","og:title"),l(i,"content",n[0]),l(e,"property","og:description"),l(e,"content",n[1]),l(o,"property","og:type"),l(o,"content",r=n[3]?"article":"website"),l(s,"property","og:url"),l(s,"content",n[8]),l(f,"name","twitter:title"),l(f,"content",n[0]),l(g,"name","twitter:description"),l(g,"content",n[1])},m(u,c){A(document.head,a),A(document.head,i),A(document.head,e),A(document.head,o),A(document.head,s),h&&h.m(document.head,null),A(document.head,f),A(document.head,g),d.m(document.head,null),A(document.head,b)},p(u,[c]){c&1&&t!==(t=u[0])&&(document.title=t),c&2&&l(a,"content",u[1]),c&1&&l(i,"content",u[0]),c&2&&l(e,"content",u[1]),c&8&&r!==(r=u[3]?"article":"website")&&l(o,"content",r),c&256&&l(s,"content",u[8]),u[4]?h&&(h.d(1),h=null):h?h.p(u,c):(h=k(u),h.c(),h.m(f.parentNode,f)),c&1&&l(f,"content",u[0]),c&2&&l(g,"content",u[1]),m===(m=j(u))&&d?d.p(u,c):(d.d(1),d=m(u),d&&(d.c(),d.m(b.parentNode,b)))},i:w,o:w,d(u){p(a),p(i),p(e),p(o),p(s),h&&h.d(u),p(f),p(g),d.d(u),p(b)}}}function C(n,t,a){let i;H(n,q,m=>a(9,i=m));let{title:e=""}=t,{description:o=""}=t,{image:r=""}=t,{isArticle:s=!1}=t,{hasImage:f=!1}=t,{author:g=""}=t,{publishDate:b=""}=t,{articleBody:h=""}=t,j;return n.$$set=m=>{"title"in m&&a(0,e=m.title),"description"in m&&a(1,o=m.description),"image"in m&&a(2,r=m.image),"isArticle"in m&&a(3,s=m.isArticle),"hasImage"in m&&a(4,f=m.hasImage),"author"in m&&a(5,g=m.author),"publishDate"in m&&a(6,b=m.publishDate),"articleBody"in m&&a(7,h=m.articleBody)},n.$$.update=()=>{n.$$.dirty&512&&a(8,j=i.url.href)},[e,o,r,s,f,g,b,h,j,i]}class J extends D{constructor(t){super(),S(this,t,C,N,I,{title:0,description:1,image:2,isArticle:3,hasImage:4,author:5,publishDate:6,articleBody:7})}}export{J as S};
