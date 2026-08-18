
const SHOP_PHONE="069 205 3677";
const SHOP_PHONE_INT="355692053677";
const searchForm=document.getElementById("productSearchForm");
const searchInput=document.getElementById("productSearchInput");
const searchPanel=document.getElementById("productSearchPanel");
const megaTrigger=document.getElementById("productMegaTrigger");
const megaPanel=document.getElementById("productMegaPanel");
let searchProducts=[];
let activeIndex=-1;

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function norm(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();}
function money(v){const n=Number(v)||0;return n>0?`${new Intl.NumberFormat("sq-AL").format(n)} Lekë`:"Kontakto për çmimin";}

fetch("product-search.json",{cache:"no-store"}).then(r=>r.json()).then(data=>{searchProducts=data;}).catch(()=>{});

function closeSearch(){if(searchPanel){searchPanel.hidden=true;searchPanel.innerHTML="";}document.body.classList.remove("search-open");activeIndex=-1;searchInput?.setAttribute("aria-expanded","false");}
function renderSearch(value){
  const q=norm(value); if(q.length<2){closeSearch();return;}
  const matches=searchProducts.map(p=>{const n=norm(p.name),c=norm(p.category);let score=0;if(n===q)score=100;else if(n.startsWith(q))score=70;else if(n.includes(q))score=45;else if(c.includes(q))score=20;else return null;return {p,score};}).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.p);
  activeIndex=-1;
  if(!matches.length){searchPanel.innerHTML='<div class="search-empty"><strong>Nuk u gjet asnjë produkt</strong><br><small>Provo një emër ose kategori tjetër.</small></div>';}
  else searchPanel.innerHTML=`<div class="search-head"><span>Sugjerime</span><span>${matches.length} rezultate</span></div>${matches.map(p=>`<a class="search-item" href="${esc(p.url)}"><span class="search-thumb"><img src="${esc(p.image)}" alt=""></span><span class="search-copy"><strong>${esc(p.name)}</strong><small>${esc(p.category)}</small></span><span class="search-price">${esc(money(p.price))}</span></a>`).join("")}`;
  searchPanel.hidden=false;document.body.classList.add("search-open");searchInput?.setAttribute("aria-expanded","true");
}
searchInput?.addEventListener("input",e=>renderSearch(e.target.value));
searchInput?.addEventListener("focus",e=>renderSearch(e.target.value));
searchInput?.addEventListener("keydown",e=>{
  if(e.key==="Escape") closeSearch();
  const items=[...searchPanel.querySelectorAll(".search-item")];if(!items.length)return;
  if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();items.forEach(i=>i.classList.remove("is-active"));activeIndex=e.key==="ArrowDown"?(activeIndex+1)%items.length:(activeIndex-1+items.length)%items.length;items[activeIndex].classList.add("is-active");items[activeIndex].scrollIntoView({block:"nearest"});}
  if(e.key==="Enter"&&activeIndex>=0){e.preventDefault();window.location.href=items[activeIndex].href;}
});
searchForm?.addEventListener("submit",e=>{e.preventDefault();const q=searchInput.value.trim();if(q)window.location.href=`produkte.html?q=${encodeURIComponent(q)}`;});
document.addEventListener("click",e=>{if(!e.target.closest(".search-wrap"))closeSearch();});

megaTrigger?.addEventListener("click",e=>{e.stopPropagation();megaPanel.hidden=!megaPanel.hidden;megaTrigger.setAttribute("aria-expanded",String(!megaPanel.hidden));});
document.addEventListener("click",e=>{if(!e.target.closest(".mega-wrap")&&megaPanel)megaPanel.hidden=true;});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&megaPanel)megaPanel.hidden=true;});

const qty=document.getElementById("qty");
document.getElementById("qtyMinus")?.addEventListener("click",()=>qty.value=Math.max(1,Number(qty.value||1)-1));
document.getElementById("qtyPlus")?.addEventListener("click",()=>qty.value=Math.max(1,Number(qty.value||1)+1));
document.getElementById("orderWhatsapp")?.addEventListener("click",()=>{
  const q=Math.max(1,Number(qty.value||1));const name=document.body.dataset.productName;const price=Number(document.body.dataset.productPrice||0);const url=window.location.href;
  const priceLine=price>0?`\nÇmimi: ${money(price*q)}`:"";const message=`Përshëndetje! Dua të porosis:\n\n${q} × ${name}${priceLine}\nProdukti: ${url}\n\nJu lutem më kontaktoni për konfirmimin e porosisë.`;
  window.open(`https://wa.me/${SHOP_PHONE_INT}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
document.getElementById("year").textContent=new Date().getFullYear();
