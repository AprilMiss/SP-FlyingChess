window.Utils = {
  el(id){ return document.getElementById(id); },
  lines(text){ return String(text||"").split("\n").map(x=>x.trim()).filter(Boolean); },
  pick(list){ return (!list || !list.length) ? "" : list[Math.floor(Math.random()*list.length)]; },
  weightedPick(list, key="weight"){
    const arr=(list||[]).filter(x=>Number(x[key])>0);
    if(!arr.length) return null;
    const total=arr.reduce((s,x)=>s+Number(x[key]),0);
    let r=Math.random()*total;
    for(const item of arr){ r-=Number(item[key]); if(r<=0) return item; }
    return arr[arr.length-1];
  },
  clamp(n,min,max){ return Math.max(min, Math.min(max, n)); },
  downloadText(filename,text){
    const blob=new Blob([text],{type:"application/json;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url);
  },
  setStatus(id,text){ const n=document.getElementById(id); if(n) n.textContent=text; }
};
