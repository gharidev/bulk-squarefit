if(!self.define){let e,i={};const r=(r,s)=>(r=new URL(r+".js",s).href,i[r]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=i,document.head.appendChild(e)}else e=r,importScripts(r),i()})).then((()=>{let e=i[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(s,u)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(i[f])return;let a={};const n=e=>r(e,f),l={module:{uri:f},exports:a,require:n};i[f]=Promise.all(s.map((e=>l[e]||n(e)))).then((e=>(u(...e),a)))}}define(["./workbox-79ffe3e0"],(function(e){"use strict";e.setCacheNameDetails({prefix:"bulk-squarefit"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/bulk-squarefit/android-chrome-192x192.png",revision:"a55812af704ae6a50cd0a533683db600"},{url:"/bulk-squarefit/android-chrome-512x512.png",revision:"b8dd49cb54107ddf8d4c6dcf5ad7aa6b"},{url:"/bulk-squarefit/apple-touch-icon.png",revision:"5dcaa9b7ab1768672b4a502c97d3b122"},{url:"/bulk-squarefit/browserconfig.xml",revision:"1eaa6f49925f4cc529a72bef414b5afe"},{url:"/bulk-squarefit/bulk-squarefit.jpg",revision:"a199b65204a6053ab145a85fe73382d5"},{url:"/bulk-squarefit/css/chunk-vendors.f33fd678.css",revision:null},{url:"/bulk-squarefit/css/index.12a5f3ca.css",revision:null},{url:"/bulk-squarefit/favicon-16x16.png",revision:"5e9ed31d68b96d61378a8b79c1cfd2ac"},{url:"/bulk-squarefit/favicon-32x32.png",revision:"2e931492ad27fa68f9ab9dfc1aa93830"},{url:"/bulk-squarefit/favicon.svg",revision:"6c709e75b78332e2a55bffef6b6b82bd"},{url:"/bulk-squarefit/img/bulk-squarefit.7ab8c38f.svg",revision:null},{url:"/bulk-squarefit/index.html",revision:"4873600554b5e160f43c095ce14c492b"},{url:"/bulk-squarefit/js/chunk-vendors.b6865f55.js",revision:null},{url:"/bulk-squarefit/js/index.4f33b5f9.js",revision:null},{url:"/bulk-squarefit/manifest.json",revision:"88dfb673b57dd875239f2063cdf3d2f0"},{url:"/bulk-squarefit/mstile-150x150.png",revision:"f541970807f85f854abf57f4a8a351f1"},{url:"/bulk-squarefit/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"},{url:"/bulk-squarefit/safari-pinned-tab.svg",revision:"0f85f537895fcfdb58cf176cc4ae3f97"},{url:"/bulk-squarefit/site.webmanifest",revision:"da3ddd99c8e4bd48d8d33b59e745206e"}],{})}));
//# sourceMappingURL=service-worker.js.map
