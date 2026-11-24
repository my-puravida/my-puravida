/* ===== Coffre secret : code a 6 chiffres + chiffrement AES-GCM ===== */
(function(){
  var IT=250000,KM='ag-sec-meta',KD='ag-sec-data';
  window.__secLimit=30000;
  var SEC={key:null,dk:null,data:null,tm:null},ED=null,PAD=null,SAVEQ=Promise.resolve(),saveT=null;
  var enc=new TextEncoder(),dec=new TextDecoder();
  function hasCrypto(){return !!(window.crypto&&crypto.subtle&&window.TextEncoder)}
  function b64(u){var s='';for(var i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s)}
  function ub64(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
  function rnd(n){return crypto.getRandomValues(new Uint8Array(n))}
  function derive(pass,salt,it){
    return crypto.subtle.importKey('raw',enc.encode(pass),'PBKDF2',false,['deriveKey']).then(function(k){
      return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:it,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
    });
  }
  function aesEnc(key,bytes){var iv=rnd(12);return crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,bytes).then(function(ct){return{iv:b64(iv),ct:b64(new Uint8Array(ct))}})}
  function aesDec(key,o){return crypto.subtle.decrypt({name:'AES-GCM',iv:ub64(o.iv)},key,ub64(o.ct))}
  function meta(){try{return JSON.parse(localStorage.getItem(KM))}catch(e){return null}}
  window.secExists=function(){return !!meta()};
  var ALPHA='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function genRec(){var b=rnd(16),s='';for(var i=0;i<16;i++){s+=ALPHA.charAt(b[i]%32);if(i%4===3&&i<15)s+='-'}return s}
  function recNorm(s){return String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'')}

  function openWithDK(raw){
    return crypto.subtle.importKey('raw',raw,'AES-GCM',false,['encrypt','decrypt']).then(function(key){
      SEC.key=key;SEC.dk=raw;
      var d=localStorage.getItem(KD);
      if(!d){SEC.data={j:[],d:{}};return}
      return aesDec(key,JSON.parse(d)).then(function(b){SEC.data=JSON.parse(dec.decode(b));SEC.data.j=SEC.data.j||[];SEC.data.d=SEC.data.d||{}});
    });
  }
  function doSave(){
    if(!SEC.key||!SEC.data)return Promise.resolve();
    return aesEnc(SEC.key,enc.encode(JSON.stringify(SEC.data))).then(function(o){try{localStorage.setItem(KD,JSON.stringify(o))}catch(e){}});
  }
  function save(){SAVEQ=SAVEQ.then(doSave,doSave);return SAVEQ}
  function saveSoon(){clearTimeout(saveT);saveT=setTimeout(save,450)}
  function unlock(code){
    var m=meta();if(!m)return Promise.resolve(false);
    return derive(code,ub64(m.s1),m.it).then(function(k){return aesDec(k,m.w1)}).then(function(raw){return openWithDK(new Uint8Array(raw))}).then(function(){return true},function(){return false});
  }
  window.secUnlock=unlock;
  function create(code,rec){
    var dk=rnd(32),s1=rnd(16),s2=rnd(16);
    return Promise.all([derive(code,s1,IT),derive(recNorm(rec),s2,IT)]).then(function(ks){return Promise.all([aesEnc(ks[0],dk),aesEnc(ks[1],dk)])}).then(function(w){
      localStorage.setItem(KM,JSON.stringify({v:1,it:IT,s1:b64(s1),w1:w[0],s2:b64(s2),w2:w[1]}));
      return openWithDK(dk);
    }).then(function(){SEC.data={j:[],d:{}};return save()});
  }
  function rewrapCode(newCode){
    var m=meta(),s1=rnd(16);
    return derive(newCode,s1,m.it).then(function(k){return aesEnc(k,SEC.dk)}).then(function(w){m.s1=b64(s1);m.w1=w;localStorage.setItem(KM,JSON.stringify(m))});
  }
  function newRecovery(){
    var m=meta(),rec=genRec(),s2=rnd(16);
    return derive(recNorm(rec),s2,m.it).then(function(k){return aesEnc(k,SEC.dk)}).then(function(w){m.s2=b64(s2);m.w2=w;localStorage.setItem(KM,JSON.stringify(m));return rec});
  }
  function recover(phrase){
    var m=meta();
    return derive(recNorm(phrase),ub64(m.s2),m.it).then(function(k){return aesDec(k,m.w2)}).then(function(raw){return openWithDK(new Uint8Array(raw))}).then(function(){return true},function(){return false});
  }

  /* essais ratés : pause apres 5 erreurs */
  function failInfo(){try{return JSON.parse(localStorage.getItem('secfail'))||{n:0,t:0}}catch(e){return{n:0,t:0}}}
  function cooldown(){var f=failInfo();if(f.n<5)return 0;var wait=Math.min(300,30*(f.n-4)),left=Math.ceil(wait-(Date.now()-f.t)/1000);return left>0?left:0}
  function failed(){var f=failInfo();f.n++;f.t=Date.now();try{localStorage.setItem('secfail',JSON.stringify(f))}catch(e){}}
  function okReset(){try{localStorage.removeItem('secfail')}catch(e){}}

  function toast(msg){var t=document.createElement('div');t.className='toastx';t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.classList.add('out')},1700);setTimeout(function(){t.remove()},2200)}
  function esc2(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function mshort(i){return MONTHS[i].slice(0,3).toLowerCase()+'.'}
  function fmtD(ts,time){var d=new Date(ts);return d.getDate()+' '+mshort(d.getMonth())+' '+d.getFullYear()+(time?' \u00b7 '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2):'')}

  /* ---------- verrouillage ---------- */
  function startTimer(){clearTimeout(SEC.tm);SEC.tm=setTimeout(function(){lockNow(true)},window.__secLimit)}
  function lockNow(auto){
    clearTimeout(saveT);
    var p=doSave();
    SEC.key=null;SEC.dk=null;ED=null;PAD=null;clearTimeout(SEC.tm);
    var x=document.getElementById('secx');
    p.then(function(){SEC.data=null});
    if(x){x.remove();document.body.style.overflow='';if(auto)toast('Verrouill\u00e9 \ud83d\udd12')}
  }
  document.addEventListener('visibilitychange',function(){if(document.hidden&&SEC.key)lockNow(false)});
  window.addEventListener('pagehide',function(){if(SEC.key)lockNow(false)});

  /* ---------- rendu ---------- */
  var LOCK='<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1" fill="currentColor"/></svg>';
  var MICS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
  function X(){
    var x=document.getElementById('secx');
    if(!x){
      x=document.createElement('div');x.id='secx';x.className='secx';
      ['touchstart','touchend','touchmove'].forEach(function(ev){x.addEventListener(ev,function(e){e.stopPropagation()},{passive:true})});
      ['touchstart','pointerdown','keydown','input','scroll'].forEach(function(ev){x.addEventListener(ev,function(){if(SEC.key)startTimer()},{passive:true,capture:true})});
      x.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-k]');if(b&&PAD)padKey(b.getAttribute('data-k'))});
      document.body.appendChild(x);document.body.style.overflow='hidden';
    }
    return x;
  }
  function render(h){X().innerHTML=h}
  function closeX(){var x=document.getElementById('secx');if(x)x.remove();document.body.style.overflow=''}

  /* ---------- clavier a 6 chiffres ---------- */
  function showPad(title,sub,cb,extra,msg){
    var keys='';for(var i=1;i<=9;i++)keys+='<button data-k="'+i+'">'+i+'</button>';
    render('<div class="sxh"><button class="sxc" onclick="secU.cancel()" aria-label="Fermer">\u2715</button></div>'
      +'<div class="sxp"><div class="sxl">'+LOCK+'</div><h2>'+title+'</h2><p class="sxs">'+sub+'</p>'
      +'<div class="sxd" id="sxd"><i></i><i></i><i></i><i></i><i></i><i></i></div><p class="sxm" id="sxm">'+(msg||'')+'</p>'
      +'<div class="sxk">'+keys+'<button class="sxn" disabled></button><button data-k="0">0</button><button data-k="B" aria-label="Effacer">\u232b</button></div>'+(extra||'')+'</div>');
    PAD={buf:'',cb:cb,busy:false};
  }
  function dots(){var d=document.querySelectorAll('#sxd i');for(var i=0;i<d.length;i++)d[i].className=i<PAD.buf.length?'on':''}
  function padKey(k){
    if(!PAD||PAD.busy)return;
    if(k==='B')PAD.buf=PAD.buf.slice(0,-1);else if(PAD.buf.length<6)PAD.buf+=k;
    dots();
    if(PAD.buf.length===6){PAD.busy=true;var c=PAD.buf,cb=PAD.cb;setTimeout(function(){cb(c)},140)}
  }
  function padReset(msg,shake){
    if(!PAD)return;PAD.buf='';PAD.busy=false;dots();
    var m=document.getElementById('sxm');if(m)m.textContent=msg||'';
    var d=document.getElementById('sxd');if(d&&shake){d.classList.remove('sh');void d.offsetWidth;d.classList.add('sh')}
  }

  /* ---------- ouvrir ---------- */
  function openThen(then){
    if(!hasCrypto()){toast('Le coffre secret n\u2019est pas disponible ici');return}
    if(SEC.key){startTimer();then();return}
    if(!window.secExists()){setup(then);return}
    gate(then);
  }
  window.secOpen=function(then){openThen(then||vault)};
  function gate(then){
    showPad('Code secret','Entre ton code \u00e0 6 chiffres',function(code){
      var c=cooldown();if(c>0){padReset('R\u00e9essaie dans '+c+' s',true);return}
      unlock(code).then(function(ok){
        if(ok){okReset();startTimer();then()}
        else{failed();var c2=cooldown();padReset(c2>0?'Trop d\u2019essais. R\u00e9essaie dans '+c2+' s':'Code incorrect',true)}
      });
    },'<button class="sxf" onclick="secU.forgot()">Code oubli\u00e9 ?</button>');
  }
  function setup(then,msg){
    showPad('Cr\u00e9e ton code','6 chiffres \u00b7 le premier ne peut pas \u00eatre 0',function(c1){
      if(c1.charAt(0)==='0'){padReset('Le premier chiffre ne peut pas \u00eatre 0',true);return}
      showPad('Confirme ton code','Entre-le encore une fois',function(c2){
        if(c2!==c1){setup(then,'Les deux codes sont diff\u00e9rents. Recommence.');return}
        phrase(c1,then);
      });
    },null,msg);
  }
  function phrase(code,then){
    var rec=genRec();
    render('<div class="sxh"><button class="sxc" onclick="secU.cancel()" aria-label="Fermer">\u2715</button></div>'
      +'<div class="sxp"><div class="sxl">'+LOCK+'</div><h2>Ta phrase de secours</h2>'
      +'<p class="sxs">Si tu oublies ton code, elle est le seul moyen de retrouver tes notes.</p>'
      +'<div class="sxr">'+rec+'</div>'
      +'<p class="sxs sxw">\u00c9cris-la sur papier et garde-la \u00e0 l\u2019abri. Sans le code ni cette phrase, tes notes secr\u00e8tes sont perdues pour toujours : personne ne peut les r\u00e9cup\u00e9rer, pas m\u00eame moi.</p>'
      +'<button class="sxb" id="sxgo">Je l\u2019ai not\u00e9e</button></div>');
    document.getElementById('sxgo').onclick=function(){
      this.disabled=true;this.textContent='Chiffrement\u2026';
      create(code,rec).then(function(){okReset();startTimer();then()},function(){toast('Erreur de cr\u00e9ation');closeX()});
    };
  }
  function forgot(){
    render('<div class="sxh"><button class="sxc" onclick="secU.cancel()" aria-label="Fermer">\u2715</button></div>'
      +'<div class="sxp"><div class="sxl">'+LOCK+'</div><h2>Code oubli\u00e9</h2><p class="sxs">Entre ta phrase de secours.</p>'
      +'<input id="sxrec" class="sxi" placeholder="XXXX-XXXX-XXXX-XXXX" autocapitalize="characters" autocomplete="off" spellcheck="false">'
      +'<p class="sxm" id="sxm2"></p><button class="sxb" id="sxok">Continuer</button><button class="sxf" onclick="secU.gateBack()">Retour</button></div>');
    document.getElementById('sxok').onclick=function(){
      var v=document.getElementById('sxrec').value,b=this;b.disabled=true;b.textContent='V\u00e9rification\u2026';
      recover(v).then(function(ok){
        if(!ok){b.disabled=false;b.textContent='Continuer';document.getElementById('sxm2').textContent='Phrase incorrecte';return}
        okReset();newCode();
      });
    };
  }
  function newCode(msg){
    showPad('Nouveau code','Choisis un nouveau code \u00e0 6 chiffres',function(c1){
      if(c1.charAt(0)==='0'){padReset('Le premier chiffre ne peut pas \u00eatre 0',true);return}
      showPad('Confirme ton code','Entre-le encore une fois',function(c2){
        if(c2!==c1){newCode('Les deux codes sont diff\u00e9rents. Recommence.');return}
        rewrapCode(c1).then(function(){toast('Code modifi\u00e9');startTimer();vault()});
      });
    },null,msg);
  }

  /* ---------- journal secret ---------- */
  function entries(){
    var a=SEC.data.j.map(function(e){return{k:'j',id:e.id,ts:e.ts,t:e.t}});
    Object.keys(SEC.data.d).forEach(function(k){var p=k.split('-');a.push({k:'d',id:k,ts:new Date(+p[0],+p[1]-1,+p[2],12).getTime(),t:SEC.data.d[k]})});
    a.sort(function(x,y){return y.ts-x.ts});
    return a;
  }
  function vault(){
    ED=null;
    var list=entries(),h='<div class="sxh sxh2"><div class="sxt">'+LOCK+'<span>Journal secret</span></div><button class="sxlk" onclick="secU.lock()">Verrouiller</button></div>'
      +'<div class="sxbody"><p class="sxs sxn2">Chiffr\u00e9 \u00b7 se verrouille apr\u00e8s 30 s sans toucher</p>'
      +'<button class="sxnew" onclick="secU.newEntry()">+ Nouvelle entr\u00e9e</button>';
    if(!list.length)h+='<p class="sxe">Rien ici pour l\u2019instant. Ce que tu \u00e9cris reste entre toi et ce t\u00e9l\u00e9phone.</p>';
    list.forEach(function(e){
      var pre=String(e.t||'').trim().split('\n').slice(0,2).join(' \u00b7 ')||'(vide)';
      h+='<div class="sxcard" onclick="secU.edit(\''+e.k+'\',\''+e.id+'\')"><b>'+(e.k==='d'?'Jardin \u00b7 '+fmtD(e.ts):fmtD(e.ts,true))+'</b><span>'+esc2(pre.slice(0,140))+'</span></div>';
    });
    h+='<div class="sxset"><button onclick="secU.changeCode()">Changer le code</button><button onclick="secU.newRec()">Nouvelle phrase de secours</button></div></div>';
    render(h);
  }
  function editor(kind,id,fromDay){
    var txt=kind==='d'?(SEC.data.d[id]||''):((SEC.data.j.filter(function(e){return e.id===id})[0]||{}).t||'');
    var title=kind==='d'?'Jardin secret \u00b7 '+(function(){var p=id.split('-');return fmtD(new Date(+p[0],+p[1]-1,+p[2]).getTime())})():'Entr\u00e9e secr\u00e8te';
    ED={k:kind,id:id,day:!!fromDay,del:false};
    render('<div class="sxh sxh2"><button class="sxbk" onclick="secU.back()">\u2039 '+(fromDay?'Fermer':'Retour')+'</button><div class="sxtt">'+title+'</div>'
      +(fromDay?'':'<button class="sxdel" id="sxdel" onclick="secU.del()">Supprimer</button>')+'</div>'
      +'<div class="sxbody sxed"><textarea id="sxta" class="sxta" placeholder="\u00c9cris librement\u2026" oninput="secU.inp(this)">'+esc2(txt)+'</textarea>'
      +'<button class="nmic sxmic" aria-label="Dicter" onclick="nDict(this,\'sxta\')">'+MICS+'</button></div>');
    var ta=document.getElementById('sxta');setTimeout(function(){grow(ta);try{ta.focus()}catch(e){}},60);
  }
  function grow(t){if(!t)return;t.style.height='auto';t.style.height=Math.max(260,t.scrollHeight+6)+'px'}

  window.secU={
    cancel:function(){lockNow(false)},
    lock:function(){lockNow(true)},
    gateBack:function(){gate(vault)},
    forgot:forgot,
    newEntry:function(){var e={id:Date.now().toString(36),ts:Date.now(),t:''};SEC.data.j.push(e);editor('j',e.id,false)},
    edit:function(k,id){editor(k,id,false)},
    inp:function(t){
      if(!ED||!SEC.data)return;
      if(ED.k==='d')SEC.data.d[ED.id]=t.value;
      else{var e=SEC.data.j.filter(function(x){return x.id===ED.id})[0];if(e)e.t=t.value}
      grow(t);saveSoon();
    },
    back:function(){
      var t=document.getElementById('sxta');
      if(ED&&ED.k==='j'&&t&&!t.value.trim())SEC.data.j=SEC.data.j.filter(function(x){return x.id!==ED.id});
      if(ED&&ED.k==='d'&&t&&!t.value.trim())delete SEC.data.d[ED.id];
      var day=ED&&ED.day;
      save().then(function(){if(day)lockNow(false);else{startTimer();vault()}});
    },
    del:function(){
      var b=document.getElementById('sxdel');
      if(!ED.del){ED.del=true;b.textContent='Confirmer ?';b.classList.add('on');setTimeout(function(){if(ED&&b){ED.del=false;b.textContent='Supprimer';b.classList.remove('on')}},3000);return}
      if(ED.k==='d')delete SEC.data.d[ED.id];else SEC.data.j=SEC.data.j.filter(function(x){return x.id!==ED.id});
      save().then(function(){toast('Entr\u00e9e supprim\u00e9e');vault()});
    },
    changeCode:function(){newCode()},
    newRec:function(){
      newRecovery().then(function(rec){
        render('<div class="sxh"><button class="sxc" onclick="secU.done()" aria-label="Fermer">\u2715</button></div><div class="sxp"><div class="sxl">'+LOCK+'</div><h2>Nouvelle phrase</h2><p class="sxs">L\u2019ancienne ne fonctionne plus.</p><div class="sxr">'+rec+'</div><p class="sxs sxw">\u00c9cris-la sur papier et garde-la \u00e0 l\u2019abri.</p><button class="sxb" onclick="secU.done()">Je l\u2019ai not\u00e9e</button></div>');
      });
    },
    done:function(){startTimer();vault()}
  };

  /* seul acces : appui long (0,8 s) sur le grand chiffre du jour de l'accueil */
  var lp=null;
  function target(el){
    if(!el||!el.closest)return null;
    return el.closest('.hero .hn');
  }
  function lpStart(e){
    var t=target(e.target);if(!t)return;
    var pt=(e.touches&&e.touches[0])||e;
    lp={x:pt.clientX,y:pt.clientY,tm:setTimeout(function(){
      window.__lpSup=Date.now()+1200;lp=null;
      try{if(navigator.vibrate)navigator.vibrate(30)}catch(x){}
      secOpen();
    },800)};
  }
  function lpEnd(){if(lp){clearTimeout(lp.tm);lp=null}}
  function lpMove(e){if(!lp)return;var pt=(e.touches&&e.touches[0])||e;if(Math.abs(pt.clientX-lp.x)>12||Math.abs(pt.clientY-lp.y)>12)lpEnd()}
  document.addEventListener('touchstart',lpStart,{passive:true});
  document.addEventListener('touchmove',lpMove,{passive:true});
  document.addEventListener('touchend',lpEnd,{passive:true});
  document.addEventListener('touchcancel',lpEnd,{passive:true});
  document.addEventListener('mousedown',lpStart);
  document.addEventListener('mousemove',lpMove);
  document.addEventListener('mouseup',lpEnd);
  document.addEventListener('contextmenu',function(e){if(target(e.target))e.preventDefault()});
  document.addEventListener('click',function(e){
    if(window.__lpSup&&Date.now()<window.__lpSup){e.stopPropagation();e.preventDefault();window.__lpSup=0}
  },true);

  var st=document.createElement('style');
  st.textContent='.hero .hn{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}'
   +'.secx{position:fixed;inset:0;z-index:10040;background:linear-gradient(180deg,#f9f8f6,#f3e7e7);color:#39393b;display:flex;flex-direction:column;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:calc(env(safe-area-inset-top,0px) + 10px) 18px calc(env(safe-area-inset-bottom,0px) + 24px);box-sizing:border-box}'
   +'.sxh{display:flex;justify-content:flex-end;align-items:center;padding:6px 0}.sxh2{justify-content:space-between;gap:10px}'
   +'.sxc{width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.85);color:#525156;font-size:18px;cursor:pointer;box-shadow:0 6px 12px -8px rgba(57,57,59,.5)}'
   +'.sxp{flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:4px}'
   +'.sxl{width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#707072;background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7 70%);box-shadow:0 12px 20px -12px rgba(57,57,59,.6),inset 0 0 0 1px #e8ced1}'
   +'.sxp h2{margin:14px 0 4px;font-family:"Lora",Georgia,serif;font-style:italic;font-weight:500;font-size:26px;color:#39393b}'
   +'.sxs{margin:0;font-size:13px;color:#707072;letter-spacing:.02em;line-height:1.5;max-width:300px}.sxw{margin-top:12px;color:#895a64}'
   +'.sxd{display:flex;gap:14px;margin:22px 0 6px}.sxd i{width:14px;height:14px;border-radius:50%;border:1.5px solid #929093;background:transparent;transition:all .12s}.sxd i.on{background:#525156;border-color:#525156;transform:scale(1.1)}'
   +'.sxd.sh{animation:sxsh .4s}@keyframes sxsh{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(9px)}60%{transform:translateX(-7px)}80%{transform:translateX(5px)}}'
   +'.sxm{min-height:18px;margin:2px 0 8px;font-size:12px;color:#895a64;letter-spacing:.03em}'
   +'.sxk{display:grid;grid-template-columns:repeat(3,76px);gap:12px 18px;margin-top:6px}'
   +'.sxk button{width:76px;height:76px;border-radius:50%;border:0;background:rgba(255,255,255,.9);color:#39393b;font:inherit;font-size:26px;font-weight:500;cursor:pointer;box-shadow:0 8px 14px -10px rgba(57,57,59,.55),inset 0 0 0 1px #e8ced1}.sxk button:active{background:#e8ced1}.sxk .sxn{visibility:hidden}'
   +'.sxf{margin-top:18px;border:0;background:none;color:#707072;font:inherit;font-size:12px;letter-spacing:.08em;text-decoration:underline;cursor:pointer}'
   +'.sxr{margin:16px 0 4px;padding:16px 18px;border-radius:18px;background:#fff;border:1px dashed #d9b0b6;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:21px;letter-spacing:.1em;color:#39393b;font-weight:600;user-select:all}'
   +'.sxb{margin-top:20px;border:0;border-radius:999px;background:linear-gradient(135deg,#707072,#39393b);color:#fff;font:inherit;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:13px 28px;cursor:pointer;box-shadow:0 12px 18px -12px rgba(57,57,59,.7)}.sxb:disabled{opacity:.6}'
   +'.sxi{margin-top:18px;width:100%;max-width:300px;box-sizing:border-box;border:1px solid #e8ced1;border-radius:14px;padding:13px 14px;font:inherit;font-size:17px;text-align:center;letter-spacing:.12em;background:#fff;color:#39393b;text-transform:uppercase;outline:none}'
   +'.sxt{display:flex;align-items:center;gap:10px;font-family:"Lora",Georgia,serif;font-style:italic;font-size:22px;color:#39393b}.sxt svg{width:22px;height:22px;color:#707072}'
   +'.sxlk,.sxdel{border:0;border-radius:999px;background:#39393b;color:#fff;font:inherit;font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:9px 16px;cursor:pointer}.sxdel{background:rgba(255,255,255,.9);color:#895a64;box-shadow:inset 0 0 0 1px #e8ced1}.sxdel.on{background:#895a64;color:#fff}'
   +'.sxbk{border:0;background:none;color:#525156;font:inherit;font-size:14px;letter-spacing:.06em;cursor:pointer;padding:8px 4px}.sxtt{flex:1;text-align:center;font-family:"Lora",Georgia,serif;font-style:italic;font-size:17px;color:#39393b}'
   +'.sxbody{flex:1;padding-top:6px}.sxn2{text-align:center;max-width:none;margin-bottom:12px}'
   +'.sxnew{display:block;width:100%;border:1.5px dashed #d9b0b6;background:rgba(255,255,255,.55);border-radius:18px;padding:14px;font:inherit;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#707072;cursor:pointer;margin-bottom:12px}'
   +'.sxe{text-align:center;color:#ac727e;font-size:13px;line-height:1.5;margin:26px 10px}'
   +'.sxcard{background:#fff;border:1px solid #e8ced1;border-radius:18px;padding:12px 14px;margin-bottom:10px;box-shadow:0 10px 16px -14px rgba(57,57,59,.5);cursor:pointer}.sxcard b{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#707072;font-weight:600}.sxcard span{display:block;margin-top:4px;font-size:14px;color:#39393b;line-height:1.45}'
   +'.sxset{display:flex;flex-direction:column;align-items:center;gap:4px;margin-top:22px}.sxset button{border:0;background:none;color:#707072;font:inherit;font-size:12px;letter-spacing:.08em;text-decoration:underline;cursor:pointer;padding:6px}'
   +'.sxed{position:relative;flex:0 0 auto}.sxta{display:block;width:100%;box-sizing:border-box;min-height:260px;border:1px solid #e8ced1;border-radius:20px;background:#fff;padding:16px 18px 56px;font:inherit;font-size:16.5px;line-height:1.7;color:#39393b;resize:none;outline:none;overflow:hidden}'
   +'.sxmic{position:absolute;right:12px;bottom:12px;margin:0}';
  document.head.appendChild(st);
})();
/* Aqua : nouvelle activite, a droite du trampoline */
(function(){
  ACTIMG.aq='img-act-aq.webp';
  function ins(arr,item){
    if(arr.some(function(a){return a[0]==='aq'}))return;
    var i=arr.length;for(var k=0;k<arr.length;k++){if(arr[k][0]==='tp'){i=k+1;break}}
    arr.splice(i,0,item);
  }
  var tag='<img class="pkm aci" src="'+ACTIMG.aq+'" alt="">';
  ins(ACT,['aq',tag,'Aqua']);
  ins(WST,['aq',tag,'Aqua']);
  ins(ACTH,['aq','IMG:aq','Aqua']);
  var _ai3=actIcon;
  actIcon=function(a){
    if(a&&a[1]==='IMG:aq')return '<img class="pl2" src="'+ACTIMG.aq+'" alt="Aqua">';
    return _ai3(a);
  };
})();
/* Coupures : saisie et notes dans les statistiques (plus sur la page du jour) */
(function(){
  var CP=null;
  function esc3(t){return String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function pad(n){return ('0'+n).slice(-2)}
  function dkey(y,m,d){return 'agd-'+y+'-'+(m+1)+'-'+d}
  function readDay(y,m,d){try{return JSON.parse(localStorage.getItem(dkey(y,m,d)))||{}}catch(e){return{}}}
  function list(y){
    var out=[];
    try{
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);if(!k||k.indexOf('agd-'+y+'-')!==0)continue;
        var v=localStorage.getItem(k)||'';
        if(v.indexOf('"el":true')<0&&v.indexOf('"wa":true')<0)continue;
        var o=JSON.parse(v),p=k.split('-');
        out.push({m:+p[2]-1,d:+p[3],el:!!o.el,wa:!!o.wa,eln:(o.eln||'').trim(),wan:(o.wan||'').trim()});
      }
    }catch(e){}
    out.sort(function(a,b){return (b.m*40+b.d)-(a.m*40+a.d)});
    return out;
  }
  function rowsHTML(y){
    var L=list(y);
    if(!L.length)return '<p class="sub">Aucune coupure enregistr\u00e9e cette ann\u00e9e.</p>';
    return '<ul class="ogl cpl">'+L.map(function(e){
      var ic=(e.el?'<img src="'+window.OG_EL+'" alt="\u00c9lectricit\u00e9">':'')+(e.wa?'<img src="'+window.OG_WA+'" alt="Eau">':'');
      var nt=[e.eln,e.wan].filter(function(x,i,a){return x&&a.indexOf(x)===i}).join(' \u00b7 ');
      return '<li onclick="cpOpen('+y+','+e.m+','+e.d+')"><span class="cpi">'+ic+'</span><span class="cpt"><b>'+e.d+' '+MONTHS[e.m].slice(0,3)+'</b>'+(nt?' \u00b7 '+esc3(nt):' <i>sans note</i>')+'</span><span class="cpe">\u203a</span></li>';
    }).join('')+'</ul>';
  }
  var _yr5=yrHTML;
  yrHTML=function(){
    var h=_yr5(),y=curYear();if(!(y>0))y=new Date().getFullYear();
    h=h.replace(/<ul class="ogl">[\s\S]*?<\/ul>/,'');
    h=h.replace('<h4 class="mgl">Coupures</h4>','<h4 class="mgl">Coupures</h4><button class="cpadd" onclick="cpOpen('+y+')">+ Ajouter une coupure</button>');
    var i=h.indexOf('<button class="bilb"');
    return i<0?h:h.slice(0,i)+rowsHTML(y)+h.slice(i);
  };
  var MICSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
  function sheet(){
    var c=CP,iso=c.y+'-'+pad(c.m+1)+'-'+pad(c.d);
    function chip(k,label,img,on){return '<button class="cpc'+(on?' on':'')+'" onclick="cpTog(\''+k+'\')"><img src="'+img+'" alt="">'+label+'</button>'}
    function note(id,lab,k,val){return '<div class="cpn"><small>Note \u00b7 '+lab+'</small><textarea id="'+id+'" class="ag" rows="2" placeholder="Heure, dur\u00e9e, ce qui s\u2019est pass\u00e9\u2026" oninput="CPI(\''+k+'\',this.value)">'+esc3(val)+'</textarea><button class="nmic" onclick="nDict(this,\''+id+'\')" aria-label="Dicter">'+MICSVG+'</button></div>'}
    var h='<div class="cpo" onclick="cpClose()"><div class="cps" onclick="event.stopPropagation()">'
      +'<div class="cph"><b>'+(c.edit?'Modifier la coupure':'Ajouter une coupure')+'</b><button onclick="cpClose()" aria-label="Fermer">\u2715</button></div>'
      +'<label class="cpd">Date<input type="date" id="cpdate" value="'+iso+'" min="'+c.y+'-01-01" max="'+c.y+'-12-31" '+(c.edit?'disabled':'')+' onchange="cpDate(this.value)"></label>'
      +'<div class="cpcs">'+chip('el','\u00c9lectricit\u00e9',window.OG_EL,c.el)+chip('wa','Eau',window.OG_WA,c.wa)+'</div>';
    if(c.el)h+=note('cpne','\u00e9lectricit\u00e9','eln',c.eln);
    if(c.wa)h+=note('cpnw','eau','wan',c.wan);
    h+='<div class="cpb"><button class="cpok" onclick="cpSave()">Enregistrer</button>'+(c.edit?'<button class="cprm" onclick="cpRemove()">Retirer</button>':'')+'</div></div></div>';
    var x=document.getElementById('cpx');if(!x){x=document.createElement('div');x.id='cpx';document.body.appendChild(x)}
    x.innerHTML=h;try{growAll()}catch(e){}
  }
  window.CPI=function(k,v){if(CP)CP[k]=v;try{growAll()}catch(e){}};
  window.cpOpen=function(y,m,d){
    var t=new Date(),o;
    if(m==null){
      if(t.getFullYear()===y){m=t.getMonth();d=t.getDate()}else{m=0;d=1}
      CP={y:y,m:m,d:d,el:false,wa:false,eln:'',wan:'',edit:false};
      o=readDay(y,m,d);if(o.el||o.wa){CP.el=!!o.el;CP.wa=!!o.wa;CP.eln=o.eln||'';CP.wan=o.wan||''}
    }else{
      o=readDay(y,m,d);
      CP={y:y,m:m,d:d,el:!!o.el,wa:!!o.wa,eln:o.eln||'',wan:o.wan||'',edit:true};
    }
    sheet();
  };
  window.cpClose=function(){var x=document.getElementById('cpx');if(x)x.remove();CP=null};
  window.cpTog=function(k){if(!CP)return;CP[k]=!CP[k];sheet()};
  window.cpDate=function(v){
    if(!CP||!v)return;var p=v.split('-');
    CP.y=+p[0];CP.m=+p[1]-1;CP.d=+p[2];
    var o=readDay(CP.y,CP.m,CP.d);
    if(o.el||o.wa){CP.el=!!o.el;CP.wa=!!o.wa;CP.eln=o.eln||'';CP.wan=o.wan||''}
    sheet();
  };
  function write(c,clear){
    var o=readDay(c.y,c.m,c.d);
    if(!clear&&c.el){o.el=true;o.eln=c.eln}else{delete o.el;delete o.eln}
    if(!clear&&c.wa){o.wa=true;o.wan=c.wan}else{delete o.wa;delete o.wan}
    try{localStorage.setItem(dkey(c.y,c.m,c.d),JSON.stringify(o))}catch(e){return false}
    return true;
  }
  function after(msg){
    cpClose();
    var t=document.createElement('div');t.className='toastx';t.textContent=msg;document.body.appendChild(t);
    setTimeout(function(){t.classList.add('out')},1500);setTimeout(function(){t.remove()},2000);
    if(OV==='ystat')ovUI();
  }
  window.cpSave=function(){
    if(!CP)return;
    if(!CP.el&&!CP.wa&&!CP.edit){after('Choisis \u00e9lectricit\u00e9 ou eau');return}
    if(write(CP,false))after('Coupure enregistr\u00e9e');
  };
  window.cpRemove=function(){if(!CP)return;if(write(CP,true))after('Coupure retir\u00e9e')};
  var st=document.createElement('style');
  st.textContent='.cpadd{display:block;width:100%;margin:6px 0 4px;border:1.5px dashed #d9b0b6;background:rgba(255,255,255,.6);border-radius:16px;padding:11px;font:inherit;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#895a64;cursor:pointer}'
   +'.cpl li{display:flex;align-items:center;gap:10px;cursor:pointer}.cpi{display:inline-flex;gap:3px;flex:0 0 auto}.cpi img{width:24px;height:24px;object-fit:contain}.cpt{flex:1;min-width:0}.cpt i{color:#c48f97}.cpe{color:#ac727e;font-size:18px}'
   +'.cpo{position:fixed;inset:0;z-index:10020;background:rgba(57,57,59,.4);display:flex;align-items:flex-end;justify-content:center}'
   +'.cps{width:100%;max-width:480px;box-sizing:border-box;max-height:88vh;overflow-y:auto;background:#f9f8f6;border-radius:24px 24px 0 0;padding:16px 18px calc(env(safe-area-inset-bottom,0px) + 22px);box-shadow:0 -18px 40px -16px rgba(0,0,0,.45)}'
   +'.cph{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.cph b{font-family:"Lora",Georgia,serif;font-style:italic;font-weight:500;font-size:20px;color:#39393b}.cph button{border:0;background:rgba(255,255,255,.9);width:34px;height:34px;border-radius:50%;color:#525156;font-size:16px;cursor:pointer;box-shadow:0 5px 10px -6px rgba(57,57,59,.5)}'
   +'.cpd{display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#ac727e}.cpd input{display:block;width:100%;box-sizing:border-box;margin-top:4px;border:1px solid #f3e7e7;border-radius:14px;background:#fff;padding:10px 12px;font:inherit;font-size:15px;color:#39393b}'
   +'.cpcs{display:flex;gap:8px;margin:12px 0 4px}.cpc{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;border:1.5px solid #f3e7e7;background:#fff;border-radius:16px;padding:9px 6px;font:inherit;font-size:12px;letter-spacing:.06em;color:#895a64;cursor:pointer;opacity:.75;filter:grayscale(.3)}.cpc img{width:28px;height:28px;object-fit:contain}.cpc.on{opacity:1;filter:none;border-color:#d9b0b6;background:linear-gradient(135deg,#ffffff,#f3e7e7);color:#525156;box-shadow:0 0 0 3px rgba(217,176,182,.2)}'
   +'.cpn{position:relative;margin-top:10px}.cpn small{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#ac727e;margin-bottom:3px}.cpn textarea{display:block;width:100%;box-sizing:border-box;border:1px solid #f3e7e7;border-radius:14px;background:#fff;padding:10px 44px 10px 12px;font:inherit;font-size:15px;line-height:1.5;color:#39393b;resize:none;overflow:hidden;outline:none}.cpn .nmic{position:absolute;right:6px;bottom:6px;width:32px;height:32px;margin:0}'
   +'.cpb{display:flex;gap:10px;margin-top:16px;align-items:center}.cpok{flex:1;border:0;border-radius:999px;background:linear-gradient(135deg,#ac727e,#895a64);color:#fff;font:inherit;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:12px;cursor:pointer}.cprm{border:0;background:none;color:#895a64;font:inherit;font-size:12px;letter-spacing:.08em;text-decoration:underline;cursor:pointer;padding:10px}';
  document.head.appendChild(st);
})();

