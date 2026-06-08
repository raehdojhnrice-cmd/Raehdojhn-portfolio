/* ===========================================================
   BASIC AMERICANA — shared store logic
   =========================================================== */
(function(){
  "use strict";
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const money = n => '$'+n.toFixed(0);

  /* ---------------- product catalog ---------------- */
  const PRODUCTS = [
    {id:'hoodie',name:'Star Backdrop Hoodie',cat:'fleece',sku:'BA-HDY-STAR-013',price:68,
      img:'assets/img/products/hoodie.jpg',
      gallery:['assets/img/gallery/hoodie-1.jpg','assets/img/gallery/hoodie-2.jpg','assets/img/gallery/hoodie-3.jpg','assets/img/gallery/hoodie-4.jpg'],
      colors:['#111111','#1B2A44','#E2342A'],copy:'Heavyweight washed fleece for emotional weather. Giant star back hit, clean chest mark, barcode sleeve detail.'},
    {id:'tee',name:'Low Rent Glamour Tee',cat:'tees',sku:'BA-LRG-TEE-013',price:36,
      img:'assets/img/products/tee.jpg',colors:['#F4F1EA','#FF5C8A','#111111'],
      copy:'Washed cotton. Faded red script. No clean endings.'},
    {id:'sweat',name:'American Default Sweatpant',cat:'fleece',sku:'BA-AD-SWT-2479',price:58,
      img:'assets/img/products/sweat.jpg',colors:['#1B2A44','#C9B79C','#111111'],
      copy:'Relaxed fit. Collegiate print. Parking-lot approved.'},
    {id:'tank',name:'Basic Rib Tank',cat:'tees',sku:'BA-RIB-TNK-006',price:32,
      img:'assets/img/products/tank.jpg',colors:['#F4C400','#FF5C8A','#111111'],
      copy:'Clean basic, loud label, sun-faded cotton.'},
    {id:'longsleeve',name:'Cotton Casino Long Sleeve',cat:'tees',sku:'BA-CAS-LS-006',price:44,
      img:'assets/img/products/longsleeve.jpg',colors:['#E2342A','#7A5CC9','#111111'],
      copy:'Angel and devil graphic sleeve hit. Heavyweight cotton.'},
    {id:'tote',name:'Receipt Heart Tote',cat:'accessories',sku:'BA-RH-TOTE-001',price:28,
      img:'assets/img/products/tote.jpg',colors:['#C9B79C','#E2342A','#2A56C8'],
      copy:'For laundry, groceries, and unresolved returns. 12oz canvas.'},
    {id:'keytag',name:'Motel Key Tag',cat:'accessories',sku:'BA-MOTEL-013',price:12,
      img:'assets/img/products/keytag.jpg',colors:['#E2342A','#F4C400','#111111'],
      copy:'Room 013. No vacancy. No closure. Diamond acrylic fob.'},
    {id:'stickers',name:'Sticker Sheet',cat:'accessories',sku:'BA-STICKER-006',price:8,
      img:'assets/img/products/stickers.jpg',colors:['#FF5C8A','#2A56C8','#F4C400'],
      copy:'Stars, smileys, motel keys, and bad decisions. Vinyl, weatherproof.'}
  ];
  const byId = id => PRODUCTS.find(p=>p.id===id);
  window.BA_PRODUCTS = PRODUCTS;

  /* ---------------- cart (localStorage) ---------------- */
  const KEY='ba-cart-v1';
  const load = ()=>{ try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}} };
  const save = c => localStorage.setItem(KEY,JSON.stringify(c));
  let cart = load();
  const count = ()=>Object.values(cart).reduce((a,b)=>a+b,0);
  const subtotal = ()=>Object.entries(cart).reduce((s,[id,q])=>{const p=byId(id);return s+(p?p.price*q:0)},0);

  function updateCount(){ $$('.cart-btn .count').forEach(el=>el.textContent=count()); }
  function addToCart(id,opts){ cart[id]=(cart[id]||0)+1; save(cart); updateCount(); renderDrawer(); openDrawer(); toast('Added — '+byId(id).name); }
  function setQty(id,q){ if(q<=0) delete cart[id]; else cart[id]=q; save(cart); updateCount(); renderDrawer(); }

  /* ---------------- drawer ---------------- */
  function ensureDrawer(){
    if($('#ba-drawer')) return;
    const scrim=document.createElement('div'); scrim.className='scrim'; scrim.id='ba-scrim';
    const d=document.createElement('aside'); d.className='drawer'; d.id='ba-drawer'; d.setAttribute('role','dialog');
    d.setAttribute('aria-modal','true'); d.setAttribute('aria-label','Shopping bag'); d.hidden=false;
    d.innerHTML=`
      <div class="drawer-head"><h2 class="small-title">Your bag</h2><button class="drawer-close" id="ba-drawer-close">Close ✕</button></div>
      <div class="drawer-body" id="ba-lines"></div>
      <div class="drawer-foot">
        <div class="subtotal"><span>Subtotal</span><span id="ba-subtotal">$0</span></div>
        <p class="mono" style="margin:0">Shipping & emotional damage calculated at checkout.</p>
        <button class="btn block pink" id="ba-checkout">Checkout</button>
        <button class="btn block light" id="ba-continue">Keep shopping</button>
      </div>`;
    document.body.appendChild(scrim); document.body.appendChild(d);
    scrim.addEventListener('click',closeDrawer);
    $('#ba-drawer-close').addEventListener('click',closeDrawer);
    $('#ba-continue').addEventListener('click',closeDrawer);
    $('#ba-checkout').addEventListener('click',()=>{ if(count()===0){toast('Bag is empty');return;} toast('Mock checkout — no real payment'); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeDrawer(); });
  }
  function renderDrawer(){
    ensureDrawer();
    const lines=$('#ba-lines'); const entries=Object.entries(cart).filter(([id])=>byId(id));
    if(!entries.length){
      lines.innerHTML=`<div class="drawer-empty"><span>★</span><span>Your bag is empty.</span><a class="btn light" href="shop.html">Shop the drop</a></div>`;
    } else {
      lines.innerHTML=entries.map(([id,q])=>{const p=byId(id);return `
        <div class="line">
          <div class="thumb" style="background-image:url('${p.img}')"></div>
          <div>
            <div class="name">${p.name}</div>
            <div class="meta">${p.sku}</div>
            <div class="qty" data-id="${id}"><button class="dec" aria-label="Decrease">–</button><span>${q}</span><button class="inc" aria-label="Increase">+</button></div>
          </div>
          <div><span class="price">${money(p.price*q)}</span><button class="rm" data-rm="${id}">Remove</button></div>
        </div>`}).join('');
    }
    $('#ba-subtotal').textContent=money(subtotal());
    lines.querySelectorAll('.qty').forEach(q=>{
      const id=q.dataset.id;
      q.querySelector('.inc').addEventListener('click',()=>setQty(id,cart[id]+1));
      q.querySelector('.dec').addEventListener('click',()=>setQty(id,cart[id]-1));
    });
    lines.querySelectorAll('[data-rm]').forEach(b=>b.addEventListener('click',()=>setQty(b.dataset.rm,0)));
  }
  function openDrawer(){ ensureDrawer(); $('#ba-scrim').classList.add('open'); $('#ba-drawer').classList.add('open'); }
  function closeDrawer(){ const s=$('#ba-scrim'),d=$('#ba-drawer'); if(s)s.classList.remove('open'); if(d)d.classList.remove('open'); }

  /* ---------------- toast ---------------- */
  let toastEl,toastT;
  function toast(msg){
    if(!toastEl){ toastEl=document.createElement('div'); toastEl.className='toast'; toastEl.setAttribute('role','status'); document.body.appendChild(toastEl); }
    toastEl.textContent=msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(()=>toastEl.classList.remove('show'),1900);
  }

  /* ---------------- shop grid render ---------------- */
  function renderProducts(filter='all'){
    const grid=$('#products'); if(!grid) return;
    grid.innerHTML='';
    PRODUCTS.filter(p=>filter==='all'||p.cat===filter).forEach((p,i)=>{
      const el=document.createElement('article'); el.className='product';
      el.innerHTML=`
        <div class="product-media" style="background-image:url('${p.img}')">
          <a href="product.html?id=${p.id}" aria-label="View ${p.name}"></a>
          <span class="sticker pm-sticker ${i%2?'blue':'red'}">${p.sku}</span>
        </div>
        <div class="product-body">
          <div class="product-row"><h3 class="small-title"><a href="product.html?id=${p.id}">${p.name}</a></h3><span class="price">${money(p.price)}</span></div>
          <p class="copy">${p.copy}</p>
          <div class="barcode" aria-hidden="true"></div>
          <p class="mono">${p.sku} · ${p.cat}</p>
          <div class="product-actions">
            <a class="quick" href="product.html?id=${p.id}">View</a>
            <button class="add" data-add="${p.id}">Add</button>
          </div>
        </div>`;
      grid.appendChild(el);
    });
  }

  /* ---------------- PDP population ---------------- */
  function populatePDP(){
    const root=$('#pdp'); if(!root) return;
    const params=new URLSearchParams(location.search);
    const p=byId(params.get('id'))||byId('hoodie');
    document.title=`${p.name} — Basic Americana`;
    const set=(sel,txt)=>{const e=$(sel,root); if(e)e.textContent=txt;};
    set('#pdp-name',p.name); set('#pdp-price',money(p.price)); set('#pdp-sku',p.sku+' · returns: emotional only'); set('#pdp-copy',p.copy);
    const crumb=$('#pdp-crumb'); if(crumb) crumb.textContent=p.name;
    const imgs=[p.img,...(p.gallery||[])];
    const main=$('#pdp-main',root); if(main) main.style.backgroundImage=`url('${imgs[0]}')`;
    const thumbs=$('#pdp-thumbs',root);
    if(thumbs){
      thumbs.innerHTML=imgs.map((src,i)=>`<button style="background-image:url('${src}')" data-src="${src}" aria-pressed="${i===0?'true':'false'}" aria-label="View ${i+1}"></button>`).join('');
      thumbs.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
        thumbs.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));
        b.setAttribute('aria-pressed','true'); main.style.backgroundImage=`url('${b.dataset.src}')`;
      }));
    }
    const sw=$('#pdp-swatches',root);
    if(sw){ sw.innerHTML=p.colors.map((c,i)=>`<button class="swatch" style="background:${c}" aria-pressed="${i===0?'true':'false'}" aria-label="color"></button>`).join('');
      sw.querySelectorAll('.swatch').forEach(b=>b.addEventListener('click',()=>{sw.querySelectorAll('.swatch').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');})); }
    const add=$('#pdp-add',root); if(add) add.addEventListener('click',()=>addToCart(p.id));
    // related
    const rel=$('#pdp-related');
    if(rel){ rel.innerHTML=''; PRODUCTS.filter(x=>x.id!==p.id).slice(0,4).forEach(x=>{
      const el=document.createElement('article'); el.className='product';
      el.innerHTML=`<div class="product-media" style="background-image:url('${x.img}')"><a href="product.html?id=${x.id}" aria-label="${x.name}"></a></div>
        <div class="product-body"><div class="product-row"><h3 class="small-title">${x.name}</h3><span class="price">${money(x.price)}</span></div>
        <div class="product-actions"><a class="quick" href="product.html?id=${x.id}">View</a><button class="add" data-add="${x.id}">Add</button></div></div>`;
      rel.appendChild(el);
    }); }
  }

  /* ---------------- quick view modal ---------------- */
  function openModal(p){
    let m=$('#ba-modal');
    if(!m){ m=document.createElement('div'); m.className='modal'; m.id='ba-modal'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true');
      m.innerHTML=`<div class="modal-card"><div class="modal-head"><h2 id="ba-modal-name" class="small-title"></h2><button class="tab" id="ba-modal-close">Close ✕</button></div>
        <div class="modal-body"><div class="modal-media" id="ba-modal-media"></div>
        <div><p class="copy" id="ba-modal-copy"></p><p class="mono" id="ba-modal-sku" style="margin:.6rem 0"></p>
        <div class="size-grid">${['S','M','L','XL','XXL'].map(s=>`<button aria-pressed="false">${s}</button>`).join('')}</div>
        <button class="btn block" id="ba-modal-add">Add to bag</button></div></div></div>`;
      document.body.appendChild(m);
      $('#ba-modal-close').addEventListener('click',()=>m.classList.remove('open'));
      m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');});
    }
    $('#ba-modal-name').textContent=p.name; $('#ba-modal-copy').textContent=p.copy;
    $('#ba-modal-sku').textContent=p.sku+' · returns: emotional only';
    $('#ba-modal-media').style.backgroundImage=`url('${p.img}')`;
    const add=$('#ba-modal-add'); add.onclick=()=>{addToCart(p.id); m.classList.remove('open');};
    m.classList.add('open'); $('#ba-modal-close').focus();
  }

  /* ---------------- global delegated clicks ---------------- */
  document.addEventListener('click',e=>{
    const add=e.target.closest('[data-add]'); if(add){ addToCart(add.dataset.add); return; }
    const qv=e.target.closest('[data-quick]'); if(qv){ openModal(byId(qv.dataset.quick)); return; }
    const cb=e.target.closest('[data-cart-open]'); if(cb){ e.preventDefault(); renderDrawer(); openDrawer(); return; }
    const sz=e.target.closest('.size-grid button'); if(sz){ sz.closest('.size-grid').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false')); sz.setAttribute('aria-pressed','true'); }
  });

  /* ---------------- nav / faq / accordion / newsletter ---------------- */
  function wireChrome(){
    const t=$('#navToggle'), n=$('#siteNav');
    if(t&&n){ t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',o);});
      $$('#siteNav a').forEach(a=>a.addEventListener('click',()=>{n.classList.remove('open');t.setAttribute('aria-expanded','false');})); }
    $$('.faq-q,.acc-q').forEach(q=>q.addEventListener('click',()=>{
      const o=q.getAttribute('aria-expanded')==='true'; q.setAttribute('aria-expanded',String(!o));
      const sp=q.querySelector('span'); if(sp) sp.textContent=o?'+':'–';
    }));
    const nf=$('#newsForm'); if(nf) nf.addEventListener('submit',e=>{e.preventDefault();const v=$('#newsEmail');if(!v.value||!v.checkValidity()){v.focus();return;}toast("You're on the list");v.value='';});
    $$('.tab[role="tab"]').forEach(tab=>tab.addEventListener('click',()=>{
      $$('.tab[role="tab"]').forEach(x=>x.setAttribute('aria-selected','false'));
      tab.setAttribute('aria-selected','true'); renderProducts(tab.dataset.filter);
    }));
    // feature add buttons (data-add already handled by delegation)
  }

  /* ---------------- reveal ---------------- */
  function wireReveal(){
    const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)en.target.classList.add('in');}),{threshold:.12});
    $$('.reveal').forEach(el=>io.observe(el));
  }

  /* ---------------- scroll progress + parallax ---------------- */
  function wireScroll(){
    const progress=$('.progress'); const scene=$('#scene');
    const layers=scene?$$('.layer',scene):[];
    const palms=scene?$$('.palm-img',scene):[];
    const sun=scene?$('.sun',scene):null;
    function onScroll(){
      if(progress){ const max=document.documentElement.scrollHeight-innerHeight; progress.style.width=(max?(scrollY/max)*100:0)+'%'; }
      if(reduced||!scene) return;
      const r=scene.getBoundingClientRect();
      const p=Math.max(-1,Math.min(1,(innerHeight/2-(r.top+r.height/2))/((innerHeight+r.height)/2)));
      layers.forEach(l=>{const d=parseFloat(l.dataset.depth||0); l.style.transform=`translate3d(0,${p*d*-1.6}px,0)`;});
      palms.forEach((pa,i)=>{pa.style.transform=`translateY(${p*-(20+i*8)}px) rotate(${Math.sin(p*2+i)*3}deg)`;});
      if(sun){ sun.style.transform=`translateY(${p*40}px)`; }
    }
    let ticking=false;
    addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{onScroll();ticking=false;});ticking=true;}},{passive:true});
    addEventListener('resize',onScroll); onScroll();
  }

  /* ---------------- draggable stickers ---------------- */
  function wireStickers(){
    $$('.draggables .sticker, .wall .sticker').forEach(st=>{
      let dragging=false,sx=0,sy=0,ox=0,oy=0;
      st.addEventListener('pointerdown',e=>{dragging=true;st.classList.add('dragging');st.setPointerCapture(e.pointerId);sx=e.clientX;sy=e.clientY;ox=st.offsetLeft;oy=st.offsetTop;st.style.cursor='grabbing';});
      st.addEventListener('pointermove',e=>{if(!dragging)return;const par=st.offsetParent;const nx=ox+e.clientX-sx,ny=oy+e.clientY-sy;
        st.style.left=Math.max(0,Math.min((par?.clientWidth||innerWidth)-st.offsetWidth,nx))+'px';
        st.style.top=Math.max(0,Math.min((par?.clientHeight||innerHeight)-st.offsetHeight,ny))+'px';st.style.right='auto';st.style.bottom='auto';});
      const end=()=>{dragging=false;st.classList.remove('dragging');st.style.cursor='grab';};
      st.addEventListener('pointerup',end); st.addEventListener('pointercancel',end);
      st.addEventListener('keydown',e=>{const k={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[e.key];if(!k)return;e.preventDefault();
        st.style.left=(st.offsetLeft+k[0])+'px';st.style.top=(st.offsetTop+k[1])+'px';st.style.right='auto';st.style.bottom='auto';});
    });
  }

  /* ---------------- story viewer (glassmorphic, 9:16) ---------------- */
  function wireStoryViewer(){
    const stories=$$('.stories .story'); if(!stories.length) return;
    const CAPTIONS={
      'Laundromat':'Hard flash, cotton body, country heat.',
      'Motel 013':'Room 013 — no vacancy, no closure.',
      'Parking lot':'Parking-lot uniform, washed in public.',
      'The Drop':'DROP_001 — American Default is live.',
      'Stickers':'Stars, smileys, motel keys, bad decisions.',
      'Posters':'Wheatpaste, halftone, low rent glamour.',
      'Palms':'Rib tank, palm shade, sun-faded cotton.'
    };
    const data=stories.map(s=>{
      const bg=(s.querySelector('.ring div')?.style.backgroundImage||'').replace(/^url\(["']?/,'').replace(/["']?\)$/,'');
      const label=(s.querySelector('span')?.textContent||'').trim();
      return {img:bg,label,cap:CAPTIONS[label]||label};
    });
    const v=document.createElement('div'); v.className='story-viewer'; v.hidden=true;
    v.setAttribute('role','dialog'); v.setAttribute('aria-modal','true'); v.setAttribute('aria-label','Story preview');
    v.innerHTML=`<div class="sv-scrim" data-close></div>
      <div class="sv-card">
        <div class="sv-media"></div>
        <div class="sv-nav"><button class="sv-prev" aria-label="Previous story"></button><button class="sv-next" aria-label="Next story"></button></div>
        <div class="sv-bars"></div>
        <div class="sv-top"><div class="sv-ava"></div><div class="sv-handle">@basicamericana<small></small></div><button class="sv-close" data-close aria-label="Close preview">✕</button></div>
        <div class="sv-cap"><span class="label"></span><span class="big"></span></div>
        <div class="sv-hint">Tap sides to move · Esc to close</div>
      </div>`;
    document.body.appendChild(v);
    const media=v.querySelector('.sv-media'), bars=v.querySelector('.sv-bars'),
          small=v.querySelector('.sv-handle small'), capL=v.querySelector('.sv-cap .label'),
          capB=v.querySelector('.sv-cap .big'), ava=v.querySelector('.sv-ava');
    const avaBg=document.querySelector('.so-avatar')?.style.backgroundImage; if(avaBg) ava.style.backgroundImage=avaBg;
    const DUR=3800; let cur=-1, timer=null;
    function renderBars(){
      bars.innerHTML=data.map((_,i)=>`<div class="seg ${i<cur?'done':''} ${i===cur?'active':''}"><i></i></div>`).join('');
      const act=bars.querySelector('.seg.active'); if(act){ act.style.setProperty('--sv-dur',DUR+'ms'); }
    }
    function show(i){
      if(i<0){i=0;} if(i>=data.length){ close(); return; }
      cur=i; const d=data[i];
      media.style.backgroundImage=`url("${d.img}")`;
      small.textContent=d.label; capL.textContent='Story · '+d.label; capB.textContent=d.cap;
      renderBars(); clearTimeout(timer);
      if(!reduced){ timer=setTimeout(()=>show(cur+1),DUR); }
    }
    function open(i){ v.hidden=false; document.body.style.overflow='hidden'; requestAnimationFrame(()=>v.classList.add('open')); show(i); v.querySelector('.sv-close').focus(); }
    function close(){ clearTimeout(timer); v.classList.remove('open'); v.hidden=true; cur=-1; document.body.style.overflow=''; }
    stories.forEach((s,i)=>{
      s.tabIndex=0; s.setAttribute('role','button'); s.setAttribute('aria-label','Open '+(data[i].label)+' story');
      let hv;
      s.addEventListener('mouseenter',()=>{ hv=setTimeout(()=>open(i),150); });
      s.addEventListener('mouseleave',()=>clearTimeout(hv));
      s.addEventListener('click',()=>{ clearTimeout(hv); open(i); });
      s.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(i); } });
    });
    v.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',close));
    v.querySelector('.sv-prev').addEventListener('click',()=>show(cur<=0?0:cur-1));
    v.querySelector('.sv-next').addEventListener('click',()=>show(cur+1));
    document.addEventListener('keydown',e=>{ if(v.hidden) return;
      if(e.key==='Escape') close(); else if(e.key==='ArrowRight') show(cur+1); else if(e.key==='ArrowLeft') show(Math.max(0,cur-1)); });
  }

  /* ---------------- archive gallery + lightbox ---------------- */
  function wireGallery(){
    const grid=document.getElementById('archiveGrid'); if(!grid) return;
    const data=window.BA_ARCHIVE||[]; const base='assets/img/archive/';
    grid.innerHTML=data.map((d,i)=>`<a class="arch" href="${base}${d[0]}" data-i="${i}" aria-label="Open image ${i+1}"><span class="star-badge" aria-hidden="true"></span><img loading="lazy" src="${base}${d[0]}" alt="Basic Americana asset ${i+1}"><figcaption>${String(i+1).padStart(3,'0')} · ${d[1]}</figcaption></a>`).join('');
    const cnt=document.getElementById('archCount'); if(cnt) cnt.textContent=data.length+' assets';
    const lb=document.createElement('div'); lb.className='lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-label','Image viewer');
    lb.innerHTML=`<button class="lb-close" aria-label="Close">✕</button><button class="lb-prev" aria-label="Previous image">‹</button><button class="lb-next" aria-label="Next image">›</button><div class="lb-stage"><img alt=""><div class="lb-cap"></div></div>`;
    document.body.appendChild(lb);
    const img=lb.querySelector('img'), cap=lb.querySelector('.lb-cap'); let idx=0;
    function show(i){ idx=(i+data.length)%data.length; img.src=base+data[idx][0]; cap.textContent=String(idx+1).padStart(3,'0')+' / '+data.length+' · '+data[idx][1]; }
    function open(i){ show(i); lb.classList.add('open'); document.body.style.overflow='hidden'; lb.querySelector('.lb-close').focus(); }
    function close(){ lb.classList.remove('open'); img.src=''; document.body.style.overflow=''; }
    grid.querySelectorAll('.arch').forEach(a=>a.addEventListener('click',e=>{ e.preventDefault(); open(+a.dataset.i); }));
    lb.querySelector('.lb-close').addEventListener('click',close);
    lb.querySelector('.lb-prev').addEventListener('click',()=>show(idx-1));
    lb.querySelector('.lb-next').addEventListener('click',()=>show(idx+1));
    lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
    document.addEventListener('keydown',e=>{ if(!lb.classList.contains('open'))return; if(e.key==='Escape')close(); else if(e.key==='ArrowRight')show(idx+1); else if(e.key==='ArrowLeft')show(idx-1); });
  }

  /* ---------------- reels — iOS-style vertical player ---------------- */
  function wireReels(){
    const stage=document.getElementById('reelsStage'); if(!stage) return;
    const reels=$$('.reel',stage); if(!reels.length) return;
    let muted=true;
    function setMuted(m){ muted=m; reels.forEach(r=>{const v=r.querySelector('video'); if(v)v.muted=m;});
      $$('.mute',stage).forEach(b=>{ b.classList.toggle('on',!m); b.textContent=m?'🔇':'🔊'; b.setAttribute('aria-label',m?'Unmute':'Mute'); }); }
    reels.forEach((r,i)=>{
      const v=r.querySelector('video'), prog=r.querySelector('.prog i');
      v.muted=true; v.playsInline=true; v.setAttribute('playsinline',''); v.preload= i<2?'auto':'metadata';
      v.addEventListener('timeupdate',()=>{ if(v.duration) prog.style.width=(v.currentTime/v.duration*100)+'%'; });
      v.addEventListener('ended',()=>{ const next=reels[i+1]||reels[0]; next.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'}); });
      const pp=r.querySelector('.playpause');
      if(pp) pp.addEventListener('click',()=>{ if(v.paused){ v.play().catch(()=>{}); r.classList.remove('paused'); } else { v.pause(); r.classList.add('paused'); } });
      const mute=r.querySelector('.mute'); if(mute) mute.addEventListener('click',e=>{ e.stopPropagation(); setMuted(!muted); });
      r.querySelectorAll('[data-toggle]').forEach(b=>b.addEventListener('click',e=>{ e.stopPropagation(); b.classList.toggle('on'); }));
    });
    const io=new IntersectionObserver(es=>{ es.forEach(en=>{ const v=en.target.querySelector('video');
        if(en.intersectionRatio>=0.6){ en.target.classList.remove('paused'); v.play().catch(()=>{}); }
        else { v.pause(); if(en.intersectionRatio===0){ v.currentTime=0; const p=en.target.querySelector('.prog i'); if(p)p.style.width='0'; } }
      }); },{threshold:[0,0.6,1],root:stage});
    reels.forEach(r=>io.observe(r));
    document.addEventListener('keydown',e=>{
      if(!stage.offsetParent) return;
      const cur=reels.find(r=>{const b=r.getBoundingClientRect(),s=stage.getBoundingClientRect();return b.top>=s.top-5 && b.top<s.top+s.height/2;});
      const idx=reels.indexOf(cur);
      if(e.key==='ArrowDown'){ e.preventDefault(); (reels[idx+1]||reels[0]).scrollIntoView({behavior:'smooth',block:'start'}); }
      else if(e.key==='ArrowUp'){ e.preventDefault(); (reels[idx-1]||reels[reels.length-1]).scrollIntoView({behavior:'smooth',block:'start'}); }
    });
    setMuted(true);
  }

  /* ---------------- theme toggle ---------------- */
  function currentTheme(){ return document.documentElement.dataset.theme==='dark'?'dark':'light'; }
  function applyTheme(t){ document.documentElement.dataset.theme=t; try{localStorage.setItem('ba-theme',t)}catch(e){} $$('.theme-btn').forEach(b=>{b.textContent=t==='dark'?'☀':'☾'; b.setAttribute('aria-label',t==='dark'?'Switch to light mode':'Switch to dark mode'); b.setAttribute('aria-pressed',String(t==='dark'));}); }
  function wireTheme(){
    $$('.nav-right').forEach(nr=>{
      if(nr.querySelector('.theme-btn')) return;
      const b=document.createElement('button'); b.className='theme-btn'; b.type='button';
      b.addEventListener('click',()=>applyTheme(currentTheme()==='dark'?'light':'dark'));
      nr.insertBefore(b, nr.firstChild);
    });
    applyTheme(currentTheme());
  }

  /* ---------------- init ---------------- */
  function init(){
    renderProducts(); populatePDP(); wireChrome(); wireReveal(); wireScroll(); wireStickers(); wireStoryViewer(); wireReels(); wireGallery(); wireTheme();
    updateCount(); renderDrawer();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
