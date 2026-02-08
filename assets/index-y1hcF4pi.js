(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}})();let y=[],h=[],d={search:"",brand:"",pump:"",working:"",android:"",country:"",sort:"newest"};const c=document.getElementById("grid-container"),b=document.getElementById("empty-state"),E=document.getElementById("results-count"),C=document.getElementById("global-search"),B=document.getElementById("clear-filters"),L=document.getElementById("sort-order"),p=document.getElementById("detail-modal"),$=document.getElementById("close-modal"),S=document.getElementById("modal-body"),v={brand:document.getElementById("filter-brand"),pump:document.getElementById("filter-pump"),working:document.getElementById("filter-working"),android:document.getElementById("filter-android"),country:document.getElementById("filter-country")},P="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vScCNaIguEZVTVFAgpv1kXHdsHl3fs6xT6RB2Z1CeVJ561AvvqGwxMhlmSHk4J056gMCAQE02sAWJvT/pub?gid=683363241&single=true&output=csv";async function A(){T(),await M()}async function M(){c.innerHTML='<div class="loading">Loading data...</div>';try{const e=await fetch(P);if(!e.ok)throw new Error("Network response was not ok");const n=await e.text();y=I(n),u()}catch(e){console.error("Error fetching data:",e),c.innerHTML=`
      <div class="error-message">
        <h3>Error loading data</h3>
        <p>Could not load the latest hardware list. Please check your connection and try again.</p>
        <button onclick="window.location.reload()" class="btn-text">Retry</button>
      </div>
    `}}function I(e){const n=e.split(/\r?\n/);if(n.length<2)return[];let a=-1;for(let s=0;s<Math.min(20,n.length);s++)if(n[s].includes("Submitted")&&n[s].includes("Working?")){a=s;break}if(a===-1)return[];const o=k(n[a]),t=[];for(let s=a+1;s<n.length;s++){const r=n[s].trim();if(!r)continue;const l=k(r);if(l.length<5)continue;const i={};o.forEach((f,g)=>{var w;i[f.trim()]=((w=l[g])==null?void 0:w.trim())||""}),(i.Submitted||i["Phone Brand"])&&t.push(i)}return t}function k(e){const n=[];let a="",o=!1;for(let t=0;t<e.length;t++){const s=e[t];s==='"'?o&&e[t+1]==='"'?(a+='"',t++):o=!o:s===","&&!o?(n.push(a),a=""):a+=s}return n.push(a),n}function N(){const e={brand:new Set,pump:new Set,working:new Set,android:new Set,country:new Set};y.forEach(n=>{n["Phone Brand"]&&e.brand.add(n["Phone Brand"]),n.Pump&&e.pump.add(n.Pump),n["Working?"]&&e.working.add(n["Working?"]),n["Android version"]&&e.android.add(n["Android version"]),n.Country&&e.country.add(n.Country)}),Object.keys(e).forEach(n=>{const a=Array.from(e[n]).sort(),o=v[n];for(;o.options.length>1;)o.remove(1);a.forEach(t=>{const s=document.createElement("option");s.value=t,s.textContent=t,o.appendChild(s)})})}function T(){C.addEventListener("input",e=>{d.search=e.target.value.toLowerCase(),u()}),L.addEventListener("change",e=>{d.sort=e.target.value,u()}),Object.keys(v).forEach(e=>{v[e].addEventListener("change",n=>{d[e]=n.target.value,u()})}),B.addEventListener("click",()=>{d={search:"",brand:"",pump:"",working:"",android:"",country:"",sort:"newest"},C.value="",L.value="newest",Object.values(v).forEach(e=>e.value=""),u()}),$.addEventListener("click",m),p.addEventListener("click",e=>{(e.target===p||e.target.classList.contains("modal-backdrop"))&&m()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&!p.classList.contains("hidden")&&m()})}function u(){h=y.filter(e=>{var l,i,f,g;const n=!d.search||((l=e["Phone Brand"])==null?void 0:l.toLowerCase().includes(d.search))||((i=e.Type)==null?void 0:i.toLowerCase().includes(d.search))||((f=e.Name)==null?void 0:f.toLowerCase().includes(d.search))||((g=e.Pump)==null?void 0:g.toLowerCase().includes(d.search)),a=!d.brand||e["Phone Brand"]===d.brand,o=!d.pump||e.Pump===d.pump,t=!d.working||e["Working?"]===d.working,s=!d.android||e["Android version"]===d.android,r=!d.country||e.Country===d.country;return n&&a&&o&&t&&s&&r}),h.sort((e,n)=>{const a=new Date(e.Submitted),o=new Date(n.Submitted);return isNaN(a)?1:isNaN(o)?-1:d.sort==="newest"?o-a:a-o}),Object.keys(v.brand.options).length<=1&&N(),W(),D()}function W(){if(c.innerHTML="",h.length===0){c.classList.add("hidden"),b.classList.remove("hidden");return}c.classList.remove("hidden"),b.classList.add("hidden"),h.forEach(e=>{var t,s,r,l;const n=document.createElement("div");n.className="card",n.onclick=()=>O(e);let a="status-badge";(t=e["Working?"])!=null&&t.toLowerCase().includes("ok")||(s=e["Working?"])!=null&&s.toLowerCase().includes("tested")?a+=" status-ok":(r=e["Working?"])!=null&&r.toLowerCase().includes("problem")?a+=" status-warn":a+=" status-error";const o=e["Phone Brand Type"]||`${e["Phone Brand"]||""} ${e.Type||""}`.trim()||"Unknown Device";n.innerHTML=`
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
        <div class="date">${((l=e.Submitted)==null?void 0:l.split(" ")[0])||""}</div>
      </div>
    `,c.appendChild(n)})}function O(e){var o,t,s;let n="status-badge";(o=e["Working?"])!=null&&o.toLowerCase().includes("ok")||(t=e["Working?"])!=null&&t.toLowerCase().includes("tested")?n+=" status-ok":(s=e["Working?"])!=null&&s.toLowerCase().includes("problem")?n+=" status-warn":n+=" status-error";const a=e["Phone Brand Type"]||`${e["Phone Brand"]||""} ${e.Type||""}`.trim()||"Unknown Device";S.innerHTML=`
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
  `,p.classList.remove("hidden"),document.body.style.overflow="hidden"}function m(){p.classList.add("hidden"),document.body.style.overflow=""}function D(){E.textContent=h.length}A();
