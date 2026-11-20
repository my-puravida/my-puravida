/* Menu + unique (cercle, en haut a droite) : Accueil et calendrier annuel */
(function(){
  var st=document.createElement('style');
  st.textContent='.pbtn{position:absolute;top:12px;right:14px;z-index:7;width:46px;height:46px;border-radius:50%;border:1.5px solid #d9b0b6;background:radial-gradient(circle at 30% 25%,#fff,#f3e7e7);color:#ac727e;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;box-shadow:0 6px 14px -6px rgba(172,114,126,.65)}'
  +'.pbtn svg{width:24px;height:24px}'
  +'.pbk{position:fixed;inset:0;z-index:5;background:transparent}'
  +'.pmenu.p4{left:auto;right:14px;top:66px;grid-template-columns:repeat(4,70px);gap:14px 4px;padding:14px 10px;border-radius:18px}'
  +'.pmenu.p4 .pmi em{font-size:10px;letter-spacing:0;text-transform:none;white-space:nowrap}'
  +'.hwrap{position:relative}'
  +'.hch .bcw{width:36px;height:36px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.95);background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7 60%,#e7e3e0);display:inline-flex;align-items:center;justify-content:center;padding:0;cursor:pointer;opacity:1;transition:all .2s}.hch .bcw svg{width:100%;height:100%;display:block;filter:saturate(.3);opacity:.7;transition:all .2s}.hch .bcw.on{border-color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.6),0 8px 14px -6px rgba(172,114,126,.7)}.hch .bcw.on svg{filter:none;opacity:1}'
  +'.hch .bc.bl{color:#929093}'
  +'.hch .bc{width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.75);background:rgba(255,255,255,.6);color:#ac727e;display:inline-flex;align-items:center;justify-content:center;padding:0;cursor:pointer;box-shadow:0 4px 10px -5px rgba(137,90,100,.5)}.hch .bc svg{width:24px;height:24px}'
  +'.hwrap .pr2.prl{display:block}.prl .pr2-b{width:100%}.prr{display:flex;align-items:center;gap:12px;padding:9px 0;border-top:1px solid #f3e7e7}.prr:first-of-type{border-top:0}.prl small+.prr{margin-top:6px}.prr span{font-size:15px;line-height:1.3;color:var(--text)}.prr.dn span{text-decoration:line-through;opacity:.5}'
  +'.actc img.pl2{width:78%;height:78%;object-fit:contain}.ics .ic{border:0;background:none;padding:2px 0}.ics .ic.on{background:none}.ics .ic span{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(255,255,255,.7);border:1px solid #e8ced1;filter:grayscale(.3);opacity:.6;overflow:hidden}.ics .ic.on span{opacity:1;filter:none;background:radial-gradient(circle at 32% 26%,#fff,#e8ced1);border-color:#d9b0b6;box-shadow:0 4px 8px -4px rgba(137,90,100,.55)}.ics .ic span img{width:78%;height:78%;object-fit:contain}.ics .ic span img.full{width:100%;height:100%;object-fit:cover;border-radius:50%}'+'.dd.kk.k-dog,.dd.kk.k-cat{border:0;border-radius:50%;width:34px;min-width:34px;height:34px;line-height:34px;padding:0;color:#39393b;text-align:center;box-shadow:none}.dd.kk.k-dog{background:#c48f97}.dd.kk.k-cat{background:#e8ced1}.ub.k-dog,.ub.k-cat{border:0;border-radius:50%;box-shadow:none;color:#39393b}.ub.k-dog{background:#c48f97}.ub.k-cat{background:#e8ced1}'
  +'.hwrap .act{margin-top:34px;margin-bottom:8px}'
  +'.hwrap .dsec{margin-top:30px}'
  +'.hwrap .pr2{margin:34px 6px 10px}'
  +'.hwrap .fc-c{margin-top:40px}'
  +'.hwrap .hmb.bk{margin:56px 0 14px}'
  +'.hwrap .hmf{margin:34px 0 28px}';
  document.head.appendChild(st);
  var plusFor=-1;
  togPlus=function(){plusOpen=!plusOpen;plusFor=cur;render()};
  function items(){return [
    ['Panier',CARTSVG,'#ac727e','goHomeShop()'],
    ['Notes',NOTESVG,'#707072',"ovOpen('note')"],
    ['Minuteur',HGSVG,'#c48f97','tmOpen()'],
    ['Calcul',CALCSVG,'#895a64',"ovOpen('calc')"],
    ['Bitcoin',BTCSVG,'#895a64',"ovOpen('btc')"],
    ['Devises',FXSVG,'#707072',"ovOpen('fx')"],
    ['Statistiques',STSVG,'#929093',"ovOpen('ystat')"],
    ['Loupe',SRSVG,'#ac727e',"ovOpen('search')"],
    ['Plage',WAVESVG,'#929093',"ovOpen('beach')"],
    ['Mar\u00e9es',TIDESVG,'#707072',"ovOpen('tide')"],
    ['Lune',MOONSVG,'#929093',"ovOpen('moon')"]];}
  function pbtn(){return '<button class="pbtn" aria-label="Plus" onclick="togPlus()">'+PLUSSVG+'</button>'}
  function pmenu(){
    if(!(plusOpen&&plusFor===cur))return '';
    return '<div class="pbk" onclick="plusOpen=false;render()"></div><div class="pmenu p4">'+items().map(function(x){
      return '<button class="pmi" style="--c:'+x[2]+';--c1:'+x[2]+'22;--c2:'+x[2]+'66" onclick="plusOpen=false;render();'+x[3]+'"><span class="ii">'+x[1]+'</span><em>'+x[0]+'</em></button>'}).join('')+'</div>';
  }
  cartBtn=function(){return pbtn()+pmenu()};
  var _hp=homePage;
  homePage=function(){
    var h=_hp();
    h=h.replace('<div class="hero">','<div class="hero">'+pbtn());
    return '<div class="hwrap">'+pmenu()+h+'</div>';
  };
})();
/* Recherche universelle : tous les mots enregistres dans l'application */
(function(){
  var SKIP=/^ag-(fx|ch|lastbk|beach|vm|sm|pl|il|hl|bm|fi|th|al|groc-m|sec-meta|sec-data|nlk)$/;
  function leaves(v,out){
    if(v==null)return;
    if(typeof v==='string'){if(v.length>1&&v.indexOf('data:')!==0&&!/^[A-Za-z0-9+\/=]{200,}$/.test(v))out.push(v)}
    else if(Array.isArray(v)){v.forEach(function(x){leaves(x,out)})}
    else if(typeof v==='object'){Object.keys(v).forEach(function(k){leaves(v[k],out)})}
  }
  function info(k){
    var m;
    if((m=/^agd-(\d+)-(\d+)-(\d+)$/.exec(k)))return {c:'#e8ced1',l:(+m[3])+' '+MONTHS[+m[2]-1].toLowerCase()+' '+m[1],y:+m[1],s:+m[1]*10000+(+m[2])*100+(+m[3]),go:'srGo('+m[1]+','+(+m[2]-1)+','+m[3]+')'};
    if((m=/^agw-(\d{4})-(\d{2})-(\d{2})$/.exec(k)))return {c:'#d4d3d1',l:'Semaine du '+(+m[3])+' '+MONTHS[+m[2]-1].toLowerCase()+' '+m[1],y:+m[1],s:+m[1]*10000+(+m[2])*100+(+m[3]),go:"srGoW('"+m[1]+'-'+m[2]+'-'+m[3]+"')"};
    if((m=/^ag-(\d{4})-(\d{1,2})$/.exec(k)))return {c:'#e8ced1',l:MONTHS[+m[2]]+' '+m[1],y:+m[1],s:+m[1]*10000+(+m[2]+1)*100,go:'srGoM('+m[1]+','+(+m[2])+')'};
    var o={'ag-qnotes':['Note rapide','#f1f0ee',"OV='note';ntTab='quick';ovUI()"],'ag-notes':['Note','#e8ced1',"OV=null;ovUI();ovOpen('note')"],'ag-bl':['Bucket list','#e8ced1',"OV=null;ovUI();cur=1;blOn=true;render()"],'ag-groc':['\u00c9picerie','#e7e3e0',"OV=null;ovUI();goHomeShop()"],'ag-gen':['Liste','#e7e3e0',"OV=null;ovUI();goHomeShop()"],'ag-ideas':['Id\u00e9es','#e8ced1',"OV=null;ovUI()"],'ag-beachn':['Plage','#d4d3d1',"OV=null;ovUI()"],'ag-vb':['Vision board','#d4d3d1',"OV=null;ovUI();cur=1;render()"],'ag-thought':['Phrase d\u2019intention','#e8ced1',"OV=null;ovUI();cur=0;render()"]}[k];
    if(o)return {c:o[1],l:o[0],y:0,s:0,go:o[2]};
    return {c:'#e8ced1',l:k.replace(/^ag[dw]?-/,''),y:0,s:0,go:"OV=null;ovUI()"};
  }
  srGoW=function(w){
    OV=null;ovUI();
    var p=w.split('-'),s=new Date(+p[0],+p[1]-1,+p[2]);
    yt();tabForYear(s.getFullYear());
    wd=s;wk=iso(s);cy=s.getFullYear();cm=s.getMonth();
    try{var q=localStorage.getItem('agw-'+wk);cw=q?JSON.parse(q):null}catch(e){cw=null}
    if(!cw)cw={t:{},c:{}};
    wsub=false;wst=false;shopHome=false;dk=null;ya=null;mo=null;render();window.scrollTo(0,0);
  };
  srGoM=function(y,m){
    OV=null;ovUI();yt();dk=null;wk=null;ya=null;ws=false;
    if(TABS.indexOf(String(y))>=2){tabForYear(y);openM(m)}
    else{cur=TABS.indexOf('Passé');pastY=y;pastSub='cal';mo=null;render();window.scrollTo(0,0)}
  };
  function snip(t,words){
    var n=srN(t),i=-1;
    for(var j=0;j<words.length&&i<0;j++)i=n.indexOf(words[j]);
    if(i<0)i=0;
    var a=Math.max(0,i-28),b=Math.min(t.length,i+70);
    var s=(a>0?'\u2026':'')+t.slice(a,b).replace(/\s+/g,' ')+(b<t.length?'\u2026':'');
    var h=esc(s);
    var ns=srN(s),parts=[],pos=0,res='';
    words.forEach(function(w){var p=ns.indexOf(w);if(p>=0)parts.push([p,p+w.length])});
    parts.sort(function(x,y){return x[0]-y[0]});
    parts.forEach(function(r){if(r[0]>=pos){res+=esc(s.slice(pos,r[0]))+'<mark>'+esc(s.slice(r[0],r[1]))+'</mark>';pos=r[1]}});
    return res+esc(s.slice(pos));
  }
  var _rows=srRows;
  srRows=function(){
    if(srType||!srQ.trim())return _rows();
    var words=srN(srQ).split(/\s+/).filter(Boolean),res=[],yr=srYear();
    try{for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(!/^(ag|agw|agd)-/.test(k)||SKIP.test(k))continue;
      var inf=info(k);
      if(srScope==='year'&&inf.y&&inf.y!==yr)continue;
      var raw=localStorage.getItem(k),v;
      try{v=JSON.parse(raw)}catch(e){v=raw}
      var L=[];leaves(v,L);
      if(!L.length)continue;
      var blob=srN(L.join('\n'));
      if(!words.every(function(w){return blob.indexOf(w)>=0}))continue;
      var best=null;
      for(var j=0;j<L.length;j++){var nj=srN(L[j]);if(words.some(function(w){return nj.indexOf(w)>=0})){best=L[j];break}}
      res.push({i:inf,t:snip(best||L[0],words)});
    }}catch(e){}
    res.sort(function(a,b){return (a.i.y?0:1)-(b.i.y?0:1)||b.i.s-a.i.s});
    var n=res.length,rows=res.slice(0,100).map(function(r){return '<div class="srr" onclick="'+r.i.go+'"><i style="background:'+r.i.c+'"></i><b>'+esc(r.i.l)+'</b><span>'+r.t+'</span></div>'}).join('');
    return '<p class="sm">'+n+' r\u00e9sultat'+(n>1?'s':'')+'</p>'+(rows||'<p class="sub">Aucun r\u00e9sultat.</p>');
  };
  srScope='all';
  var st=document.createElement('style');
  st.textContent='.srr mark{background:#f3e7e7;color:inherit;border-radius:3px;padding:0 2px}.srr span{overflow:visible;white-space:normal;line-height:1.35;word-break:break-word}.srr b{flex:0 0 100px;min-width:0;font-size:12px;line-height:1.25}';
  document.head.appendChild(st);
})();
/* Page du jour : photos avant le texte */
(function(){
  var st=document.createElement('style');
  st.textContent='.dps{margin:16px 0 4px}'
  +'.dpgx{display:grid;grid-template-columns:1fr 1fr;gap:8px}'
  +'.dpp{position:relative;border-radius:16px;overflow:hidden;background:#f3e7e7;box-shadow:0 8px 16px -12px rgba(82,81,86,.6)}'
  +'.dpp img{width:100%;aspect-ratio:1;object-fit:cover;display:block}'
  +'.dpp.hero,.dpp.wide{grid-column:1/-1}.dpp.hero img{aspect-ratio:4/3}.dpp.wide img{aspect-ratio:16/10}'
  +'.dpp button{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;border:0;background:rgba(255,255,255,.88);color:#895a64;font-size:13px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.18);padding:0}'
  +'.dpadd{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;padding:13px;border:1.5px dashed #d9b0b6;border-radius:16px;color:#ac727e;font-size:13px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;background:rgba(255,255,255,.55)}'
  +'.dpadd svg{width:18px;height:18px}'
  +'.dlb{margin:22px 0 6px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}'
  +'textarea.dtx{border-radius:16px;padding:14px 16px;line-height:1.6;background:rgba(255,255,255,.65);border:1px solid #f3e7e7;min-height:220px}'
  +'.dmoon{text-align:left;margin:4px 0 10px}';
  document.head.appendChild(st);
  var CAM='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>';
  dayPage=function(){
    var t0=new Date(dy[0],dy[1],dy[2]),n=dday.p.length;
    var h='<button class="back" onclick="closeD()">\u2190 Retour</button>'+dnav();
    h+='<h2 class="mt">'+DFULL[t0.getDay()]+' <small>'+dy[2]+' '+MONTHS[dy[1]].toLowerCase()+' '+dy[0]+'</small></h2>'+(FM[dy[0]+'-'+(dy[1]+1)+'-'+dy[2]]?'<p class="sub dmoon">\ud83c\udf15 Pleine lune</p>':'');
    h+='<button class="star" onclick="dstar()">'+(dday.s?'<i class="rd"></i> Date marqu\u00e9e':'<i class="rd off"></i> Marquer cette date')+'</button>';
    h+='<input class="ti" placeholder="Titre de la journ\u00e9e\u2026" value="'+esc(dday.ti||'')+'" oninput="dtxt(\'ti\',this.value)">';
    h+='<section class="dps">';
    if(n){
      h+='<div class="dpg">'+dday.p.map(function(src,i){
        var c=i===0?' hero':((i===n-1&&(n-1)%2===1)?' wide':'');
        return '<div class="dpp'+c+'"><img src="'+src+'" alt=""><button aria-label="Retirer la photo" onclick="dpd('+i+')">\u2715</button></div>';
      }).join('')+'</div>';
    }
    h+='<label class="dpadd">'+CAM+(n?'Ajouter des photos':'Ajouter des photos')+'<input type="file" accept="image/*" multiple hidden onchange="dph(this)"></label></section>';
    h+='<p class="dlb">Ma journ\u00e9e</p>';
    h+='<textarea class="wn dtx" placeholder="\u00c9cris ta journ\u00e9e\u2026" oninput="dtxt(\'t\',this.value)">'+esc(dday.t||'')+'</textarea>';
    return h+dnav();
  };
})();
/* Page du jour v2 : resume du jour + photos qui defilent */
(function(){
  var st=document.createElement('style');
  st.textContent='.dsm{margin:14px 0 6px;padding:14px 16px 12px;border-radius:20px;background:linear-gradient(135deg,#f9f8f6,#f3e7e7);border:1px solid #e8ced1;box-shadow:0 10px 20px -16px rgba(137,90,100,.6)}'
  +'.dsm-l{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#ac727e;margin:0 0 8px}'
  +'.dsm-p{display:flex;align-items:center;gap:10px;padding:5px 0;font-size:15px;line-height:1.3;color:var(--text)}'
  +'.dsm-p i{flex:0 0 18px;height:18px;border-radius:50%;border:1.8px solid #d9b0b6;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:11px;color:#fff}'
  +'.dsm-p.dn i{background:#c48f97;border-color:#c48f97}.dsm-p.dn span{opacity:.55;text-decoration:line-through}'
  +'.dsm-r{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;align-items:center}'
  +'.dsm-a{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:19px;overflow:hidden;background:radial-gradient(circle at 32% 26%,#fff,#e8ced1);border:1px solid #d9b0b6;box-shadow:0 4px 8px -5px rgba(137,90,100,.55)}'
  +'.dsm-a img{width:80%;height:80%;object-fit:contain;display:block}.dsm-a img.full{width:100%;height:100%;object-fit:cover;border-radius:50%}'
  +'.dsm-a.bw{background:#fff;border-color:#e8ced1;padding:0}.dsm-a.bw svg{width:100%;height:100%;display:block}'
  +'.dsm-d{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.75);border:1px solid #e8ced1;font-size:13px}'
  +'.dcs{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;border-radius:20px}.dcs::-webkit-scrollbar{display:none}'
  +'.dcp{position:relative;flex:0 0 100%;scroll-snap-align:center;border-radius:20px;overflow:hidden;background:#f3e7e7}'
  +'.dcp img{width:100%;aspect-ratio:4/5;max-height:64vh;object-fit:cover;display:block}'
  +'.dcp button{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;border:0;background:rgba(255,255,255,.88);color:#895a64;font-size:13px;cursor:pointer;padding:0;box-shadow:0 2px 6px rgba(0,0,0,.18)}'
  +'.dcn{position:absolute;left:10px;bottom:10px;padding:3px 10px;border-radius:999px;background:rgba(255,255,255,.85);color:#895a64;font-size:11px;letter-spacing:.1em}'
  +'.dcdots{display:flex;justify-content:center;gap:7px;margin:10px 0 2px}.dcdots span{width:7px;height:7px;border-radius:50%;background:#e8ced1;transition:all .2s}.dcdots span.on{background:#c48f97;width:20px;border-radius:6px}';
  document.head.appendChild(st);
  dcScroll=function(el){var i=Math.round(el.scrollLeft/Math.max(el.clientWidth,1));var d=document.querySelectorAll('#dcd span');for(var j=0;j<d.length;j++)d[j].className=(j===i?'on':'')};
  function dayInfo(){
    var y=dy[0],m=dy[1],d=dy[2],t0=new Date(y,m,d),dow=t0.getDay(),sun=new Date(y,m,d-dow),W=null;
    try{W=JSON.parse(localStorage.getItem('agw-'+iso(sun)))}catch(e){}
    if(!W)W={t:{},c:{}};
    var items=[];
    for(var k=0;k<5;k++){var id='p'+dow+k,tx=((W.t||{})[id]||'').trim();if(tx)items.push({t:tx,d:!!(W.c||{})[id]})}
    var acts=ACTH.filter(function(a){return !!(W.c||{})[a[0]+dow]});
    var dates=(load(y,m).dates||[]).filter(function(o){return parseInt(o.d,10)===d});
    return {items:items,acts:acts,beach:isBeach(y,m,d),dates:dates};
  }
  function summary(){
    var I=dayInfo(),h='';
    var wxa=wxGet(dy[0],dy[1],dy[2]);
    if(wxa.some(function(v){return v>=0}))h+='<p class="dsm-l">Le temps</p><div class="dsm-w">'+wxa.map(function(v,i){return '<div>'+wxTile(v)+'<small>'+WXS[i]+'</small></div>'}).join('')+'</div>';
    var r='';
    I.acts.forEach(function(a){r+='<span class="dsm-a" title="'+a[2]+'">'+actIcon(a)+'</span>'});
    if(I.beach)r+='<span class="dsm-a bw" title="Jour de plage">'+WVBLUE+'</span>'+(bcName(dy[0],dy[1],dy[2])?'<span class="dsm-d">'+esc(bcName(dy[0],dy[1],dy[2]))+'</span>':'');
    I.dates.forEach(function(o){var m=DTL[o.k]||DTL.other;r+='<span class="dsm-d">'+m[1]+' '+esc(o.t||m[0])+'</span>'});
    if(r)h+='<div class="dsm-r">'+r+'</div>';
    return h?'<section class="dsm">'+h+'</section>':'';
  }
  var CAM='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>';
  dayPage=function(){
    var t0=new Date(dy[0],dy[1],dy[2]),n=dday.p.length;
    var h='<button class="back" onclick="closeD()">\u2190 Retour</button>'+dnav();
    h+='<h2 class="mt">'+DFULL[t0.getDay()]+' <small>'+dy[2]+' '+MONTHS[dy[1]].toLowerCase()+' '+dy[0]+'</small></h2>'+(FM[dy[0]+'-'+(dy[1]+1)+'-'+dy[2]]?'<p class="sub dmoon">\ud83c\udf15 Pleine lune</p>':'');
    h+=summary();
    h+='<button class="star" onclick="dstar()">'+(dday.s?'<i class="rd"></i> Date marqu\u00e9e':'<i class="rd off"></i> Marquer cette date')+'</button>';
    h+='<input class="ti" placeholder="Titre de la journ\u00e9e\u2026" value="'+esc(dday.ti||'')+'" oninput="dtxt(\'ti\',this.value)">';
    h+='<section class="dps">';
    if(n){
      h+='<div class="dcs" onscroll="dcScroll(this)" ontouchstart="event.stopPropagation()" ontouchend="event.stopPropagation()">'+dday.p.map(function(src,i){
        return '<div class="dcp"><img src="'+src+'" alt=""><button aria-label="Retirer la photo" onclick="dpd('+i+')">\u2715</button>'+(n>1?'<span class="dcn">'+(i+1)+' / '+n+'</span>':'')+'</div>';
      }).join('')+'</div>';
      if(n>1)h+='<div class="dcdots" id="dcd">'+dday.p.map(function(_,i){return '<span'+(i===0?' class="on"':'')+'></span>'}).join('')+'</div>';
    }
    h+='<label class="dpadd">'+CAM+'Ajouter des photos<input type="file" accept="image/*" multiple hidden onchange="dph(this)"></label></section>';
    h+='<p class="dlb">Ma journ\u00e9e</p>';
    h+='<textarea class="wn dtx" placeholder="\u00c9cris ta journ\u00e9e\u2026" oninput="dtxt(\'t\',this.value)">'+esc(dday.t||'')+'</textarea>';
    return h+dnav();
  };
})();
/* Page du jour v3 : epuree (resume, photos, texte) */
(function(){
  var st=document.createElement('style');
  st.textContent='.dnr{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:4px 0 12px}'
  +'.dnr button{flex:0 0 36px;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:rgba(255,255,255,.65);color:var(--hd);font-size:22px;line-height:1;padding:0;cursor:pointer}'
  +'.dtt{text-align:center;min-width:0}.dtt b{display:block;font-family:"Lora",Georgia,serif;font-style:italic;font-weight:500;font-size:24px;color:var(--hd);line-height:1.1}'
  +'.dtt span{display:block;margin-top:2px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}'
  +'.dback{padding:2px 2px 0}'
  +'i.dmk{display:inline-flex;align-items:center;justify-content:center;padding:8px;margin:-8px -8px -8px 2px;vertical-align:middle;cursor:pointer}i.dmk::before{content:"";width:13px;height:13px;border-radius:50%;border:1.6px solid #d9b0b6;box-sizing:border-box;background:transparent}i.dmk.on::before{background:#c48f97;border-color:#c48f97}';
  document.head.appendChild(st);
  var _dp=dayPage;
  dayPage=function(){
    var h=_dp();
    var t0=new Date(dy[0],dy[1],dy[2]),moon=!!FM[dy[0]+'-'+(dy[1]+1)+'-'+dy[2]];
    // retire l'en-tete, le titre, le bouton "marquer", l'etiquette et la navigation du bas
    var tmp=document.createElement('div');tmp.innerHTML=h;
    var rm=['.back','.dnav','h2.mt','p.dmoon','button.star','input.ti','p.dlb'];
    rm.forEach(function(sel){var els=tmp.querySelectorAll(sel);for(var i=0;i<els.length;i++)els[i].parentNode.removeChild(els[i])});
    var head='<div class="dback"><button class="back" onclick="closeD()">\u2190 Retour</button></div>'
      +'<div class="dnr"><button onclick="dayMove(-1)" aria-label="Jour pr\u00e9c\u00e9dent">\u2039</button><div class="dtt"><b>'+DFULL[t0.getDay()]+'</b><span>'+dy[2]+' '+MONTHS[dy[1]].toLowerCase()+' '+dy[0]+(moon?' \u00b7 \ud83c\udf15':'')+'<i class="dmk'+(dday.s?' on':'')+'" role="button" aria-label="Marquer cette date" onclick="dstar()"></i></span></div><button onclick="dayMove(1)" aria-label="Jour suivant">\u203a</button></div>';
    return head+tmp.innerHTML;
  };
})();
/* Meteo du jour (matin, apres-midi, soir) */
var WXI=["img-wx0.webp", "img-wx1.webp", "img-wx2.webp", "img-wx3.webp", "img-wx4.webp", "img-wx5.webp", "img-wx6.webp"];
var WXL=["Ensoleill\u00e9", "Peu nuageux", "Nuageux", "Soleil et pluie", "Pluie", "Orage", "\u00c9toil\u00e9"];
var WXS=['Matin','Apr\u00e8s-midi','Soir','Nuit'];
var wxData=(function(){try{return JSON.parse(localStorage.getItem('ag-wx'))||{}}catch(e){return{}}})();
(function(){if(!wxData._v){Object.keys(wxData).forEach(function(k){if(!Array.isArray(wxData[k]))return;wxData[k]=wxData[k].map(function(v){return v===3?4:v===4?5:(v>=5?-1:v)});if(wxData[k].every(function(v){return v<0}))delete wxData[k]});wxData._v=2;try{localStorage.setItem('ag-wx',JSON.stringify(wxData))}catch(e){}}})();
var wxCtx=null;
function wxKey(y,m,d){return y+'-'+(m+1)+'-'+d}
function wxGet(y,m,d){var a=wxData[wxKey(y,m,d)];var r=a?a.slice():[];while(r.length<4)r.push(-1);return r}
function wxSave(){try{localStorage.setItem('ag-wx',JSON.stringify(wxData))}catch(e){}}
function wxTile(v,cls){return '<span class="wxs'+(cls?' '+cls:'')+(v<0?' e':'')+'">'+(v>=0?'<img src="'+WXI[v]+'" alt="'+WXL[v]+'">':'')+'</span>'}
function wxBtn(y,m,d){return ''}
var WVBLUE=WVSCENE.replace(/wvP/g,'wvQ').replace(/wvF/g,'wvG').replace('#d9b0b6','#d4d3d1').replace('#c48f97','#929093').replace('#f3e7e7','#f9f8f6').replace('#e8ced1','#e7e3e0');
function wxHero(t){var y=t.getFullYear(),m=t.getMonth(),d=t.getDate(),a=wxGet(y,m,d),b=isBeach(y,m,d),nm=bcName(y,m,d),op='bcOpen('+y+','+m+','+d+')';return '<div class="wxrow hw hwb"><button class="bcw'+(b?' on':'')+'" aria-label="Jour de plage" aria-pressed="'+(b?'true':'false')+'" onclick="'+op+'">'+(b?WVBLUE:WVSCENE)+'</button>'+(b?'<div class="bcl" onclick="'+op+'"><small>Plage</small><b>'+esc(nm||'Jour de plage')+'</b></div>':'')+'</div>'+'<div class="wxrow hw hwt">'+a.map(function(v,i){return '<div class="wxc" role="button" aria-label="Le temps : '+WXS[i]+'" onclick="wxOpen('+y+','+m+','+d+','+i+')">'+wxTile(v)+'<small>'+WXS[i]+'</small></div>'}).join('')+'</div>'}
function wxRow(t){var y=t.getFullYear(),m=t.getMonth(),d=t.getDate(),a=wxGet(y,m,d);if(!a.some(function(v){return v>=0}))return '';return '<div class="wxrow" onclick="wxOpen('+y+','+m+','+d+')">'+a.map(function(v,i){return '<div class="wxc">'+wxTile(v)+'<small>'+WXS[i]+'</small></div>'}).join('')+'</div>'}
function wxOpen(y,m,d,sl){var a=wxGet(y,m,d),s=(sl!=null?sl:a.indexOf(-1));wxCtx={y:y,m:m,d:d,a:a,s:s<0?0:s};wxDraw()}
function wxDraw(){
  var c=wxCtx,el=document.getElementById('wxsheet');
  if(!el){el=document.createElement('div');el.id='wxsheet';document.body.appendChild(el)}
  var h='<div class="wxbk" onclick="wxClose()"></div><div class="wxsh"><div class="wxgr"></div><p class="wxt">Le temps</p><div class="wxsl">';
  h+=WXS.map(function(n,i){return '<button class="wxsb'+(c.s===i?' on':'')+'" onclick="wxSlot('+i+')">'+wxTile(c.a[i])+n+'</button>'}).join('');
  h+='</div><div class="wxg">'+WXL.map(function(n,i){return '<button class="wxgb'+(c.a[c.s]===i?' sel':'')+'" onclick="wxPick('+i+')">'+wxTile(i)+n+'</button>'}).join('')+'</div>';
  h+='<button class="wxok" onclick="wxClose()">Termin\u00e9</button></div>';
  el.innerHTML=h;
}
function wxSlot(i){wxCtx.s=i;wxDraw()}
function wxPick(i){
  var c=wxCtx;
  if(c.a[c.s]===i){c.a[c.s]=-1}else{c.a[c.s]=i;if(c.s<3)c.s++}
  var k=wxKey(c.y,c.m,c.d);
  if(c.a.every(function(v){return v<0}))delete wxData[k];else wxData[k]=c.a.slice();
  wxSave();wxDraw();
}
function wxClose(){var el=document.getElementById('wxsheet');if(el)el.parentNode.removeChild(el);wxCtx=null;render()}
(function(){
  var st=document.createElement('style');
  st.textContent='.hero .wxrow.hw{display:flex;justify-content:flex-start;gap:22px;margin:18px 0 0;cursor:pointer}.hw .wxs{width:54px;height:54px;border:2px solid rgba(255,255,255,.95);box-shadow:0 8px 14px -10px rgba(57,57,59,.7)}.hw .wxs.e{background:rgba(255,255,255,.28);border:1.6px dashed rgba(255,255,255,.95);box-shadow:none}.hw .wxc small{color:#fff;font-size:10px;letter-spacing:.14em;text-transform:uppercase}.hw{gap:18px!important}.hw .bcw{width:54px;height:54px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.95);background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7 60%,#e7e3e0);display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;box-shadow:0 8px 14px -10px rgba(57,57,59,.7);transition:all .2s}.hw .bcw svg{width:100%;height:100%;display:block;filter:saturate(.3);opacity:.75}.hw .bcw.on{box-shadow:0 0 0 3px rgba(255,255,255,.6),0 8px 14px -6px rgba(112,112,114,.75)}.hw .bcw.on svg{filter:none;opacity:1}.hch:empty{display:none}.hch .wxg3{display:inline-flex;gap:6px;margin-left:10px;cursor:pointer;vertical-align:top}.hch .wxg3 .wxs{width:36px;height:36px;border:2px solid rgba(255,255,255,.95);box-shadow:0 4px 10px -6px rgba(137,90,100,.5);background:#f9f8f6}.hch .wxg3 .wxs.e{background:rgba(255,255,255,.3);border:1.6px dashed rgba(255,255,255,.95);box-shadow:none}.hch .wxb{width:36px;height:36px;padding:0;margin-left:8px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.95);background:#f9f8f6;cursor:pointer;vertical-align:top;box-shadow:0 4px 10px -6px rgba(137,90,100,.5)}.hch .wxb img{width:100%;height:100%;display:block;filter:saturate(.4);opacity:.75}.hch .wxb.on{box-shadow:0 0 0 3px rgba(255,255,255,.6),0 8px 14px -6px rgba(146,144,147,.7)}.hch .wxb.on img{filter:none;opacity:1}.wxrow{display:flex;justify-content:center;gap:26px;margin:20px 0 6px;cursor:pointer}.wxc{display:flex;flex-direction:column;align-items:center;gap:6px}.wxc .wxs{width:56px;height:56px;box-shadow:0 8px 14px -10px rgba(112,112,114,.7)}.wxc small{font-size:10px;letter-spacing:.14em;text-uppercase:none;text-transform:uppercase;color:var(--muted)}'
  +'.wxs{display:block;width:26px;height:26px;border-radius:50%;overflow:hidden;background:#f9f8f6;flex:0 0 auto}.wxs img{width:100%;height:100%;display:block}.wxs.e{background:transparent;border:1.4px dashed rgba(172,114,126,.55);box-sizing:border-box}'
  +'.wxbk{position:fixed;inset:0;background:rgba(57,57,59,.35);z-index:50}'
  +'.wxsh{position:fixed;left:0;right:0;bottom:0;z-index:51;background:#f9f8f6;border-radius:24px 24px 0 0;padding:10px 18px 24px;box-shadow:0 -12px 30px -10px rgba(57,57,59,.35);max-height:88vh;overflow:auto}'
  +'.wxgr{width:42px;height:4px;border-radius:2px;background:#e8ced1;margin:0 auto 10px}'
  +'.wxt{font-family:"Lora",Georgia,serif;font-style:italic;font-size:22px;text-align:center;margin:0 0 14px;color:var(--hd)}'
  +'.wxsl{display:flex;justify-content:center;gap:22px;margin-bottom:18px}'
  +'.wxsb{border:0;background:none;display:flex;flex-direction:column;align-items:center;gap:7px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);cursor:pointer;padding:0}'
  +'.wxsb .wxs{width:62px;height:62px;box-shadow:0 0 0 2px #fff,0 0 0 3px #e8ced1}.wxsb.on .wxs{box-shadow:0 0 0 2px #fff,0 0 0 4px #c48f97}.wxsb.on{color:#ac727e}'
  +'.wxg{display:grid;grid-template-columns:repeat(4,1fr);gap:14px 6px}'
  +'.wxgb{border:0;background:none;display:flex;flex-direction:column;align-items:center;gap:5px;font-size:11px;line-height:1.2;text-align:center;color:var(--text);cursor:pointer;padding:0}'
  +'.wxgb .wxs{width:64px;height:64px}.wxgb.sel .wxs{box-shadow:0 0 0 3px #c48f97}'
  +'.wxok{display:block;margin:18px auto 0;padding:11px 34px;border-radius:999px;border:0;background:#39393b;color:#fff;font-size:12px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}'
  +'.dsm-w{display:flex;gap:20px;margin:0 0 12px}.dsm-w div{display:flex;flex-direction:column;align-items:center;gap:4px}.dsm-w .wxs{width:46px;height:46px}.dsm-w small{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}';
  document.head.appendChild(st);
})();
/* Fond rose pale des icones d'activites + priorites faites bien visibles */
(function(){
  var st=document.createElement('style');
  st.textContent='.actc{background:#f3e7e7;border-color:#e8ced1;opacity:.9;filter:grayscale(.1)}'
  +'.actb.on .actc{background:radial-gradient(circle at 32% 26%,#fff,#e8ced1);border-color:#d9b0b6;opacity:1;filter:none;box-shadow:0 5px 10px -6px rgba(137,90,100,.4)}'
  +'.ics .ic span{background:#f3e7e7;border-color:#e8ced1;opacity:.9;filter:grayscale(.1)}'
  +'.ics .ic.on span{background:radial-gradient(circle at 32% 26%,#fff,#e8ced1);border-color:#d9b0b6;opacity:1;filter:none;box-shadow:0 4px 8px -5px rgba(137,90,100,.4)}'
  +'.dsm-a{background:radial-gradient(circle at 32% 26%,#fff,#e8ced1);border-color:#d9b0b6}'
  +'.prr.dn span{opacity:1;color:#ac727e;text-decoration:line-through;text-decoration-color:#d9b0b6}'
  +'.prr.dn{opacity:1}.prr .pk.on{background:#c48f97;border-color:#c48f97;color:#fff}'
  +'.dsm-p.dn span{opacity:1;color:#ac727e;text-decoration-color:#d9b0b6}';
  document.head.appendChild(st);
})();
/* Statistiques du temps : carte du mois + barres par mois */
var wxSt={mode:'m',m:new Date().getMonth()};
var WXC=['#c48f97','#d9b0b6','#b5b3b4','#d4d3d1','#929093','#929093','#c48f97'];
function wxStSet(md){wxSt.mode=md;ovUI()}
function wxStMove(dl){wxSt.m=Math.max(0,Math.min(11,wxSt.m+dl));ovUI()}
function wxCount(y,months){
  var c=[0,1,2,3,4,5,6].map(function(){return [0,0,0,0]}),rec=0,mix=0,days=0;
  months.forEach(function(m){var n=new Date(y,m+1,0).getDate();for(var d=1;d<=n;d++){
    var a=wxGet(y,m,d),any=false;
    a.forEach(function(v,i){if(v>=0&&v<7){c[v][i]++;rec++;any=true}});
    if(any)days++;
    if((a[0]===0||a[0]===1)&&(a[1]===3||a[1]===4||a[1]===5))mix++;
  }});
  return {c:c,rec:rec,mix:mix,days:days};
}
function wxTable(r){
  var h='<div class="wxr wxh"><em></em><span class="n">Matin</span><span class="n">Apr.</span><span class="n">Soir</span><span class="n">Nuit</span></div>';
  var tops=[0,1,2,3].map(function(i){var b=-1,bv=0;r.c.forEach(function(row,t){if(row[i]>bv){bv=row[i];b=t}});return b});
  r.c.forEach(function(row,t){
    if(!row[0]&&!row[1]&&!row[2]&&!row[3])return;
    h+='<div class="wxr">'+wxTile(t)+'<em>'+WXL[t]+'</em>'+row.map(function(v,i){return '<span class="n'+(tops[i]===t&&v?' top':'')+'">'+(v||'\u00b7')+'</span>'}).join('')+'</div>';
  });
  return h;
}
function wxStatsHTML(y){
  var h='<h4 class="mgl">Le temps \u00b7 '+y+'</h4><div class="wxtg"><button class="'+(wxSt.mode==='m'?'on':'')+'" onclick="wxStSet(\'m\')">Mois</button><button class="'+(wxSt.mode==='y'?'on':'')+'" onclick="wxStSet(\'y\')">Ann\u00e9e</button></div>';
  if(wxSt.mode==='m'){
    var m=wxSt.m,n=new Date(y,m+1,0).getDate(),first=new Date(y,m,1).getDay();
    h+='<div class="wxmv"><button onclick="wxStMove(-1)">\u2039</button><b>'+MONTHS[m]+' '+y+'</b><button onclick="wxStMove(1)">\u203a</button></div>';
    h+='<div class="wxcal">'+['D','L','M','M','J','V','S'].map(function(x){return '<i class="wxdh">'+x+'</i>'}).join('');
    for(var k=0;k<first;k++)h+='<i></i>';
    for(var d=1;d<=n;d++){
      var a=wxGet(y,m,d);
      h+='<div class="wxcd"><b>'+d+'</b>'+a.map(function(v){return wxTile(v)}).join('')+'</div>';
    }
    h+='</div>';
    var r=wxCount(y,[m]);
    if(r.rec){h+='<div class="wxtbl">'+wxTable(r)+'</div>';if(r.mix)h+='<p class="wxnote">Matin soleil, apr\u00e8s-midi pluie : '+r.mix+' jour'+(r.mix>1?'s':'')+'</p>'}
    else h+='<p class="wxnote">Aucun temps enregistr\u00e9 ce mois-ci.</p>';
  }else{
    var all=[0,1,2,3,4,5,6,7,8,9,10,11],bars='';
    all.forEach(function(m){
      var r=wxCount(y,[m]),n=new Date(y,m+1,0).getDate()*4,pct=Math.min(100,Math.round(r.rec*100/n));
      var segs=r.c.map(function(row,t){var s=row[0]+row[1]+row[2]+row[3];return s?'<i style="flex:'+s+' 0 0;background:'+WXC[t]+'"></i>':''}).join('');
      bars+='<div class="wxbr"><div class="wxbh"><div class="col" style="height:'+(r.rec?Math.max(pct,8):0)+'%">'+segs+'</div></div><span>'+MONTHS[m].slice(0,1)+'</span></div>';
    });
    h+='<div class="wxbars">'+bars+'</div>';
    h+='<div class="wxlg">'+WXL.map(function(l,t){return '<span><i style="background:'+WXC[t]+'"></i>'+l+'</span>'}).join('')+'</div>';
    var r2=wxCount(y,all);
    if(r2.rec){h+='<div class="wxtbl">'+wxTable(r2)+'</div>';if(r2.mix)h+='<p class="wxnote">Matin soleil, apr\u00e8s-midi pluie : '+r2.mix+' jour'+(r2.mix>1?'s':'')+'</p>'}
    else h+='<p class="wxnote">Aucun temps enregistr\u00e9 cette ann\u00e9e.</p>';
  }
  return h;
}
(function(){
  var _yr=yrHTML;
  yrHTML=function(){
    var y=curYear();if(!(y>0))y=new Date().getFullYear();
    var h=_yr(),mk='<h4 class="mgl">Activit';
    var i=h.indexOf(mk);
    return i<0?h:h.slice(0,i)+wxStatsHTML(y)+h.slice(i);
  };
  var st=document.createElement('style');
  st.textContent='.wxtg{display:flex;gap:8px;justify-content:center;margin:0 0 10px}.wxtg button{border:1px solid #e8ced1;background:rgba(255,255,255,.7);color:#895a64;border-radius:999px;padding:6px 18px;font:inherit;font-size:12px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}.wxtg button.on{background:#e8ced1;border-color:#d9b0b6;color:#39393b;font-weight:600}'
  +'.wxmv{display:flex;align-items:center;justify-content:space-between;margin:2px 0 8px}.wxmv b{font-family:"Lora",Georgia,serif;font-style:italic;font-weight:500;font-size:18px;text-transform:capitalize}.wxmv button{width:32px;height:32px;border-radius:50%;border:1px solid #e8ced1;background:rgba(255,255,255,.7);font-size:20px;line-height:1;padding:0;cursor:pointer;color:#895a64}'
  +'.wxcal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.wxdh{font-style:normal;text-align:center;font-size:10px;color:var(--muted);letter-spacing:.1em}'
  +'.wxcd{display:flex;flex-direction:column;align-items:center;gap:2px;padding:3px 0 4px;border-radius:9px;background:rgba(255,255,255,.6);border:1px solid #f3e7e7}.wxcd b{font-size:9px;font-weight:500;color:var(--muted)}.wxcd .wxs{width:18px;height:18px}.wxcd .wxs.e{border-width:1px;opacity:.5}'
  +'.wxtbl{margin-top:12px}.wxr{display:flex;align-items:center;gap:8px;padding:4px 0}.wxr .wxs{width:26px;height:26px}.wxr em{flex:1;font-style:normal;font-size:13px}.wxr .n{width:46px;text-align:center;font-size:14px;color:var(--text)}.wxr .n.top{font-weight:700;color:#ac727e}.wxr.wxh .n{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}'
  +'.wxnote{margin:8px 0 2px;font-size:13px;color:#895a64;text-align:center}'
  +'.wxbars{display:flex;gap:5px;align-items:flex-end;margin-top:4px}.wxbr{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}.wxbh{width:100%;height:96px;display:flex;align-items:flex-end;background:#f9f8f6;border-radius:7px;overflow:hidden}.wxbh .col{width:100%;display:flex;flex-direction:column-reverse}.wxbh .col i{display:block;width:100%}.wxbr span{font-size:10px;color:var(--muted);text-transform:uppercase}'
  +'.wxlg{display:flex;flex-wrap:wrap;gap:6px 12px;justify-content:center;margin:10px 0 4px;font-size:11px;color:#895a64}.wxlg span{display:inline-flex;align-items:center;gap:5px}.wxlg i{width:10px;height:10px;border-radius:50%;display:inline-block}';
  document.head.appendChild(st);
})();
