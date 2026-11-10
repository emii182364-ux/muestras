(function(){function f(e){var c=e.getAttribute("data-css");if(c!==null){e.style.cssText+=";"+c;e.removeAttribute("data-css")}}function ap(r){if(r.nodeType===1&&r.hasAttribute("data-css"))f(r);if(r.querySelectorAll){var l=r.querySelectorAll("[data-css]");for(var i=0;i<l.length;i++)f(l[i])}}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)ap(a[j])}}).observe(document.documentElement,{childList:true,subtree:true});ap(document)})();

(function(){
  var $=function(s){return document.querySelector(s)}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
  var IC={
    cal:"M7 3v4M17 3v4M3.5 10h17M6.5 5h11a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z",
    user:"M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6",
    clock:"M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 7.5V12l3 2",
    pin:"M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    tooth:"M7.5 3C4.9 3 3 5 3 8c0 2.3.8 3.7 1.3 5.6.6 2.4.9 7.4 2.7 7.4 1.6 0 1.6-4.6 2.6-6 .5-.7 1.1-1 2.4-1s1.9.3 2.4 1c1 1.4 1 6 2.6 6 1.8 0 2.1-5 2.7-7.4.5-1.9 1.3-3.3 1.3-5.6 0-3-1.9-5-4.5-5-1.8 0-2.8 1-4.5 1S9.3 3 7.5 3z",
    phone:"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
  };
  var B=[
    ["線上預約","cal","開啟線上預約頁（LIFF）","out:我要預約","card:線上預約|選療程、醫師與時段，1 分鐘完成。|開始預約"],
    ["我的預約","user","查詢、改期或取消預約","out:我的預約","in:您下一次的預約：\n11 月 18 日（週三）夜診 19:00\n林醫師・洗牙\n\n需要改期請點「線上預約」重新選擇。"],
    ["門診時間","clock","傳送門診時間表","out:門診時間","in:門診時間（範例）\n週一至週五\n早診 09:00–12:00\n午診 14:30–17:30\n夜診 18:30–21:30\n週六 早診・午診\n週日休診"],
    ["交通資訊","pin","地址、地圖與停車資訊","out:交通資訊","card:晴光牙醫（範例）|台北市士林區範例路 1 號\n捷運士林站步行約 5 分鐘・附近有付費停車場|開啟地圖"],
    ["衛教專區","tooth","術後須知與口腔保健文章","out:衛教專區","card:衛教專區|拔牙後、植牙術後、美白後注意事項，還有刷牙與牙線的小教學。|看衛教文章"],
    ["聯絡我們","phone","撥打電話或留言給櫃台","out:聯絡我們","in:櫃台電話：02-0000-0000\n看診時間內都可以來電，或直接在這裡留言，我們會盡快回覆。"]
  ];
  var TH=[
    {n:"診所綠",bg:"#FFFFFF",hi:"#0B7A5E",hiInk:"#FFFFFF",ink:"#102F2C",line:"#DCE6E3"},
    {n:"清新藍",bg:"#F2F8F9",hi:"#1A8FA3",hiInk:"#FFFFFF",ink:"#163C46",line:"#D5E8EC"},
    {n:"溫暖橘",bg:"#FFFAF3",hi:"#E2763A",hiInk:"#FFFFFF",ink:"#4A3426",line:"#F3DCC0"},
    {n:"質感金",bg:"#15120F",hi:"#C9A96A",hiInk:"#15120F",ink:"#EDE3D1",line:"#3A3128"},
    {n:"童趣紫",bg:"#F3F6FF",hi:"#5B5BD6",hiInk:"#FFFFFF",ink:"#2A2F6B",line:"#D9E0FF"}
  ];
  var th=TH[0];
  function svg(p){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+p+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
  function applyTheme(){var r=$("#rm").style;r.setProperty("--rm-bg",th.bg);r.setProperty("--rm-hi",th.hi);r.setProperty("--rm-hi-ink",th.hiInk);r.setProperty("--rm-ink",th.ink);r.setProperty("--rm-line",th.line)}
  B.forEach(function(b){
    var el=document.createElement("button");el.type="button";el.innerHTML=svg(IC[b[1]])+"<span>"+b[0]+"</span>";
    el.onclick=function(){b.slice(3).forEach(function(m,i){setTimeout(function(){say(m)},i*450)})};
    $("#rm").appendChild(el);
    var a=document.createElement("div");a.className="act";a.innerHTML="<b>"+b[0]+"</b><span>"+b[2]+"</span>";$("#acts").appendChild(a);
  });
  function say(m){
    var t=m.slice(0,m.indexOf(":")),v=m.slice(m.indexOf(":")+1),d=document.createElement("div");
    if(t==="card"){var p=v.split("|");d.className="m in card";d.innerHTML="<b></b><div></div><span></span>";d.querySelector("b").textContent=p[0];d.querySelector("div").textContent=p[1];d.querySelector("span").textContent=p[2]}
    else{d.className="m "+t;d.textContent=v}
    var c=$("#chat");c.appendChild(d);c.scrollTop=c.scrollHeight;
  }
  TH.forEach(function(t,i){var b=document.createElement("button");b.style.background="linear-gradient(135deg,"+t.hi+" 50%,"+t.bg+" 50%)";b.setAttribute("aria-label",t.n);b.setAttribute("aria-pressed",i===0?"true":"false");
    b.onclick=function(){th=t;$$("#sw button").forEach(function(e){e.setAttribute("aria-pressed",e===b?"true":"false")});applyTheme()};$("#sw").appendChild(b)});
  applyTheme();
  $("#dl").onclick=function(){
    var go=function(){
      var cv=$("#cv"),x=cv.getContext("2d"),W=2500,H=1686,cw=W/3,chh=H/2;
      x.fillStyle=th.bg;x.fillRect(0,0,W,H);
      B.forEach(function(b,i){
        var cx=(i%3)*cw,cy=Math.floor(i/3)*chh;
        if(i===0){x.fillStyle=th.hi;x.fillRect(cx,cy,cw,chh)}
        var ink=i===0?th.hiInk:th.ink;
        x.save();x.translate(cx+cw/2-110,cy+chh/2-230);x.scale(220/24,220/24);x.strokeStyle=ink;x.lineWidth=1.6;x.lineCap="round";x.lineJoin="round";x.stroke(new Path2D(IC[b[1]]));x.restore();
        x.fillStyle=ink;x.font="700 120px 'Noto Sans TC', sans-serif";x.textAlign="center";x.textBaseline="middle";x.fillText(b[0],cx+cw/2,cy+chh/2+150);
      });
      x.strokeStyle=th.line;x.lineWidth=4;x.beginPath();x.moveTo(cw,0);x.lineTo(cw,H);x.moveTo(cw*2,0);x.lineTo(cw*2,H);x.moveTo(0,chh);x.lineTo(W,chh);x.stroke();
      cv.toBlob(function(bl){var u=URL.createObjectURL(bl),a=document.createElement("a");a.href=u;a.download="line-rich-menu-2500x1686.png";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},1000)},"image/png");
    };
    if(document.fonts&&document.fonts.load)document.fonts.load("700 120px 'Noto Sans TC'","預約").then(go,go);else go();
  };
})();
