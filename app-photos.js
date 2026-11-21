/* Photos : stockage IndexedDB (original + aperçu), migration, sauvegarde, compteur.
   Chargé en dernier : redéfinit dph, vbAdd, dpd, vbDel, bkExport, bkHTML (écran Sauvegarde : 2 boutons).
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
  window.bkExport=function(cb){
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
      if(typeof cb==='function')cb();
    });
  };

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
  /* ---------- photos originales : export / import en fichiers zip (sans compression) ---------- */
  var CRCT=null;
  function crc32(u8){
    if(!CRCT){CRCT=new Uint32Array(256);for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?(0xEDB88320^(c>>>1)):(c>>>1);CRCT[n]=c>>>0}}
    var c2=0xFFFFFFFF;for(var i=0;i<u8.length;i++)c2=CRCT[(c2^u8[i])&255]^(c2>>>8);
    return (c2^0xFFFFFFFF)>>>0;
  }
  function p2(n){return (n<10?'0':'')+n}
  function listPhotos(){
    var out=[];
    try{for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i),m=/^agd-(\d+)-(\d+)-(\d+)$/.exec(k),o;
      if(m){
        o=JSON.parse(localStorage.getItem(k)||'{}');
        (o.p||[]).forEach(function(r,j){if(typeof r==='string'&&r.indexOf('idb:')===0)out.push({id:r.slice(4),name:'jour/'+m[1]+'-'+p2(+m[2])+'-'+p2(+m[3])+'_'+(j+1)})});
      }else if(/^ag-vb(-\d{4})?$/.test(k)){
        o=JSON.parse(localStorage.getItem(k)||'{}');
        (o.p||[]).forEach(function(p,j){if(p&&typeof p.s==='string'&&p.s.indexOf('idb:')===0)out.push({id:p.s.slice(4),name:'vision/'+k+'_'+(j+1)})});
      }
    }}catch(e){}
    return out;
  }
  function extOf(b){var t=(b&&b.type)||'';return t.indexOf('png')>=0?'png':t.indexOf('webp')>=0?'webp':t.indexOf('heic')>=0?'heic':t.indexOf('heif')>=0?'heif':'jpg'}
  function zipBlob(entries){
    var parts=[],central=[],off=0,enc=new TextEncoder(),cs=0;
    entries.forEach(function(e){
      var nm=enc.encode(e.name),sz=e.blob.size,h=new DataView(new ArrayBuffer(30));
      h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(12,0x21,true);
      h.setUint32(14,e.crc,true);h.setUint32(18,sz,true);h.setUint32(22,sz,true);h.setUint16(26,nm.length,true);
      parts.push(h.buffer,nm,e.blob);
      var c=new DataView(new ArrayBuffer(46));
      c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(14,0x21,true);
      c.setUint32(16,e.crc,true);c.setUint32(20,sz,true);c.setUint32(24,sz,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);
      central.push(c.buffer,nm);cs+=46+nm.length;off+=30+nm.length+sz;
    });
    var end=new DataView(new ArrayBuffer(22));
    end.setUint32(0,0x06054b50,true);end.setUint16(8,entries.length,true);end.setUint16(10,entries.length,true);end.setUint32(12,cs,true);end.setUint32(16,off,true);
    return new Blob(parts.concat(central,[end.buffer]),{type:'application/zip'});
  }
  function saveBlob(b,fn){
    var u=URL.createObjectURL(b),a=document.createElement('a');
    a.href=u;a.download=fn;document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(u);a.remove()},120000);
  }
  window.phExport=function(maxBytes,quiet){
    var list=listPhotos(),MAX=(typeof maxBytes==='number'&&maxBytes>0)?maxBytes:250*1048576;
    if(!list.length){if(!quiet)alert('Aucune photo à exporter.');return}
    var parts=[],cur=[],size=0,k=0;
    list.reduce(function(p,it){
      return p.then(function(){
        toast('Préparation des photos '+(++k)+' / '+list.length+'…');
        return get('full',it.id).then(function(b){
          if(!b)return;
          return b.arrayBuffer().then(function(buf){
            var e={name:it.name+'__'+it.id+'.'+extOf(b),blob:b,crc:crc32(new Uint8Array(buf))};
            if(cur.length&&size+b.size>MAX){parts.push(cur);cur=[];size=0}
            cur.push(e);size+=b.size;
          });
        });
      });
    },Promise.resolve()).then(function(){
      if(cur.length)parts.push(cur);
      toast('');
      if(!parts.length){if(!quiet)alert('Aucune photo originale trouvée.');return}
      var d=new Date(),ds=d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
      parts.forEach(function(en,i){
        setTimeout(function(){
          toast('Téléchargement partie '+(i+1)+' / '+parts.length+'…');
          saveBlob(zipBlob(en),'agenda-photos-originales-'+ds+'-partie'+(i+1)+'-sur-'+parts.length+'.zip');
          if(i===parts.length-1)setTimeout(function(){toast('');alert((quiet?'Sauvegarde + ':'')+list.length+' photos exportées en '+parts.length+' fichier(s) zip. Garde tous ces fichiers ensemble en lieu sûr (Google Drive, ordinateur).')},1500);
        },i*2500);
      });
    }).catch(function(){toast('');alert('Impossible de préparer les photos.')});
  };
  function readZip(file){
    var n=Math.min(file.size,65557),tail=file.slice(file.size-n);
    return tail.arrayBuffer().then(function(ab){
      var v=new DataView(ab),i=ab.byteLength-22;
      while(i>=0&&v.getUint32(i,true)!==0x06054b50)i--;
      if(i<0)throw 0;
      var cnt=v.getUint16(i+10,true),cdSize=v.getUint32(i+12,true),cdOff=v.getUint32(i+16,true);
      return file.slice(cdOff,cdOff+cdSize).arrayBuffer().then(function(cb){
        var cv=new DataView(cb),p=0,out=[],dec=new TextDecoder();
        for(var j=0;j<cnt&&p+46<=cb.byteLength;j++){
          var nl=cv.getUint16(p+28,true),el=cv.getUint16(p+30,true),cl=cv.getUint16(p+32,true);
          out.push({method:cv.getUint16(p+10,true),size:cv.getUint32(p+24,true),off:cv.getUint32(p+42,true),name:dec.decode(new Uint8Array(cb,p+46,nl))});
          p+=46+nl+el+cl;
        }
        return out;
      });
    });
  }
  function targetRef(name){
    var m=/^(jour|vision)\/(.+?)_(\d+)(?:__[a-z0-9]+)?\.[a-z0-9]+$/i.exec(name);
    if(!m)return null;
    var key,idx=parseInt(m[3],10)-1,o;
    if(m[1]==='jour'){var d=/^(\d+)-(\d+)-(\d+)$/.exec(m[2]);if(!d)return null;key='agd-'+d[1]+'-'+parseInt(d[2],10)+'-'+parseInt(d[3],10)}
    else key=m[2];
    try{o=JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}
    if(!o||!o.p)return null;
    var r=o.p[idx];if(r&&typeof r==='object')r=r.s;
    return(typeof r==='string'&&r.indexOf('idb:')===0)?r.slice(4):null;
  }
  function importZips(files){
    var ok=0,skip=0;
    return files.reduce(function(p,f){
      return p.then(function(){
        return readZip(f).then(function(ents){
          return ents.reduce(function(q,e){
            return q.then(function(){
              toast('Restauration des photos… '+(ok+skip+1));
              var id=e.method===0?targetRef(e.name):null;
              if(!id){skip++;return}
              return f.slice(e.off,e.off+30).arrayBuffer().then(function(h){
                var hv=new DataView(h),st=e.off+30+hv.getUint16(26,true)+hv.getUint16(28,true),ex=(/\.([a-z0-9]+)$/i.exec(e.name)||[])[1]||'jpg';
                var t=/png/i.test(ex)?'image/png':/webp/i.test(ex)?'image/webp':/hei/i.test(ex)?'image/heic':'image/jpeg';
                return put('full',id,f.slice(st,st+e.size,t)).then(function(){ok++});
              });
            });
          },Promise.resolve());
        }).catch(function(){skip++});
      });
    },Promise.resolve()).then(function(){return {ok:ok,skip:skip}});
  }

  /* ---------- un seul bouton pour tout exporter, un seul pour tout restaurer ---------- */
  window.agExportAll=function(){
    window.bkExport(function(){window.phExport(0,true)});
  };
  window.agRestoreAll=function(inp){
    var files=[].slice.call(inp.files||[]);if(!files.length)return;
    var js=files.filter(function(f){return /\.json$/i.test(f.name)||f.type==='application/json'});
    var zs=files.filter(function(f){return /\.zip$/i.test(f.name)||/zip/i.test(f.type)});
    if(!js.length&&!zs.length){alert('Choisis le fichier de sauvegarde (.json) et les fichiers photos (.zip).');return}
    function stop(msg){toast('');if(msg)alert(msg)}
    var head=js.length?js[0].text().then(function(t){
      var o;try{o=JSON.parse(t)}catch(e){o=null}
      if(!o||o.app!=='agenda'||!o.d){stop('Ce fichier n’est pas une sauvegarde valide.');return false}
      var n=Object.keys(o.d).length;
      if(!confirm('Restaurer cette sauvegarde ('+n+' éléments, '+String(o.t||'').slice(0,10)+')'+(zs.length?' et '+zs.length+' fichier(s) de photos':'')+' ? Les données actuelles de l’app seront remplacées.'))return false;
      try{Object.keys(o.d).forEach(function(k){if(/^(ag|agw|agd)-/.test(k))localStorage.setItem(k,o.d[k])})}
      catch(e){stop('Espace insuffisant pour restaurer.');return false}
      toast('Restauration…');
      return migrate().then(function(){return true});
    }):Promise.resolve(true);
    head.then(function(go){
      if(!go)return;
      return importZips(zs).then(function(r){
        toast('');
        alert('Restauration terminée'+(zs.length?' : '+r.ok+' photo(s) originale(s) remise(s)'+(r.skip?' ('+r.skip+' ignorée(s))':''):'')+'.');
        location.reload();
      });
    }).catch(function(){stop('La restauration a échoué.')});
  };

  /* ---------- écran Sauvegarde (remplace l'ancien : 2 boutons seulement) ---------- */
  window.bkHTML=function(){
    var c=bkCount(),lb=lastBk();
    var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Sauvegarde</span><button onclick="ovClose()">✕</button></div>';
    h+='<p class="sub lft">Tes notes, photos, listes et dates sont gardées dans ce téléphone. Fais une sauvegarde de temps en temps pour ne rien perdre.</p>';
    h+='<p class="sm">'+c[0]+' éléments · '+Math.round(c[1]/1024)+' Ko</p>';
    h+='<p class="sub">'+(lb?'Dernière sauvegarde : '+new Date(lb).toLocaleDateString('fr-CA',{day:'numeric',month:'long'}):'Aucune sauvegarde pour le moment.')+'</p>';
    h+='<p class="sm" id="phst">Photos : calcul…</p>';
    h+='<button class="addn" onclick="agExportAll()">Tout exporter</button>';
    h+='<label class="addn alt">Tout restaurer<input type="file" accept=".json,.zip,application/json,application/zip" multiple hidden onchange="agRestoreAll(this)"></label>';
    h+='<p class="sub lft">« Tout exporter » télécharge ta sauvegarde et tes photos originales (en plusieurs fichiers zip). Garde tous ces fichiers ensemble dans Google Drive ou sur un ordinateur. Pour tout remettre : « Tout restaurer », puis choisis tous ces fichiers en même temps.</p>';
    h+='<p class="bkm">'+esc(bkMsg)+'</p>';
    setTimeout(paint,40);setTimeout(paint,400);
    return h+'</div></div>';
  };

  /* ---------- démarrage ---------- */
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
  migrateAndReload();
  window.agPhotos={stats:stats,migrate:migrate};
})();
