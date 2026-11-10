(function(){function f(e){var c=e.getAttribute("data-css");if(c!==null){e.style.cssText+=";"+c;e.removeAttribute("data-css")}}function ap(r){if(r.nodeType===1&&r.hasAttribute("data-css"))f(r);if(r.querySelectorAll){var l=r.querySelectorAll("[data-css]");for(var i=0;i<l.length;i++)f(l[i])}}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)ap(a[j])}}).observe(document.documentElement,{childList:true,subtree:true});ap(document)})();

(function(){
  var $=function(s){return document.querySelector(s)}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
  var D={
    ext:{t:"拔牙後注意事項",s:"今天辛苦了。以下是一般的照顧方式，請以醫師當天的說明為準。",
      tl:[["拔牙後 1 小時","咬緊紗布止血，之後再輕輕吐掉，不要一直換新紗布。"],["當天","麻藥退之前小心咬到嘴唇或臉頰。可以冰敷臉頰，每次 15–20 分鐘。"],["24 小時內","不要漱口、不要用吸管、不要吐口水，讓血塊穩定。"],["2–3 天","腫脹通常在這時最明顯，之後會慢慢消退。"],["約 1 週","依醫師安排回診檢查或拆線。"]],
      ok:["吃溫涼、軟的食物","用另一側咀嚼","依醫師指示服藥","睡覺時枕頭墊高一點"],
      no:["抽菸、喝酒","太燙、辛辣、堅硬的食物","用舌頭或手指碰傷口","劇烈運動、泡澡、三溫暖"],
      call:["持續大量出血，咬紗布 30 分鐘後仍止不住","發燒，或腫痛越來越嚴重","嘴巴打不開、吞嚥或呼吸困難"]},
    imp:{t:"植牙術後注意事項",s:"植牙後的照顧，會影響傷口的癒合。請以醫師當天的說明為準。",
      tl:[["手術當天","咬紗布止血，冰敷臉頰。麻藥退之前先不要吃東西。"],["前 3 天","可能有腫脹或瘀青，屬於常見的反應。吃軟食，避免碰到手術部位。"],["約 1–2 週","依醫師安排回診檢查、拆線。"],["癒合期","植體與骨頭結合需要一段時間，期間依醫師指示使用臨時假牙。"],["完成後","定期回診與洗牙，好好清潔，植牙才能用得長久。"]],
      ok:["依醫師指示服藥與使用漱口水","用軟毛牙刷輕刷其他牙齒","吃溫涼、軟的食物","依約回診"],
      no:["抽菸（會影響癒合）","用手術側咀嚼","用力漱口、用吸管","劇烈運動"],
      call:["出血或腫痛越來越嚴重","發燒","植體或臨時假牙鬆動","傷口有異味或流膿"]},
    wht:{t:"美白後注意事項",s:"美白後的幾天，牙齒比較容易吸附顏色。請以醫師當天的說明為準。",
      tl:[["美白後 48 小時","避免深色、容易染色的食物與飲料。"],["前幾天","部分人會有短暫的牙齒敏感，通常會慢慢改善。"],["之後","定期洗牙與良好清潔，有助於維持牙齒的顏色。"]],
      ok:["白開水、牛奶","白飯、白麵、雞肉、魚肉","依醫師建議使用抗敏感牙膏","用吸管喝有顏色的飲料"],
      no:["咖啡、茶、紅酒、可樂","咖哩、醬油、番茄醬等深色醬料","抽菸","太冰或太燙的食物（容易敏感）"],
      call:["敏感或疼痛持續好幾天沒有改善","牙齦出現明顯不舒服"]}
  };
  var cur="ext";
  function li(a){return a.map(function(x){return "<li>"+x+"</li>"}).join("")}
  function draw(){
    var d=D[cur];
    $("#doc").innerHTML='<h2>'+d.t+'</h2><p class="sub">'+d.s+'</p><ol class="tl">'+d.tl.map(function(x){return "<li><b>"+x[0]+"</b><span>"+x[1]+"</span></li>"}).join("")+'</ol><div class="cols"><div class="box ok"><h3>建議這樣做</h3><ul>'+li(d.ok)+'</ul></div><div class="box no"><h3>這幾天先避免</h3><ul>'+li(d.no)+'</ul></div></div><div class="call"><h3>有以下狀況，請聯絡診所</h3><ul>'+li(d.call)+'</ul><p data-css="margin-top:8px;font-size:14px">晴光牙醫（範例）02-0000-0000・下診後如有緊急狀況請就近就醫。</p></div><p class="disc">以上為一般衛教資訊，每個人的狀況不同，請依醫師的說明為準。</p>';
    $("#lcv").textContent=d.t;$("#lmsg").textContent="今天辛苦了！這是您的"+d.t+"，回家後可以隨時打開來看。有任何問題都歡迎聯絡我們。";
    $("#st").classList.remove("show");
  }
  var tabs=$$(".tab");
  tabs.forEach(function(t,i){
    t.onclick=function(){sel(i)};
    t.onkeydown=function(e){if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();var n=(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;sel(n);tabs[n].focus()}};
  });
  function sel(i){tabs.forEach(function(t,j){t.setAttribute("aria-selected",i===j);t.tabIndex=i===j?0:-1});cur=tabs[i].dataset.k;draw()}
  $("#send").onclick=function(){$("#st").classList.add("show")};
  $("#print").onclick=function(){window.print()};
  draw();
})();
