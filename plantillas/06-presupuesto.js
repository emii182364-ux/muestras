(function(){function f(e){var c=e.getAttribute("data-css");if(c!==null){e.style.cssText+=";"+c;e.removeAttribute("data-css")}}function ap(r){if(r.nodeType===1&&r.hasAttribute("data-css"))f(r);if(r.querySelectorAll){var l=r.querySelectorAll("[data-css]");for(var i=0;i<l.length;i++)f(l[i])}}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)ap(a[j])}}).observe(document.documentElement,{childList:true,subtree:true});ap(document)})();

(function(){
  var $=function(s){return document.querySelector(s)}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
  var CAT=[["洗牙","nhi",0],["補牙（健保材料）","nhi",0],["補牙（自費樹脂）","self",3000],["根管治療","nhi",0],["全瓷冠","self",15000],["植牙（植體＋支台＋假牙）","self",80000],["隱形矯正（全口）","self",150000],["冷光美白","self",8000],["拔牙","nhi",0],["X 光・電腦斷層","self",2500],["掛號費・部分負擔","nhi",200]];
  var rows=[{c:10,t:"",q:1},{c:3,t:"36",q:1},{c:4,t:"36",q:1},{c:5,t:"46",q:1}];
  function money(n){return n.toLocaleString("zh-TW")}
  function draw(){
    var tb=$("#rows");tb.innerHTML="";
    rows.forEach(function(r,i){
      if(r.p===undefined)r.p=CAT[r.c][2];
      var tr=document.createElement("tr");
      var sel='<select aria-label="項目">'+CAT.map(function(c,j){return '<option value="'+j+'"'+(j===r.c?" selected":"")+">"+c[0]+"</option>"}).join("")+"</select>";
      var k=CAT[r.c][1];
      tr.innerHTML="<td>"+sel+'</td><td><input type="text" value="'+r.t+'" placeholder="例如 36" aria-label="牙位" data-css="width:90px"></td><td><span class="tag '+k+'">'+(k==="nhi"?"健保":"自費")+'</span></td><td class="num"><input type="number" class="price" min="0" step="100" value="'+r.p+'" aria-label="單價"></td><td class="num"><input type="number" min="1" value="'+r.q+'" aria-label="數量"></td><td class="num"><b>'+money(r.p*r.q)+'</b></td><td class="no-print"><button class="del" aria-label="刪除這一項">×</button></td>';
      var ins=tr.querySelectorAll("input");
      tr.querySelector("select").onchange=function(e){r.c=+e.target.value;r.p=CAT[r.c][2];draw()};
      ins[0].oninput=function(e){r.t=e.target.value};
      ins[1].onchange=function(e){r.p=Math.max(0,+e.target.value||0);draw()};
      ins[2].onchange=function(e){r.q=Math.max(1,+e.target.value||1);draw()};
      tr.querySelector(".del").onclick=function(){rows.splice(i,1);draw()};
      tb.appendChild(tr);
    });
    var nhi=0,self=0;rows.forEach(function(r){var v=r.p*r.q;if(CAT[r.c][1]==="nhi")nhi+=v;else self+=v});
    $("#t-nhi").textContent=money(nhi);$("#t-self").textContent=money(self);$("#t-all").textContent=money(nhi+self);
  }
  $("#add").onclick=function(){rows.push({c:0,t:"",q:1});draw();var s=$$("#rows select");s[s.length-1].focus()};
  var d=new Date();$("#qdate").valueAsDate=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  $("#qno").textContent=d.getFullYear()+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0")+"-01";
  function till(){var t=new Date($("#qdate").value||Date.now());t.setDate(t.getDate()+(+$("#valid").value));$("#till").textContent=t.getFullYear()+" 年 "+(t.getMonth()+1)+" 月 "+t.getDate()+" 日"}
  $("#qdate").onchange=till;$("#valid").onchange=till;till();
  // signature pads
  function pad(id){
    var c=document.getElementById(id),x=c.getContext("2d"),down=false;
    function size(){var r=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;var img=c.width?c.toDataURL():null;c.width=r.width*dpr;c.height=r.height*dpr;x.scale(dpr,dpr);x.lineWidth=2.4;x.lineCap="round";x.lineJoin="round";x.strokeStyle="#102F2C";if(img){var im=new Image();im.onload=function(){x.drawImage(im,0,0,r.width,r.height)};im.src=img}}
    function pt(e){var r=c.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]}
    c.addEventListener("pointerdown",function(e){down=true;c.setPointerCapture(e.pointerId);var p=pt(e);x.beginPath();x.moveTo(p[0],p[1])});
    c.addEventListener("pointermove",function(e){if(!down)return;var p=pt(e);x.lineTo(p[0],p[1]);x.stroke()});
    ["pointerup","pointercancel"].forEach(function(ev){c.addEventListener(ev,function(){down=false})});
    size();window.addEventListener("resize",size);
    return function(){var r=c.getBoundingClientRect();x.clearRect(0,0,r.width,r.height)};
  }
  var clear={sg1:pad("sg1"),sg2:pad("sg2")};
  $$(".sign button").forEach(function(b){b.onclick=function(){clear[b.dataset.c]()}});
  $("#print").onclick=function(){window.print()};
  draw();
})();
