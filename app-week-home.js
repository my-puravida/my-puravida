/* Planificateur de la semaine : plus artistique, repas discrets */
var MEALSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3v6a2 2 0 0 0 4 0V3M8 3v18"/><path d="M17 21V3c-2.200 1.500-3.200 4-3.200 7s1.100 3 3.200 3"/></svg>';
function isTodayD(d){var t=new Date();return d.getFullYear()===t.getFullYear()&&d.getMonth()===t.getMonth()&&d.getDate()===t.getDate()}
function mealHas(i){var t=(cw&&cw.t)||{};return !!((t['m'+i+'0']||'').trim()||(t['m'+i+'1']||'').trim())}
function wMeal(b){var c=b.closest('.dc'),m=c&&c.querySelector('.meals');if(!m)return;var o=m.style.display==='none';m.style.display=o?'block':'none';b.classList.toggle('open',o);if(o){var f=m.querySelector('input');if(f)f.focus()}}
(function(){
  var G=[['#f9f8f6','#f3e7e7'],['#f3e7e7','#e8ced1'],['#f3e7e7','#e8ced1'],['#e8ced1','#d9b0b6'],['#e8ced1','#d9b0b6'],['#e8ced1','#d9b0b6'],['#f3e7e7','#e8ced1']];
  var css='.wo{font-family:"Lora",Georgia,serif;font-style:italic;font-size:22px;color:#ac727e;text-align:center;margin:18px 0 12px;letter-spacing:.01em}'
  +'.wban{margin:26px 0 24px!important}'
  +'.dc[class*="dcv"]{border:0;border-radius:26px;overflow:hidden;margin:18px 0;background:#ffffff;box-shadow:0 16px 24px -20px rgba(137,90,100,.6)}'
  +'.dc[class*="dcv"] .dl{display:flex;align-items:center;gap:10px;padding:12px 16px;font-family:"Lora",Georgia,serif;font-style:italic;font-size:22px;letter-spacing:0;text-transform:none;color:#39393b}'
  +'.dc[class*="dcv"] .dl b{display:inline-block;width:32px;height:32px;line-height:32px;border-radius:50%;background:#fff;color:#895a64;font-style:normal;font-weight:600;font-size:15px;text-align:center;box-shadow:0 4px 8px -5px rgba(137,90,100,.6)}'
  +'.dc[class*="dcv"] .dlr{margin-left:auto;display:flex;align-items:center;gap:12px;float:none!important}.dc[class*="dcv"] .dlr i{font-style:normal;font-size:24px;color:#ac727e;line-height:1}'
  +'.mealb{position:relative;width:32px;height:32px;border-radius:50%;border:0;background:rgba(255,255,255,.75);color:#ac727e;padding:0;display:flex;align-items:center;justify-content:center;cursor:pointer}.mealb svg{width:18px;height:18px}.mealb.open{background:#fff;box-shadow:0 0 0 2px #d9b0b6}.mealb.has::after{content:"";position:absolute;top:2px;right:2px;width:8px;height:8px;border-radius:50%;background:#c48f97;border:1.5px solid #fff}'
  +'.dc[class*="dcv"] .dcols{padding:10px 16px 14px}.dc[class*="dcv"] .dcols h5{font-family:"Lora",Georgia,serif;font-style:italic;font-weight:500;font-size:14px;letter-spacing:.04em;text-transform:none;color:#ac727e;margin:2px 0 4px}'
  +'.dc[class*="dcv"] .meals{grid-column:1/-1;margin-top:10px;padding-top:8px;border-top:1px dashed #e8ced1}'
  +'.dc[class*="dcv"] .wl input{font-family:"Caveat","Segoe Print","Bradley Hand",cursive;font-size:20px;color:#39393b;-webkit-text-fill-color:#39393b}'
  +'.dc.today{box-shadow:0 0 0 2px #d9b0b6,0 16px 24px -20px rgba(137,90,100,.7)}';
  G.forEach(function(g,i){css+='.dc.dcv'+i+' .dl{background:linear-gradient(100deg,'+g[0]+','+g[1]+')}'});
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
(function(){var st=document.createElement('style');st.textContent='.dc[class*="dcv"] .dcols{display:block!important}';document.head.appendChild(st)})();
/* Semaine : vue d'ensemble, en-tete compact, repas regroupes */
function wkOverview(){
  var t=(cw&&cw.t)||{},c=(cw&&cw.c)||{},h='<div class="wov">';
  for(var i=0;i<7;i++){
    var dd=new Date(wd.getFullYear(),wd.getMonth(),wd.getDate()+i),dots='';
    for(var k=0;k<5;k++){var id='p'+i+k;if((t[id]||'').trim())dots+='<i class="'+(c[id]?'d':'')+'"></i>'}
    h+='<button class="wod'+(isTodayD(dd)?' today':'')+'" onclick="wGo('+i+')"><small>'+DN[i].charAt(0)+'</small><b>'+dd.getDate()+'</b><span class="wdots">'+dots+'</span><span class="wmk">'+(mealHas(i)?MEALSVG:'')+'</span></button>';
  }
  return h+'</div>';
}
(function(){var st=document.createElement('style');st.textContent='@keyframes wfl{0%{box-shadow:0 0 0 3px #d9b0b6,0 0 18px 4px rgba(217,176,182,.55)}100%{box-shadow:0 0 0 0 rgba(217,176,182,0)}}.dc.wflash{animation:wfl 1.3s ease-out}';document.head.appendChild(st)})();
(function(){var st=document.createElement('style');st.textContent='.hdt{cursor:pointer;-webkit-tap-highlight-color:transparent;display:inline-block}.hdt:active{opacity:.82}.hdc{display:inline-block;margin-left:10px;font-weight:400;opacity:.85;letter-spacing:0}';document.head.appendChild(st)})();
function wGo(i){
  var e=document.getElementById('wd'+i);if(!e)return;
  var se=document.scrollingElement||document.documentElement,nv=document.querySelector('nav');
  var off=(nv?nv.getBoundingClientRect().height:0)+10;
  var y0=window.pageYOffset||se.scrollTop||0,y=Math.max(0,e.getBoundingClientRect().top+y0-off),d=y-y0,t0=null;
  function step(ts){
    if(t0===null)t0=ts;
    var p=Math.min(1,(ts-t0)/380),k=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,v=y0+d*k;
    try{window.scrollTo(0,v)}catch(x){}
    try{se.scrollTop=v}catch(x){}
    if(p<1)requestAnimationFrame(step);
    else if(Math.abs((window.pageYOffset||se.scrollTop||0)-y)>6){try{e.scrollIntoView(true)}catch(x){}}
  }
  requestAnimationFrame(step);
  e.classList.remove('wflash');void e.offsetWidth;e.classList.add('wflash');
}
function mealOpen(){
  var el=document.getElementById('mlsheet');if(!el){el=document.createElement('div');el.id='mlsheet';document.body.appendChild(el)}
  var h='<div class="wxbk" onclick="mealClose()"></div><div class="wxsh"><div class="wxgr"></div><p class="wxt">Repas de la semaine</p>';
  for(var i=0;i<7;i++){
    var dd=new Date(wd.getFullYear(),wd.getMonth(),wd.getDate()+i);
    h+='<div class="mlsec"><h6>'+DN[i]+' '+dd.getDate()+'</h6>';
    for(var k=0;k<2;k++){var id='m'+i+k;h+='<input class="mlin" type="text" placeholder="Repas '+(k+1)+'…" value="'+esc((cw.t||{})[id]||'')+'" oninput="wt(\''+id+'\',this.value)">'}
    h+='</div>';
  }
  h+='<button class="wxok" onclick="mealClose()">Terminé</button></div>';
  el.innerHTML=h;
}
function mealClose(){var el=document.getElementById('mlsheet');if(el)el.parentNode.removeChild(el);render()}
(function(){
  var css='.wo{font-size:18px!important;margin:4px 0 10px!important;white-space:nowrap}'
  +'.wphr{text-align:center;font-family:"Lora",Georgia,serif;font-style:italic;font-size:14px;line-height:1.5;color:#ac727e;margin:20px 6px 16px}.wphr span{display:inline-flex;align-items:center;gap:5px}.wphr .dph{width:17px;height:15px}'
  +'.wov{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin:0 0 16px;padding:10px 4px 8px;border-radius:22px;background:rgba(255,255,255,.75);border:1px solid #f3e7e7;box-shadow:0 12px 20px -18px rgba(137,90,100,.6)}'
  +'.wod{border:0;background:none;display:flex;flex-direction:column;align-items:center;gap:4px;padding:2px 0;font:inherit;cursor:pointer;min-width:0}.wod small{font-size:10px;letter-spacing:.08em;color:#895a64;text-transform:uppercase}'
  +'.wod b{width:30px;height:30px;line-height:30px;border-radius:50%;background:linear-gradient(135deg,#f9f8f6,#e8ced1);font-size:14px;color:#39393b;font-weight:600;text-align:center}.wod.today b{background:#c48f97;color:#fff;box-shadow:0 0 0 3px #e8ced1}'
  +'.wdots{display:flex;flex-wrap:wrap;gap:2px;justify-content:center;min-height:8px;max-width:30px}.wdots i{width:6px;height:6px;border-radius:50%;border:1.2px solid #d9b0b6;box-sizing:border-box}.wdots i.d{background:#c48f97;border-color:#c48f97}.wmk{height:13px;color:#ac727e;display:block}.wmk svg{width:13px;height:13px;display:block}'
  +'.postit h3{font-size:17px!important;margin:0 86px 6px 0!important;line-height:1.2}.postit .pico{position:absolute;top:8px;right:8px;display:flex;gap:8px;z-index:2}.postit .pico .gof{margin:0;position:static!important}.postit .wi{font-size:17px}'
  +'.mlsec{margin:0 0 10px}.mlsec h6{margin:0 0 4px;font-family:"Lora",Georgia,serif;font-style:italic;font-weight:500;font-size:15px;color:#ac727e}'
  +'.mlin{display:block;width:100%;box-sizing:border-box;padding:9px 12px;margin:0 0 6px;border-radius:12px;border:1px solid #e8ced1;background:#fff;font:inherit;font-size:15px;color:#39393b!important;-webkit-text-fill-color:#39393b;outline:none}.mlin:focus{border-color:#c48f97}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
/* Singes : petite icone a droite de la meteo (Accueil) */
(function(){
  function mkAll(){try{return JSON.parse(localStorage.getItem('ag-mk'))||{}}catch(e){return{}}}
  function mkKey(y,m,d){return y+'-'+(m+1)+'-'+d}
  window.mkOn=function(y,m,d){return !!mkAll()[mkKey(y,m,d)]};
  window.mkTog=function(y,m,d){var o=mkAll(),k=mkKey(y,m,d);if(o[k])delete o[k];else o[k]=true;try{localStorage.setItem('ag-mk',JSON.stringify(o))}catch(e){}render()};
  var _wx=wxHero;
  wxHero=function(t){
    var h=_wx(t),y=t.getFullYear(),m=t.getMonth(),d=t.getDate(),on=mkOn(y,m,d);
    var btn='<div class="wxc mkc" role="button" aria-label="On a vu les singes" aria-pressed="'+(on?'true':'false')+'" onclick="mkTog('+y+','+m+','+d+')"><span class="mky'+(on?' on':'')+'"><i></i></span><small>Singes</small></div>';
    return h.slice(0,h.length-6)+btn+'</div>';
  };
  var st=document.createElement('style');
  st.textContent='.mky{--mk:url(img-mk.png);display:flex;align-items:center;justify-content:center;width:42px;height:42px;margin-top:6px;border-radius:50%;box-sizing:border-box;border:1.6px dashed rgba(255,255,255,.95);background:rgba(255,255,255,.28);transition:all .2s}'
   +'.mky i{display:block;width:28px;height:28px;background:rgba(255,255,255,.92);-webkit-mask-image:var(--mk);mask-image:var(--mk);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain}'
   +'.mky.on{border:2px solid rgba(255,255,255,.95);background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7 60%,#e8ced1);box-shadow:0 0 0 3px rgba(255,255,255,.55),0 8px 14px -8px rgba(82,81,86,.7)}'
   +'.mky.on i{background:linear-gradient(160deg,#895a64,#525156)}';
  document.head.appendChild(st);
})();
/* Singes : page du jour + statistiques */
(function(){
  var MKI=(document.querySelector('style[data-mk]')||{}).textContent;
  var _dpm=dayPage;
  dayPage=function(){
    var h=_dpm();
    if(h.indexOf('<div class="d3o">')<0)return h;
    var y=dy[0],m=dy[1],d=dy[2],on=mkOn(y,m,d);
    var b='<div class="d3m" role="button" aria-label="On a vu les singes" aria-pressed="'+(on?'true':'false')+'" onclick="mkTog('+y+','+m+','+d+')"><span class="d3c'+(on?'':' off')+'"><img src="img-singe.webp" alt=""></span><small>Singes</small></div>';
    return h.replace('<div class="d3o">','<div class="d3o">'+b);
  };
  var _yr=yrHTML;
  yrHTML=function(){
    var h=_yr(),y=curYear();if(!(y>0))y=new Date().getFullYear();
    var o={};try{o=JSON.parse(localStorage.getItem('ag-mk'))||{}}catch(e){}
    var mm=[0,0,0,0,0,0,0,0,0,0,0,0],n=0;
    Object.keys(o).forEach(function(k){var p=k.split('-');if(+p[0]===y){n++;mm[+p[1]-1]++}});
    var mx=Math.max.apply(null,mm.concat([1]));
    var blk='<h4 class="mgl">\ud83d\udc12 Singes \u00b7 '+n+' jour'+(n>1?'s':'')+'</h4><div class="ysp mkst">'+mm.map(function(c,i){return '<div class="ysb"><i style="height:'+Math.round(c*100/mx)+'%"></i><span>'+MONTHS[i].slice(0,1)+'</span></div>'}).join('')+'</div>';
    var a='<h4 class="mgl">Activit\u00e9s</h4>',i=h.indexOf(a);
    return i<0?h:h.slice(0,i)+blk+h.slice(i);
  };
  var st=document.createElement('style');
  st.textContent='.d3o{position:relative}.d3o .dsm-r{padding-right:54px}.d3o .ds-none{display:inline-block;padding-right:54px}.d3m{position:absolute;right:0;bottom:-2px;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer}'
   +'.d3m .mky{width:32px;height:32px;margin-top:0;border:1.5px dashed #d9b0b6;background:rgba(255,255,255,.5)}.d3m .mky i{width:22px;height:22px;background:#d9b0b6}'
   +'.d3m .mky.on{border:2px solid #fff;background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7 60%,#e8ced1);box-shadow:0 5px 9px -6px rgba(82,81,86,.8)}.d3m .mky.on i{background:linear-gradient(160deg,#895a64,#525156)}'
   +'.d3m small{font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}'
   +'.mkst .ysb i{background:linear-gradient(180deg,#c48f97,#895a64)}';
  document.head.appendChild(st);
})();
/* Marche : icone d'activite, entre Meditation et Pura Vida */
(function(){
  ACTIMG.wx='img-act-wx.webp';
  function ins(arr,item){
    if(arr.some(function(a){return a[0]==='wx'}))return;
    var i=arr.length;for(var k=0;k<arr.length;k++){if(arr[k][0]==='mx'){i=k;break}}
    arr.splice(i,0,item);
  }
  var tag='<img class="pkm aci" src="'+ACTIMG.wx+'" alt="">';
  ins(ACT,['wx',tag,'Marche']);
  ins(WST,['wx',tag,'Marche']);
  ins(ACTH,['wx','IMG:wx','Marche']);
  var _ai=actIcon;
  actIcon=function(a){
    if(a&&a[1]==='IMG:wx')return '<img class="full" src="'+ACTIMG.wx+'" alt="Marche">';
    return _ai(a);
  };
})();
/* Page du jour : coeur "journee importante" en haut a droite */
(function(){
  var HRT='<svg class="dhs" viewBox="0 0 34 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M13 27C4 20 1 15 1 10.500 1 6.700 3.800 4 7.200 4c2.300 0 4.300 1.300 5.800 3.400C14.500 5.300 16.500 4 18.800 4 22.200 4 25 6.700 25 10.500 25 15 22 20 13 27z" fill="#c48f97" stroke="#c48f97" stroke-width="1" stroke-linejoin="round"/><path d="M26 15c-3-2.200-4.200-4-4.200-5.600 0-1.400 1-2.400 2.300-2.400.8 0 1.500.4 1.900 1.100.4-.7 1.100-1.100 1.900-1.100 1.300 0 2.300 1 2.300 2.400 0 1.600-1.200 3.400-4.200 5.600z" fill="#d9b0b6" stroke="#d9b0b6" stroke-width=".9" stroke-linejoin="round" transform="translate(2 -3)"/><path d="M5 9.500c.6-1.800 2-2.700 3.600-2.700" fill="none" stroke="#fff" stroke-width="1.300" stroke-linecap="round" opacity=".7"/></svg>';
  var _dh=dayPage;
  dayPage=function(){
    var h=_dh();
    if(h.indexOf('class="mhero')<0)return h;
    h=h.replace(/<i class="dmk[^"]*" role="button" aria-label="Marquer cette date" onclick="dstar\(\)"><\/i>/,'');
    var on=!!(dday&&dday.s);
    var btn='<button class="dhb'+(on?' on':'')+'" aria-label="Journ\u00e9e importante" aria-pressed="'+(on?'true':'false')+'" onclick="dstar()">'+HRT+'</button>';
    return h.replace(/<div class="mhero (has|nop)">/,function(m){return m+btn});
  };
  var st=document.createElement('style');
  st.textContent='.dhb{position:absolute;top:14px;right:14px;z-index:6;width:38px;height:38px;border-radius:50%;border:0;padding:0;background:rgba(255,255,255,.88);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 10px -4px rgba(0,0,0,.3);transition:transform .15s}'
   +'.dhb:active{transform:scale(.92)}.dhb svg{width:23px;height:21px;display:block;transition:all .2s}'
   +'.dhb:not(.on) svg{filter:grayscale(.9);opacity:.4}.dhb.on{box-shadow:0 0 0 3px rgba(255,255,255,.55),0 6px 12px -4px rgba(137,90,100,.7)}';
  document.head.appendChild(st);
})();
/* Calendrier annuel : presentation plus artistique, plus de choix perles/aquarelle */
(function(){
  /* un seul style, les perles, sans choix */
  pls='perle';
  try{localStorage.setItem('ag-pl','perle')}catch(e){}
  document.documentElement.setAttribute('data-pl','perle');
  setPL=function(){};
  var _lg=legend;
  legend=function(){return _lg().replace(/<div class="pls">[\s\S]*?<\/div>/,'')};
  var FLR='<svg viewBox="0 0 220 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 9h86M126 9h86" stroke="#d9b0b6" stroke-width="1.1" stroke-linecap="round"/><path d="M110 3l5 6-5 6-5-6z" fill="#d9b0b6"/><circle cx="98" cy="9" r="1.6" fill="#d9b0b6"/><circle cx="122" cy="9" r="1.6" fill="#d9b0b6"/></svg>';
  var _yh=yearHead;
  yearHead=function(y){
    return _yh(y).replace(/<h1>(\d+)<\/h1><div class="dv"><i><\/i><\/div>/,function(m,yy){
      return '<div class="yhd"><span class="yk">Calendrier</span><h1>'+yy+'</h1><div class="yfl">'+FLR+'</div></div>';
    });
  };
  var A=['#ac727e','#ac727e','#ac727e','#ac727e','#ac727e','#ac727e','#707072','#ac727e','#ac727e','#ac727e','#895a64','#895a64'];
  var W=['#f9f8f6','#f3e7e7','#f3e7e7','#f3e7e7','#f9f8f6','#f3e7e7','#f3e7e7','#f3e7e7','#f3e7e7','#f3e7e7','#f3e7e7','#f3e7e7'];
  function rgba(h,a){return 'rgba('+parseInt(h.slice(1,3),16)+','+parseInt(h.slice(3,5),16)+','+parseInt(h.slice(5,7),16)+','+a+')'}
  var css='.yhd{position:relative;overflow:hidden;text-align:center;padding:20px 0 4px;margin:0 0 8px}'
   +'.yhd::before{content:"";position:absolute;left:50%;top:-84px;width:280px;height:280px;margin-left:-140px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.8),rgba(243,231,231,.55) 45%,rgba(243,231,231,0) 70%)}'
   +'.yhd>*{position:relative}'
   +'.yk{display:block;font-size:10px;letter-spacing:.5em;text-transform:uppercase;color:#c48f97;padding-left:.5em}'
   +'.yhd h1{font-family:"Lora",Georgia,serif;font-style:italic;font-weight:500;font-size:68px;line-height:1;margin:6px 0 2px;letter-spacing:.01em;background:linear-gradient(135deg,#ac727e,#895a64);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}'
   +'.yfl svg{display:block;width:190px;height:18px;margin:6px auto 2px}'
   +'.yv .grid{gap:14px 11px}'
   +'.yv .grid .m{position:relative;overflow:hidden;background:linear-gradient(165deg,#ffffff,var(--mw,#f9f8f6));border:1px solid #f3e7e7;border-radius:22px;padding:12px 8px 8px;box-shadow:0 14px 24px -20px rgba(137,90,100,.65),inset 0 1px 0 rgba(255,255,255,.9);transition:transform .15s}'
   +'.yv .grid .m::before{content:"";position:absolute;right:-28px;top:-28px;width:92px;height:92px;border-radius:50%;background:var(--mc,rgba(217,176,182,.16));pointer-events:none}'
   +'.yv .grid .m>*{position:relative}.yv .grid .m:active{transform:scale(.985)}'
   +'.yv .grid .m h3{font-family:"Dancing Script","Brush Script MT",cursive;font-style:normal;font-weight:600;font-size:27px;line-height:1;margin:0 0 6px;text-align:center;color:var(--ma,#895a64);letter-spacing:.01em}'
   +'.yv .grid .m th{background:none!important;color:#c48f97;font-family:"Nunito",sans-serif;font-size:10px;font-weight:700;letter-spacing:.06em;padding:3px 0 5px;border-bottom:1px solid #f3e7e7}'
   +'.yv .grid .m td{font-family:"Nunito",sans-serif;font-size:14.5px;font-weight:600;color:#525156;height:28px}'
   +'.yv .grid .m td.o{color:#e8ced1;font-weight:500}.yv .grid .m td:first-child{color:#ac727e}'
   +'.yv .grid .m .pl{width:23px;height:23px;font-size:12.5px}'
   +'.yv .lgd{display:flex;flex-wrap:wrap;justify-content:center;gap:7px 12px;margin:20px 0 6px;padding:13px 12px;background:rgba(255,255,255,.7);border:1px solid #f3e7e7;border-radius:22px;box-shadow:0 12px 20px -18px rgba(137,90,100,.5)}'
   +'.yv .lgd span{display:inline-flex;align-items:center;gap:6px;font-size:11px;letter-spacing:.06em;color:#895a64}'
   +'.yv .lgd i{display:block;width:12px;height:12px;border-radius:50%}';
  for(var i=0;i<12;i++)css+='.yv .grid>.m:nth-child('+(i+1)+'){--ma:'+A[i]+';--mw:'+W[i]+';--mc:'+rgba(A[i],.13)+'}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
/* Accueil : encadre style magazine + ciel selon l'heure */
(function(){
  var _wx3=wxHero;
  wxHero=function(t){
    var h=_wx3(t),cap='';
    h=h.replace(/<div class="bcl" onclick="([^"]*)"><small>Plage<\/small><b>([^<]*)<\/b><\/div>/,function(m,oc,nm){cap='<div class="hbn" onclick="'+oc+'"><small>Plage</small>'+nm+'</div>';return ''});
    h=h.replace(/(<button class="bcw[^"]*"[\s\S]*?<\/button>)/,'<div class="wxc hbc">$1<small>Plage</small></div>');
    h=h.replace(/<small>Apr[^<]*-midi<\/small>/,'<small>Apr\u00e8m</small>');
    return '<div class="hxw"><div class="hxr">'+h+'</div>'+cap+'</div>';
  };
  var _hp3=homePage;
  homePage=function(){
    var h=_hp3(),hr=new Date().getHours();
    var mm='';
    h=h.replace(/<div class="hm2">([^<]*)<\/div>/,function(m,t){mm=t;return m});
    var rg='<i class="hrg r1"></i><i class="hrg r2"></i><i class="hrg r3"></i><i class="hrg r4"></i>';
    return h.replace('<div class="hero">','<div class="hero hcal">'+rg+'<div class="hpill">'+mm+'</div>');
  };
  var W='rgba(255,255,255,.5)';
  var css='.hero .hdt{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-rows:1fr auto;column-gap:16px;align-items:end;margin:6px 0 0}'
   +'.hero .hn{grid-column:1;grid-row:1/3;font-size:104px;margin:0;line-height:.9}'
   +'.hero .hd2{grid-column:2;grid-row:1;align-self:end;margin:0;padding:0 0 4px 14px;border-left:1px solid '+W+';font-size:clamp(13px,4.4vw,17px);letter-spacing:.1em;line-height:1.1}'
   +'.hero .hm2{grid-column:2;grid-row:2;align-self:start;margin:0;padding:6px 0 8px 14px;border-left:1px solid '+W+';font-size:10.5px;letter-spacing:.24em;line-height:1.55}'
   +'.hero .hch{margin-top:10px}'
   +'.hxw{margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.4)}'
   +'.hxr{display:flex;justify-content:space-between;align-items:flex-start;gap:6px}'
   +'.hero .hxr .wxrow.hw{display:contents!important}'
   +'.hero .hxr .wxs{width:44px;height:44px}'
   +'.hero .hxr .bcw{width:44px;height:44px}'
   +'.hero .hxr .mky{width:40px;height:40px;margin-top:2px}.hero .hxr .mky i{width:26px;height:26px}'
   +'.hero .hxr .wxc{gap:5px}.hero .hxr .wxc small{font-size:8.5px;letter-spacing:.1em;white-space:nowrap;text-shadow:0 1px 4px rgba(57,57,59,.35)}'
   +'.hbn{margin-top:12px;text-align:center;color:#fff;font-family:"Lora",Georgia,serif;font-style:italic;font-size:17px;cursor:pointer;text-shadow:0 1px 6px rgba(57,57,59,.3)}.hbn small{display:block;font-family:inherit;font-style:normal;font-size:8.5px;letter-spacing:.3em;text-transform:uppercase;margin-bottom:2px;opacity:.9}'
   /* ciel */
   +'.hero.hsky::before{right:-60px;top:-70px;width:220px;height:220px;background:rgba(255,255,255,.14);box-shadow:0 0 0 26px rgba(255,255,255,.07),0 0 0 54px rgba(255,255,255,.04)}'
   +'.hero.hsky::after{left:auto;bottom:auto;right:30px;top:76px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 38% 36%,#f9f8f6,#e8ced1);box-shadow:0 0 0 6px rgba(255,255,255,.18),0 0 26px 9px rgba(232,206,209,.55)}'
   +'.hero.s-dawn{background:linear-gradient(135deg,#c48f97 0%,#d9b0b6 55%,#e8ced1 100%)}'
   +'.hero.s-day{background:linear-gradient(135deg,#ac727e 0%,#d9b0b6 50%,#e8ced1 100%)}'
   +'.hero.s-gold{background:linear-gradient(135deg,#ac727e 0%,#c48f97 55%,#d9b0b6 100%)}'
   +'.hero.s-eve{background:linear-gradient(135deg,#707072 0%,#ac727e 55%,#d9b0b6 100%)}'
   +'.hero.s-night{background:linear-gradient(135deg,#39393b 0%,#707072 55%,#ac727e 100%)}'
   +'.hero.s-eve::after,.hero.s-night::after{background:radial-gradient(circle at 38% 36%,#f9f8f6,#f1f0ee);box-shadow:0 0 0 6px rgba(255,255,255,.14),0 0 24px 8px rgba(243,231,231,.4),-46px 14px 0 -11px #fff,-26px 40px 0 -11.5px #fff,-72px 34px 0 -11.5px rgba(255,255,255,.8)}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
/* Accueil : feuille de calendrier a effeuiller */
(function(){
  var P='.hero.hsky.hpap';
  var hole=function(x){return 'radial-gradient(circle at '+x+' 50%,var(--bg,#f3e7e7) 0 7px,#d9b0b6 7.5px 9px,transparent 9.5px)'};
  var css=P+'{background:linear-gradient(180deg,#f9f8f6,#f9f8f6);color:#525156;border-radius:20px;margin:4px 0 30px;padding:76px 20px 18px;box-shadow:0 7px 0 -3px #f3e7e7,0 14px 0 -6px #e8ced1,0 24px 30px -16px rgba(82,81,86,.55)}'
   +P+'::before{content:"";position:absolute;left:0;right:0;top:0;width:auto;height:58px;border-radius:0;box-shadow:none;background:linear-gradient(135deg,#ac727e,#c48f97 60%,#d9b0b6)}'
   +P+'::after{content:"";position:absolute;left:0;right:0;top:12px;bottom:auto;width:auto;height:34px;border-radius:0;box-shadow:none;background:'+hole('14%')+','+hole('86%')+'}'
   +P+' .pbtn{top:70px;right:16px}'
   +P+' .hg{color:#c48f97;font-size:11px;letter-spacing:.34em}'
   +P+' .hdt{grid-template-rows:auto}'
   +P+' .hn{grid-row:1;background:linear-gradient(160deg,#ac727e,#895a64);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;text-shadow:none;padding-right:.08em}'
   +P+' .hd2{grid-row:1;color:#895a64;border-left:1px solid #e8ced1;text-shadow:none}'
   +P+' .hm2{position:absolute;top:19px;left:0;right:0;z-index:2;text-align:center;border:0;padding:0 0 0 .34em;margin:0;color:#fff;font-size:12px;letter-spacing:.34em;line-height:1;text-shadow:0 1px 4px rgba(57,57,59,.3)}'
   +P+' .hxw{border-top:1.5px dashed #d9b0b6}'
   +P+' .hxr .wxc small{color:#ac727e;text-shadow:none}'
   +P+' .wxs{border:2px solid #fff;box-shadow:0 5px 9px -6px rgba(137,90,100,.6)}'
   +P+' .wxs.e{background:rgba(243,231,231,.55);border:1.5px dashed #d9b0b6;box-shadow:none}'
   +P+' .bcw{border:2px solid #fff;box-shadow:0 5px 9px -6px rgba(137,90,100,.6)}'
   +P+' .mky{border:1.6px dashed #d9b0b6;background:rgba(243,231,231,.55)}'
   +P+' .mky i{background:#d9b0b6}'
   +P+' .mky.on{border:2px solid #fff;background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7 60%,#e8ced1);box-shadow:0 0 0 3px rgba(217,176,182,.5),0 6px 12px -6px rgba(82,81,86,.6)}'
   +P+' .mky.on i{background:linear-gradient(160deg,#895a64,#525156)}'
   +P+' .hbn{color:#895a64;text-shadow:none}'+P+' .hbn small{color:#c48f97}'
   +P+' .hch span{color:#895a64;background:rgba(196,143,151,.18);border-color:#d9b0b6}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
/* Accueil : cadre calendrier a anneaux + capsule (modele utilisateur) */
(function(){
  var H='.hero.hcal',O='#525156';
  var css=H+'::before,'+H+'::after{display:none}'
   +H+'{overflow:visible;border:2px solid '+O+';border-radius:12px;background:linear-gradient(180deg,#ffffff,#f9f8f6);color:#525156;margin:32px 10px 44px 0;padding:34px 20px 40px;box-shadow:inset 0 0 0 4px #f9f8f6,inset 0 0 0 5px #e8ced1,7px 7px 0 0 #f3e7e7,7px 7px 0 2px '+O+',0 22px 26px -16px rgba(82,81,86,.45)}'
   +H+' .hrg{position:absolute;z-index:3;width:11px;height:36px;top:-24px;box-sizing:content-box;border:2px solid '+O+';border-radius:8px;background:linear-gradient(90deg,#e8ced1,#d9b0b6)}'
   +H+' .hrg::after{content:"";position:absolute;left:50%;bottom:-6px;width:16px;height:9px;margin-left:-10px;border:2px solid '+O+';border-radius:50%;background:#e8ced1}'
   +H+' .r1{left:11%;height:40px;top:-28px}'+H+' .r2{left:19%}'+H+' .r3{left:79%}'+H+' .r4{left:87%;height:40px;top:-28px}'
   +H+' .hpill{position:absolute;z-index:3;left:50%;bottom:-26px;transform:translateX(-50%);min-width:64%;box-sizing:border-box;height:44px;display:flex;align-items:center;justify-content:center;border:2px solid '+O+';border-radius:24px;background:linear-gradient(180deg,#f3e7e7,#e8ced1);box-shadow:inset 0 3px 0 rgba(255,255,255,.55),0 5px 0 -1px #d9b0b6,0 5px 0 1px '+O+';color:#525156;font-size:12px;letter-spacing:.32em;text-transform:uppercase;padding:0 18px 0 calc(18px + .32em);white-space:nowrap}'
   +H+' .pbtn{top:22px;right:16px}'
   +H+' .hg{color:#c48f97;font-size:11px;letter-spacing:.34em}'
   +H+' .hdt{grid-template-rows:auto}'
   +H+' .hn{grid-row:1;background:linear-gradient(160deg,#ac727e,#895a64);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;text-shadow:none;padding-right:.08em}'
   +H+' .hd2{grid-row:1;color:#895a64;border-left:1px solid #e8ced1;text-shadow:none}'
   +H+' .hm2{display:none}'
   +H+' .hxw{border-top:1.5px dashed #d9b0b6}'
   +H+' .hxr .wxc small{color:#ac727e;text-shadow:none}'
   +H+' .wxs{border:2px solid #fff;box-shadow:0 5px 9px -6px rgba(137,90,100,.6)}'
   +H+' .wxs.e{background:rgba(243,231,231,.55);border:1.5px dashed #d9b0b6;box-shadow:none}'
   +H+' .bcw{border:2px solid #fff;box-shadow:0 5px 9px -6px rgba(137,90,100,.6)}'
   +H+' .mky{border:1.6px dashed #d9b0b6;background:rgba(243,231,231,.55)}'
   +H+' .mky i{background:#d9b0b6}'
   +H+' .mky.on{border:2px solid #fff;background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7 60%,#e8ced1);box-shadow:0 0 0 3px rgba(217,176,182,.5),0 6px 12px -6px rgba(82,81,86,.6)}'
   +H+' .mky.on i{background:linear-gradient(160deg,#895a64,#525156)}'
   +H+' .hbn{color:#895a64;text-shadow:none}'+H+' .hbn small{color:#c48f97}'
   +H+' .hch span{color:#895a64;background:rgba(196,143,151,.18);border-color:#d9b0b6}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
/* Accueil : finition elegante, ombrages et reliefs */
(function(){
  var H='.hero.hcal',O='#525156';
  var hatch='repeating-linear-gradient(135deg,#e8ced1 0 2.5px,#f3e7e7 2.5px 6px)';
  var css=H+'{background:radial-gradient(120% 55% at 50% 0%,rgba(255,255,255,.95),rgba(255,255,255,0) 62%),radial-gradient(90% 55% at 100% 100%,rgba(232,206,209,.38),rgba(232,206,209,0) 65%),repeating-linear-gradient(0deg,rgba(82,81,86,.016) 0 1px,transparent 1px 3px),linear-gradient(180deg,#ffffff 0%,#f9f8f6 55%,#f3e7e7 100%);'
   +'box-shadow:inset 0 16px 16px -14px rgba(82,81,86,.2),inset 0 0 0 4px #f9f8f6,inset 0 0 0 5px #e8ced1,inset 0 -22px 26px -22px rgba(172,114,126,.35),0 30px 34px -20px rgba(82,81,86,.55),0 10px 14px -10px rgba(82,81,86,.35)}'
   /* feuille rayee derriere */
   +H+'::before{content:"";display:block;position:absolute;left:auto;top:9px;right:-9px;bottom:0;width:9px;height:auto;border-radius:0 7px 0 0;border:2px solid '+O+';border-width:2px 2px 0 0;box-shadow:none;background:'+hatch+'}'
   +H+'::after{content:"";display:block;position:absolute;left:9px;right:-9px;top:auto;bottom:-9px;width:auto;height:9px;border-radius:0 0 7px 7px;border:2px solid '+O+';border-width:0 2px 2px 2px;box-shadow:none;background:'+hatch+'}'
   /* anneaux metal rose */
   +H+' .hrg{background:linear-gradient(90deg,#c48f97 0%,#f3e7e7 32%,#f9f8f6 48%,#e8ced1 72%,#c48f97 100%);box-shadow:3px 6px 7px -1px rgba(57,57,59,.4),inset 0 -6px 6px -3px rgba(137,90,100,.25)}'
   +H+' .hrg::after{background:radial-gradient(circle at 40% 35%,#f9f8f6,#d9b0b6 70%);box-shadow:0 3px 4px rgba(57,57,59,.35)}'
   /* capsule vernie */
   +H+' .hpill{background:linear-gradient(180deg,#f9f8f6 0%,#e8ced1 45%,#d9b0b6 100%);color:#525156;text-shadow:0 1px 0 rgba(255,255,255,.85);box-shadow:inset 0 2px 0 rgba(255,255,255,.9),inset 0 -6px 9px rgba(172,114,126,.3),0 5px 0 -1px #d9b0b6,0 5px 0 1px '+O+',0 14px 16px -7px rgba(82,81,86,.55)}'
   +H+' .hpill::before{content:"";position:absolute;left:14px;right:14px;top:4px;height:13px;border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,.7),rgba(255,255,255,0));pointer-events:none}'
   /* grand chiffre en relief + halo + etincelles */
   +H+' .hdt{position:relative;isolation:isolate}'
   +H+' .hdt::before{content:"";position:absolute;z-index:-1;left:-34px;top:-14px;width:200px;height:150px;background:radial-gradient(closest-side,rgba(232,206,209,.6),rgba(232,206,209,0))}'
   +H+' .hdt::after{content:"\u2726";position:absolute;left:128px;top:4px;font-size:16px;color:#d9b0b6;text-shadow:26px 24px 0 rgba(232,206,209,.95);pointer-events:none}'
   +H+' .hn{filter:drop-shadow(0 8px 10px rgba(137,90,100,.28))}'
   +H+' .hd2{text-shadow:0 1px 0 rgba(255,255,255,.9)}'
   +H+' .hxw{border-top:1.5px dashed #e8ced1}'
   +H+' .wxs,'+H+' .bcw{box-shadow:0 7px 10px -6px rgba(137,90,100,.65),0 0 0 1px rgba(217,176,182,.5)}'
   +H+' .wxs.e{box-shadow:none}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
/* Accueil : post-it sobre et mature (remplace anneaux, capsule, rayures) */
(function(){
  var H='.hero.hcal',T='#39393b',M='#707072',L='rgba(57,57,59,.22)';
  var css=H+'::before,'+H+'::after,'+H+' .hrg,'+H+' .hpill,'+H+' .hdt::before,'+H+' .hdt::after{display:none!important}'
   +H+'{overflow:hidden;border:0;border-radius:3px 3px 7px 7px;transform:rotate(-.7deg);margin:12px 6px 28px;padding:32px 22px 22px;color:'+T+';'
   +'background:linear-gradient(180deg,rgba(255,255,255,.5) 0,rgba(255,255,255,0) 36px),linear-gradient(0deg,rgba(137,90,100,.08) 0,rgba(137,90,100,0) 46px),repeating-linear-gradient(0deg,rgba(57,57,59,.012) 0 1px,transparent 1px 3px),linear-gradient(172deg,#f3e7e7 0%,#e8ced1 100%);'
   +'box-shadow:0 1px 1px rgba(57,57,59,.14),0 18px 22px -12px rgba(57,57,59,.5),10px 22px 20px -16px rgba(57,57,59,.4)}'
   +H+' .pbtn{top:20px;right:16px;color:'+T+';border:1px solid rgba(57,57,59,.2);background:rgba(255,255,255,.55);box-shadow:0 4px 8px -4px rgba(57,57,59,.35)}'
   +H+' .hg{color:'+M+';font-size:10.5px;letter-spacing:.36em}'
   +H+' .hdt{grid-template-rows:1fr auto}'
   +H+' .hn{grid-row:1/3;font-family:"Lora",Georgia,serif;font-style:normal;font-weight:400;font-size:100px;letter-spacing:-.02em;background:none;-webkit-text-fill-color:currentColor;color:'+T+';filter:none;text-shadow:0 1px 0 rgba(255,255,255,.55)}'
   +H+' .hd2{grid-row:1;color:'+T+';font-size:clamp(12px,4vw,15px);letter-spacing:.24em;border-left:1px solid '+L+';text-shadow:none}'
   +H+' .hdc{opacity:.6}'
   +H+' .hm2{display:block;position:static;color:'+M+';font-size:10px;letter-spacing:.28em;border-left:1px solid '+L+';text-align:left;padding:6px 0 8px 14px;text-shadow:none}'
   +H+' .hxw{border-top:1px solid '+L+'}'
   +H+' .hxr .wxc small{color:'+M+';text-shadow:none}'
   +H+' .wxs{border:2px solid rgba(255,255,255,.85);box-shadow:0 5px 8px -6px rgba(57,57,59,.5)}'
   +H+' .wxs.e{background:rgba(255,255,255,.3);border:1.5px dashed rgba(57,57,59,.25);box-shadow:none}'
   +H+' .bcw{border:2px solid rgba(255,255,255,.85);box-shadow:0 5px 8px -6px rgba(57,57,59,.5)}'
   +H+' .mky{border:1.5px dashed rgba(57,57,59,.25);background:rgba(255,255,255,.3)}'
   +H+' .mky i{background:rgba(57,57,59,.35)}'
   +H+' .mky.on{border:2px solid rgba(255,255,255,.9);background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7 65%,#e8ced1);box-shadow:0 5px 8px -5px rgba(57,57,59,.5)}'
   +H+' .mky.on i{background:linear-gradient(160deg,#525156,'+T+')}'
   +H+' .hbn{color:'+T+';text-shadow:none}'+H+' .hbn small{color:'+M+'}'
   +H+' .hch span{color:'+T+';background:rgba(57,57,59,.08);border-color:rgba(57,57,59,.2)}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
/* Accueil : plage a la taille des singes, juste devant eux */
(function(){
  var st=document.createElement('style');
  st.textContent='.hero .hxr .hbc{order:4}.hero .hxr .mkc{display:none}.hero .hxr .bcw{width:40px;height:40px;box-sizing:border-box;margin-top:2px}';
  document.head.appendChild(st);
})();
/* Page du mois : Objectifs du mois dans un post-it */
(function(){
  var _lst=lst;
  lst=function(l,title,dt){
    var h=_lst(l,title,dt);
    if(l!=='goals')return h;
    return '<div class="postit mpi"><i class="tape"></i>'+h+'</div>';
  };
  var st=document.createElement('style');
  st.textContent='.mpi{margin:10px 6px 22px}.q{margin:6px 0;min-height:44px}.mpi section.b{background:none;border:0;box-shadow:none;padding:0;margin:0}.mpi h3.sc{margin:0 0 6px!important;font-size:22px!important;line-height:1.2}.mpi .it{border-bottom-color:rgba(57,57,59,.2)}.mpi .ad input{background:rgba(255,255,255,.55);border-color:rgba(57,57,59,.15)}';
  document.head.appendChild(st);
})();
/* Souvenirs : meme presentation que le calendrier annuel */
(function(){
  var FLR='<svg viewBox="0 0 220 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 9h86M126 9h86" stroke="#d9b0b6" stroke-width="1.1" stroke-linecap="round"/><path d="M110 3l5 6-5 6-5-6z" fill="#d9b0b6"/><circle cx="98" cy="9" r="1.6" fill="#d9b0b6"/><circle cx="122" cy="9" r="1.6" fill="#d9b0b6"/></svg>';
  var _pp=pastPage;
  pastPage=function(){
    var h=_pp();
    h=h.replace(/<div class="hmh">[\s\S]*?<\/p><\/div>/,'<div class="yhd"><span class="yk">Memories</span><h1>'+pastY+'</h1><div class="yfl">'+FLR+'</div></div>');
    var cy0=new Date().getFullYear(),yrs=[];
    for(var yy=2022;yy<=Math.max(2025,cy0);yy++)yrs.push(yy);
    h=h.replace(/<div class="ypl">[\s\S]*?<\/div>/,'<div class="ypl">'+yrs.map(function(y){return '<button class="'+(pastY===y?'on':'')+'" onclick="setPY('+y+')">'+y+'</button>'}).join('')+'</div>');
    h=h.replace('Vision board</button></div>','Vision board</button><button onclick="ovOpen(\'ystat\')">Statistiques</button></div>');
    return '<div class="yv pyv">'+h+'</div>';
  };
  var css='.pyv .ypl{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin:6px 0 12px}'
   +'.pyv .ypl button{border-radius:999px;border:1px solid #f3e7e7;background:rgba(255,255,255,.7);color:#895a64;font-family:"Nunito",sans-serif;font-weight:600;font-size:13px;letter-spacing:.12em;padding:7px 16px;cursor:pointer}'
   +'.pyv .ypl button.on{background:linear-gradient(135deg,#ac727e,#895a64);color:#fff;border-color:transparent;box-shadow:0 8px 14px -8px rgba(137,90,100,.7)}'
   +'.pyv .seg{display:flex;justify-content:center;gap:6px;margin:0 0 10px}'
   +'.pyv .seg button{border-radius:999px;border:1px solid #f3e7e7;background:rgba(255,255,255,.6);color:#895a64;font-family:"Nunito",sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:8px 16px;cursor:pointer}'
   +'.pyv .seg button.on{background:#525156;color:#fff;border-color:transparent}'
   +'.pyv .sub{text-align:center;color:#ac727e;font-size:12px;letter-spacing:.04em}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
/* Icones d'exercices : plus pales quand elles ne sont pas cochees */
(function(){
  var st=document.createElement('style');
  st.textContent='.actb:not(.on) .actc{background:rgba(255,255,255,.7);border-color:#e8ced1;opacity:.72;filter:grayscale(.3)}.actb:not(.on) em{opacity:.8}.ics .ic:not(.on) span{background:rgba(255,255,255,.7);border-color:#e8ced1;opacity:.72;filter:grayscale(.3)}';
  document.head.appendChild(st);
})();
/* Page du jour : icone Cristaux (coin droit) - la page gabarit viendra plus tard */
(function(){
  var IMG='img-crystal.webp';
  window.CRYSTAL_IMG=IMG;
  var _dpc=dayPage;
  dayPage=function(){
    var h=_dpc();
    if(h.indexOf('class="mhero')<0)return h;
    var btn='<button class="dcr" aria-label="Cristaux" onclick="ovOpen(\'crystal\')"><img src="'+IMG+'" alt=""></button>';
    return h.replace(/<div class="mhero (has|nop)">/,function(m){return m+btn});
  };
  var _ov=ovUI;
  ovUI=function(){
    if(OV==='crystal'){
      var el=document.getElementById('ovl');
      if(el){
        el.innerHTML='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Cristaux</span><button onclick="ovClose()">\u2715</button></div>'
          +'<div style="text-align:center;padding:8px 0 6px"><img src="'+IMG+'" alt="" style="width:150px;height:150px;border-radius:50%;box-shadow:0 12px 20px -12px rgba(82,81,86,.6)"><p class="sm" style="margin-top:14px">Ta page cristaux arrivera bient\u00f4t.</p></div></div></div>';
        return;
      }
    }
    return _ov();
  };
  var st=document.createElement('style');
  st.textContent='.dcr{position:absolute;top:14px;right:60px;z-index:6;width:38px;height:38px;border-radius:50%;border:2px solid rgba(255,255,255,.95);padding:0;background:#f3e7e7;overflow:hidden;cursor:pointer;box-shadow:0 4px 10px -4px rgba(0,0,0,.35);transition:transform .15s}.dcr:active{transform:scale(.92)}.dcr img{width:100%;height:100%;display:block;border-radius:50%;object-fit:cover}';
  document.head.appendChild(st);
})();
