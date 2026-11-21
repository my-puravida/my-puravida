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
  /* ---------- envoi de la sauvegarde : partager (Proton Drive, Drive, e-mail...) ou télécharger ---------- */
  function markBackup(){
    try{localStorage.setItem('ag-lastbk',String(Date.now()))}catch(e){}
    try{bkMsg='✓ Sauvegarde terminée.';ovUI();render()}catch(e){}
  }
  function downloadFiles(files,nPhotos){
    files.forEach(function(f,i){
      setTimeout(function(){
        toast('Téléchargement '+(i+1)+' / '+files.length+'…');
        saveBlob(f,f.name);
        if(i===files.length-1)setTimeout(function(){
          toast('');markBackup();
          alert('Sauvegarde terminée : '+files.length+' fichier(s) zip'+(nPhotos?' ('+nPhotos+' photos originales)':'')+', dans les téléchargements du téléphone. Garde tous ces fichiers ensemble en lieu sûr (Google Drive, Proton Drive, ordinateur).');
        },1500);
      },i*2500);
    });
  }
  function shareDialog(files,nPhotos){
    var old=document.getElementById('phshare');if(old)old.remove();
    var tot=files.reduce(function(a,f){return a+f.size},0),o=document.createElement('div');
    /* Chrome refuse de partager des .zip ("Permission denied") : on les partage avec .txt à la fin du nom */
    var sfiles=files.map(function(f){return new File([f],f.name+'.txt',{type:'text/plain'})});
    o.id='phshare';
    o.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;z-index:100000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box';
    var bs='display:block;width:100%;box-sizing:border-box;margin:10px 0 0;padding:14px;border-radius:26px;border:1.5px dashed #c48f97;background:#fff;color:#895a64;font:600 14px/1.2 sans-serif;letter-spacing:1px;text-transform:uppercase';
    o.innerHTML='<div style="background:#faf8f6;border-radius:22px;padding:22px;max-width:340px;width:100%;font:15px/1.4 sans-serif;color:#444;text-align:center">'
      +'<p style="margin:0 0 4px;font-size:18px">Sauvegarde prête</p>'
      +'<p style="margin:0 0 12px;color:#895a64">'+files.length+' fichier(s) zip · '+fmt(tot)+(nPhotos?' · '+nPhotos+' photos originales':'')+'</p>'
      +'<button id="phsh1" style="'+bs+';background:#895a64;color:#fff;border-style:solid;border-color:#895a64">Partager</button>'
      +'<p style="margin:12px 0 0;font-size:12px;color:#999">Chrome n’accepte pas le partage de fichiers .zip : ils sont envoyés avec « .txt » à la fin du nom (ex. …partie1-sur-1.zip.txt). Garde-les tels quels, « Tout restaurer » les reconnaît.</p>'
      +'<button id="phsh2" style="'+bs+'">Télécharger sur le téléphone</button>'
      +'<button id="phsh3" style="'+bs+';border:0;background:transparent;color:#999">Fermer</button></div>';
    document.body.appendChild(o);
    var tries=0,b1=document.getElementById('phsh1');
    b1.onclick=function(){
      /* un seul appel, directement dans le toucher (sinon Chrome refuse : "user gesture") */
      var data=tries===0?{files:sfiles,title:'Sauvegarde agenda'}:{files:sfiles};
      var p;
      try{p=navigator.share(data)}catch(e){p=Promise.reject(e)}
      p.then(function(){o.remove();markBackup()}).catch(function(e){
        if(e&&e.name==='AbortError')return;
        tries++;
        b1.textContent='Réessayer (mode simple)';
        alert('Le partage n’a pas fonctionné.\nDétail : '+(e&&e.name?e.name:'?')+(e&&e.message?' – '+String(e.message).slice(0,160):'')+'\nTu peux réessayer, ou utiliser « Télécharger sur le téléphone ».');
      });
    };
    document.getElementById('phsh2').onclick=function(){o.remove();downloadFiles(files,nPhotos)};
    document.getElementById('phsh3').onclick=function(){o.remove()};
  }
  function buildBackupJSON(){
    var d={},ids={};
    try{for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(/^(ag|agw|agd)-/.test(k)&&k!=='ag-lastbk'){
        var v=localStorage.getItem(k)||'';d[k]=v;
        v.replace(/idb:[a-z0-9]+/g,function(m){ids[m]=1});
      }
    }}catch(e){}
    return Promise.all(Object.keys(ids).map(function(r){
      return get('thumb',r.slice(4)).then(function(b){return b||get('full',r.slice(4))}).then(function(b){return b?b2d(b):null}).then(function(u){return [r,u]});
    })).then(function(pairs){
      var map={};pairs.forEach(function(p){if(p[1])map[p[0]]=p[1]});
      Object.keys(d).forEach(function(k){if(d[k].indexOf('idb:')>=0)d[k]=d[k].replace(/idb:[a-z0-9]+/g,function(m){return map[m]||m})});
      return JSON.stringify({app:'agenda',v:1,t:new Date().toISOString(),d:d});
    });
  }
  /* Tout exporter : uniquement des fichiers zip. Le 1er contient la sauvegarde (sauvegarde.json) */
  window.agExportAll=function(maxBytes){
    var MAX=(typeof maxBytes==='number'&&maxBytes>0)?maxBytes:250*1048576,list=listPhotos();
    toast('Préparation…');
    buildBackupJSON().then(function(json){
      var jb=new Blob([json],{type:'application/json'});
      return jb.arrayBuffer().then(function(buf){
        var parts=[],cur=[{name:'sauvegarde.json',blob:jb,crc:crc32(new Uint8Array(buf))}],size=jb.size,k=0;
        return list.reduce(function(p,it){
          return p.then(function(){
            toast('Préparation des photos '+(++k)+' / '+list.length+'…');
            return get('full',it.id).then(function(b){
              if(!b)return;
              return b.arrayBuffer().then(function(ab){
                var e={name:it.name+'__'+it.id+'.'+extOf(b),blob:b,crc:crc32(new Uint8Array(ab))};
                if(cur.length>1&&size+b.size>MAX){parts.push(cur);cur=[];size=0}
                cur.push(e);size+=b.size;
              });
            });
          });
        },Promise.resolve()).then(function(){
          parts.push(cur);toast('');
          var d=new Date(),ds=d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
          var files=parts.map(function(en,i){
            return new File([zipBlob(en)],'agenda-sauvegarde-'+ds+'-partie'+(i+1)+'-sur-'+parts.length+'.zip',{type:'application/zip'});
          });
          var canShare=false;
          try{canShare=!!(navigator.share&&navigator.canShare&&navigator.canShare({files:files.map(function(f){return new File([f],f.name+'.txt',{type:'text/plain'})})}))}catch(e){}
          if(canShare)shareDialog(files,list.length);
          else downloadFiles(files,list.length);
        });
      });
    }).catch(function(){toast('');alert('Impossible de préparer la sauvegarde.')});
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
    var ok=0,skip=0,err='';
    function bad(e){skip++;if(!err)err=(e&&e.name)?e.name:'erreur'}
    return files.reduce(function(p,f){
      return p.then(function(){
        return readZip(f).then(function(ents){
          return ents.reduce(function(q,e){
            return q.then(function(){
              toast('Restauration des photos… '+(ok+skip+1));
              if(e.name==='sauvegarde.json')return;
              var id=e.method===0?targetRef(e.name):null;
              if(!id){skip++;return}
              return f.slice(e.off,e.off+30).arrayBuffer().then(function(h){
                var hv=new DataView(h),st=e.off+30+hv.getUint16(26,true)+hv.getUint16(28,true),ex=(/\.([a-z0-9]+)$/i.exec(e.name)||[])[1]||'jpg';
                var t=/png/i.test(ex)?'image/png':/webp/i.test(ex)?'image/webp':/hei/i.test(ex)?'image/heic':'image/jpeg';
                /* on copie les octets en mémoire avant de les ranger : un fichier venant de Proton Drive / Drive ne peut pas être gardé "par référence" */
                return f.slice(st,st+e.size).arrayBuffer().then(function(buf){
                  return put('full',id,new Blob([buf],{type:t}));
                }).then(function(){ok++});
              }).catch(bad);
            });
          },Promise.resolve());
        }).catch(bad);
      });
    },Promise.resolve()).then(function(){return {ok:ok,skip:skip,err:err}});
  }

  /* ---------- un seul bouton pour tout exporter, un seul pour tout restaurer ---------- */
  function zipText(f,e){
    return f.slice(e.off,e.off+30).arrayBuffer().then(function(h){
      var hv=new DataView(h),st=e.off+30+hv.getUint16(26,true)+hv.getUint16(28,true);
      return f.slice(st,st+e.size).text();
    });
  }
  window.agRestoreAll=function(inp){
    var files=[].slice.call(inp.files||[]);if(!files.length)return;
    var js=[],zs=[],nothing=false;
    function stop(msg){toast('');if(msg)alert(msg)}
    toast('Lecture des fichiers…');
    var classify=files.reduce(function(p,f){
      return p.then(function(){
        return f.slice(0,4).arrayBuffer().then(function(ab){
          var u=new Uint8Array(ab);
          if(u[0]===0x50&&u[1]===0x4B)zs.push(f);                      /* PK : zip, même renommé en .zip.txt */
          else if(u[0]===0x7B||/\.json$/i.test(f.name))js.push(f);     /* { : ancienne sauvegarde json */
        });
      });
    },Promise.resolve());
    /* 1) chercher la sauvegarde : dans un zip (sauvegarde.json) ou dans un ancien fichier .json */
    var find=classify.then(function(){
      if(!js.length&&!zs.length){nothing=true;stop('Aucun fichier de sauvegarde reconnu. Choisis les fichiers zip de ta sauvegarde (tous en même temps).');return null}
      return zs.reduce(function(p,f){
      return p.then(function(txt){
        if(txt)return txt;
        return readZip(f).then(function(ents){
          var e=ents.filter(function(x){return x.name==='sauvegarde.json'&&x.method===0})[0];
          return e?zipText(f,e):null;
        }).catch(function(){return null});
      });
    },Promise.resolve(null)).then(function(txt){return txt||(js.length?js[0].text():null)});
    });
    find.then(function(txt){
      if(nothing)return false;
      if(!txt)return true;                       /* pas de sauvegarde : on remet seulement les photos */
      var o;try{o=JSON.parse(txt)}catch(e){o=null}
      if(!o||o.app!=='agenda'||!o.d){stop('Ce fichier n’est pas une sauvegarde valide.');return false}
      if(!confirm('Restaurer cette sauvegarde ('+Object.keys(o.d).length+' éléments, '+String(o.t||'').slice(0,10)+')'+(zs.length?' avec '+zs.length+' fichier(s) zip':'')+' ? Les données actuelles de l’app seront remplacées.'))return false;
      try{Object.keys(o.d).forEach(function(k){if(/^(ag|agw|agd)-/.test(k))localStorage.setItem(k,o.d[k])})}
      catch(e){stop('Espace insuffisant pour restaurer.');return false}
      toast('Restauration…');
      return migrate().then(function(){return true});
    }).then(function(go){
      if(!go)return;
      return importZips(zs).then(function(r){
        toast('');
        alert('Restauration terminée'+(zs.length?' : '+r.ok+' photo(s) originale(s) remise(s)'+(r.skip?' ('+r.skip+' ignorée(s)'+(r.err?' : '+r.err:'')+')':''):'')+'.');
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
    h+='<label class="addn alt">Tout restaurer<input type="file" multiple hidden onchange="agRestoreAll(this)"></label>';
    h+='<p class="sub lft">« Tout exporter » télécharge ta sauvegarde et tes photos originales dans un ou plusieurs fichiers zip. Garde tous ces fichiers ensemble dans Google Drive ou sur un ordinateur. Pour tout remettre : « Tout restaurer », puis choisis tous ces fichiers zip en même temps.</p>';
    h+='<p class="bkm">'+esc(bkMsg)+'</p>';
    setTimeout(paint,40);setTimeout(paint,400);
    return h+'</div></div>';
  };

  /* ---------- démarrage ---------- */
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
  migrateAndReload();
  window.agPhotos={stats:stats,migrate:migrate};
})();
