(this["webpackJsonpworth-watching"]=this["webpackJsonpworth-watching"]||[]).push([[0],{133:function(e,t,a){e.exports=a(253)},138:function(e,t,a){},253:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(83),l=a.n(r),c=(a(138),a(84)),i=a.n(c);class o{constructor(){this.cache={},this.populateCache()}populateCache(){const e=localStorage.getItem("shows");if(null!==e)try{const t=JSON.parse(e),a=new Date;a.setDate(a.getDate()-5);this.cache=i()(t,e=>!1)}catch(t){console.error("error parsing cached shows",t)}}has(e){return e in this.cache}get(e){return this.cache[e]}set(e,t){this.cache[e.imdbID]={added:(new Date).getTime(),info:e,seasons:t},localStorage.setItem("shows",JSON.stringify(this.cache))}}var u=a(50),d=a.n(u),m=a(85),p=a.n(m);const h=d.a.create({baseURL:"https://www.omdbapi.com/"});h.interceptors.request.use(e=>(e.params.apikey="ddf710b6",e));const g=d.a.create({baseURL:"https://imdb.beuke.org/"}),f=async e=>{try{const{data:t}=await g((e=>`series.json?sql=select+tconst,+parentTconst,+seasonNumber,+episodeNumber,+seriesTitle,+episodeTitle,+rating,+votes+from+series+where+"parentTconst"+=+"${e}"+order+by+CAST(seasonNumber+as+INT),+CAST(episodeNumber+as+INT)`)(e));return function(e,t){const a=t.map(t=>{const a={};return t.forEach((t,n)=>{const s=e[n];a[E[s]||s]=t}),a});a.forEach(e=>{e.season=parseInt(e.season,10),e.episode=parseInt(e.episode,10)});const n=p()(a,"season");return Object.keys(n).map(e=>{var t;const a=n[e];return{seriesTitle:(null===(t=a[0])||void 0===t?void 0:t.seriesTitle)||"",season:parseInt(e),episodes:a}})}(t.columns,t.rows)}catch(t){console.error("error fetching episodes",t)}return null},E={tconst:"seriesID",parentTconst:"episodeID",seasonNumber:"season",episodeNumber:"episode",seriesTitle:"seriesTitle",episodeTitle:"episodeTitle",rating:"rating",votes:"votes"};const y=Object(n.createContext)({selectShow:()=>{},selectedShow:null,isLoading:!1});function b({children:e}){const t=Object(n.useMemo)(()=>new o,[]),[a,r]=Object(n.useState)(null),[l,c]=Object(n.useState)(!1),i=Object(n.useCallback)(async e=>{if(c(!0),!t.has(e)){const n=await(async e=>{try{const{data:t}=await h.get("",{params:{i:e}});return t.totalSeasons=parseInt(t.totalSeasons,10),t}catch(t){console.log("error fetching show",t)}return null})(e);if(null==n)return a("failed to fetch show");const s=await f(e);if(null==s)return a("failed to fetch seasons");t.set(n,s)}function a(e){e&&alert(e),c(!1)}window.history.replaceState("","","?id="+e),r(t.get(e)),a()},[t]);Object(n.useEffect)(()=>{const e=new URLSearchParams(window.location.search);e.has("id")&&i(e.get("id"))},[i]);const u={selectShow:i,selectedShow:a,isLoading:l};return s.a.createElement(y.Provider,{value:u},e)}function v(){return Object(n.useContext)(y)}const w=e=>"n/a"!==e.toLowerCase();function _({results:e,highlighted:t,select:a}){const r=Object(n.useRef)(null);return Object(n.useEffect)(()=>{var e;null===(e=r.current)||void 0===e||e.scrollIntoView(!1)},[t]),e?e.length?s.a.createElement("ul",{className:"search-results"},e.map((e,n)=>s.a.createElement("li",{className:"search-result "+(n===t?"higlighted":""),key:e.imdbID,onClick:()=>a(n),ref:n===t?r:null},s.a.createElement("div",{className:"search-result__poster"},w(e.Poster)?s.a.createElement("img",{src:e.Poster,alt:"poster"}):null),s.a.createElement("span",null,e.Title," ",s.a.createElement("span",{className:"search-result__year"},"(",e.Year,")"))))):s.a.createElement("div",{className:"search-results search-results__empty"},"no results found"):null}function N(){return(N=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}var S=s.a.createElement("title",null,"magnifying-glass"),O=s.a.createElement("path",{d:"M17.545 15.467l-3.779-3.779c0.57-0.935 0.898-2.035 0.898-3.21 0-3.417-2.961-6.377-6.378-6.377s-6.186 2.769-6.186 6.186c0 3.416 2.961 6.377 6.377 6.377 1.137 0 2.2-0.309 3.115-0.844l3.799 3.801c0.372 0.371 0.975 0.371 1.346 0l0.943-0.943c0.371-0.371 0.236-0.84-0.135-1.211zM4.004 8.287c0-2.366 1.917-4.283 4.282-4.283s4.474 2.107 4.474 4.474c0 2.365-1.918 4.283-4.283 4.283s-4.473-2.109-4.473-4.474z"});const T=({svgRef:e,title:t,...a})=>s.a.createElement("svg",N({width:20,height:20,viewBox:"0 0 20 20",ref:e},a),void 0===t?S:t?s.a.createElement("title",null,t):null,O),x=s.a.forwardRef((e,t)=>s.a.createElement(T,N({svgRef:t},e)));a.p;var j,L=a(86),I=a.n(L);function A(){const[e,t]=Object(n.useState)(""),[a,s]=Object(n.useState)(null),r=Object(n.useCallback)(e=>{s(null),e&&t("")},[]),l=Object(n.useCallback)(async e=>{r();const t=await(async e=>{try{const{data:t}=await h.get("",{params:{type:"series",s:e}});if(t&&t.Search)return t.Search}catch(t){console.error("error searching",t)}return[]})(e);s(t)},[r]),c=Object(n.useMemo)(()=>I()(l,700),[l]);Object(n.useEffect)(()=>{if(e&&e.length>=2)return c(e),()=>c.cancel();r()},[r,c,e]);const i=Object(n.useCallback)(e=>{t(e.target.value)},[]);return{bind:{value:e,onChange:i},setTerm:t,results:a}}function R(){const e=Object(n.useRef)(null),{selectShow:t}=v(),{bind:a,setTerm:r,results:l}=A(),[c,i]=Object(n.useState)(-1),[o,u]=Object(n.useState)(!1);Object(n.useEffect)(()=>{i(-1),u(!0)},[l]);const d=Object(n.useCallback)(()=>{l&&u(!0)},[l]),m=Object(n.useCallback)(e=>setTimeout(()=>u(!1),200),[]),p=Object(n.useCallback)(e=>{l&&l[e]&&(t(l[e].imdbID),r(""))},[l,t,r]);return Object(n.useEffect)(()=>{const e=e=>{switch(e.keyCode){case j.ESC:u(!1);break;case j.UP:l&&i(e=>Math.max(e-1,0));break;case j.DOWN:l&&(u(!0),i(e=>Math.min(e+1,l.length-1)));break;case j.ENTER:p(c)}};return document.addEventListener("keydown",e,!1),()=>document.removeEventListener("keydown",e,!1)},[c,l,p,t]),s.a.createElement(s.a.Fragment,null,s.a.createElement("header",null,s.a.createElement("h1",null,"Is it worth watching?")),s.a.createElement("div",{className:"search-container"},s.a.createElement("div",{className:"search"},s.a.createElement("div",{className:"search-bar__wrapper",onClick:()=>{var t;return null===(t=e.current)||void 0===t?void 0:t.click()}},s.a.createElement("input",Object.assign({},a,{ref:e,className:"search-bar",placeholder:"Search shows",type:"text",autoFocus:!0,onFocus:d,onBlur:m})),s.a.createElement("div",{className:"search-bar__button"},s.a.createElement(x,null))),o&&s.a.createElement(_,{results:l,highlighted:c,select:p}))))}!function(e){e[e.UP=38]="UP",e[e.DOWN=40]="DOWN",e[e.ENTER=13]="ENTER",e[e.ESC=27]="ESC"}(j||(j={}));var k=a(1),D=a(87),C=a.n(D);const M=(e,t,a)=>{const n=(({items:e,svgWidth:t,dotSize:a,minSpacing:n,padding:s=0})=>Math.max(n,(t-2*s-e*a)/(e-1)))({items:a,svgWidth:e,dotSize:5,minSpacing:10,padding:20}),s=5+n,r=(e=>e.reduce((e,t,a)=>{const n=t.episodes[t.episodes.length-1].episode,s=e[a];return e.push(s+n),e},[0]))(t),l=r.map(e=>e*s+20),c=l.slice(0,l.length-1),i=l[r.length-1]-n+20;return{DOT_SPACING:n,SIZE:s,RANGES_NORMALIZED:l,RANGES_NORMALIZED_NO_LAST:c,TOTAL_WIDTH:i,VERTICAL_LINE_ADJUST:s/2}};function B(e,t,a){return{getx:t=>e(String(t.season))+(t.episode-1)*a,gety:e=>t(e.rating)}}const P=["#9c27b0","#3f51b5","#2196f3","#009688","#8bc34a","#ffc107","#fb8c00","#f33d38"];function U(e,t){return(a,n)=>{const s=e[n+1],r=e[n];return(s-r)/2+r-t}}function W(e,t,a){return e.attr("class","x-axis-text").text(e=>"Season "+e.season).attr("x",U(t,a))}function F(e,t,a){return e.attr("class","x-axis-season-line").attr("y1",0).attr("y2",-a).attr("x1",e=>e-t).attr("x2",e=>e-t)}var Z=a(88),G=a(89);function J(e){return e.attr("class","dot").attr("r",5).attr("fill",e=>{return t=e.season,P[t%P.length];var t})}function z(e,t,a){return e.attr("cx",t).attr("cy",a)}const V=(e,t)=>e.style("opacity",t?.4:1),q=(e,t)=>e.style("opacity",t?0:1),$=(e,t)=>e.style("opacity",t?1:0);function H(e){const t=Object(Z.a)(e.map((e,t)=>[t,e.rating])),a=Object(G.a)(t);return{points:[0,e.length-1].map(e=>[e,a(e)]),trend:t}}function Y(e,t){const a=e.append("g").attr("id","main-content"),n=a.append("line").attr("class","bisector-line"),s=a.append("g"),r=s.append("path").attr("class","dot-line"),l=k.j();let c,i=!1;const o=k.g(),u=a.append("path").attr("class","trendline").call($,i);let d=!1;async function m(e,a,n){d=!0;const{RANGES_NORMALIZED_NO_LAST:m,SIZE:p}=e;l.domain(a.map(e=>String(e.season))).range(m);const{getx:h,gety:g}=B(l,t,p),f=function(e,t,a){return k.g().x(e).y(t).curve(k.c)(a)}(h,g,n);r.attr("d",f);const E=r.node().getTotalLength();r.attr("stroke-dasharray",E+" "+E).attr("stroke-dashoffset",E).call(q,i).transition().duration(1200).ease(k.e).attr("stroke-dashoffset",0);const y=n.length;s.selectAll(".dot").data(n,e=>String(e.episode)).join(e=>e.append("circle").call(J),e=>e.call(J)).call(z,h,g).style("opacity",0).transition().duration(120).ease(k.e).delay((e,t)=>1200/y*(t+2)).call(V,i);const{points:b,trend:v}=H(n);c=v,o.x(e=>h(n[e[0]])).y(e=>t(e[1])),u.datum(b).transition().duration(1200).attr("d",o),d=!1}return{async generate(e,t,a){await m(e,t,a)},async update(t,n,s){const l=e.transition().duration(750),c=r.transition(l).style("opacity",0).end();a.selectAll(".dot").transition(l).style("opacity",0),await c,await m(t,n,s)},xScale:l,toggleTrendLine(){if(d)return{display:i,trend:c};i=!i,a.classed("show_trend",i);const e=a.transition().duration(500);return s.selectAll(".dot").transition(e).call(V,i),r.transition(e).call(q,i),u.transition(e).call($,i),{display:i,trend:c}},bisectorLine:n}}var X=a(13);function K(e,t,a){const n=e.append("linearGradient").attr("id",t);return n.attr("x1","0%").attr("x2","100%").attr("y1","0%").attr("y2","0%"),n.selectAll("stop").data(a).enter().append("stop").attr("offset",e=>e[0]+"%").attr("stop-color",e=>e[1]).attr("stop-opacity",e=>e[2]),n}function Q(e,t,a){const n=e.select("#content"),{displayRightFade:s,displayLeftFade:r}=function(e,t){const a=parseInt(e.attr("width"),10),n=e.append("defs");K(n,"left-fade-gradient",[[0,"white",1],[20,"white",1],[100,"white",0]]),K(n,"right-fade-gradient",[[0,"white",0],[80,"white",1],[100,"white",1]]);const s=e.append("rect").attr("class","fade-rect right").attr("x",-100).attr("y",0).attr("width",100).attr("height",t).style("fill","url(#left-fade-gradient)"),r=e.append("rect").attr("class","fade-rect right").attr("x",a).attr("y",0).attr("width",100).attr("height",t).style("fill","url(#right-fade-gradient)");return{displayLeftFade(e){e?s.transition().duration(500).attr("x",0):s.transition().duration(500).attr("x",-100)},displayRightFade(e){e?r.transition().duration(500).attr("x",a-100):r.transition().duration(500).attr("x",a)}}}(e,t),l=k.d(),c=k.l();function i(t){const{TOTAL_WIDTH:a}=t,i=parseInt(e.attr("width"),10),o=Math.abs(i-a)>15,u=o?a/i+1:1;c.scaleExtent([1,u]).translateExtent([[0,0],[o?a:i,0]]).on("zoom",(function(){const e=Math.min(Math.max(k.f.transform.x,i-a),0);n.attr("transform",`translate(${e})`),m(e)})),l.on("start",(function(){e.style("cursor","grabbing"),k.k(this).raise(),d=k.f.x})).on("drag",(function(){const t=-(d-k.f.x);d=k.f.x,c.translateBy(e,t,0)})).on("end",(function(){e.style("cursor","")})),e.call(l),e.call(c).on("wheel",()=>{k.f.preventDefault()}),m(0,!0);let d=0;function m(e,t){if(o||t){const t=Math.abs(e);s(t+i+50<a),r(t>50)}}}return i(a),{async reset(t){const a=(s=n,Object(X.b)(s.attr("transform")).translateX);var s;a&&await e.transition().duration(300).call(c.translateBy,-a,0).end(),l.on("start",null).on("drag",null).on("end",null),e.on("wheel",null),n.attr("transform","translate(0)"),i(t)}}}const ee=e=>C()(e,"episodes");function te(e,t,a){const n=ee(t),{width:s,height:r}=e.getBoundingClientRect(),l=k.k(e).append("svg").attr("id","y-axis-svg").attr("width",1).attr("height",r),c=k.k(e).append("svg").attr("id","content-svg").attr("width",s).attr("height",r+50),i=M(s,t,n.length),o=c.append("g").attr("id","content"),u=o.append("g").attr("transform",`translate(0, ${r})`).attr("id","x-axis"),{yScale:d}=function(e,t,a){const n=k.i().domain([0,10]).range([t,0]);return e.call(k.a(n).tickSizeOuter(0)).selectAll("line").attr("x2",a).attr("class",(e,t)=>8===t?"y-tick-8":"y-tick").filter((e,t)=>0===t).remove(),e.selectAll("text").attr("class","y-axis-text"),e.select(".domain").attr("class","y-axis-line"),{yScale:n}}(l,r,s),m=function(e){const t=e.append("g").attr("id","x-divider-lines");return{generate(e,a){const{RANGES_NORMALIZED_NO_LAST:n,VERTICAL_LINE_ADJUST:s}=e;t.selectAll("line").data(n.filter((e,t)=>0!==t)).join("line").call(F,s,a)},update(e,a,n){const{RANGES_NORMALIZED_NO_LAST:s,VERTICAL_LINE_ADJUST:r}=e;t.selectAll("line").data(s.filter((e,t)=>0!==t)).join(e=>e.append("line").call(F,r,a).style("opacity",0),e=>e,e=>e.transition(n).style("opacity",0).remove()).transition(n).attr("x1",e=>e-r).attr("x2",e=>e-r).style("opacity",1)}}}(u),p=function(e){const t=e.append("line").attr("class","x-axis-line").attr("y1",0).attr("y2",0).attr("x1",0);return{generate(e){const{TOTAL_WIDTH:a}=e;t.attr("x2",a)},update(e,a){const{TOTAL_WIDTH:n}=e;t.transition(a).attr("x2",n)}}}(u),h=function(e){return{generate(t,a){const{RANGES_NORMALIZED:n,VERTICAL_LINE_ADJUST:s}=t;e.selectAll("text").data(a,e=>String(e.season)).join("text").call(W,n,s)},update(t,a,n,s){const{RANGES_NORMALIZED:r,VERTICAL_LINE_ADJUST:l}=t;e.selectAll("text").data(n,e=>String(e.season)).join(e=>e.append("text").call(W,r,l).style("opacity",0),e=>e,e=>e.transition(s).style("opacity",0).remove()).transition(s).attr("x",U(r,l)).style("opacity",1)}}}(u),g=Y(o,d),f=function(e,t,a,n,s){const r=e.append("rect").attr("id","tooltip-overlay").attr("x",0).attr("y",0).attr("height",t),l=function(e,t){return e.attr("y1",0).attr("y1",t).style("opacity",0),function(t){t?e.attr("x1",t).attr("x2",t).style("opacity",1):e.style("opacity",0)}}(s,t);let c=!1;return{disable(){n(null),r.on("mousemove",null).on("mouseout",null)},update:function(e,t){const{TOTAL_WIDTH:s,VERTICAL_LINE_ADJUST:i}=e,{getx:o}=B(a,null,e.SIZE);r.attr("width",s);const u=k.b((t,a)=>o(t)-i+e.SIZE-a).left;r.on("mousemove",(function(e){const a=k.h(this)[0],s=u(t,a),r=t[s]||null;n(r),l(c&&r?o(r):null)})).on("mouseout",()=>{n(null),l(null)})},toggleBisectorLine:()=>(c=!c,l(null),c)}}(o,r,g.xScale,a,g.bisectorLine);p.generate(i),h.generate(i,t),m.generate(i,r),g.generate(i,t,n),f.update(i,n);const E=Q(c,r,i);return{async update(e){const t=ee(e),a=M(s,e,t.length);await E.reset(a);const n=c.transition().duration(750);p.update(a,n),h.update(a,r,e,n),m.update(a,r,n),await g.update(a,e,t),f.update(a,t)},toggleTrendline:g.toggleTrendLine,toggleBisectorLine:f.toggleBisectorLine}}function ae(){return(ae=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n])}return e}).apply(this,arguments)}var ne=s.a.createElement("title",null,"cycle"),se=s.a.createElement("path",{d:"M5.516 14.224c-2.262-2.432-2.222-6.244 0.128-8.611 0.962-0.969 2.164-1.547 3.414-1.736l-0.069-2.077c-1.755 0.213-3.452 0.996-4.797 2.351-3.149 3.17-3.187 8.289-0.123 11.531l-1.741 1.752 5.51 0.301-0.015-5.834-2.307 2.323zM12.163 2.265l0.015 5.834 2.307-2.322c2.262 2.434 2.222 6.246-0.128 8.611-0.961 0.969-2.164 1.547-3.414 1.736l0.069 2.076c1.755-0.213 3.452-0.996 4.798-2.35 3.148-3.172 3.186-8.291 0.122-11.531l1.741-1.754-5.51-0.3z"});const re=({svgRef:e,title:t,...a})=>s.a.createElement("svg",ae({width:20,height:20,viewBox:"0 0 20 20",ref:e},a),void 0===t?ne:t?s.a.createElement("title",null,t):null,se),le=s.a.forwardRef((e,t)=>s.a.createElement(re,ae({svgRef:t},e)));a.p;function ce(e,t){if(e<4)return"";const a=t<0,n=Math.abs(t);return n<.01?a?"Slightly deteriorates in quality over time.":"Slightly improves in quality over time.":n<.03?a?"Deteriorates in quality over time.":"Improves in quality over time.":""}function ie({show:e}){const{info:t,seasons:a}=e,r=parseFloat(t.imdbRating),l=Object(n.useMemo)(()=>H(ee(a)).trend,[a]);let c;return c=r>8?"Show is worth watching - good rating. "+ce(a.length,l.m):r>7.5?"Show might be worth watching, rating on the lower side. "+ce(a.length,l.m):"Based on rating, not recommended - watch at own risk",s.a.createElement("div",{className:"analysis__info"},s.a.createElement("div",{className:"analysis__info-icon"},r>7.5?"\ud83d\udc4d":"\ud83d\udc4e"),c)}function oe({show:e,toggleTrendline:t,toggleBisectorLine:a}){const[r,l]=Object(n.useState)({}),[c,i]=Object(n.useState)(!1),o=Object(n.useCallback)(()=>{t&&l(t())},[t]),u=Object(n.useCallback)(()=>{a&&i(a())},[a]);return s.a.createElement("div",{className:"analysis"},s.a.createElement(ie,{show:e}),s.a.createElement("div",{className:"analysis__toggle ",onClick:o},s.a.createElement("div",{className:"analysis__input "+(r.display?"active":"")}),s.a.createElement("div",{className:"analysis__toggle-label"},"Toggle trendline"),r.display&&s.a.createElement("div",null,r.trend.m.toFixed(3),"x + ",r.trend.b.toFixed(2))),s.a.createElement("div",{className:"analysis__toggle ",onClick:u},s.a.createElement("div",{className:"analysis__input "+(c?"active":"")}),s.a.createElement("div",{className:"analysis__toggle-label"},"Toggle bisector on hover")))}const ue=e=>({href:"https://www.imdb.com/title/"+e,target:"_blank",rel:"noopener noreferrer"});var de=Object(n.memo)((function({toggleTrendline:e,show:t,toggleBisectorLine:a}){const{info:n,seasons:r}=t;return s.a.createElement("div",{className:"panel"},s.a.createElement("div",{className:"info-panel"},s.a.createElement("div",{className:"info-panel__left"},s.a.createElement("a",Object.assign({},ue(n.imdbID),{className:"info-panel__poster"}),w(n.Poster)?s.a.createElement("img",{src:n.Poster,alt:"poster"}):null),s.a.createElement("div",{className:"info-panel__rating"},n.imdbRating," ",s.a.createElement("span",null,"/ 10"))),s.a.createElement("div",{className:"info-panel__right"},s.a.createElement("a",Object.assign({},ue(n.imdbID),{className:"info-panel__title"}),n.Title," ",s.a.createElement("span",null,"(",n.Year,")")),s.a.createElement("div",{className:"info-panel__genre"},n.Genre),s.a.createElement("div",{className:"info-panel__plot"},n.Plot),s.a.createElement("div",{className:"info-panel__seasons"},r.length," season",1===r.length?"":"s"))),s.a.createElement(oe,{show:t,toggleTrendline:e,toggleBisectorLine:a}))}));function me(){const{selectedShow:e,isLoading:t}=v(),a=Object(n.useRef)(null),[r,l]=Object(n.useState)(null),[c,i]=Object(n.useState)(null);return Object(n.useEffect)(()=>{e&&r&&r.update(e.seasons)},[r,e]),e?s.a.createElement("div",{className:"chart__container"},s.a.createElement("div",{className:"chart__title"},s.a.createElement("h2",null,e.info.Title," ",s.a.createElement("span",null,"(",e.info.Year,")")),s.a.createElement("div",{className:"chart__episode"},c&&s.a.createElement(s.a.Fragment,null,s.a.createElement("span",{className:"chart__episode-number"},((e,t)=>{const a=("0"+t).slice(-2);return`S${("0"+e).slice(-2)}E${a}`})(c.season,c.episode),":"),s.a.createElement("span",{className:"chart__episode-name"},c.episodeTitle),s.a.createElement("span",{className:"chart__episode-rating"},c.rating," / 10")))),s.a.createElement("div",{className:"chart__wrapper "+(t?"loading":""),ref:function(t){t&&!r&&(console.log(e),l(te(t,e.seasons,i))),a.current=t}},t&&s.a.createElement("span",{className:"chart__loading"},s.a.createElement(le,null))),s.a.createElement(de,{show:e,toggleTrendline:null===r||void 0===r?void 0:r.toggleTrendline,toggleBisectorLine:null===r||void 0===r?void 0:r.toggleBisectorLine})):null}var pe=function(){return s.a.createElement(b,null,s.a.createElement(R,null),s.a.createElement(me,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(pe,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(e=>{e.unregister()}).catch(e=>{console.error(e.message)})}},[[133,1,2]]]);
//# sourceMappingURL=main.ac387fd6.chunk.js.map