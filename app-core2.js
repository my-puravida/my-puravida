function vbCap(i,v){VB.p[i].c=v;vbS()}
function vbDel(i){VB.p.splice(i,1);vbS();render()}
function vbM(el){VB.m=el.innerText.trim();vbS()}
function vbT(v){VB.t=v;vbS()}
function vbWAdd(){var t=document.getElementById('vbw');if(!t||!t.value.trim())return;VB.w.push(t.value.trim());vbS();render()}
function vbWDel(i){VB.w.splice(i,1);vbS();render()}
function visionPage(){
  var R=[-2.2,1.6,-1,2.4,-1.8,1.1];
  var h='<div class="vbp"><div class="vbh2"><button class="blc" onclick="blOpen()" aria-label="Bucket list"><img src="'+BLIMG+'" alt="Bucket list"></button><div class="vbh"><span class="vbk">mon année en images</span><h1 class="vbt">Vision board</h1><div class="dv"><i></i></div></div></div>';
  h+='<div class="vbm" contenteditable="true" data-ph="Écris ta phrase d’intention…" onblur="vbM(this)">'+esc(VB.m)+'</div>';
  h+='<div class="vbg">';
  VB.p.forEach(function(p,i){
    h+='<figure class="pol" style="--r:'+R[i%6]+'deg;--d:'+(i%8*70)+'ms"><i class="tp"></i><img src="'+p.s+'" alt=""><button class="vx" onclick="vbDel('+i+')">✕</button><input class="cap" value="'+esc(p.c)+'" placeholder="Légende…" oninput="vbCap('+i+',this.value)"></figure>';
  });
  h+='<label class="pol add" style="--r:1deg"><span>+</span><small>Ajouter des photos</small><input type="file" accept="image/*" multiple hidden onchange="vbAdd(this)"></label></div>';
  h+='<div class="vbs"><div class="orn"></div><h3>Mes intentions</h3><textarea class="vbtx" placeholder="Décris la vie que tu crées : tes rêves, tes valeurs, ce que tu veux ressentir…" oninput="vbT(this.value)">'+esc(VB.t)+'</textarea></div>';
  h+='<div class="vbs"><div class="orn"></div><h3>Mes mots</h3><div class="wds">'+VB.w.map(function(w,i){return '<span class="wd">'+esc(w)+'<i onclick="vbWDel('+i+')">✕</i></span>'}).join('')+'</div><div class="ad"><input id="vbw" placeholder="Un mot qui t’inspire…" onkeydown="if(event.key===\'Enter\')vbWAdd()"><button onclick="vbWAdd()">+</button></div></div>';
  return h+'</div>';
}
var bm='dot';try{bm=localStorage.getItem('ag-bm')||'dot'}catch(e){}
document.documentElement.setAttribute('data-bm',bm);
function setBM(k){bm=k;try{localStorage.setItem('ag-bm',k)}catch(e){}document.documentElement.setAttribute('data-bm',k);render();ovUI()}
function bmBar(){var M=[['dot','Point'],['wave','Vague'],['line','Ligne']];return '<p class="sub lft">Repère sur le calendrier :</p><div class="bmb">'+M.map(function(x){return '<button class="'+(bm===x[0]?'on':'')+'" onclick="setBM(\''+x[0]+'\')"><span class="pv '+x[0]+'">12</span>'+x[1]+'</button>'}).join('')+'</div>'}
var ilay='bar';try{ilay=localStorage.getItem('ag-il')||'bar'}catch(e){}
function setIL(k){ilay=k;try{localStorage.setItem('ag-il',k)}catch(e){}render()}
function cartBtn(){
  var I=[['Plage',WAVESVG,'#929093','ovOpen(\'beach\')'],['Marées',TIDESVG,'#707072','ovOpen(\'tide\')'],['Lune',MOONSVG,'#929093','ovOpen(\'moon\')'],['Bitcoin',BTCSVG,'#895a64','ovOpen(\'btc\')'],['Minuteur',HGSVG,'#c48f97','tmOpen()'],['Notes',NOTESVG,'#707072','ovOpen(\'note\')'],['Calcul',CALCSVG,'#895a64','ovOpen(\'calc\')'],['Panier',CARTSVG,'#ac727e','goHomeShop()']];
  var h='<div class="ibw '+ilay+'">'+I.map(function(x){return '<button class="ib" aria-label="'+x[0]+'" style="--c:'+x[2]+';--c1:'+x[2]+'22;--c2:'+x[2]+'66" onclick="'+x[3]+'"><span class="ii">'+x[1]+'</span><em>'+x[0]+'</em></button>'}).join('')+'</div>';
  var L=[['bar','Barre'],['grid','Grille'],['dock','Dock']];
  return h+'<div class="ilsw">'+L.map(function(x){return '<button class="'+(ilay===x[0]?'on':'')+'" onclick="setIL(\''+x[0]+'\')">'+x[1]+'</button>'}).join('')+'</div>';
}
bm='dot';document.documentElement.setAttribute('data-bm','dot');
function bmBar(){return ''}
var BROOMSVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 3L12 12M8.5 11.5l4.5 3-1.8 5.5H4.2L6 14z"/></svg>';
var CH_DEF=[{g:'Chaque jour',i:['Faire les lits','Vaisselle','Essuyer les comptoirs','Balayer la cuisine','Ranger 10 minutes']},{g:'Chaque semaine',i:['Lessive','Changer les draps','Passer l’aspirateur','Laver les planchers','Nettoyer la salle de bain','ÉpoussiƩrer','Sortir les poubelles','Arroser les plantes']},{g:'Chaque mois',i:['Nettoyer le frigo','Laver les vitres','Nettoyer le four','Ranger les armoires','Trier les vêtements']}];
CH_DEF[1].i[5]='Époussiérer';
function chLoad(){try{var o=JSON.parse(localStorage.getItem('ag-ch'));if(o&&o.length)return o}catch(e){}return JSON.parse(JSON.stringify(CH_DEF))}
var CHG=chLoad(),cday=0,cdest='t',cman=false,cmsg='';
var PLAN=['Sortir les poubelles et arroser les plantes','Cuisine : comptoirs, évier, plaque','Salle de bain : lavabo, douche, toilette','Chambres : changer les draps','Salon : épousseter et aspirer','Lessive : laver, sécher, plier','Planchers : balayer et laver'];
function chSave(){try{localStorage.setItem('ag-ch',JSON.stringify(CHG))}catch(e){}}
function openCh(){var t=new Date(),df=Math.round((new Date(t.getFullYear(),t.getMonth(),t.getDate())-wd)/86400000);cday=(df>=0&&df<7)?df:0;cmsg='';ovOpen('chores')}
function chDay(i){cday=i;cmsg='';ovUI()}
function chDest(k){cdest=k;cmsg='';ovUI()}
function chMan(){cman=!cman;ovUI()}
function chUsed(day,dest){var n=dest==='p'?3:4,pre=dest==='p'?'p':'t',c=0;for(var k=0;k<n;k++)if((cw.t[pre+day+k]||'').trim())c++;return c}
function chFree(day,dest){var n=dest==='p'?3:4,pre=dest==='p'?'p':'t';for(var k=0;k<n;k++)if(!(cw.t[pre+day+k]||'').trim())return k;return -1}
function chAdd(gi,ii){
  var txt=CHG[gi].i[ii],k=chFree(cday,cdest);
  if(k<0){cmsg='Plus de place pour ce jour : '+(cdest==='p'?'priorités':'à faire')+' pleins.';ovUI();return}
  cw.t[(cdest==='p'?'p':'t')+cday+k]=txt;wsave();
  cmsg='✓ Ajouté : '+DN[cday]+' · '+(cdest==='p'?'Priorité':'À faire');
  ovUI();render();
}
function chNew(){
  var t=document.getElementById('chn');if(!t||!t.value.trim())return;
  var g=CHG.filter(function(x){return x.g==='Mes tâches'})[0];
  if(!g){g={g:'Mes tâches',i:[]};CHG.push(g)}
  g.i.push(t.value.trim());chSave();ovUI();
}
function chDel(gi,ii){CHG[gi].i.splice(ii,1);chSave();ovUI()}
function chPlan(){
  var n=0;
  for(var d=0;d<7;d++){
    var already=false;
    for(var k=0;k<4;k++)if((cw.t['t'+d+k]||'')===PLAN[d])already=true;
    var f=chFree(d,'t');
    if(!already&&f>=0){cw.t['t'+d+f]=PLAN[d];n++}
  }
  wsave();cmsg=n?'✓ Plan conseillé ajouté ('+n+' jour'+(n>1?'s':'')+')':'Le plan est déjà dans ta semaine.';ovUI();render();
}
function choreHTML(){
  var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Ménage</span><button onclick="ovClose()">✕</button></div>';
  h+='<p class="sub lft">1. Choisis le jour</p><div class="dsel">';
  for(var i=0;i<7;i++){var d=new Date(wd.getFullYear(),wd.getMonth(),wd.getDate()+i);h+='<button class="'+(cday===i?'on':'')+'" onclick="chDay('+i+')"><small>'+DN[i]+'</small>'+d.getDate()+'</button>'}
  h+='</div><p class="sub lft">2. Où l’ajouter ?</p><div class="seg"><button class="'+(cdest==='t'?'on':'')+'" onclick="chDest(\'t\')">À faire '+chUsed(cday,'t')+'/4</button><button class="'+(cdest==='p'?'on':'')+'" onclick="chDest(\'p\')">Priorité '+chUsed(cday,'p')+'/3</button></div>';
  h+='<p class="chm">'+esc(cmsg)+'</p>';
  CHG.forEach(function(g,gi){
    h+='<h4 class="mgl">'+esc(g.g)+'</h4><div class="chips">'+g.i.map(function(t,ii){return '<span class="chip" onclick="'+(cman?'':'chAdd('+gi+','+ii+')')+'">'+esc(t)+(cman?'<i onclick="event.stopPropagation();chDel('+gi+','+ii+')">✕</i>':'')+'</span>'}).join('')+'</div>';
  });
  h+='<div class="ih"><span></span><button onclick="chMan()">'+(cman?'Terminé':'Modifier la liste')+'</button></div>';
  h+='<div class="ad"><input id="chn" placeholder="Nouvelle tâche…" onkeydown="if(event.key===\'Enter\')chNew()"><button onclick="chNew()">+</button></div>';
  h+='<button class="addn" onclick="chPlan()">Plan conseillé de la semaine</button><p class="sub">Une zone par jour pour avancer sans te fatiguer. Seules les cases « À faire » vides sont remplies.</p>';
  return h+'</div></div>';
}
(function(){var r=document.documentElement.style;r.setProperty('--cakeb','#f3e7e7');r.setProperty('--cakec','#39393b');r.setProperty('--drinkb','#f3e7e7');r.setProperty('--drinkc','#39393b');r.setProperty('--othb','linear-gradient(160deg,#525156,#929093 55%,#929093)');r.setProperty('--othc','#ffffff')})();
function multiBg(ts){var c={cake:'var(--cakeb)',drink:'var(--drinkb)',other:'#929093'};if(ts.length===2)return 'linear-gradient(135deg,'+c[ts[0]]+' 50%,'+c[ts[1]]+' 50%)';return 'linear-gradient(135deg,'+c[ts[0]]+' 33.4%,'+c[ts[1]]+' 33.4% 66.7%,'+c[ts[2]]+' 66.7%)'}
function gGet(){
  var a=gl('ag-groc');
  try{if(!a.length&&cw&&cw.s&&cw.s.length&&!localStorage.getItem('ag-groc-m')){a=cw.s.slice();gsv('ag-groc',a);localStorage.setItem('ag-groc-m','1')}}catch(e){}
  return a;
}
function sad(){var t=document.getElementById('si');if(!t||!t.value.trim())return;var a=gGet();a.push({t:t.value.trim(),x:false});gsv('ag-groc',a);render()}
function stg(i){var a=gGet();if(a[i]){a[i].x=!a[i].x;gsv('ag-groc',a)}render()}
function sdl(i){var a=gGet();a.splice(i,1);gsv('ag-groc',a);render()}
function weekShop(){
  var h=whead('Shopping')+shopTabs(),r='';
  if(stt==='meal')return h+mealPage();
  if(stt==='gen'){
    gl('ag-gen').forEach(function(o,i){r+='<div class="it'+(o.x?' x':'')+'"><button class="ck" onclick="gtg('+i+')">'+(o.x?'×':'○')+'</button><span>'+esc(o.t)+'</span><button class="rm" onclick="gdl('+i+')">✕</button></div>'});
    r+='<div class="ad"><input id="gi2" placeholder="Vêtements, maison, cadeaux…" onkeydown="if(event.key===\'Enter\')gadd()"><button onclick="gadd()">+</button></div>';
    return h+bx('🛍️ Shopping général',r);
  }
  var G=gGet(),n=G.filter(function(o){return o.x}).length;
  G.forEach(function(o,i){r+='<div class="it'+(o.x?' x':'')+'"><button class="ck" onclick="stg('+i+')">'+(o.x?'×':'○')+'</button><span>'+esc(o.t)+'</span><button class="rm" onclick="sdl('+i+')">✕</button></div>'});
  r+='<div class="ad"><input id="si" placeholder="Ajouter un article…" onkeydown="if(event.key===\'Enter\')sad()"><button onclick="sad()">+</button></div>';
  return h+'<p class="sm">'+n+' / '+G.length+' articles</p>'+bx('🥦 Liste de courses',r);
}
function cartBtn(){
  var I=[['Plage',WAVESVG,'#929093','ovOpen(\'beach\')'],['Marées',TIDESVG,'#707072','ovOpen(\'tide\')'],['Lune',MOONSVG,'#929093','ovOpen(\'moon\')'],['Bitcoin',BTCSVG,'#895a64','ovOpen(\'btc\')'],['Minuteur',HGSVG,'#c48f97','tmOpen()'],['Notes',NOTESVG,'#707072','ovOpen(\'note\')'],['Calcul',CALCSVG,'#895a64','ovOpen(\'calc\')'],['Panier',CARTSVG,'#ac727e','goHomeShop()']];
  function btn(x){return '<button class="ib" aria-label="'+x[0]+'" style="--c:'+x[2]+';--c1:'+x[2]+'22;--c2:'+x[2]+'66" onclick="'+x[3]+'"><span class="ii">'+x[1]+'</span><em>'+x[0]+'</em></button>'}
  var h;
  if(ilay==='dock'){
    var tp=I.filter(function(x){return x[0]==='Notes'||x[0]==='Panier'}),rs=I.filter(function(x){return x[0]!=='Notes'&&x[0]!=='Panier'});
    h='<div class="ibw topr">'+tp.map(btn).join('')+'</div><div class="ibw dock">'+rs.map(btn).join('')+'</div>';
  }else h='<div class="ibw '+ilay+'">'+I.map(btn).join('')+'</div>';
  var L=[['bar','Barre'],['grid','Grille'],['dock','Dock']];
  return h+'<div class="ilsw">'+L.map(function(x){return '<button class="'+(ilay===x[0]?'on':'')+'" onclick="setIL(\''+x[0]+'\')">'+x[1]+'</button>'}).join('')+'</div>';
}
ilay='dock';
var bkPend=null,bkMsg='';
function yt(){if(cur<2){var i=TABS.indexOf(String(new Date().getFullYear()));cur=i>=2?i:2}}
function goHomeShop(tab){yt();stt=tab||'groc';goShopHome()}
function goTodayWeek(){
  yt();
  var t=new Date(),s=new Date(t.getFullYear(),t.getMonth(),t.getDate()-t.getDay());
  wd=s;wk=iso(s);cy=s.getFullYear();cm=s.getMonth();
  try{var q=localStorage.getItem('agw-'+wk);cw=q?JSON.parse(q):null}catch(e){cw=null}
  if(!cw)cw={t:{},c:{}};
  wsub=false;wst=false;shopHome=false;render();window.scrollTo(0,0);
}
function hmTog(id){
  var t=new Date(),k='agw-'+iso(new Date(t.getFullYear(),t.getMonth(),t.getDate()-t.getDay())),W;
  try{W=JSON.parse(localStorage.getItem(k))}catch(e){W=null}
  if(!W)W={t:{},c:{}};
  W.c=W.c||{};W.c[id]=!W.c[id];
  try{localStorage.setItem(k,JSON.stringify(W))}catch(e){}
  render();
}
function homeTide(t){
  var td=tdGet(iso(t));
  if(!td)return '<p class="sub">Marées disponibles pour novembre et décembre 2026.</p>';
  var now=('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2),nx=-1;
  td.forEach(function(x,i){if(nx<0&&x.h>=now)nx=i});
  return '<div class="tdc">'+td.map(function(x,i){return '<span class="'+(i===nx?'nx':'')+'">'+(x.t==='h'?'▲':'▼')+' '+x.h+'</span>'}).join('')+'</div>';
}
function homeMoon(t){
  var t0=new Date(t.getFullYear(),t.getMonth(),t.getDate()),nx=null;
  Object.keys(FM).map(function(k){var p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2])}).sort(function(a,b){return a-b}).forEach(function(d){if(!nx&&d>=t0)nx=d});
  if(!nx)return '';
  var n=Math.round((nx-t0)/86400000);
  return '🌕 '+(n===0?'Pleine lune ce soir':n===1?'Pleine lune demain':'Pleine lune dans '+n+' jours')+' · '+nx.getDate()+' '+MONTHS[nx.getMonth()].toLowerCase();
}
function lastBk(){try{return parseInt(localStorage.getItem('ag-lastbk'),10)||0}catch(e){return 0}}
function homePage(){
  var t=new Date(),dow=t.getDay(),sun=new Date(t.getFullYear(),t.getMonth(),t.getDate()-dow),W;
  try{W=JSON.parse(localStorage.getItem('agw-'+iso(sun)))}catch(e){W=null}
  if(!W)W={t:{},c:{}};
  var hr=t.getHours(),hello=hr<12?'Bonjour':(hr<18?'Bon après-midi':'Bonsoir');
  var h='<div class="hm"><div class="hmh"><span class="vbk">'+hello+'</span><h1 class="hmt">'+DFULL[dow]+' '+t.getDate()+'</h1><div class="hms">'+MONTHS[t.getMonth()]+' '+t.getFullYear()+'</div><div class="dv"><i></i></div></div>';
  if(isBeach(t.getFullYear(),t.getMonth(),t.getDate()))h+='<div class="hmb">Jour de plage</div>';
  var p='',any=false;
  for(var k=0;k<5;k++){var id='p'+dow+k,tx=((W.t||{})[id]||'').trim();if(!tx)continue;any=true;var dn=(W.c||{})[id];p+='<div class="it'+(dn?' x':'')+'"><button class="ck" onclick="hmTog(\''+id+'\')">'+(dn?'×':'○')+'</button><span>'+esc(tx)+'</span></div>'}
  if(!any)p='<p class="sub">Rien de prévu pour aujourd’hui.</p>';
  h+=bx('Mes priorités',p+'<button class="lk" onclick="goTodayWeek()">Ouvrir ma semaine ›</button>');
  var R=(W.r||[]).filter(function(m){return !m.x}),mm='';
  R.slice(0,3).forEach(function(m){mm+='<div class="it"><span>♡ '+esc(m.t)+'</span></div>'});
  if(!R.length)mm='<p class="sub">Aucun repas prévu cette semaine.</p>';
  h+=bx('Repas',mm+'<button class="lk" onclick="goHomeShop(\'meal\')">Voir les repas ›</button>');
  h+=bx('Marées · Dominical',homeTide(t));
  var mn=homeMoon(t);if(mn)h+='<p class="hmm">'+mn+'</p>';
  var lb=lastBk();
  if(!lb||(Date.now()-lb>14*864e5))h+='<div class="hmb bk">Pense à sauvegarder ton agenda <button class="lk" onclick="openBk()">Sauvegarder</button></div>';
  return h+'<div class="hmf"><button class="lk" onclick="openBk()">Sauvegarde et restauration</button></div></div>';
}
function openBk(){bkMsg='';bkPend=null;ovOpen('backup')}
function bkCount(){var n=0,sz=0;try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^(ag|agw|agd)-/.test(k)&&k!=='ag-lastbk'){n++;sz+=(localStorage.getItem(k)||'').length}}}catch(e){}return [n,sz]}
function bkExport(){
  var d={};
  try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^(ag|agw|agd)-/.test(k)&&k!=='ag-lastbk')d[k]=localStorage.getItem(k)}}catch(e){}
  var json=JSON.stringify({app:'agenda',v:1,t:new Date().toISOString(),d:d}),fn='agenda-sauvegarde-'+iso(new Date())+'.json';
  if(!window.claude||!window.claude.use){
    try{
      var bl=new Blob([json],{type:'application/json'}),u=URL.createObjectURL(bl),a=document.createElement('a');
      a.href=u;a.download=fn;document.body.appendChild(a);a.click();
      setTimeout(function(){URL.revokeObjectURL(u);a.remove()},1500);
      try{localStorage.setItem('ag-lastbk',String(Date.now()))}catch(e){}
      bkMsg='✓ Sauvegarde téléchargée ('+Math.round(json.length/1024)+' Ko).';ovUI();render();
    }catch(e){bkMsg='Impossible d’enregistrer le fichier.';ovUI()}
    return;
  }
  window.claude.use('downloads').then(function(dl){
    if(!dl){bkMsg='La sauvegarde en fichier n’est pas disponible dans cette vue.';ovUI();return}
    return dl.save({filename:fn,data:json}).then(function(){
      try{localStorage.setItem('ag-lastbk',String(Date.now()))}catch(e){}
      bkMsg='✓ Sauvegarde enregistrée ('+Math.round(json.length/1024)+' Ko).';ovUI();render();
    }).catch(function(e){bkMsg=(e&&e.code==='declined')?'Sauvegarde annulée.':'Impossible d’enregistrer le fichier.';ovUI()});
  }).catch(function(){bkMsg='La sauvegarde en fichier n’est pas disponible ici.';ovUI()});
}
function bkPick(inp){
  var f=inp.files&&inp.files[0];if(!f)return;
  var r=new FileReader();
  r.onload=function(){
    try{var o=JSON.parse(r.result);if(!o||o.app!=='agenda'||!o.d)throw 0;bkPend=o;bkMsg=Object.keys(o.d).length+' éléments trouvés dans ce fichier ('+String(o.t||'').slice(0,10)+').'}
    catch(e){bkPend=null;bkMsg='Ce fichier n’est pas une sauvegarde valide.'}
    ovUI();
  };
  r.readAsText(f);
}
function reloadState(){
  try{var o=JSON.parse(localStorage.getItem('ag-vb'));VB=(o&&o.p)?o:{p:[],m:'',w:[],t:''}}catch(e){}
  try{BCH=JSON.parse(localStorage.getItem('ag-beach'))||{}}catch(e){BCH={}}
  CHG=chLoad();
}
function bkRestore(){
  if(!bkPend)return;
  try{Object.keys(bkPend.d).forEach(function(k){if(/^(ag|agw|agd)-/.test(k))localStorage.setItem(k,bkPend.d[k])})}catch(e){bkMsg='Espace insuffisant pour restaurer.';ovUI();return}
  bkPend=null;reloadState();bkMsg='✓ Sauvegarde restaurée.';ovUI();render();
}
function bkHTML(){
  var c=bkCount(),lb=lastBk();
  var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Sauvegarde</span><button onclick="ovClose()">✕</button></div>';
  h+='<p class="sub lft">Tes notes, photos, listes et dates sont gardées dans ce navigateur. Fais une sauvegarde de temps en temps pour ne rien perdre.</p>';
  h+='<p class="sm">'+c[0]+' éléments · '+Math.round(c[1]/1024)+' Ko</p>';
  h+='<p class="sub">'+(lb?'Dernière sauvegarde : '+new Date(lb).toLocaleDateString('fr-CA',{day:'numeric',month:'long'}):'Aucune sauvegarde pour le moment.')+'</p>';
  h+='<button class="addn" onclick="bkExport()">Exporter ma sauvegarde</button>';
  h+='<label class="addn alt">Restaurer depuis un fichier<input type="file" accept=".json,application/json" hidden onchange="bkPick(this)"></label>';
  if(bkPend)h+='<button class="addn" onclick="bkRestore()">Restaurer maintenant</button>';
  h+='<p class="bkm">'+esc(bkMsg)+'</p>';
  return h+'</div></div>';
}
var plusOpen=false;
function togPlus(){plusOpen=!plusOpen;render()}
var PLUSSVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
function cartBtn(){
  var rose='#ac727e';
  var I=[['Plage',WAVESVG,'#929093',"ovOpen('beach')"],['Marées',TIDESVG,'#707072',"ovOpen('tide')"],['Lune',MOONSVG,'#929093',"ovOpen('moon')"],['Bitcoin',BTCSVG,'#895a64',"ovOpen('btc')"],['Minuteur',HGSVG,'#c48f97',"tmOpen()"],['Calcul',CALCSVG,'#895a64',"ovOpen('calc')"],['Devises',FXSVG,'#707072',"ovOpen('fx')"],['Statistiques',STSVG,'#929093',"ovOpen('ystat')"]];
  function btn(label,svg,fn){return '<button class="ib" aria-label="'+label+'" style="--c:'+rose+';--c1:'+rose+'22;--c2:'+rose+'66" onclick="'+fn+'"><span class="ii">'+svg+'</span></button>'}
  var h='<div class="ibw topl">'+btn('Panier',CARTSVG,'goShopHome()')+btn('Plus',PLUSSVG,'togPlus()')+'</div><div class="ibw topr">'+btn('Recherche',SRSVG,"ovOpen('search')")+btn('Notes',NOTESVG,"ovOpen('note')")+'</div>';
  if(plusOpen)h+='<div class="pmenu">'+I.map(function(x){return '<button class="pmi" style="--c:'+x[2]+';--c1:'+x[2]+'22;--c2:'+x[2]+'66" onclick="plusOpen=false;render();'+x[3]+'"><span class="ii">'+x[1]+'</span><em>'+x[0]+'</em></button>'}).join('')+'</div>';
  return h;
}
function nextTide(t){
  var td=tdGet(iso(t)),now=('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2),nx=null,base=t;
  if(td)td.forEach(function(x){if(!nx&&x.h>=now)nx=x});
  if(!nx){var t2=new Date(t.getFullYear(),t.getMonth(),t.getDate()+1),td2=tdGet(iso(t2));if(td2&&td2.length){nx=td2[0];base=t2}}
  if(!nx)return null;
  var p=nx.h.split(':'),tg=new Date(base.getFullYear(),base.getMonth(),base.getDate(),+p[0],+p[1]);
  return {x:nx,m:Math.max(0,Math.round((tg-t)/60000))};
}
function homePage(){
  var t=new Date(),dow=t.getDay(),sun=new Date(t.getFullYear(),t.getMonth(),t.getDate()-dow),W;
  try{W=JSON.parse(localStorage.getItem('agw-'+iso(sun)))}catch(e){W=null}
  if(!W)W={t:{},c:{}};
  var hr=t.getHours(),hello=hr<12?'Bonjour':(hr<18?'Bon après-midi':'Bonsoir');
  var items=[],done=0;
  for(var k=0;k<5;k++){var id='p'+dow+k,tx=((W.t||{})[id]||'').trim();if(tx){var dn=!!(W.c||{})[id];if(dn)done++;items.push({id:id,t:tx,d:dn})}}
  var beach=isBeach(t.getFullYear(),t.getMonth(),t.getDate());
  var h='<div class="hm"><div class="hero"><div class="hg">'+hello+'</div><div class="hn">'+t.getDate()+'</div><div class="hd2">'+DFULL[dow]+'</div><div class="hm2">'+MONTHS[t.getMonth()]+' '+t.getFullYear()+'</div><div class="hch">'+(beach?'<span>🌊 Jour de plage</span>':'')+(items.length?'<span>✓ '+done+' / '+items.length+' priorités</span>':'')+'</div></div>';
  var pct=items.length?done/items.length:0;
  var ring=items.length?'<svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="20" fill="none" stroke="#f3e7e7" stroke-width="6"/><circle cx="28" cy="28" r="20" fill="none" stroke="#c48f97" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+(pct*125.66).toFixed(1)+' 126" transform="rotate(-90 28 28)"/><text x="28" y="33" text-anchor="middle" font-size="14" fill="#525156" font-family="Nunito,sans-serif" font-weight="700">'+done+'/'+items.length+'</text></svg>':'';
  h+='<section class="pc"><div class="pch"><h3>Mes priorités</h3>'+ring+'</div>';
  items.forEach(function(x){h+='<div class="pi'+(x.d?' dn':'')+'"><button class="pk'+(x.d?' on':'')+'" onclick="hmTog(\''+x.id+'\')">'+(x.d?'✓':'')+'</button><span>'+esc(x.t)+'</span></div>'});
  if(!items.length)h+='<p class="sub">Rien de prévu pour aujourd’hui.</p>';
  h+='<button class="lk" onclick="goTodayWeek()">Ouvrir ma semaine ›</button></section>';
  if(VB&&VB.m)h+='<div class="qc" onclick="cur=1;render()"><span>“</span>'+esc(VB.m)+'<span>”</span></div>';
  var nt=nextTide(t);
  if(nt){
    var hh=Math.floor(nt.m/60),mm=nt.m%60,when=hh>0?'dans '+hh+' h '+('0'+mm).slice(-2):'dans '+mm+' min';
    var td=tdGet(iso(t))||[];
    h+='<section class="tc"><div class="tl2">Marées · Dominical</div><div class="tb">'+(nt.x.t==='h'?'▲ Haute':'▼ Basse')+' <b>'+nt.x.h+'</b></div><div class="tw">'+when+'</div><div class="tr">'+td.map(function(x){return '<span>'+(x.t==='h'?'▲':'▼')+' '+x.h+'</span>'}).join('')+'</div></section>';
  }
  var mn=homeMoon(t);
  if(mn)h+='<section class="mc"><i class="mo"></i><div class="ml">Pleine lune</div><div class="mt2">'+mn.replace('🌕 ','').replace('Pleine lune ','')+'</div></section>';
  var lb=lastBk();
  if(!lb||(Date.now()-lb>14*864e5))h+='<div class="hmb bk">Pense à sauvegarder ton agenda <button class="lk" onclick="openBk()">Sauvegarder</button></div>';
  return h+'<div class="hmf"><button class="lk" onclick="openBk()">Sauvegarde et restauration</button></div></div>';
}
function thGet(){var d='My actions today will define my tomorrow 💕\n\nKeep moving & Shine 🌟';try{return localStorage.getItem('ag-thought')||d}catch(e){return d}}
function thSave(el){try{localStorage.setItem('ag-thought',el.innerText.trim())}catch(e){}}
function upDates(t){
  var out=[],t0=new Date(t.getFullYear(),t.getMonth(),t.getDate());
  for(var i=0;i<4;i++){
    var m=new Date(t.getFullYear(),t.getMonth()+i,1),L=load(m.getFullYear(),m.getMonth()).dates||[];
    L.forEach(function(o){var d=parseInt(o.d,10);if(!d)return;var dt=new Date(m.getFullYear(),m.getMonth(),d);if(dt.getMonth()!==m.getMonth()||dt<t0)return;out.push({dt:dt,t:o.t,k:o.k||'other'})});
  }
  out.sort(function(a,b){return a.dt-b.dt});
  return out;
}
function homeClassic(){
  var t=new Date(),t0=new Date(t.getFullYear(),t.getMonth(),t.getDate()),dow=t.getDay(),sun=new Date(t.getFullYear(),t.getMonth(),t.getDate()-dow),W;
  try{W=JSON.parse(localStorage.getItem('agw-'+iso(sun)))}catch(e){W=null}
  if(!W)W={t:{},c:{}};
  var hr=t.getHours(),hello=hr<12?'Bonjour':(hr<18?'Bon après-midi':'Bonsoir');
  var items=[],done=0;
  for(var k=0;k<5;k++){var id='p'+dow+k,tx=((W.t||{})[id]||'').trim();if(tx){var dn=!!(W.c||{})[id];if(dn)done++;items.push({id:id,t:tx,d:dn})}}
  var beach=isBeach(t.getFullYear(),t.getMonth(),t.getDate());
  var h='<div class="hm"><div class="hero"><div class="hg">'+hello+'</div><div class="hn">'+t.getDate()+'</div><div class="hd2">'+DFULL[dow]+'</div><div class="hm2">'+MONTHS[t.getMonth()]+' '+t.getFullYear()+'</div><div class="hch">'+(beach?'<span>🌊 Jour de plage</span>':'')+(items.length?'<span>✓ '+done+' / '+items.length+' priorités</span>':'')+'</div></div>';
  h+='<div class="qc" contenteditable="true" onblur="thSave(this)">'+esc(thGet())+'</div>';
  var ud=upDates(t).filter(function(x){return x.dt.getTime()===t0.getTime()}),dh='';
  ud.forEach(function(x){
    var n=Math.round((x.dt-t0)/86400000),when=n===0?'aujourd’hui':(n===1?'demain':'dans '+n+' jours'),ic=({cake:'🎂 ',drink:'🍵 ',leaf:'🌿 ',dog:'🐶 ',cat:'🐱 ',family:'👨‍👩‍👧 ',arr:'👨‍👩‍👧 ',dep:'👨‍👩‍👧 '})[x.k]||'';
    dh+='<div class="ud"><b class="ub k-'+x.k+'">'+x.dt.getDate()+'<small>'+MONTHS[x.dt.getMonth()].slice(0,3)+'</small></b><span>'+ic+esc(x.t)+'</span><i>'+when+'</i></div>';
  });
  if(!ud.length)dh='<p class="sub">Aucune date importante à venir.</p>';
  if(ud.length)h+=bx('Dates importantes',dh);
  var pct=items.length?done/items.length:0;
  var ring=items.length?'<svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="20" fill="none" stroke="#f3e7e7" stroke-width="6"/><circle cx="28" cy="28" r="20" fill="none" stroke="#c48f97" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+(pct*125.66).toFixed(1)+' 126" transform="rotate(-90 28 28)"/><text x="28" y="33" text-anchor="middle" font-size="14" fill="#525156" font-family="Nunito,sans-serif" font-weight="700">'+done+'/'+items.length+'</text></svg>':'';
  h+='<section class="pc"><div class="pch"><div><h3>Mes priorités</h3><small>'+(items.length?(done===items.length?'Tout est fait, bravo ♡':'Encore '+(items.length-done)+' à faire'):'Aujourd’hui')+'</small></div>'+ring+'</div>';
  items.forEach(function(x){h+='<div class="pi'+(x.d?' dn':'')+'"><button class="pk'+(x.d?' on':'')+'" onclick="hmTog(\''+x.id+'\')">'+(x.d?'✓':'')+'</button><span>'+esc(x.t)+'</span></div>'});
  if(!items.length)h+='<p class="sub">Rien de prévu pour aujourd’hui.</p>';
  h+='<button class="lk" onclick="goTodayWeek()">Ouvrir ma semaine ›</button></section>';
  var nt=nextTide(t);
  if(nt){
    var hh=Math.floor(nt.m/60),mm=nt.m%60,when=hh>0?'dans '+hh+' h '+('0'+mm).slice(-2):'dans '+mm+' min',td=tdGet(iso(t))||[];
    h+='<section class="tc"><div class="tl2">Marées · Dominical</div><div class="tb">'+(nt.x.t==='h'?'▲ Haute':'▼ Basse')+' <b>'+nt.x.h+'</b></div><div class="tw">'+when+'</div><div class="tr">'+td.map(function(x){return '<span>'+(x.t==='h'?'▲':'▼')+' '+x.h+'</span>'}).join('')+'</div></section>';
  }
  var mn=homeMoon(t);
  if(mn)h+='<p class="hmm2">'+mn+'</p>';
  var lb=lastBk();
  if(!lb||(Date.now()-lb>14*864e5))h+='<div class="hmb bk">Pense à sauvegarder ton agenda <button class="lk" onclick="openBk()">Sauvegarder</button></div>';
  return h+'<div class="hmf"><button class="lk" onclick="openBk()">Sauvegarde et restauration</button></div></div>';
}
function stClass(y,m,d){try{return ld(y,m,d).s?' str':''}catch(e){return ''}}
function tdc(o,y,m,d){
  var ts=o?KORD.filter(function(k){return o[k]}):[],x=(isBeach(y,m,d)?' bch':'')+stClass(y,m,d);
  if(ts.length>1)return ' class="imp multi'+x+'" style="--mbg:'+multiBg(ts)+'"';
  var c=((ts.length?'imp k-'+ts[0]:'')+x).trim();return c?' class="'+c+'"':'';
}
function bcls(dates,d){
  var ts=impTypes(dates,d),x=(isBeach(cy,cm,d)?' bch':'')+stClass(cy,cm,d);
  if(ts.length>1)return ' class="imp multi'+x+'" style="--mbg:'+multiBg(ts)+'"';
  var c=((ts.length?'imp k-'+ts[0]:'')+x).trim();return c?' class="'+c+'"':'';
}
var FXSVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.6 9.3c-.5-.8-1.5-1.3-2.6-1.3-1.5 0-2.6.8-2.6 1.9 0 2.6 5.2 1.3 5.2 3.9 0 1.1-1.1 1.9-2.6 1.9-1.3 0-2.3-.5-2.8-1.4M12 6.3V8M12 16v1.7"/></svg>';
var BLSVG='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6h10M10 12h10M10 18h10M3.5 6l1.2 1.2L7 4.8M3.5 12l1.2 1.2L7 10.8M3.5 18l1.2 1.2L7 16.8"/></svg>';
var FXR=(function(){var d={cad:1.40,crc:455,btc:76800};try{var o=JSON.parse(localStorage.getItem('ag-fx'));if(o)for(var k in o)if(o[k]>0)d[k]=o[k]}catch(e){}return d})(),fxFrom='USD',fxAmt='100';
function fxPer(){return {CAD:FXR.cad,USD:1,CRC:FXR.crc,BTC:1/FXR.btc}}
function fxFmt(c,v){
  if(!isFinite(v))return '—';
  try{
    if(c==='BTC')return '₿ '+v.toLocaleString('fr-CA',{maximumFractionDigits:8});
    if(c==='CRC')return '₡ '+v.toLocaleString('fr-CA',{maximumFractionDigits:0});
    return v.toLocaleString('fr-CA',{style:'currency',currency:c});
  }catch(e){return String(v)}
}
function fxRows(){
  var a=parseFloat(String(fxAmt).replace(/\s/g,'').replace(',','.')),P=fxPer(),usd=(isFinite(a)?a:0)/P[fxFrom],h='';
  ['CAD','USD','CRC','BTC'].forEach(function(c){h+='<div class="fxrow'+(c===fxFrom?' src':'')+'"><b>'+c+'</b><span>'+fxFmt(c,usd*P[c])+'</span></div>'});
  return h;
}
function fxCalc(){var a=document.getElementById('fxa'),f=document.getElementById('fxf'),r=document.getElementById('fxr');if(a)fxAmt=a.value;if(f)fxFrom=f.value;if(r)r.innerHTML=fxRows()}
function fxRate(k,el){var v=parseFloat(String(el.value).replace(/\s/g,'').replace(',','.'));if(v>0){FXR[k]=v;try{localStorage.setItem('ag-fx',JSON.stringify(FXR))}catch(e){}}fxCalc()}
function fxHTML(){
  var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Devises</span><button onclick="ovClose()">✕</button></div>';
  h+='<div class="fxin"><input id="fxa" inputmode="decimal" value="'+esc(fxAmt)+'" oninput="fxCalc()"><select id="fxf" onchange="fxCalc()">'+['CAD','USD','CRC','BTC'].map(function(c){return '<option value="'+c+'"'+(c===fxFrom?' selected':'')+'>'+c+'</option>'}).join('')+'</select></div>';
  h+='<div id="fxr">'+fxRows()+'</div><h4 class="mgl">Taux modifiables</h4>';
  h+='<div class="fxt"><span>1 USD =</span><input inputmode="decimal" value="'+FXR.cad+'" oninput="fxRate(\'cad\',this)"><span>CAD</span></div>';
  h+='<div class="fxt"><span>1 USD =</span><input inputmode="decimal" value="'+FXR.crc+'" oninput="fxRate(\'crc\',this)"><span>CRC</span></div>';
  h+='<div class="fxt"><span>1 BTC =</span><input inputmode="decimal" value="'+FXR.btc+'" oninput="fxRate(\'btc\',this)"><span>USD</span></div>';
  h+='<p class="sub">Taux de départ approximatifs : dollar canadien et colones vers juillet 2026, Bitcoin le 2 novembre 2026. Ajuste-les au taux de ta banque. Le Bitcoin sera en direct quand une source de prix sera connectée.</p>';
  return h+'</div></div>';
}
var blOn=false,blF='all',blIdeas=false,blPick=null;
var BL=(function(){try{var a=JSON.parse(localStorage.getItem('ag-bl'));if(a&&a.length!==undefined)return a}catch(e){}return[]})();
var BLI=['Voir un lever de soleil sur le Pacifique','Observer les baleines à Uvita','Surfer ma première vague','Parler espagnol couramment','Planter un jardin comestible','Voyager au Japon','Écrire un livre','Courir un demi-marathon','Dormir à la belle étoile','Voir des aurores boréales','Apprendre à plonger','Faire une retraite de yoga','Lire 50 livres','Cuisiner un grand repas pour mes proches','Visiter un volcan actif','Apprendre un instrument'];
function blS(){try{localStorage.setItem('ag-bl',JSON.stringify(BL))}catch(e){alert('Espace plein : impossible d’enregistrer.')}}
function blOpen(){blOn=true;render();window.scrollTo(0,0)}
function blBack(){blOn=false;render();window.scrollTo(0,0)}
function blAdd(t,y){t=(t||'').trim();if(!t)return;BL.push({t:t,y:y||'Un jour',d:''});blS()}
function blNew(){var t=document.getElementById('bln'),y=document.getElementById('bly');if(!t)return;blAdd(t.value,y?y.value:'');render()}
function blIdea(i){blAdd(BLI[i],'Un jour');render()}
function blTog(i){var it=BL[i];if(!it)return;it.d=it.d?'':iso(new Date());blS();if(it.d)confetti();render()}
function blDel(i){BL.splice(i,1);blS();if(blPick===i)blPick=null;render()}
function blFil(f){blF=f;render()}
function blTgI(){blIdeas=!blIdeas;render()}
function blSurp(){var td=[];BL.forEach(function(x,i){if(!x.d)td.push(i)});blPick=td.length?td[Math.floor(Math.random()*td.length)]:null;render()}
function fmtD(s){var p=s.split('-');return (+p[2])+' '+MONTHS[+p[1]-1].slice(0,3).toLowerCase()+'.'}
function confetti(){
  var cols=['#c48f97','#d9b0b6','#c48f97','#929093','#929093','#929093'],box=document.createElement('div');
  box.className='cfb';
  for(var i=0;i<38;i++){var p=document.createElement('i');p.style.cssText='--x:'+Math.round(Math.random()*340-170)+'px;--y:'+Math.round(-Math.random()*220-40)+'px;--r:'+Math.round(Math.random()*720-360)+'deg;background:'+cols[i%cols.length]+';animation-delay:'+Math.round(Math.random()*140)+'ms';box.appendChild(p)}
  document.body.appendChild(box);setTimeout(function(){if(box.parentNode)box.parentNode.removeChild(box)},1700);
}
function bucketPage(){
  var tot=BL.length,dn=BL.filter(function(x){return x.d}).length,pct=tot?dn/tot:0;
  var h='<div class="vbp"><button class="back" onclick="blBack()">← Vision board</button><div class="vbh"><span class="vbk">mes rêves à cocher</span><h1 class="vbt">Bucket list</h1><div class="dv"><i></i></div></div>';
  h+='<div class="blr"><svg width="86" height="86" viewBox="0 0 86 86"><circle cx="43" cy="43" r="34" fill="none" stroke="#f3e7e7" stroke-width="8"/><circle cx="43" cy="43" r="34" fill="none" stroke="#c48f97" stroke-width="8" stroke-linecap="round" stroke-dasharray="'+(pct*213.6).toFixed(1)+' 214" transform="rotate(-90 43 43)"/></svg><div><b>'+dn+' / '+tot+'</b><span>rêves réalisés</span></div></div>';
  
  
  if(false){
    h+='<div class="ddm"><div class="ih"><span>Touche une idée pour l’ajouter</span></div><div class="chips">'+BLI.map(function(t,i){var ex=BL.some(function(x){return x.t===t});return ex?'':'<span class="chip" onclick="blIdea('+i+')">'+esc(t)+'</span>'}).join('')+'</div></div>';
  }
  h+='<div class="blf">'+[['all','Tous'],['todo','À faire'],['done','Réalisés']].map(function(x){return '<button class="'+(blF===x[0]?'on':'')+'" onclick="blFil(\''+x[0]+'\')">'+x[1]+'</button>'}).join('')+'</div>';
  var shown=0;
  BL.forEach(function(x,i){
    if(blF==='todo'&&x.d)return;if(blF==='done'&&!x.d)return;
    shown++;
    h+='<div class="bli'+(x.d?' dn':'')+'"><button class="pk'+(x.d?' on':'')+'" onclick="blTog('+i+')">'+(x.d?'✓':'')+'</button><div class="blt"><span>'+esc(x.t)+'</span><small>'+esc(x.y)+(x.d?' · réalisé le '+fmtD(x.d):'')+'</small></div><button class="rm" onclick="blDel('+i+')">✕</button></div>';
  });
  if(!shown)h+='<p class="sub">'+(tot?'Rien ici pour le moment.':'Commence ta liste de rêves : écris-en un ou touche « Idées ».')+'</p>';
  h+='<div class="ad"><input id="bln" placeholder="Un nouveau rêve…" onkeydown="if(event.key===\'Enter\')blNew()"><select id="bly" class="ksel yr2"><option>Un jour</option><option>2026</option><option>2027</option><option>2028</option></select><button onclick="blNew()">+</button></div>';
  return h+'</div>';
}
var BLIMG='img-bl.webp';
KO=[['cake','🎂 Anniversaire','Anniversaire'],['drink','🍵 Kombucha','Kombucha'],['dog','🐶 Chien','Chien'],['cat','🐱 Chat','Chat'],['other','★ Autre','Date importante']];
function hasT(dates,d,k){return (dates||[]).some(function(o){return o.k===k&&parseInt(o.d,10)===d})}
function marks(h){return (h.family?'<i class="fmr"></i>':'')+(h.leaf?'<i class="lfd"></i>':'')}
function dg(dates,d){return (impTypes(dates,d).length>1?'<span class="dn">'+d+'</span>':String(d))+marks({family:hasT(dates,d,'family'),leaf:hasT(dates,d,'leaf')})}
function tdg(o,d,y,m){var ts=o?KORD.filter(function(k){return o[k]}):[];return (ts.length>1?'<span class="dn">'+d+'</span>':String(d))+marks(o||{})}
function datesSec(){
  var IC={cake:'🎂 ',drink:'🍵 ',leaf:'🌿 ',dog:'🐶 ',cat:'🐱 ',family:'👨‍👩‍👧 ',arr:'🧳 ',dep:'✈ ',other:''};
  var h='<section class="b"><h3 class="sc">Dates importantes</h3>';
  (cd.dates||[]).forEach(function(o,i){
    var k=o.k||'other';
    h+='<div class="it"><b class="dd kk k-'+k+'">'+esc(o.d||'')+'</b><span>'+(IC[k]||'')+dlbl(k,o.t)+esc(o.t)+'</span><button class="rm" onclick="del(\'dates\','+i+')">✕</button></div>';
  });
  h+='<div class="kgr">'+KO.map(function(o){return '<button type="button" class="kb'+(dkType===o[0]?' on':'')+'" data-k="'+o[0]+'" onclick="dkSel(\''+o[0]+'\')">'+o[1]+'</button>'}).join('')+'</div><div class="ad"><input id="d-dates" class="dn" inputmode="numeric" placeholder="Jour" onkeydown="if(event.key===\'Enter\')dadd()"></div>';
  h+='<div class="ad"><input id="t-dates" placeholder="Texte (facultatif)" onkeydown="if(event.key===\'Enter\')dadd()"><button onclick="dadd()">+</button></div></section>';
  return h;
}
var sm='ring';try{sm=localStorage.getItem('ag-sm')||'ring'}catch(e){}
document.documentElement.setAttribute('data-sm',sm);
function setSM(k){sm=k;try{localStorage.setItem('ag-sm',k)}catch(e){}document.documentElement.setAttribute('data-sm',k);render()}
function smBar(){var M=[['dot','Gros point'],['ring','Cercle'],['corner','Coin'],['heart','Cœur'],['star','Étoile']];return '<p class="sub lft">Repère sur le calendrier :</p><div class="smb">'+M.map(function(x){return '<button class="'+(sm===x[0]?'on':'')+'" onclick="setSM(\''+x[0]+'\')"><span class="spv '+x[0]+'">12</span>'+x[1]+'</button>'}).join('')+'</div>'}
KO=[['cake','🎂 Anniversaire','Anniversaire'],['drink','🍵 Kombucha','Kombucha'],['arr','🧳 Arrivée','Arrivée'],['dep','✈ Départ','Départ'],['family','👨‍👩‍👧 Famille','Famille'],['dog','🐶 Chien','Chien'],['cat','🐱 Chat','Chat'],['other','★ Autre','Date importante']];
function load(y,m){
  var o=null;
  try{var s=localStorage.getItem('ag-'+y+'-'+m);if(s)o=JSON.parse(s)}catch(e){}
  if(!o)o={q:'',goals:[],dates:[],books:[],shows:[],hl:[]};
  (o.dates||[]).forEach(function(x){if(x.k==='family'){if(/^arriv/i.test(x.t||''))x.k='arr';else if(/^d[eé]part/i.test(x.t||''))x.k='dep'}if(x.k==='leaf')x.k='other'});
  return o;
}
function marks(h){return (h.family?'<i class="fmr"></i>':'')+(h.arr?'<i class="crt arr"></i>':'')+(h.dep?'<i class="crt dep"></i>':'')+(h.leaf?'<i class="lfd"></i>':'')}
function dg(dates,d){return (impTypes(dates,d).length>1?'<span class="dn">'+d+'</span>':String(d))+marks({family:hasT(dates,d,'family'),arr:hasT(dates,d,'arr'),dep:hasT(dates,d,'dep'),leaf:hasT(dates,d,'leaf')})}
function datesSec(){
  var FAM='👨‍👩‍👧 ',IC={cake:'🎂 ',drink:'🍵 ',leaf:'🌿 ',dog:'🐶 ',cat:'🐱 ',family:FAM,arr:'🧳 ',dep:'✈ ',other:''};
  var h='<section class="b"><h3 class="sc">Dates importantes</h3>';
  (cd.dates||[]).forEach(function(o,i){
    var k=o.k||'other';
    h+='<div class="it"><b class="dd kk k-'+k+'">'+esc(o.d||'')+'</b><span>'+(IC[k]||'')+dlbl(k,o.t)+esc(o.t)+'</span><button class="rm" onclick="del(\'dates\','+i+')">✕</button></div>';
  });
  h+='<div class="kgr">'+KO.map(function(o){return '<button type="button" class="kb'+(dkType===o[0]?' on':'')+'" data-k="'+o[0]+'" onclick="dkSel(\''+o[0]+'\')">'+o[1]+'</button>'}).join('')+'</div><div class="ad"><input id="d-dates" class="dn" inputmode="numeric" placeholder="Jour" onkeydown="if(event.key===\'Enter\')dadd()"></div>';
  h+='<div class="ad"><input id="t-dates" placeholder="Texte (facultatif)" onkeydown="if(event.key===\'Enter\')dadd()"><button onclick="dadd()">+</button></div></section>';
  return h;
}
function smBar(){var M=[['dot','Gros point'],['ring','Cercle'],['corner','Coin'],['heart','Cœur'],['star','Étoile']];return '<p class="sub lft">Repère sur le calendrier :</p><div class="smb">'+M.map(function(x){return '<button class="'+(sm===x[0]?'on':'')+'" onclick="setSM(\''+x[0]+'\')"><span class="spv sp-'+x[0]+'">12</span>'+x[1]+'</button>'}).join('')+'</div>'}
var dsl=0,tsx=0,tsy=0,tst=0,tsOk=false;
function dnav(){
  var p=new Date(dy[0],dy[1],dy[2]-1),n=new Date(dy[0],dy[1],dy[2]+1);
  return '<div class="dnav"><button onclick="dayMove(-1)" aria-label="Jour précédent"><span>‹</span><small>'+p.getDate()+' '+MONTHS[p.getMonth()].slice(0,3).toLowerCase()+'</small></button><em>glisse pour tourner la page</em><button onclick="dayMove(1)" aria-label="Jour suivant"><small>'+n.getDate()+' '+MONTHS[n.getMonth()].slice(0,3).toLowerCase()+'</small><span>›</span></button></div>';
}
function dayMove(n){
  if(dk===null)return;
  var d=new Date(dy[0],dy[1],dy[2]+n);
  dy=[d.getFullYear(),d.getMonth(),d.getDate()];
  dday=ld(dy[0],dy[1],dy[2]);dsl=n;render();window.scrollTo(0,0);
}
document.addEventListener('touchstart',function(e){
  tsOk=(OV===null);
  if(!tsOk)return;
  var t=e.touches[0],el=e.target;
  tsx=t.clientX;tsy=t.clientY;tst=Date.now();
  if(el&&(el.tagName==='TEXTAREA'||el.tagName==='INPUT')&&el.selectionStart!==el.selectionEnd)tsOk=false;
},{passive:true});
document.addEventListener('touchend',function(e){
  if(!tsOk)return;
  try{if(window.getSelection&&String(window.getSelection()).length)return}catch(x){}
  var t=e.changedTouches[0],dx=t.clientX-tsx,dy2=t.clientY-tsy;
  if(Math.abs(dx)>80&&Math.abs(dx)>Math.abs(dy2)*2&&Date.now()-tst<700)swipeNav(dx<0?1:-1);
},{passive:true});
function stab(t){wtab=t;render();window.scrollTo(0,0)}
function wbar(){
  var T=[['fit','🏋️','Entraînement'],['med','🧘','Méditation']];
  return '<nav class="bb">'+T.map(function(x){return '<button class="'+(wtab===x[0]?'on':'')+'" onclick="stab(\''+x[0]+'\')"><span>'+x[1]+'</span>'+x[2]+'</button>'}).join('')+'</nav>';
}
function whead(t){
  var e=new Date(wd.getFullYear(),wd.getMonth(),wd.getDate()+6);
  return '<button class="back" onclick="bkW()">'+(shopHome?'← Retour':'← Semaine')+'</button><h2 class="mt">'+t+'</h2><div class="dv"><i></i></div><p class="wo">Semaine du '+wd.getDate()+' '+MONTHS[wd.getMonth()].toLowerCase()+' au '+e.getDate()+' '+MONTHS[e.getMonth()].toLowerCase()+'</p>';
}
function wp(id,ph,cls){return '<input class="wi'+(cls?' '+cls:'')+'" placeholder="'+ph+'" value="'+esc(cw.t[id]||'')+'" oninput="wt(\''+id+'\',this.value)">'}
function ta(id,ph){return '<textarea class="wn" placeholder="'+ph+'" oninput="wt(\''+id+'\',this.value)">'+esc(cw.t[id]||'')+'</textarea>'}
function sumF(){var n=0,m=0;for(var i=0;i<7;i++){if(cw.c['fx'+i])n++;m+=parseInt(cw.t['fd'+i],10)||0}return n+' séance(s) · '+m+' min'}
function sumM(){var n=0,m=0;for(var i=0;i<7;i++){if(cw.c['mx'+i])n++;m+=parseInt(cw.t['md'+i],10)||0}return n+' jour(s) · '+m+' min'}
function wsum(){var a=document.getElementById('sum-f'),b=document.getElementById('sum-m');if(a)a.textContent=sumF();if(b)b.textContent=sumM()}
function wday(i){var d=new Date(wd.getFullYear(),wd.getMonth(),wd.getDate()+i);return '<div class="dl">'+DN[i]+' <b>'+d.getDate()+'</b></div>'}
function weekFit(){
  var h=whead('Entraînement')+'<p class="sm" id="sum-f">'+sumF()+'</p>';
  h+=bx('Objectif de la semaine',wp('fg','Ex. 4 séances cette semaine'));
  for(var i=0;i<7;i++)h+='<div class="dc">'+wday(i)+'<div class="fr">'+wb('fx'+i,'ci')+wp('fa'+i,'Activité…')+wp('fd'+i,'min','dn2')+'</div></div>';
  return h+bx('Notes',ta('fn','Comment te sens-tu après l’effort ?'));
}
function weekMed(){
  var h=whead('Méditation')+'<p class="sm" id="sum-m">'+sumM()+'</p>';
  h+=bx('Intention de la semaine',wp('mi','Mon intention…'));
  for(var i=0;i<7;i++)h+='<div class="dc">'+wday(i)+'<div class="fr">'+wb('mx'+i,'ci')+wp('md'+i,'min','dn2')+wp('mn'+i,'Comment te sens-tu ?')+'</div></div>';
  return h+bx('Notes',ta('mz','Ce que tu as remarqué…'))+'<p class="fin">respire, tu fais de ton mieux</p>';
}
function weekPage(){
  return wst?weekStat():(wsub?weekShop():weekPlan());
}
function weekPlan(){
  var h='<button class="back" onclick="closeW()">← '+MONTHS[cm]+'</button>';
  
  var e=new Date(wd.getFullYear(),wd.getMonth(),wd.getDate()+6);
  var sm=wd.getMonth()===e.getMonth();h+='<p class="wo">Semaine du '+wd.getDate()+(sm?'':' '+MONTHS[wd.getMonth()].toLowerCase())+' au '+e.getDate()+' '+MONTHS[e.getMonth()].toLowerCase()+'</p>';h+=wkOverview();
  h+=postit();
  for(var i=0;i<7;i++){
    var dd=new Date(wd.getFullYear(),wd.getMonth(),wd.getDate()+i);
    h+='<div id="wd'+i+'" class="dc dcv'+i+(isTodayD(dd)?' today':'')+'"><div class="dl" style="cursor:pointer" onclick="openD('+dd.getFullYear()+','+dd.getMonth()+','+dd.getDate()+')">'+DN[i]+' <b>'+dd.getDate()+'</b><span class="dlr"><i>›</i></span></div><div class="dcols"><div><h5>Priorités</h5>'+rows('p'+i,5,'ci')+'</div></div></div>';
  }
  
  
  var hb='<div class="hr"><span style="flex:1"></span>';
  DAYS.forEach(function(d){hb+='<span class="hl">'+d+'</span>'});
  hb+='</div>';
  for(var k=0;k<5;k++){hb+='<div class="hr">'+wi('hn'+k);for(var j=0;j<7;j++)hb+=wb('h'+k+j,'ci');hb+='</div>'}
  
  
  
  return h;
}
var DFULL=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
function dkey(y,m,d){return 'agd-'+y+'-'+(m+1)+'-'+d}
function ld(y,m,d){try{var s=localStorage.getItem(dkey(y,m,d));if(s){var o=JSON.parse(s);o.p=o.p||[];return o}}catch(e){}return{ti:'',t:'',p:[],s:false}}
function hasD(y,m,d){var x=ld(y,m,d);return !!(x.t||x.ti||x.p.length)}
function dsave(){try{localStorage.setItem(dkey(dy[0],dy[1],dy[2]),JSON.stringify(dday));return true}catch(e){alert('Espace plein : impossible d’enregistrer cette photo.');return false}}
function openD(y,m,d){dy=[y,m,d];dday=ld(y,m,d);dk=1;render();window.scrollTo(0,0)}
var dkH=false;
function homeDay(y,m,d){dkH=true;openD(y,m,d)}
function closeD(){dk=null;dkH=false;render();window.scrollTo(0,0)}
function dtxt(f,v){dday[f]=v;dsave()}
function dstar(){dday.s=!dday.s;dsave();render()}
function dpd(i){dday.p.splice(i,1);dsave();render()}
function dph(inp){
  var files=Array.prototype.slice.call(inp.files),n=files.length;
  files.forEach(function(f){
    var r=new FileReader();
    r.onload=function(){
      var im=new Image();
      im.onload=function(){
        var s=Math.min(1,900/Math.max(im.width,im.height)),c=document.createElement('canvas');
        c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
        c.getContext('2d').drawImage(im,0,0,c.width,c.height);
        dday.p.push(c.toDataURL('image/jpeg',0.7));
        if(!dsave())dday.p.pop();
        if(--n===0)render();
      };
      im.src=r.result;
    };
    r.readAsDataURL(f);
  });
}
function dayPage(){
  var t0=new Date(dy[0],dy[1],dy[2]);
  var h='<button class="back" onclick="closeD()">← Retour</button>'+dnav();
  h+='<h2 class="mt">'+DFULL[t0.getDay()]+' <small>'+dy[2]+' '+MONTHS[dy[1]].toLowerCase()+' '+dy[0]+'</small></h2>'+(FM[dy[0]+'-'+(dy[1]+1)+'-'+dy[2]]?'<p class="sub">🌕 Pleine lune</p>':'');
  h+='<button class="star" onclick="dstar()">'+(dday.s?'<i class="rd"></i> Date marquée':'<i class="rd off"></i> Marquer cette date')+'</button>';
  h+='<input class="ti" placeholder="Titre de la journée…" value="'+esc(dday.ti||'')+'" oninput="dtxt(\'ti\',this.value)">';
  h+='<textarea class="wn dtx" placeholder="Écris ta journée…" oninput="dtxt(\'t\',this.value)">'+esc(dday.t||'')+'</textarea>';
  h+='<section class="b"><h3 class="sc">Photos</h3><div class="ph">';
  dday.p.forEach(function(src,i){h+='<div class="pi"><img src="'+src+'" alt=""><button onclick="dpd('+i+')">✕</button></div>'});
  return h+'<label class="add">+<input type="file" accept="image/*" multiple hidden onchange="dph(this)"></label></div></section>'+dnav();
}
var vbKey='ag-vb',pastY=2025,pastSub='cal';
var PASTSVG='<svg viewBox="0 0 100 100" width="26" height="26" style="display:block;margin:0 auto"><defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9b0b6"/><stop offset="1" stop-color="#ac727e"/></linearGradient></defs><path d="M24.54 75.46A36 36 0 1 0 15.23 40.68" fill="none" stroke="url(#pg)" stroke-width="10" stroke-linecap="round"/><polygon points="2,40 28.5,40 15.2,64" fill="url(#pg)" stroke="url(#pg)" stroke-width="4" stroke-linejoin="round"/></svg>';
function curYear(){var v=TABS[cur];return v==='Passé'?pastY:parseInt(v,10)}
function isPast(){return TABS[cur]==='Passé'}
function ldVB(k){try{var o=JSON.parse(localStorage.getItem(k));if(o&&o.p)return o}catch(e){}return{p:[],m:'',w:[],t:''}}
function vbUse(k){if(vbKey!==k){vbKey=k;VB=ldVB(k)}}
function vbS(){try{localStorage.setItem(vbKey,JSON.stringify(VB));return true}catch(e){alert('Espace plein : retire quelques photos pour en ajouter.');return false}}
function setPY(y){pastY=y;render();window.scrollTo(0,0)}
function setPS(k){pastSub=k;render()}
function pastPage(){
  var h='<div class="hmh"><div class="pastic">'+PASTSVG.replace('width="26" height="26"','width="44" height="44"')+'</div><h1 class="hmt">Memories</h1><div class="dv"><i></i></div><p class="sub">Mes années précédentes · les dates à ne pas oublier</p></div>';
  h+='<div class="ypl">'+[2022,2023,2024,2025].map(function(y){return '<button class="'+(pastY===y?'on':'')+'" onclick="setPY('+y+')">'+y+'</button>'}).join('')+'</div>';
  h+='<div class="seg"><button class="'+(pastSub==='cal'?'on':'')+'" onclick="setPS(\'cal\')">Calendrier</button><button class="'+(pastSub==='vb'?'on':'')+'" onclick="setPS(\'vb\')">Vision board</button></div>';
  if(pastSub==='vb'){vbUse('ag-vb-'+pastY);return h+'<div class="pastv">'+visionPage()+'</div>'}
  h+='<p class="sub">Touche un jour pour y garder un souvenir ou le marquer.</p><div class="grid g2" style="margin-top:12px">';
  for(var m=0;m<12;m++)h+=monthHTML(pastY,m);
  return h+'</div>';
}
var FAMI='👨‍👩‍👧 ',hlay='classic';
try{hlay=localStorage.getItem('ag-hl')||'classic'}catch(e){}
function setHL(k){hlay=k;try{localStorage.setItem('ag-hl',k)}catch(e){}render();window.scrollTo(0,0)}
function hlSwitch(){var L=[['classic','Classique'],['journal','Journal'],['tiles','Tuiles'],['focus','Focus']];return '<div class="hls"><span>Présentation</span>'+L.map(function(x){return '<button class="'+(hlay===x[0]?'on':'')+'" onclick="setHL(\''+x[0]+'\')">'+x[1]+'</button>'}).join('')+'</div>'}
function hmFoot(){
  var lb=lastBk(),h='';
  if(!lb||(Date.now()-lb>14*864e5))h+='<div class="hmb bk">Pense à sauvegarder ton agenda <button class="lk" onclick="openBk()">Sauvegarder</button></div>';
  return h+'<div class="hmf"><button class="lk" onclick="openBk()">Sauvegarde et restauration</button></div>';
}
function homeData(){
  var now=new Date(),t=hOff?new Date(now.getFullYear(),now.getMonth(),now.getDate()+hOff,12,0):now,t0=new Date(t.getFullYear(),t.getMonth(),t.getDate()),dow=t.getDay(),sun=new Date(t.getFullYear(),t.getMonth(),t.getDate()-dow),W;
  try{W=JSON.parse(localStorage.getItem('agw-'+iso(sun)))}catch(e){W=null}
  if(!W)W={t:{},c:{}};
  var hr=t.getHours(),D={t:t,dow:dow,hello:hOff?(hOff===-1?'Hier':(hOff===1?'Demain':(hOff<0?'Il y a '+(-hOff)+' jours':'Dans '+hOff+' jours'))):(hr<12?'Bonjour':(hr<18?'Bon après-midi':'Bonsoir')),items:[],done:0};
  for(var k=0;k<5;k++){var id='p'+dow+k,tx=((W.t||{})[id]||'').trim();if(tx){var dn=!!(W.c||{})[id];if(dn)D.done++;D.items.push({id:id,t:tx,d:dn})}}
  D.beach=isBeach(t.getFullYear(),t.getMonth(),t.getDate());
  var IC={cake:'🎂 ',drink:'🍵 ',leaf:'🌿 ',dog:'🐶 ',cat:'🐱 ',family:FAMI,arr:'🧳 ',dep:'✈ '};
  D.dates=upDates(t).filter(function(x){return x.dt.getTime()===t0.getTime()}).map(function(x){return {k:x.k,t:x.t,ic:IC[x.k]||''}});
  D.nt=hOff?null:nextTide(t);D.td=tdGet(iso(t))||[];
  var mn=homeMoon(t);D.moon=mn?mn.replace('🌕 ',''):'';
  D.q=thGet();D.c=W.c||{};
  if(D.nt){var hh=Math.floor(D.nt.m/60),mm=D.nt.m%60;D.when=hh>0?'dans '+hh+' h '+('0'+mm).slice(-2):'dans '+mm+' min'}
  return D;
}
function hmItems(D,cls){return D.items.map(function(x){return '<div class="'+cls+(x.d?' dn':'')+'"><button class="pk'+(x.d?' on':'')+'" onclick="hmTog(\''+x.id+'\')">'+(x.d?'✓':'')+'</button><span>'+esc(x.t)+'</span></div>'}).join('')}
function homeJournal(){
  var D=homeData(),t=D.t;
  var h='<div class="jr"><div class="jr-top"><span>'+D.hello+'</span><span>'+MONTHS[t.getMonth()]+' '+t.getFullYear()+'</span></div>';
  h+='<div class="jr-h"><div class="jr-day">'+DFULL[D.dow]+'</div><div class="jr-num">'+t.getDate()+'</div></div>';
  h+='<blockquote class="jr-q" contenteditable="true" onblur="thSave(this)">'+esc(D.q)+'</blockquote>';
  if(D.beach)h+='<div class="jr-s"><span class="jr-l">Aujourd’hui</span><div class="jr-v">🌊 Jour de plage</div></div>';
  if(D.dates.length)h+='<div class="jr-s"><span class="jr-l">À ne pas oublier</span>'+D.dates.map(function(x){return '<div class="jr-v">'+x.ic+esc(x.t)+'</div>'}).join('')+'</div>';
  h+='<div class="jr-s"><span class="jr-l">Priorités'+(D.items.length?' · '+D.done+'/'+D.items.length:'')+'</span>'+(D.items.length?hmItems(D,'jr-i'):'<div class="jr-v mut">Rien de prévu pour aujourd’hui.</div>')+'<button class="lk" onclick="goTodayWeek()">Ouvrir ma semaine ›</button></div>';
  var tl='';
  if(D.nt)tl+='<div class="jr-v">'+(D.nt.x.t==='h'?'▲ Marée haute ':'▼ Marée basse ')+'<b>'+D.nt.x.h+'</b> <span class="mut">'+D.when+'</span></div>';
  if(D.moon)tl+='<div class="jr-v mut">🌕 '+D.moon+'</div>';
  if(tl)h+='<div class="jr-s"><span class="jr-l">Dominical</span>'+tl+'</div>';
  return h+hmFoot()+'</div>';
}
function homeTiles(){
  var D=homeData(),t=D.t,pct=D.items.length?D.done/D.items.length:0,mm=D.moon.match(/dans (\d+) jours/);
  var ring='<svg width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="32" fill="none" stroke="#f3e7e7" stroke-width="9"/><circle cx="42" cy="42" r="32" fill="none" stroke="#ac727e" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+(pct*201).toFixed(1)+' 202" transform="rotate(-90 42 42)"/><text x="42" y="48" text-anchor="middle" font-size="20" font-weight="700" font-family="Nunito,sans-serif" fill="#525156">'+D.done+'/'+D.items.length+'</text></svg>';
  var h='<div class="tl"><div class="tl-hero tl-w2"><div><div class="tl-hi">'+D.hello+'</div><div class="tl-dd">'+DFULL[D.dow]+'</div><div class="tl-mm">'+MONTHS[t.getMonth()]+' '+t.getFullYear()+'</div></div><div class="tl-n">'+t.getDate()+'</div></div>';
  h+='<button class="tl-t tl-pr" onclick="goTodayWeek()">'+(D.items.length?ring:'<b>—</b>')+'<small>priorités</small></button>';
  h+='<div class="tl-t">'+(D.nt?'<small>marée</small><b>'+D.nt.x.h+'</b><span>'+(D.nt.x.t==='h'?'▲ haute':'▼ basse')+' · '+D.when+'</span>':'<small>marée</small><span>pas de données</span>')+'</div>';
  h+='<div class="tl-t"><small>pleine lune</small>'+(D.moon?'<b>'+(mm?mm[1]+' j':(D.moon.indexOf('demain')>=0?'demain':'ce soir'))+'</b><span>'+esc((D.moon.split('·')[1]||'').trim())+'</span>':'<span>—</span>')+'</div>';
  h+='<div class="tl-t"><small>à ne pas oublier</small>'+(D.dates.length?D.dates.map(function(x){return '<span class="tl-dt">'+x.ic+esc(x.t)+'</span>'}).join(''):(D.beach?'<span class="tl-dt">🌊 Jour de plage</span>':'<span>rien aujourd’hui</span>'))+'</div>';
  if(D.items.length)h+='<div class="tl-t tl-w2 tl-li">'+hmItems(D,'pi')+'</div>';
  h+='<div class="tl-q tl-w2" contenteditable="true" onblur="thSave(this)">'+esc(D.q)+'</div></div>';
  return h+hmFoot();
}
function homeFocus(){
  var D=homeData(),t=D.t,nx=null;
  D.items.forEach(function(x){if(!nx&&!x.d)nx=x});
  var h='<div class="hero"><div class="hg">'+D.hello+'</div><div class="hn">'+t.getDate()+'</div><div class="hd2">'+DFULL[D.dow]+'</div><div class="hm2">'+MONTHS[t.getMonth()]+' '+t.getFullYear()+'</div><div class="hch">'+(D.beach?'<span>🌊 Jour de plage</span>':'')+(D.items.length?'<span>✓ '+D.done+' / '+D.items.length+' priorités</span>':'')+'</div></div><div class="fc"><div class="fc-t fc-qt" contenteditable="true" onblur="thSave(this)">'+esc(D.q)+'</div><div class="dv"><i></i></div>'+actRows(D);
  if(nx){
    h+='<div class="fc-l">Ta priorité du moment</div><div class="fc-t">'+esc(nx.t)+'</div><button class="fc-b" onclick="hmTog(\''+nx.id+'\')">✓ C’est fait</button>';
    var left=D.items.length-D.done-1;
    if(left>0)h+='<div class="fc-m">+ '+left+' autre'+(left>1?'s':'')+' aujourd’hui</div>';
  }else if(D.items.length){h+='<div class="fc-l">Bravo</div><div class="fc-t">Tout est fait pour aujourd’hui ♡</div>'}
  else{h+='<div class="fc-l">Aujourd’hui</div><div class="fc-t">Rien de prévu : une belle journée libre.</div><button class="fc-b" onclick="goTodayWeek()">Planifier ma semaine</button>'}
  h+='<div class="fc-c">';
  if(D.beach)h+='<span>🌊 Jour de plage</span>';
  D.dates.forEach(function(x){h+='<span>'+x.ic+esc(x.t)+'</span>'});
  if(D.nt)h+='<span>'+(D.nt.x.t==='h'?'▲':'▼')+' '+D.nt.x.h+' · '+D.when+'</span>';
  if(D.moon)h+='<span>🌕 '+esc(D.moon.split('·')[0].replace('Pleine lune ','').trim())+'</span>';
  return h+'</div>'+hmFoot()+'</div>';
}
function homePage(){
  var f=hlay==='journal'?homeJournal:(hlay==='tiles'?homeTiles:(hlay==='focus'?homeFocus:homeClassic));
  return homeFocus();
}
function tdc(o,y,m,d){
  var ts=o?KORD.filter(function(k){return o[k]}):[],x=(isBeach(y,m,d)?' bch':'')+stClass(y,m,d)+(o&&o.leaf?' lf':'');
  if(ts.length>1)return ' class="imp multi'+x+'" style="--mbg:'+multiBg(ts)+'"';
  var c=((ts.length?'imp k-'+ts[0]:'')+x).trim();return c?' class="'+c+'"':'';
}
function bcls(dates,d){
  var ts=impTypes(dates,d),x=(isBeach(cy,cm,d)?' bch':'')+stClass(cy,cm,d)+(hasT(dates,d,'leaf')?' lf':'');
  if(ts.length>1)return ' class="imp multi'+x+'" style="--mbg:'+multiBg(ts)+'"';
  var c=((ts.length?'imp k-'+ts[0]:'')+x).trim();return c?' class="'+c+'"':'';
}
function yrHTML(){
  var y=curYear();if(!(y>0))y=new Date().getFullYear();
  var cache={},h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Statistiques · '+y+'</span><button onclick="ovClose()">✕</button></div>';
  var bm=[0,0,0,0,0,0,0,0,0,0,0,0],bc=0;
  Object.keys(BCH).forEach(function(k){var p=k.split('-');if(+p[0]===y){bc++;bm[+p[1]-1]++}});
  var mx=Math.max.apply(null,bm.concat([1]));
  h+='<h4 class="mgl">🌊 Plage · '+bc+' jour'+(bc>1?'s':'')+'</h4><div class="ysp">'+bm.map(function(c,m){return '<div class="ysb"><i style="height:'+Math.round(c*100/mx)+'%"></i><span>'+MONTHS[m].slice(0,1)+'</span></div>'}).join('')+'</div>';
  h+='<h4 class="mgl">Activités</h4>';
  ACT.forEach(function(a){
    var cnt=0,run=0,best=0;
    for(var m=0;m<12;m++){var n=new Date(y,m+1,0).getDate();for(var d=1;d<=n;d++){if(isDone(a[0],new Date(y,m,d),cache)){cnt++;run++;if(run>best)best=run}else run=0}}
    h+='<div class="yr"><b>'+a[1]+'</b><div class="pb"><div style="width:'+Math.round(cnt*100/365)+'%"></div></div><span>'+cnt+' j</span></div><div class="ysm">'+a[2]+' · meilleure série '+best+' j</div>';
  });
  var cn={},star=0,tot=0;
  for(var m2=0;m2<12;m2++){
    (load(y,m2).dates||[]).forEach(function(o){var k=o.k||'other';cn[k]=(cn[k]||0)+1;tot++});
    var n2=new Date(y,m2+1,0).getDate();
    for(var d2=1;d2<=n2;d2++)if(ld(y,m2,d2).s)star++;
  }
  var IC={cake:'🎂',drink:'🍵',arr:'🧳 arrivée',dep:'✈ départ',leaf:'🌿',dog:'🐶',cat:'🐱',family:FAMI+'famille',other:'★'};
  h+='<h4 class="mgl">Dates importantes · '+tot+'</h4><div class="chips">'+Object.keys(cn).map(function(k){return '<span class="chip">'+(IC[k]||k)+' '+cn[k]+'</span>'}).join('')+'<span class="chip">● marquées '+star+'</span></div>';
  return h+'</div></div>';
}
var PLC={cake:'#f3e7e7',drink:'#e8ced1',arr:'#525156',dep:'#929093',family:'#f3e7e7',leaf:'#e7e3e0',dog:'#c48f97',cat:'#e8ced1',other:'#e7e3e0',beach:'#d4d3d1',mark:'#ac727e'};
var PLO=['cake','drink','arr','dep','family','dog','cat','other','beach','mark'];
var pls='perle';try{pls=localStorage.getItem('ag-pl')||'perle'}catch(e){}
document.documentElement.setAttribute('data-pl',pls);
function setPL(k){pls=k;try{localStorage.setItem('ag-pl',k)}catch(e){}document.documentElement.setAttribute('data-pl',k);render()}
function plHtml(d,set){
  var ts=PLO.filter(function(k){return set[k]});
  if(!ts.length)return String(d);
  var cs=ts.map(function(k){return PLC[k]}),bg;
  if(cs.length===1)bg='linear-gradient('+cs[0]+','+cs[0]+')';
  else{var n=cs.length,a=[],i;for(i=0;i<n;i++)a.push(cs[i]+' '+(i*100/n)+'% '+((i+1)*100/n)+'%');bg=(pls==='aqua'?'linear-gradient(90deg,':'conic-gradient(from 0deg,')+a.join(',')+')'}
  return '<span class="pl'+(ts.length===1&&(ts[0]==='mark'||ts[0]==='arr'||ts[0]==='dep')?' pm':'')+'" style="--pbg:'+bg+'">'+d+'</span>';
}
function tdc(o,y,m,d){return ''}
function bcls(dates,d){return ''}
function tdg(o,d,y,m){
  var set={};
  if(o)Object.keys(o).forEach(function(k){if(PLC[k])set[k]=1});
  if(isBeach(y,m,d))set.beach=1;
  try{if(ld(y,m,d).s)set.mark=1}catch(e){}
  return plHtml(d,set);
}
function dg(dates,d){
  var set={};
  (dates||[]).forEach(function(o){if(parseInt(o.d,10)===d&&PLC[o.k||'other'])set[o.k||'other']=1});
  if(isBeach(cy,cm,d))set.beach=1;
  try{if(ld(cy,cm,d).s)set.mark=1}catch(e){}
  return plHtml(d,set);
}
function legend(){
  var L=[['beach','Plage'],['cake','Anniversaire'],['drink','Kombucha'],['arr','Arrivée'],['dep','Départ'],['family','Famille'],['dog','Chien'],['cat','Chat'],['other','Autre'],['mark','Marquée']];
  return '<div class="lgd">'+L.map(function(x){return '<span><i style="background:'+PLC[x[0]]+'"></i>'+x[1]+'</span>'}).join('')+'</div><div class="pls">'+[['pastille','Pastilles'],['perle','Perles'],['aqua','Aquarelle']].map(function(x){return '<button class="'+(pls===x[0]?'on':'')+'" onclick="setPL(\''+x[0]+'\')">'+x[1]+'</button>'}).join('')+'</div>';
}
function yearBody(y){var h='<div class="grid '+vm+'">';for(var m=0;m<12;m++)h+=monthHTML(y,m);return h+'</div>'+legend()}
var srQ='',srType='',srScope='year';
var SRSVG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
function srN(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function srYear(){var y=curYear();return y>0?y:new Date().getFullYear()}
function srYears(){return srScope==='all'?[2022,2023,2024,2025,2026,2027,2028]:[srYear()]}
function srEntries(){
  var ys=srYears(),out=[];
  ys.forEach(function(y){for(var m=0;m<12;m++)(load(y,m).dates||[]).forEach(function(o){var d=parseInt(o.d,10);if(d)out.push({k:o.k||'other',y:y,m:m,d:d,t:o.t||''})})});
  Object.keys(BCH).forEach(function(k){var p=k.split('-'),y=+p[0];if(ys.indexOf(y)>=0)out.push({k:'beach',y:y,m:+p[1]-1,d:+p[2],t:'Jour de plage'})});
  try{for(var i=0;i<localStorage.length;i++){
    var kk=localStorage.key(i);
    if(kk.indexOf('agd-')!==0)continue;
    var p2=kk.split('-'),y2=+p2[1];if(ys.indexOf(y2)<0)continue;
    var o2=JSON.parse(localStorage.getItem(kk))||{},m2=+p2[2]-1,d2=+p2[3];
    if(o2.s)out.push({k:'mark',y:y2,m:m2,d:d2,t:o2.ti||'Date marquée'});
    if(o2.ti||o2.t)out.push({k:'day',y:y2,m:m2,d:d2,t:(o2.ti||'')+((o2.ti&&o2.t)?' · ':'')+(o2.t||'').slice(0,80),raw:(o2.ti||'')+' '+(o2.t||'')});
  }}catch(e){}
  return out;
}
function srRows(){
  if(!srQ.trim()&&!srType)return '<p class="sub">Écris un mot (ex. marinade) : je cherche dans les journées, semaines, mois, notes, listes, bucket list et vision board.</p>';
  var q=srN(srQ),ent=srEntries().filter(function(e){
    if(srType){if(e.k!==srType)return false}
    else if(e.k==='mark')return false;
    if(q)return srN(e.raw||e.t).indexOf(q)>=0;
    return true;
  });
  ent.sort(function(a,b){return (b.y-a.y)||(b.m-a.m)||(b.d-a.d)});
  var rows='',n=ent.length;
  ent.slice(0,80).forEach(function(e){rows+='<div class="srr" onclick="srGo('+e.y+','+e.m+','+e.d+')"><i style="background:'+(PLC[e.k]||'#e8ced1')+'"></i><b>'+e.d+' '+MONTHS[e.m].slice(0,3).toLowerCase()+' '+e.y+'</b><span>'+esc(e.t)+'</span></div>'});
  if(q&&!srType){
    ldN().forEach(function(t){if(srN(t).indexOf(q)>=0){n++;rows+='<div class="srr" onclick="OV=null;ovUI();ovOpen(\'note\')"><i style="background:#e8ced1"></i><b>Note</b><span>'+esc(String(t).slice(0,90))+'</span></div>'}});
    BL.forEach(function(x){if(srN(x.t).indexOf(q)>=0){n++;rows+='<div class="srr" onclick="OV=null;ovUI();cur=1;blOn=true;render()"><i style="background:#e8ced1"></i><b>Bucket list</b><span>'+esc(x.t)+'</span></div>'}});
  }
  return '<p class="sm">'+n+' résultat'+(n>1?'s':'')+'</p>'+(rows||'<p class="sub">Aucun résultat.</p>');
}
function srIn(v){srQ=v;var r=document.getElementById('srr');if(r)r.innerHTML=srRows()}
function srT(k){srType=(srType===k)?'':k;ovUI()}
function srScp(k){srScope=k;ovUI()}
function srGo(y,m,d){OV=null;ovUI();yt();openD(y,m,d)}
function srHTML(){
  var T=[['beach','Plage'],['cake','Anniversaire'],['drink','Kombucha'],['arr','Arrivée'],['dep','Départ'],['family','Famille'],['dog','Chien'],['cat','Chat'],['other','Autre'],['mark','Marquée']];
  var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Recherche</span><button onclick="ovClose()">✕</button></div>';
  h+='<input id="srq" class="srin" placeholder="Chercher dans toute l’application…" value="'+esc(srQ)+'" oninput="srIn(this.value)">';
  h+='<div class="seg"><button class="'+(srScope==='year'?'on':'')+'" onclick="srScp(\'year\')">Année '+srYear()+'</button><button class="'+(srScope==='all'?'on':'')+'" onclick="srScp(\'all\')">Toutes les années</button></div>';
  h+='<p class="sub lft">Voir tous les ronds :</p><div class="srt">'+T.map(function(x){return '<button class="'+(srType===x[0]?'on':'')+'" onclick="srT(\''+x[0]+'\')"><i style="background:'+PLC[x[0]]+'"></i>'+x[1]+'</button>'}).join('')+'</div>';
  h+='<div id="srr">'+srRows()+'</div>';
  return h+'</div></div>';
}
var PLANKIMG='img-plank.webp';
var ACTH=[['fx','🏋️','Entraînement'],['wx','🚶‍♀️','Marche'],['yx','🧘‍♀️','Yoga'],['px','PLANK','Planche'],['mx','🪷','Méditation'],['sx','🇪🇸','Espagnol']];
function actIcon(a){return a[1]==='PLANK'?'<img class="pl2" src="'+PLANKIMG+'" alt="Planche">':a[1]}
ACT.splice(3,0,['px','<img class="pkm" src="'+PLANKIMG+'" alt="">','Planche']);
WST.splice(3,0,['px','<img class="pkm" src="'+PLANKIMG+'" alt="">','Planche']);
function actRows(D){
  function b(a){var on=!!(D.c||{})[a[0]+D.dow];return '<button class="actb'+(on?' on':'')+'" onclick="hmTog(\''+a[0]+D.dow+'\')"><span class="actc">'+actIcon(a)+'</span><em>'+a[2]+'</em></button>'}
  return '<div class="act"><div class="actr">'+ACTH.slice(0,4).map(b).join('')+'</div><div class="actr">'+ACTH.slice(4).map(b).join('')+'</div></div>';
}
function icons(i){
  return '<div class="ics">'+ACTH.map(function(x){return '<button class="ic'+(cw.c[x[0]+i]?' on':'')+'" title="'+x[2]+'" aria-label="'+x[2]+'" onclick="wc(\''+x[0]+i+'\',this)"><span>'+actIcon(x)+'</span></button>'}).join('')+'</div>';
}
var TRAMPIMG='img-tramp.webp';
ACTH=[['fx','🏋️','Entraînement'],['wx','🚶‍♀️','Marche'],['yx','🧘‍♀️','Yoga'],['px','PLANK','Planche'],['tp','TRAMP','Trampoline'],['mx','🪷','Méditation'],['sx','🇪🇸','Espagnol']];
var acl='rail';try{acl=localStorage.getItem('ag-al')||'rail'}catch(e){}
function setAL(k){acl=k;try{localStorage.setItem('ag-al',k)}catch(e){}render()}
function actIcon(a){return a[1]==='PLANK'?'<img class="pl2" src="'+PLANKIMG+'" alt="Planche">':(a[1]==='TRAMP'?'<img class="full" src="'+TRAMPIMG+'" alt="Trampoline">':a[1])}
ACT.splice(4,0,['tp','<img class="pkm tpi" src="'+TRAMPIMG+'" alt="">','Trampoline']);
WST.splice(4,0,['tp','<img class="pkm tpi" src="'+TRAMPIMG+'" alt="">','Trampoline']);
function actBtn(a,D,full){var on=!!(D.c||{})[a[0]+D.dow];return '<button class="actb'+(on?' on':'')+'" title="'+a[2]+'" aria-label="'+a[2]+'" onclick="hmTog(\''+a[0]+D.dow+'\')"><span class="actc">'+actIcon(a)+'</span>'+(full?'<em>'+a[2]+'</em>':'')+'</button>'}
function actRows(D){
  if(acl==='strip')return '<div class="act strip">'+ACTH.map(function(a){return actBtn(a,D,true)}).join('')+'</div>';
  return '<div class="act"><div class="actr">'+ACTH.slice(0,5).map(function(a){return actBtn(a,D,true)}).join('')+'</div><div class="actr">'+ACTH.slice(5).map(function(a){return actBtn(a,D,true)}).join('')+'</div></div>';
}
function actRail(D){return '<div class="rail">'+ACTH.map(function(a){return actBtn(a,D,false)}).join('')+'</div>'}
function actSwitch(){return '<div class="hls"><span>Icônes</span>'+[['rail','Rail'],['grid','Grille'],['strip','Bande']].map(function(x){return '<button class="'+(acl===x[0]?'on':'')+'" onclick="setAL(\''+x[0]+'\')">'+x[1]+'</button>'}).join('')+'</div>'}
function homeFocus(){
  var D=homeData(),t=D.t,nx=null;
  D.items.forEach(function(x){if(!nx&&!x.d)nx=x});
  var h='<div class="hero"><div class="hg">'+D.hello+'</div><div class="hn">'+t.getDate()+'</div><div class="hd2">'+DFULL[D.dow]+'</div><div class="hm2">'+MONTHS[t.getMonth()]+' '+t.getFullYear()+'</div><div class="hch">'+(D.beach?'<span>🌊 Jour de plage</span>':'')+(D.items.length?'<span>✓ '+D.done+' / '+D.items.length+' priorités</span>':'')+'</div>'+wxHero(t)+'</div>';
  var b='<div class="fc-t fc-qt" contenteditable="true" onblur="thSave(this)">'+esc(D.q)+'</div><div class="dv"><i></i></div>';
  if(acl!=='rail')b+=actRows(D);
  if(nx){
    b+='<div class="fc-l">Ta priorité du moment</div><div class="fc-t">'+esc(nx.t)+'</div><button class="fc-b" onclick="hmTog(\''+nx.id+'\')">✓ C’est fait</button>';
    var left=D.items.length-D.done-1;
    if(left>0)b+='<div class="fc-m">+ '+left+' autre'+(left>1?'s':'')+' aujourd’hui</div>';
  }else if(D.items.length){b+='<div class="fc-l">Bravo</div><div class="fc-t">Tout est fait pour aujourd’hui ♡</div>'}
  else{b+='<div class="fc-l">Aujourd’hui</div><div class="fc-t">Rien de prévu : une belle journée libre.</div><button class="fc-b" onclick="goTodayWeek()">Planifier ma semaine</button>'}
  b+='<div class="fc-c">';
  if(D.beach)b+='<span>🌊 Jour de plage</span>';
  D.dates.forEach(function(x){b+='<span>'+x.ic+esc(x.t)+'</span>'});
  if(D.nt)b+='<span>'+(D.nt.x.t==='h'?'▲':'▼')+' '+D.nt.x.h+' · '+D.when+'</span>';
  if(D.moon)b+='<span>🌕 '+esc(D.moon.split('·')[0].replace('Pleine lune ','').trim())+'</span>';
  b+='</div>';
  if(acl==='rail')h+='<div class="fc rl"><div class="hrow"><div class="hlc">'+b+'</div>'+actRail(D)+'</div>'+hmFoot()+'</div>';
  else h+='<div class="fc">'+b+hmFoot()+'</div>';
  return h+actSwitch();
}
acl='grid';
var DTL={cake:['Anniversaire','🎂','#f3e7e7','#f9f8f6'],drink:['Kombucha','🍵','#e8ced1','#f3e7e7'],arr:['Arrivée','🧳','#525156','#e7e3e0'],dep:['Départ','✈','#929093','#f1f0ee'],family:['Famille','👨‍👩‍👧','#f3e7e7','#f9f8f6'],leaf:['Plante','🌿','#e7e3e0','#f9f8f6'],dog:['Chien','🐶','#c48f97','#e8ced1'],cat:['Chat','🐱','#e8ced1','#f9f8f6'],other:['Date importante','★','#e7e3e0','#f9f8f6']};
function dateCard(x,soft){var m=DTL[x.k]||DTL.other;return '<div class="dcard'+(soft?' soft':'')+'" style="--dc:'+m[2]+';--dc2:'+m[3]+'"><span class="dc-i">'+m[1]+'</span><div class="dc-b"><small>'+(x.when||m[0])+'</small><div class="dc-t">'+esc(x.t)+'</div></div></div>'}
function datesBlock(D){
  var t=D.t,t0=new Date(t.getFullYear(),t.getMonth(),t.getDate());
  if(D.dates.length)return '<div class="dsec"><div class="dsec-h"><span>Dates importantes</span></div>'+D.dates.map(function(x){return dateCard(x,false)}).join('')+'</div>';
  return '';
}
function homeFocus(){
  var D=homeData(),t=D.t,nx=null;
  D.items.forEach(function(x){if(!nx&&!x.d)nx=x});
  var h='<div class="hero"><div class="hg">'+D.hello+'</div><div class="hn">'+t.getDate()+'</div><div class="hd2">'+DFULL[D.dow]+'</div><div class="hm2">'+MONTHS[t.getMonth()]+' '+t.getFullYear()+'</div><div class="hch">'+(D.beach?'<span>🌊 Jour de plage</span>':'')+(D.items.length?'<span>✓ '+D.done+' / '+D.items.length+' priorités</span>':'')+'</div>'+wxHero(t)+'</div>';
  var b='<div class="fc-t fc-qt" contenteditable="true" onblur="thSave(this)">'+esc(D.q)+'</div><div class="dv"><i></i></div>'+actRows(D)+datesBlock(D);
  if(nx){
    var left=D.items.length-D.done-1;
    b+='<div class="pr2"><div class="pr2-b"><small>Priorité du moment</small><div class="pr2-t">'+esc(nx.t)+'</div>'+(left>0?'<div class="pr2-m">+ '+left+' autre'+(left>1?'s':'')+' aujourd’hui</div>':'')+'</div><button class="pk" aria-label="Fait" onclick="hmTog(\''+nx.id+'\')"></button></div>';
  }else if(D.items.length){b+='<div class="pr2"><div class="pr2-b"><small>Priorités</small><div class="pr2-t">Tout est fait pour aujourd’hui ♡</div></div></div>'}
  else{b+='<div class="pr2"><div class="pr2-b"><small>Priorité du moment</small><div class="pr2-t">Rien de prévu aujourd’hui</div></div><button class="lk" onclick="goTodayWeek()">Planifier</button></div>'}
  b+='<div class="fc-c">';
  if(D.beach)b+='<span>🌊 Jour de plage</span>';
  if(D.nt)b+='<span>'+(D.nt.x.t==='h'?'▲':'▼')+' '+D.nt.x.h+' · '+D.when+'</span>';
  if(D.moon)b+='<span>🌕 '+esc(D.moon.split('·')[0].replace('Pleine lune ','').trim())+'</span>';
  b+='</div>';
  return h+'<div class="fc">'+b+hmFoot()+'</div>';
}
var hOff=0,wsl=0;
function tabForYear(y){var i=TABS.indexOf(String(y));if(i>=2)cur=i}
function slideView(n){var v=document.getElementById('view');if(!v)return;v.classList.remove('vsr','vsl');void v.offsetWidth;v.classList.add(n>0?'vsr':'vsl')}
function swipeNav(n){
  if(OV!==null)return;
  if(dk!==null&&(cur>1||dkH)){dayMove(n);return}
  if(cur>1&&wk!==null){if(!wsub&&!wst)weekMove(n);return}
  if(cur>1&&mo!==null){if(!ws)monthMove(n);return}
  if(cur>1&&ya===null){yearMove(n);return}
  if(cur===0)homeMove(n);
}
function weekMove(n){
  var s=new Date(wd.getFullYear(),wd.getMonth(),wd.getDate()+7*n);
  if(s.getFullYear()<2026||s.getFullYear()>2027)return;
  wd=s;wk=iso(s);cy=s.getFullYear();cm=s.getMonth();tabForYear(cy);
  try{var q=localStorage.getItem('agw-'+wk);cw=q?JSON.parse(q):null}catch(e){cw=null}
  if(!cw)cw={t:{},c:{}};
  render();slideView(n);window.scrollTo(0,0);
}
function monthMove(n){
  var d=new Date(cy,cm+n,1),y=d.getFullYear();
  if(y<2026||y>2027)return;
  cy=y;cm=d.getMonth();mo=cm;tabForYear(cy);cd=load(cy,cm);ws=false;
  render();slideView(n);window.scrollTo(0,0);
}
function yearMove(n){
  var y=curYear()+n;
  if(!(y>=2022&&y<=2027))return;
  if(y>=2026)cur=TABS.indexOf(String(y));else{cur=TABS.indexOf('Passé');pastY=y}
  render();slideView(n);window.scrollTo(0,0);
}
function homeMove(n){
  var now=new Date(),d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+hOff+n);
  if(d.getFullYear()<2026||d.getFullYear()>2027)return;
  hOff+=n;render();slideView(n);window.scrollTo(0,0);
}
function hmTog(id){
  var n=new Date(),t=new Date(n.getFullYear(),n.getMonth(),n.getDate()+hOff),k='agw-'+iso(new Date(t.getFullYear(),t.getMonth(),t.getDate()-t.getDay())),W;
  try{W=JSON.parse(localStorage.getItem(k))}catch(e){W=null}
  if(!W)W={t:{},c:{}};
  W.c=W.c||{};W.c[id]=!W.c[id];
  try{localStorage.setItem(k,JSON.stringify(W))}catch(e){}
  render();
}
function goTodayWeek(){
  var n=new Date(),t=new Date(n.getFullYear(),n.getMonth(),n.getDate()+hOff),s=new Date(t.getFullYear(),t.getMonth(),t.getDate()-t.getDay());
  yt();tabForYear(s.getFullYear());
  wd=s;wk=iso(s);cy=s.getFullYear();cm=s.getMonth();
  try{var q=localStorage.getItem('agw-'+wk);cw=q?JSON.parse(q):null}catch(e){cw=null}
  if(!cw)cw={t:{},c:{}};
  wsub=false;wst=false;shopHome=false;render();window.scrollTo(0,0);
}
function homeFocus(){
  var D=homeData(),t=D.t,nx=null;
  D.items.forEach(function(x){if(!nx&&!x.d)nx=x});
  var h='<div class="hero"><div class="hg">'+D.hello+'</div><div class="hdt" role="button" aria-label="Ouvrir la page du jour" onclick="homeDay('+t.getFullYear()+','+t.getMonth()+','+t.getDate()+')"><div class="hn">'+t.getDate()+'</div><div class="hd2">'+DFULL[D.dow]+'<span class="hdc">›</span></div><div class="hm2">'+MONTHS[t.getMonth()]+' '+t.getFullYear()+'</div></div><div class="hch">'+(hOff?'<span class="tdy" onclick="hOff=0;render()">Aujourd’hui ↺</span>':'')+'</div>'+wxHero(t)+'</div>';
  var b='<div class="fc-t fc-qt" contenteditable="true" onblur="thSave(this)">'+esc(D.q)+'</div><div class="dv"><i></i></div>'+actRows(D)+datesBlock(D);
  var todo=D.items.filter(function(x){return !x.d});
  if(todo.length){
    b+='<div class="pr2 prl"><div class="pr2-b"><small>Priorit\u00e9s du jour</small>'+todo.map(function(x){return '<div class="prr'+(x.d?' dn':'')+'"><button class="pk'+(x.d?' on':'')+'" aria-label="Fait" onclick="hmTog(\''+x.id+'\')">'+(x.d?'\u2713':'')+'</button><span>'+esc(x.t)+'</span></div>'}).join('')+'</div></div>';
  }else if(!D.items.length){b+='<div class="pr2"><div class="pr2-b"><small>Priorit\u00e9s du jour</small><div class="pr2-t">Rien de pr\u00e9vu</div></div><button class="lk" onclick="goTodayWeek()">Planifier</button></div>'}
  b+='<div class="fc-c">';
  if(D.nt)b+='<span>'+(D.nt.x.t==='h'?'▲':'▼')+' '+D.nt.x.h+' · '+D.when+'</span>';
  if(hOff)D.td.forEach(function(x){b+='<span>'+(x.t==='h'?'▲':'▼')+' '+x.h+'</span>'});
  if(D.moon){var md=(D.moon.split('·')[1]||'').trim();b+='<span>🌕 Pleine lune'+(md?' · '+esc(md):'')+'</span>'}
  b+='</div>';
  return h+'<div class="fc">'+b+hmFoot()+'</div>';
}
var WVSCENE='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="wvP" cx=".35" cy=".28" r=".95"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f3e7e7"/><stop offset="1" stop-color="#e8ced1"/></radialGradient><linearGradient id="wvF" gradientUnits="userSpaceOnUse" x1="14" y1="28" x2="86" y2="74"><stop offset="0" stop-color="#d9b0b6"/><stop offset="1" stop-color="#c48f97"/></linearGradient></defs><rect width="100" height="100" fill="url(#wvP)"/><ellipse cx="34" cy="22" rx="20" ry="9" fill="#fff" opacity=".55" transform="rotate(-25 34 22)"/><g fill="none" stroke="url(#wvF)" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 42q9 -10 18 0t18 0t18 0t18 0"/><path d="M14 62q9 -10 18 0t18 0t18 0t18 0"/></g></svg>';
function wvTog(y,m,d){var k=y+'-'+(m+1)+'-'+d;if(BCH[k])delete BCH[k];else BCH[k]=true;svB();render()}
