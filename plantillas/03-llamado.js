(function(){function f(e){var c=e.getAttribute("data-css");if(c!==null){e.style.cssText+=";"+c;e.removeAttribute("data-css")}}function ap(r){if(r.nodeType===1&&r.hasAttribute("data-css"))f(r);if(r.querySelectorAll){var l=r.querySelectorAll("[data-css]");for(var i=0;i<l.length;i++)f(l[i])}}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)ap(a[j])}}).observe(document.documentElement,{childList:true,subtree:true});ap(document)})();

(function(){
  var $=function(s){return document.querySelector(s)};
  var R=[{n:"1 診",d:"林醫師",now:12,last:24},{n:"2 診",d:"陳醫師",now:15,last:22},{n:"3 診",d:"王醫師",now:9,last:20}];
  function drawTV(flash){
    $("#rooms").innerHTML=R.map(function(r,i){return '<div class="room'+(flash===i?" flash":"")+'"><div><small>'+r.n+'</small><h3>'+r.d+'</h3></div><div class="num">'+String(r.now).padStart(3,"0")+'</div><div class="nx">下一號 '+String(r.now+1).padStart(3,"0")+'</div></div>'}).join("");
  }
  function drawCtrl(){
    $("#ctrl").innerHTML="";
    R.forEach(function(r,i){
      var d=document.createElement("div");d.innerHTML="<b>"+r.n+"・"+r.d+"　目前 "+r.now+" 號</b>";
      var row=document.createElement("div");row.className="chips";
      var bk=document.createElement("button");bk.className="btn btn-ghost btn-sm";bk.textContent="上一號";
      var nx=document.createElement("button");nx.className="btn btn-sm";nx.textContent="下一號";
      bk.onclick=function(){if(r.now>1){r.now--;upd(-1)}};
      nx.onclick=function(){if(r.now<r.last){r.now++;upd(i)}};
      row.appendChild(bk);row.appendChild(nx);d.appendChild(row);$("#ctrl").appendChild(d);
    });
  }
  function upd(flash){drawTV(flash);drawCtrl();drawPhone();if(flash>=0)setTimeout(function(){drawTV(-1)},1600)}
  R.forEach(function(r,i){var o=document.createElement("option");o.value=i;o.textContent=r.n+"・"+r.d;$("#proom").appendChild(o)});
  function drawPhone(){
    var r=R[+$("#proom").value], me=parseInt($("#pnum").value,10);
    $("#pnow").textContent=r.now;$("#pme").textContent=isNaN(me)?"—":me;
    if(isNaN(me)||me<1){$("#pmsg").textContent="請輸入掛號單上的號碼。";$("#pbar").style.width="0";$("#pline").hidden=true;return}
    var left=me-r.now;
    $("#pbar").style.width=Math.max(4,Math.min(100,100-left*10))+"%";
    $("#pmsg").textContent=left<0?"已經過號，請到櫃台重新報到。":left===0?"輪到您了，請進診間。":left===1?"下一位就是您。":"前面還有 "+left+" 位，約 "+left*10+" 分鐘。";
    $("#pline").hidden=!(left>0&&left<=2);
  }
  $("#proom").onchange=drawPhone;$("#pnum").oninput=drawPhone;
  function clock(){var d=new Date();$("#clock").textContent=("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)}
  clock();setInterval(clock,20000);
  $("#fs").onclick=function(){var t=$("#tv");if(document.fullscreenElement){document.exitFullscreen()}else if(t.requestFullscreen){t.requestFullscreen().catch(function(){})}};
  drawTV(-1);drawCtrl();drawPhone();
})();
