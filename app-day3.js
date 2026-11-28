/* Page du jour v63 : bandeau verre, photo polaroid, icones en grille (meme taille).
   Ce fichier se charge APRES app-photos-tab.js et AVANT app-cover.js.
   Il enveloppe dayPage() : il reconstruit le haut de la page et garde tout le reste
   (Gratitude, Sons au reveil, Ma journee) tel quel. En cas de souci, il rend la page d'avant. */
(function(){
  /* calligraphie du titre (comme "Dream board") */
  try{
    var lk=document.createElement('link');
    lk.rel='stylesheet';
    lk.href='https://fonts.googleapis.com/css2?family=Parisienne&display=swap';
    document.head.appendChild(lk);
  }catch(e){}

  var CAM='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/></svg>';
  var SH=['Mat.','Apr.','Soir','Nuit'];

  function acts(y,m,d){
    var t0=new Date(y,m,d),dow=t0.getDay(),sun=new Date(y,m,d-dow),W=null;
    try{W=JSON.parse(localStorage.getItem('agw-'+iso(sun)))}catch(e){}
    var c=(W&&W.c)||{};
    return ACTH.filter(function(a){return !!c[a[0]+dow]});
  }
  function ic(onclick,inner,label,aria){
    return '<div class="dwi" role="button" aria-label="'+aria+'" onclick="'+onclick+'">'+inner+'<small>'+label+'</small></div>';
  }

  var _prev=dayPage;
  dayPage=function(){
    var h=_prev();
    try{
      var iM=h.indexOf('<div class="mag">'),iG=h.indexOf('<section class="dgr3">');
      if(iM<0||iG<0)return h;
      var head=h.slice(0,iM),rest=h.slice(iG);
      var hm=h.match(/<svg class="dph"[\s\S]*?<\/svg>/),heart=hm?hm[0]:'\u2665';
      var y=dy[0],m=dy[1],d=dy[2],t0=new Date(y,m,d);

      /* 1. bandeau en verre, comme "Dream board" */
      var ban='<div class="dbn"><div><b>Another day in paradise\u2026</b><span>Merci la vie'+heart+'</span></div></div>';

      /* 2. photo polaroid, jour et date dans l'espace du bas */
      var n=dday.p.length,photo,moon='';
      try{if(typeof FM!=='undefined'&&FM[y+'-'+(m+1)+'-'+d])moon=' \u00b7 \ud83c\udf15'}catch(e){}
      if(n){
        photo='<div class="dpm"><div class="dcs" onscroll="dcScroll(this)" ontouchstart="event.stopPropagation()" ontouchend="event.stopPropagation()">'
          +dday.p.map(function(src,i){return '<div class="dcp"><img src="'+src+'" alt=""><button aria-label="Retirer la photo" onclick="dpd('+i+')">\u2715</button>'+(n>1?'<span class="dcn">'+(i+1)+' / '+n+'</span>':'')+'</div>'}).join('')+'</div>'
          +(n>1?'<div class="dcdots" id="dcd">'+dday.p.map(function(_,i){return '<span'+(i===0?' class="on"':'')+'></span>'}).join('')+'</div>':'')
          +'<label class="dcam" aria-label="Ajouter des photos">'+CAM+'<input type="file" accept="image/*" multiple hidden onchange="dph(this)"></label></div>';
      }else{
        photo='<label class="dpm dpm0">'+CAM+'<span>Ajouter une photo</span><input type="file" accept="image/*" multiple hidden onchange="dph(this)"></label>';
      }
      var pol='<div class="dpl"><i class="dpt"></i><div class="dpf">'+photo
        +'<div class="dpb"><div class="dpd"><b>'+DFULL[t0.getDay()]+'</b><span>'+d+' '+MONTHS[m].toLowerCase()+' '+y+moon+'</span></div>'
        +'<div class="dpn"><button onclick="dayMove(-1)" aria-label="Jour pr\u00e9c\u00e9dent">\u2039</button><button onclick="dayMove(1)" aria-label="Jour suivant">\u203a</button></div></div>'
        +'</div></div>';

      /* 3. carte : le temps (4 icones), puis plage, singes, humeur */
      var w=wxGet(y,m,d),b=isBeach(y,m,d),nm=bcName(y,m,d),mk=mkOn(y,m,d),mo=(typeof dday.mo==='number')?dday.mo:-1;
      var row1=w.map(function(v,i){return ic('wxOpen('+y+','+m+','+d+','+i+')',wxTile(v),SH[i],'Le temps')}).join('');
      var plage=ic('bcOpen('+y+','+m+','+d+')','<span class="dwb'+(b?'':' off')+'"><img src="img-plage.webp" alt=""></span>',b?esc(bcShort(nm)):'Plage','Plage');
      var sing=ic('mkTog('+y+','+m+','+d+')','<span class="dwb'+(mk?'':' off')+'"><img src="img-singe.webp" alt=""></span>','Singes','Singes');
      var hum=ic('mdOpen()','<span class="dwb'+(mo>=0?'':' e')+'">'+(mo>=0?MOOD5[mo].s:'+')+'</span>',mo>=0?MOOD5[mo].n:'Humeur','Humeur');
      var card='<section class="dwc"><p class="dwl">Le temps</p><div class="dwg">'+row1+'</div>'
        +'<div class="dwg dwg2">'+plage+sing+'<span></span>'+hum+'</div></section>';

      /* 4. objectifs : leur propre encadre */
      var A=acts(y,m,d);
      var obj='<section class="dwc dwo"><p class="dwl">Objectifs</p>'
        +(A.length?'<div class="dsm-r">'+A.map(function(a){return '<span class="dsm-a" title="'+a[2]+'">'+actIcon(a)+'</span>'}).join('')+'</div>':'<span class="ds-none">Rien de coch\u00e9</span>')
        +'</section>';

      return head+'<div class="mag">'+ban+pol+card+obj+rest;
    }catch(e){return h}
  };

  var st=document.createElement('style');
  st.textContent=':root{--dsz:52px}'
   /* bandeau verre : nuances de blancs, reflets */
   +'.dbn{position:relative;width:90%;margin:4px auto 0;padding:3px;border-radius:21px;background:linear-gradient(135deg,#ffffff 0%,#e8dcd6 20%,#ffffff 38%,#d8c7c0 60%,#fbf6f3 80%,#cbb6af 100%);box-shadow:0 8px 14px -6px rgba(90,70,70,.32),0 1px 2px rgba(90,70,70,.22),inset 0 1px 0 rgba(255,255,255,.95)}'
   +'.dbn>div{position:relative;overflow:hidden;border-radius:18px;text-align:center;padding:6px 8px 5px;border:1px solid #f0e6e2;background:radial-gradient(circle at 7% 22%,#fff 0 1.5px,rgba(255,255,255,0) 7px),radial-gradient(circle at 94% 78%,#fff 0 1.5px,rgba(255,255,255,0) 7px),linear-gradient(180deg,#ffffff 0%,#fbf9f8 48%,#efe9e6 100%);box-shadow:inset 0 0 0 2px #ffffff,inset 0 -9px 12px -7px rgba(170,140,135,.3),inset 0 9px 10px -7px #ffffff}'
   +'.dbn>div::before{content:"";position:absolute;left:0;right:0;top:0;height:50%;border-radius:18px 18px 55% 55% / 18px 18px 16px 16px;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(255,255,255,.2));pointer-events:none}'
   +'.dbn>div::after{content:"";position:absolute;top:-40%;left:-12%;width:34%;height:180%;transform:rotate(22deg);background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.8),rgba(255,255,255,0));pointer-events:none}'
   +'.dbn b,.dbn span{position:relative;z-index:1;display:block;font-family:"Parisienne","Great Vibes","Snell Roundhand",cursive;font-weight:400;font-style:normal}'
   +'.dbn b{font-size:25px;line-height:1.15;color:#1a1414}'
   +'.dbn span{font-size:16px;line-height:1.1;color:#9c6670}'
   +'.dbn svg{display:inline-block;width:15px;height:13px;margin-left:3px;vertical-align:-1px}'
   /* polaroid */
   +'.dpl{position:relative;width:78%;margin:16px auto 6px;transform:rotate(-1.5deg)}'
   +'.dpl .dpt{position:absolute;top:-10px;left:20px;width:56px;height:16px;background:rgba(232,206,209,.82);transform:rotate(-3deg);box-shadow:0 1px 3px rgba(0,0,0,.12);z-index:4}'
   +'.dpf{background:#fff;border:.5px solid #e4dede;padding:8px 8px 6px;box-shadow:0 14px 22px -14px rgba(57,57,59,.6),0 2px 5px rgba(0,0,0,.08)}'
   +'.dpm{position:relative;display:block;overflow:hidden;background:#eceaea}'
   +'.dpl .dcs{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;border-radius:0;margin:0}'
   +'.dpl .dcs::-webkit-scrollbar{display:none}'
   +'.dpl .dcp{position:relative;flex:0 0 100%;scroll-snap-align:center;border-radius:0}'
   +'.dpl .dcp img{display:block;width:100%;height:auto;aspect-ratio:1/.82;max-height:none;object-fit:cover;border-radius:0}'
   +'.dpl .dcp>button{position:absolute;top:8px;right:8px;left:auto;bottom:auto;width:28px;height:28px;border:0;border-radius:50%;background:rgba(255,255,255,.9);color:#525156;font-size:12px;line-height:1;padding:0;cursor:pointer;z-index:3}'
   +'.dpl .dcn{display:none}'
   +'.dpl .dcdots{position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;gap:6px;margin:0;pointer-events:none}'
   +'.dpl .dcdots span{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.6)}'
   +'.dpl .dcdots span.on{background:#fff}'
   +'.dpl .dcam{position:absolute;left:8px;right:auto;top:8px;bottom:auto;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.9);color:#a8707c;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:3;box-shadow:none}'
   +'.dpl .dcam svg{width:17px;height:17px}'
   +'.dpm0{aspect-ratio:1/.82;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:1.5px dashed #d9b0b6;box-sizing:border-box;background:#f6f1f1;color:#a8707c;font-size:11px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}'
   +'.dpm0 svg{width:26px;height:26px}'
   +'.dpb{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 2px 0}'
   +'.dpd b{display:block;font-family:"Lora",Georgia,serif;font-style:italic;font-weight:500;font-size:17px;line-height:1.1;color:#39393b}'
   +'.dpd span{display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#707072;margin-top:3px}'
   +'.dpn{display:flex;gap:6px;flex:0 0 auto}'
   +'.dpn button{width:30px;height:30px;border-radius:50%;border:1px solid #e0c2c6;background:#f6f1f1;color:#707072;font-size:18px;line-height:1;padding:0;cursor:pointer}'
   /* cartes d'icones : meme grosseur partout */
   +'.dwc{background:#fff;border:1px solid #e8ced1;border-radius:20px;padding:8px 8px 7px;margin:16px 0 8px;box-shadow:0 10px 20px -18px rgba(137,90,100,.6)}'
   +'.dwc+.dwc{margin-top:0}'
   +'.dwl{margin:0 0 4px 8px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#ac727e}'
   +'.dwg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;justify-items:center}'
   +'.dwg2{margin-top:6px;padding-top:6px;border-top:1px solid #f0e1e3}'
   +'.dwi{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;min-width:0}'
   +'.dwi small{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#a8707c;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}'
   +'.dwg .wxs,.dwb{width:var(--dsz)!important;height:var(--dsz)!important}'
   +'.dwb{display:flex;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;box-sizing:border-box;border:2px solid #fff;background:#fff;box-shadow:0 5px 9px -7px rgba(137,90,100,.7)}'
   +'.dwb img,.dwb svg{display:block;width:100%;height:100%;object-fit:cover}'
   +'.dwb.off img{filter:saturate(.25);opacity:.55}'
   +'.dwb.e{border:1.5px dashed #d9b0b6;background:rgba(255,255,255,.4);box-shadow:none;color:#c48f97;font-size:20px;line-height:1}'
   +'.dwo{display:flex;align-items:center;gap:12px;padding:8px 14px}.dwo .dwl{margin:0}'
   +'.dwo .dsm-r{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0}'
   +'.dwo .dsm-a{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;overflow:hidden}'
   +'.dwo .dsm-a img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%}'
   +'.dwo .ds-none{display:block;font-style:italic;font-size:13px;color:#a8707c;padding:0}';
  document.head.appendChild(st);
})();

try{render()}catch(e){}
