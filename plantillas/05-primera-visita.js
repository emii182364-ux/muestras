(function(){function f(e){var c=e.getAttribute("data-css");if(c!==null){e.style.cssText+=";"+c;e.removeAttribute("data-css")}}function ap(r){if(r.nodeType===1&&r.hasAttribute("data-css"))f(r);if(r.querySelectorAll){var l=r.querySelectorAll("[data-css]");for(var i=0;i<l.length;i++)f(l[i])}}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)ap(a[j])}}).observe(document.documentElement,{childList:true,subtree:true});ap(document)})();

(function(){
  var $=function(s){return document.querySelector(s)}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
  var fm=$("#fm");
  for(var i=0;i<=10;i++){var l=document.createElement("label");l.innerHTML='<input type="radio" name="pain" value="'+i+'"'+(i===0?" checked":"")+'><span>'+i+'</span>';$("#pain").appendChild(l)}
  ["高血壓","糖尿病","心臟病","氣喘","懷孕中","洗腎","服用抗凝血劑","骨質疏鬆用藥","都沒有"].forEach(function(t){var l=document.createElement("label");l.innerHTML='<input type="checkbox" name="hx" value="'+t+'">'+t;$("#hx").appendChild(l)});
  ["會怕看牙","容易緊張、想先聊聊","對麻藥曾有不舒服","希望先了解費用"].forEach(function(t){var l=document.createElement("label");l.innerHTML='<input type="checkbox" name="exp" value="'+t+'">'+t;$("#exp").appendChild(l)});
  var KEY=["高血壓","糖尿病","心臟病","懷孕中","洗腎","服用抗凝血劑","骨質疏鬆用藥"];
  $$('input[name=hx]').forEach(function(c){c.onchange=function(){if(c.value==="都沒有"&&c.checked)$$('input[name=hx]').forEach(function(o){if(o!==c)o.checked=false});else if(c.checked)fm.querySelector('input[value="都沒有"]').checked=false;prog()}});
  $$('input[name=allergy]').forEach(function(r){r.onchange=function(){$("#allergyBox").hidden=fm.allergy.value!=="有"}});
  function ok(k){var e=fm[k];if(k==="privacy")return e.checked;if(k==="phone")return /^09\d{8}$/.test(e.value.trim());return !!e.value.trim()}
  function prog(){var ks=["pname","birth","phone","main","privacy"],n=0;ks.forEach(function(k){var y=ok(k);if(y)n++;$('#chk li[data-k="'+k+'"]').className=y?"ok":""});$("#pb").style.width=(n/ks.length*100)+"%";return n===ks.length}
  fm.addEventListener("input",prog);fm.addEventListener("change",prog);
  fm.addEventListener("submit",function(e){
    e.preventDefault();
    var miss={pname:"姓名",birth:"出生日期",phone:"手機號碼（09 開頭 10 碼）",main:"主要的問題",privacy:"同意事項"},bad=[];
    Object.keys(miss).forEach(function(k){if(!ok(k))bad.push(k)});
    if(bad.length){$("#err").textContent="還沒完成："+bad.map(function(k){return miss[k]}).join("、");var el=fm[bad[0]];(el.length?el[0]:el).focus();return}
    $("#err").textContent="";
    var hx=$$('input[name=hx]:checked').map(function(c){return c.value}),flags=hx.filter(function(h){return KEY.indexOf(h)>-1});
    if(fm.allergy.value==="有")flags.push("過敏："+(fm.allergyTxt.value.trim()||"未填"));
    $("#flag").hidden=!flags.length;$("#flag").textContent="醫師請注意："+flags.join("、");
    var rows=[["姓名",fm.pname.value],["出生日期",fm.birth.value],["手機",fm.phone.value],["主要的問題",fm.main.value+"（疼痛 "+fm.pain.value+"／10）"],["補充",fm.desc.value||"—"],["健康狀況",hx.join("、")||"—"],["用藥",fm.meds.value||"—"],["看牙經驗",$$('input[name=exp]:checked').map(function(c){return c.value}).join("、")||"—"]];
    $("#sum").innerHTML="";rows.forEach(function(r){var dt=document.createElement("dt");dt.textContent=r[0];var dd=document.createElement("dd");dd.textContent=r[1];$("#sum").appendChild(dt);$("#sum").appendChild(dd)});
    fm.hidden=true;$("#done").classList.add("show");$("#done").focus();
  });
  $("#edit").onclick=function(){fm.hidden=false;$("#done").classList.remove("show");fm.pname.focus()};
  prog();
})();
