(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();let E=[],f=[],l={search:"",brand:[],pump:"",working:"",android:[],country:[],aaps:[],cgm:[],sort:"newest"},A="list",g="Submitted",m="desc",h=[];const v=document.getElementById("grid-container"),S=document.getElementById("list-container"),P=document.getElementById("empty-state"),j=document.getElementById("results-count"),T=document.getElementById("global-search"),R=document.getElementById("clear-filters"),N=document.getElementById("sort-order"),k=document.getElementById("view-list"),I=document.getElementById("view-grid"),D=document.getElementById("data-table-head"),V=document.getElementById("data-table-body"),F=document.getElementById("column-select-btn"),L=document.getElementById("column-options-list"),C=document.getElementById("detail-modal"),q=document.getElementById("close-modal"),J=document.getElementById("modal-body"),p={brand:{btn:document.getElementById("brand-select-btn"),list:document.getElementById("brand-options-list"),container:document.getElementById("brand-select-container"),label:"Brands"},android:{btn:document.getElementById("android-select-btn"),list:document.getElementById("android-options-list"),container:document.getElementById("android-select-container"),label:"Versions"},country:{btn:document.getElementById("country-select-btn"),list:document.getElementById("country-options-list"),container:document.getElementById("country-select-container"),label:"Countries"},aaps:{btn:document.getElementById("aaps-select-btn"),list:document.getElementById("aaps-options-list"),container:document.getElementById("aaps-select-container"),label:"AAPS Versions"},cgm:{btn:document.getElementById("cgm-select-btn"),list:document.getElementById("cgm-options-list"),container:document.getElementById("cgm-select-container"),label:"CGM Brands"}},w={pump:document.getElementById("filter-pump"),working:document.getElementById("filter-working")},K="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vScCNaIguEZVTVFAgpv1kXHdsHl3fs6xT6RB2Z1CeVJ561AvvqGwxMhlmSHk4J056gMCAQE02sAWJvT/pub?gid=683363241&single=true&output=csv";async function Q(){Z(),await X()}async function X(){v.innerHTML='<div class="loading">Loading data...</div>';try{const e=await fetch(K);if(!e.ok)throw new Error("Network response was not ok");const t=await e.text();if(E=Y(t),h.length===0&&E.length>0){const s=["Submitted(Form)","Using(submitted)","Email Address","E-mail adrrs"];h=Object.keys(E[0]).filter(n=>n.trim()!==""&&!s.includes(n)).map(n=>({id:n,visible:!0})),G()}b()}catch(e){console.error("Error fetching data:",e),v.innerHTML=`
      <div class="error-message">
        <h3>Error loading data</h3>
        <p>Could not load the latest hardware list. Please check your connection and try again.</p>
        <button onclick="window.location.reload()" class="btn-text">Retry</button>
      </div>
    `}}function Y(e){const t=e.split(/\r?\n/);if(t.length<2)return[];let s=-1;for(let a=0;a<Math.min(20,t.length);a++)if(t[a].includes("Submitted")&&t[a].includes("Working?")){s=a;break}if(s===-1)return[];const o=H(t[s]),n=[];for(let a=s+1;a<t.length;a++){const d=t[a].trim();if(!d)continue;const r=H(d);if(r.length<5)continue;const i={};o.forEach((c,u)=>{var y;i[c.trim()]=((y=r[u])==null?void 0:y.trim())||""}),(i.Submitted||i["Phone Brand"])&&n.push(i)}return n}function H(e){const t=[];let s="",o=!1;for(let n=0;n<e.length;n++){const a=e[n];a==='"'?o&&e[n+1]==='"'?(s+='"',n++):o=!o:a===","&&!o?(t.push(s),s=""):s+=a}return t.push(s),t}function W(){const e={brand:new Set,pump:new Set,working:new Set,android:new Set,country:new Set,aaps:new Set,cgm:new Set};E.forEach(t=>{t["Phone Brand"]&&e.brand.add(t["Phone Brand"]),t.Pump&&e.pump.add(t.Pump),t["Working?"]&&e.working.add(t["Working?"]),t["Android version"]&&e.android.add(t["Android version"]),t.Country&&e.country.add(t.Country),t["AAPS Version"]&&e.aaps.add(t["AAPS Version"]),t["CGM Brand"]&&e.cgm.add(t["CGM Brand"])}),["brand","android","country","aaps","cgm"].forEach(t=>{const s=p[t].list,o=Array.from(e[t]).sort();s.innerHTML="",o.forEach(n=>{const a=document.createElement("label");a.className="select-option";const d=document.createElement("input");d.type="checkbox",d.value=n,l[t].includes(n)&&(d.checked=!0),d.addEventListener("change",r=>{r.target.checked?l[t].push(n):l[t]=l[t].filter(i=>i!==n),O(t),b()}),a.appendChild(d),a.appendChild(document.createTextNode(n)),s.appendChild(a)}),O(t)}),["pump","working"].forEach(t=>{const s=w[t],o=Array.from(e[t]).sort();for(;s.options.length>1;)s.remove(1);o.forEach(n=>{const a=document.createElement("option");a.value=n,a.textContent=n,s.appendChild(a)})})}function O(e){const t=p[e],s=l[e].length;s===0?t.btn.textContent=`Select ${t.label}`:t.btn.textContent=`${s} ${t.label} Selected`}function Z(){k.addEventListener("click",()=>{A="list",k.classList.add("active"),I.classList.remove("active"),x()}),I.addEventListener("click",()=>{A="grid",I.classList.add("active"),k.classList.remove("active"),x()}),T.addEventListener("input",e=>{l.search=e.target.value.toLowerCase(),b()}),N.addEventListener("change",e=>{l.sort=e.target.value,b()}),Object.keys(w).forEach(e=>{w[e].addEventListener("change",t=>{l[e]=t.target.value,b()})}),Object.keys(p).forEach(e=>{const t=p[e];t.btn.addEventListener("click",s=>{s.stopPropagation(),Object.keys(p).forEach(o=>{o!==e&&p[o].list.classList.add("hidden")}),t.list.classList.toggle("hidden")}),t.list.addEventListener("click",s=>{s.stopPropagation()})}),document.addEventListener("click",e=>{Object.values(p).forEach(t=>{t.list.classList.add("hidden")}),e.target.closest("#column-select-container")||L.classList.add("hidden")}),F.addEventListener("click",e=>{e.stopPropagation(),Object.values(p).forEach(t=>t.list.classList.add("hidden")),L.classList.toggle("hidden")}),L.addEventListener("click",e=>e.stopPropagation()),R.addEventListener("click",()=>{l={search:"",brand:[],pump:"",working:"",android:[],country:[],aaps:[],cgm:[],sort:"newest"},T.value="",N.value="newest",Object.values(w).forEach(e=>e.value=""),W(),b()}),q.addEventListener("click",$),C.addEventListener("click",e=>{(e.target===C||e.target.classList.contains("modal-backdrop"))&&$()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&!C.classList.contains("hidden")&&$()})}function b(){f=E.filter(e=>{var c,u,y,M;const t=!l.search||((c=e["Phone Brand"])==null?void 0:c.toLowerCase().includes(l.search))||((u=e.Type)==null?void 0:u.toLowerCase().includes(l.search))||((y=e.Name)==null?void 0:y.toLowerCase().includes(l.search))||((M=e.Pump)==null?void 0:M.toLowerCase().includes(l.search)),s=l.brand.length===0||l.brand.includes(e["Phone Brand"]),o=!l.pump||e.Pump===l.pump,n=!l.working||e["Working?"]===l.working,a=l.android.length===0||l.android.includes(e["Android version"]),d=l.country.length===0||l.country.includes(e.Country),r=l.aaps.length===0||l.aaps.includes(e["AAPS Version"]),i=l.cgm.length===0||l.cgm.includes(e["CGM Brand"]);return t&&s&&o&&n&&a&&d&&r&&i}),f.sort((e,t)=>{const s=new Date(e.Submitted),o=new Date(t.Submitted);return isNaN(s)?1:isNaN(o)?-1:l.sort==="newest"?o-s:s-o}),p.brand.list.children.length===0&&W(),x(),z()}function x(){if(f.length===0){v.classList.add("hidden"),S.classList.add("hidden"),P.classList.remove("hidden");return}P.classList.add("hidden"),A==="list"?(v.classList.add("hidden"),S.classList.remove("hidden"),B()):(S.classList.add("hidden"),v.classList.remove("hidden"),_())}function B(){if(D.innerHTML="",V.innerHTML="",f.length===0)return;const e=h.filter(o=>o.visible).map(o=>o.id);if(e.length===0)return;const t=document.createElement("tr");e.forEach(o=>{const n=document.createElement("th");n.textContent=o,g===o&&(n.innerHTML+=m==="asc"?" &uarr;":" &darr;"),n.classList.add("sortable-header"),n.onclick=()=>{g===o?m=m==="asc"?"desc":"asc":(g=o,m="asc"),B()},t.appendChild(n)}),D.appendChild(t),[...f].sort((o,n)=>{let a=o[g]||"",d=n[g]||"";if(g==="Submitted"||g==="Used since"){const r=new Date(a),i=new Date(d);if(!isNaN(r)&&!isNaN(i))return m==="asc"?r-i:i-r}return a=a.toString().toLowerCase(),d=d.toString().toLowerCase(),a<d?m==="asc"?-1:1:a>d?m==="asc"?1:-1:0}).forEach(o=>{const n=document.createElement("tr");n.onclick=()=>U(o),e.forEach(a=>{var r,i,c;const d=document.createElement("td");if(d.textContent=o[a]!==void 0?o[a]:"-",a==="Working?"){let u="status-badge";(r=o[a])!=null&&r.toLowerCase().includes("ok")||(i=o[a])!=null&&i.toLowerCase().includes("tested")?u+=" status-ok":(c=o[a])!=null&&c.toLowerCase().includes("problem")?u+=" status-warn":u+=" status-error",d.innerHTML=`<span class="${u}">${o[a]}</span>`}n.appendChild(d)}),V.appendChild(n)})}function G(){L.innerHTML="",h.forEach((e,t)=>{const s=document.createElement("div");s.className="column-option",s.draggable=!0,s.dataset.index=t,s.innerHTML=`
      <div class="drag-handle" title="Drag to reorder">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
      </div>
      <input type="checkbox" id="col-${t}" ${e.visible?"checked":""}>
      <label for="col-${t}" style="flex: 1; cursor: pointer; user-select: none;">${e.id}</label>
    `,s.querySelector("input").addEventListener("change",n=>{h[t].visible=n.target.checked,B()}),s.addEventListener("dragstart",n=>{n.dataTransfer.setData("text/plain",t),s.classList.add("dragging")}),s.addEventListener("dragend",()=>{s.classList.remove("dragging"),document.querySelectorAll(".column-option").forEach(n=>{n.style.borderTop="",n.style.borderBottom=""})}),s.addEventListener("dragover",n=>{n.preventDefault();const a=document.querySelector(".dragging");if(!a||a===s)return;const d=s.getBoundingClientRect(),r=d.y+d.height/2;n.clientY-r>0?(s.style.borderBottom="2px solid var(--primary-color)",s.style.borderTop=""):(s.style.borderTop="2px solid var(--primary-color)",s.style.borderBottom="")}),s.addEventListener("dragleave",()=>{s.style.borderTop="",s.style.borderBottom=""}),s.addEventListener("drop",n=>{n.preventDefault(),s.style.borderTop="",s.style.borderBottom="";const a=parseInt(n.dataTransfer.getData("text/plain"),10);let d=t;const r=s.getBoundingClientRect(),i=r.y+r.height/2;if(n.clientY-i>0&&d++,a===d||a+1===d)return;const c=h.splice(a,1)[0];d>a&&d--,h.splice(d,0,c),G(),B()}),L.appendChild(s)})}function _(){v.innerHTML="",f.forEach(e=>{var n,a,d,r;const t=document.createElement("div");t.className="card",t.onclick=()=>U(e);let s="status-badge";(n=e["Working?"])!=null&&n.toLowerCase().includes("ok")||(a=e["Working?"])!=null&&a.toLowerCase().includes("tested")?s+=" status-ok":(d=e["Working?"])!=null&&d.toLowerCase().includes("problem")?s+=" status-warn":s+=" status-error";const o=e["Phone Brand Type"]||`${e["Phone Brand"]||""} ${e.Type||""}`.trim()||"Unknown Device";t.innerHTML=`
      <div class="card-header">
        <div class="phone-name">${o}</div>
        <div class="${s}">${e["Working?"]||"Unknown"}</div>
      </div>
      
      <div class="card-details">
        <div class="detail-row">
          <span class="label">Pump</span>
          <span class="value">${e.Pump||"-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Android</span>
          <span class="value">${e["Android version"]||"-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Country</span>
          <span class="value">${e.Country||"-"}</span>
        </div>
      </div>

      <div class="card-footer">
        <div class="user-info">
          <span>By: ${e.Name||"Anonymous"}</span>
        </div>
        <div class="date">${((r=e.Submitted)==null?void 0:r.split(" ")[0])||""}</div>
      </div>
    `,v.appendChild(t)})}function U(e){var o,n,a;let t="status-badge";(o=e["Working?"])!=null&&o.toLowerCase().includes("ok")||(n=e["Working?"])!=null&&n.toLowerCase().includes("tested")?t+=" status-ok":(a=e["Working?"])!=null&&a.toLowerCase().includes("problem")?t+=" status-warn":t+=" status-error";const s=e["Phone Brand Type"]||`${e["Phone Brand"]||""} ${e.Type||""}`.trim()||"Unknown Device";J.innerHTML=`
    <div class="modal-header-large">
      <h2 class="modal-title">${s}</h2>
      <div class="modal-meta">
        <span class="${t}">${e["Working?"]}</span>
        <span class="detail-value">Submitted: ${e.Submitted}</span>
        <span class="detail-value">User: ${e.Name} ${e["Discord handle"]?`(${e["Discord handle"]})`:""}</span>
      </div>
    </div>
    
    <div class="detail-grid">
      <div class="detail-section">
        <h4>Device Config</h4>
        <div class="detail-item">
          <span class="detail-label">Pump</span>
          <span class="detail-value">${e.Pump||"-"}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Android Version</span>
          <span class="detail-value">${e["Android version"]||"-"}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">AAPS Version</span>
          <span class="detail-value">${e["AAPS Version"]||"-"}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Connection</span>
          <span class="detail-value">${e.Connection||"-"}</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>CGM Info</h4>
        <div class="detail-item">
          <span class="detail-label">CGM Brand</span>
          <span class="detail-value">${e["CGM Brand"]||"-"}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">BG Source</span>
          <span class="detail-value">${e["AAPS BG Source"]||"-"}</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>User Details</h4>
        <div class="detail-item">
          <span class="detail-label">Country</span>
          <span class="detail-value">${e.Country||"-"}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Used Since</span>
          <span class="detail-value">${e["Used since"]||"-"}</span>
        </div>
      </div>
      
      ${e.Comments?`
      <div class="comments-section">
        <span class="detail-label">Comments</span>
        <p class="detail-value" style="margin-top: 0.5rem;">${e.Comments}</p>
      </div>
      `:""}
    </div>
  `,C.classList.remove("hidden"),document.body.style.overflow="hidden"}function $(){C.classList.add("hidden"),document.body.style.overflow=""}function z(){j.textContent=f.length}Q();
