/* Page du jour : icones sur la ligne "Ma journee" + visionneuse de photos */
(function(){
  var _dpz=dayPage;
  dayPage=function(){
    var h=_dpz();
    var m1=h.match(/<button class="dhb[^"]*"[\s\S]*?<\/button>/),m2=h.match(/<button class="dcr"[\s\S]*?<\/button>/);
    var tag='Ma journée</p>';
    if(!m1||!m2||h.indexOf(tag)<0)return h;
    h=h.replace(m2[0],'');
    return h.replace(tag,'Ma journée<span class="dtr">'+m2[0]+'</span></p>');
  };
  /* visionneuse : photo seule, glisser pour voir les autres */
  function lbClose(){
    var o=document.getElementById('lbx');
    if(o)o.remove();
    document.body.style.overflow='';
  }
  function lbOpen(i){
    var ph=(window.dday&&dday.p)||[];
    if(!ph.length)return;
    lbClose();
    var o=document.createElement('div');o.id='lbx';o.className='lbx';
    var sc=document.createElement('div');sc.className='lbs';
    ph.forEach(function(src){
      var p=document.createElement('div');p.className='lbp';
      var im=document.createElement('img');im.src=src;im.alt='';im.draggable=false;
      p.appendChild(im);sc.appendChild(p);
    });
    var x=document.createElement('button');x.className='lbc';x.setAttribute('aria-label','Fermer');x.textContent='\u2715';
    x.onclick=function(e){e.stopPropagation();lbClose()};
    o.appendChild(sc);o.appendChild(x);
    var dots=null;
    if(ph.length>1){
      dots=document.createElement('div');dots.className='lbd';
      ph.forEach(function(_,k){var d=document.createElement('span');if(k===i)d.className='on';dots.appendChild(d)});
      o.appendChild(dots);
      sc.addEventListener('scroll',function(){
        var k=Math.round(sc.scrollLeft/Math.max(1,sc.clientWidth));
        Array.prototype.forEach.call(dots.children,function(d,n){d.className=n===k?'on':''});
      },{passive:true});
    }
    /* ne pas declencher le changement de jour de l'application */
    ['touchstart','touchend','touchmove'].forEach(function(ev){o.addEventListener(ev,function(e){e.stopPropagation()},{passive:true})});
    o.addEventListener('click',function(e){if(e.target.tagName!=='IMG')lbClose()});
    document.body.appendChild(o);
    document.body.style.overflow='hidden';
    sc.scrollLeft=i*sc.clientWidth;
    requestAnimationFrame(function(){sc.scrollLeft=i*sc.clientWidth});
  }
  window.lbOpen=lbOpen;window.lbClose=lbClose;
  document.addEventListener('click',function(e){
    var im=e.target&&e.target.closest?e.target.closest('.dcp img'):null;
    if(!im)return;
    var p=im.parentNode;
    lbOpen(Array.prototype.indexOf.call(p.parentNode.children,p));
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')lbClose()});
  var st=document.createElement('style');
  st.textContent='.dfull .dtl .dtr{margin-left:auto;display:flex;align-items:center;gap:10px}'
   +'.dfull .dtr .dhb,.dfull .dtr .dcr{position:static;top:auto;right:auto;width:34px;height:34px;flex:0 0 auto}'
   +'.dfull .dtr .dhb{box-shadow:0 5px 10px -6px rgba(137,90,100,.6),0 0 0 1px rgba(217,176,182,.5)}'
   +'.dfull .dtr .dhb svg{width:20px;height:18px}'
   +'.dcp img{cursor:zoom-in}'
   +'.lbx{position:fixed;inset:0;z-index:9999;background:#f9f8f6;display:flex;flex-direction:column;touch-action:pan-x}'
   +'.lbs{flex:1;min-height:0;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;overscroll-behavior:contain}.lbs::-webkit-scrollbar{display:none}'
   +'.lbp{flex:0 0 100%;scroll-snap-align:center;scroll-snap-stop:always;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:calc(env(safe-area-inset-top,0px) + 60px) 14px calc(env(safe-area-inset-bottom,0px) + 44px)}'
   +'.lbp img{max-width:100%;max-height:calc(100vh - 130px);max-height:calc(100dvh - 130px);object-fit:contain;border-radius:14px;box-shadow:0 18px 30px -18px rgba(57,57,59,.6);-webkit-user-select:none;user-select:none}'
   +'.lbc{position:absolute;top:calc(env(safe-area-inset-top,0px) + 12px);right:14px;z-index:2;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.92);color:#525156;font-size:18px;line-height:1;cursor:pointer;box-shadow:0 6px 12px -6px rgba(57,57,59,.5)}'
   +'.lbd{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 16px);display:flex;justify-content:center;gap:7px;pointer-events:none}'
   +'.lbd span{width:7px;height:7px;border-radius:50%;background:#e8ced1}.lbd span.on{background:#ac727e}';
  document.head.appendChild(st);
})();
/* Accueil : icone chronometre 30 min a cote de Pura Vida + meditation agrandie */
(function(){
  ACTIMG.tm='img-act-tm.webp';
  function ins(arr,item){
    if(arr.some(function(a){return a[0]==='tm'}))return;
    var i=arr.length;for(var k=0;k<arr.length;k++){if(arr[k][0]==='sx'){i=k+1;break}}
    arr.splice(i,0,item);
  }
  var tag='<img class="pkm aci" src="'+ACTIMG.tm+'" alt="">';
  ins(ACT,['tm',tag,'30 min']);
  ins(WST,['tm',tag,'30 min']);
  ins(ACTH,['tm','IMG:tm','30 min']);
  var _ai2=actIcon;
  actIcon=function(a){
    if(a&&a[1]==='IMG:tm')return '<img class="pl2" src="'+ACTIMG.tm+'" alt="30 min">';
    if(a&&a[1]==='IMG:mx')return '<img class="pl2 mxb" src="'+ACTIMG.mx+'" alt="'+a[2]+'">';
    return _ai2(a);
  };
  var st=document.createElement('style');
  st.textContent='.actc img.mxb{width:84%;height:84%}.ics .ic span img.mxb{width:84%;height:84%}';
  document.head.appendChild(st);
})();
/* Page du jour : humeur devant les cristaux, singes sous la plage (meme taille) */
(function(){
  var _dpy=dayPage;
  dayPage=function(){
    var h=_dpy();
    var mm=h.match(/<div onclick="mdOpen\(\)">([\s\S]*?)<\/div>/);
    var mk=h.match(/<div class="d3m"[\s\S]*?<\/div>/);
    if(!mm||!mk||h.indexOf('<span class="dtr">')<0)return h;
    var sp=mm[1].match(/<span class="d3c[^"]*">[\s\S]*?<\/span>/);
    if(!sp)return h;
    h=h.replace(mm[0],'').replace(mk[0],'');
    h=h.replace(/(<div class="d3r">[\s\S]*?<\/div>)(<\/div>)/,function(m,a,b){return a+mk[0]+b});
    var mb='<button class="dmd" aria-label="Humeur" onclick="mdOpen()">'+sp[0]+'</button>';
    return h.replace('<span class="dtr">','<span class="dtr">'+mb);
  };
  var st=document.createElement('style');
  st.textContent='.dfull .dtr .dmd{border:0;padding:0;background:none;width:34px;height:34px;flex:0 0 auto;cursor:pointer}'
   +'.dfull .dtr .dmd .d3c{width:34px;height:34px}'
   +'.mcard .d3r .d3c{width:32px;height:32px}'
   +'.mcard .d3r .d3m{position:static;bottom:auto;right:auto;gap:4px}'
   +'.d3o .dsm-r,.d3o .ds-none{padding-right:0}';
  document.head.appendChild(st);
})();
/* Humeur (visage pale + nom, "Reconnaissante"), nouveau repas en haut, intentions comme "Ma journee" */
(function(){
  /* 1. nouvelle humeur : Reconnaissante (ajoutee a la fin pour garder les humeurs deja choisies) */
  if(!MOOD5.some(function(m){return m.n==='Reconnaissante'})){
    MOOD5.push({n:'Reconnaissante',s:'<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="mfg" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#f9f8f6"/><stop offset="1" stop-color="#f3e7e7"/></radialGradient></defs><circle cx="20" cy="21" r="16.5" fill="url(#mfg)" stroke="#39393b" stroke-width="1.5"/><ellipse cx="12" cy="11.500" rx="4" ry="2" fill="#fff" opacity=".7" transform="rotate(-25 12 11.500)"/><path d="M11.500 20.500c1.600-2.200 4.400-2.200 6 0M22.500 20.500c1.600-2.200 4.400-2.200 6 0" stroke="#39393b" stroke-width="1.700" fill="none" stroke-linecap="round"/><path d="M15.500 26c1.200 3.400 7.800 3.400 9 0z" fill="#c48f97" stroke="#39393b" stroke-width="1.300" stroke-linejoin="round"/><ellipse cx="9.500" cy="25.500" rx="3" ry="1.900" fill="#d9b0b6" opacity=".75"/><ellipse cx="30.500" cy="25.500" rx="3" ry="1.900" fill="#d9b0b6" opacity=".75"/><path d="M31 12.200c-3-2.200-4.400-3.800-4.400-5.400 0-1.200.9-2 2-2 .9 0 1.700.5 2.400 1.400.7-.9 1.500-1.400 2.400-1.400 1.100 0 2 .8 2 2 0 1.600-1.400 3.200-4.400 5.400z" fill="#c48f97" stroke="#c48f97" stroke-width=".7" stroke-linejoin="round"/></svg>'});
  }
  /* 2. humeur sur la ligne "Ma journee" : visage pale avant le choix, nom dessous */
  var _dpm2=dayPage;
  dayPage=function(){
    var h=_dpm2();
    if(h.indexOf('class="dmd"')<0)return h;
    var mo=(window.dday&&typeof dday.mo==='number')?dday.mo:-1;
    var ok=mo>=0&&MOOD5[mo];
    return h.replace(/<button class="dmd"[^>]*>[\s\S]*?<\/button>/,function(){
      return '<button class="dmd" aria-label="Humeur" onclick="mdOpen()"><span class="d3c'+(ok?'':' off')+'">'+(ok?MOOD5[mo].s:MOOD5[1].s)+'</span><small>'+(ok?MOOD5[mo].n:'Humeur')+'</small></button>';
    });
  };
  /* 3. repas : champ "Nouveau repas" en haut de la liste, et les nouveaux repas au debut */
  var _mlp=mealPage;
  mealPage=function(){
    var h=_mlp();
    return h.replace(/(<div class="ddm"><div class="ih">[\s\S]*?<\/div>)([\s\S]*?)(<div class="ad"><input id="mi2"[^>]*><button onclick="mad\(\)">\+<\/button><\/div>)(<\/div>)/,function(m,a,b,c,d){return a+c+b+d});
  };
  mad=function(){
    var t=document.getElementById('mi2');
    if(!t||!t.value.trim())return;
    var a=gi();a.unshift(t.value.trim());gs(a);render();
  };
  /* 4. Vision board : "Mes intentions" comme "Ma journee" (meme police, sans lignes, tout le texte visible) */
  var _vbp=visionPage;
  visionPage=function(){return _vbp().replace('<textarea class="vbtx"','<textarea class="vbtx ag"')};
  document.addEventListener('input',function(e){var t=e.target;if(t&&t.classList&&t.classList.contains('vbtx')){try{growAll()}catch(x){}}});
  var st=document.createElement('style');
  st.textContent='.dfull .dtl{margin:2px 2px 24px}'
   +'.dfull .dtr .dmd{position:relative}'
   +'.dfull .dtr .dmd .d3c{border:0;background:transparent;box-shadow:none;padding:0;overflow:visible}'
   +'.dfull .dtr .dmd small{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:4px;white-space:nowrap;font-family:"Nunito",sans-serif;font-style:normal;font-size:8.5px;letter-spacing:.08em;text-transform:uppercase;color:#707072}'
   +'.vbtx{font:inherit;font-size:16.5px;line-height:1.7;color:#39393b!important;-webkit-text-fill-color:#39393b;caret-color:#ac727e;background:#fff!important;border:1px solid #f3e7e7;border-radius:22px;padding:16px 18px 18px;min-height:120px;box-shadow:none;resize:none;overflow:hidden;box-sizing:border-box}';
  document.head.appendChild(st);
})();
/* Coupures d'electricite / d'eau (page du jour + statistiques) et partage des notes */
(function(){
  var IMG_EL='img-el.webp',IMG_WA='img-wa.webp';
  window.OG_EL=IMG_EL;window.OG_WA=IMG_WA;
  function ogHTML(){
    var d=window.dday||{};
    function row(k,label,img){
      var on=!!d[k];
      return '<div class="ogc'+(on?' on':'')+'"><button class="ogb" onclick="ogTog(\''+k+'\')" aria-pressed="'+(on?'true':'false')+'" aria-label="'+label+'"><img src="'+img+'" alt=""></button>'
        +'<div class="ogm"><b>'+label+'</b>'
        +(on?'<textarea class="ag" rows="1" placeholder="Ajouter une note\u2026" oninput="ogNote(\''+k+'\',this.value);growAll()">'+esc(d[k+'n']||'')+'</textarea>':'<small>Touche pour activer</small>')
        +'</div></div>';
    }
    return '<section class="og"><p class="ogh">\u00c9lectricit\u00e9 &amp; eau</p>'+row('el','Manque d\u2019\u00e9lectricit\u00e9',IMG_EL)+row('wa','Manque d\u2019eau',IMG_WA)+'</section>';
  }
  window.ogTog=function(k){if(!window.dday)return;dday[k]=!dday[k];dsave();render()};
  window.ogNote=function(k,v){if(!window.dday)return;dday[k+'n']=v;dsave()};
  var _dpg=dayPage;
  dayPage=function(){return _dpg()};

  /* statistiques de l'annee */
  var _yr3=yrHTML;
  yrHTML=function(){
    var h=_yr3(),y=curYear();if(!(y>0))y=new Date().getFullYear();
    var el=[0,0,0,0,0,0,0,0,0,0,0,0],wa=[0,0,0,0,0,0,0,0,0,0,0,0],ne=0,nw=0,notes=[];
    try{
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if(!k||k.indexOf('agd-'+y+'-')!==0)continue;
        var v=localStorage.getItem(k)||'';
        if(v.indexOf('"el":true')<0&&v.indexOf('"wa":true')<0)continue;
        var o=JSON.parse(v),p=k.split('-'),m=+p[2]-1,dd=+p[3];
        if(o.el){el[m]++;ne++;if(o.eln&&o.eln.trim())notes.push({m:m,d:dd,k:'\u00c9lectricit\u00e9',t:o.eln.trim()})}
        if(o.wa){wa[m]++;nw++;if(o.wan&&o.wan.trim())notes.push({m:m,d:dd,k:'Eau',t:o.wan.trim()})}
      }
    }catch(e){}
    notes.sort(function(a,b){return (b.m*40+b.d)-(a.m*40+a.d)});
    function bars(arr,cls){var mx=Math.max.apply(null,arr.concat([1]));return '<div class="ysp ogst '+cls+'">'+arr.map(function(c,i){return '<div class="ysb"><i style="height:'+Math.round(c*100/mx)+'%"></i><span>'+MONTHS[i].slice(0,1)+'</span></div>'}).join('')+'</div>'}
    function head(img,label,n){return '<div class="ogsr"><img src="'+img+'" alt=""><div><b>'+label+'</b><span>'+n+' jour'+(n>1?'s':'')+'</span></div></div>'}
    var blk='<h4 class="mgl">Coupures</h4>'+head(IMG_EL,'\u00c9lectricit\u00e9',ne)+bars(el,'ogel')+head(IMG_WA,'Eau',nw)+bars(wa,'ogwa');
    if(notes.length){
      blk+='<ul class="ogl">'+notes.slice(0,10).map(function(n){return '<li><b>'+n.d+' '+MONTHS[n.m].slice(0,3)+'</b> \u00b7 '+n.k+' \u2014 '+esc(n.t)+'</li>'}).join('')+'</ul>';
    }
    var a='<h4 class="mgl">Activit\u00e9s</h4>',i=h.indexOf(a);
    return i<0?h:h.slice(0,i)+blk+h.slice(i);
  };

  /* partage des notes */
  var SH='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.300 10.700l7.400-4.200M8.300 13.300l7.400 4.200"/></svg>';
  function toast(msg){
    var t=document.createElement('div');t.className='toastx';t.textContent=msg;document.body.appendChild(t);
    setTimeout(function(){t.classList.add('out')},1600);setTimeout(function(){t.remove()},2100);
  }
  function copyBox(t){
    var o=document.createElement('div');o.className='sbx';
    o.innerHTML='<div class="sbc"><p>Touche le texte, puis copie-le</p><textarea readonly></textarea><button>Fermer</button></div>';
    var ta=o.querySelector('textarea');ta.value=t;
    o.querySelector('button').onclick=function(){o.remove()};
    o.addEventListener('click',function(e){if(e.target===o)o.remove()});
    document.body.appendChild(o);try{ta.focus();ta.select()}catch(e){}
  }
  function copyText(t){
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){toast('Note copi\u00e9e \u2713')},function(){legacyCopy(t)});
    }else legacyCopy(t);
  }
  function legacyCopy(t){
    try{
      var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(ta);ta.select();var ok=document.execCommand('copy');ta.remove();
      if(ok){toast('Note copi\u00e9e \u2713');return}
    }catch(e){}
    copyBox(t);
  }
  window.shareNote=function(kind,i){
    var t=kind==='imp'?(window.NT&&NT[i]):(window.QN&&QN[i]&&QN[i].t);
    t=String(t||'').trim();if(!t)return;
    if(navigator.share){
      navigator.share({text:t}).catch(function(e){if(e&&e.name==='AbortError')return;copyText(t)});
    }else copyText(t);
  };
  var _nh=notesHTML;
  notesHTML=function(){
    var h=_nh();
    h=h.replace(/<button class="rm" onclick="noteDel\((\d+)\)">/g,function(m,i){return '<button class="nsh" aria-label="Partager" onclick="shareNote(\'imp\','+i+')">'+SH+'</button>'+m});
    h=h.replace(/<button class="qk"([^>]*)onclick="qnKeep\((\d+)\)">/g,function(m,a,i){return '<button class="qs" aria-label="Partager" onclick="shareNote(\'q\','+i+')">'+SH+'</button>'+m});
    return h;
  };

  var st=document.createElement('style');
  st.textContent='.og{margin:26px 4px 34px}.ogh{font-family:"Lora",Georgia,serif;font-style:italic;font-size:21px;color:#39393b;margin:0 2px 12px}'
   +'.ogc{display:flex;align-items:center;gap:14px;padding:14px 16px;margin:0 0 12px;border-radius:22px;background:linear-gradient(135deg,#ffffff,#f9f8f6);border:1px solid #f3e7e7;box-shadow:0 12px 20px -16px rgba(82,81,86,.45);transition:all .2s}'
   +'.ogc.on{border-color:#d9b0b6;background:linear-gradient(135deg,#ffffff,#f3e7e7);box-shadow:0 0 0 3px rgba(217,176,182,.22),0 14px 22px -14px rgba(137,90,100,.55)}'
   +'.ogb{flex:0 0 62px;width:62px;height:62px;border-radius:50%;border:2px solid #fff;background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7);padding:9px;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 14px -8px rgba(82,81,86,.55);opacity:.72;filter:grayscale(.3);transition:all .2s}'
   +'.ogc.on .ogb{opacity:1;filter:none}.ogb img{width:100%;height:100%;object-fit:contain;display:block}'
   +'.ogm{flex:1;min-width:0}.ogm b{display:block;font-weight:600;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:#525156}.ogm small{display:block;margin-top:3px;font-size:11.5px;color:#ac727e;letter-spacing:.03em}'
   +'.ogm textarea{display:block;width:100%;box-sizing:border-box;margin-top:8px;padding:10px 12px;border:1px solid #f3e7e7;border-radius:14px;background:rgba(255,255,255,.8);font:inherit;font-size:15px;line-height:1.55;color:#39393b;resize:none;overflow:hidden;outline:none}.ogm textarea:focus{border-color:#d9b0b6}'
   +'.ogsr{display:flex;align-items:center;gap:10px;margin:10px 0 2px}.ogsr img{width:34px;height:34px;object-fit:contain}.ogsr b{display:block;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#525156}.ogsr span{font-size:12px;color:#ac727e}'
   +'.ogel .ysb i{background:linear-gradient(180deg,#d9b0b6,#ac727e)}.ogwa .ysb i{background:linear-gradient(180deg,#b5b3b4,#929093)}'
   +'.ogl{list-style:none;margin:10px 0 0;padding:0}.ogl li{font-size:12.5px;line-height:1.5;color:#525156;padding:7px 0;border-bottom:1px solid #f3e7e7}.ogl li b{color:#895a64;font-weight:600}'
   +'.nn .nsh{position:absolute;top:7px;right:40px;width:26px;height:26px;border-radius:50%;border:0;background:rgba(255,255,255,.55);color:rgba(57,57,59,.7);padding:0;cursor:pointer;z-index:3;display:flex;align-items:center;justify-content:center}.nn .nsh:active{background:rgba(255,255,255,.9)}'
   +'.qn .qs{flex:0 0 auto;border:0;background:none;cursor:pointer;color:#929093;padding:3px 4px;line-height:1;display:flex;align-items:center}'
   +'.toastx{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 28px);transform:translateX(-50%);z-index:10001;background:#39393b;color:#fff;font-size:13px;letter-spacing:.04em;padding:10px 18px;border-radius:999px;box-shadow:0 10px 20px -8px rgba(0,0,0,.4);transition:opacity .4s}.toastx.out{opacity:0}'
   +'.sbx{position:fixed;inset:0;z-index:10000;background:rgba(57,57,59,.4);display:flex;align-items:center;justify-content:center;padding:20px}.sbc{width:100%;max-width:360px;background:#f9f8f6;border-radius:22px;padding:18px;box-shadow:0 24px 40px -16px rgba(0,0,0,.5)}.sbc p{margin:0 0 10px;font-size:13px;color:#525156}.sbc textarea{width:100%;min-height:120px;box-sizing:border-box;border:1px solid #f3e7e7;border-radius:14px;padding:10px 12px;font:inherit;font-size:15px;color:#39393b;background:#fff}.sbc button{display:block;margin:12px auto 0;border:0;border-radius:999px;background:#39393b;color:#fff;padding:9px 22px;font:inherit;font-size:12px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}';
  document.head.appendChild(st);
})();
/* Electricite & eau : version plus compacte */
(function(){
  var st=document.createElement('style');
  st.textContent='.og{margin:18px 4px 26px}.ogh{font-size:17px;margin:0 2px 8px}.ogc{gap:10px;padding:8px 12px;margin:0 0 8px;border-radius:18px}.ogb{flex:0 0 42px;width:42px;height:42px;padding:6px;border-width:1.5px}.ogm b{font-size:10.5px;letter-spacing:.1em}.ogm small{font-size:10.5px;margin-top:1px}.ogm textarea{margin-top:5px;padding:6px 10px;font-size:13.5px;line-height:1.45;border-radius:12px}';
  document.head.appendChild(st);
})();
/* Partage des notes : feuille de partage quand le partage systeme n'est pas disponible */
(function(){
  function toast(msg){
    var t=document.createElement('div');t.className='toastx';t.textContent=msg;document.body.appendChild(t);
    setTimeout(function(){t.classList.add('out')},1600);setTimeout(function(){t.remove()},2100);
  }
  function legacyCopy(t){
    try{
      var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(ta);ta.select();var ok=document.execCommand('copy');ta.remove();
      if(ok){toast('Note copi\u00e9e \u2713');return true}
    }catch(e){}
    return false;
  }
  function copyText(t,done){
    var fin=function(ok){if(ok)toast('Note copi\u00e9e \u2713');else toast('Copie impossible ici');if(done)done()};
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){fin(true)},function(){fin(legacyCopy(t))});
    }else fin(legacyCopy(t));
  }
  var IC={
    wa:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.200-4.100A8 8 0 1 1 8.200 18.900z"/><path d="M9.300 8.800c.2 2.600 2.300 4.800 5 5.600l1.100-1.300-1.800-.9-.8.6c-.9-.4-1.700-1.200-2.100-2.100l.6-.8-.9-1.800z"/></svg>',
    sms:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.500h8M8 12.500h5"/></svg>',
    mail:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.500" y="5.500" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/></svg>',
    copy:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8.500" y="8.500" width="11" height="11" rx="2"/><path d="M15.500 8.500v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg>'
  };
  function sheet(t){
    var o=document.createElement('div');o.className='shs';
    var q=encodeURIComponent(t);
    o.innerHTML='<div class="shc"><p class="sht">Partager cette note</p><div class="shp"></div>'
      +'<div class="shg">'
      +'<a href="https://wa.me/?text='+q+'" target="_blank" rel="noopener"><span class="shi">'+IC.wa+'</span>WhatsApp</a>'
      +'<a href="sms:?body='+q+'"><span class="shi">'+IC.sms+'</span>Messages</a>'
      +'<a href="mailto:?subject='+encodeURIComponent('Note')+'&body='+q+'"><span class="shi">'+IC.mail+'</span>E-mail</a>'
      +'<button type="button" data-cp="1"><span class="shi">'+IC.copy+'</span>Copier</button>'
      +'</div></div>';
    o.querySelector('.shp').textContent=t;
    function close(){o.remove()}
    o.addEventListener('click',function(e){if(e.target===o)close()});
    Array.prototype.forEach.call(o.querySelectorAll('a'),function(a){a.addEventListener('click',function(){setTimeout(close,400)})});
    o.querySelector('[data-cp]').onclick=function(){copyText(t,close)};
    document.body.appendChild(o);
  }
  window.shareNote=function(kind,i){
    var t=kind==='imp'?(window.NT&&NT[i]):(window.QN&&QN[i]&&QN[i].t);
    t=String(t||'').trim();if(!t)return;
    if(navigator.share){
      navigator.share({text:t}).catch(function(e){if(e&&e.name==='AbortError')return;sheet(t)});
    }else sheet(t);
  };
  var st=document.createElement('style');
  st.textContent='.shs{position:fixed;inset:0;z-index:10000;background:rgba(57,57,59,.4);display:flex;align-items:flex-end;justify-content:center}'
   +'.shc{width:100%;max-width:480px;box-sizing:border-box;background:#f9f8f6;border-radius:24px 24px 0 0;padding:18px 18px calc(env(safe-area-inset-bottom,0px) + 22px);box-shadow:0 -18px 40px -16px rgba(0,0,0,.45)}'
   +'.sht{margin:0 0 10px;font-family:"Lora",Georgia,serif;font-style:italic;font-size:19px;color:#39393b}'
   +'.shp{font-size:13px;line-height:1.5;color:#525156;background:#fff;border:1px solid #f3e7e7;border-radius:14px;padding:10px 12px;max-height:74px;overflow:hidden;white-space:pre-wrap;word-break:break-word}'
   +'.shg{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:16px}'
   +'.shg a,.shg button{display:flex;flex-direction:column;align-items:center;gap:7px;font:inherit;font-size:11px;letter-spacing:.04em;color:#525156;text-decoration:none;background:none;border:0;padding:0;cursor:pointer}'
   +'.shi{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#f3e7e7,#e8ced1);display:flex;align-items:center;justify-content:center;color:#525156;box-shadow:0 8px 14px -8px rgba(82,81,86,.55)}';
  document.head.appendChild(st);
})();
/* Visionneuse de photos avec zoom a deux doigts (page du jour, Vision board, Souvenirs) */
(function(){
  var SEL=['.pol','.dcp','.dpp','.pi'];
  function closeV(){var o=document.getElementById('lbx');if(o)o.remove();document.body.style.overflow=''}
  function openViewer(srcs,start){
    if(!srcs||!srcs.length)return;
    closeV();
    var o=document.createElement('div');o.id='lbx';o.className='lbx';
    var sc=document.createElement('div');sc.className='lbs';
    var slides=[];
    srcs.forEach(function(src){
      var p=document.createElement('div');p.className='lbp';
      var im=document.createElement('img');im.src=src;im.alt='';im.draggable=false;
      p.appendChild(im);sc.appendChild(p);slides.push(p);
    });
    var x=document.createElement('button');x.className='lbc';x.setAttribute('aria-label','Fermer');x.textContent='\u2715';
    x.onclick=function(e){e.stopPropagation();closeV()};
    o.appendChild(sc);o.appendChild(x);
    var dots=null;
    function curIdx(){return Math.max(0,Math.min(slides.length-1,Math.round(sc.scrollLeft/Math.max(1,sc.clientWidth))))}
    if(srcs.length>1){
      dots=document.createElement('div');dots.className='lbd';
      srcs.forEach(function(_,k){var d=document.createElement('span');if(k===start)d.className='on';dots.appendChild(d)});
      o.appendChild(dots);
    }
    /* ---- zoom ---- */
    var S={s:1,x:0,y:0},pin=null,pan=null,lastTap=0,lastPos=null;
    function curImg(){return slides[curIdx()].querySelector('img')}
    function apply(img,anim){
      img.style.transition=anim?'transform .22s ease':'';
      img.style.transform=(S.s===1&&!S.x&&!S.y)?'':'translate3d('+S.x+'px,'+S.y+'px,0) scale('+S.s+')';
      if(anim)setTimeout(function(){img.style.transition=''},250);
    }
    function bound(img){
      var vw=sc.clientWidth,vh=sc.clientHeight,w=img.offsetWidth*S.s,h=img.offsetHeight*S.s;
      var mx=Math.max(0,(w-vw)/2),my=Math.max(0,(h-vh)/2);
      S.x=Math.max(-mx,Math.min(mx,S.x));S.y=Math.max(-my,Math.min(my,S.y));
    }
    function lock(){sc.style.overflowX='hidden';sc.style.touchAction='none'}
    function unlock(){sc.style.overflowX='';sc.style.touchAction=''}
    function reset(img,anim){S.s=1;S.x=0;S.y=0;apply(img,anim);unlock()}
    function base(img){var r=img.getBoundingClientRect();return{x:r.left+r.width/2-S.x,y:r.top+r.height/2-S.y}}
    function dist(t){return Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY)}
    function ctr(t){return{x:(t[0].clientX+t[1].clientX)/2,y:(t[0].clientY+t[1].clientY)/2}}
    function zoomAt(img,px,py){
      if(S.s>1){reset(img,true);return}
      var b=base(img);S.s=2.5;S.x=(px-b.x)*(1-2.5);S.y=(py-b.y)*(1-2.5);bound(img);lock();apply(img,true);
    }
    sc.addEventListener('touchstart',function(e){
      var img=curImg();
      if(e.touches.length===2){
        e.preventDefault();
        var b=base(img),c=ctr(e.touches);
        pin={d:dist(e.touches),s:S.s,tx:S.x,ty:S.y,c:c,bx:b.x,by:b.y};
        pan=null;lock();
      }else if(e.touches.length===1){
        var t=e.touches[0],now=Date.now();
        if(now-lastTap<300&&lastPos&&Math.hypot(t.clientX-lastPos.x,t.clientY-lastPos.y)<30){
          e.preventDefault();lastTap=0;zoomAt(img,t.clientX,t.clientY);return;
        }
        lastTap=now;lastPos={x:t.clientX,y:t.clientY};
        if(S.s>1){e.preventDefault();pan={x:t.clientX,y:t.clientY,tx:S.x,ty:S.y}}
      }
    },{passive:false});
    sc.addEventListener('touchmove',function(e){
      var img=curImg();
      if(pin&&e.touches.length===2){
        e.preventDefault();
        var s=Math.max(1,Math.min(5,pin.s*dist(e.touches)/pin.d)),c=ctr(e.touches);
        var ux=(pin.c.x-pin.bx-pin.tx)/pin.s,uy=(pin.c.y-pin.by-pin.ty)/pin.s;
        S.s=s;S.x=c.x-pin.bx-ux*s;S.y=c.y-pin.by-uy*s;bound(img);apply(img,false);
      }else if(pan&&e.touches.length===1&&S.s>1){
        e.preventDefault();
        var t=e.touches[0];S.x=pan.tx+(t.clientX-pan.x);S.y=pan.ty+(t.clientY-pan.y);bound(img);apply(img,false);
      }
    },{passive:false});
    function endT(e){
      var img=curImg();
      if(pin&&e.touches.length<2){
        pin=null;
        if(S.s<1.03){reset(img,true)}
        else{lock();bound(img);apply(img,true);if(e.touches.length===1){var t=e.touches[0];pan={x:t.clientX,y:t.clientY,tx:S.x,ty:S.y}}}
      }else if(e.touches.length===0){pan=null}
    }
    sc.addEventListener('touchend',endT,{passive:true});
    sc.addEventListener('touchcancel',endT,{passive:true});
    sc.addEventListener('dblclick',function(e){zoomAt(curImg(),e.clientX,e.clientY)});
    sc.addEventListener('scroll',function(){
      var k=curIdx();
      if(dots)Array.prototype.forEach.call(dots.children,function(d,n){d.className=n===k?'on':''});
      slides.forEach(function(p,n){if(n!==k){var im=p.querySelector('img');if(im&&im.style.transform)im.style.transform=''}});
    },{passive:true});
    /* ne pas declencher le changement de jour de l'application */
    ['touchstart','touchend','touchmove'].forEach(function(ev){o.addEventListener(ev,function(e){e.stopPropagation()},{passive:true})});
    o.addEventListener('click',function(e){if(e.target.tagName!=='IMG')closeV()});
    document.body.appendChild(o);
    document.body.style.overflow='hidden';
    sc.scrollLeft=start*sc.clientWidth;
    requestAnimationFrame(function(){sc.scrollLeft=start*sc.clientWidth});
  }
  window.openViewer=openViewer;
  /* toutes les photos : un toucher ouvre la visionneuse (phase de capture : remplace l'ancienne) */
  document.addEventListener('click',function(e){
    var img=e.target&&e.target.closest?e.target.closest('.pol img,.dcp img,.dpp img,.pi img'):null;
    if(!img||img.closest('#lbx'))return;
    var sel=SEL.filter(function(q){return img.closest(q)})[0];
    if(!sel)return;
    var item=img.closest(sel),par=item.parentNode;
    var imgs=Array.prototype.slice.call(par.querySelectorAll(sel+' img'));
    var idx=imgs.indexOf(img);
    e.stopPropagation();e.preventDefault();
    openViewer(imgs.map(function(m){return m.getAttribute('src')}),idx<0?0:idx);
  },true);
  var st=document.createElement('style');
  st.textContent='.lbs{overflow-y:hidden}.lbp img{transform-origin:50% 50%;will-change:transform;touch-action:pan-x;-webkit-touch-callout:none}.pol img{cursor:zoom-in}';
  document.head.appendChild(st);
})();
/* Vision board : un tableau different pour chaque annee */
(function(){
  var VBY=new Date().getFullYear();
  function keyY(y){return y===2026?'ag-vb':'ag-vb-'+y}   /* le tableau deja cree reste celui de 2026 */
  var _vbU=vbUse;
  vbUse=function(k){
    var m=/^ag-vb-(\d{4})$/.exec(k);
    if(k==='ag-vb')k=keyY(VBY);
    else if(m)k=keyY(+m[1]);
    _vbU(k);
  };
  window.vbSetY=function(y){VBY=y;render();window.scrollTo(0,0)};
  var _vpY=visionPage;
  visionPage=function(){
    var h=_vpY();
    if(isPast())return h;
    var c=new Date().getFullYear(),yrs=[c,c+1];
    var chips='<div class="vby">'+yrs.map(function(y){return '<button class="'+(y===VBY?'on':'')+'" onclick="vbSetY('+y+')">'+y+'</button>'}).join('')+'</div>';
    return h.replace('<h1 class="vbt">Vision board</h1><div class="dv"><i></i></div>','<h1 class="vbt">Vision board</h1><div class="dv"><i></i></div>'+chips);
  };
  var st=document.createElement('style');
  st.textContent='.vby{display:flex;justify-content:center;gap:8px;margin:12px 0 2px}'
   +'.vby button{border-radius:999px;border:1px solid #f3e7e7;background:rgba(255,255,255,.7);color:#895a64;font-family:"Nunito",sans-serif;font-weight:600;font-size:13px;letter-spacing:.12em;padding:7px 18px;cursor:pointer}'
   +'.vby button.on{background:linear-gradient(135deg,#ac727e,#895a64);color:#fff;border-color:transparent;box-shadow:0 8px 14px -8px rgba(137,90,100,.7)}';
  document.head.appendChild(st);
})();
/* Memories : "Vision board" devient "Memories" pour les annees precedentes */
(function(){
  var _pp9=pastPage;
  pastPage=function(){
    return _pp9().replace('>Vision board</button>','>Memories</button>').replace('<h1 class="vbt">Vision board</h1>','<h1 class="vbt">Memories</h1>');
  };
})();
