/* Onglet Photos : albums (noms libres) + photo du mois. Charge apres app-photos.js.
   Donnees : cle 'ag-albums' (references idb:<id>, incluse dans la sauvegarde). Images : IndexedDB 'agenda-photos'.
   v57 : titre d'album encadre, mode Organiser (albums et photos), visionneuse a balayage. */
(function(){
  'use strict';
  var K='ag-albums',DBP=null,PO=-1,PR=false,VJ=0;
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
  function orgBtn(){return '<button class="ptob'+(PR?' on':'')+'" onclick="ptOrg()">'+(PR?'Terminé':'Organiser')+'</button>'}
  function ctl(fn,i){return '<span class="ptdh" aria-label="Glisser pour déplacer">⠿</span><div class="ptar"><button aria-label="Avant" onclick="event.stopPropagation();'+fn+'('+i+',-1)">‹</button><button aria-label="Après" onclick="event.stopPropagation();'+fn+'('+i+',1)">›</button></div>'}
  function page(){
    var h='<div class="ptp">';
    if(PO<0||!AL.a[PO]){
      PO=-1;
      h+='<img class="ptb" src="img-photos-banner.webp" alt="Life is a collection of moments">';
      h+='<div class="ptc">'+(AL.f?'<img src="'+AL.f+'" alt=""><i class="pth">♥</i>':'<span class="pte">♡</span>')+'</div>';
      h+='<div class="ptor">'+orgBtn()+'</div>';
      h+='<div class="ptal">'+AL.a.map(function(a,i){
        var inner='<div class="ptt">'+esc(a.n||'Sans nom')+'<span>'+cnt(a.p.length)+'</span></div><div class="ptcv">'+(a.p[0]?'<img src="'+a.p[0]+'" alt="">':'')+'</div>';
        if(!PR)return '<button class="pta" onclick="ptOpen('+i+')">'+inner+'</button>';
        return '<div class="pta pto" data-i="'+i+'">'+inner+ctl('ptMvA',i)+'</div>';
      }).join('')+(PR?'':'<button class="pta ptn" onclick="ptNew()"><i>+</i>Nouvel album</button>')+'</div>';
    }else{
      var a=AL.a[PO];
      if(PR)h+='<div class="ptfr"><input class="ptnm" value="'+esc(a.n)+'" placeholder="Nom de l’album" oninput="ptName(this.value)"></div>';
      h+='<div class="ptrow"><button class="ptbk" onclick="ptBack()">← Albums</button>'+(a.p.length>1?orgBtn():'')+'</div>';
      h+='<div class="ptg">'+(PR?'':'<label class="ptad">+<input type="file" accept="image/*" multiple hidden onchange="ptAdd(this)"></label>');
      a.p.forEach(function(r,j){
        if(PR){h+='<div class="ptph pto" data-i="'+j+'"><img src="'+r+'" alt="" draggable="false">'+ctl('ptMvP',j)+'</div>';return}
        var on=AL.f===r;h+='<div class="ptph" onclick="ptView('+j+')"><img src="'+r+'" alt=""><button class="ptst'+(on?' on':'')+'" aria-label="Photo du mois" onclick="event.stopPropagation();ptFav('+j+')">'+(on?'★':'☆')+'</button></div>';
      });
      h+='</div>'+(PR?'':'<button class="ptbk ptdl" onclick="ptDelA()">Supprimer cet album</button>');
    }
    return h+'</div>';
  }
  window.ptOpen=function(i){PO=i;PR=false;render();window.scrollTo(0,0)};
  window.ptBack=function(){PO=-1;PR=false;render();window.scrollTo(0,0)};
  window.ptNew=function(){AL.a.push({id:nid(),n:'Nouvel album',p:[]});save();PO=AL.a.length-1;PR=false;render();window.scrollTo(0,0)};
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

  /* ---------- v57 : organiser (albums et photos) ---------- */
  function list(){return PO<0?AL.a:(AL.a[PO]&&AL.a[PO].p)}
  function mv(from,to){
    var arr=list();if(!arr||from===to||to<0||to>=arr.length)return;
    var x=arr.splice(from,1)[0];arr.splice(to,0,x);save();render();
  }
  window.ptOrg=function(){PR=!PR;render()};
  window.ptMvA=function(i,d){mv(i,i+d)};
  window.ptMvP=function(j,d){mv(j,j+d)};
  document.addEventListener('pointerdown',function(e){
    var hd=e.target&&e.target.closest?e.target.closest('.ptdh'):null;if(!hd)return;
    var it=hd.closest('[data-i]');if(!it)return;
    e.preventDefault();
    var from=+it.getAttribute('data-i'),x0=e.clientX,y0=e.clientY,tgt=null,sel=it.classList.contains('ptph')?'.ptph[data-i]':'.pta[data-i]';
    it.classList.add('ptdrag');
    function onMove(ev){
      ev.preventDefault();
      it.style.transform='translate('+(ev.clientX-x0)+'px,'+(ev.clientY-y0)+'px) scale(1.05)';
      it.style.visibility='hidden';var el=document.elementFromPoint(ev.clientX,ev.clientY);it.style.visibility='';
      var t=el&&el.closest?el.closest(sel):null;
      if(tgt&&tgt!==t)tgt.classList.remove('ptdt');
      tgt=(t&&t!==it)?t:null;if(tgt)tgt.classList.add('ptdt');
    }
    function onUp(){
      document.removeEventListener('pointermove',onMove);document.removeEventListener('pointerup',onUp);document.removeEventListener('pointercancel',onUp);
      if(tgt)mv(from,+tgt.getAttribute('data-i'));
      else{it.classList.remove('ptdrag');it.style.transform=''}
    }
    document.addEventListener('pointermove',onMove,{passive:false});
    document.addEventListener('pointerup',onUp);document.addEventListener('pointercancel',onUp);
  });

  /* ---------- v57 : visionneuse, on glisse d'une photo a l'autre ---------- */
  window.ptView=function(j){
    var a=AL.a[PO];if(!a||!a.p[j])return;
    window.ptCl();VJ=j;
    var o=document.createElement('div');o.id='ptv';
    o.innerHTML='<div class="pts">'+a.p.map(function(r){return '<div class="ptsl"><img src="'+r+'" alt="" draggable="false"></div>'}).join('')+'</div><div class="ptct">'+(j+1)+' / '+a.p.length+'</div><div class="ptbt"><button onclick="ptRm()">Supprimer</button><button onclick="ptCl()">Fermer</button></div>';
    var sc=o.firstChild,ct=o.querySelector('.ptct');
    function upd(){VJ=Math.max(0,Math.min(a.p.length-1,Math.round(sc.scrollLeft/Math.max(1,sc.clientWidth))));ct.textContent=(VJ+1)+' / '+a.p.length}
    sc.addEventListener('scroll',upd,{passive:true});
    ['touchstart','touchmove','touchend'].forEach(function(ev){o.addEventListener(ev,function(e){e.stopPropagation()},{passive:true})});
    o.onclick=function(e){if(e.target===o||e.target.classList.contains('ptsl'))window.ptCl()};
    document.body.appendChild(o);document.body.style.overflow='hidden';
    sc.scrollLeft=j*sc.clientWidth;
    requestAnimationFrame(function(){sc.scrollLeft=j*sc.clientWidth;upd()});
  };
  window.ptCl=function(){var o=document.getElementById('ptv');if(o)o.remove();document.body.style.overflow=''};
  window.ptRm=function(){
    var a=AL.a[PO];if(!a||!confirm('Supprimer cette photo ?'))return;
    var r=a.p.splice(VJ,1)[0];if(AL.f===r)AL.f='';save();rm(r);window.ptCl();render();
  };

  /* ---------- branchement sur render et le balayage ---------- */
  var _rd=render,_sw=swipeNav;
  render=function(){
    var v=document.getElementById('view');
    var isP=TABS[cur]==='Photos'&&dk===null&&wk===null&&mo===null&&ya===null;
    if(!isP){if(v)v.classList.remove('ptv');PR=false;return _rd.apply(this,arguments)}
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
   +'.ptal{display:grid;grid-template-columns:1fr 1fr;gap:34px 24px;margin-top:30px}'
   +'.pta{border:0;padding:0;text-align:left;background:#fff;border-radius:20px;overflow:hidden;box-shadow:'+sh+';font:inherit;color:#39393b;cursor:pointer}'
   +'.ptcv{aspect-ratio:1/1;background:linear-gradient(135deg,#fdfdfc,#f1f0ee)}.ptcv img{width:100%;height:100%;object-fit:cover;display:block}'
   +'.ptt{padding:9px 12px 11px;font-weight:700;font-size:13px}.ptt span{display:block;font-weight:500;font-size:11px;color:#ac727e}'
   +'.pta.ptn{border:2px dashed #d9b0b6;background:rgba(255,255,255,.5);box-shadow:none;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ac727e;font-size:13px;min-height:150px}.ptn i{font:300 34px Georgia,serif;font-style:normal}'
   +'.ptbk{border:0;background:none;color:#ac727e;font:600 14px inherit;padding:6px 2px;cursor:pointer}.ptdl{display:block;margin:22px auto 0}'
   /* v57 : titre d'album dans un cadre en verre blanc, comme la banniere */
   +'.ptfr{width:min(360px,92%);box-sizing:border-box;margin:4px auto 14px;padding:8px 12px;border:2.5px solid transparent;border-radius:22px;'
   +'background:linear-gradient(180deg,#ffffff 0%,#f4f2f1 60%,#e5e2e1 100%) padding-box,linear-gradient(135deg,#f8e8e1 0%,#c99a8f 45%,#f2dad2 70%,#b98d84 100%) border-box;'
   +'box-shadow:inset 0 2px 0 #fff,inset 0 -10px 12px -8px rgba(110,96,92,.3),0 18px 18px -10px rgba(57,57,59,.35),0 4px 6px rgba(57,57,59,.15)}'
   +'.ptnm{display:block;width:100%;box-sizing:border-box;border:0;background:transparent;text-align:center;font:italic 500 26px Georgia,serif;color:#39393b;padding:4px 0;margin:0;outline:none}'
   +'.ptrow{display:flex;align-items:center;justify-content:space-between;margin:0 0 12px}'
   +'.ptor{text-align:center;margin-top:20px}'
   +'.ptob{border:1.5px dashed #c48f97;background:#fff;color:#895a64;border-radius:999px;font:600 12px sans-serif;letter-spacing:.1em;text-transform:uppercase;padding:8px 18px;cursor:pointer}.ptob.on{background:#895a64;color:#fff;border-style:solid;border-color:#895a64}'
   +'.pto{position:relative;cursor:default}'
   +'.ptdh{position:absolute;top:6px;left:6px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.94);color:#895a64;font-size:18px;display:flex;align-items:center;justify-content:center;touch-action:none;cursor:grab;z-index:3;-webkit-user-select:none;user-select:none;box-shadow:0 4px 8px -4px rgba(57,57,59,.5)}'
   +'.ptar{position:absolute;display:flex;gap:6px;z-index:3}.ptar button{width:32px;height:32px;border-radius:50%;border:0;background:rgba(255,255,255,.94);color:#895a64;font-size:20px;line-height:1;cursor:pointer;padding:0;box-shadow:0 4px 8px -4px rgba(57,57,59,.5)}'
   +'.pta .ptar{top:6px;right:6px}.ptph .ptar{left:0;right:0;bottom:0;justify-content:space-between;padding:4px}'
   +'.ptph .ptdh{width:26px;height:26px;font-size:14px;top:4px;left:4px}.ptph .ptar button{width:26px;height:26px;font-size:17px}'
   +'.ptdrag{z-index:6;opacity:.92;box-shadow:0 24px 30px -10px rgba(0,0,0,.5)!important}.ptdt{outline:3px solid #c48f97;outline-offset:-3px}'
   /* v58 : nom de l'album dans un cadre vitre blanc qui deborde de la photo, texte charcoal comme le titre de la page */
   +'.pta{position:relative;overflow:visible;background:none;box-shadow:none;border-radius:20px}'
   +'.pta .ptcv{aspect-ratio:4/5;border-radius:20px;overflow:hidden;box-shadow:'+sh+'}'
   +'.pta .ptt{position:absolute;top:-14px;left:-10px;right:-10px;z-index:2;box-sizing:border-box;padding:9px 12px 10px;text-align:center;overflow:hidden;border-radius:16px;border:2px solid rgba(214,194,190,.95);'
   +'font-weight:700;font-size:14px;color:#39393b;text-shadow:0 1px 0 rgba(255,255,255,.85);'
   +'background:linear-gradient(180deg,rgba(255,255,255,.62) 0%,rgba(255,255,255,.26) 50%,rgba(255,255,255,.46) 100%);-webkit-backdrop-filter:blur(14px) saturate(1.5);backdrop-filter:blur(14px) saturate(1.5);'
   +'box-shadow:inset 0 2px 1px #fff,inset 0 -2px 3px rgba(255,255,255,.7),inset 0 -12px 14px -10px rgba(110,96,92,.35),0 16px 22px -10px rgba(57,57,59,.6),0 3px 6px rgba(57,57,59,.2)}'
   +'.pta .ptt::before{content:"";position:absolute;left:-25%;top:0;width:65%;height:100%;z-index:-1;pointer-events:none;background:linear-gradient(105deg,rgba(255,255,255,0) 18%,rgba(255,255,255,.95) 42%,rgba(255,255,255,.25) 54%,rgba(255,255,255,0) 66%)}'
   +'.pta .ptt::after{content:"";position:absolute;left:6px;right:6px;top:3px;height:42%;z-index:-1;pointer-events:none;border-radius:12px 12px 40px 40px/12px 12px 14px 14px;background:linear-gradient(180deg,rgba(255,255,255,.9),rgba(255,255,255,.05))}'
   +'.pta .ptt span{margin-top:1px;font-size:12px;font-weight:500;color:#525156}'
   +'.pta .ptdh{top:auto;bottom:8px;left:8px}.pta .ptar{top:auto;bottom:8px;right:8px}'
   +'.ptg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}'
   +'.ptph{position:relative;border-radius:14px;overflow:hidden;aspect-ratio:1/1;background:#f1f0ee;box-shadow:0 16px 24px -8px rgba(57,57,59,.6),0 4px 8px -2px rgba(57,57,59,.3)}.ptph img{width:100%;height:100%;object-fit:cover;display:block}'
   +'.ptst{position:absolute;right:5px;top:5px;width:28px;height:28px;border-radius:50%;border:0;background:rgba(255,255,255,.88);color:#b5b3b4;font-size:15px;cursor:pointer}.ptst.on{color:#ac727e}'
   +'.ptad{display:flex;align-items:center;justify-content:center;aspect-ratio:1/1;border:2px dashed #d9b0b6;border-radius:14px;color:#ac727e;font-size:30px;background:rgba(255,255,255,.5);cursor:pointer}'
   /* v57 : visionneuse a balayage */
   +'#ptv{position:fixed;inset:0;z-index:9000;background:rgba(30,30,32,.96);display:flex;flex-direction:column}'
   +'#ptv .pts{flex:1;min-height:0;display:flex;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;overscroll-behavior:contain}#ptv .pts::-webkit-scrollbar{display:none}'
   +'#ptv .ptsl{flex:0 0 100%;scroll-snap-align:center;scroll-snap-stop:always;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:calc(env(safe-area-inset-top,0px) + 16px) 14px 8px}'
   +'#ptv .ptsl img{max-width:100%;max-height:calc(100vh - 170px);max-height:calc(100dvh - 170px);object-fit:contain;border-radius:12px;-webkit-user-select:none;user-select:none}'
   +'#ptv .ptct{text-align:center;color:#fff;font:600 13px sans-serif;letter-spacing:.12em;padding:2px 0 6px}'
   +'#ptv .ptbt{display:flex;gap:12px;justify-content:center;padding:6px 16px calc(env(safe-area-inset-bottom,0px) + 18px)}'
   +'#ptv button{border:0;border-radius:999px;padding:10px 22px;font:600 13px sans-serif;letter-spacing:.1em;text-transform:uppercase;background:#fff;color:#39393b;cursor:pointer}';
  document.head.appendChild(st);
  /* ---------- v52 : onglet "Dream board" (ex Vision board) : meme fond que Photos, bandeau, sans medaillon ni phrase ---------- */
  TABS[1]='Dream board';
  var _vpD=visionPage;
  visionPage=function(){
    var h=_vpD();
    if(isPast())return h;
    h=h.replace(/<button class="blc"[\s\S]*?<\/button>/,'');
    h=h.replace(/<span class="vbk">[^<]*<\/span><h1 class="vbt">Vision board<\/h1><div class="dv"><i><\/i><\/div>/,'<img class="ptb ptbl" role="button" tabindex="0" onclick="blOpen()" src="img-dream-banner.webp" alt="Dream board : ouvrir ma bucket list">');
    h=h.replace(/<div class="vbm"[\s\S]*?<\/div>/,'');
    return h;
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
   +'.ptbl{cursor:pointer;-webkit-tap-highlight-color:transparent}.ptbl:active{transform:scale(.985)}'
   +'#view.dmv .vbp::before{display:none}';
  document.head.appendChild(sd);
  render();
})();
