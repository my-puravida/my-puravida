var MONTHS=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
var COLORS=["#e8ced1","#e8ced1","#f3e7e7","#d4d3d1","#e8ced1","#e8ced1","#e8ced1","#d4d3d1","#e8ced1","#e8ced1","#e8ced1","#d4d3d1"];
var DAYS=["D","L","M","M","J","V","S"];
var TABS=["Accueil","Vision board","2026","2027","Passé"];
var cur=0,mo=null,cd,cy,cm,wk=null,wd,cw,dk=null,dy,dday,wtab='fit',wsub=false,ws=false;

function monthHTML(y,m){
  var first=new Date(y,m,1).getDay();
  var imp={};(load(y,m).dates||[]).forEach(function(o){var k=parseInt(o.d,10);if(k){imp[k]=imp[k]||{};imp[k][o.k||'other']=1}});
  var n=new Date(y,m+1,0).getDate();
  var prev=new Date(y,m,0).getDate();
  var h='<div class="m"'+(isPast()?'':' onclick="openM('+m+')"')+'><h3>'+MONTHS[m]+'</h3><table><tr>';
  DAYS.forEach(function(d){h+='<th style="background:'+COLORS[m]+'">'+d+'</th>'});
  h+='</tr>';
  var d=1,rows=0,tdy=new Date(),curR=(y===tdy.getFullYear()&&m===tdy.getMonth())?Math.floor((first+tdy.getDate()-1)/7):-1;
  for(var r=0;r<6;r++){
    h+='<tr'+(r===curR?' class="cwk"':'')+'>';
    for(var c=0;c<7;c++){
      var i=r*7+c;
      if(i<first){h+='<td class="o">'+(prev-first+i+1)+'</td>'}
      else if(d<=n){h+='<td'+tdc(imp[d],y,m,d)+(isPast()?' onclick="openD('+y+','+m+','+d+')"':'')+'>'+tdg(imp[d],d,y,m)+'</td>';d++}
      else{h+='<td></td>'}
    }
    h+='</tr>';
  }
  return h+'</table></div>';
}

