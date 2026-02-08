(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const t of s)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function a(s){const t={};return s.integrity&&(t.integrity=s.integrity),s.referrerPolicy&&(t.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?t.credentials="include":s.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(s){if(s.ep)return;s.ep=!0;const t=a(s);fetch(s.href,t)}})();let y=[],v=[],d={search:"",brand:[],pump:"",working:"",android:[],country:[],sort:"newest"};const u=document.getElementById("grid-container"),E=document.getElementById("empty-state"),$=document.getElementById("results-count"),C=document.getElementById("global-search"),P=document.getElementById("clear-filters"),L=document.getElementById("sort-order"),h=document.getElementById("detail-modal"),I=document.getElementById("close-modal"),A=document.getElementById("modal-body"),c={brand:{btn:document.getElementById("brand-select-btn"),list:document.getElementById("brand-options-list"),container:document.getElementById("brand-select-container"),label:"Brands"},android:{btn:document.getElementById("android-select-btn"),list:document.getElementById("android-options-list"),container:document.getElementById("android-select-container"),label:"Versions"},country:{btn:document.getElementById("country-select-btn"),list:document.getElementById("country-options-list"),container:document.getElementById("country-select-container"),label:"Countries"}},m={pump:document.getElementById("filter-pump"),working:document.getElementById("filter-working")},M="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vScCNaIguEZVTVFAgpv1kXHdsHl3fs6xT6RB2Z1CeVJ561AvvqGwxMhlmSHk4J056gMCAQE02sAWJvT/pub?gid=683363241&single=true&output=csv";async function N(){W(),await T()}async function T(){u.innerHTML='<div class="loading">Loading data...</div>';try{const e=await fetch(M);if(!e.ok)throw new Error("Network response was not ok");const n=await e.text();y=O(n),p()}catch(e){console.error("Error fetching data:",e),u.innerHTML=`
      <div class="error-message">
        <h3>Error loading data</h3>
        <p>Could not load the latest hardware list. Please check your connection and try again.</p>
        <button onclick="window.location.reload()" class="btn-text">Retry</button>
      </div>
    `}}function O(e){const n=e.split(/\r?\n/);if(n.length<2)return[];let a=-1;for(let t=0;t<Math.min(20,n.length);t++)if(n[t].includes("Submitted")&&n[t].includes("Working?")){a=t;break}if(a===-1)return[];const o=B(n[a]),s=[];for(let t=a+1;t<n.length;t++){const l=n[t].trim();if(!l)continue;const r=B(l);if(r.length<5)continue;const i={};o.forEach((f,g)=>{var w;i[f.trim()]=((w=r[g])==null?void 0:w.trim())||""}),(i.Submitted||i["Phone Brand"])&&s.push(i)}return s}function B(e){const n=[];let a="",o=!1;for(let s=0;s<e.length;s++){const t=e[s];t==='"'?o&&e[s+1]==='"'?(a+='"',s++):o=!o:t===","&&!o?(n.push(a),a=""):a+=t}return n.push(a),n}function S(){const e={brand:new Set,pump:new Set,working:new Set,android:new Set,country:new Set};y.forEach(n=>{n["Phone Brand"]&&e.brand.add(n["Phone Brand"]),n.Pump&&e.pump.add(n.Pump),n["Working?"]&&e.working.add(n["Working?"]),n["Android version"]&&e.android.add(n["Android version"]),n.Country&&e.country.add(n.Country)}),["brand","android","country"].forEach(n=>{const a=c[n].list,o=Array.from(e[n]).sort();a.innerHTML="",o.forEach(s=>{const t=document.createElement("label");t.className="select-option";const l=document.createElement("input");l.type="checkbox",l.value=s,d[n].includes(s)&&(l.checked=!0),l.addEventListener("change",r=>{r.target.checked?d[n].push(s):d[n]=d[n].filter(i=>i!==s),k(n),p()}),t.appendChild(l),t.appendChild(document.createTextNode(s)),a.appendChild(t)}),k(n)}),["pump","working"].forEach(n=>{const a=m[n],o=Array.from(e[n]).sort();for(;a.options.length>1;)a.remove(1);o.forEach(s=>{const t=document.createElement("option");t.value=s,t.textContent=s,a.appendChild(t)})})}function k(e){const n=c[e],a=d[e].length;a===0?n.btn.textContent=`Select ${n.label}`:n.btn.textContent=`${a} ${n.label} Selected`}function W(){C.addEventListener("input",e=>{d.search=e.target.value.toLowerCase(),p()}),L.addEventListener("change",e=>{d.sort=e.target.value,p()}),Object.keys(m).forEach(e=>{m[e].addEventListener("change",n=>{d[e]=n.target.value,p()})}),Object.keys(c).forEach(e=>{const n=c[e];n.btn.addEventListener("click",a=>{a.stopPropagation(),Object.keys(c).forEach(o=>{o!==e&&c[o].list.classList.add("hidden")}),n.list.classList.toggle("hidden")}),n.list.addEventListener("click",a=>{a.stopPropagation()})}),document.addEventListener("click",()=>{Object.values(c).forEach(e=>{e.list.classList.add("hidden")})}),P.addEventListener("click",()=>{d={search:"",brand:[],pump:"",working:"",android:[],country:[],sort:"newest"},C.value="",L.value="newest",Object.values(m).forEach(e=>e.value=""),S(),p()}),I.addEventListener("click",b),h.addEventListener("click",e=>{(e.target===h||e.target.classList.contains("modal-backdrop"))&&b()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&!h.classList.contains("hidden")&&b()})}function p(){v=y.filter(e=>{var r,i,f,g;const n=!d.search||((r=e["Phone Brand"])==null?void 0:r.toLowerCase().includes(d.search))||((i=e.Type)==null?void 0:i.toLowerCase().includes(d.search))||((f=e.Name)==null?void 0:f.toLowerCase().includes(d.search))||((g=e.Pump)==null?void 0:g.toLowerCase().includes(d.search)),a=d.brand.length===0||d.brand.includes(e["Phone Brand"]),o=!d.pump||e.Pump===d.pump,s=!d.working||e["Working?"]===d.working,t=d.android.length===0||d.android.includes(e["Android version"]),l=d.country.length===0||d.country.includes(e.Country);return n&&a&&o&&s&&t&&l}),v.sort((e,n)=>{const a=new Date(e.Submitted),o=new Date(n.Submitted);return isNaN(a)?1:isNaN(o)?-1:d.sort==="newest"?o-a:a-o}),c.brand.list.children.length===0&&S(),x(),D()}function x(){if(u.innerHTML="",v.length===0){u.classList.add("hidden"),E.classList.remove("hidden");return}u.classList.remove("hidden"),E.classList.add("hidden"),v.forEach(e=>{var s,t,l,r;const n=document.createElement("div");n.className="card",n.onclick=()=>V(e);let a="status-badge";(s=e["Working?"])!=null&&s.toLowerCase().includes("ok")||(t=e["Working?"])!=null&&t.toLowerCase().includes("tested")?a+=" status-ok":(l=e["Working?"])!=null&&l.toLowerCase().includes("problem")?a+=" status-warn":a+=" status-error";const o=e["Phone Brand Type"]||`${e["Phone Brand"]||""} ${e.Type||""}`.trim()||"Unknown Device";n.innerHTML=`
      <div class="card-header">
        <div class="phone-name">${o}</div>
        <div class="${a}">${e["Working?"]||"Unknown"}</div>
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
    `,u.appendChild(n)})}function V(e){var o,s,t;let n="status-badge";(o=e["Working?"])!=null&&o.toLowerCase().includes("ok")||(s=e["Working?"])!=null&&s.toLowerCase().includes("tested")?n+=" status-ok":(t=e["Working?"])!=null&&t.toLowerCase().includes("problem")?n+=" status-warn":n+=" status-error";const a=e["Phone Brand Type"]||`${e["Phone Brand"]||""} ${e.Type||""}`.trim()||"Unknown Device";A.innerHTML=`
    <div class="modal-header-large">
      <h2 class="modal-title">${a}</h2>
      <div class="modal-meta">
        <span class="${n}">${e["Working?"]}</span>
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
  `,h.classList.remove("hidden"),document.body.style.overflow="hidden"}function b(){h.classList.add("hidden"),document.body.style.overflow=""}function D(){$.textContent=v.length}N();
