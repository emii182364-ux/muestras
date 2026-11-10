(function(){try{var m=document.cookie.match(/(?:^|;\s*)lang=(zh|en|es)/);var l=m?m[1]:'';
if(!l){var n=((navigator.languages&&navigator.languages[0])||navigator.language||'').toLowerCase();
l=n.indexOf('zh')===0?'zh':n.indexOf('es')===0?'es':(/^dentista\./.test(location.hostname)?'es':(n?'en':'zh'));}
location.replace('/'+l+'/');}catch(e){}})();
