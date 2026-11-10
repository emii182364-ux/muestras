(function(){function f(e){var c=e.getAttribute("data-css");if(c!==null){e.style.cssText+=";"+c;e.removeAttribute("data-css")}}function ap(r){if(r.nodeType===1&&r.hasAttribute("data-css"))f(r);if(r.querySelectorAll){var l=r.querySelectorAll("[data-css]");for(var i=0;i<l.length;i++)f(l[i])}}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)ap(a[j])}}).observe(document.documentElement,{childList:true,subtree:true});ap(document)})();

(function(){
  var $=function(s){return document.querySelector(s)}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
  var TX=[["洗牙・塗氟","約 30 分鐘",["lin","chen","wang"]],["牙痛・補牙","約 30–60 分鐘",["lin","chen","wang"]],["根管治療","約 60 分鐘",["chen"]],["矯正諮詢","約 30 分鐘",["lin"]],["植牙諮詢","約 40 分鐘",["chen"]],["兒童牙科","約 30 分鐘",["wang"]],["美白・貼片諮詢","約 30 分鐘",["lin"]],["假牙・牙套","約 40 分鐘",["chen","lin"]]];
  var DOC={any:["不指定","最快有空的醫師","#7E918D","任"],lin:["林醫師","矯正・美學","#0B7A5E","林"],chen:["陳醫師","植牙・根管","#1F4E79","陳"],wang:["王醫師","兒童牙科","#B45309","王"]};
  var WK=["日","一","二","三","四","五","六"];
  var SESS=[["早診",["09:00","09:30","10:00","10:30","11:00","11:30"]],["午診",["14:30","15:00","15:30","16:00","16:30","17:00"]],["夜診",["18:30","19:00","19:30","20:00","20:30","21:00"]]];
  var st, step, appts=[], editing=null, first=true;
  function reset(){st={tx:null,doc:null,day:null,slot:null,name:"",phone:"",who:"",memo:""};step=1}
  reset();

  // step 1
  TX.forEach(function(t,i){var b=document.createElement("button");b.type="button";b.setAttribute("aria-pressed","false");b.innerHTML="<b>"+t[0]+"</b><span>"+t[1]+"</span>";b.onclick=function(){st.tx=i;st.doc=null;press("#tx button",b);upd()};$("#tx").appendChild(b)});
  function press(sel,el){$$(sel).forEach(function(e){e.setAttribute("aria-pressed","false")});el.setAttribute("aria-pressed","true")}
  function drawDocs(){
    var box=$("#docs");box.innerHTML="";
    ["any","lin","chen","wang"].forEach(function(k){
      var d=DOC[k],ok=k==="any"||TX[st.tx][2].indexOf(k)>-1;
      var b=document.createElement("button");b.type="button";b.disabled=!ok;b.setAttribute("aria-pressed",st.doc===k?"true":"false");
      b.innerHTML='<span class="av" data-css="background:'+d[2]+'">'+d[3]+'</span><span><b>'+d[0]+'</b><small>'+(ok?d[1]:"這項療程不看診")+'</small></span>';
      b.onclick=function(){st.doc=k;press("#docs button",b);upd()};box.appendChild(b);
    });
  }
  var base=new Date();base.setHours(0,0,0,0);
  function drawDays(){
    var box=$("#days");box.innerHTML="";
    for(var i=1;i<=14;i++){(function(i){
      var d=new Date(base);d.setDate(base.getDate()+i);
      var b=document.createElement("button");b.type="button";b.className="day";b.disabled=d.getDay()===0;
      b.setAttribute("aria-pressed",st.day&&+st.day===+d?"true":"false");
      b.innerHTML=(d.getMonth()+1)+"月<b>"+d.getDate()+"</b>週"+WK[d.getDay()];
      if(b.disabled)b.setAttribute("aria-label",(d.getMonth()+1)+"月"+d.getDate()+"日 週日休診");
      b.onclick=function(){st.day=d;st.slot=null;press(".day",b);drawSlots(i);upd()};box.appendChild(b);
    })(i)}
    if(st.day)drawSlots(Math.round((st.day-base)/864e5)); else $("#sess").innerHTML='<p class="note">請先選擇日期。週日休診。</p>';
  }
  function drawSlots(seed){
    var box=$("#sess");box.innerHTML="";
    var sat=st.day.getDay()===6;
    SESS.forEach(function(g,gi){
      if(sat&&gi===2)return;
      var w=document.createElement("div");w.innerHTML="<h3>"+g[0]+"</h3>";var row=document.createElement("div");row.className="chips";
      g[1].forEach(function(t,ti){
        var b=document.createElement("button");b.type="button";b.className="slot";b.textContent=t;
        var full=(ti*7+gi*3+seed*5)%4===0;b.disabled=full;if(full)b.setAttribute("aria-label",t+" 已額滿");
        b.setAttribute("aria-pressed",st.slot===g[0]+" "+t?"true":"false");
        b.onclick=function(){st.slot=g[0]+" "+t;press(".slot",b);upd()};row.appendChild(b);
      });
      w.appendChild(row);box.appendChild(w);
    });
    if(sat){var p=document.createElement("p");p.className="note";p.textContent="週六沒有夜診。";box.appendChild(p)}
  }
  $$("#who .chip").forEach(function(c){c.onclick=function(){st.who=c.dataset.v;press("#who .chip",c);upd()}});
  ["nm","ph","memo"].forEach(function(id){$("#"+id).addEventListener("input",function(){st.name=$("#nm").value.trim();st.phone=$("#ph").value.trim();st.memo=$("#memo").value.trim();$("#err").textContent="";upd()})});

  function dstr(d){return d?(d.getMonth()+1)+"月"+d.getDate()+"日（週"+WK[d.getDay()]+"）":""}
  function upd(){
    var ok=[0,st.tx!==null,!!st.doc,!!(st.day&&st.slot),!!(st.name&&st.phone&&st.who)][step];
    $("#next").disabled=!ok;$("#next").textContent=step===4?(editing!==null?"確認改期":"確認預約"):"下一步";
    $("#s1").textContent=st.tx!==null?TX[st.tx][0]:"—";
    $("#s2").textContent=st.doc?DOC[st.doc][0]:"—";
    $("#s3").textContent=st.day&&st.slot?dstr(st.day)+" "+st.slot:"—";
    $("#s4").textContent=st.name||"—";
  }
  function show(n){
    step=n;
    $$(".step").forEach(function(s){s.hidden=+s.dataset.s!==n});
    $$("#stepper li").forEach(function(li,i){li.className=i+1===n?"on":i+1<n?"done":""});
    $("#prev").hidden=n===1||n===5;$("#nav").hidden=n===5;
    if(n===2)drawDocs(); if(n===3)drawDays();
    upd();
    var h=document.querySelector('.step[data-s="'+n+'"] h2');if(h&&!first){h.setAttribute("tabindex","-1");h.focus({preventScroll:true})}first=false;
  }
  $("#prev").onclick=function(){show(step-1)};
  $("#next").onclick=function(){
    if(step===4){
      if(!/^09\d{8}$/.test(st.phone)){$("#err").textContent="請輸入 09 開頭的 10 碼手機號碼。";$("#ph").focus();return}
      finish();return;
    }
    show(step+1);
  };
  function finish(){
    var docName=st.doc==="any"?"林醫師（系統安排）":DOC[st.doc][0];
    var a={tx:TX[st.tx][0],doc:docName,day:st.day,slot:st.slot,name:st.name,who:st.who,cancel:false};
    if(editing!==null){appts[editing]=a;$("#okh").textContent="改期完成";editing=null}else{appts.unshift(a);$("#okh").textContent="預約完成"}
    $("#okmsg").textContent="晴光牙醫（範例）："+a.name+" 您好，已為您預約 "+dstr(a.day)+" "+a.slot+"，"+a.doc+"，"+a.tx+"。需要改期請點「我的預約」。";
    drawMine();show(5);
  }
  $("#restart").onclick=function(){reset();$$("#flow [aria-pressed]").forEach(function(e){e.setAttribute("aria-pressed","false")});["nm","ph","memo"].forEach(function(id){$("#"+id).value=""});show(1)};
  $("#gomine").onclick=function(){$("#minebox").scrollIntoView({behavior:"smooth",block:"start"});$("#minebox h2").setAttribute("tabindex","-1");$("#minebox h2").focus({preventScroll:true})};

  function drawMine(){
    var box=$("#mine");box.innerHTML="";
    if(!appts.length){box.innerHTML='<p class="note">目前沒有預約。</p>';return}
    appts.forEach(function(a,i){
      var d=document.createElement("div");d.className="appt"+(a.cancel?" cancel":"");
      d.innerHTML='<div><b>'+dstr(a.day)+" "+a.slot+'</b><br><span class="note">'+a.tx+"・"+a.doc+(a.cancel?"・已取消":"")+'</span></div>';
      if(!a.cancel){
        var acts=document.createElement("div");acts.className="chips";
        var ch=document.createElement("button");ch.className="btn btn-soft btn-sm";ch.textContent="改期";
        var ca=document.createElement("button");ca.className="btn btn-danger btn-sm";ca.textContent="取消";
        var cf=document.createElement("div");cf.className="confirm";cf.innerHTML='<span>確定要取消這個預約嗎？</span>';
        var yes=document.createElement("button");yes.className="btn btn-danger btn-sm";yes.textContent="確定取消";
        var no=document.createElement("button");no.className="btn btn-ghost btn-sm";no.textContent="保留";
        cf.appendChild(yes);cf.appendChild(no);
        ch.onclick=function(){editing=i;st={tx:TX.map(function(t){return t[0]}).indexOf(a.tx),doc:"any",day:null,slot:null,name:a.name,phone:$("#ph").value.trim()||"0900000000",who:a.who,memo:""};$("#flow").scrollIntoView({behavior:"smooth"});show(3)};
        ca.onclick=function(){cf.classList.add("show");yes.focus()};
        no.onclick=function(){cf.classList.remove("show")};
        yes.onclick=function(){a.cancel=true;drawMine()};
        acts.appendChild(ch);acts.appendChild(ca);d.appendChild(acts);d.appendChild(cf);
      }
      box.appendChild(d);
    });
  }

  $("#ics").onclick=function(){
    var a=appts[0];if(!a)return;
    var t=a.slot.split(" ")[1].split(":"),s=new Date(a.day);s.setHours(+t[0],+t[1]);var e=new Date(s.getTime()+30*6e4);
    function f(d){function p(n){return (n<10?"0":"")+n}return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+"T"+p(d.getHours())+p(d.getMinutes())+"00"}
    var ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Paginas Clover//Demo//ZH","BEGIN:VEVENT","UID:"+Date.now()+"@demo","DTSTAMP:"+f(new Date()),"DTSTART;TZID=Asia/Taipei:"+f(s),"DTEND;TZID=Asia/Taipei:"+f(e),"SUMMARY:晴光牙醫（範例）"+a.tx,"DESCRIPTION:"+a.doc,"BEGIN:VALARM","TRIGGER:-P1D","ACTION:DISPLAY","DESCRIPTION:明天看牙","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
    var url=URL.createObjectURL(new Blob([ics],{type:"text/calendar"}));var l=document.createElement("a");l.href=url;l.download="dental-appointment.ics";document.body.appendChild(l);l.click();l.remove();setTimeout(function(){URL.revokeObjectURL(url)},1000);
  };
  show(1);
})();
