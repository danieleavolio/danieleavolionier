import{s as V,f as y,e as R,T as N,g as w,d as c,j as o,r as v,u as M,I as W,a as P,c as k,i as A,H as j,F as I}from"./scheduler.38e9bcec.js";import{S as H,i as z}from"./index.fa6e9378.js";import{p as S}from"./stores.a7f8b0a2.js";function O(a){let i,n,l,e,m,d,g;return{c(){i=y("meta"),l=P(),e=y("meta"),d=P(),g=y("meta"),this.h()},l(r){i=w(r,"META",{property:!0,content:!0}),l=k(r),e=w(r,"META",{name:!0,content:!0}),d=k(r),g=w(r,"META",{name:!0,content:!0}),this.h()},h(){o(i,"property","og:image"),o(i,"content",n=a[7]?a[9]:a[2]),o(e,"name","twitter:image"),o(e,"content",m=a[7]?a[9]:a[2]),o(g,"name","twitter:card"),o(g,"content","summary_large_image")},m(r,s){A(r,i,s),A(r,l,s),A(r,e,s),A(r,d,s),A(r,g,s)},p(r,s){s&644&&n!==(n=r[7]?r[9]:r[2])&&o(i,"content",n),s&644&&m!==(m=r[7]?r[9]:r[2])&&o(e,"content",m)},d(r){r&&(c(i),c(l),c(e),c(d),c(g))}}}function G(a){let i,n=`
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "${a[0]}",
			"description": "${a[1]}",
			"url": "${a[13]}",
			"image": "${a[2]}"
		}
		<\/script>
		`,l;return{c(){i=new j(!1),l=R(),this.h()},l(e){i=I(e,!1),l=R(),this.h()},h(){i.a=l},m(e,m){i.m(n,e,m),A(e,l,m)},p(e,m){m&8199&&n!==(n=`
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "${e[0]}",
			"description": "${e[1]}",
			"url": "${e[13]}",
			"image": "${e[2]}"
		}
		<\/script>
		`)&&i.p(n)},d(e){e&&(c(l),i.d())}}}function K(a){let i,n=`
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Review",
			"image": "${a[9]}",
			"itemReviewed": {
				"@type": "VideoGame",
				"name": "${a[8]}",
				"image": "${a[9]}",
				"author": "${a[12]}"
			},
			"author": {
				"@type": "Person",
				"name": "${a[5]}",
				"url": "https://www.danieleavolio.it"
			},
			"reviewRating": {
				"@type": "Rating",
				"ratingValue": "${a[10]}",
				"bestRating": "10",
				"worstRating": "0"
			},
			"publisher": {
				"@type": "Organization",
				"name": "${a[5]}"
			},
			"reviewBody": "${a[11]}"
		}
		<\/script>
		`,l;return{c(){i=new j(!1),l=R(),this.h()},l(e){i=I(e,!1),l=R(),this.h()},h(){i.a=l},m(e,m){i.m(n,e,m),A(e,l,m)},p(e,m){m&7968&&n!==(n=`
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Review",
			"image": "${e[9]}",
			"itemReviewed": {
				"@type": "VideoGame",
				"name": "${e[8]}",
				"image": "${e[9]}",
				"author": "${e[12]}"
			},
			"author": {
				"@type": "Person",
				"name": "${e[5]}",
				"url": "https://www.danieleavolio.it"
			},
			"reviewRating": {
				"@type": "Rating",
				"ratingValue": "${e[10]}",
				"bestRating": "10",
				"worstRating": "0"
			},
			"publisher": {
				"@type": "Organization",
				"name": "${e[5]}"
			},
			"reviewBody": "${e[11]}"
		}
		<\/script>
		`)&&i.p(n)},d(e){e&&(c(l),i.d())}}}function q(a){let i,n=`
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "${a[13]}"
				},
			"headline": "${a[0]}",
			"image": ["${a[2]}"],
			"author": {
				"@type": "Person",
				"name": "${a[5]}"
				},
			"publisher": {
				"@type": "Organization",
				"name": "${a[5]} Blog",
				"logo": {
					"@type": "ImageObject",
					"url": "https://i.imgur.com/HjK8Wmp.png"
					}
				},
			"description": "${a[1]}",
			"articleBody": "${a[6]}"
		}
		<\/script>
		`,l;return{c(){i=new j(!1),l=R(),this.h()},l(e){i=I(e,!1),l=R(),this.h()},h(){i.a=l},m(e,m){i.m(n,e,m),A(e,l,m)},p(e,m){m&8295&&n!==(n=`
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "${e[13]}"
				},
			"headline": "${e[0]}",
			"image": ["${e[2]}"],
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
			"articleBody": "${e[6]}"
		}
		<\/script>
		`)&&i.p(n)},d(e){e&&(c(l),i.d())}}}function C(a){let i,n,l,e,m,d,g,r,s,p,_,B,b;document.title=i=a[0];let h=!a[4]&&O(a);function T(t,u){return t[3]?q:t[7]?K:G}let E=T(a),f=E(a);return{c(){n=y("meta"),e=y("meta"),m=y("meta"),g=y("meta"),s=y("meta"),h&&h.c(),p=y("meta"),_=y("meta"),f.c(),b=R(),this.h()},l(t){const u=N("svelte-rvcxr8",document.head);n=w(u,"META",{name:!0,content:!0}),e=w(u,"META",{property:!0,content:!0}),m=w(u,"META",{property:!0,content:!0}),g=w(u,"META",{property:!0,content:!0}),s=w(u,"META",{property:!0,content:!0}),h&&h.l(u),p=w(u,"META",{name:!0,content:!0}),_=w(u,"META",{name:!0,content:!0}),f.l(u),b=R(),u.forEach(c),this.h()},h(){o(n,"name","description"),o(n,"content",l=a[7]?a[11]:a[1]),o(e,"property","og:title"),o(e,"content",a[0]),o(m,"property","og:description"),o(m,"content",d=a[7]?a[11]:a[1]),o(g,"property","og:type"),o(g,"content",r=a[3]?"article":a[7]?"review":"website"),o(s,"property","og:url"),o(s,"content",a[13]),o(p,"name","twitter:title"),o(p,"content",a[0]),o(_,"name","twitter:description"),o(_,"content",B=a[7]?a[11]:a[1])},m(t,u){v(document.head,n),v(document.head,e),v(document.head,m),v(document.head,g),v(document.head,s),h&&h.m(document.head,null),v(document.head,p),v(document.head,_),f.m(document.head,null),v(document.head,b)},p(t,[u]){u&1&&i!==(i=t[0])&&(document.title=i),u&2178&&l!==(l=t[7]?t[11]:t[1])&&o(n,"content",l),u&1&&o(e,"content",t[0]),u&2178&&d!==(d=t[7]?t[11]:t[1])&&o(m,"content",d),u&136&&r!==(r=t[3]?"article":t[7]?"review":"website")&&o(g,"content",r),u&8192&&o(s,"content",t[13]),t[4]?h&&(h.d(1),h=null):h?h.p(t,u):(h=O(t),h.c(),h.m(p.parentNode,p)),u&1&&o(p,"content",t[0]),u&2178&&B!==(B=t[7]?t[11]:t[1])&&o(_,"content",B),E===(E=T(t))&&f?f.p(t,u):(f.d(1),f=E(t),f&&(f.c(),f.m(b.parentNode,b)))},i:M,o:M,d(t){c(n),c(e),c(m),c(g),c(s),h&&h.d(t),c(p),c(_),f.d(t),c(b)}}}function F(a,i,n){let l;W(a,S,t=>n(14,l=t));let{title:e=""}=i,{description:m=""}=i,{image:d=""}=i,{isArticle:g=!1}=i,{hasImage:r=!1}=i,{author:s=""}=i,{articleBody:p=""}=i,{isReview:_=!1}=i,{gameName:B=""}=i,{gameImage:b=""}=i,{ratingValue:h=0}=i,{reviewBody:T=""}=i,{developer:E=""}=i,f;return a.$$set=t=>{"title"in t&&n(0,e=t.title),"description"in t&&n(1,m=t.description),"image"in t&&n(2,d=t.image),"isArticle"in t&&n(3,g=t.isArticle),"hasImage"in t&&n(4,r=t.hasImage),"author"in t&&n(5,s=t.author),"articleBody"in t&&n(6,p=t.articleBody),"isReview"in t&&n(7,_=t.isReview),"gameName"in t&&n(8,B=t.gameName),"gameImage"in t&&n(9,b=t.gameImage),"ratingValue"in t&&n(10,h=t.ratingValue),"reviewBody"in t&&n(11,T=t.reviewBody),"developer"in t&&n(12,E=t.developer)},a.$$.update=()=>{a.$$.dirty&16384&&n(13,f=l.url.href)},[e,m,d,g,r,s,p,_,B,b,h,T,E,f,l]}class L extends H{constructor(i){super(),z(this,i,F,C,V,{title:0,description:1,image:2,isArticle:3,hasImage:4,author:5,articleBody:6,isReview:7,gameName:8,gameImage:9,ratingValue:10,reviewBody:11,developer:12})}}export{L as S};
