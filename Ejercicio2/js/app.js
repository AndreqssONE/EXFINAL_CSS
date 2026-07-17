function productCard(p){
    return `
    <article class="card-product">
      <span class="notch"></span>
      ${p.verified ? '<span class="stamp">Verificado</span>' : ''}
      <div class="aspect-[4/3] w-full overflow-hidden">
        <img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover">
      </div>
      <div class="p-4 flex flex-col gap-2 flex-1">
        <span class="badge-eco w-fit">${p.cond}</span>
        <h3 class="font-semibold text-sm leading-snug line-clamp-2 flex-1">${p.title}</h3>
        <div class="flex items-baseline gap-2 mt-auto">
          <span class="price-tag text-lg">S/ ${p.price}</span>
          ${p.old ? `<span class="price-tag-old">S/ ${p.old}</span>` : ''}
        </div>
        <button onclick="goTo('detalle')" class="btn-secondary w-full mt-1 !py-2 text-sm">Ver detalle</button>
      </div>
    </article>`;
  }

  function fillGrid(id, items){
    document.getElementById(id).innerHTML = items.map(productCard).join('');
  }
  fillGrid('featured-grid', products.slice(0,4));
  fillGrid('catalog-grid', products);
  fillGrid('related-grid', products.slice(2,6));
  fillGrid('seller-grid', products.slice(0,3));

  const views = ['inicio','catalogo','detalle','perfil','carrito','publicar'];
  function goTo(view){
    views.forEach(v=>{
      document.getElementById('view-'+v).classList.toggle('hidden', v!==view);
      const nav = document.querySelector(`[data-nav="${v}"]`);
      if(nav) nav.className = v===view ? 'navlink-active' : 'navlink';
    });
    document.getElementById('mobile-nav').classList.add('hidden');
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function toggleMobileNav(){
    document.getElementById('mobile-nav').classList.toggle('hidden');
  }

  function toggleFilters(){
    document.getElementById('filter-overlay').classList.toggle('hidden');
    const panel = document.getElementById('filter-panel');
    panel.classList.toggle('hidden');
    panel.classList.toggle('flex');
  }

  function switchProfileTab(tab, btn){
    document.getElementById('profile-productos').classList.toggle('hidden', tab!=='productos');
    document.getElementById('profile-comentarios').classList.toggle('hidden', tab!=='comentarios');
    btn.parentElement.querySelectorAll('button').forEach(b=>b.className='navlink pb-3');
    btn.className = 'navlink-active pb-3';
  }

  function updateQty(btn, delta){
    const span = btn.parentElement.querySelector('.qty');
    let val = Math.max(1, parseInt(span.textContent) + delta);
    span.textContent = val;
  }

  function toggleFaq(btn){
    const answer = btn.nextElementSibling;
    const icon = btn.querySelector('span');
    answer.classList.toggle('hidden');
    icon.textContent = answer.classList.contains('hidden') ? '＋' : '－';
  }

  function previewImages(e){
    const container = document.getElementById('image-preview');
    container.innerHTML = '';
    [...e.target.files].slice(0,6).forEach(file=>{
      const url = URL.createObjectURL(file);
      container.insertAdjacentHTML('beforeend', `<img src="${url}" class="w-full aspect-square object-cover rounded-tag border border-brand-200">`);
    });
  }

  function handlePublish(e){
    e.preventDefault();
    const box = document.getElementById('publish-feedback');
    box.className = 'alert-success';
    box.innerHTML = '<svg class="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><p>Tu producto fue publicado y ya está visible en el catálogo.</p>';
    return false;
  }
