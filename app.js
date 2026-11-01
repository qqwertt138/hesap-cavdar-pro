const $=s=>document.querySelector(s),KEY='hesapcavdarpro_v1';
let db;try{db=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!db){db={firms:[{id:'f1',name:'Maydanoz Döner',price:80},{id:'f2',name:"Domino's Pizza",price:100},{id:'f3',name:'Köfteci Yusuf',price:90}],entries:[],closed:{}}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){toast('Kayıt hatası!')}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6),pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),today=()=>iso(new Date());
const fd=s=>s.split('-').reverse().join('.'),tl=n=>(Math.round(n*100)/100).toLocaleString('tr-TR')+' TL';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const AY=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
let tab='home',sel=null,n0=new Date(),cal={y:n0.getFullYear(),m:n0.getMonth(),d:today()},rep={mode:'day',ref:today(),from:today(),to:today()};
const sum=a=>a.reduce((r,e)=>(r.pkg+=e.c,r.tot+=e.c*e.p,r),{pkg:0,tot:0});
function group(a,wp){const m={};a.forEach(e=>{const k=wp?e.n+'|'+e.p:e.n;const g=m[k]=m[k]||{n:e.n,p:e.p,c:0,t:0};g.c+=e.c;g.t+=e.c*e.p});return Object.values(m)}
const st=(l,v,w)=>`<div class="st ${w?'w':''}"><small>${l}</small><b>${v}</b></div>`;
function toast(t){const e=$('#t');e.textContent=t;e.classList.add('s');setTimeout(()=>e.classList.remove('s'),1800)}
function modal(h){$('#m').innerHTML='<div class="box">'+h+'</div>';$('#m').hidden=false}
const closeM=()=>{$('#m').hidden=true};
function dayList(d){const a=db.entries.filter(e=>e.d==d);return a.length?a.map(e=>`<div class="row"><span>${esc(e.n)}<small>${e.c} paket × ${e.p} TL</small></span><b>${tl(e.c*e.p)}</b><button data-a="edit" data-id="${e.id}">✎</button><button data-a="del" data-id="${e.id}">🗑</button></div>`).join(''):'<p class="mut">Kayıt yok.</p>'}
function addForm(p){return db.firms.length?`<div class="two"><select id="${p}f">${db.firms.map(f=>`<option value="${f.id}">${esc(f.name)} (${f.price} TL)</option>`).join('')}</select><input id="${p}c" type="number" inputmode="numeric" min="1" value="1"></div><button class="btn" data-a="${p}add">+ Paket Ekle</button>`:'<p class="mut">Önce firma ekleyin.</p>'}
function addEntry(d,fid,c){const f=db.firms.find(x=>x.id==fid);c=parseInt(c);if(!f||!(c>0)){toast('Paket sayısı girin');return false}db.entries.push({id:uid(),d,f:f.id,n:f.name,c,p:f.price});save();return true}
function home(){const t=today(),es=db.entries.filter(e=>e.d==t),s=sum(es),bf=group(es);
if(!db.firms.find(f=>f.id==sel))sel=db.firms[0]&&db.firms[0].id;const f=db.firms.find(x=>x.id==sel);
return `<div class="stats">${st('Bugünkü Toplam Kazanç',tl(s.tot),1)}${st('Toplam Paket',s.pkg)}${st('Çalışılan Firma',bf.length)}${st('Ort. Paket Kazancı',s.pkg?tl(s.tot/s.pkg):'0 TL',1)}</div>
<section class="card"><h3>Hızlı Giriş</h3>${f?`<div class="chips">${db.firms.map(x=>`<button class="chip ${x.id==sel?'on':''}" data-a="sel" data-id="${x.id}">${esc(x.name)}<small>${x.price} TL</small></button>`).join('')}</div><div class="step"><button data-a="minus">−</button><input id="cnt" type="number" inputmode="numeric" min="1" value="1"><button data-a="plus">+</button></div><div class="prev" id="prev">${tl(f.price)}</div><button class="btn big" data-a="add">KAYDET</button>`:'<p class="mut">Önce Firmalar sekmesinden firma ekleyin.</p>'}</section>
<button class="btn end" data-a="endday">GÜN SONU</button>
<section class="card"><h3>Firmalar (bugün)</h3>${db.firms.map(x=>{const g=bf.find(b=>b.n==x.name)||{c:0,t:0};return `<div class="row"><span>${esc(x.name)}<small>${x.price} TL / paket</small></span><span style="text-align:right;flex:none"><b>${tl(g.t)}</b><small>${g.c} paket</small></span></div>`}).join('')||'<p class="mut">Firma yok.</p>'}</section>
<section class="card"><h3>Bugünkü Kayıtlar</h3>${dayList(t)}</section>`}
function report(d){const es=db.entries.filter(e=>e.d==d),s=sum(es);
return `Tarih: ${fd(d)}\n\n`+(es.length?group(es,1).map(g=>`${g.n}: ${g.c} paket × ${g.p} TL = ${tl(g.t)}`).join('\n\n'):'Kayıt yok.')+`\n\nTOPLAM PAKET: ${s.pkg}\nTOPLAM KAZANÇ: ${tl(s.tot)}`}
function showReport(d){window._r=report(d);modal(`<h3>Gün Raporu</h3><pre>${esc(window._r)}</pre><button class="btn" data-a="copy">Kopyala / Paylaş</button><button class="btn alt" data-a="close">Kapat</button>`)}
function rng(){const r=new Date(rep.ref+'T12:00');let a,b;
if(rep.mode=='day')a=b=rep.ref;
else if(rep.mode=='week'){const x=new Date(r);x.setDate(r.getDate()-(r.getDay()+6)%7);const y=new Date(x);y.setDate(x.getDate()+6);a=iso(x);b=iso(y)}
else if(rep.mode=='month'){a=iso(new Date(r.getFullYear(),r.getMonth(),1));b=iso(new Date(r.getFullYear(),r.getMonth()+1,0))}
else{a=rep.from;b=rep.to;if(a>b)[a,b]=[b,a]}return[a,b]}
function reps(){const[a,b]=rng(),es=db.entries.filter(e=>e.d>=a&&e.d<=b),s=sum(es),days=new Set(es.map(e=>e.d)).size,bf=group(es).sort((x,y)=>y.t-x.t),bp=[...bf].sort((x,y)=>y.c-x.c);
const ds=[];for(let d=new Date(a+'T12:00'),e=new Date(b+'T12:00');d<=e;d.setDate(d.getDate()+1))ds.push(iso(d));
const v=ds.slice(-62).map(d=>({d,t:sum(es.filter(e=>e.d==d)).tot})),mx=Math.max(1,...v.map(x=>x.t));
const M=[['day','Günlük'],['week','Haftalık'],['month','Aylık'],['custom','Özel']];
return `<div class="tabs">${M.map(m=>`<button class="${rep.mode==m[0]?'on':''}" data-a="mode" data-id="${m[0]}">${m[1]}</button>`).join('')}</div>
<div class="card">${rep.mode=='custom'?`<div class="two"><input type="date" data-k="from" value="${rep.from}"><input type="date" data-k="to" value="${rep.to}"></div>`:`<input type="date" data-k="ref" value="${rep.ref}">`}<p class="mut" style="margin:8px 0 0">${fd(a)}${a==b?'':' – '+fd(b)}</p></div>
<div class="stats">${st('Toplam Kazanç',tl(s.tot),1)}${st('Toplam Paket',s.pkg)}${st('Çalışılan Gün',days)}${st('Günlük Ort. Kazanç',tl(days?s.tot/days:0))}${st('Günlük Ort. Paket',days?(s.pkg/days).toLocaleString('tr-TR',{maximumFractionDigits:1}):0)}${st('En Çok Paket',bp[0]?esc(bp[0].n):'-')}${st('En Çok Kazandıran',bf[0]?esc(bf[0].n):'-')}</div>
<section class="card"><h3>Kazanç Grafiği</h3><div class="chart">${v.map(x=>`<div class="bar">${v.length<=10?`<em>${Math.round(x.t)}</em>`:''}<i style="height:${x.t/mx*80}%"></i><small>${+x.d.slice(8)}</small></div>`).join('')}</div></section>
<section class="card"><h3>Firma Bazında</h3>${bf.map(g=>`<div class="row"><span>${esc(g.n)}<small>${g.c} paket</small></span><b>${tl(g.t)}</b></div>`).join('')||'<p class="mut">Kayıt yok.</p>'}</section>
<button class="btn" data-a="csv">📥 Excel (CSV) olarak indir</button>`}
function hist(){const{y,m,d}=cal,off=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate(),has=new Set(db.entries.map(e=>e.d)),t=today();let c='';
['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].forEach(x=>c+=`<small>${x}</small>`);for(let i=0;i<off;i++)c+='<button class="day x"></button>';
for(let i=1;i<=n;i++){const k=`${y}-${pad(m+1)}-${pad(i)}`;c+=`<button class="day ${has.has(k)?'has':''} ${k==t?'td':''} ${k==d?'on':''}" data-a="cday" data-id="${k}">${i}</button>`}
const s=sum(db.entries.filter(e=>e.d==d));
return `<section class="card"><div class="cn"><button data-a="pm">‹</button><b>${AY[m]} ${y}</b><button data-a="nm">›</button></div><div class="cal">${c}</div></section>
<section class="card"><h3>${fd(d)}</h3><p style="margin:0 0 8px"><b style="color:var(--o);font-size:22px">${tl(s.tot)}</b> <span class="mut">· ${s.pkg} paket</span></p>${dayList(d)}<h4>Bu güne paket ekle</h4>${addForm('h')}<button class="btn alt" style="margin-top:10px" data-a="rday">📋 Gün raporunu aç</button></section>`}
function firms(){return `<section class="card"><h3>Firmalar</h3>${db.firms.map(f=>`<div class="row"><span>${esc(f.name)}<small>Paket başı ücret</small></span><b>${f.price} TL</b><button data-a="fedit" data-id="${f.id}">✎</button><button data-a="fdel" data-id="${f.id}">🗑</button></div>`).join('')||'<p class="mut">Henüz firma yok.</p>'}</section><button class="btn" data-a="fadd">+ Firma Ekle</button><p class="mut">Ücreti değiştirirseniz eski kayıtlar etkilenmez; yeni ücret sadece bundan sonraki paketlere uygulanır.</p>`}
function bak(){return `<section class="card"><h3>Yedekleme</h3><p class="mut">${db.entries.length} paket kaydı, ${db.firms.length} firma kayıtlı. Telefonu değiştirmeden önce mutlaka yedek alın.</p><button class="btn" data-a="bexp">💾 Yedeği indir</button><button class="btn alt" data-a="bimp">📂 Yedeği geri yükle</button><input type="file" id="bf" accept=".json" hidden></section>`}
function firmModal(id){const f=db.firms.find(x=>x.id==id)||{name:'',price:''};modal(`<h3>${id?'Firmayı Düzenle':'Yeni Firma'}</h3><label>Firma adı</label><input id="fn" value="${esc(f.name)}"><label>Paket başı ücret (TL)</label><input id="fp" inputmode="decimal" value="${f.price}"><button class="btn" data-a="fsave" data-id="${id||''}">Kaydet</button><button class="btn alt" data-a="close">Vazgeç</button>`)}
function dl(name,txt,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove()},500)}
function render(){const V={home,rep:reps,hist,firms,bak};$('#v').innerHTML=V[tab]();document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==tab))}
const num=v=>parseFloat(String(v).replace(',','.'));
const A={
tab(b){tab=b.dataset.t;render();scrollTo(0,0)},
sel(b){sel=b.dataset.id;render()},
minus(){const i=$('#cnt');i.value=Math.max(1,(+i.value||1)-1);pv()},plus(){const i=$('#cnt');i.value=(+i.value||0)+1;pv()},
add(){if(addEntry(today(),sel,$('#cnt').value)){toast('Kaydedildi ✓');render()}},
hadd(){if(addEntry(cal.d,$('#hf').value,$('#hc').value)){toast('Eklendi ✓');render()}},
endday(){const t=today();db.closed[t]={at:Date.now()};save();showReport(t)},
rday(){showReport(cal.d)},close:closeM,
copy(){if(navigator.share)navigator.share({text:window._r}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(window._r).then(()=>toast('Kopyalandı'))},
edit(b){const e=db.entries.find(x=>x.id==b.dataset.id),c=parseInt(prompt('Paket sayısı:',e.c)),p=num(prompt('Paket ücreti (TL):',e.p));if(c>0&&p>=0){e.c=c;e.p=p;save();render()}else toast('Değişmedi')},
del(b){if(confirm('Bu kayıt silinsin mi?')){db.entries=db.entries.filter(x=>x.id!=b.dataset.id);save();render()}},
mode(b){rep.mode=b.dataset.id;render()},
csv(){const[a,b]=rng(),es=db.entries.filter(e=>e.d>=a&&e.d<=b).sort((x,y)=>x.d.localeCompare(y.d)),f=x=>String(x).replace('.',','),s=sum(es);
dl(`rapor_${a}_${b}.csv`,'\ufeff'+['Tarih;Firma;Paket;Paket Ücreti (TL);Tutar (TL)',...es.map(e=>[fd(e.d),e.n,e.c,f(e.p),f(e.c*e.p)].join(';')),`TOPLAM;;${s.pkg};;${f(s.tot)}`].join('\r\n'),'text/csv;charset=utf-8')},
cday(b){cal.d=b.dataset.id;render()},
pm(){if(--cal.m<0){cal.m=11;cal.y--}render()},nm(){if(++cal.m>11){cal.m=0;cal.y++}render()},
fadd(){firmModal()},fedit(b){firmModal(b.dataset.id)},
fsave(b){const n=$('#fn').value.trim(),p=num($('#fp').value);if(!n||!(p>=0)){toast('Ad ve ücret girin');return}const f=db.firms.find(x=>x.id==b.dataset.id);if(f){f.name=n;f.price=p}else db.firms.push({id:uid(),name:n,price:p});save();closeM();render()},
fdel(b){if(confirm('Firma silinsin mi? Geçmiş kayıtlar silinmez.')){db.firms=db.firms.filter(x=>x.id!=b.dataset.id);save();render()}},
bexp(){dl(`hesap-cavdar-yedek-${today()}.json`,JSON.stringify(db),'application/json')},
bimp(){$('#bf').click()}};
function pv(){const f=db.firms.find(x=>x.id==sel),c=+$('#cnt').value||0;$('#prev').textContent=c+' × '+f.price+' = '+tl(c*f.price)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&A[b.dataset.a])A[b.dataset.a](b)});
document.addEventListener('input',e=>{if(e.target.id=='cnt')pv()});
document.addEventListener('change',e=>{const t=e.target;if(t.dataset.k){rep[t.dataset.k]=t.value||today();render()}
if(t.id=='bf'&&t.files[0]){const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.firms)||!Array.isArray(d.entries))throw 0;if(confirm('Mevcut veriler yedekle değiştirilsin mi?')){db=d;db.closed=db.closed||{};save();render();toast('Geri yüklendi ✓')}}catch(x){toast('Geçersiz yedek dosyası')}};r.readAsText(t.files[0])}});
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
render();