/* ===== v35 : humeurs Pensive et Nostalgique, nouvelles icones, accueil blanc gris, barre d'outils du bouton + ===== */
(function(){
  /* ---------- 1. Humeurs : visages de la planche (images), Excitee ajoutee a la fin ---------- */
  var MI={'Rayonnante':'ra','Heureuse':'he','Calme':'ca','Fatigu\u00e9e':'fa','Anxieuse':'an','Spirituelle':'sp','Motiv\u00e9e':'mo','Nostalgique':'no','Pensive':'pe','Excit\u00e9e':'ex','Triste':'tr','Impatiente':'im','Reconnaissante':'re'};
  function mFace(f,href){return '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><image href="'+(href||'img-mood-'+f+'.webp')+'" width="40" height="40"/></svg>'}
  ['Pensive','Nostalgique','Excit\u00e9e'].forEach(function(n){
    if(!MOOD5.some(function(m){return m.n===n}))MOOD5.push({n:n,s:''});
  });
  MOOD5.forEach(function(m){if(MI[m.n]){m.f=MI[m.n];m.s=mFace(MI[m.n])}});
  /* le bilan en image a besoin du visage integre (data:) : on le prepare juste avant */
  var _bil=window.bilanShare;
  if(_bil){
    window.bilanShare=function(){
      var self=this,args=arguments;
      Promise.all(MOOD5.map(function(m){return new Promise(function(res){
        if(!m.f){res(null);return}
        var im=new Image();
        im.onload=function(){try{var c=document.createElement('canvas');c.width=c.height=120;c.getContext('2d').drawImage(im,0,0,120,120);res(c.toDataURL('image/png'))}catch(e){res(null)}};
        im.onerror=function(){res(null)};
        im.src='img-mood-'+m.f+'.webp';
      })})).then(function(urls){
        var sv=MOOD5.map(function(m){return m.s});
        MOOD5.forEach(function(m,i){if(urls[i])m.s=mFace(m.f,urls[i])});
        try{_bil.apply(self,args)}finally{MOOD5.forEach(function(m,i){m.s=sv[i]})}
      });
    };
  }

  /* ---------- 2. Activites : 9 icones, Etirement avant Espagnol, plus de 30 min ---------- */
  [ACT,WST,ACTH].forEach(function(arr){for(var i=arr.length-1;i>=0;i--){if(arr[i][0]==='tm')arr.splice(i,1)}});
  ACTIMG.et='img-act-et.webp';
  function insBeforeSx(arr,item){
    if(arr.some(function(a){return a[0]==='et'}))return;
    var i=arr.length;for(var k=0;k<arr.length;k++){if(arr[k][0]==='sx'){i=k;break}}
    arr.splice(i,0,item);
  }
  var etTag='<img class="pkm aci" src="'+ACTIMG.et+'" alt="">';
  insBeforeSx(ACT,['et',etTag,'\u00c9tirement']);
  insBeforeSx(WST,['et',etTag,'\u00c9tirement']);
  insBeforeSx(ACTH,['et','IMG:et','\u00c9tirement']);
  var _aiE=actIcon;
  actIcon=function(a){
    if(a&&a[1]==='IMG:et')return '<img class="pl2" src="'+ACTIMG.et+'" alt="\u00c9tirement">';
    return _aiE(a);
  };

  /* ---------- 3. Plage : meme image sur la page du jour ---------- */
  WVSCENE='<img src="img-plage.webp" alt="">';
  WVBLUE=WVSCENE;

  /* ---------- 4. Accueil : meteo, puis Plage et Singes dessous ---------- */
  wxHero=function(t){
    var y=t.getFullYear(),m=t.getMonth(),d=t.getDate(),a=wxGet(y,m,d),b=isBeach(y,m,d),nm=bcName(y,m,d),mk=mkOn(y,m,d);
    var LB=['Matin','Apr\u00e8m','Soir','Nuit'];
    var r1=a.map(function(v,i){
      return '<button class="hxi" aria-label="Le temps : '+WXS[i]+'" onclick="wxOpen('+y+','+m+','+d+','+i+')"><span class="hxc'+(v<0?' e':'')+'">'+(v>=0?'<img src="'+WXI[v]+'" alt="'+WXL[v]+'">':'')+'</span><small>'+LB[i]+'</small></button>';
    }).join('');
    var r2='<button class="hxi hxo'+(b?' on':'')+'" aria-label="Jour de plage" aria-pressed="'+(b?'true':'false')+'" onclick="bcOpen('+y+','+m+','+d+')"><span class="hxc"><img src="img-plage.webp" alt=""></span><small>'+(b&&nm?esc(bcShort(nm)):'Plage')+'</small></button>'
      +'<button class="hxi hxo'+(mk?' on':'')+'" aria-label="On a vu les singes" aria-pressed="'+(mk?'true':'false')+'" onclick="mkTog('+y+','+m+','+d+')"><span class="hxc"><img src="img-singe.webp" alt=""></span><small>Singes</small></button>';
    return '<div class="hxw hxn"><div class="hxr hx4">'+r1+'</div><div class="hxr hx2">'+r2+'</div></div>';
  };

  /* ---------- 5. Bouton + : barre verticale d'icones ---------- */
  var TB=[['Notes','notes',"ovOpen('note')"],['\u00c9picerie','panier',"goHomeShop()"],['Calculatrice','calc',"ovOpen('calc')"],['Devises','devises',"ovOpen('fx')"],['Bitcoin','bitcoin',"ovOpen('btc')"],['Mar\u00e9es','marees',"ovOpen('tide')"],['Pleines lunes','lune',"ovOpen('moon')"],['Minuteur','sablier',"tmOpen()"],['Statistiques','stats',"ovOpen('ystat')"],['Recherche','loupe',"ovOpen('search')"]];
  var plusFor2=-1;
  togPlus=function(){plusOpen=!plusOpen;plusFor2=cur;render()};
  function pbar(){
    if(!(plusOpen&&plusFor2===cur))return '';
    return '<div class="pbk" onclick="plusOpen=false;render()"></div><div class="pbar">'+TB.map(function(x){
      return '<button class="pbi" aria-label="'+x[0]+'" onclick="plusOpen=false;render();'+x[2]+'"><img src="img-tb-'+x[1]+'.webp" alt=""></button>';
    }).join('')+'</div>';
  }
  cartBtn=function(){return '<button class="pbtn" aria-label="Plus" onclick="togPlus()">'+PLUSSVG+'</button>'+pbar()};
  var _hpN=homePage;
  homePage=function(){
    var h=_hpN();
    h=h.replace(/<div class="pbk"[^>]*><\/div><div class="pmenu p4">[\s\S]*?<\/div>/,'');
    h=h.replace('<div class="hwrap">','<div class="hwrap">'+pbar());
    return h;
  };

  /* ---------- 6. Styles ---------- */
  var st=document.createElement('style');
  st.textContent=':root{--acs:min(15.6vw,84px);--hxs:min(15vw,78px)}'
   /* activites */
   +'.actc{width:var(--acs);height:var(--acs);font-size:0}'
   +'.actb{width:calc(var(--acs) + 4px);gap:5px}'
   +'.actb em{font-size:8.5px;letter-spacing:.03em;white-space:nowrap}'
   +'.actr{gap:0;margin:10px 0}'
   /* meteo + plage + singes dans la carte */
   +'.hxn{margin-top:14px;padding-top:16px;border-top:1px solid rgba(57,57,59,.22)}'
   +'.hxn .hxr{display:flex;justify-content:center;align-items:flex-start;gap:calc(var(--hxs)*.2)}'
   +'.hxn .hx2{margin-top:16px}'
   +'.hxi{border:0;background:none;padding:0;display:flex;flex-direction:column;align-items:center;gap:7px;font:inherit;color:#525156;cursor:pointer;-webkit-tap-highlight-color:transparent}'
   +'.hxc{display:block;width:var(--hxs);height:var(--hxs);border-radius:50%;filter:drop-shadow(0 6px 7px rgba(57,57,59,.32))}'
   +'.hxc img{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover}'
   +'.hxc.e{box-sizing:border-box;border:1.6px dashed rgba(57,57,59,.3);background:rgba(255,255,255,.45);filter:none}'
   +'.hxi small{font-size:9px;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}'
   +'.hxo .hxc{opacity:.5;filter:grayscale(.5) drop-shadow(0 4px 5px rgba(57,57,59,.18))}'
   +'.hxo.on .hxc{opacity:1;filter:drop-shadow(0 6px 7px rgba(57,57,59,.32))}'
   +'.hxo.on small{color:#39393b;font-weight:600}'
   /* plage sur la page du jour */
   +'.d3c img,.ds-bw img{display:block;width:100%;height:100%;object-fit:cover}'
   +'.d3c.off img,.ds-bw.off img{filter:saturate(.25);opacity:.55}'
   /* barre verticale du bouton + */
   +'.pbk{background:rgba(57,57,59,.3)}'
   +'.pbar{position:absolute;top:64px;right:8px;z-index:8;display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 14px;border-radius:44px;background:#faf9f7;border:1px solid #c9b196;box-shadow:0 22px 34px -12px rgba(30,30,32,.55);max-height:calc(100vh - 110px);overflow-y:auto;--bi:min(14.5vw,calc((100vh - 250px)/10.7),72px)}'
   +'.hwrap .pbar{top:90px}'
   +'.pbi{flex:0 0 auto;width:var(--bi);height:var(--bi);border:0;padding:0;background:none;border-radius:50%;cursor:pointer;-webkit-tap-highlight-color:transparent}'
   +'.pbi img{display:block;width:100%;height:100%;border-radius:50%;box-shadow:0 5px 8px -4px rgba(57,57,59,.5)}'
   +'.pbi:active{transform:scale(.94)}'
   /* v38 : carte plus compacte, activites sous la carte, lettres en degrade charcoal */
   +'.hero.hcal{padding:26px 20px 16px;margin:12px 6px 14px}'
   +'.hero.hcal .hxn{margin-top:10px;padding-top:12px}.hero.hcal .hxn .hx2{margin-top:10px}.hxi{gap:5px}'
   +'.hero.hcal .hg,.hero.hcal .hd2,.hero.hcal .hm2{background:linear-gradient(90deg,#2f2f31 0%,#525156 55%,#8a898b 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;text-shadow:none}'
   +'.hero.hcal .hg{font-weight:600;letter-spacing:.34em}'
   +'.hero.hcal .hd2{font-weight:700;letter-spacing:.26em}'
   +'.hero.hcal .hm2{font-weight:600;letter-spacing:.3em}'
   +'.hero.hcal .hn{background:linear-gradient(172deg,#2a2a2c 0%,#525156 52%,#908f91 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;text-shadow:none;filter:drop-shadow(0 2px 1px rgba(255,255,255,.75)) drop-shadow(0 7px 8px rgba(57,57,59,.22))}';
  document.head.appendChild(st);
})();

render();
