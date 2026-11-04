import"./assets/styles-Bz5h5gN1.js";import"./assets/header-Ca_9dZAd.js";const c="https://your-energy.b.goit.study/api";async function l(t,e=1,o=12){const r=new URLSearchParams({filter:t,page:String(e),limit:String(o)}),i=await fetch(`${c}/filters?${r}`);if(!i.ok)throw new Error(`API error: ${i.status}`);return i.json()}function a(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const g=t=>`
  <li class="category-card"
      style="background-image: linear-gradient(rgba(17, 17, 17, 0.5), rgba(17, 17, 17, 0.5)), url('${encodeURI(t.imgURL)}')">
    <button class="category-card-btn" type="button"
            data-filter="${a(t.filter)}" data-name="${a(t.name)}">
      <h3 class="category-card-title">${a(t.name)}</h3>
      <p class="category-card-filter">${a(t.filter)}</p>
    </button>
  </li>`,u=t=>t.map(g).join(""),n=document.querySelector(".js-categories-list");function s(t,e){t.innerHTML=`<li class="categories-error">${e}</li>`}async function p(t,e,o){if(n)try{const{results:r}=await l(t,e,o);if(r.length===0){s(n,`No categories found for filter: ${t} on page ${e}`);return}n.innerHTML=u(r)}catch{s(n,"Could not load categories")}}let d=12;p("Muscles",1,d);
//# sourceMappingURL=index.js.map