function render(){
  document.querySelector('.hd').style.display=(cur>1&&mo===null&&wk===null&&dk===null&&ya===null)?'':'none';
  var t=document.getElementById('tabs');
  t.innerHTML='';
  TABS.forEach(function(name,i){
    var b=document.createElement('button');
    if(name==='Passé'){b.innerHTML=PASTSVG;b.setAttribute('aria-label','Années précédentes')}else b.textContent=name;
    if(i===cur)b.className='on';
    b.onclick=function(){cur=i;mo=null;wk=null;dk=null;ws=false;ya=null;blOn=false;render();window.scrollTo(0,0)};
    t.appendChild(b);
  });
  var v=document.getElementById('view');
  if((cur>1||dkH)&&dk!==null){v.innerHTML='<div class="dpg'+(dsl>0?' sr':(dsl<0?' sl':''))+'">'+dayPage()+'</div>';dsl=0;return}
  if(cur>1&&wk!==null){v.innerHTML=weekPage();return}
  if(cur>1&&mo!==null&&ws){v.innerHTML=statPage();return}
  if(cur>1&&mo!==null){v.innerHTML=monthPage();return}
  if(cur>1){
    var y=curYear();if(isPast()){v.innerHTML=pastPage();return}if(ya!==null){v.innerHTML=yearStat(y);return}var h=cartBtn()+yearHead(y);
    h+=yearBody(y);
    v.innerHTML=h+'</div>';
  }else{
    v.innerHTML=(cur===0?homePage():(blOn?bucketPage():(vbUse('ag-vb'),visionPage())));
  }
}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function load(y,m){try{var s=localStorage.getItem('ag-'+y+'-'+m);if(s)return JSON.parse(s)}catch(e){}return{q:'',goals:[],dates:[],books:[],shows:[],hl:[]}}
function upd(){try{localStorage.setItem('ag-'+cy+'-'+cm,JSON.stringify(cd))}catch(e){}}
function openM(m){mo=m;ws=false;cy=curYear();cm=m;cd=load(cy,m);render();window.scrollTo(0,0)}
function closeM(){mo=null;render();window.scrollTo(0,0)}
function tgl(l,i){cd[l][i].x=!cd[l][i].x;upd();render()}
function del(l,i){cd[l].splice(i,1);upd();render()}
function add(l){var t=document.getElementById('t-'+l),d=document.getElementById('d-'+l);if(!t.value.trim())return;var o={t:t.value.trim(),x:false};if(d)o.d=d.value.trim();cd[l].push(o);if(d)cd[l].sort(function(a,b){return(parseInt(a.d)||0)-(parseInt(b.d)||0)});upd();render()}
function tgd(n){var i=cd.hl.indexOf(n);if(i<0)cd.hl.push(n);else cd.hl.splice(i,1);upd();render()}
function sq(el){cd.q=el.innerText.trim();upd()}
function lst(l,title,dt){
  var h='<section class="b"><h3 class="sc">'+title+'</h3>';
  cd[l].forEach(function(it,i){
    h+='<div class="it'+(it.x?' x':'')+'">'+(dt?'<b class="dd">'+esc(it.d||'')+'</b>':'<button class="ck" onclick="tgl(\''+l+'\','+i+')">'+(it.x?'×':'○')+'</button>')+'<span>'+esc(it.t)+'</span><button class="rm" onclick="del(\''+l+'\','+i+')">✕</button></div>';
  });
  return h+'<div class="ad">'+(dt?'<input id="d-'+l+'" class="dn" inputmode="numeric" placeholder="Jour">':'')+'<input id="t-'+l+'" placeholder="Ajouter…"><button onclick="add(\''+l+'\')">+</button></div></section>';
}
function isImp(d){return (cd.dates||[]).some(function(o){return parseInt(o.d,10)===d})}
function monthPage(){
  var f=new Date(cy,cm,1).getDay(),n=new Date(cy,cm+1,0).getDate(),tot=Math.ceil((f+n)/7)*7;
  var h='<button class="back" onclick="closeM()">← '+cy+'</button><h2 class="mt">'+MONTHS[cm].toLowerCase()+' <small>'+cy+'</small></h2>';
  h+='<button class="cartc" onclick="goS()" aria-label="Statistiques">'+STSVG+'</button>';
  h+='<table class="cal"><tr><th></th>';
  DAYS.forEach(function(d){h+='<th style="border-bottom:3px solid '+COLORS[cm]+'">'+d+'</th>'});
  h+='</tr>';
  for(var i=0;i<tot;i++){
    if(i%7===0)h+='<tr'+(isCurWeek(i/7)?' class="cwk"':'')+'><td><button class="wk" onclick="openW('+(i/7)+')" title="Semaine">'+wkHeart(i/7)+'</button></td>';
    var d=i-f+1;
    if(d<1||d>n)h+='<td></td>';
    else h+='<td><button'+bcls(cd.dates,d)+' onclick="openD('+cy+','+cm+','+d+')"'+''+'>'+dg(cd.dates,d)+(hasD(cy,cm,d)?'<i class="dot"></i>':'')+'</button></td>';
    if(i%7===6)h+='</tr>';
  }
  h+='</table>'+legend();
  h+='<div class="q" contenteditable="true" onblur="sq(this)">'+esc(cd.q)+'</div>';
  h+=lst('goals','Objectifs du mois',false)+datesSec();
  return h;
}
var DN=["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
function iso(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function openW(r){var f=new Date(cy,cm,1).getDay();wd=new Date(cy,cm,1-f+r*7);wk=iso(wd);wtab='fit';wsub=false;shopHome=false;wst=false;try{var s=localStorage.getItem('agw-'+wk);cw=s?JSON.parse(s):null}catch(e){cw=null}if(!cw)cw={t:{},c:{}};render();window.scrollTo(0,0)}
function closeW(){wk=null;render();window.scrollTo(0,0)}
function wsave(){try{localStorage.setItem('agw-'+wk,JSON.stringify(cw))}catch(e){}}
function wt(id,v){cw.t[id]=v;wsave();wsum()}
function wc(id,el){cw.c[id]=!cw.c[id];el.classList.toggle('on');wsave();wsum()}
function wi(id){return '<input class="wi" value="'+esc(cw.t[id]||'')+'" oninput="wt(\''+id+'\',this.value)">'}
function wb(id,sh){return '<button class="wc '+sh+(cw.c[id]?' on':'')+'" onclick="wc(\''+id+'\',this)"></button>'}
function wl(id,sh){return '<div class="wl">'+wb(id,sh)+wi(id)+'</div>'}
function bx(t,inner){return '<section class="bx"><h4>'+t+'</h4>'+inner+'</section>'}
function rows(p,n,sh){var s='';for(var k=0;k<n;k++)s+=wl(p+k,sh);return s}
function bkW(){wsub=false;render();window.scrollTo(0,0)}
function goF(){wsub=true;wtab='fit';render();window.scrollTo(0,0)}
function icons(i){
  var T=[['fx','🏋️','Entraînement'],['wx','🚶‍♀️','Marche'],['yx','🧘‍♀️','Yoga'],['mx','🪷','Méditation'],['sx','🇪🇸','Espagnol']];
  return '<div class="ics">'+T.map(function(x){return '<button class="ic'+(cw.c[x[0]+i]?' on':'')+'" onclick="wc(\''+x[0]+i+'\',this)"><span>'+x[1]+'</span>'+x[2]+'</button>'}).join('')+'</div>';
}
function sad(){var t=document.getElementById('si');if(!t||!t.value.trim())return;cw.s=cw.s||[];cw.s.push({t:t.value.trim(),x:false});wsave();render()}
function stg(i){cw.s[i].x=!cw.s[i].x;wsave();render()}
function sdl(i){cw.s.splice(i,1);wsave();render()}
function weekShop(){
  cw.s=cw.s||[];
  var n=cw.s.filter(function(o){return o.x}).length;
  var h=whead('Shopping')+'<p class="sm">'+n+' / '+cw.s.length+' articles</p>';
  h+='<section class="bx"><h4>Liste de courses</h4>';
  cw.s.forEach(function(o,i){h+='<div class="it'+(o.x?' x':'')+'"><button class="ck" onclick="stg('+i+')">'+(o.x?'×':'○')+'</button><span>'+esc(o.t)+'</span><button class="rm" onclick="sdl('+i+')">✕</button></div>'});
  h+='<div class="ad"><input id="si" placeholder="Ajouter un article…" onkeydown="if(event.key===\'Enter\')sad()"><button onclick="sad()">+</button></div></section>';
  var r='';
  gi().forEach(function(o,i){r+='<div class="it"><span>♡ '+esc(o)+'</span><button class="rm" onclick="mdl('+i+')">✕</button></div>'});
  r+='<div class="ad"><input id="mi2" placeholder="Ajouter une idée…" onkeydown="if(event.key===\'Enter\')mad()"><button onclick="mad()">+</button></div>';
  return h+bx('Idées repas',r);
}
function gi(){try{return JSON.parse(localStorage.getItem('ag-ideas'))||[]}catch(e){return[]}}
function gs(a){try{localStorage.setItem('ag-ideas',JSON.stringify(a))}catch(e){}}
function mad(){var t=document.getElementById('mi2');if(!t||!t.value.trim())return;var a=gi();a.push(t.value.trim());gs(a);render()}
function mdl(i){var a=gi();a.splice(i,1);gs(a);render()}
var ACT=[['fx','🏋️','Entraînement'],['wx','🚶‍♀️','Marche'],['yx','🧘‍♀️','Yoga'],['mx','🪷','Méditation'],['sx','🇪🇸','Espagnol']];
function goS(){ws=true;render();window.scrollTo(0,0)}
function bkS(){ws=false;render();window.scrollTo(0,0)}
function wdata(k,c){if(!(k in c)){try{var s=localStorage.getItem('agw-'+k);c[k]=s?JSON.parse(s):null}catch(e){c[k]=null}}return c[k]}
function isDone(a,d,c){var sun=new Date(d.getFullYear(),d.getMonth(),d.getDate()-d.getDay());var w=wdata(iso(sun),c);return !!(w&&w.c&&w.c[a+d.getDay()])}
function statPage(){
  var n=new Date(cy,cm+1,0).getDate(),cache={};
  var h='<button class="back" onclick="bkS()">← '+MONTHS[cm]+'</button><h2 class="mt">Statistiques <small>'+MONTHS[cm].toLowerCase()+' '+cy+'</small></h2>';
  ACT.forEach(function(a){
    var cnt=0,run=0,best=0,dots='';
    for(var d=1;d<=n;d++){
      var ok=isDone(a[0],new Date(cy,cm,d),cache);
      if(ok){cnt++;run++;if(run>best)best=run}else run=0;
      dots+='<i class="sd'+(ok?' on':'')+'"></i>';
    }
    var p=Math.round(cnt*100/n);
    h+='<section class="bx"><div class="sh"><span class="si">'+a[1]+'</span><b>'+a[2]+'</b><span class="sc2">'+cnt+' / '+n+' jours</span></div><div class="pb"><div style="width:'+p+'%"></div></div><div class="sdw">'+dots+'</div><p class="sg">'+p+' % du mois · meilleure série : '+best+' jour(s)</p></section>';
  });
  return h+'<p class="sub">Les coches viennent du planificateur de chaque semaine.</p>';
}
var vm='g2',ym=0;
function setVM(k){vm=k;try{localStorage.setItem('ag-vm',k)}catch(e){}render()}
function yn(d){ym=(ym+12+d)%12;render()}
function yearHead(y){
  var M=[['g2','2 col.'],['g3','3 col.'],['g1','1 col.'],['one','Un mois'],['row','Lignes']];
  return '<h1>'+y+'</h1><div class="dv"><i></i></div><div class="vmb">'+M.map(function(x){return '<button class="'+(vm===x[0]?'on':'')+'" onclick="setVM(\''+x[0]+'\')">'+x[1]+'</button>'}).join('')+'</div><div class="yv">';
}
function rowView(y){
  var h='<div class="rwrap"><table class="rt"><tr><th></th>';
  for(var d=1;d<=31;d++)h+='<th>'+d+'</th>';
  h+='</tr>';
  for(var m=0;m<12;m++){
    var n=new Date(y,m+1,0).getDate(),imp={};
    (load(y,m).dates||[]).forEach(function(o){var k=parseInt(o.d,10);if(k)imp[k]=1});
    h+='<tr><th class="rm1" onclick="openM('+m+')" style="background:'+COLORS[m]+'">'+MONTHS[m].slice(0,3)+'</th>';
    for(var e=1;e<=31;e++){
      if(e>n){h+='<td class="e"></td>';continue}
      var w=new Date(y,m,e).getDay();
      h+='<td class="'+((w===0||w===6)?'we ':'')+(imp[e]?'imp':'')+'" onclick="openD('+y+','+m+','+e+')">'+DAYS[w]+'</td>';
    }
    h+='</tr>';
  }
  return h+'</table></div>';
}
function yearBody(y){
  if(vm==='row')return rowView(y);
  if(vm==='one')return '<div class="onec"><button onclick="yn(-1)">‹</button><div class="grid g1" style="flex:1">'+monthHTML(y,ym)+'</div><button onclick="yn(1)">›</button></div>';
  var h='<div class="grid '+vm+'">';
  for(var m=0;m<12;m++)h+=monthHTML(y,m);
  return h+'</div>';
}
var FONTS=[['Manuscrit',"'Patrick Hand','Segoe Print',cursive",400,13],['Classique',"'Lora',Georgia,serif",500,12],['Moderne',"'Montserrat',sans-serif",500,11],['Arrondi',"'Nunito',sans-serif",600,12],['Machine',"'Space Mono','Courier New',monospace",400,10]];
var fi=0;try{fi=parseInt(localStorage.getItem('ag-fi'),10)||0}catch(e){}
function setFI(i){fi=i;try{localStorage.setItem('ag-fi',i)}catch(e){}render()}
function yearHead(y){
  var F=FONTS[fi]||FONTS[0];
  return '<h1>'+y+'</h1><div class="dv"><i></i></div><div class="vmb">'+FONTS.map(function(f,i){return '<button class="'+(fi===i?'on':'')+'" onclick="setFI('+i+')">'+f[0]+'</button>'}).join('')+'</div><div class="yv" style="--nf:'+F[1]+';--nw:'+F[2]+';--ns:'+F[3]+'px">';
}
var ya=null;
function openY(k){ya=k;render();window.scrollTo(0,0)}
function closeY(){ya=null;render();window.scrollTo(0,0)}
function yearBody(y){
  var h='<div class="ytb">'+ACT.map(function(a){return '<button onclick="openY(\''+a[0]+'\')"><span>'+a[1]+'</span>'+a[2]+'</button>'}).join('')+'</div><div class="grid '+vm+'">';
  for(var m=0;m<12;m++)h+=monthHTML(y,m);
  return h+'</div>';
}
function yearStat(y){
  var a=ACT.filter(function(x){return x[0]===ya})[0],cache={},tot=0,run=0,best=0,cnt=[];
  for(var m=0;m<12;m++){
    var n=new Date(y,m+1,0).getDate(),c=0;
    for(var d=1;d<=n;d++){if(isDone(a[0],new Date(y,m,d),cache)){c++;tot++;run++;if(run>best)best=run}else run=0}
    cnt.push([c,n]);
  }
  var s='<button class="back" onclick="closeY()">← '+y+'</button><h2 class="mt">'+a[1]+' <small>'+a[2]+' · '+y+'</small></h2><div class="dv"><i></i></div><p class="sm">'+tot+' jour(s) · meilleure série : '+best+' jour(s)</p>';
  cnt.forEach(function(o,m){var p=Math.round(o[0]*100/o[1]);s+='<div class="yr"><b>'+MONTHS[m].slice(0,3)+'</b><div class="pb"><div style="width:'+p+'%"></div></div><span>'+o[0]+'/'+o[1]+'</span></div>'});
  return s;
}
var shopHome=false;
var CARTSVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 3.5h2.4l2.1 10.6c.15.8.8 1.4 1.6 1.4h8.6c.8 0 1.5-.55 1.65-1.3L20 7.5H5.7"/><circle cx="9.2" cy="19.2" r="1.3"/><circle cx="16.8" cy="19.2" r="1.3"/></svg>';
function cartBtn(){return '<button class="cartc" onclick="goShopHome()" aria-label="Shopping">'+CARTSVG+'</button>'}
function goShopHome(){
  var t=new Date(),s=new Date(t.getFullYear(),t.getMonth(),t.getDate()-t.getDay());
  wd=s;wk=iso(s);cy=s.getFullYear();cm=s.getMonth();
  try{var q=localStorage.getItem('agw-'+wk);cw=q?JSON.parse(q):null}catch(e){cw=null}
  if(!cw)cw={t:{},c:{}};
  wsub=true;wtab='fit';shopHome=true;wst=false;render();window.scrollTo(0,0);
}
function bkW(){wsub=false;if(shopHome){wk=null;shopHome=false}render();window.scrollTo(0,0)}
var stt='groc';
function sst(k){stt=k;render()}
function shopTabs(){
  var T=[['meal','🍽️','Repas'],['groc','🥦','Courses'],['gen','🛍️','Shopping']];
  return '<div class="stabs">'+T.map(function(x){return '<button class="'+(stt===x[0]?'on':'')+'" onclick="sst(\''+x[0]+'\')"><span>'+x[1]+'</span>'+x[2]+'</button>'}).join('')+'</div>';
}
function gl(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
function gsv(k,a){try{localStorage.setItem(k,JSON.stringify(a))}catch(e){}}
function gadd(){var t=document.getElementById('gi2');if(!t||!t.value.trim())return;var a=gl('ag-gen');a.push({t:t.value.trim(),x:false});gsv('ag-gen',a);render()}
function gtg(i){var a=gl('ag-gen');a[i].x=!a[i].x;gsv('ag-gen',a);render()}
function gdl(i){var a=gl('ag-gen');a.splice(i,1);gsv('ag-gen',a);render()}
function weekShop(){
  cw.s=cw.s||[];
  var h=whead('Shopping')+shopTabs(),r='';
  if(stt==='meal'){return h+mealPage();
    gi().forEach(function(o,i){r+='<div class="it"><span>♡ '+esc(o)+'</span><button class="rm" onclick="mdl('+i+')">✕</button></div>'});
    r+='<div class="ad"><input id="mi2" placeholder="Ajouter une idée…" onkeydown="if(event.key===\'Enter\')mad()"><button onclick="mad()">+</button></div>';
    return h+bx('🍽️ Idées repas',r);
  }
  if(stt==='gen'){
    gl('ag-gen').forEach(function(o,i){r+='<div class="it'+(o.x?' x':'')+'"><button class="ck" onclick="gtg('+i+')">'+(o.x?'×':'○')+'</button><span>'+esc(o.t)+'</span><button class="rm" onclick="gdl('+i+')">✕</button></div>'});
    r+='<div class="ad"><input id="gi2" placeholder="Vêtements, maison, cadeaux…" onkeydown="if(event.key===\'Enter\')gadd()"><button onclick="gadd()">+</button></div>';
    return h+bx('🛍️ Shopping général',r);
  }
  var n=cw.s.filter(function(o){return o.x}).length;
  cw.s.forEach(function(o,i){r+='<div class="it'+(o.x?' x':'')+'"><button class="ck" onclick="stg('+i+')">'+(o.x?'×':'○')+'</button><span>'+esc(o.t)+'</span><button class="rm" onclick="sdl('+i+')">✕</button></div>'});
  r+='<div class="ad"><input id="si" placeholder="Ajouter un article…" onkeydown="if(event.key===\'Enter\')sad()"><button onclick="sad()">+</button></div>';
  return h+'<p class="sm">'+n+' / '+cw.s.length+' articles</p>'+bx('🥦 Liste de courses',r);
}
var showIdeas=false;
var BULB='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>';
function tgI(){showIdeas=!showIdeas;render()}
function useIdea(i){var a=gi();if(!a[i])return;cw.r=cw.r||[];cw.r.push({t:a[i],x:false});wsave();render()}
function radd(){var t=document.getElementById('ri');if(!t||!t.value.trim())return;cw.r=cw.r||[];cw.r.push({t:t.value.trim(),x:false});wsave();render()}
function rtg(i){cw.r[i].x=!cw.r[i].x;wsave();render()}
function rdl(i){cw.r.splice(i,1);wsave();render()}
function mealPage(){
  cw.r=cw.r||[];
  var h='<section class="bx"><div class="bxh"><h4>🍽️ Repas</h4><button class="ideab'+(showIdeas?' on':'')+'" onclick="tgI()" aria-label="Idées de repas">'+BULB+'</button></div>';
  if(showIdeas){
    h+='<div class="ideas"><p class="sub">Touche un repas pour l’ajouter à la semaine</p>';
    gi().forEach(function(o,i){h+='<div class="it idea" onclick="useIdea('+i+')"><span>♡ '+esc(o)+'</span><b class="addm">+</b><button class="rm" onclick="event.stopPropagation();mdl('+i+')">✕</button></div>'});
    h+='<div class="ad"><input id="mi2" placeholder="Nouvelle idée…" onkeydown="if(event.key===\'Enter\')mad()"><button onclick="mad()">+</button></div></div>';
  }
  cw.r.forEach(function(o,i){h+='<div class="it'+(o.x?' x':'')+'"><button class="ck" onclick="rtg('+i+')">'+(o.x?'×':'○')+'</button><span>'+esc(o.t)+'</span><button class="rm" onclick="rdl('+i+')">✕</button></div>'});
  h+='<div class="ad"><input id="ri" placeholder="Ajouter un repas…" onkeydown="if(event.key===\'Enter\')radd()"><button onclick="radd()">+</button></div></section>';
  return h;
}
var mday=-1,mman=false;
function sday(i){mday=i;render()}
function tgM(){mman=!mman;render()}
function addMeal(t){cw.r=cw.r||[];cw.r.push({t:t,x:false,d:mday});wsave()}
function useIdea(i){var a=gi();if(!a[i])return;addMeal(a[i]);render()}
function radd(){var t=document.getElementById('ri');if(!t||!t.value.trim())return;addMeal(t.value.trim());render()}
function mealPage(){
  cw.r=cw.r||[];
  var h='<section class="bx"><div class="bxh"><h4>🍽️ Repas</h4><button class="ideab'+(showIdeas?' on':'')+'" onclick="tgI()" aria-label="Idées de repas">'+BULB+'</button></div>';
  h+='<p class="sub lft">Ajouter à :</p><div class="dsel"><button class="'+(mday===-1?'on':'')+'" onclick="sday(-1)">Semaine</button>';
  for(var i=0;i<7;i++){var d=new Date(wd.getFullYear(),wd.getMonth(),wd.getDate()+i);h+='<button class="'+(mday===i?'on':'')+'" onclick="sday('+i+')"><small>'+DN[i]+'</small>'+d.getDate()+'</button>'}
  h+='</div>';
  if(showIdeas){
    var ideas=gi();
    h+='<div class="ideas"><div class="ih"><span>Touche un repas pour l’ajouter</span><button onclick="tgM()">'+(mman?'Terminé':'Modifier')+'</button></div><div class="chips">';
    ideas.forEach(function(o,i){
      var c=cw.r.filter(function(m){return m.t===o}).length;
      h+='<span class="chip" onclick="'+(mman?'':'useIdea('+i+')')+'">'+esc(o)+(c?'<b>'+c+'</b>':'')+(mman?'<i onclick="event.stopPropagation();mdl('+i+')">✕</i>':'')+'</span>';
    });
    if(!ideas.length)h+='<span class="sub">Aucune idée pour le moment</span>';
    h+='</div><div class="ad"><input id="mi2" placeholder="Nouvelle idée…" onkeydown="if(event.key===\'Enter\')mad()"><button onclick="mad()">+</button></div></div>';
  }
  var any=false;
  [-1,0,1,2,3,4,5,6].forEach(function(g){
    var rows='';
    cw.r.forEach(function(m,i){
      var dd=(m.d===undefined?-1:m.d);
      if(dd!==g)return;
      rows+='<div class="it'+(m.x?' x':'')+'"><button class="ck" onclick="rtg('+i+')">'+(m.x?'×':'○')+'</button><span>'+esc(m.t)+'</span><button class="rm" onclick="rdl('+i+')">✕</button></div>';
    });
    if(!rows)return;
    any=true;
    var lab=g===-1?'Semaine':DN[g]+' '+new Date(wd.getFullYear(),wd.getMonth(),wd.getDate()+g).getDate();
    h+='<div class="mg"><div class="mgl">'+lab+'</div>'+rows+'</div>';
  });
  if(!any)h+='<p class="sub">Aucun repas prévu. Touche l’ampoule pour choisir parmi tes idées.</p>';
  h+='<div class="ad"><input id="ri" placeholder="Ajouter un repas…" onkeydown="if(event.key===\'Enter\')radd()"><button onclick="radd()">+</button></div></section>';
  return h;
}
var HGSVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12M7 3v3.5c0 1.6 1 3 2.6 4L12 12l2.4-1.5c1.6-1 2.6-2.4 2.6-4V3M7 21v-3.5c0-1.6 1-3 2.6-4L12 12l2.4 1.5c1.6 1 2.6 2.4 2.6 4V21"/></svg>';
var TM={dur:1500,rem:1500,run:false,end:0,open:false,done:false},tmIv=null;
function tmFmt(s){s=Math.max(0,Math.ceil(s));return ('0'+Math.floor(s/60)).slice(-2)+':'+('0'+(s%60)).slice(-2)}
function tmOpen(){TM.open=true;tmUI()}
function tmClose(){TM.open=false;tmUI()}
function tmSet(m){if(TM.run)return;TM.dur=TM.rem=m*60;TM.done=false;tmUI()}
function tmSlide(v){if(TM.run)return;TM.dur=TM.rem=v*60;TM.done=false;var t=document.getElementById('tmt');if(t)t.textContent=tmFmt(TM.rem)}
function tmToggle(){
  if(TM.run){TM.rem=(TM.end-Date.now())/1000;TM.run=false;clearInterval(tmIv)}
  else{if(TM.rem<=0||TM.done)TM.rem=TM.dur;TM.done=false;TM.run=true;TM.end=Date.now()+TM.rem*1000;clearInterval(tmIv);tmIv=setInterval(tmTick,250)}
  tmUI();
}
function tmReset(){TM.run=false;clearInterval(tmIv);TM.rem=TM.dur;TM.done=false;tmUI()}
function tmBeep(){
  try{var C=window.AudioContext||window.webkitAudioContext,a=new C();[0,0.35,0.7].forEach(function(d){var o=a.createOscillator(),g=a.createGain();o.frequency.value=660;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(0.2,a.currentTime+d);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d+0.3);o.start(a.currentTime+d);o.stop(a.currentTime+d+0.32)})}catch(e){}
  try{if(navigator.vibrate)navigator.vibrate([300,150,300])}catch(e){}
}
function tmTick(){
  var r=(TM.end-Date.now())/1000;
  if(r<=0){TM.rem=0;TM.run=false;TM.done=true;clearInterval(tmIv);TM.open=true;tmBeep();tmUI();return}
  TM.rem=r;
  var t=document.getElementById('tmt'),b=document.getElementById('tmb'),p=document.getElementById('tmpill');
  if(t)t.textContent=tmFmt(r);if(b)b.style.width=Math.round(100-r*100/TM.dur)+'%';if(p)p.textContent=tmFmt(r);
}
function tmUI(){
  var el=document.getElementById('tmr');if(!el)return;
  var h='',paused=!TM.run&&TM.rem<TM.dur&&TM.rem>0;
  if(TM.open){
    var pct=TM.dur?Math.round(100-TM.rem*100/TM.dur):0;
    h+='<div class="tmo" onclick="tmClose()"><div class="tmc" onclick="event.stopPropagation()"><div class="tmx"><span>Minuteur de focus</span><button onclick="tmClose()">✕</button></div><div class="tmt" id="tmt">'+tmFmt(TM.rem)+'</div>';
    if(TM.done)h+='<p class="tmd">Bravo ! Session terminée ♡</p>';
    h+='<div class="tmbar"><div id="tmb" style="width:'+pct+'%"></div></div>';
    if(!TM.run){
      h+='<div class="tmp">'+[1,2,5,10,15,20,25,30].map(function(m){return '<button class="'+(TM.dur===m*60?'on':'')+'" onclick="tmSet('+m+')">'+m+' min</button>'}).join('')+'</div>';
      h+='<input type="range" min="1" max="30" value="'+Math.round(TM.dur/60)+'" oninput="tmSlide(this.value)" onchange="tmUI()">';
    }
    h+='<div class="tma"><button class="go" onclick="tmToggle()">'+(TM.run?'Pause':(paused?'Reprendre':'Démarrer'))+'</button><button onclick="tmReset()">Réinitialiser</button></div></div></div>';
  }else if(TM.run||paused){
    h='<button class="tmpill" onclick="tmOpen()">'+HGSVG+'<span id="tmpill">'+tmFmt(TM.rem)+'</span></button>';
  }
  el.innerHTML=h;
}
function mealPage(){
  cw.r=cw.r||[];
  var h='<section class="bx"><div class="bxh"><h4>🍽️ Repas</h4><button class="ideab'+(showIdeas?' on':'')+'" onclick="tgI()" aria-label="Idées de repas">'+BULB+'</button></div>';
  if(showIdeas){
    var ideas=gi();
    h+='<div class="ideas"><div class="ih"><span>Touche un repas pour l’ajouter</span><button onclick="tgM()">'+(mman?'Terminé':'Modifier')+'</button></div><div class="chips">';
    ideas.forEach(function(o,i){
      var c=cw.r.filter(function(m){return m.t===o}).length;
      h+='<span class="chip" onclick="'+(mman?'':'useIdea('+i+')')+'">'+esc(o)+(c?'<b>'+c+'</b>':'')+(mman?'<i onclick="event.stopPropagation();mdl('+i+')">✕</i>':'')+'</span>';
    });
    if(!ideas.length)h+='<span class="sub">Aucune idée pour le moment</span>';
    h+='</div><div class="ad"><input id="mi2" placeholder="Nouvelle idée…" onkeydown="if(event.key===\'Enter\')mad()"><button onclick="mad()">+</button></div></div>';
  }
  cw.r.forEach(function(m,i){
    h+='<div class="it'+(m.x?' x':'')+'"><button class="ck" onclick="rtg('+i+')">'+(m.x?'×':'○')+'</button><span>'+esc(m.t)+'</span><button class="rm" onclick="rdl('+i+')">✕</button></div>';
  });
  if(!cw.r.length)h+='<p class="sub">Aucun repas prévu. Touche l’ampoule pour choisir parmi tes idées.</p>';
  h+='<div class="ad"><input id="ri" placeholder="Ajouter un repas…" onkeydown="if(event.key===\'Enter\')radd()"><button onclick="radd()">+</button></div></section>';
  return h;
}
var AC=null;
function tmAudio(){
  try{
    var C=window.AudioContext||window.webkitAudioContext;
    if(!AC)AC=new C();
    if(AC.state==='suspended')AC.resume();
    var o=AC.createOscillator(),g=AC.createGain();g.gain.value=0.0001;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+0.05);
  }catch(e){}
}
function tmToggle(){
  if(TM.run){TM.rem=(TM.end-Date.now())/1000;TM.run=false;clearInterval(tmIv)}
  else{tmAudio();if(TM.rem<=0||TM.done)TM.rem=TM.dur;TM.done=false;TM.run=true;TM.end=Date.now()+TM.rem*1000;clearInterval(tmIv);tmIv=setInterval(tmTick,250)}
  tmUI();
}
function tmBeep(){
  try{
    if(!AC){var C=window.AudioContext||window.webkitAudioContext;AC=new C()}
    if(AC.state==='suspended')AC.resume();
    [0,0.28,0.56].forEach(function(d){
      var o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+d;
      o.type='sine';o.frequency.value=880;o.connect(g);g.connect(AC.destination);
      g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.35,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+0.2);
      o.start(t);o.stop(t+0.22);
    });
  }catch(e){}
  try{if(navigator.vibrate)navigator.vibrate([250,120,250])}catch(e){}
}
function useIdea(i){var a=gi();if(!a[i])return;addMeal(a[i]);showIdeas=false;render()}
function mealPage(){
  cw.r=cw.r||[];
  var h='<section class="bx"><div class="bxh"><h4>🍽️ Repas</h4><button class="ddb'+(showIdeas?' on':'')+'" onclick="tgI()" aria-label="Choisir un repas">'+BULB+'<span>Choisir</span><small>▾</small></button></div>';
  if(showIdeas){
    var ideas=gi();
    h+='<div class="ddm"><div class="ih"><span>Choisis un repas</span><button onclick="tgM()">'+(mman?'Terminé':'Modifier')+'</button></div>';
    ideas.forEach(function(o,i){
      h+='<div class="ddi" onclick="'+(mman?'':'useIdea('+i+')')+'"><span>'+esc(o)+'</span>'+(mman?'<i onclick="event.stopPropagation();mdl('+i+')">✕</i>':'')+'</div>';
    });
    if(!ideas.length)h+='<p class="sub">Aucun repas dans la liste pour le moment</p>';
    h+='<div class="ad"><input id="mi2" placeholder="Nouveau repas…" onkeydown="if(event.key===\'Enter\')mad()"><button onclick="mad()">+</button></div></div>';
  }
  cw.r.forEach(function(m,i){
    h+='<div class="it'+(m.x?' x':'')+'"><button class="ck" onclick="rtg('+i+')">'+(m.x?'×':'○')+'</button><span>'+esc(m.t)+'</span><button class="rm" onclick="rdl('+i+')">✕</button></div>';
  });
  if(!cw.r.length)h+='<p class="sub">Aucun repas prévu cette semaine. Touche « Choisir ».</p>';
  h+='<div class="ad"><input id="ri" placeholder="Ajouter un repas…" onkeydown="if(event.key===\'Enter\')radd()"><button onclick="radd()">+</button></div></section>';
  return h;
}
var KR={cake:3,drink:2,dog:2,cat:2,arr:2,dep:2,leaf:2,family:2,other:1},dkType='other';
function kBest(a,b){b=b||'other';if(!a)return b;return KR[b]>KR[a]?b:a}
function impK(dates,d){var r=null;(dates||[]).forEach(function(o){if(parseInt(o.d,10)===d)r=kBest(r,o.k)});return r}
function sdk(k){dkType=k;var bs=document.querySelectorAll('.kt button');for(var i=0;i<bs.length;i++)bs[i].classList.toggle('on',bs[i].getAttribute('data-k')===k)}
function dadd(){
  var t=document.getElementById('t-dates'),d=document.getElementById('d-dates');
  if(!t||!t.value.trim())return;
  cd.dates=cd.dates||[];
  cd.dates.push({t:t.value.trim(),d:(d?d.value.trim():''),x:false,k:dkType});
  cd.dates.sort(function(a,b){return(parseInt(a.d,10)||0)-(parseInt(b.d,10)||0)});
  upd();render();
}
function datesSec(){
  var IC={cake:'🎂 ',drink:'🍵 ',other:''};
  var h='<section class="b"><h3 class="sc">Dates importantes</h3>';
  (cd.dates||[]).forEach(function(o,i){
    var k=o.k||'other';
    h+='<div class="it"><b class="dd kk k-'+k+'">'+esc(o.d||'')+'</b><span>'+IC[k]+esc(o.t)+'</span><button class="rm" onclick="del(\'dates\','+i+')">✕</button></div>';
  });
  var K=[['cake','🎂'],['drink','🍵'],['other','Autre']];
  h+='<div class="kt">'+K.map(function(x){return '<button data-k="'+x[0]+'" class="'+(dkType===x[0]?'on':'')+'" onclick="sdk(\''+x[0]+'\')">'+x[1]+'</button>'}).join('')+'</div>';
  h+='<div class="ad"><input id="d-dates" class="dn" inputmode="numeric" placeholder="Jour"><input id="t-dates" placeholder="Ajouter…" onkeydown="if(event.key===\'Enter\')dadd()"><button onclick="dadd()">+</button></div></section>';
  return h;
}
var KO=[['cake','🎂 Anniversaire','Anniversaire'],['drink','🍵 Kombucha','Kombucha'],['dog','🐶 Chien','Chien'],['cat','🐱 Chat','Chat'],['other','★ Autre','Date importante']];
function dkSel(v){dkType=v;var bs=document.querySelectorAll('.kgr .kb');for(var i=0;i<bs.length;i++)bs[i].classList.toggle('on',bs[i].getAttribute('data-k')===v)}
function dadd(){
  var t=document.getElementById('t-dates'),d=document.getElementById('d-dates'),s=document.getElementById('k-dates');
  var day=parseInt(d?d.value:'',10);
  if(!day||day<1||day>31){if(d){d.focus();d.style.borderColor='#ac727e'}return}
  var k=s?s.value:dkType,lab='';
  KO.forEach(function(o){if(o[0]===k)lab=o[2]});
  cd.dates=cd.dates||[];
  cd.dates.push({t:(t&&t.value.trim())||lab,d:String(day),x:false,k:k});
  cd.dates.sort(function(a,b){return(parseInt(a.d,10)||0)-(parseInt(b.d,10)||0)});
  dkType=k;upd();render();
}
function datesSec(){
  var IC={cake:'🎂 ',drink:'🍵 ',other:''};
  var h='<section class="b"><h3 class="sc">Dates importantes</h3>';
  (cd.dates||[]).forEach(function(o,i){
    var k=o.k||'other';
    h+='<div class="it"><b class="dd kk k-'+k+'">'+esc(o.d||'')+'</b><span>'+IC[k]+esc(o.t)+'</span><button class="rm" onclick="del(\'dates\','+i+')">✕</button></div>';
  });
  h+='<div class="kgr">'+KO.map(function(o){return '<button type="button" class="kb'+(dkType===o[0]?' on':'')+'" data-k="'+o[0]+'" onclick="dkSel(\''+o[0]+'\')">'+o[1]+'</button>'}).join('')+'</div><div class="ad"><input id="d-dates" class="dn" inputmode="numeric" placeholder="Jour" onkeydown="if(event.key===\'Enter\')dadd()"></div>';
  h+='<div class="ad"><input id="t-dates" placeholder="Texte (facultatif)" onkeydown="if(event.key===\'Enter\')dadd()"><button onclick="dadd()">+</button></div></section>';
  return h;
}
var THEMES=[
 {n:'Champagne',v:{'--bg':'#f3e7e7','--card':'#f9f8f6','--text':'#39393b','--muted':'#ac727e','--line':'#e8ced1','--ac':'#ac727e','--hd':'#39393b','--dk':'#39393b','--hl':'#e8ced1','--hlb':'#c48f97','--mh':'#e8ced1','--cakeb':'#e8ced1','--cakec':'#39393b','--drinkb':'#e8ced1','--drinkc':'#39393b','--othb':'linear-gradient(160deg,#39393b,#39393b 60%,#525156)','--othc':'#f3e7e7'}},
 {n:'Rose poudré',v:{'--bg':'#f9f8f6','--card':'#f9f8f6','--text':'#39393b','--muted':'#c48f97','--line':'#e8ced1','--ac':'#ac727e','--hd':'#525156','--dk':'#39393b','--hl':'#e8ced1','--hlb':'#d9b0b6','--mh':'#e8ced1','--cakeb':'#d9b0b6','--cakec':'#39393b','--drinkb':'#e8ced1','--drinkc':'#39393b','--othb':'linear-gradient(160deg,#39393b,#895a64 60%,#707072)','--othc':'#f9f8f6'}},
 {n:'Sauge',v:{'--bg':'#f1f0ee','--card':'#f9f8f6','--text':'#39393b','--muted':'#929093','--line':'#d4d3d1','--ac':'#707072','--hd':'#39393b','--dk':'#39393b','--hl':'#e7e3e0','--hlb':'#b5b3b4','--mh':'#d4d3d1','--cakeb':'#e8ced1','--cakec':'#39393b','--drinkb':'#e8ced1','--drinkc':'#39393b','--othb':'linear-gradient(160deg,#39393b,#525156 60%,#707072)','--othc':'#f9f8f6'}},
 {n:'Bleu nuit',v:{'--bg':'#f3e7e7','--card':'#f9f8f6','--text':'#39393b','--muted':'#b5b3b4','--line':'#e8ced1','--ac':'#ac727e','--hd':'#39393b','--dk':'#39393b','--hl':'#f1f0ee','--hlb':'#b5b3b4','--mh':'#e7e3e0','--cakeb':'#e8ced1','--cakec':'#39393b','--drinkb':'#e8ced1','--drinkc':'#39393b','--othb':'linear-gradient(160deg,#39393b,#525156 60%,#707072)','--othc':'#f9f8f6'}},
 {n:'Actuel',v:{'--bg':'#f3e7e7','--card':'#f9f8f6','--text':'#39393b','--muted':'#b5b3b4','--line':'#d4d3d1','--ac':'#39393b','--hd':'#39393b','--dk':'#39393b','--hl':'#e8ced1','--hlb':'#d9b0b6','--mh':'#e8ced1','--cakeb':'#e8ced1','--cakec':'#39393b','--drinkb':'#e8ced1','--drinkc':'#39393b','--othb':'linear-gradient(160deg,#39393b,#525156 55%,#707072)','--othc':'#ffffff'}}
];
function applyTheme(i){
  var T=THEMES[i]||THEMES[0],r=document.documentElement.style;
  for(var k in T.v)r.setProperty(k,T.v[k]);
  r.setProperty('--pk',T.v['--hl']);r.setProperty('--pk2',T.v['--card']);r.setProperty('--tab-on',T.v['--dk']);r.setProperty('--tab-on-text',T.v['--bg']);
  COLORS=[];for(var j=0;j<12;j++)COLORS.push(T.v['--mh']);
}
var thI=1;
applyTheme(thI);
function setTH(i){thI=i;try{localStorage.setItem('ag-th',i)}catch(e){}applyTheme(i);render()}
function themeBar(){return '<div class="thb">'+THEMES.map(function(t,i){return '<button class="'+(thI===i?'on':'')+'" onclick="setTH('+i+')"><i style="background:'+t.v['--bg']+'"></i><i style="background:'+t.v['--ac']+'"></i><i style="background:'+t.v['--dk']+'"></i>'+t.n+'</button>'}).join('')+'</div>'}
function yearHead(y){return '<h1>'+y+'</h1><div class="dv"><i></i></div><div class="yv">'}
var wst=false;
var STSVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16M7 20v-6M12 20V6M17 20v-9"/></svg>';
var WST=[['fx','🏋️','Entraînement'],['wx','🚶‍♀️','Marche'],['yx','🧘‍♀️','Yoga'],['mx','🪷','Méditation'],['sx','🇪🇸','Espagnol']];
function goWS(){wst=true;render();window.scrollTo(0,0)}
function bkWS(){wst=false;render();window.scrollTo(0,0)}
function cntC(p,a,b){var n=0;for(var i=0;i<a;i++)for(var k=0;k<b;k++)if(cw.c[p+i+(b>1?k:'')])n++;return n}
function weekStat(){
  var h='<button class="back" onclick="bkWS()">← Semaine</button><h2 class="mt">Statistiques <small>semaine du '+wd.getDate()+' '+MONTHS[wd.getMonth()].toLowerCase()+'</small></h2><div class="dv"><i></i></div>';
  WST.forEach(function(a){
    var n=0,dots='';
    for(var i=0;i<7;i++){var ok=!!cw.c[a[0]+i];if(ok)n++;dots+='<span class="d7'+(ok?' on':'')+'">'+DAYS[i]+'</span>'}
    h+='<section class="bx"><div class="sh"><span class="si">'+a[1]+'</span><b>'+a[2]+'</b><span class="sc2">'+n+' / 7 jours</span></div><div class="pb"><div style="width:'+Math.round(n*100/7)+'%"></div></div><div class="sdw wk7">'+dots+'</div></section>';
  });
  var pn=0,tn=0;
  for(var i=0;i<7;i++){for(var k=0;k<5;k++)if(cw.c['p'+i+k])pn++;for(var j=0;j<4;j++)if(cw.c['t'+i+j])tn++}
  [['Priorités',pn,35]].forEach(function(r){
    h+='<section class="bx"><div class="sh"><b>'+r[0]+'</b><span class="sc2">'+r[1]+' / '+r[2]+'</span></div><div class="pb"><div style="width:'+Math.round(r[1]*100/r[2])+'%"></div></div></section>';
  });
  return h+'<p class="sub">Les coches viennent de ton planificateur de la semaine.</p>';
}
var NOTESVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h10l4 4v14H5z"/><path d="M14 3v5h5M8 12h8M8 16h5"/></svg>';
var CALCSVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01"/></svg>';
function cartBtn(){return '<div class="itb"><button class="gof" onclick="ovOpen(\'note\')" aria-label="Notes">'+NOTESVG+'</button><button class="gof" onclick="ovOpen(\'calc\')" aria-label="Calculatrice">'+CALCSVG+'</button><button class="gof" onclick="goShopHome()" aria-label="Shopping">'+CARTSVG+'</button></div>'}
var OV=null,NT=[];
var CA={cur:'0',prev:null,op:null,fresh:true,expr:''};
var CK=[['C','C'],['B','⌫'],['%','%'],['÷','÷'],['7','7'],['8','8'],['9','9'],['×','×'],['4','4'],['5','5'],['6','6'],['−','−'],['1','1'],['2','2'],['3','3'],['+','+'],['N','±'],['0','0'],['.',','],['=','=']];
function ldN(){try{return JSON.parse(localStorage.getItem('ag-notes'))||[]}catch(e){return[]}}
function svN(){try{localStorage.setItem('ag-notes',JSON.stringify(NT))}catch(e){}}
function ovOpen(k){OV=k;if(k==='note'){NT=ldN();if(!NT.length)NT=['']}ovUI()}
function ovClose(){if(OV==='note'){NT=NT.filter(function(n){return n.trim()});svN()}OV=null;ovUI()}
function noteSet(i,v){NT[i]=v;svN()}
function noteAdd(){NT.push('');svN();ovUI();var t=document.querySelectorAll('.nn textarea');if(t.length)t[t.length-1].focus()}
function noteDel(i){NT.splice(i,1);if(!NT.length)NT=[''];svN();ovUI()}
function calcOp(a,b,o){if(o==='+')return a+b;if(o==='−')return a-b;if(o==='×')return a*b;if(o==='÷')return b===0?NaN:a/b;return b}
function fmtN(n){if(!isFinite(n))return 'Erreur';return String(parseFloat(n.toPrecision(12)))}
function calcUI(){var a=document.getElementById('cval'),b=document.getElementById('cexp');if(a)a.textContent=CA.cur.replace('.',',');if(b)b.textContent=CA.expr.replace(/\./g,',')}
function calcKey(k){
  if(CA.cur==='Erreur'&&k!=='C'){CA={cur:'0',prev:null,op:null,fresh:true,expr:''}}
  if(k>='0'&&k<='9'&&k.length===1){if(CA.fresh){CA.cur=k;CA.fresh=false}else CA.cur=(CA.cur==='0'?k:CA.cur+k)}
  else if(k==='.'){if(CA.fresh){CA.cur='0.';CA.fresh=false}else if(CA.cur.indexOf('.')<0)CA.cur+='.'}
  else if(k==='C'){CA={cur:'0',prev:null,op:null,fresh:true,expr:''}}
  else if(k==='B'){if(!CA.fresh){CA.cur=CA.cur.length>1?CA.cur.slice(0,-1):'0';if(CA.cur==='-')CA.cur='0'}}
  else if(k==='N'){if(CA.cur!=='0')CA.cur=CA.cur.charAt(0)==='-'?CA.cur.slice(1):'-'+CA.cur}
  else if(k==='%'){CA.cur=fmtN(parseFloat(CA.cur)/100);CA.fresh=true}
  else if(k==='='){
    if(CA.op!==null&&CA.prev!==null){var r=calcOp(CA.prev,parseFloat(CA.cur),CA.op);CA.expr=fmtN(CA.prev)+' '+CA.op+' '+fmtN(parseFloat(CA.cur))+' =';CA.cur=fmtN(r);CA.prev=null;CA.op=null;CA.fresh=true}
  }else{
    if(CA.op!==null&&CA.prev!==null&&!CA.fresh){var r2=calcOp(CA.prev,parseFloat(CA.cur),CA.op);CA.prev=r2;CA.cur=fmtN(r2)}else CA.prev=parseFloat(CA.cur);
    CA.op=k;CA.fresh=true;CA.expr=fmtN(CA.prev)+' '+k;
  }
  calcUI();
}
function ovUI(){
  var el=document.getElementById('ovl');if(!el)return;
  if(!OV){el.innerHTML='';return}
  if(OV==='beach'){el.innerHTML=bchHTML();return}
  if(OV==='tide'){el.innerHTML=tideHTML();return}
  if(OV==='moon'){el.innerHTML=moonHTML();return}
  if(OV==='btc'){el.innerHTML=btcHTML();return}
  if(OV==='chores'){el.innerHTML=choreHTML();return}
  if(OV==='backup'){el.innerHTML=bkHTML();return}
  if(OV==='fx'){el.innerHTML=fxHTML();return}
  if(OV==='ystat'){el.innerHTML=yrHTML();return}
  if(OV==='search'){el.innerHTML=srHTML();setTimeout(function(){var i=document.getElementById('srq');if(i)i.focus()},60);return}
  var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()">';
  if(OV==='note'){
    h+='<div class="tmx"><span>Notes</span><button onclick="ovClose()">✕</button></div>';
    NT.forEach(function(n,i){h+='<div class="nn pn'+(i%6)+'" style="--r:'+NROT[i%6]+'deg"><textarea placeholder="Écris ta note…" '+nsAttr(i)+' oninput="noteSet('+i+',this.value);noteGrow(this)">'+esc(n)+'</textarea><button class="nz nzm" aria-label="Réduire" onclick="noteSz('+i+',-1)">−</button><button class="nz nzp" aria-label="Agrandir" onclick="noteSz('+i+',1)">+</button><button class="rm" onclick="noteDel('+i+')">✕</button></div>'});
    h+='<button class="addn" onclick="noteAdd()">+ Nouvelle note</button>';
  }else{
    h+='<div class="tmx"><span>Calculatrice</span><button onclick="ovClose()">✕</button></div><div class="cdisp"><div class="cexp" id="cexp">'+esc(CA.expr.replace(/\./g,','))+'</div><div class="cval" id="cval">'+esc(CA.cur.replace('.',','))+'</div></div><div class="ckp">';
    CK.forEach(function(k){var c='÷×−+'.indexOf(k[0])>=0?'op':(k[0]==='='?'eq':'');h+='<button class="'+c+'" onclick="calcKey(\''+(k[0]==='.'?'.':k[0])+'\')">'+k[1]+'</button>'});
    h+='</div>';
  }
  el.innerHTML=h+'</div></div>';
}
var BCH=(function(){try{return JSON.parse(localStorage.getItem('ag-beach'))||{}}catch(e){return{}}})();
function svB(){try{localStorage.setItem('ag-beach',JSON.stringify(BCH))}catch(e){}}
function isBeach(y,m,d){return !!BCH[y+'-'+(m+1)+'-'+d]}
function tdc(k,y,m,d){var c=((k?'imp k-'+k:'')+(isBeach(y,m,d)?' bch':'')).trim();return c?' class="'+c+'"':''}
function bcls(dates,d){var k=impK(dates,d),c=((k?'imp k-'+k:'')+(isBeach(cy,cm,d)?' bch':'')).trim();return c?' class="'+c+'"':''}
var WAVESVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0M2 16c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0"/></svg>';
function cartBtn(){return '<div class="itb"><button class="gof wv" onclick="ovOpen(\'beach\')" aria-label="Jours de plage">'+WAVESVG+'</button><div class="tg"><button class="gof" onclick="ovOpen(\'note\')" aria-label="Notes">'+NOTESVG+'</button><button class="gof" onclick="ovOpen(\'calc\')" aria-label="Calculatrice">'+CALCSVG+'</button><button class="gof" onclick="goShopHome()" aria-label="Shopping">'+CARTSVG+'</button></div></div>'}
function pD(s){var p=s.split('-');return new Date(parseInt(p[0],10),parseInt(p[1],10)-1,parseInt(p[2],10))}
function kNum(k){var p=k.split('-');return parseInt(p[0],10)*10000+parseInt(p[1],10)*100+parseInt(p[2],10)}
function bchAdd(){
  var a=document.getElementById('b1').value,b=document.getElementById('b2').value;
  if(!a)return;
  var s=pD(a),e=b?pD(b):pD(a);
  if(e<s){var t=s;s=e;e=t}
  var n=0;
  for(var d=new Date(s);d<=e&&n<150;d.setDate(d.getDate()+1),n++)BCH[d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()]=true;
  svB();render();ovUI();
}
function bchDel(k){delete BCH[k];svB();render();ovUI()}
function bchHTML(){
  var y=curYear()||new Date().getFullYear();
  var all=Object.keys(BCH),keys=all.filter(function(k){return k.split('-')[0]===String(y)}).sort(function(a,b){return kNum(a)-kNum(b)});
  var mc=[0,0,0,0,0,0,0,0,0,0,0,0];
  keys.forEach(function(k){mc[parseInt(k.split('-')[1],10)-1]++});
  var mx=Math.max.apply(null,mc.concat([1]));
  var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Jours de plage</span><button onclick="ovClose()">✕</button></div>';
  h+=bmBar();
  h+='<div class="bform"><label>Du<input type="date" id="b1" min="'+y+'-01-01" max="'+y+'-12-31"></label><label>Au (facultatif)<input type="date" id="b2" min="'+y+'-01-01" max="'+y+'-12-31"></label><button class="addn" onclick="bchAdd()">Ajouter</button></div>';
  h+='<p class="sm">'+keys.length+' jour(s) en '+y+' · '+all.length+' au total</p>';
  h+='<div class="bst">'+mc.map(function(c,m){return '<div class="yr"><b>'+MONTHS[m].slice(0,3)+'</b><div class="pb"><div style="width:'+Math.round(c*100/mx)+'%;background:var(--bchb)"></div></div><span>'+c+'</span></div>'}).join('')+'</div>';
  if(keys.length){
    h+='<div class="chips">'+keys.map(function(k){var p=k.split('-');return '<span class="chip">'+p[2]+' '+MONTHS[parseInt(p[1],10)-1].slice(0,3).toLowerCase()+'<i onclick="bchDel(\''+k+'\')">✕</i></span>'}).join('')+'</div>';
  }
  return h+'</div></div>';
}
var TDN=["l0125/0.9 h0640/8.6 l1300/0.6 h1921/8.2","l0130/1.3 h0746/8 l1404/1 h2030/8","l0244/1.6 h0858/7.7 l1514/1.3 h2140/8.1","l0400/1.5 h1011/7.6 l1623/1.3 h2246/8.3","l0509/1.3 h1116/7.7 l1725/1.2 h2343/8.6","l0608/0.9 h1213/7.9 l1819/1","l0658/0.6 h0034/8.9 l1906/0.9 h1302/8.2","l0741/0.3 h0119/9.1 l1949/0.8 h1347/8.3","l0822/0.2 h0200/9.2 l2028/0.8 h1428/8.4","l0859/0.1 h0239/9.2 l2107/0.9 h1508/8.4","l0936/0.2 h0316/9.1 l2144/1.1 h1547/8.3","l1013/0.4 h0354/8.9 l2223/1.3 h1626/8.1","l1051/0.6 h0432/8.5 l2303/1.6 h1707/7.9","l1131/0.9 h0513/8.2 l2347/1.9 h1750/7.7","l1213/1.3 h0556/7.7 h1835/7.4","l0034/2.2 h0643/7.3 l1259/1.6 h1925/7.3","l0127/2.4 h0737/7 l1349/1.9 h2018/7.2","l0225/2.4 h0836/6.8 l1443/2 h2113/7.3","l0326/2.3 h0937/6.8 l1539/2 h2207/7.6","l0425/1.9 h1035/7 l1633/1.8 h2258/8.1","l0519/1.4 h1128/7.4 l1725/1.5 h2346/8.6","l0609/0.8 h1218/7.8 l1815/1.1","l0657/0.3 h0034/9.1 l1904/0.7 h1306/8.3","l0744/-0.2 h0121/9.6 l1953/0.3 h1354/8.7","l0831/-0.6 h0208/10 l2043/0.1 h1442/9.1","l0918/-0.8 h0256/10.1 l2133/0 h1530/9.3","l1007/-0.8 h0346/10.1 l2225/0.1 h1621/9.4","l1057/-0.6 h0437/9.8 l2320/0.3 h1714/9.3","l1150/-0.2 h0531/9.4 h1809/9.1","l0018/0.6 h0629/8.8 l1245/0.2 h1908/8.9"];
var TDD=["l0121/1 h0730/8.3 l1344/0.7 h2009/8.6","l0227/1.3 h0836/7.8 l1446/1.1 h2112/8.5","l0335/1.4 h0942/7.6 l1550/1.4 h2214/8.4","l0441/1.4 h1047/7.5 l1651/1.6 h2312/8.5","l0541/1.2 h1146/7.5 l1748/1.6","l0633/1.1 h0005/8.5 l1839/1.6 h1239/7.6","l0720/0.9 h0052/8.6 l1925/1.6 h1327/7.8","l0802/0.7 h0136/8.7 l2008/1.5 h1411/7.9","l0841/0.6 h0217/8.7 l2048/1.5 h1452/8","l0918/0.5 h0256/8.7 l2128/1.5 h1531/8.1","l0955/0.5 h0335/8.6 l2207/1.5 h1610/8.2","l1032/0.6 h0414/8.5 l2247/1.5 h1649/8.2","l1110/0.7 h0454/8.3 l2328/1.6 h1728/8.1","l1148/1 h0534/8 h1808/8","l0010/1.7 h0616/7.7 l1227/1.2 h1849/7.9","l0055/1.8 h0701/7.4 l1308/1.5 h1932/7.9","l0144/1.9 h0749/7.2 l1353/1.7 h2019/7.9","l0236/1.9 h0843/7 l1443/1.8 h2111/8","l0333/1.7 h0941/7 l1538/1.8 h2206/8.2","l0431/1.4 h1041/7.2 l1637/1.6 h2303/8.5","l0530/1 h1141/7.5 l1737/1.4","l0626/0.6 h0000/8.9 l1836/1 h1238/8","l0721/0 h0055/9.3 l1934/0.6 h1333/8.5","l0813/-0.4 h0149/9.7 l2029/0.2 h1426/9","l0904/-0.7 h0242/9.9 l2123/-0.1 h1518/9.4","l0954/-0.9 h0335/10 l2217/-0.2 h1610/9.7","l1044/-0.8 h0427/9.9 l2311/-0.1 h1701/9.8","l1134/-0.6 h0519/9.6 h1753/9.7","l0005/0.2 h0612/9.1 l1225/-0.1 h1845/9.4","l0100/0.5 h0707/8.5 l1317/0.4 h1940/9","l0158/0.9 h0805/7.9 l1411/1 h2034/8.7"];
function tdGet(k){
  var p=k.split('-'),y=+p[0],m=+p[1],d=+p[2];
  var a=(y===2026&&m===11)?TDN:(y===2026&&m===12)?TDD:null;
  if(!a||!a[d-1])return null;
  return a[d-1].split(' ').map(function(t){return {t:t.charAt(0),h:t.slice(1,3)+':'+t.slice(3,5),v:parseFloat(t.slice(6))}}).sort(function(x,y2){return x.h<y2.h?-1:1});
}
var tdate=(function(){var s=iso(new Date());return(s>='2026-11-01'&&s<='2026-12-31')?s:'2026-11-01'})();
function tdSet(v){if(v)tdate=v;ovUI()}
function tdMove(n){var p=tdate.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]+n),s=iso(d);if(s<'2026-11-01'||s>'2026-12-31')return;tdate=s;ovUI()}
var TIDESVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 11V3M5.5 5.5L8 3l2.5 2.5M16 3v8M13.5 8.5L16 11l2.5-2.5M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>';
function cartBtn(){return '<div class="itb"><div class="tg"><button class="gof wv" onclick="ovOpen(\'beach\')" aria-label="Jours de plage">'+WAVESVG+'</button><button class="gof wv" onclick="ovOpen(\'tide\')" aria-label="Marées">'+TIDESVG+'</button></div><div class="tg"><button class="gof" onclick="ovOpen(\'note\')" aria-label="Notes">'+NOTESVG+'</button><button class="gof" onclick="ovOpen(\'calc\')" aria-label="Calculatrice">'+CALCSVG+'</button><button class="gof" onclick="goShopHome()" aria-label="Shopping">'+CARTSVG+'</button></div></div>'}
function tideHTML(){
  var k=tdate,t=tdGet(k),p=k.split('-'),dt=new Date(+p[0],+p[1]-1,+p[2]);
  var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Marées · Dominical</span><button onclick="ovClose()">✕</button></div>';
  h+='<div class="tnav"><button onclick="tdMove(-1)">‹</button><input type="date" value="'+k+'" min="2026-11-01" max="2026-12-31" onchange="tdSet(this.value)"><button onclick="tdMove(1)">›</button></div>';
  h+='<p class="sm">'+DFULL[dt.getDay()]+' '+dt.getDate()+' '+MONTHS[dt.getMonth()].toLowerCase()+'</p>'+(FM[p[0]+'-'+(+p[1])+'-'+(+p[2])]?'<p class="sub">🌕 Pleine lune · marées plus marquées</p>':'');
  if(t){h+='<div class="tcard">'+t.map(function(x){return '<div class="trow '+(x.t==='h'?'hi':'lo')+'"><span>'+(x.t==='h'?'▲ Marée haute':'▼ Marée basse')+'</span><b>'+x.h+'</b><i>'+(x.v*0.3048).toFixed(1).replace('.',',')+' m</i></div>'}).join('')+'</div>'}
  else h+='<p class="sub">Pas de données dans l’application pour cette date.</p>';
  var rows='';
  for(var i=1;i<=7;i++){
    var d2=new Date(+p[0],+p[1]-1,+p[2]+i),k2=iso(d2),t2=tdGet(k2);
    if(!t2)continue;
    rows+='<div class="trow7" onclick="tdSet(\''+k2+'\')"><b>'+DN[d2.getDay()]+' '+d2.getDate()+'</b><span>'+t2.map(function(x){return (x.t==='h'?'▲':'▼')+x.h}).join(' · ')+'</span></div>';
  }
  if(rows)h+='<h4 class="mgl">Les jours suivants</h4>'+rows;
  h+='<p class="sub">Heure locale du Costa Rica · hauteurs en m · station NOAA Bahía de Uvita · source : kalonsurf.com. Données de novembre et décembre 2026.</p>';
  h+='<a class="addn tl" href="https://kalonsurf.com/dominical-tides/" target="_blank" rel="noopener">Voir les autres mois sur le site</a>';
  return h+'</div></div>';
}
var KORD=['cake','drink','other'];
var FM={};'2026-1-3,2026-2-1,2026-3-3,2026-4-1,2026-5-1,2026-5-31,2026-6-29,2026-7-29,2026-8-27,2026-9-26,2026-10-25,2026-11-24,2026-12-23,2027-1-22,2027-2-20,2027-3-22,2027-4-20,2027-5-20,2027-6-18,2027-7-18,2027-8-17,2027-9-15,2027-10-15,2027-11-13,2027-12-13,2028-1-11,2028-2-10,2028-3-10,2028-4-9,2028-5-8,2028-6-7,2028-7-6,2028-8-5,2028-9-3,2028-10-3,2028-11-2,2028-12-1,2028-12-31'.split(',').forEach(function(k){FM[k]=1});
function impTypes(dates,d){var s={};(dates||[]).forEach(function(o){if(parseInt(o.d,10)===d)s[o.k||'other']=1});return KORD.filter(function(k){return s[k]})}
function multiBg(ts){var c={cake:'var(--cakeb)',drink:'var(--drinkb)',other:'var(--dk)'};if(ts.length===2)return 'linear-gradient(135deg,'+c[ts[0]]+' 50%,'+c[ts[1]]+' 50%)';return 'linear-gradient(135deg,'+c[ts[0]]+' 33.4%,'+c[ts[1]]+' 33.4% 66.7%,'+c[ts[2]]+' 66.7%)'}
function bcls(dates,d){
  var ts=impTypes(dates,d),b=isBeach(cy,cm,d);
  if(ts.length>1)return ' class="imp multi'+(b?' bch':'')+'" style="--mbg:'+multiBg(ts)+'"';
  var c=((ts.length?'imp k-'+ts[0]:'')+(b?' bch':'')).trim();return c?' class="'+c+'"':'';
}
function dg(dates,d){return impTypes(dates,d).length>1?'<span class="dn">'+d+'</span>':d}
function tdc(o,y,m,d){
  var ts=o?KORD.filter(function(k){return o[k]}):[],b=isBeach(y,m,d);
  if(ts.length>1)return ' class="imp multi'+(b?' bch':'')+'" style="--mbg:'+multiBg(ts)+'"';
  var c=((ts.length?'imp k-'+ts[0]:'')+(b?' bch':'')).trim();return c?' class="'+c+'"':'';
}
function tdg(o,d,y,m){
  var ts=o?KORD.filter(function(k){return o[k]}):[];
  return (ts.length>1?'<span class="dn">'+d+'</span>':String(d))+(FM[y+'-'+(m+1)+'-'+d]?'<i class="fm">🌕</i>':'');
}
function postit(){return '<div class="postit"><div class="pico"><button class="gof" onclick="mealOpen()" aria-label="Repas de la semaine">'+MEALSVG+'</button><button class="gof" onclick="goWS()" aria-label="Statistiques">'+STSVG+'</button></div><i class="tape"></i><h3>Objectifs de la semaine</h3>'+rows('g',5,'ci')+'</div>'}
var MOONSVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
function tdg(o,d,y,m){var ts=o?KORD.filter(function(k){return o[k]}):[];return ts.length>1?'<span class="dn">'+d+'</span>':String(d)}
function cartBtn(){return '<div class="itb"><div class="tg"><button class="gof wv" onclick="ovOpen(\'beach\')" aria-label="Jours de plage">'+WAVESVG+'</button><button class="gof wv" onclick="ovOpen(\'tide\')" aria-label="Marées">'+TIDESVG+'</button><button class="gof" onclick="ovOpen(\'moon\')" aria-label="Pleine lune">'+MOONSVG+'</button></div><div class="tg"><button class="gof" onclick="ovOpen(\'note\')" aria-label="Notes">'+NOTESVG+'</button><button class="gof" onclick="ovOpen(\'calc\')" aria-label="Calculatrice">'+CALCSVG+'</button><button class="gof" onclick="goShopHome()" aria-label="Shopping">'+CARTSVG+'</button></div></div>'}
function goDay(y,m,d){OV=null;ovUI();openD(y,m,d)}
function moonHTML(){
  var y=curYear()||new Date().getFullYear(),now=new Date(),t0=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  var ds=Object.keys(FM).map(function(k){var p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2])}).sort(function(a,b){return a-b});
  var nx=null;for(var i=0;i<ds.length;i++){if(ds[i]>=t0){nx=ds[i];break}}
  var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Pleine lune</span><button onclick="ovClose()">✕</button></div>';
  if(nx){var n=Math.round((nx-t0)/86400000);h+='<p class="sm">🌕 Prochaine : '+nx.getDate()+' '+MONTHS[nx.getMonth()].toLowerCase()+' '+nx.getFullYear()+' · '+(n===0?'aujourd’hui':n===1?'demain':'dans '+n+' jours')+'</p>'}
  h+='<h4 class="mgl">Pleines lunes de '+y+'</h4>';
  ds.filter(function(d){return d.getFullYear()===y}).forEach(function(d){
    h+='<div class="trow7" onclick="goDay('+y+','+d.getMonth()+','+d.getDate()+')"><b>'+MONTHS[d.getMonth()]+'</b><span>'+DFULL[d.getDay()]+' '+d.getDate()+'</span></div>';
  });
  h+='<p class="sub">Dates calculées pour l’heure du Costa Rica. Touche une date pour ouvrir la page du jour.</p>';
  return h+'</div></div>';
}
var BTCSVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5h5a2.8 2.8 0 0 1 0 5.6H8M8 10.6h6a3 3 0 0 1 0 6H8M8 5v11.6M10.5 3v2M13.5 3v2M10.5 16.6v2M13.5 16.6v2"/></svg>';
var BTCD={p:78537,c:1.10,hi:78537,lo:77593,t:'1 nov. 2026 à 19 h 39',s:[77685,77655,77647,77744,77868,77794,78122,78072,77918,77742,77877,77972,77937,78049,77922,77691,77868,77767,78031,78017,78537]};
function fmtUSD(n){return '$'+String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
function btcSpark(){
  var s=BTCD.s,mn=Math.min.apply(null,s),mx=Math.max.apply(null,s);
  var pts=s.map(function(v,i){return (i*300/(s.length-1)).toFixed(1)+','+(74-(v-mn)*68/(mx-mn)).toFixed(1)}).join(' ');
  return '<svg viewBox="0 0 300 80" width="100%" height="80" preserveAspectRatio="none"><polygon points="0,80 '+pts+' 300,80" fill="var(--hl)" opacity=".7"/><polyline points="'+pts+'" fill="none" stroke="#707072" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';
}
function btcHTML(){
  var d=BTCD,up=d.c>=0;
  var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Bitcoin</span><button onclick="ovClose()">✕</button></div>';
  h+='<div class="btc"><div class="bp">'+fmtUSD(d.p)+'</div><div class="bc '+(up?'up':'dn')+'">'+(up?'▲ +':'▼ ')+String(d.c).replace('.',',')+' % · 24 h</div></div>';
  h+='<div class="bsp">'+btcSpark()+'</div>';
  h+='<div class="bhl"><span>Plus bas 24 h<b>'+fmtUSD(d.lo)+'</b></span><span>Plus haut 24 h<b>'+fmtUSD(d.hi)+'</b></span></div>';
  h+='<p class="sub">Aperçu : prix du '+d.t+' (heure du Costa Rica). Une fois une source connectée, le prix se met à jour en direct à chaque ouverture.</p>';
  return h+'</div></div>';
}
function cartBtn(){return '<div class="itb"><div class="tg"><button class="gof wv" onclick="ovOpen(\'beach\')" aria-label="Jours de plage">'+WAVESVG+'</button><button class="gof wv" onclick="ovOpen(\'tide\')" aria-label="Marées">'+TIDESVG+'</button><button class="gof" onclick="ovOpen(\'moon\')" aria-label="Pleine lune">'+MOONSVG+'</button><button class="gof" onclick="ovOpen(\'btc\')" aria-label="Bitcoin">'+BTCSVG+'</button></div><div class="tg"><button class="gof" onclick="ovOpen(\'note\')" aria-label="Notes">'+NOTESVG+'</button><button class="gof" onclick="ovOpen(\'calc\')" aria-label="Calculatrice">'+CALCSVG+'</button><button class="gof" onclick="goShopHome()" aria-label="Shopping">'+CARTSVG+'</button></div></div>'}
var VB=(function(){try{var o=JSON.parse(localStorage.getItem('ag-vb'));if(o&&o.p)return o}catch(e){}return{p:[],m:'',w:[],t:''}})();
function vbS(){try{localStorage.setItem('ag-vb',JSON.stringify(VB));return true}catch(e){alert('Espace plein : retire quelques photos pour en ajouter.');return false}}
function vbAdd(inp){
  var fs=[].slice.call(inp.files),n=fs.length;
  fs.forEach(function(f){
    var r=new FileReader();
    r.onload=function(){
      var im=new Image();
      im.onload=function(){
        var s=Math.min(1,800/Math.max(im.width,im.height)),c=document.createElement('canvas');
        c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
        c.getContext('2d').drawImage(im,0,0,c.width,c.height);
        VB.p.push({s:c.toDataURL('image/jpeg',0.75),c:''});
        if(!vbS())VB.p.pop();
        if(--n===0)render();
      };
      im.src=r.result;
    };
    r.readAsDataURL(f);
  });
}
