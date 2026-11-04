const h=window.location.pathname.split("/").pop()||"index.html";function f(e){return e===""||e==="index.html"}document.querySelectorAll(".header__nav-link, .mobile-menu__link").forEach(e=>{var a;const t=((a=e.getAttribute("href"))==null?void 0:a.split("/").pop())||"";(f(h)?f(t)||t==="./index.html":t.includes(h))&&e.classList.add("is-active")});const c=document.querySelector(".header__burger"),i=document.querySelector(".mobile-menu"),l=document.querySelector(".mobile-menu__close");function C(){i==null||i.classList.add("is-open"),i==null||i.setAttribute("aria-hidden","false"),c==null||c.setAttribute("aria-expanded","true"),document.body.style.overflow="hidden"}function x(){i==null||i.classList.remove("is-open"),i==null||i.setAttribute("aria-hidden","true"),c==null||c.setAttribute("aria-expanded","false"),document.body.style.overflow=""}c==null||c.addEventListener("click",C);l==null||l.addEventListener("click",x);document.addEventListener("keydown",e=>{e.key==="Escape"&&x()});const S="/project-code-masters/assets/sprite-CzI6lOhf.svg",w="card-",d=(e,t)=>`<svg class="icon" width="${t}" height="${t}" aria-hidden="true"><use href="${S}#${w}${e}"></use></svg>`,u=(e="")=>e?e[0].toUpperCase()+e.slice(1):"";function q(e,t="home"){var m,_;const{_id:n,name:a,burnedCalories:r,time:s,bodyPart:y,target:b,rating:v}=e,o=document.createElement("li");o.className="exercise-card",o.dataset.id=n,o.innerHTML=`
    <div class="exercise-card__top">
      <span class="exercise-card__badge">Workout</span>
      ${t==="home"?`<span class="exercise-card__rating">${d("star",18)}</span>`:`<button class="exercise-card__remove" type="button" data-action="remove" aria-label="Remove from favorites">${d("trash",16)}</button>`}
      <button class="exercise-card__start" type="button" data-show-exercise="${n}">Start ${d("arrow",16)}</button>
    </div>
    <div class="exercise-card__title">
      ${d("runner",24)}
      <h3 class="exercise-card__name"></h3>
    </div>
    <ul class="exercise-card__info">
      <li><span>Burned calories:</span></li>
      <li><span>Body part:</span></li>
      <li><span>Target:</span></li>
    </ul>
  `;const p=o.querySelector("[data-show-exercise]");p&&(p.dataset.showExercise=n),(m=o.querySelector(".exercise-card__name"))==null||m.append(u(a)),(_=o.querySelector(".exercise-card__rating"))==null||_.prepend(Number(v??0).toFixed(1));const[g,E,$]=o.querySelectorAll(".exercise-card__info li");return g.append(`${r??0} / ${s??0} min`),E.append(u(y)),$.append(u(b)),o}function L(e,t="home"){return e.map(n=>q(n,t))}function A(e,t){if(t<=5)return Array.from({length:t},(r,s)=>s+1);const n=[...new Set([1,t,e-1,e,e+1])].filter(r=>r>=1&&r<=t).sort((r,s)=>r-s),a=[];return n.forEach((r,s)=>{s>0&&r-n[s-1]>1&&a.push(null),a.push(r)}),a}function k(e,t){const n=document.createElement("button");return n.type="button",n.className=t?"pagination__btn is-active":"pagination__btn",n.dataset.page=String(e),n.textContent=String(e),t&&n.setAttribute("aria-current","page"),n}function N(e,{page:t,totalPages:n}){if(!n||n<=1){e.replaceChildren();return}const a=document.createElement("div");a.className="pagination__numbers";for(const r of A(t,n))if(r===null){const s=document.createElement("span");s.className="pagination__dots",s.textContent="…",a.append(s)}else a.append(k(r,r===t));e.replaceChildren(a)}export{L as c,N as r};
//# sourceMappingURL=pagination-DoSS4SPI.js.map
