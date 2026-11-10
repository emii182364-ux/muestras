(function(){function f(e){var c=e.getAttribute("data-css");if(c!==null){e.style.cssText+=";"+c;e.removeAttribute("data-css")}}function ap(r){if(r.nodeType===1&&r.hasAttribute("data-css"))f(r);if(r.querySelectorAll){var l=r.querySelectorAll("[data-css]");for(var i=0;i<l.length;i++)f(l[i])}}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)ap(a[j])}}).observe(document.documentElement,{childList:true,subtree:true});ap(document)})();

(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* header border */
  var tb=$("#topbar");
  window.addEventListener("scroll",function(){tb.classList.toggle("scrolled",window.scrollY>8)},{passive:true});

  /* ---------- search moment ---------- */
  var q="士林 牙醫 推薦", qEl=$("#q"), res=$("#results");
  if(reduce){qEl.textContent=q;res.classList.add("found")}
  else{
    var i=0;
    setTimeout(function type(){
      qEl.textContent=q.slice(0,++i);
      if(i<q.length)setTimeout(type,140+Math.random()*90);
      else setTimeout(function(){res.classList.add("found")},500);
    },700);
  }

  /* ---------- booking demo ---------- */
  var st={step:1,t:null,d:null,s:null,w:null}, wk=["日","一","二","三","四","五","六"];
  var bars=$$(".steps i"), next=$("#next"), daysEl=$("#days"), slotsEl=$("#slots");
  var base=new Date(); base.setHours(0,0,0,0);
  var days=[]; for(var k=1;days.length<5;k++){var x=new Date(base);x.setDate(base.getDate()+k);days.push(x);}
  days.forEach(function(d,idx){
    var b=document.createElement("button"); b.className="day"; b.type="button";
    b.innerHTML=(d.getMonth()+1)+"/<b>"+d.getDate()+"</b>週"+wk[d.getDay()];
    if(d.getDay()===0){b.disabled=true;b.setAttribute("aria-label","週日休診")}
    b.addEventListener("click",function(){$$(".day").forEach(function(e){e.classList.remove("sel")});b.classList.add("sel");st.d=d;st.s=null;drawSlots(idx);upd()});
    daysEl.appendChild(b);
  });
  var groups=[["早診",["09:00","09:30","10:00","10:30","11:00"]],["午診",["14:30","15:00","15:30","16:30"]],["夜診",["18:30","19:00","19:30","20:00","20:30"]]];
  function drawSlots(seed){
    slotsEl.innerHTML="";
    groups.forEach(function(g,gi){
      var lab=document.createElement("p");lab.className="slot-g";lab.textContent=g[0];slotsEl.appendChild(lab);
      var row=document.createElement("div");row.className="slot-row";
      g[1].forEach(function(t,ti){
        var b=document.createElement("button");b.type="button";b.className="slot";b.textContent=t;
        if((ti+gi+seed)%3===0){b.disabled=true;b.setAttribute("aria-label",t+" 已額滿")}
        b.addEventListener("click",function(){$$(".slot").forEach(function(e){e.classList.remove("sel")});b.classList.add("sel");st.s=g[0]+" "+t;upd()});
        row.appendChild(b);
      });
      slotsEl.appendChild(row);
    });
  }
  $$('[data-step="1"] .chip').forEach(function(c){c.addEventListener("click",function(){$$('[data-step="1"] .chip').forEach(function(e){e.classList.remove("sel")});c.classList.add("sel");st.t=c.dataset.v;upd()})});
  $$('[data-step="3"] .chip').forEach(function(c){c.addEventListener("click",function(){$$('[data-step="3"] .chip').forEach(function(e){e.classList.remove("sel")});c.classList.add("sel");st.w=c.dataset.who;upd()})});
  function upd(){
    var ok=(st.step===1&&st.t)||(st.step===2&&st.d&&st.s)||(st.step===3&&st.w);
    next.disabled=!ok; next.textContent=st.step===3?"確認預約":"下一步";
  }
  function show(n){
    $$("#bk [data-step]").forEach(function(e){e.hidden=+e.dataset.step!==n});
    bars.forEach(function(b,j){b.classList.toggle("on",j<n)});
  }
  next.addEventListener("click",function(){
    if(st.step<3){st.step++;show(st.step);upd();return}
    $$("#bk [data-step]").forEach(function(e){e.hidden=true});next.hidden=true;
    bars.forEach(function(b){b.classList.add("on")});
    var dd=st.d, ds=(dd.getMonth()+1)+"月"+dd.getDate()+"日（週"+wk[dd.getDay()]+"）";
    $("#sum").innerHTML="<b>"+st.t+"</b>・"+st.w+"<br>"+ds+" "+st.s;
    $("#lm").textContent="晴光牙醫提醒您：明天 "+st.s.split(" ")[1]+" 有預約（"+st.t+"）。如需改期，點這裡就能重新選時段。";
    $("#done").classList.add("show");
    setTimeout(function(){$("#lb").classList.add("show")},reduce?0:700);
  });
  $("#again").addEventListener("click",function(){
    st={step:1,t:null,d:null,s:null,w:null};$$("#bk .sel").forEach(function(e){e.classList.remove("sel")});
    slotsEl.innerHTML="";$("#done").classList.remove("show");$("#lb").classList.remove("show");next.hidden=false;show(1);upd();
  });

  /* ---------- style illustrations ---------- */
  var tooth='M38 18c-11 0-19 8-19 21 0 10 3 16 5 24 3 11 4 32 12 32 7 0 7-20 11-26 2-3 5-4 13-4s11 1 13 4c4 6 4 26 11 26 8 0 9-21 12-32 2-8 5-14 5-24 0-13-8-21-19-21-8 0-12 5-22 5s-14-5-22-5z';
  var art={
    fresh:'<svg viewBox="0 0 120 120"><circle cx="60" cy="62" r="52" fill="#CFEAF0"/><path d="'+tooth+'" transform="translate(0 4)" fill="#fff" stroke="#1A8FA3" stroke-width="3"/><path d="M93 22l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#1A8FA3"/><path d="M24 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#7CC7D6"/></svg>',
    family:'<svg viewBox="0 0 120 120"><circle cx="86" cy="30" r="14" fill="#FFB36B"/><path d="M8 112c4-28 20-44 38-44s34 16 38 44z" fill="#E2763A"/><circle cx="46" cy="50" r="16" fill="#F4C6A0"/><path d="M60 112c3-18 14-28 26-28s23 10 26 28z" fill="#F2A05F"/><circle cx="86" cy="72" r="11" fill="#F4C6A0"/><path d="M40 54c3 4 9 4 12 0M81 74c2 3 7 3 10 0" stroke="#4A3426" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
    luxe:'<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" fill="none" stroke="#C9A96A" stroke-width="1.2"/><circle cx="60" cy="60" r="38" fill="none" stroke="#3A3128" stroke-width="1"/><path d="M28 56c10 20 54 20 64 0" fill="none" stroke="#C9A96A" stroke-width="2.5" stroke-linecap="round"/><path d="M38 58v6M48 61v8M60 62v8M72 61v8M82 58v6" stroke="#EDE3D1" stroke-width="1.6" stroke-linecap="round"/><path d="M60 18l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" fill="#C9A96A"/></svg>',
    kids:'<svg viewBox="0 0 120 120"><path d="'+tooth+'" fill="#fff" stroke="#2A2F6B" stroke-width="3.5"/><circle cx="47" cy="48" r="4.5" fill="#2A2F6B"/><circle cx="73" cy="48" r="4.5" fill="#2A2F6B"/><path d="M48 60c5 7 19 7 24 0" fill="none" stroke="#2A2F6B" stroke-width="3.5" stroke-linecap="round"/><circle cx="40" cy="58" r="4" fill="#FF8FA3"/><circle cx="80" cy="58" r="4" fill="#FF8FA3"/><path d="M100 14l3.5 7 7.5 1-5.5 5 1.5 7.5-7-3.5-7 3.5 1.5-7.5-5.5-5 7.5-1z" fill="#5B5BD6"/><path d="M14 88l2.5 5 5.5.8-4 3.8 1 5.4-5-2.6-5 2.6 1-5.4-4-3.8 5.5-.8z" fill="#fff"/></svg>',
    implant:'<svg viewBox="0 0 120 120"><path d="M0 70h120" stroke="#3D7BFA" stroke-width="1" stroke-dasharray="3 4"/><path d="M38 20c0-6 6-10 22-10s22 4 22 10l-2 26c-1 6-6 10-20 10s-19-4-20-10z" fill="#fff" stroke="#9FB0C8" stroke-width="2"/><rect x="52" y="56" width="16" height="8" fill="#9FB0C8"/><path d="M50 64h20l-2 46H52z" fill="#3D7BFA"/><path d="M48 72h24M49 80h22M50 88h20M51 96h18M52 104h16" stroke="#16202E" stroke-width="2.5"/><path d="M86 30h22M86 60h22M86 92h22" stroke="#9FB0C8" stroke-width="1.5"/><circle cx="84" cy="30" r="2" fill="#fff"/><circle cx="84" cy="60" r="2" fill="#fff"/><circle cx="84" cy="92" r="2" fill="#fff"/></svg>',
    classic:'<svg viewBox="0 0 120 120"><rect x="16" y="40" width="88" height="70" fill="#F7F2E7"/><path d="M10 40h100l-8-16H18z" fill="#B23A2E"/><path d="M18 40v8M34 40v8M50 40v8M66 40v8M82 40v8M98 40v8" stroke="#F7F2E7" stroke-width="4"/><rect x="34" y="10" width="52" height="16" rx="2" fill="#F7F2E7" stroke="#D7C9A8" stroke-width="2"/><text x="60" y="22.5" text-anchor="middle" font-size="10" font-weight="900" fill="#2E4934" font-family="Noto Serif TC,serif">仁和牙醫</text><rect x="26" y="60" width="28" height="50" fill="#2E4934"/><rect x="64" y="60" width="30" height="26" fill="#D7C9A8"/><path d="M79 60v26M64 73h30" stroke="#F7F2E7" stroke-width="2"/></svg>'
  };

  var styles=[
    {k:"fresh",n:"清新專業",tag:"一般牙科",f:"適合一般牙科、年輕家庭與上班族。",name:"晴光牙醫",h:"讓看牙變成輕鬆的事",b:"線上預約",g:["洗牙","補牙","矯正"],url:"sunny-dental.tw",l:["明亮的藍綠色，乾淨又安心","大量留白，資訊好找","給人專業、現代的第一印象"]},
    {k:"family",n:"溫馨家庭",tag:"社區診所",f:"適合社區型診所，全家大小都來看。",name:"小橘子牙醫",h:"一家人的牙齒，交給我們",b:"預約全家洗牙",g:["兒牙","洗牙","假牙"],url:"orange-dental.tw",l:["溫暖的橘色與圓角設計","像鄰居一樣親切的語氣","重視長期關係的社區診所"]},
    {k:"luxe",n:"質感美學",tag:"自費美學",f:"適合美白、貼片、全瓷冠等自費美學療程。",name:"ÉCLAT 美學牙醫",h:"自信的笑容，從細節開始",b:"預約一對一諮詢",g:["貼片","美白","全瓷"],url:"eclat-smile.tw",l:["深色背景搭配金色線條","精品般的排版與字體","高單價自費療程的質感"]},
    {k:"kids",n:"兒童牙科",tag:"親子友善",f:"適合兒童牙科與親子友善診所。",name:"彩虹兒童牙醫",h:"不怕看牙的小勇士",b:"幫孩子預約",g:["塗氟","窩溝封填","兒牙"],url:"rainbow-kids.tw",l:["活潑的黃色與紫色","可愛的原創牙齒角色","孩子開心、家長放心"]},
    {k:"implant",n:"植牙專科",tag:"專科權威",f:"適合植牙、矯正等需要專業形象的專科。",name:"恆達植牙中心",h:"專科團隊，完整評估",b:"預約植牙評估",g:["植牙","骨粉","全口重建"],url:"hengda-implant.tw",l:["沉穩的深藍與精準線條","強調醫師資歷與設備","建立專科的權威感"]},
    {k:"classic",n:"老字號在地",tag:"口碑診所",f:"適合經營多年、靠口碑的在地診所。",name:"仁和牙醫診所",h:"三十年來，守護街坊的笑容",b:"門診時間",g:["一般牙科","假牙","洗牙"],url:"renhe-dental.tw",l:["墨綠、米色與紅色招牌","強調診所歷史與在地口碑","保留老招牌的溫度"]}
  ];
  function site(s){
    return '<div class="frame-bar"><i></i><i></i><i></i><span>'+s.url+'</span></div>'+
      '<div class="mini"><div class="ms t-'+s.k+'">'+
        '<div class="ms-nav"><span class="ms-logo"><i></i>'+s.name+'</span><span class="ms-links"><span>療程</span><span>醫師</span><span>預約</span></span></div>'+
        '<div class="ms-hero"><div><b>'+s.h+'</b><small>週一至週六・早午夜診</small><span class="ms-btn">'+s.b+'</span></div><div class="ms-art">'+art[s.k]+'</div></div>'+
        '<div class="ms-cards">'+s.g.map(function(x){return "<span><i></i>"+x+"</span>"}).join("")+'</div>'+
        '<div class="ms-hours"><span>早診 9:00</span><span>午診 14:30</span><span>夜診 18:30</span></div>'+
        '<div class="ms-foot"><span>LINE 預約</span><span>Google 地圖</span></div>'+
      '</div></div>';
  }
  var gal=$("#gal"), modal=$("#modal"), lastBtn=null;
  styles.forEach(function(s){
    var b=document.createElement("button");b.className="style-card";b.type="button";
    b.setAttribute("aria-label","放大看「"+s.n+"」風格");
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
  var dname=["一","二","三","四","五","六"], sess=["早診","午診","夜診"];
  var sch={1:[[1,1,0],[1,0,1],[0,1,1],[1,1,0],[1,0,1],[1,0,0]],2:[[0,1,1],[1,1,0],[1,0,1],[0,1,1],[1,1,0],[0,0,0]],3:[[1,0,0],[0,1,1],[1,1,0],[1,0,0],[0,1,1],[1,1,0]]};
  function drawSched(doc){
    var h="<thead><tr><th></th>"+dname.map(function(d){return "<th>週"+d+"</th>"}).join("")+"</tr></thead><tbody>";
    sess.forEach(function(s,si){
      h+="<tr><th>"+s+"</th>";
      dname.forEach(function(d,di){
        var on=doc==="0"?[1,2,3].some(function(kk){return sch[kk][di][si]}):sch[doc][di][si];
        h+='<td class="'+(on?"on":"off")+'">'+(on?"看診":"休")+"</td>";
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
    $("#qmsg").textContent=left===0?"輪到您了，請到櫃台報到。":left===1?"下一位就是您，LINE 已經通知您準備過來。":"前面還有 "+left+" 位，約 "+left*8+" 分鐘。";
  });

  $$("#hx .chip").forEach(function(c){c.addEventListener("click",function(){c.classList.toggle("sel")})});

  var L={zh:["讓每一次看牙都安心","早診 9:00–12:00・午診 14:30–17:30・夜診 18:30–21:30"],en:["Dental care you can feel calm about","Morning 9:00–12:00 · Afternoon 14:30–17:30 · Evening 18:30–21:30"],ja:["安心して通える歯医者さん","午前 9:00–12:00・午後 14:30–17:30・夜 18:30–21:30"]};
  $$("#langs .chip").forEach(function(c){c.addEventListener("click",function(){$$("#langs .chip").forEach(function(e){e.classList.remove("sel")});c.classList.add("sel");$("#lt").textContent=L[c.dataset.l][0];$("#lp").textContent=L[c.dataset.l][1]})});

  /* ---------- checklist ---------- */
  var items=[
    ["手機上不用放大就看得清楚","病患大多用手機找牙醫"],
    ["3 秒內打開網頁","太慢的網站，病患會直接按返回"],
    ["可以線上預約，不用打電話","午休和下診後也能收到預約"],
    ["門診時間表清楚，依醫師分開","病患最常問的問題"],
    ["每項療程都有自己的說明頁","搜尋「植牙」「矯正」時才找得到您"],
    ["有醫師介紹與學經歷","建立第一次來的信任感"],
    ["Google 商家資料完整、照片最新","地圖是病患找牙醫的第一站"],
    ["有邀請病患留下評論的方式","評論多的診所更容易被選擇"],
    ["有 LINE 官方帳號並連到網站","台灣病患最習慣的聯絡方式"],
    ["網址是 https（有小鎖頭）","沒有的話瀏覽器會顯示「不安全」"],
    ["健保與自費項目標示清楚","減少病患的疑慮"],
    ["最近三個月有更新內容","Google 和 AI 都偏好持續更新的網站"]
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
    $("#st").textContent=n===0?"勾選左邊已經做到的項目。":n<6?"還有很多病患可能找不到您。好消息是，這些都很容易改善。":n<10?"基礎不錯！再補上幾項，就能明顯增加預約。":n<12?"很接近滿分了，剩下的我們可以幫您補齊。":"滿分！讓我們幫您維持下去，並加強 AI 搜尋。";
  }
  cl.addEventListener("change",score);
})();

(function(){var a=document.querySelectorAll('.langs a[data-l]');for(var i=0;i<a.length;i++){a[i].addEventListener('click',function(){try{document.cookie='lang='+this.getAttribute('data-l')+';path=/;max-age=31536000;samesite=lax;secure'}catch(e){}})}})();
