(function(){function f(e){var c=e.getAttribute("data-css");if(c!==null){e.style.cssText+=";"+c;e.removeAttribute("data-css")}}function ap(r){if(r.nodeType===1&&r.hasAttribute("data-css"))f(r);if(r.querySelectorAll){var l=r.querySelectorAll("[data-css]");for(var i=0;i<l.length;i++)f(l[i])}}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)ap(a[j])}}).observe(document.documentElement,{childList:true,subtree:true});ap(document)})();

(function(){
  var $=function(s){return document.querySelector(s)}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
  var today=new Date();today.setHours(0,0,0,0);
  function addD(n){var d=new Date(today);d.setDate(d.getDate()+n);return d}
  function f(d){return (d.getMonth()+1)+"/"+d.getDate()}
  var P=[
    ["王小姐","洗牙",-183,-3,"line"],["陳先生","洗牙",-178,2,"sms"],["小安（6 歲）","塗氟",-176,4,"line"],["李同學","矯正",-26,2,"line"],
    ["林太太","洗牙",-172,8,"line"],["張先生","植牙",-85,5,"sms"],["黃小妹（8 歲）","塗氟",-190,-10,"line"],["吳同學","矯正",-30,-2,"line"],["劉小姐","洗牙",-169,11,"sms"]
  ].map(function(p){return {name:p[0],item:p[1],last:addD(p[2]),due:addD(p[3]),ch:p[4],sel:false}}).sort(function(a,b){return a.due-b.due});
  var T={
    "洗牙":"{姓名}您好，這裡是{診所}。距離上次洗牙已經約半年，建議安排定期檢查與洗牙。\n方便的話，點下方連結選一個時間。",
    "塗氟":"{姓名}的家長您好，這裡是{診所}。孩子的塗氟時間快到了，定期塗氟有助於保護牙齒。\n可以點下方連結預約。",
    "矯正":"{姓名}您好，這裡是{診所}。您的矯正回診時間是 {日期} 左右，請點下方連結確認或選擇時段。",
    "植牙":"{姓名}您好，這裡是{診所}。植牙術後需要定期追蹤，建議於 {日期} 前後回診檢查。\n點下方連結就能預約。"
  };
  var flt="all", cur=0;
  function rows(){
    var tb=$("#rows");tb.innerHTML="";
    P.forEach(function(p,i){
      if(flt!=="all"&&p.item!==flt)return;
      var late=p.due<today;
      var tr=document.createElement("tr");if(i===cur)tr.className="cur";
      tr.innerHTML='<td><input type="checkbox" '+(p.sel?"checked":"")+' aria-label="選擇 '+p.name+'"></td><td><b>'+p.name+'</b></td><td>'+p.item+'</td><td>'+f(p.last)+'</td><td><span class="due'+(late?" late":"")+'">'+f(p.due)+(late?"（已過期）":"")+'</span></td><td><span class="ch '+p.ch+'">'+(p.ch==="line"?"LINE":"簡訊")+'</span></td>';
      tr.querySelector("input").onchange=function(e){p.sel=e.target.checked;cur=i;info();pv();rows()};
      tr.onclick=function(e){if(e.target.tagName!=="INPUT"){cur=i;$("#tpl").value=p.item;$("#txt").value=T[p.item];pv();rows()}};
      tb.appendChild(tr);
    });
  }
  function info(){
    var s=P.filter(function(p){return p.sel}),l=s.filter(function(p){return p.ch==="line"}).length;
    $("#send").disabled=!s.length;
    $("#selinfo").textContent=s.length?"已選 "+s.length+" 位：LINE "+l+" 位、簡訊 "+(s.length-l)+" 位":"勾選要提醒的病患。";
    $("#all").checked=s.length===P.length;
  }
  function fill(t,p){return t.replace(/\{姓名\}/g,p.name).replace(/\{項目\}/g,p.item).replace(/\{診所\}/g,"晴光牙醫").replace(/\{日期\}/g,f(p.due)).replace(/\{預約連結\}/g,"")}
  function smsCount(s){var n=Array.from(s).length;return n<=70?1:Math.ceil(n/67)}
  function pv(){
    var p=P[cur],raw=$("#txt").value,body=fill(raw,p).trim();
    $("#pvwho").textContent=p.name+"（"+(p.ch==="line"?"LINE":"簡訊")+"）";
    $("#pv").className="phone"+(p.ch==="sms"?" sms":"");
    var b=$("#pvb");b.textContent=body;
    var l=document.createElement("span");l.className="lnk";l.textContent=p.ch==="line"?"立即預約":"https://example.tw/b/xxxx";b.appendChild(l);
    var smsText=body+" https://example.tw/b/xxxx";
    var n=Array.from(smsText).length,c=smsCount(smsText);
    $("#meter").innerHTML=p.ch==="sms"?'<span>簡訊長度 <b>'+n+'</b> 字</span><span>約 <b>'+c+'</b> 則簡訊（中文每則 70 字）</span>':'<span>LINE 訊息 <b>'+Array.from(body).length+'</b> 字</span><span>附「立即預約」按鈕</span>';
  }
  $$("#flt .chip").forEach(function(c){c.onclick=function(){flt=c.dataset.f;$$("#flt .chip").forEach(function(e){e.setAttribute("aria-pressed",e===c?"true":"false")});rows()}});
  $("#all").onchange=function(e){P.forEach(function(p){p.sel=e.target.checked});info();rows()};
  $("#tpl").onchange=function(){$("#txt").value=T[$("#tpl").value];pv()};
  $("#txt").oninput=pv;
  $$("#vars button").forEach(function(b){b.onclick=function(){var t=$("#txt"),s=t.selectionStart||t.value.length;t.value=t.value.slice(0,s)+b.dataset.v+t.value.slice(t.selectionEnd||s);t.focus();t.selectionStart=t.selectionEnd=s+b.dataset.v.length;pv()}});
  $("#send").onclick=function(){
    var s=P.filter(function(p){return p.sel}),l=s.filter(function(p){return p.ch==="line"}),sm=s.length-l.length;
    var segs=s.filter(function(p){return p.ch==="sms"}).reduce(function(a,p){return a+smsCount(fill($("#txt").value,p)+" https://example.tw/b/xxxx")},0);
    var r=$("#result");r.classList.add("show");
    r.textContent="示範：不會真的發送。實際使用時，會傳 LINE 給 "+l.length+" 位、簡訊給 "+sm+" 位（共約 "+segs+" 則簡訊）。病患點連結預約後，會自動從這份名單移除。";
  };
  $("#txt").value=T["洗牙"];rows();info();pv();
})();
