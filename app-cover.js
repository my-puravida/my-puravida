/* ===== Couverture + code a 4 chiffres (page 1 : couverture, page 2 : code) =====
   Charge en dernier. Affichee a chaque ouverture de l'application.
   Le code est garde (empreinte SHA-256) sous la cle 'cvr-hash', hors sauvegarde (la cle ne commence pas par ag-). */
(function(){
  var K='cvr-hash';
  var Q=["Prends soin de ton corps pour que ton âme ait envie d’y rester.","Chaque matin est une page blanche : écris-y avec douceur.","Respire. Tu es exactement où tu dois être.","La paix commence par un sourire à soi-même.","Ce que tu cultives en toi finit toujours par fleurir.","Un petit pas chaque jour vaut mieux qu’un grand saut un jour.","Sois douce avec toi : tu fais de ton mieux.","La gratitude transforme l’ordinaire en merveille.","Ralentis : l’essentiel ne se presse pas.","Ton énergie est précieuse, offre-la à ce qui te fait grandir.","Laisse la lumière entrer, même par les fissures.","Aujourd’hui, choisis la joie simple.","Ce qui t’appartient viendra à toi en son temps.","Tu es à la fois le jardin et la jardinière.","Écoute ton cœur : il connaît le chemin.","La vraie richesse, c’est le temps bien vécu.","Souris à la vie, elle te sourira en retour.","Chaque souffle est un nouveau départ.","Entoure-toi de beauté, intérieure comme extérieure.","Là où va ton attention, ta vie fleurit.","Le calme est une force silencieuse.","Aime-toi assez pour te choisir chaque jour.","Les plus belles choses se font sans hâte.","Pose tes valises : le moment présent suffit.","Rayonne, simplement parce que tu existes.","Un thé chaud, un cœur léger, une belle journée.","Fais confiance au rythme de ta vie.","Ta douceur est ta superpuissance.","Danse avec la vie, même quand la musique change.","Que cette journée soit légère et lumineuse.","Remercie le jour qui commence, il est un cadeau."];
  var J=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],MO=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

  var st=document.createElement('style');
  st.textContent='#cvr{position:fixed;inset:0;z-index:10100;background:#161517;overflow:hidden;transition:opacity .5s;-webkit-tap-highlight-color:transparent}'
   +'#cvr.out{opacity:0;pointer-events:none}'
   +'#cvr .bk{position:absolute;inset:0;background:url(img-cover.webp) center/cover;filter:blur(18px) brightness(.5);transform:scale(1.15)}'
   +'#cvr .pg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .5s;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px);box-sizing:border-box}'
   +'#cvr .pg.off{opacity:0;pointer-events:none}'
   +'#cvr #cv1{position:relative;width:min(100vw,calc((100svh - 100px) * .948));aspect-ratio:896/945;container-type:inline-size;background:url(img-cover.webp) center/100% 100% no-repeat;cursor:pointer}'
   +'#cvr .cvs{position:absolute;left:0;top:0;width:100%;height:100%}'
   +'#cvr #cvq{position:absolute;left:24.5%;width:51%;top:82.8%;height:9.4%;display:flex;align-items:center;justify-content:center;text-align:center;color:#39393b;font:italic 600 3.9cqw/1.18 "Cormorant Garamond",Georgia,serif;overflow:hidden}'
   +'#cvr .cvh{margin-top:18px;color:#fff;background:rgba(40,28,32,.6);padding:9px 20px;border-radius:99px;font:14px Georgia,serif;letter-spacing:.04em}'
   +'#cvr #cv2{justify-content:flex-start;padding-top:calc(14vh + env(safe-area-inset-top,0px))}'
   +'#cvr #cvt{font:italic 600 46px/1 "Cormorant Garamond",Georgia,serif;color:#f4dfe0;text-align:center;margin-bottom:26px;text-shadow:0 2px 14px rgba(0,0,0,.5)}'
   +'#cvr #cvt small{display:block;margin-top:10px;font:500 13px Georgia,serif;letter-spacing:.3em;text-transform:uppercase;color:#e0b9bd}'
   +'#cvr #cvp{position:relative;width:min(100vw,560px);aspect-ratio:896/250;container-type:inline-size;background:url(img-code.webp) center/100% 100% no-repeat;-webkit-mask-image:linear-gradient(to bottom,transparent,#000 9%,#000 91%,transparent),linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);-webkit-mask-composite:source-in;mask-image:linear-gradient(to bottom,transparent,#000 9%,#000 91%,transparent),linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);mask-composite:intersect}'
   +'#cvr #cvp.sh{animation:cvsh .4s}@keyframes cvsh{20%{transform:translateX(-14px)}40%{transform:translateX(14px)}60%{transform:translateX(-9px)}80%{transform:translateX(9px)}}'
   +'#cvr .dot{position:absolute;width:4.4cqw;height:4.4cqw;margin:-2.2cqw 0 0 -2.2cqw;top:66%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#d9a0a8,#9a5560);box-shadow:0 .3cqw .8cqw rgba(90,40,50,.4);transform:scale(0);transition:transform .15s}'
   +'#cvr .dot.on{transform:scale(1)}'
   +'#cvr #cvi{position:absolute;left:27%;width:37%;top:50%;height:34%;opacity:0;font-size:16px;border:0;padding:0;margin:0;cursor:pointer;z-index:3}'
   +'#cvr #cvk{position:absolute;left:77.5%;top:62.6%;width:12cqw;height:12cqw;margin:-6cqw 0 0 -6cqw;border:0;border-radius:50%;background:transparent;cursor:pointer;z-index:3}'
   +'#cvr #cvm{margin-top:14px;min-height:34px;padding:8px 20px;border-radius:99px;background:rgba(40,28,32,.78);color:#fff;font:15px Georgia,serif;opacity:0;transition:opacity .25s;box-sizing:border-box}'
   +'#cvr #cvm.on{opacity:1}';
  document.head.appendChild(st);
  if(!document.getElementById('cvr-font')){var lk=document.createElement('link');lk.id='cvr-font';lk.rel='stylesheet';lk.href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Cormorant+Garamond:ital,wght@1,500;1,600&display=swap';document.head.appendChild(lk)}

  var d=new Date(),doy=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);
  var o=document.createElement('div');o.id='cvr';
  o.innerHTML='<div class="bk"></div>'
   +'<div class="pg" id="cv-p1"><div id="cv1"><svg class="cvs" viewBox="0 0 896 945" fill="#39393b" font-family="\'Playfair Display\',Didot,Georgia,serif" text-anchor="middle">'
   +'<text x="448" y="172" font-size="106" font-weight="600" style="font-variant-numeric:lining-nums">'+d.getDate()+'</text>'
   +'<text x="455" y="213" font-size="40" font-weight="500" letter-spacing="7">'+J[d.getDay()].toUpperCase()+'</text>'
   +'<text x="450" y="244" font-size="26" font-weight="500" letter-spacing="2" style="font-variant-numeric:lining-nums">'+(MO[d.getMonth()]+' '+d.getFullYear()).toUpperCase()+'</text></svg>'
   +'<div id="cvq"><span id="cvs"></span></div></div><div class="cvh">Touchez pour ouvrir</div></div>'
   +'<div class="pg off" id="cv-p2"><div id="cvt">Marilyn<small>Mon agenda</small></div><div id="cvp">'
   +'<i class="dot" style="left:32.1%"></i><i class="dot" style="left:41.2%"></i><i class="dot" style="left:50.5%"></i><i class="dot" style="left:60.2%"></i>'
   +'<input id="cvi" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" aria-label="Code à 4 chiffres"><button id="cvk" aria-label="Valider le code"></button></div><div id="cvm"></div></div>';
  /* le balayage de l'application ne doit pas agir derriere la couverture */
  ['touchstart','touchend','touchmove'].forEach(function(ev){o.addEventListener(ev,function(e){e.stopPropagation()},{passive:true})});
  document.body.appendChild(o);
  function $(i){return document.getElementById(i)}
  $('cvs').textContent=Q[doy%Q.length];
  function fit(){var b=$('cvq'),s=$('cvs');b.style.fontSize='';var f=parseFloat(getComputedStyle(b).fontSize);s.style.display='block';while(s.scrollHeight>b.clientHeight+1&&f>8){f-=.5;b.style.fontSize=f+'px'}}
  fit();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);window.addEventListener('resize',fit);

  var inp=$('cvi'),dots=o.querySelectorAll('.dot'),pill=$('cvm'),mode,first,tm;
  function say(t,ms){pill.textContent=t;pill.classList.add('on');clearTimeout(tm);if(ms)tm=setTimeout(function(){pill.classList.remove('on')},ms)}
  function hash(s){var e=new TextEncoder().encode('agenda-cover:'+s);return crypto.subtle.digest('SHA-256',e).then(function(b){return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')})}
  function get(){try{return localStorage.getItem(K)}catch(e){return null}}
  function set(v){try{localStorage.setItem(K,v)}catch(e){}}
  function paint(){for(var i=0;i<dots.length;i++)dots[i].classList.toggle('on',i<inp.value.length)}
  function init(){mode=get()?'enter':'create';inp.value='';paint();if(mode==='create')say('Choisis ton code à 4 chiffres',0);else pill.classList.remove('on')}
  function bad(t){var p=$('cvp');p.classList.remove('sh');void p.offsetWidth;p.classList.add('sh');say(t,2200);inp.value='';paint()}
  function done(){inp.blur();o.classList.add('out');setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o)},600)}
  function submit(){
    var v=inp.value;if(v.length<4)return say('Entre les 4 chiffres',1800);
    hash(v).then(function(h){
      if(mode==='enter'){h===get()?done():bad('Code incorrect')}
      else if(mode==='create'){first=h;mode='confirm';inp.value='';paint();say('Confirme ton code',0)}
      else{if(h===first){set(h);done()}else{mode='create';bad('Codes différents, recommence')}}
    });
  }
  inp.addEventListener('input',function(){inp.value=inp.value.replace(/\D/g,'').slice(0,4);paint();if(inp.value.length===4)setTimeout(submit,200)});
  $('cvk').addEventListener('click',submit);
  $('cv1').addEventListener('click',function(){$('cv-p1').classList.add('off');$('cv-p2').classList.remove('off');init();setTimeout(function(){inp.focus()},550)});
})();
