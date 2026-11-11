(function(){function f(e){var c=e.getAttribute("data-css");if(c!==null){e.style.cssText+=";"+c;e.removeAttribute("data-css")}}function ap(r){if(r.nodeType===1&&r.hasAttribute("data-css"))f(r);if(r.querySelectorAll){var l=r.querySelectorAll("[data-css]");for(var i=0;i<l.length;i++)f(l[i])}}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)ap(a[j])}}).observe(document.documentElement,{childList:true,subtree:true});ap(document)})();

(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* header border */
  var tb=$("#topbar");
  window.addEventListener("scroll",function(){tb.classList.toggle("scrolled",window.scrollY>8)},{passive:true});

  /* ---------- search moment ---------- */
  var q="dentista shilin", qEl=$("#q"), res=$("#results");
  if(reduce){qEl.textContent=q;res.classList.add("found")}
  else{
    var i=0;
    setTimeout(function type(){
      qEl.textContent=q.slice(0,++i);
      if(i<q.length)setTimeout(type,140+Math.random()*90);
      else setTimeout(function(){res.classList.add("found")},500);
    },700);
  }

  /* turnos: ver /turnos/turnos.js */
  /* ---------- style illustrations ---------- */
  var tooth='M38 18c-11 0-19 8-19 21 0 10 3 16 5 24 3 11 4 32 12 32 7 0 7-20 11-26 2-3 5-4 13-4s11 1 13 4c4 6 4 26 11 26 8 0 9-21 12-32 2-8 5-14 5-24 0-13-8-21-19-21-8 0-12 5-22 5s-14-5-22-5z';
  var art={
    fresh:'<svg viewBox="0 0 120 120"><circle cx="60" cy="62" r="52" fill="#CFEAF0"/><path d="'+tooth+'" transform="translate(0 4)" fill="#fff" stroke="#1A8FA3" stroke-width="3"/><path d="M93 22l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#1A8FA3"/><path d="M24 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#7CC7D6"/></svg>',
    family:'<svg viewBox="0 0 120 120"><circle cx="86" cy="30" r="14" fill="#FFB36B"/><path d="M8 112c4-28 20-44 38-44s34 16 38 44z" fill="#E2763A"/><circle cx="46" cy="50" r="16" fill="#F4C6A0"/><path d="M60 112c3-18 14-28 26-28s23 10 26 28z" fill="#F2A05F"/><circle cx="86" cy="72" r="11" fill="#F4C6A0"/><path d="M40 54c3 4 9 4 12 0M81 74c2 3 7 3 10 0" stroke="#4A3426" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
    luxe:'<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" fill="none" stroke="#C9A96A" stroke-width="1.2"/><circle cx="60" cy="60" r="38" fill="none" stroke="#3A3128" stroke-width="1"/><path d="M28 56c10 20 54 20 64 0" fill="none" stroke="#C9A96A" stroke-width="2.5" stroke-linecap="round"/><path d="M38 58v6M48 61v8M60 62v8M72 61v8M82 58v6" stroke="#EDE3D1" stroke-width="1.6" stroke-linecap="round"/><path d="M60 18l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" fill="#C9A96A"/></svg>',
    kids:'<svg viewBox="0 0 120 120"><path d="'+tooth+'" fill="#fff" stroke="#2A2F6B" stroke-width="3.5"/><circle cx="47" cy="48" r="4.5" fill="#2A2F6B"/><circle cx="73" cy="48" r="4.5" fill="#2A2F6B"/><path d="M48 60c5 7 19 7 24 0" fill="none" stroke="#2A2F6B" stroke-width="3.5" stroke-linecap="round"/><circle cx="40" cy="58" r="4" fill="#FF8FA3"/><circle cx="80" cy="58" r="4" fill="#FF8FA3"/><path d="M100 14l3.5 7 7.5 1-5.5 5 1.5 7.5-7-3.5-7 3.5 1.5-7.5-5.5-5 7.5-1z" fill="#5B5BD6"/><path d="M14 88l2.5 5 5.5.8-4 3.8 1 5.4-5-2.6-5 2.6 1-5.4-4-3.8 5.5-.8z" fill="#fff"/></svg>',
    implant:'<svg viewBox="0 0 120 120"><path d="M0 70h120" stroke="#3D7BFA" stroke-width="1" stroke-dasharray="3 4"/><path d="M38 20c0-6 6-10 22-10s22 4 22 10l-2 26c-1 6-6 10-20 10s-19-4-20-10z" fill="#fff" stroke="#9FB0C8" stroke-width="2"/><rect x="52" y="56" width="16" height="8" fill="#9FB0C8"/><path d="M50 64h20l-2 46H52z" fill="#3D7BFA"/><path d="M48 72h24M49 80h22M50 88h20M51 96h18M52 104h16" stroke="#16202E" stroke-width="2.5"/><path d="M86 30h22M86 60h22M86 92h22" stroke="#9FB0C8" stroke-width="1.5"/><circle cx="84" cy="30" r="2" fill="#fff"/><circle cx="84" cy="60" r="2" fill="#fff"/><circle cx="84" cy="92" r="2" fill="#fff"/></svg>',
    classic:'<svg viewBox="0 0 120 120"><rect x="16" y="40" width="88" height="70" fill="#F7F2E7"/><path d="M10 40h100l-8-16H18z" fill="#B23A2E"/><path d="M18 40v8M34 40v8M50 40v8M66 40v8M82 40v8M98 40v8" stroke="#F7F2E7" stroke-width="4"/><rect x="34" y="10" width="52" height="16" rx="2" fill="#F7F2E7" stroke="#D7C9A8" stroke-width="2"/><text x="60" y="22.5" text-anchor="middle" font-size="10" font-weight="900" fill="#2E4934" font-family="Noto Serif TC,serif">Renhe Dental</text><rect x="26" y="60" width="28" height="50" fill="#2E4934"/><rect x="64" y="60" width="30" height="26" fill="#D7C9A8"/><path d="M79 60v26M64 73h30" stroke="#F7F2E7" stroke-width="2"/></svg>'
  };

  var styles=[
    {k:"fresh",n:"Fresco y profesional",tag:"General",f:"Para odontología general, familias jóvenes y gente que trabaja.",name:"Sunny Dental",h:"Ir al dentista, sin estrés",b:"Turnos online",g:["Limpieza","Arreglo","Ortodoncia"],url:"sunny-dental.tw",l:["Turquesa claro: limpio y tranquilizador","Mucho espacio en blanco, todo fácil de encontrar","Una primera impresión profesional y moderna"]},
    {k:"family",n:"Cálido y familiar",tag:"De barrio",f:"Para clínicas de barrio donde va toda la familia.",name:"Little Orange Dental",h:"Los dientes de toda la familia, en buenas manos",b:"Turno de limpieza familiar",g:["Niños","Limpieza","Prótesis"],url:"orange-dental.tw",l:["Naranja cálido y formas redondeadas","Un tono cercano, como de vecino","Para clínicas que cuidan la relación a largo plazo"]},
    {k:"luxe",n:"Estética premium",tag:"Estética",f:"Para blanqueamiento, carillas, coronas de cerámica y otros tratamientos estéticos.",name:"ÉCLAT Estética Dental",h:"Una sonrisa segura empieza por los detalles",b:"Consulta personalizada",g:["Carillas","Blanqueamiento","Cerámica"],url:"eclat-smile.tw",l:["Fondo oscuro con líneas doradas","Diseño y letra estilo boutique","La sensación de un tratamiento premium"]},
    {k:"kids",n:"Odontopediatría",tag:"Para chicos",f:"Para odontopediatría y clínicas pensadas para chicos.",name:"Rainbow Kids Dental",h:"Pequeños valientes que no le temen al dentista",b:"Turno para mi hijo",g:["Flúor","Selladores","Niños"],url:"rainbow-kids.tw",l:["Amarillo y violeta alegres","Un personaje diente propio y simpático","Chicos contentos, padres tranquilos"]},
    {k:"implant",n:"Implantes",tag:"Especialista",f:"Para implantes, ortodoncia y especialidades que necesitan imagen de autoridad.",name:"Centro de Implantes Hengda",h:"Equipo especialista, evaluación completa",b:"Evaluación de implantes",g:["Implante","Injerto óseo","Rehabilitación completa"],url:"hengda-implant.tw",l:["Azul profundo y líneas precisas","Destaca formación y equipamiento","Transmite autoridad de especialista"]},
    {k:"classic",n:"Clásico de barrio",tag:"De confianza",f:"Para clínicas con muchos años que crecieron de boca en boca.",name:"Clínica Dental Renhe",h:"Hace 30 años cuidando las sonrisas del barrio",b:"Horarios",g:["General","Prótesis","Limpieza"],url:"renhe-dental.tw",l:["Verde oscuro, crema y cartel rojo","Destaca la historia y la reputación en el barrio","Conserva la calidez del cartel de siempre"]}
  ];
  function site(s){
    return '<div class="frame-bar"><i></i><i></i><i></i><span>'+s.url+'</span></div>'+
      '<div class="mini"><div class="ms t-'+s.k+'">'+
        '<div class="ms-nav"><span class="ms-logo"><i></i>'+s.name+'</span><span class="ms-links"><span>Tratamiento</span><span>Equipo</span><span>Turnos</span></span></div>'+
        '<div class="ms-hero"><div><b>'+s.h+'</b><small>Lun a sáb · mañana, tarde y noche</small><span class="ms-btn">'+s.b+'</span></div><div class="ms-art">'+art[s.k]+'</div></div>'+
        '<div class="ms-cards">'+s.g.map(function(x){return "<span><i></i>"+x+"</span>"}).join("")+'</div>'+
        '<div class="ms-hours"><span>Mañana 9:00</span><span>Tarde 14:30</span><span>Noche 18:30</span></div>'+
        '<div class="ms-foot"><span>Turnos por WhatsApp</span><span>Google Maps</span></div>'+
      '</div></div>';
  }
  var gal=$("#gal"), modal=$("#modal"), lastBtn=null;
  styles.forEach(function(s){
    var b=document.createElement("button");b.className="style-card";b.type="button";
    b.setAttribute("aria-label","Ver grande el estilo "+s.n);
    b.innerHTML='<div class="frame" aria-hidden="true">'+site(s)+'</div><div class="style-meta"><h3>'+s.n+'</h3><em>'+s.tag+'</em></div><p>'+s.f+'</p>';
    b.addEventListener("click",function(){lastBtn=b;openStyle(s)});
    gal.appendChild(b);
  });
  function openStyle(s){
    $("#mframe").innerHTML=site(s);$("#mh").textContent=s.n;$("#mfor").textContent=s.f;
    $("#mlist").innerHTML=s.l.map(function(x){return "<li>"+x+"</li>"}).join("");
    modal.classList.add("open");document.body.style.overflow="hidden";$("#mx").focus();
  }
  function closeM(){modal.classList.remove("open");document.body.style.overflow="";if(lastBtn)lastBtn.focus()}
  $("#mx").addEventListener("click",closeM);
  modal.addEventListener("click",function(e){if(e.target===modal)closeM()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&modal.classList.contains("open"))closeM()});

  /* ---------- tabs ---------- */
  var tabs=$$(".tab");
  tabs.forEach(function(t,j){
    t.addEventListener("click",function(){sel(j)});
    t.addEventListener("keydown",function(e){
      if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();var n=(j+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;sel(n);tabs[n].focus()}
    });
  });
  function sel(j){tabs.forEach(function(t,m){t.setAttribute("aria-selected",j===m);t.tabIndex=j===m?0:-1;var p=$("#"+t.getAttribute("aria-controls"));p.hidden=j!==m;p.classList.toggle("show",j===m)});tabs[j].scrollIntoView({block:"nearest",inline:"nearest"})}

  /* ---------- schedule ---------- */
  var dname=["lun","mar","mié","jue","vie","sáb"], sess=["Mañana","Tarde","Noche"];
  var sch={1:[[1,1,0],[1,0,1],[0,1,1],[1,1,0],[1,0,1],[1,0,0]],2:[[0,1,1],[1,1,0],[1,0,1],[0,1,1],[1,1,0],[0,0,0]],3:[[1,0,0],[0,1,1],[1,1,0],[1,0,0],[0,1,1],[1,1,0]]};
  function drawSched(doc){
    var h="<thead><tr><th></th>"+dname.map(function(d){return "<th>"+d+"</th>"}).join("")+"</tr></thead><tbody>";
    sess.forEach(function(s,si){
      h+="<tr><th>"+s+"</th>";
      dname.forEach(function(d,di){
        var on=doc==="0"?[1,2,3].some(function(kk){return sch[kk][di][si]}):sch[doc][di][si];
        h+='<td class="'+(on?"on":"off")+'">'+(on?"Atiende":"—")+"</td>";
      });
      h+="</tr>";
    });
    $("#sched").innerHTML=h+"</tbody>";
  }
  $$("#docs .chip").forEach(function(c){c.addEventListener("click",function(){$$("#docs .chip").forEach(function(e){e.classList.remove("sel")});c.classList.add("sel");drawSched(c.dataset.doc)})});
  drawSched("0");

  /* ---------- queue ---------- */
  var qn=12;
  $("#qadv").addEventListener("click",function(){
    qn=qn>=16?12:qn+1;$("#qnow").textContent=qn;var left=16-qn;
    $("#qbar").style.width=(100-left*8.3)+"%";
    $("#qmsg").textContent=left===0?"Es su turno: acérquese a recepción.":left===1?"Sigue usted: WhatsApp ya le avisó que se acerque.":"Hay "+left+" personas antes, unos "+left*8+" minutos.";
  });

  $$("#hx .chip").forEach(function(c){c.addEventListener("click",function(){c.classList.toggle("sel")})});

  var L={zh:["讓每一次看牙都安心","早診 9:00–12:00・午診 14:30–17:30・夜診 18:30–21:30"],en:["Dental care you can feel calm about","Morning 9:00–12:00 · Afternoon 14:30–17:30 · Evening 18:30–21:30"],ja:["安心して通える歯医者さん","午前 9:00–12:00・午後 14:30–17:30・夜 18:30–21:30"]};
  $$("#langs .chip").forEach(function(c){c.addEventListener("click",function(){$$("#langs .chip").forEach(function(e){e.classList.remove("sel")});c.classList.add("sel");$("#lt").textContent=L[c.dataset.l][0];$("#lp").textContent=L[c.dataset.l][1]})});

  /* ---------- checklist ---------- */
  var items=[
    ["Se lee en el celular sin agrandar","La mayoría busca dentista desde el celular"],
    ["Carga en menos de 3 segundos","Si es lento, el paciente vuelve atrás"],
    ["Turnos online, sin llamar","Recibe turnos al mediodía y fuera de horario"],
    ["Horarios claros, por odontólogo","Lo que más preguntan los pacientes"],
    ["Cada tratamiento tiene su página","Así aparece cuando buscan «implantes» u «ortodoncia»"],
    ["Presentación y formación de los odontólogos","Genera confianza antes de la primera visita"],
    ["Ficha de Google completa y con fotos actuales","El mapa es lo primero que mira el paciente"],
    ["Una forma de pedir reseñas a los pacientes","Las clínicas con más reseñas se eligen más"],
    ["WhatsApp de la clínica conectado al sitio","El paciente escribe con un toque"],
    ["La dirección tiene https (candadito)","Si no, el navegador muestra «No seguro»"],
    ["Seguro nacional y particular bien indicados","Menos dudas para el paciente"],
    ["Actualizado en los últimos tres meses","Google y la IA prefieren sitios actualizados"]
  ];
  var cl=$("#cl");
  items.forEach(function(it,j){
    var li=document.createElement("li");
    li.innerHTML='<label><input type="checkbox" id="c'+j+'"><span>'+it[0]+'<small>'+it[1]+'</small></span></label>';
    cl.appendChild(li);
  });
  var fg=$("#ringfg");
  function score(){
    var n=$$("#cl input").filter(function(x){return x.checked}).length;
    $("#sn").textContent=n; fg.style.strokeDashoffset=377-377*n/12;
    $("#st").textContent=n===0?"Marque lo que ya tiene.":n<6?"Puede que muchos pacientes no lo encuentren. Lo bueno: todo esto se arregla fácil.":n<10?"¡Buena base! Con algunos puntos más va a recibir más turnos.":n<12?"Casi perfecto: lo que falta lo completamos nosotros.":"¡Puntaje perfecto! Lo ayudamos a mantenerlo y a reforzar la búsqueda con IA.";
  }
  cl.addEventListener("change",score);
})();

(function(){var a=document.querySelectorAll('.langs a[data-l]');for(var i=0;i<a.length;i++){a[i].addEventListener('click',function(){try{document.cookie='lang='+this.getAttribute('data-l')+';path=/;max-age=31536000;samesite=lax;secure'}catch(e){}})}})();
