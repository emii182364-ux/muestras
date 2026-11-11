/* Páginas Clover — turnos para consultorios (plantilla)
   Muestra horarios libres y ocupados, muchos turnos por día, y una vista
   "consultorio" donde el dentista marca horarios usados con un toque.
   Demo: guarda todo solo en el navegador de quien la usa (localStorage).
   Para otra clínica: cambiar el bloque CLINICAS (nombre, horarios, textos). */
(function(){
  "use strict";
  var bk=document.getElementById("bk"); if(!bk) return;

  /* ===================== CONFIGURACIÓN ===================== */
  var TW={ /* horarios típicos de Taiwán: 早診・午診・夜診 */
    sesiones:[["09:00","12:00"],["14:00","17:30"],["18:00","21:30"]],
    sabado:[0,1], cerrado:[0], cada:15, dias:7, ocupacion:[.45,.35,.6]
  };
  var AR={ /* Argentina: mañana y tarde */
    sesiones:[["9:00","13:00"],["15:00","20:00"]],
    sabado:[0], cerrado:[0], cada:15, dias:7, ocupacion:[.45,.5]
  };
  var CLINICAS={
    "zh":{h:TW, ses:["早診","午診","夜診"], wk:["日","一","二","三","四","五","六"],
      libre:"可預約", ocupado:"已約滿", tuyo:"您選的", quedan:function(n){return "剩 "+n}, lleno:"額滿", cerrado:"休診",
      sig:"下一步", conf:"確認預約", elegir:"先選一天",
      fecha:function(d,s,t,wk){return (d.getMonth()+1)+"月"+d.getDate()+"日（週"+wk[d.getDay()]+"） "+s+" "+t},
      msg:function(t,x){return "晴光牙醫提醒您：明天 "+t+" 有預約（"+x+"）。如需改期，點這裡就能重新選時段。"},
      sep:"・", modoP:"我是病患", modoC:"我是診所",
      tituloC:"我的門診時段", ayudaC:"點一下時段就能切換「可預約 ⇄ 已佔用」，病患畫面會馬上更新。",
      bloq:"整段佔用", abrir:"整段開放", online:"線上預約", usado:"佔用", previo:"已約",
      cuenta:function(f,b){return "這天：可預約 "+f+"・已佔用 "+b},
      cal:"同步行事曆", calNota:"新預約自動出現在您的行事曆：Google、Apple，或兩個一起。", calOn:"已連結（示範）",
      verP:"切到病患畫面看看 →", reset:"重設示範", nota:"示範資料，只存在這台裝置。",
      invita:"手機可以直接操作：先當病患預約一次，再按「我是診所」自己開關時段。"},
    "en":{h:TW, ses:["Morning","Afternoon","Evening"], wk:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      libre:"Available", ocupado:"Taken", tuyo:"Your pick", quedan:function(n){return n+" left"}, lleno:"Full", cerrado:"Closed",
      sig:"Next", conf:"Confirm booking", elegir:"Pick a day first",
      fecha:function(d,s,t,wk){return wk[d.getDay()]+" "+(d.getMonth()+1)+"/"+d.getDate()+" · "+s+" "+t},
      msg:function(t,x){return "Sunny Dental reminder: tomorrow at "+t+" you have a booking ("+x+"). Need to change it? Tap here to pick another time."},
      sep:" · ", modoP:"I'm a patient", modoC:"I'm the clinic",
      tituloC:"My clinic hours", ayudaC:"Tap any time to switch it between Available and Taken. The patient screen updates right away.",
      bloq:"Block all", abrir:"Open all", online:"Online", usado:"Taken", previo:"Booked",
      cuenta:function(f,b){return "This day: "+f+" open · "+b+" taken"},
      cal:"Sync calendar", calNota:"New bookings show up in your calendar: Google, Apple, or both at once.", calOn:"Connected (demo)",
      verP:"See it as a patient →", reset:"Reset demo", nota:"Sample data, saved only on this device.",
      invita:"Try the phone: book as a patient, then tap “I'm the clinic” and open or block times yourself."},
    "tw-es":{h:TW, ses:["Mañana","Tarde","Noche"], wk:["dom","lun","mar","mié","jue","vie","sáb"],
      libre:"Libre", ocupado:"Ocupado", tuyo:"Elegido", quedan:function(n){return "quedan "+n}, lleno:"Completo", cerrado:"Cerrado",
      sig:"Siguiente", conf:"Confirmar turno", elegir:"Primero elegí un día",
      fecha:function(d,s,t,wk){return wk[d.getDay()]+" "+d.getDate()+"/"+(d.getMonth()+1)+" · "+s+" "+t},
      msg:function(t,x){return "Recordatorio de Sunny Dental: mañana a las "+t+" tiene turno ("+x+"). ¿Necesita cambiarlo? Toque acá para elegir otro horario."},
      sep:" · ", modoP:"Soy paciente", modoC:"Soy el consultorio",
      tituloC:"Mis horarios", ayudaC:"Tocá un horario para pasarlo de libre a ocupado (o al revés). La pantalla del paciente cambia al instante.",
      bloq:"Ocupar todo", abrir:"Liberar todo", online:"Online", usado:"Ocupado", previo:"Reservado",
      cuenta:function(f,b){return "Este día: "+f+" libres · "+b+" ocupados"},
      cal:"Sincronizar calendario", calNota:"Los turnos nuevos aparecen solos en tu calendario: Google, Apple o los dos juntos.", calOn:"Conectado (demo)",
      verP:"Ver como paciente →", reset:"Reiniciar demo", nota:"Datos de ejemplo, quedan solo en este dispositivo.",
      invita:"Probalo en el celular: reservá como paciente y después tocá «Soy el consultorio» para abrir o cerrar horarios."},
    "es-AR":{h:AR, ses:["Mañana","Tarde"], wk:["dom","lun","mar","mié","jue","vie","sáb"],
      libre:"Libre", ocupado:"Ocupado", tuyo:"Elegido", quedan:function(n){return "quedan "+n}, lleno:"Completo", cerrado:"Cerrado",
      sig:"Siguiente", conf:"Confirmar turno", elegir:"Primero elegí un día",
      fecha:function(d,s,t){var L=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];return L[d.getDay()]+" "+d.getDate()+"/"+(d.getMonth()+1)+" a las "+t},
      msg:function(t,x){return "Sonrisa Clara: te recordamos tu turno de mañana a las "+t+" ("+x+"). Si necesitás cambiarlo, tocá acá y elegí otro horario."},
      sep:" · ", modoP:"Soy paciente", modoC:"Soy el consultorio",
      tituloC:"Mi agenda", ayudaC:"Tocá un horario para pasarlo de libre a ocupado (o al revés). La pantalla del paciente cambia al instante.",
      bloq:"Ocupar todo", abrir:"Liberar todo", online:"Online", usado:"Ocupado", previo:"Reservado",
      cuenta:function(f,b){return "Este día: "+f+" libres · "+b+" ocupados"},
      cal:"Sincronizar calendario", calNota:"Los turnos nuevos aparecen solos en tu calendario: Google, Apple o los dos juntos.", calOn:"Conectado (demo)",
      verP:"Ver como paciente →", reset:"Reiniciar demo", nota:"Datos de ejemplo, quedan solo en este dispositivo.",
      invita:"Probalo en el celular: sacá un turno como paciente y después tocá «Soy el consultorio» para abrir o cerrar horarios."}
  };
  /* ========================================================== */

  var lang=(document.documentElement.getAttribute("lang")||"zh").toLowerCase();
  var id=lang.indexOf("zh")===0?"zh":lang==="en"?"en":lang==="es-ar"?"es-AR":"tw-es";
  var C=CLINICAS[id], H=C.h;
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
  function pad(n){return (n<10?"0":"")+n}
  function key(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
  function mins(t){var p=t.split(":");return +p[0]*60+ +p[1]}
  var lead0=H.sesiones[0][0].length===5;
  function hhmm(m){var h=Math.floor(m/60);return (lead0?pad(h):h)+":"+pad(m%60)}
  function rnd(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return ((h>>>0)%1000)/1000}

  /* memoria de la demo (solo este navegador) */
  var SK="clover-turnos-demo-"+id, mem={ov:{},res:{},cal:{}};
  try{var raw=localStorage.getItem(SK);if(raw){var p=JSON.parse(raw);mem.ov=p.ov||{};mem.res=p.res||{};mem.cal=p.cal||{}}}catch(e){}
  function save(){try{localStorage.setItem(SK,JSON.stringify(mem))}catch(e){}}

  /* días y horarios */
  var base=new Date();base.setHours(0,0,0,0);
  var dias=[];for(var k=1;dias.length<H.dias;k++){var x=new Date(base);x.setDate(base.getDate()+k);dias.push(x)}
  function sesionesDe(d){
    if(H.cerrado.indexOf(d.getDay())>=0) return [];
    var out=[];H.sesiones.forEach(function(s,i){if(d.getDay()===6&&H.sabado.indexOf(i)<0)return;
      var ts=[];for(var m=mins(s[0]);m<mins(s[1]);m+=H.cada)ts.push(hhmm(m));out.push({i:i,n:C.ses[i],t:ts})});
    return out;
  }
  /* estado: libre | previo (ya reservado) | usado (lo marcó el consultorio) | online (reservado en esta demo) */
  function semilla(d,t,si){return rnd(id+key(d)+" "+t)<H.ocupacion[si]?"previo":"libre"}
  function estado(d,t,si){
    var k=key(d)+" "+t;
    if(mem.res[k]) return "online";
    if(mem.ov[k]==="usado") return "usado";
    if(mem.ov[k]==="libre") return "libre";
    return semilla(d,t,si);
  }
  function cuenta(d){var f=0,b=0;sesionesDe(d).forEach(function(s){s.t.forEach(function(t){estado(d,t,s.i)==="libre"?f++:b++})});return [f,b]}

  /* ---------- interruptor paciente / consultorio ---------- */
  var screen=bk.closest(".screen")||bk.parentNode, top=$(".scr-top",screen);
  var sw=el("div","tn-modo");sw.setAttribute("role","tablist");
  var bP=el("button","tn-m on",C.modoP), bC=el("button","tn-m",C.modoC);
  [bP,bC].forEach(function(b){b.type="button";b.setAttribute("role","tab");sw.appendChild(b)});
  bP.setAttribute("aria-selected","true");bC.setAttribute("aria-selected","false");
  bC.insertBefore(el("span","tn-dot"),bC.firstChild);
  screen.insertBefore(sw,top?top.nextSibling:bk);
  var steps=$(".steps",screen);
  var note=$(".hero-note"); if(note&&C.invita) note.textContent=C.invita;

  /* ---------- vista PACIENTE ---------- */
  var st={step:1,t:null,d:null,s:null,ses:null}, bars=$$(".steps i",screen), next=$("#next"),
      daysEl=$("#days"), slotsEl=$("#slots");
  daysEl.className="tn-days"; slotsEl.className="tn-slots";
  function leyenda(items){var l=el("div","tn-ley");items.forEach(function(p){var s=el("span");s.appendChild(el("i","tn-k "+p[0]));s.appendChild(document.createTextNode(p[1]));l.appendChild(s)});return l}
  slotsEl.parentNode.insertBefore(leyenda([["libre",C.libre],["previo",C.ocupado],["sel",C.tuyo]]),slotsEl);

  function dibujarDias(box,activo,alElegir){
    box.innerHTML="";
    dias.forEach(function(d){
      var b=el("button","tn-day");b.type="button";var c=cuenta(d),ses=sesionesDe(d),on=!!activo&&key(activo)===key(d);
      b.appendChild(el("span","w",C.wk[d.getDay()]));b.appendChild(el("b",null,String(d.getDate())));
      b.appendChild(el("span","q",!ses.length?C.cerrado:c[0]===0?C.lleno:C.quedan(c[0])));
      if(!ses.length){b.disabled=true;b.classList.add("off")} else if(c[0]===0) b.classList.add("full");
      if(on) b.classList.add("sel");
      b.setAttribute("aria-pressed",on?"true":"false");
      b.addEventListener("click",function(){alElegir(d)});
      box.appendChild(b);
    });
  }
  function dibujarHorariosP(){
    slotsEl.innerHTML="";
    if(!st.d){slotsEl.appendChild(el("p","tn-vacio",C.elegir));return}
    sesionesDe(st.d).forEach(function(s){
      var libres=s.t.filter(function(t){return estado(st.d,t,s.i)==="libre"}).length;
      var hd=el("p","tn-ses");hd.appendChild(el("b",null,s.n));hd.appendChild(el("span",null,libres?C.quedan(libres):C.lleno));
      slotsEl.appendChild(hd);
      var g=el("div","tn-grid");
      s.t.forEach(function(t){
        var e=estado(st.d,t,s.i), b=el("button","tn-slot "+(e==="libre"?"libre":"previo"),t);b.type="button";
        if(e!=="libre"){b.disabled=true;b.setAttribute("aria-label",t+" "+C.ocupado)}
        else{b.setAttribute("aria-label",t+" "+C.libre);
          if(st.s===t&&st.ses===s.n){b.classList.add("sel");b.setAttribute("aria-pressed","true")}
          b.addEventListener("click",function(){st.s=t;st.ses=s.n;$$(".tn-slot.sel",slotsEl).forEach(function(x){x.classList.remove("sel");x.removeAttribute("aria-pressed")});b.classList.add("sel");b.setAttribute("aria-pressed","true");upd()})}
        g.appendChild(b);
      });
      slotsEl.appendChild(g);
    });
  }
  function elegirDiaP(d){st.d=d;st.s=null;st.ses=null;dibujarDias(daysEl,st.d,elegirDiaP);dibujarHorariosP();slotsEl.scrollTop=0;upd()}

  var paso1=$('[data-step="1"]',bk), paso3=$('[data-step="3"]',bk);
  $$(".chips",paso1).concat($$(".chips",paso3)).forEach(function(grp){
    $$(".chip",grp).forEach(function(c){c.addEventListener("click",function(){$$(".chip",grp).forEach(function(e){e.classList.remove("sel")});c.classList.add("sel");if(paso1.contains(c))st.t=c.dataset.v;upd()})});
  });
  function paso3ok(){return $$(".chips",paso3).every(function(g){return !!$(".chip.sel",g)})}
  function upd(){var ok=(st.step===1&&st.t)||(st.step===2&&st.d&&st.s)||(st.step===3&&paso3ok());next.disabled=!ok;next.textContent=st.step===3?C.conf:C.sig}
  function mostrar(n){$$("[data-step]",bk).forEach(function(e){e.hidden=+e.dataset.step!==n});bars.forEach(function(b,j){b.classList.toggle("on",j<n)});
    if(n===2){dibujarDias(daysEl,st.d,elegirDiaP);dibujarHorariosP()}}
  next.addEventListener("click",function(){
    if(st.step<3){st.step++;mostrar(st.step);upd();return}
    $$("[data-step]",bk).forEach(function(e){e.hidden=true});next.hidden=true;bars.forEach(function(b){b.classList.add("on")});
    var extra=$$(".chips",paso3).map(function(g){var s=$(".chip.sel",g);return s.dataset.who||s.dataset.cov||s.dataset.v||s.textContent});
    mem.res[key(st.d)+" "+st.s]=st.t;save();
    var sum=$("#sum");sum.innerHTML="";sum.appendChild(el("b",null,st.t));sum.appendChild(document.createTextNode(C.sep+extra.join(C.sep)));
    sum.appendChild(el("br"));sum.appendChild(document.createTextNode(C.fecha(st.d,st.ses,st.s,C.wk)));
    $("#lm").textContent=C.msg(st.s,st.t);
    $("#done").classList.add("show");setTimeout(function(){$("#lb").classList.add("show")},reduce?0:700);
  });
  $("#again").addEventListener("click",function(){
    st={step:1,t:null,d:null,s:null,ses:null};$$(".chip.sel",bk).forEach(function(e){e.classList.remove("sel")});
    slotsEl.innerHTML="";$("#done").classList.remove("show");$("#lb").classList.remove("show");next.hidden=false;mostrar(1);upd();
  });

  /* ---------- vista CONSULTORIO ---------- */
  var vc=el("div","scr-body tn-clinica");vc.hidden=true;
  vc.appendChild(el("p","scr-q",C.tituloC));vc.appendChild(el("p","tn-ayuda",C.ayudaC));
  var cDias=el("div","tn-days"), cHor=el("div","tn-slots tn-slots-c"), cCuenta=el("p","tn-cuenta");
  vc.appendChild(cDias);vc.appendChild(leyenda([["libre",C.libre],["online",C.online],["usado",C.usado],["previo",C.previo]]));
  vc.appendChild(cHor);vc.appendChild(cCuenta);
  /* calendarios (demo) */
  var cal=el("div","tn-cal");cal.appendChild(el("p","tn-cal-t",C.cal));
  var calRow=el("div","tn-cal-row");
  [["g","Google Calendar"],["a","Apple Calendar"]].forEach(function(c){
    var b=el("button","tn-calb");b.type="button";b.appendChild(el("i","tn-cal-ic "+c[0]));b.appendChild(el("span",null,c[1]));var s=el("small");b.appendChild(s);
    function pinta(){var on=!!mem.cal[c[0]];b.classList.toggle("on",on);b.setAttribute("aria-pressed",on?"true":"false");s.textContent=on?C.calOn:""}
    b.addEventListener("click",function(){mem.cal[c[0]]=!mem.cal[c[0]];save();pinta()});pinta();calRow.appendChild(b);
  });
  cal.appendChild(calRow);cal.appendChild(el("p","tn-cal-n",C.calNota));vc.appendChild(cal);
  var pie=el("div","tn-pie"), bVer=el("button","scr-next tn-ver",C.verP), bReset=el("button","tn-reset",C.reset);
  bVer.type=bReset.type="button";pie.appendChild(bVer);pie.appendChild(bReset);vc.appendChild(pie);vc.appendChild(el("p","tn-nota",C.nota));
  bk.parentNode.insertBefore(vc,bk.nextSibling);
  var cDia=null;
  function elegirDiaC(d){cDia=d;refrescar()}
  function marcar(d,t,si,aUsado){
    var k=key(d)+" "+t;delete mem.res[k];
    if(aUsado) mem.ov[k]="usado";
    else if(semilla(d,t,si)==="libre") delete mem.ov[k]; else mem.ov[k]="libre";
  }
  function dibujarHorariosC(){
    cHor.innerHTML="";var f=0,b=0;
    sesionesDe(cDia).forEach(function(s){
      var hd=el("p","tn-ses");hd.appendChild(el("b",null,s.n));
      var acc=el("span","tn-acc"), b1=el("button","tn-mini",C.bloq), b2=el("button","tn-mini",C.abrir);b1.type=b2.type="button";
      b1.addEventListener("click",function(){s.t.forEach(function(t){marcar(cDia,t,s.i,true)});save();refrescar()});
      b2.addEventListener("click",function(){s.t.forEach(function(t){marcar(cDia,t,s.i,false)});save();refrescar()});
      acc.appendChild(b1);acc.appendChild(b2);hd.appendChild(acc);cHor.appendChild(hd);
      var g=el("div","tn-grid");
      s.t.forEach(function(t){
        var e=estado(cDia,t,s.i), bt=el("button","tn-slot "+e);bt.type="button";
        bt.appendChild(el("b",null,t));
        bt.appendChild(el("small",null,e==="libre"?C.libre:e==="online"?(mem.res[key(cDia)+" "+t]||C.online):e==="usado"?C.usado:C.previo));
        bt.setAttribute("aria-pressed",e==="libre"?"false":"true");
        e==="libre"?f++:b++;
        bt.addEventListener("click",function(){var y=cHor.scrollTop;marcar(cDia,t,s.i,e==="libre");save();refrescar();cHor.scrollTop=y});
        g.appendChild(bt);
      });
      cHor.appendChild(g);
    });
    cCuenta.textContent=C.cuenta(f,b);
  }
  function refrescar(){dibujarDias(cDias,cDia,elegirDiaC);dibujarHorariosC()}
  bReset.addEventListener("click",function(){mem={ov:{},res:{},cal:{}};save();refrescar();$$(".tn-calb",vc).forEach(function(b){b.classList.remove("on");b.setAttribute("aria-pressed","false");$("small",b).textContent=""})});

  function modo(m){
    var c=m==="c";bP.classList.toggle("on",!c);bC.classList.toggle("on",c);
    bP.setAttribute("aria-selected",String(!c));bC.setAttribute("aria-selected",String(c));
    bk.hidden=c;vc.hidden=!c;if(steps)steps.classList.toggle("tn-oculto",c);
    screen.classList.toggle("tn-es-clinica",c);
    if(c){if(!cDia)cDia=st.d||dias.filter(function(d){return sesionesDe(d).length})[0];refrescar()}
    else if(st.step===2){dibujarDias(daysEl,st.d,elegirDiaP);dibujarHorariosP()}
  }
  bP.addEventListener("click",function(){modo("p")});
  bC.addEventListener("click",function(){modo("c")});
  bVer.addEventListener("click",function(){
    var dEleg=cDia;modo("p");
    if($("#done").classList.contains("show")){$("#again").click()}
    if(!st.t){$(".chip",paso1).click()}
    st.step=2;st.d=dEleg;st.s=null;st.ses=null;mostrar(2);upd();
  });
  upd();
})();
