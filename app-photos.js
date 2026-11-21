/* Photos : stockage IndexedDB (original + aperçu), migration, sauvegarde, compteur.
   Chargé en dernier : redéfinit dph, vbAdd, dpd, vbDel, bkExport, bkRestore, bkHTML.
   Dans les données (localStorage) une photo n'est plus qu'une référence "idb:<id>". */
(function(){
  'use strict';
  var DBN='agenda-photos',DBP=null,TH={},FU={},RT={};
  var RE=/data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+\/=]+/g;

  /* ---------- IndexedDB ---------- */
  function db(){
    if(DBP)return DBP;
    DBP=new Promise(function(res,rej){
      var r=indexedDB.open(DBN,1);
      r.onupgradeneeded=function(){
        var d=r.result;
        if(!d.objectStoreNames.contains('full'))d.createObjectStore('full');
        if(!d.objectStoreNames.contains('thumb'))d.createObjectStore('thumb');
      };
      r.onsuccess=function(){res(r.result)};
      r.onerror=function(){rej(r.error)};
    });
    return DBP;
  }
  function put(store,id,blob){
    return db().then(function(d){return new Promise(function(res,rej){
      var t=d.transaction(store,'readwrite');
      t.objectStore(store).put(blob,id);
      t.oncomplete=function(){res()};
      t.onerror=t.onabort=function(){rej(t.error)};
    })});
  }
  function get(store,id){
    return db().then(function(d){return new Promise(function(res){
      var q=d.transaction(store,'readonly').objectStore(store).get(id);
      q.onsuccess=function(){res(q.result||null)};
      q.onerror=function(){res(null)};
    })});
  }
  function del(store,id){
    return db().then(function(d){return new Promise(function(res){
      var t=d.transaction(store,'readwrite');
      t.objectStore(store).delete(id);
      t.oncomplete=t.onerror=t.onabort=function(){res()};
    })});
  }
  function newId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}

  /* ---------- images ---------- */
  function loadBitmap(file){
    var p=window.createImageBitmap?createImageBitmap(file,{imageOrientation:'from-image'}):Promise.reject();
    return p.then(function(b){return {src:b,w:b.width,h:b.height,done:function(){try{b.close()}catch(e){}}}})
      .catch(function(){
        return new Promise(function(res,rej){
          var u=URL.createObjectURL(file),im=new Image();
          im.onload=function(){res({src:im,w:im.naturalWidth,h:im.naturalHeight,done:function(){URL.revokeObjectURL(u)}})};
          im.onerror=function(){URL.revokeObjectURL(u);rej()};
          im.src=u;
        });
      });
  }
  function makeThumb(file){
    return loadBitmap(file).then(function(o){
      var s=Math.min(1,1000/Math.max(o.w,o.h)),c=document.createElement('canvas');
      c.width=Math.max(1,Math.round(o.w*s));c.height=Math.max(1,Math.round(o.h*s));
      c.getContext('2d').drawImage(o.src,0,0,c.width,c.height);
      o.done();
      return new Promise(function(res){c.toBlob(function(b){res(b||file)},'image/jpeg',0.82)});
    }).catch(function(){return file});
  }
  function storePhoto(file){
    var id=newId();
    return makeThumb(file).then(function(th){
      return put('full',id,file).then(function(){return put('thumb',id,th)});
    }).then(function(){return id});
  }
  function dropRef(s){
    if(typeof s!=='string'||s.indexOf('idb:')!==0)return;
    var id=s.slice(4);
    try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^(ag-vb(-\d{4})?|agd-\d+-\d+-\d+)$/.test(k)&&(localStorage.getItem(k)||'').indexOf('idb:'+id)>=0)return}}catch(e){}
    if(TH[id]){try{URL.revokeObjectURL(TH[id])}catch(e){}delete RT[TH[id]];delete TH[id]}
    del('full',id);del('thumb',id);
  }
  function d2b(u){
    var i=u.indexOf(','),m=/data:([^;,]+)/.exec(u.slice(0,i)),b=atob(u.slice(i+1)),n=b.length,a=new Uint8Array(n);
    while(n--)a[n]=b.charCodeAt(n);
    return new Blob([a],{type:m?m[1]:'image/jpeg'});
  }
  function b2d(b){
    return new Promise(function(res){var r=new FileReader();r.onload=function(){res(r.result)};r.onerror=function(){res(null)};r.readAsDataURL(b)});
  }

  /* ---------- affichage : <img src="idb:id"> devient une URL locale ---------- */
  function thumbURL(id){
    if(TH[id])return Promise.resolve(TH[id]);
    return get('thumb',id).then(function(b){return b||get('full',id)}).then(function(b){
      if(!b)return null;
      if(!TH[id]){TH[id]=URL.createObjectURL(b);RT[TH[id]]=id}
      return TH[id];
    });
  }
  function fullURL(id){
    if(FU[id])return Promise.resolve(FU[id]);
    return get('full',id).then(function(b){return b||get('thumb',id)}).then(function(b){
      if(!b)return null;
      return FU[id]||(FU[id]=URL.createObjectURL(b));
    });
  }
  function freeFull(){Object.keys(FU).forEach(function(k){try{URL.revokeObjectURL(FU[k])}catch(e){}});FU={}}
  function fix(im){
    var s=im.getAttribute&&im.getAttribute('src');
    if(!s)return;
    var big=!!(im.closest&&im.closest('#lbx')),id=null;
    if(s.indexOf('idb:')===0)id=s.slice(4);
    else if(big&&s.indexOf('blob:')===0&&RT[s])id=RT[s];   /* la visionneuse copie l'aperçu : on le remplace par l'original */
    if(!id)return;
    if(big){im.loading='lazy';im.decoding='async'}
    (big?fullURL(id):thumbURL(id)).then(function(u){
      if(u&&im.getAttribute('src')===s)im.setAttribute('src',u);
    });
  }
  var mo=new MutationObserver(function(list){
    list.forEach(function(m){
      if(m.type==='attributes'){fix(m.target);return}
      Array.prototype.forEach.call(m.addedNodes,function(n){
        if(n.nodeType!==1)return;
        if(n.tagName==='IMG')fix(n);
        else if(n.querySelectorAll)Array.prototype.forEach.call(n.querySelectorAll('img[src^="idb:"],img[src^="blob:"]'),fix);
      });
      Array.prototype.forEach.call(m.removedNodes,function(n){
        if(n.nodeType===1&&n.id==='lbx')setTimeout(function(){if(!document.getElementById('lbx'))freeFull()},400);
      });
    });
  });
  mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  Array.prototype.forEach.call(document.querySelectorAll('img[src^="idb:"]'),fix);

  /* ---------- petit message de progression ---------- */
  function toast(t){
    var e=document.getElementById('phtoast');
    if(!t){if(e)e.remove();return}
    if(!e){
      e=document.createElement('div');e.id='phtoast';
      e.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;background:rgba(40,40,40,.92);color:#fff;padding:10px 18px;border-radius:20px;font:14px/1.3 sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.3)';
      document.body.appendChild(e);
    }
    e.textContent=t;
  }
  function addAll(files,onOne,done){
    var n=files.length,k=0,ok=0;
    files.reduce(function(p,f){
      return p.then(function(){
        toast('Photo '+(++k)+' / '+n+'…');
        return storePhoto(f).then(function(id){onOne(id);ok++}).catch(function(){});
      });
    },Promise.resolve()).then(function(){
      toast('');
      if(ok<n)alert('Certaines photos n’ont pas pu être enregistrées ('+(n-ok)+').');
      done();paint();
    });
  }

  /* ---------- ajout / suppression (remplace les anciennes fonctions) ---------- */
  window.dph=function(inp){
    var files=[].slice.call(inp.files||[]);if(!files.length)return;
    var day=dday;
    addAll(files,function(id){day.p.push('idb:'+id);dsave()},function(){render()});
  };
  window.vbAdd=function(inp){
    var files=[].slice.call(inp.files||[]);if(!files.length)return;
    addAll(files,function(id){VB.p.push({s:'idb:'+id,c:''});vbS()},function(){render()});
  };
  window.dpd=function(i){
    var r=dday.p.splice(i,1)[0];dsave();render();dropRef(r);paint();
  };
  window.vbDel=function(i){
    var r=VB.p.splice(i,1)[0];vbS();render();dropRef(r&&r.s);paint();
  };

  /* ---------- migration des anciennes photos (texte base64 -> IndexedDB) ---------- */
  function migrate(){
    var keys=[];
    try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^(ag-vb(-\d{4})?|agd-\d+-\d+-\d+)$/.test(k))keys.push(k)}}catch(e){return Promise.resolve(0)}
    var changed=0;
    return keys.reduce(function(p,k){
      return p.then(function(){
        var v=localStorage.getItem(k);
        if(!v||v.indexOf('data:image/')<0)return;
        var toks=v.match(RE)||[],ids=[];
        return toks.reduce(function(q,t){
          return q.then(function(){
            var b=d2b(t),id=newId();
            return put('full',id,b).then(function(){return put('thumb',id,b)}).then(function(){ids.push('idb:'+id)});
          });
        },Promise.resolve()).then(function(){
          var n=0,nv=v.replace(RE,function(){return ids[n++]});
          if(nv!==v){localStorage.setItem(k,nv);changed++}
        });
      });
    },Promise.resolve()).then(function(){return changed}).catch(function(){return changed});
  }
  function migrateAndReload(){
    migrate().then(function(c){if(c>0)location.reload()});
  }

  /* ---------- sauvegarde : les photos sont incluses en taille aperçu ---------- */
  var _bx=window.bkExport;
  window.bkExport=function(){
    var ids={};
    try{for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(/^(ag|agw|agd)-/.test(k)){(localStorage.getItem(k)||'').replace(/idb:[a-z0-9]+/g,function(m){ids[m]=1})}
    }}catch(e){}
    Promise.all(Object.keys(ids).map(function(r){
      return get('thumb',r.slice(4)).then(function(b){return b||get('full',r.slice(4))}).then(function(b){return b?b2d(b):null}).then(function(d){return [r,d]});
    })).then(function(pairs){
      var map={};pairs.forEach(function(p){if(p[1])map[p[0]]=p[1]});
      var gi=Storage.prototype.getItem;
      Storage.prototype.getItem=function(k){
        var v=gi.call(this,k);
        return(typeof v==='string'&&v.indexOf('idb:')>=0)?v.replace(/idb:[a-z0-9]+/g,function(m){return map[m]||m}):v;
      };
      try{_bx()}finally{Storage.prototype.getItem=gi}
    });
  };
  var _br=window.bkRestore;
  window.bkRestore=function(){_br();migrateAndReload()};

  /* ---------- compteur d'espace ---------- */
  function fmt(b){
    if(b>=1073741824)return (b/1073741824).toFixed(2).replace('.',',')+' Go';
    return Math.max(0,Math.round(b/1048576))+' Mo';
  }
  function stats(){
    return db().then(function(d){return new Promise(function(res){
      var n=0,sz=0,c=d.transaction('full','readonly').objectStore('full').openCursor();
      c.onsuccess=function(){var cur=c.result;if(cur){n++;sz+=(cur.value&&cur.value.size)||0;cur.continue()}else res([n,sz])};
      c.onerror=function(){res([0,0])};
    })});
  }
  function paint(){
    var e=document.getElementById('phst');if(!e)return;
    stats().then(function(s){
      var t='Photos : '+s[0]+' · '+fmt(s[1])+' utilisés';
      var est=navigator.storage&&navigator.storage.estimate?navigator.storage.estimate():Promise.resolve(null);
      return est.then(function(x){
        if(x&&x.quota)t+=' · espace disponible pour l’app : environ '+fmt(Math.max(0,x.quota-x.usage));
        var e2=document.getElementById('phst');if(e2)e2.textContent=t;
      });
    }).catch(function(){});
  }
  var _bh=window.bkHTML;
  window.bkHTML=function(){
    var h=_bh();
    h=h.replace('<button class="addn" onclick="bkExport()">','<p class="sm" id="phst">Photos : calcul…</p><p class="sub lft">Les photos originales restent sur le téléphone. La sauvegarde en contient une version aperçu.</p><button class="addn" onclick="bkExport()">');
    setTimeout(paint,40);setTimeout(paint,400);
    return h;
  };

  /* ---------- démarrage ---------- */
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
  migrateAndReload();
  window.agPhotos={stats:stats,migrate:migrate};
})();
