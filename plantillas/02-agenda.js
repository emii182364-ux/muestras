(function(){function f(e){var c=e.getAttribute("data-css");if(c!==null){e.style.cssText+=";"+c;e.removeAttribute("data-css")}}function ap(r){if(r.nodeType===1&&r.hasAttribute("data-css"))f(r);if(r.querySelectorAll){var l=r.querySelectorAll("[data-css]");for(var i=0;i<l.length;i++)f(l[i])}}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)ap(a[j])}}).observe(document.documentElement,{childList:true,subtree:true});ap(document)})();

(function(){
  var $=function(s){return document.querySelector(s)};
  var CH=[["1 號診療椅","林醫師・矯正"],["2 號診療椅","陳醫師・植牙"],["3 號診療椅","王醫師・兒牙"]];
  var SESS=[["早診",["09:00","09:30","10:00","10:30","11:00","11:30"]],["午診",["14:30","15:00","15:30","16:00","16:30","17:00"]],["夜診",["18:30","19:00","19:30","20:00","20:30","21:00"]]];
  var ST=[["wait","待報到"],["in","已報到"],["now","看診中"],["done","完成"],["no","爽約"]];
  var NAMES=["王小姐","李先生","陳同學","林太太","張先生","黃小妹","吳先生","劉小姐","蔡阿姨","楊先生","許小姐","鄭先生","謝同學","郭先生","洪小姐","曾先生"];
  var TXS=["洗牙","補牙","矯正回診","根管治療","植牙術後","塗氟","拔牙","假牙調整"];
  var WK=["日","一","二","三","四","五","六"];
  var off=0, data={}, blocks={}, noHist={"李先生":2,"郭先生":1};
  function key(){return "d"+off}
  function seed(o){
    var list=[],r=7+o*3;
    for(var c=0;c<3;c++)for(var s=0;s<3;s++)SESS[s][1].forEach(function(t,ti){
      r=(r*37+11)%101;
      if(r%3!==0){var n=NAMES[(r+c)%NAMES.length];
        var status=o<0?(r%9===0?"no":"done"):o>0?"wait":(s===0?(r%7===0?"no":"done"):s===1&&ti<2?(ti===0?"now":"in"):"wait");
        list.push({c:c,s:s,t:t,name:n,tx:TXS[r%TXS.length],online:r%2===0,st:status});}
    });
    return list;
  }
  function day(){var d=new Date();d.setDate(d.getDate()+off);return d}
  function draw(){
    if(!data[key()])data[key()]=seed(off);if(!blocks[key()])blocks[key()]=[];
    var d=day();$("#dlabel").textContent=(off===0?"今天・":"")+(d.getMonth()+1)+"月"+d.getDate()+"日 週"+WK[d.getDay()];
    var g=$("#grid");g.innerHTML='<div class="gh" role="columnheader"></div>'+CH.map(function(c){return '<div class="gh" role="columnheader"><b>'+c[0]+'</b><span>'+c[1]+'</span></div>'}).join("");
    SESS.forEach(function(sg,s){
      var h=document.createElement("div");h.className="tm sessh";h.textContent=sg[0];g.appendChild(h);
      sg[1].forEach(function(t){
        var tm=document.createElement("div");tm.className="tm";tm.textContent=t;g.appendChild(tm);
        for(var c=0;c<3;c++){
          var cell=document.createElement("div");cell.className="cell";
          var b=blocks[key()].filter(function(x){return (x.c==="all"||+x.c===c)&&(x.s==="all"||x.s===sg[0])&&(!x.only||x.only===t)})[0];
          var a=data[key()].filter(function(x){return x.c===c&&x.s===s&&x.t===t})[0];
          if(a)cell.appendChild(apEl(a));
          else if(b){cell.innerHTML='<div class="blk"><span>已封鎖・'+(b.r||"未填原因")+'</span></div>'}
          else{var ad=document.createElement("button");ad.className="add";ad.textContent="＋ 封鎖";(function(c,sn){ad.onclick=function(){blocks[key()].push({c:c,s:sn,r:"臨時封鎖 "+t,only:t});draw()}})(c,sg[0]);
            ad.setAttribute("aria-label",CH[c][0]+" "+t+" 封鎖這個時段");cell.appendChild(ad)}
          g.appendChild(cell);
        }
      });
    });
    count();drawBlocks();drawNo();
  }
  function apEl(a){
    var el=document.createElement("div");el.className="ap s-"+a.st;
    var hist=noHist[a.name]||0;
    el.innerHTML='<div class="row"><b>'+a.name+'</b>'+(hist>=2&&$("#bl").checked?'<span class="flag">爽約 '+hist+' 次</span>':'')+'</div><span>'+a.tx+(a.online?"・線上預約":"")+'</span>';
    var sel=document.createElement("select");sel.setAttribute("aria-label",a.name+" 狀態");
    ST.forEach(function(s){var o=document.createElement("option");o.value=s[0];o.textContent=s[1];if(s[0]===a.st)o.selected=true;sel.appendChild(o)});
    sel.onchange=function(){var was=a.st;a.st=sel.value;if(sel.value==="no"&&was!=="no")noHist[a.name]=(noHist[a.name]||0)+1;if(was==="no"&&sel.value!=="no")noHist[a.name]=Math.max(0,(noHist[a.name]||1)-1);el.className="ap s-"+a.st;count();drawNo()};
    el.appendChild(sel);return el;
  }
  function count(){var l=data[key()];$("#n-all").textContent=l.length;["in","now","done","no"].forEach(function(k){$("#n-"+k).textContent=l.filter(function(x){return x.st===k}).length})}
  function drawBlocks(){
    var box=$("#blist");box.innerHTML="";
    blocks[key()].forEach(function(b,i){var d=document.createElement("div");d.className="li";
      d.innerHTML='<span>'+(b.c==="all"?"全部診療椅":CH[b.c][0])+"・"+(b.s==="all"?"整天":b.only?b.only:b.s)+"・"+(b.r||"未填原因")+'</span>';
      var x=document.createElement("button");x.className="x";x.textContent="解除";x.onclick=function(){blocks[key()].splice(i,1);draw()};d.appendChild(x);box.appendChild(d)});
  }
  function drawNo(){
    var box=$("#nolist");box.innerHTML="";
    var ks=Object.keys(noHist).filter(function(k){return noHist[k]>0});
    if(!ks.length){box.innerHTML='<p class="note">沒有爽約紀錄。</p>';return}
    ks.sort(function(a,b){return noHist[b]-noHist[a]}).forEach(function(k){var d=document.createElement("div");d.className="li";d.innerHTML="<span>"+k+"</span><span>爽約 "+noHist[k]+" 次</span>";box.appendChild(d)});
  }
  CH.forEach(function(c,i){var o=document.createElement("option");o.value=i;o.textContent=c[0];$("#bchair").appendChild(o)});
  $("#bgo").onclick=function(){blocks[key()].push({c:$("#bchair").value==="all"?"all":+$("#bchair").value,s:$("#bsess").value,r:$("#breason").value.trim()});$("#breason").value="";draw()};
  $("#dprev").onclick=function(){off--;draw()};$("#dnext").onclick=function(){off++;draw()};
  $("#bl").onchange=draw;
  $("#sync").onclick=function(){var b=this;b.disabled=true;$("#stext").textContent="同步中…";setTimeout(function(){$("#sdot").classList.add("on");var n=new Date();$("#stext").textContent="已同步（示意）・"+n.getHours()+":"+("0"+n.getMinutes()).slice(-2);b.disabled=false},900)};
  draw();
})();
