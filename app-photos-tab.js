/* Onglet Photos : albums (noms libres) + photo du mois. Charge apres app-photos.js.
   Donnees : cle 'ag-albums' (references idb:<id>, incluse dans la sauvegarde). Images : IndexedDB 'agenda-photos'. */
(function(){
  'use strict';
  var K='ag-albums',DBP=null,PO=-1;
  if(TABS.indexOf('Photos')<0){var pi=TABS.indexOf('Passé');TABS.splice(pi<0?TABS.length:pi,0,'Photos')}
  function nid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
  function load(){try{var o=JSON.parse(localStorage.getItem(K));if(o&&o.a&&o.a.length)return o}catch(e){}return{a:[{id:nid(),n:'Mon premier album',p:[]}],f:''}}
  var AL=load();
  function save(){try{localStorage.setItem(K,JSON.stringify(AL))}catch(e){alert('Espace plein : impossible d’enregistrer.')}}
  function db(){
    if(DBP)return DBP;
    DBP=new Promise(function(res,rej){
      var r=indexedDB.open('agenda-photos',1);
      r.onupgradeneeded=function(){var d=r.result;if(!d.objectStoreNames.contains('full'))d.createObjectStore('full');if(!d.objectStoreNames.contains('thumb'))d.createObjectStore('thumb')};
      r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)};
    });
    return DBP;
  }
  function put(st,id,b){return db().then(function(d){return new Promise(function(res,rej){var t=d.transaction(st,'readwrite');t.objectStore(st).put(b,id);t.oncomplete=function(){res()};t.onerror=t.onabort=function(){rej(t.error)}})})}
  function rm(ref){if(!ref)return;var id=ref.slice(4);db().then(function(d){var t=d.transaction(['full','thumb'],'readwrite');t.objectStore('full').delete(id);t.objectStore('thumb').delete(id)}).catch(function(){})}
  function bmp(f){
    var p=window.createImageBitmap?createImageBitmap(f,{imageOrientation:'from-image'}):Promise.reject();
    return p.then(function(b){return{s:b,w:b.width,h:b.height,d:function(){try{b.close()}catch(e){}}}}).catch(function(){
      return new Promise(function(res,rej){var u=URL.createObjectURL(f),im=new Image();im.onload=function(){res({s:im,w:im.naturalWidth,h:im.naturalHeight,d:function(){URL.revokeObjectURL(u)}})};im.onerror=function(){URL.revokeObjectURL(u);rej()};im.src=u});
    });
  }
  function thumb(f){
    return bmp(f).then(function(o){
      var s=Math.min(1,1000/Math.max(o.w,o.h)),c=document.createElement('canvas');
      c.width=Math.max(1,Math.round(o.w*s));c.height=Math.max(1,Math.round(o.h*s));
      c.getContext('2d').drawImage(o.s,0,0,c.width,c.height);o.d();
      return new Promise(function(r){c.toBlob(function(b){r(b||f)},'image/jpeg',0.82)});
    }).catch(function(){return f});
  }
  function toast(t){
    var e=document.getElementById('pttoast');
    if(!t){if(e)e.remove();return}
    if(!e){e=document.createElement('div');e.id='pttoast';e.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;background:rgba(40,40,40,.92);color:#fff;padding:10px 18px;border-radius:20px;font:14px/1.3 sans-serif';document.body.appendChild(e)}
    e.textContent=t;
  }
  function cnt(n){return n+' photo'+(n>1?'s':'')}
  function page(){
    var h='<div class="ptp"><img class="ptb" src="img-photos-banner.webp" alt="Life is a collection of moments">';
    if(PO<0||!AL.a[PO]){
      PO=-1;
      h+='<div class="ptc">'+(AL.f?'<img src="'+AL.f+'" alt=""><i class="pth">♥</i>':'<span class="pte">♡</span>')+'</div>';
      h+='<div class="ptal">'+AL.a.map(function(a,i){return '<button class="pta" onclick="ptOpen('+i+')"><div class="ptcv">'+(a.p[0]?'<img src="'+a.p[0]+'" alt="">':'')+'</div><div class="ptt">'+esc(a.n||'Sans nom')+'<span>'+cnt(a.p.length)+'</span></div></button>'}).join('')+'<button class="pta ptn" onclick="ptNew()"><i>+</i>Nouvel album</button></div>';
    }else{
      var a=AL.a[PO];
      h+='<button class="ptbk" onclick="ptBack()">← Albums</button><input class="ptnm" value="'+esc(a.n)+'" placeholder="Nom de l’album" oninput="ptName(this.value)">';
      h+='<div class="ptg"><label class="ptad">+<input type="file" accept="image/*" multiple hidden onchange="ptAdd(this)"></label>';
      a.p.forEach(function(r,j){var on=AL.f===r;h+='<div class="ptph" onclick="ptView('+j+')"><img src="'+r+'" alt=""><button class="ptst'+(on?' on':'')+'" aria-label="Photo du mois" onclick="event.stopPropagation();ptFav('+j+')">'+(on?'★':'☆')+'</button></div>'});
      h+='</div><button class="ptbk ptdl" onclick="ptDelA()">Supprimer cet album</button>';
    }
    return h+'</div>';
  }
  window.ptOpen=function(i){PO=i;render();window.scrollTo(0,0)};
  window.ptBack=function(){PO=-1;render();window.scrollTo(0,0)};
  window.ptNew=function(){AL.a.push({id:nid(),n:'Nouvel album',p:[]});save();PO=AL.a.length-1;render();window.scrollTo(0,0)};
  window.ptName=function(v){if(AL.a[PO]){AL.a[PO].n=v;save()}};
  window.ptFav=function(j){var r=AL.a[PO]&&AL.a[PO].p[j];if(!r)return;AL.f=(AL.f===r)?'':r;save();render()};
  window.ptDelA=function(){
    var a=AL.a[PO];if(!a||!confirm('Supprimer cet album et ses '+a.p.length+' photo(s) ?'))return;
    a.p.forEach(function(r){if(AL.f===r)AL.f='';rm(r)});
    AL.a.splice(PO,1);if(!AL.a.length)AL.a.push({id:nid(),n:'Mon premier album',p:[]});
    save();PO=-1;render();window.scrollTo(0,0);
  };
  window.ptAdd=function(inp){
    var fs=[].slice.call(inp.files||[]),a=AL.a[PO];if(!fs.length||!a)return;
    var n=fs.length,k=0,bad=0;
    fs.reduce(function(p,f){
      return p.then(function(){
        toast('Photo '+(++k)+' / '+n+'…');
        var id=nid();
        return thumb(f).then(function(t){return put('full',id,f).then(function(){return put('thumb',id,t)})})
          .then(function(){a.p.push('idb:'+id);save()}).catch(function(){bad++});
      });
    },Promise.resolve()).then(function(){toast('');if(bad)alert('Certaines photos n’ont pas pu être enregistrées ('+bad+').');render()});
  };
  window.ptView=function(j){
    var a=AL.a[PO],r=a&&a.p[j];if(!r)return;
    var o=document.createElement('div');o.id='ptv';
    o.innerHTML='<img src="'+r+'" alt=""><div><button onclick="ptRm('+j+')">Supprimer</button><button onclick="ptCl()">Fermer</button></div>';
    o.onclick=function(e){if(e.target===o)window.ptCl()};
    document.body.appendChild(o);
  };
  window.ptCl=function(){var o=document.getElementById('ptv');if(o)o.remove()};
  window.ptRm=function(j){
    var a=AL.a[PO];if(!a||!confirm('Supprimer cette photo ?'))return;
    var r=a.p.splice(j,1)[0];if(AL.f===r)AL.f='';save();rm(r);window.ptCl();render();
  };

  /* ---------- branchement sur render et le balayage ---------- */
  var _rd=render,_sw=swipeNav;
  render=function(){
    var v=document.getElementById('view');
    var isP=TABS[cur]==='Photos'&&dk===null&&wk===null&&mo===null&&ya===null;
    if(!isP){if(v)v.classList.remove('ptv');return _rd.apply(this,arguments)}
    var c=cur,bl=blOn;cur=1;blOn=false;
    try{_rd.apply(this,arguments)}finally{cur=c;blOn=bl}
    var bs=document.querySelectorAll('#tabs button');
    if(bs[1])bs[1].classList.remove('on');
    if(bs[c])bs[c].classList.add('on');
    var hd=document.querySelector('.hd');if(hd)hd.style.display='none';
    v.innerHTML=page();v.classList.add('ptv');
  };
  swipeNav=function(n){
    if(TABS[cur]==='Photos'&&dk===null)return;
    return _sw.apply(this,arguments);
  };

  var sh='0 26px 38px -12px rgba(57,57,59,.6),0 8px 16px -4px rgba(57,57,59,.3)';
  var st=document.createElement('style');
  st.textContent='#view.ptv{background:linear-gradient(rgba(248,248,246,.35),rgba(238,238,236,.3)),var(--hb) top center/100% auto no-repeat,#efefed;border-radius:20px;padding-bottom:14px}'
   +'.ptp{max-width:520px;margin:0 auto;padding:6px 8px 36px;color:#39393b}'
   +'.ptb{display:block;width:min(360px,92%);height:auto;margin:4px auto 26px;filter:drop-shadow(0 18px 18px rgba(57,57,59,.32)) drop-shadow(0 4px 6px rgba(57,57,59,.18))}'
   +'.ptc{position:relative;aspect-ratio:4/3;border-radius:24px;overflow:hidden;background:#fff;box-shadow:'+sh+';display:flex;align-items:center;justify-content:center}'
   +'.ptc img{width:100%;height:100%;object-fit:cover;display:block}.pte{font-size:40px;color:#e8ced1}'
   +'.pth{position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.9);color:#ac727e;font-style:normal;font-size:18px;display:flex;align-items:center;justify-content:center}'
   +'.ptal{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:30px}'
   +'.pta{border:0;padding:0;text-align:left;background:#fff;border-radius:20px;overflow:hidden;box-shadow:'+sh+';font:inherit;color:#39393b;cursor:pointer}'
   +'.ptcv{aspect-ratio:1/1;background:linear-gradient(135deg,#fdfdfc,#f1f0ee)}.ptcv img{width:100%;height:100%;object-fit:cover;display:block}'
   +'.ptt{padding:9px 12px 11px;font-weight:700;font-size:13px}.ptt span{display:block;font-weight:500;font-size:11px;color:#ac727e}'
   +'.pta.ptn{border:2px dashed #d9b0b6;background:rgba(255,255,255,.5);box-shadow:none;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ac727e;font-size:13px;min-height:150px}.ptn i{font:300 34px Georgia,serif;font-style:normal}'
   +'.ptbk{border:0;background:none;color:#ac727e;font:600 14px inherit;padding:6px 2px;cursor:pointer}.ptdl{display:block;margin:22px auto 0}'
   +'.ptnm{display:block;width:100%;border:0;border-bottom:1px dashed #d9b0b6;background:transparent;text-align:center;font:italic 500 30px Georgia,serif;color:#39393b;padding:6px 0;margin:6px 0 18px;outline:none}'
   +'.ptg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}'
   +'.ptph{position:relative;border-radius:14px;overflow:hidden;aspect-ratio:1/1;background:#f1f0ee;box-shadow:0 16px 24px -8px rgba(57,57,59,.6),0 4px 8px -2px rgba(57,57,59,.3)}.ptph img{width:100%;height:100%;object-fit:cover;display:block}'
   +'.ptst{position:absolute;right:5px;top:5px;width:28px;height:28px;border-radius:50%;border:0;background:rgba(255,255,255,.88);color:#b5b3b4;font-size:15px;cursor:pointer}.ptst.on{color:#ac727e}'
   +'.ptad{display:flex;align-items:center;justify-content:center;aspect-ratio:1/1;border:2px dashed #d9b0b6;border-radius:14px;color:#ac727e;font-size:30px;background:rgba(255,255,255,.5);cursor:pointer}'
   +'#ptv{position:fixed;inset:0;z-index:9000;background:rgba(30,30,32,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:16px;box-sizing:border-box}'
   +'#ptv img{max-width:100%;max-height:78vh;border-radius:12px}#ptv div{display:flex;gap:12px}'
   +'#ptv button{border:0;border-radius:999px;padding:10px 22px;font:600 13px sans-serif;letter-spacing:.1em;text-transform:uppercase;background:#fff;color:#39393b;cursor:pointer}';
  document.head.appendChild(st);
  /* ---------- v52 : onglet "Dream board" (ex Vision board) : meme fond que Photos, bandeau, sans medaillon ni phrase ---------- */
  TABS[1]='Dream board';
  var _vpD=visionPage;
  visionPage=function(){
    var h=_vpD();
    if(isPast())return h;
    h=h.replace(/<button class="blc"[\s\S]*?<\/button>/,'');
    h=h.replace(/<span class="vbk">[^<]*<\/span><h1 class="vbt">Vision board<\/h1><div class="dv"><i><\/i><\/div>/,'<img class="ptb" src="img-dream-banner.webp" alt="Dream board">');
    h=h.replace(/<div class="vbm"[\s\S]*?<\/div>/,'');
    return h.replace('<div class="vbg">','<div class="dmbl"><button class="lk" onclick="blOpen()">Bucket list ›</button></div><div class="vbg">');
  };
  var _bpD=bucketPage;
  bucketPage=function(){return _bpD().replace('← Vision board','← Dream board')};
  var _rdD=render;
  render=function(){
    var r=_rdD.apply(this,arguments),v=document.getElementById('view');
    if(v)v.classList.toggle('dmv',TABS[cur]==='Dream board'&&dk===null&&wk===null&&mo===null&&ya===null);
    return r;
  };
  var sd=document.createElement('style');
  sd.textContent='#view.dmv{background:linear-gradient(rgba(248,248,246,.35),rgba(238,238,236,.3)),var(--hb) top center/100% auto no-repeat,#efefed;border-radius:20px;padding-bottom:14px}'
   +'.vbp .vbh2{display:block;padding-top:0}.vbp .vbh2 .vbh{padding-top:0}'
   +'.vbp .ptb{width:min(420px,96%);margin:4px auto 10px}'
   +'.dmbl{text-align:center;margin:0 0 6px}'
   +'#view.dmv .vbp::before{display:none}';
  document.head.appendChild(sd);
  render();
})();
