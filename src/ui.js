/* ======================= UI + LOGIN + ALL SECTIONS ======================= */
(function(){
const J = window.JATHAKA;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const YEAR = 365.2425, EPOCH = Date.UTC(2000,0,1,12), J2000=2451545.0;
const jd2date = jd => new Date(EPOCH + (jd-J2000)*86400000);
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtDate = d => `${String(d.getUTCDate()).padStart(2,'0')} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
const jdFmt = jd => fmtDate(jd2date(jd));
const jdMY = jd => {const d=jd2date(jd);return `${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;};
const nowJD = () => J2000+(Date.now()-EPOCH)/86400000;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SS=J.SIGN_SHORT, SG=J.SIGNS, SA=J.SIGN_SANS, PL=J.PLANETS, PG=J.PL_GLYPH, PSA=J.PL_SANS, SL=J.SIGN_LORD;

/* ---- offline atlas ---- */
const CITIES=[
["Bengaluru","Karnataka, India",12.9716,77.5946,5.5],["Mysuru","Karnataka, India",12.2958,76.6394,5.5],
["Bhadravathi","Karnataka, India",13.8489,75.7050,5.5],["Shivamogga","Karnataka, India",13.9299,75.5681,5.5],
["Birur","Karnataka, India",13.5936,75.9714,5.5],["Chikkamagaluru","Karnataka, India",13.3161,75.7720,5.5],
["Kadur","Karnataka, India",13.5527,76.0119,5.5],["Tumakuru","Karnataka, India",13.3379,77.1173,5.5],
["Davangere","Karnataka, India",14.4644,75.9218,5.5],["Hubballi","Karnataka, India",15.3647,75.1240,5.5],
["Dharwad","Karnataka, India",15.4589,75.0078,5.5],["Belagavi","Karnataka, India",15.8497,74.4977,5.5],
["Ballari","Karnataka, India",15.1394,76.9214,5.5],["Kalaburagi","Karnataka, India",17.3297,76.8343,5.5],
["Mangaluru","Karnataka, India",12.9141,74.8560,5.5],["Udupi","Karnataka, India",13.3409,74.7421,5.5],
["Hassan","Karnataka, India",13.0068,76.0996,5.5],["Mandya","Karnataka, India",12.5223,76.8954,5.5],
["Chitradurga","Karnataka, India",14.2251,76.3980,5.5],["Raichur","Karnataka, India",16.2076,77.3463,5.5],
["Bidar","Karnataka, India",17.9104,77.5199,5.5],["Vijayapura","Karnataka, India",16.8302,75.7100,5.5],
["Hospet","Karnataka, India",15.2689,76.3909,5.5],["Gadag","Karnataka, India",15.4315,75.6355,5.5],
["Karwar","Karnataka, India",14.8135,74.1297,5.5],["Sirsi","Karnataka, India",14.6195,74.8354,5.5],
["Kolar","Karnataka, India",13.1362,78.1291,5.5],["Chikkaballapur","Karnataka, India",13.4355,77.7315,5.5],
["Tarikere","Karnataka, India",13.7075,75.8146,5.5],["Sagara","Karnataka, India",14.1667,75.0333,5.5],
["Mumbai","Maharashtra, India",19.0760,72.8777,5.5],["Pune","Maharashtra, India",18.5204,73.8567,5.5],
["Nagpur","Maharashtra, India",21.1458,79.0882,5.5],["Nashik","Maharashtra, India",19.9975,73.7898,5.5],
["Delhi","Delhi, India",28.6139,77.2090,5.5],["New Delhi","Delhi, India",28.6139,77.2090,5.5],
["Chennai","Tamil Nadu, India",13.0827,80.2707,5.5],["Coimbatore","Tamil Nadu, India",11.0168,76.9558,5.5],
["Madurai","Tamil Nadu, India",9.9252,78.1198,5.5],["Tiruchirappalli","Tamil Nadu, India",10.7905,78.7047,5.5],
["Salem","Tamil Nadu, India",11.6643,78.1460,5.5],["Kolkata","West Bengal, India",22.5726,88.3639,5.5],
["Hyderabad","Telangana, India",17.3850,78.4867,5.5],["Warangal","Telangana, India",17.9689,79.5941,5.5],
["Visakhapatnam","Andhra Pradesh, India",17.6868,83.2185,5.5],["Vijayawada","Andhra Pradesh, India",16.5062,80.6480,5.5],
["Tirupati","Andhra Pradesh, India",13.6288,79.4192,5.5],["Guntur","Andhra Pradesh, India",16.3067,80.4365,5.5],
["Ahmedabad","Gujarat, India",23.0225,72.5714,5.5],["Surat","Gujarat, India",21.1702,72.8311,5.5],
["Vadodara","Gujarat, India",22.3072,73.1812,5.5],["Rajkot","Gujarat, India",22.3039,70.8022,5.5],
["Jaipur","Rajasthan, India",26.9124,75.7873,5.5],["Jodhpur","Rajasthan, India",26.2389,73.0243,5.5],
["Udaipur","Rajasthan, India",24.5854,73.7125,5.5],["Kota","Rajasthan, India",25.2138,75.8648,5.5],
["Lucknow","Uttar Pradesh, India",26.8467,80.9462,5.5],["Kanpur","Uttar Pradesh, India",26.4499,80.3319,5.5],
["Varanasi","Uttar Pradesh, India",25.3176,82.9739,5.5],["Agra","Uttar Pradesh, India",27.1767,78.0081,5.5],
["Prayagraj","Uttar Pradesh, India",25.4358,81.8463,5.5],["Meerut","Uttar Pradesh, India",28.9845,77.7064,5.5],
["Patna","Bihar, India",25.5941,85.1376,5.5],["Gaya","Bihar, India",24.7955,84.9994,5.5],
["Bhopal","Madhya Pradesh, India",23.2599,77.4126,5.5],["Indore","Madhya Pradesh, India",22.7196,75.8577,5.5],
["Gwalior","Madhya Pradesh, India",26.2183,78.1828,5.5],["Jabalpur","Madhya Pradesh, India",23.1815,79.9864,5.5],
["Ujjain","Madhya Pradesh, India",23.1765,75.7885,5.5],["Kochi","Kerala, India",9.9312,76.2673,5.5],
["Thiruvananthapuram","Kerala, India",8.5241,76.9366,5.5],["Kozhikode","Kerala, India",11.2588,75.7804,5.5],
["Thrissur","Kerala, India",10.5276,76.2144,5.5],["Bhubaneswar","Odisha, India",20.2961,85.8245,5.5],
["Guwahati","Assam, India",26.1445,91.7362,5.5],["Chandigarh","Chandigarh, India",30.7333,76.7794,5.5],
["Amritsar","Punjab, India",31.6340,74.8723,5.5],["Ludhiana","Punjab, India",30.9010,75.8573,5.5],
["Dehradun","Uttarakhand, India",30.3165,78.0322,5.5],["Ranchi","Jharkhand, India",23.3441,85.3096,5.5],
["Raipur","Chhattisgarh, India",21.2514,81.6296,5.5],["Panaji","Goa, India",15.4909,73.8278,5.5],
["Srinagar","J&K, India",34.0837,74.7973,5.5],["Jammu","J&K, India",32.7266,74.8570,5.5],
["Puducherry","Puducherry, India",11.9416,79.8083,5.5],["Colombo","Sri Lanka",6.9271,79.8612,5.5],
["Kathmandu","Nepal",27.7172,85.3240,5.75],["Dhaka","Bangladesh",23.8103,90.4125,6.0],
["Karachi","Pakistan",24.8607,67.0011,5.0],["Lahore","Pakistan",31.5204,74.3587,5.0],
["Dubai","UAE",25.2048,55.2708,4.0],["Abu Dhabi","UAE",24.4539,54.3773,4.0],
["Doha","Qatar",25.2854,51.5310,3.0],["Riyadh","Saudi Arabia",24.7136,46.6753,3.0],
["Muscat","Oman",23.5880,58.3829,4.0],["Singapore","Singapore",1.3521,103.8198,8.0],
["Kuala Lumpur","Malaysia",3.1390,101.6869,8.0],["Bangkok","Thailand",13.7563,100.5018,7.0],
["London","United Kingdom",51.5074,-0.1278,0.0],["Manchester","United Kingdom",53.4808,-2.2426,0.0],
["Birmingham","United Kingdom",52.4862,-1.8904,0.0],["Leicester","United Kingdom",52.6369,-1.1398,0.0],
["Paris","France",48.8566,2.3522,1.0],["Berlin","Germany",52.5200,13.4050,1.0],
["Frankfurt","Germany",50.1109,8.6821,1.0],["Zurich","Switzerland",47.3769,8.5417,1.0],
["Rome","Italy",41.9028,12.4964,1.0],["Amsterdam","Netherlands",52.3676,4.9041,1.0],
["Moscow","Russia",55.7558,37.6173,3.0],["New York","USA",40.7128,-74.0060,-5.0],
["Jersey City","USA",40.7178,-74.0431,-5.0],["Edison","USA",40.5187,-74.4121,-5.0],
["Chicago","USA",41.8781,-87.6298,-6.0],["Houston","USA",29.7604,-95.3698,-6.0],
["Dallas","USA",32.7767,-96.7970,-6.0],["Austin","USA",30.2672,-97.7431,-6.0],
["Atlanta","USA",33.7490,-84.3880,-5.0],["Boston","USA",42.3601,-71.0589,-5.0],
["Washington","USA",38.9072,-77.0369,-5.0],["Seattle","USA",47.6062,-122.3321,-8.0],
["San Francisco","USA",37.7749,-122.4194,-8.0],["San Jose","USA",37.3382,-121.8863,-8.0],
["Los Angeles","USA",34.0522,-118.2437,-8.0],["Fremont","USA",37.5485,-121.9886,-8.0],
["Toronto","Canada",43.6532,-79.3832,-5.0],["Vancouver","Canada",49.2827,-123.1207,-8.0],
["Sydney","Australia",-33.8688,151.2093,10.0],["Melbourne","Australia",-37.8136,144.9631,10.0],
["Tokyo","Japan",35.6762,139.6503,9.0],["Hong Kong","Hong Kong",22.3193,114.1694,8.0],
["Nairobi","Kenya",-1.2921,36.8219,3.0],["Auckland","New Zealand",-36.8485,174.7633,12.0]
];

/* ======================= celebrity showcase ======================= */
/* [name, role H/F, dob, time, place, lat, lon, tz]  - commonly-cited public data */
const CELEBS=[
["Amitabh Bachchan","H","1942-10-11","16:00","Allahabad, India",25.4358,81.8463,5.5],
["Shah Rukh Khan","H","1965-11-02","02:30","New Delhi, India",28.6139,77.2090,5.5],
["Aamir Khan","H","1965-03-14","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Salman Khan","H","1965-12-27","12:00","Indore, India",22.7196,75.8577,5.5],
["Hrithik Roshan","H","1974-01-10","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Ranbir Kapoor","H","1982-09-28","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Ranveer Singh","H","1985-07-06","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Akshay Kumar","H","1967-09-09","12:00","Amritsar, India",31.6340,74.8723,5.5],
["Aishwarya Rai","F","1973-11-01","12:00","Mangaluru, India",12.9141,74.8560,5.5],
["Madhuri Dixit","F","1967-05-15","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Deepika Padukone","F","1986-01-05","12:00","Copenhagen, Denmark",55.6761,12.5683,1.0],
["Priyanka Chopra","F","1982-07-18","12:00","Jamshedpur, India",22.8046,86.2029,5.5],
["Kareena Kapoor","F","1980-09-21","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Katrina Kaif","F","1983-07-16","12:00","Hong Kong",22.3193,114.1694,8.0],
["Alia Bhatt","F","1993-03-15","12:00","Mumbai, India",19.0760,72.8777,5.5],
["Kajol","F","1974-08-05","12:00","Mumbai, India",19.0760,72.8777,5.5]];
function initials(n){return n.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();}
function renderShowcase(){
  const H=$('#heroGrid'),F=$('#heroineGrid');if(!H||!F)return;
  const card=c=>`<button class="celeb" data-name="${esc(c[0])}" type="button"><span class="ini">${initials(c[0])}</span><span class="ci"><span class="cn">${esc(c[0])}</span><span class="cd">${c[2].split('-').reverse().join('/')}</span></span></button>`;
  H.innerHTML=CELEBS.filter(c=>c[1]==='H').map(card).join('');
  F.innerHTML=CELEBS.filter(c=>c[1]==='F').map(card).join('');
  $$('#showcase .celeb').forEach(b=>b.addEventListener('click',()=>{
    const c=CELEBS.find(x=>x[0]===b.dataset.name);if(!c)return;
    $('#name').value=c[0];$('#dob').value=c[2];$('#tob').value=c[3];$('#gender').value=c[1]==='F'?'female':'male';
    placeInput.value=c[4];$('#lat').value=c[5];$('#lon').value=c[6];$('#tz').value=c[7];
    selectedZone=zoneForCity((c[4].split(',')[0]||'').trim(),c[4]);
    $('#placeHint').textContent=`✓ ${c[5].toFixed(4)}°  ${c[6].toFixed(4)}°  ·  UTC${c[7]>=0?'+':''}${c[7]}${c[3]==='12:00'?'  · time approx (noon)':''}`;
    doCompute();
  }));
}

/* ======================= LOGIN (device-local, optional) ======================= */
const LS = {get(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}},
  del(k){try{localStorage.removeItem(k);}catch(e){}}};
function randHex(n){const a=new Uint8Array(n);
  if(typeof crypto!=='undefined'&&crypto.getRandomValues)crypto.getRandomValues(a);
  else for(let i=0;i<n;i++)a[i]=Math.floor(Math.random()*256);
  return [...a].map(b=>b.toString(16).padStart(2,'0')).join('');}
/* PBKDF2 (100k iterations, SHA-256, per-user random salt). Falls back to a labelled
   weaker hash only on non-secure contexts where crypto.subtle is unavailable. */
async function hashPw(pass,saltHex){
  if(typeof crypto!=='undefined'&&crypto.subtle&&crypto.subtle.deriveBits){
    const salt=Uint8Array.from(saltHex.match(/../g).map(h=>parseInt(h,16)));
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveBits']);
    const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'},key,256);
    return {algo:'pbkdf2',hash:[...new Uint8Array(bits)].map(b=>b.toString(16).padStart(2,'0')).join('')};
  }
  let h=5381;const s=saltHex+'::'+pass;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;
  return {algo:'weak',hash:'w'+h.toString(16)};
}
let CURRENT_USER=null;
function users(){return LS.get('jathaka-users')||{};}
function enterApp(user){
  CURRENT_USER=user;
  $('#loginScreen').style.display='none';
  $('#appWrap').style.display='block';
  const badge=$('#userBadge');
  if(user){badge.style.display='flex';$('#userName').textContent=user;$('#history').style.display='flex';renderHistory();}
  else{badge.style.display='none';$('#history').style.display='none';}
}
function initLogin(){
  // a shared ?c= link opens straight into the chart (as guest)
  try{const cs=new URLSearchParams(location.search).get('c');
    if(cs){const o=decodeChart(cs);if(o){enterApp(null);if(applyShared(o))doCompute();return;}}}catch(e){}
  const remembered=LS.get('jathaka-session');
  // tabs
  $$('.auth-tab').forEach(t=>t.addEventListener('click',()=>{
    $$('.auth-tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');
    $('#authMode').value=t.dataset.mode;
    $('#authTitle').textContent=t.dataset.mode==='signup'?'Create your account':'Welcome back';
    $('#authSubmit').textContent=t.dataset.mode==='signup'?'Create account':'Sign in';
    $('#authErr').textContent='';
  }));
  $('#guestBtn').addEventListener('click',()=>enterApp(null));
  $('#authForm').addEventListener('submit',async e=>{
    e.preventDefault();const err=$('#authErr');err.textContent='';
    const u=$('#authUser').value.trim().toLowerCase(), p=$('#authPass').value;
    const mode=$('#authMode').value;
    if(u.length<3){err.textContent='Username must be at least 3 characters.';return;}
    if(p.length<4){err.textContent='Password must be at least 4 characters.';return;}
    const db=users();
    if(mode==='signup'){
      if(db[u]){err.textContent='That username already exists on this device. Try signing in.';return;}
      const salt=randHex(16);const {hash,algo}=await hashPw(p,salt);
      db[u]={algo,salt,pw:hash,sessionToken:randHex(24),charts:[]};LS.set('jathaka-users',db);
    }else{
      const rec=db[u];
      if(!rec){err.textContent='No account with that username on this device.';return;}
      const {hash}=await hashPw(p,rec.salt||'jathaka::'+u);
      if(hash!==rec.pw){err.textContent='Incorrect password.';return;}
      if(!rec.sessionToken){rec.sessionToken=randHex(24);LS.set('jathaka-users',db);}
    }
    const rec=users()[u];
    LS.set('jathaka-session',{user:u,token:rec.sessionToken});enterApp(u);
  });
  $('#logoutBtn').addEventListener('click',()=>{LS.del('jathaka-session');location.reload();});
  // verify the stored session TOKEN, not just the username (prevents session bypass)
  if(remembered&&remembered.user&&remembered.token){
    const rec=users()[remembered.user];
    if(rec&&rec.sessionToken===remembered.token)enterApp(remembered.user);
  }
}
function saveChartForUser(input){
  if(!CURRENT_USER)return;const db=users();const u=db[CURRENT_USER];if(!u)return;
  u.charts=(u.charts||[]).filter(c=>!(c.name===input.name&&c.dob===`${input.y}-${input.mo}-${input.d}`));
  u.charts.unshift({name:input.name,dob:`${input.y}-${input.mo}-${input.d}`,tob:`${input.hh}:${input.mi}`,
    place:input.place,lat:input.lat,lon:input.lon,tz:input.tz,gender:input.gender,ts:Date.now()});
  u.charts=u.charts.slice(0,20);LS.set('jathaka-users',db);renderHistory();
}
function renderHistory(){
  const box=$('#history');if(!box)return;
  const db=users();const u=CURRENT_USER&&db[CURRENT_USER];
  const charts=(u&&u.charts)||[];
  const toolbar='<div class="hist-title">Your saved charts</div><div class="hist-actions">'+
    '<button class="mini-btn" id="expBtn" type="button">⤓ Export</button>'+
    '<label class="mini-btn" for="impFile">⤒ Import<input type="file" id="impFile" accept="application/json" hidden></label></div>';
  if(!charts.length){box.innerHTML=toolbar+'<div class="hist-empty">No saved charts yet - cast one and it will appear here.</div>';wireBackup(charts);return;}
  box.innerHTML=toolbar+charts.map((c,i)=>
    `<button class="hist-item" data-i="${i}"><b>${esc(c.name)}</b><small>${esc(c.place)} · ${c.dob}</small></button>`).join('');
  wireBackup(charts);
  box.querySelectorAll('.hist-item').forEach(b=>b.addEventListener('click',()=>{
    const c=charts[+b.dataset.i];const[y,mo,d]=c.dob.split('-');
    $('#name').value=c.name;$('#dob').value=`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    $('#tob').value=c.tob.split(':').map(x=>x.padStart(2,'0')).join(':');$('#gender').value=c.gender||'na';
    $('#place').value=c.place;$('#lat').value=c.lat;$('#lon').value=c.lon;$('#tz').value=c.tz;
    $('#placeHint').textContent=`✓ ${(+c.lat).toFixed(4)}°  ${(+c.lon).toFixed(4)}°  ·  UTC${c.tz>=0?'+':''}${c.tz}`;
    doCompute();}));
}
function wireBackup(charts){
  const exp=$('#expBtn');if(exp)exp.addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify(charts,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='jathaka-charts.json';
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
  const imp=$('#impFile');if(imp)imp.addEventListener('change',ev=>{
    const f=ev.target.files&&ev.target.files[0];if(!f)return;const r=new FileReader();
    r.onload=()=>{try{const arr=JSON.parse(r.result);if(!Array.isArray(arr))throw 0;
      const db=users();const u=db[CURRENT_USER];if(!u)return;u.charts=u.charts||[];
      const seen=new Set(u.charts.map(c=>c.name+'|'+c.dob));let added=0;
      arr.forEach(c=>{if(c&&c.name&&c.dob&&c.lat!=null&&c.lon!=null&&!seen.has(c.name+'|'+c.dob)){u.charts.push(c);seen.add(c.name+'|'+c.dob);added++;}});
      u.charts=u.charts.slice(0,50);LS.set('jathaka-users',db);renderHistory();
      alert(added?`Imported ${added} chart${added>1?'s':''}.`:'No new charts to import.');
    }catch(e){alert('Could not import - the file is not a valid Jathaka charts export.');}};
    r.readAsText(f);});
}

/* ======================= DST-aware timezone (offline, via built-in Intl) ======================= */
const US_ZONE={'New York':'America/New_York','Jersey City':'America/New_York','Edison':'America/New_York','Chicago':'America/Chicago','Houston':'America/Chicago','Dallas':'America/Chicago','Austin':'America/Chicago','Atlanta':'America/New_York','Boston':'America/New_York','Washington':'America/New_York','Seattle':'America/Los_Angeles','San Francisco':'America/Los_Angeles','San Jose':'America/Los_Angeles','Los Angeles':'America/Los_Angeles','Fremont':'America/Los_Angeles','Toronto':'America/Toronto','Vancouver':'America/Vancouver'};
const COUNTRY_ZONE={'India':'Asia/Kolkata','Sri Lanka':'Asia/Colombo','Nepal':'Asia/Kathmandu','Bangladesh':'Asia/Dhaka','Pakistan':'Asia/Karachi','Afghanistan':'Asia/Kabul','UAE':'Asia/Dubai','Qatar':'Asia/Qatar','Saudi Arabia':'Asia/Riyadh','Oman':'Asia/Muscat','Singapore':'Asia/Singapore','Malaysia':'Asia/Kuala_Lumpur','Thailand':'Asia/Bangkok','United Kingdom':'Europe/London','France':'Europe/Paris','Germany':'Europe/Berlin','Switzerland':'Europe/Zurich','Italy':'Europe/Rome','Netherlands':'Europe/Amsterdam','Russia':'Europe/Moscow','Japan':'Asia/Tokyo','Hong Kong':'Asia/Hong_Kong','China':'Asia/Shanghai','Kenya':'Africa/Nairobi','South Africa':'Africa/Johannesburg','New Zealand':'Pacific/Auckland','Australia':'Australia/Sydney'};
function zoneForCity(name,region){if(US_ZONE[name])return US_ZONE[name];
  const country=((region||'').split(',').pop()||region||'').trim();return COUNTRY_ZONE[country]||null;}
function zoneOffset(zone,y,mo,d,hh,mi){ // returns UTC offset in hours for that wall-clock moment, incl. DST
  try{const dtf=new Intl.DateTimeFormat('en-US',{timeZone:zone,timeZoneName:'longOffset'});
    let inst=Date.UTC(y,mo-1,d,hh,mi),off=null;
    for(let k=0;k<2;k++){ // 2 passes converge (offset depends on the instant, which depends on offset)
      const nm=dtf.formatToParts(new Date(inst)).find(p=>p.type==='timeZoneName').value;
      const m=nm.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);if(!m)return null;
      off=(+m[2])+(m[3]?(+m[3])/60:0);if(m[1]==='-')off=-off;
      inst=Date.UTC(y,mo-1,d,hh,mi)-off*3600000;}
    return off;
  }catch(e){return null;}}
let selectedZone=null;
function resolveTz(tz,zone,y,mo,d,hh,mi){ // prefer the DST-aware offset when a known zone is selected
  if(!zone)return {tz,dst:false};
  const o=zoneOffset(zone,y,mo,d,hh,mi);
  if(o==null)return {tz,dst:false};
  return {tz:o,dst:Math.abs(o-tz)>0.01};}

/* ======================= shareable deep link (base64, offline; NOT encrypted) ======================= */
let lastInput=null;
function encodeChart(i){try{return btoa(unescape(encodeURIComponent(JSON.stringify(
  {n:i.name,d:`${i.y}-${i.mo}-${i.d}`,t:`${i.hh}:${i.mi}`,la:i.lat,lo:i.lon,tz:i.tz,g:i.gender,p:i.place}))));}catch(e){return '';}}
function decodeChart(s){try{return JSON.parse(decodeURIComponent(escape(atob(s))));}catch(e){return null;}}
function shareUrl(i){return location.origin+location.pathname+'?c='+encodeChart(i);}
function applyShared(o){if(!o)return false;
  const[y,mo,d]=(o.d||'').split('-'),[hh,mi]=(o.t||'').split(':');
  $('#name').value=o.n||'';$('#dob').value=`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  $('#tob').value=`${String(hh).padStart(2,'0')}:${String(mi).padStart(2,'0')}`;$('#gender').value=o.g||'na';
  $('#place').value=o.p||'';$('#lat').value=o.la;$('#lon').value=o.lo;$('#tz').value=o.tz;selectedZone=null;
  $('#placeHint').textContent=`✓ ${(+o.la).toFixed(4)}°  ${(+o.lo).toFixed(4)}°  ·  UTC${o.tz>=0?'+':''}${o.tz}`;return true;}

/* ======================= autocomplete / form ======================= */
const placeInput=$('#place'), acList=$('#acList');
let acIdx=-1, acMatches=[];
function searchCities(q){q=q.trim().toLowerCase();if(q.length<2)return[];
  const s=[],c=[];for(const x of CITIES){const n=x[0].toLowerCase();
    if(n.startsWith(q))s.push(x);else if(n.includes(q)||x[1].toLowerCase().includes(q))c.push(x);}
  return s.concat(c).slice(0,8);}
function renderAC(){if(!acMatches.length){acList.classList.remove('show');return;}
  acList.innerHTML=acMatches.map((c,i)=>`<div class="ac-item${i===acIdx?' active':''}" data-i="${i}">${c[0]} <small>· ${c[1]} · ${c[2].toFixed(2)}° ${c[3].toFixed(2)}° · UTC${c[4]>=0?'+':''}${c[4]}</small></div>`).join('');
  acList.classList.add('show');}
placeInput.addEventListener('input',()=>{selectedZone=null;acMatches=searchCities(placeInput.value);acIdx=-1;renderAC();});
placeInput.addEventListener('keydown',e=>{if(!acMatches.length)return;
  if(e.key==='ArrowDown'){acIdx=Math.min(acIdx+1,acMatches.length-1);renderAC();e.preventDefault();}
  else if(e.key==='ArrowUp'){acIdx=Math.max(acIdx-1,0);renderAC();e.preventDefault();}
  else if(e.key==='Enter'&&acIdx>=0){pickCity(acMatches[acIdx]);e.preventDefault();}
  else if(e.key==='Escape')acList.classList.remove('show');});
acList.addEventListener('click',e=>{const it=e.target.closest('.ac-item');if(it)pickCity(acMatches[+it.dataset.i]);});
document.addEventListener('click',e=>{if(!e.target.closest('.field'))acList.classList.remove('show');});
function pickCity(c){placeInput.value=c[0]+', '+c[1];acList.classList.remove('show');
  $('#lat').value=c[2];$('#lon').value=c[3];$('#tz').value=c[4];
  selectedZone=zoneForCity(c[0],c[1]);
  const z=selectedZone?'  ·  '+selectedZone+' (auto DST)':'';
  $('#placeHint').textContent=`✓ ${c[2].toFixed(4)}°  ${c[3].toFixed(4)}°  ·  UTC${c[4]>=0?'+':''}${c[4]}${z}`;}
// manual edits to coordinates/timezone/place text disable the auto-zone (respect the user's own numbers)
['lat','lon','tz'].forEach(id=>$('#'+id).addEventListener('input',()=>{selectedZone=null;}));
$('#manualToggle').addEventListener('click',()=>{const on=$('#mLat').classList.toggle('show');
  $('#mLon').classList.toggle('show');$('#mTz').classList.toggle('show');
  $('#manualToggle').textContent=(on?'▾':'▸')+' Enter latitude / longitude / timezone manually';});
(function(){let t=LS.get('jathaka-theme');if(t)document.documentElement.setAttribute('data-theme',t);
  $('#themeBtn').addEventListener('click',()=>{const cur=document.documentElement.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
    const nx=cur==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',nx);LS.set('jathaka-theme',nx);if(window._stars)window._stars();});})();
$('#sampleBtn').addEventListener('click',()=>{$('#name').value='R. D. Lohith';$('#dob').value='2002-08-29';
  $('#tob').value='12:30';$('#gender').value='male';pickCity(["Bengaluru","Karnataka, India",12.96,77.66,5.5]);});

$('#calcBtn').addEventListener('click',doCompute);
function doCompute(){
  const err=$('#formErr');err.textContent='';
  const dob=$('#dob').value,tob=$('#tob').value;
  if(!dob){err.textContent='Please enter a date of birth.';return;}
  if(!tob){err.textContent='Please enter a time of birth - the Lagna depends on it.';return;}
  let lat=parseFloat($('#lat').value),lon=parseFloat($('#lon').value),tz=parseFloat($('#tz').value);
  if(isNaN(lat)||isNaN(lon)){err.textContent='Pick a birth place, or open the manual panel and enter latitude & longitude.';return;}
  if(isNaN(tz))tz=5.5;
  if(lat<-90||lat>90){err.textContent='Latitude must be between -90° and 90°.';return;}
  if(lon<-180||lon>180){err.textContent='Longitude must be between -180° and 180°.';return;}
  if(tz<-14||tz>14){err.textContent='Timezone must be between -14 and +14 hours from UTC.';return;}
  const[y,mo,d]=dob.split('-').map(Number),[hh,mi]=tob.split(':').map(Number);
  if(!y||y<1700||y>2200){err.textContent='Please enter a birth year between 1700 and 2200 (the ephemeris range).';return;}
  const rz=resolveTz(tz,selectedZone,y,mo,d,hh,mi);tz=rz.tz; // DST-aware offset when a known zone is selected
  const input={y,mo,d,hh,mi,lat,lon,tz,dst:rz.dst,zone:selectedZone,name:$('#name').value.trim()||'This nativity',
    gender:$('#gender').value,place:placeInput.value.trim()||`${lat.toFixed(3)}°, ${lon.toFixed(3)}°`};
  lastInput=input;
  let chart;
  try{chart=J.buildChart(input);
    J.bhavaChalit(chart); // sets chart._mc
    const ev=J.sunEvents(chart); chart._dayBirth=ev?(chart.jd>=ev.riseJD&&chart.jd<ev.setJD):true;
  }catch(e){err.textContent='Computation error: '+e.message;console.error(e);return;}
  saveChartForUser(input);
  renderReport(chart,input);
  $('#report').classList.add('show');$('#jumpNav').classList.add('show');
  requestAnimationFrame(()=>smoothTo($('#sec-sum')));
}

/* ======================= small helpers ======================= */
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const secHead=(n,t,note)=>`<div class="sec-head"><span class="num">${n}</span><h2>${t}</h2>${note?`<span class="note">${note}</span>`:''}</div>`;
const houseFrom=(fromSign,sign)=>((sign-fromSign)%12+12)%12+1;
const ord=n=>n+({1:'st',2:'nd',3:'rd'}[n%10>3||[11,12,13].includes(n%100)?0:n%10]||'th');

/* planet attributes for remedies/lucky */
const PATTR={0:{day:'Sunday',col:'red / orange',num:'1',gem:'Ruby',metal:'Gold / Copper',dir:'East',dev:'Surya / Shiva'},
1:{day:'Monday',col:'white / cream',num:'2',gem:'Pearl',metal:'Silver',dir:'North-West',dev:'Parvati / Gauri'},
2:{day:'Tuesday',col:'red / coral',num:'9',gem:'Red Coral',metal:'Copper',dir:'South',dev:'Hanuman / Kartikeya'},
3:{day:'Wednesday',col:'green',num:'5',gem:'Emerald',metal:'Brass',dir:'North',dev:'Vishnu'},
4:{day:'Thursday',col:'yellow',num:'3',gem:'Yellow Sapphire',metal:'Gold',dir:'North-East',dev:'Brahma / Guru'},
5:{day:'Friday',col:'white / pink',num:'6',gem:'Diamond',metal:'Silver',dir:'South-East',dev:'Lakshmi'},
6:{day:'Saturday',col:'blue / black',num:'8',gem:'Blue Sapphire',metal:'Iron',dir:'West',dev:'Shani / Hanuman'},
7:{day:'-',col:'smoky grey',num:'4',gem:'Hessonite',metal:'Lead',dir:'South-West',dev:'Durga'},
8:{day:'-',col:'grey',num:'7',gem:"Cat's Eye",metal:'-',dir:'-',dev:'Ganesha'}};
const NAME_SYL={0:['Chu','Che','Cho','La'],1:['Li','Lu','Le','Lo'],2:['A','I','U','E'],3:['O','Va','Vi','Vu'],
4:['Ve','Vo','Ka','Ki'],5:['Ku','Gha','Nga','Chha'],6:['Ke','Ko','Ha','Hi'],7:['Hu','He','Ho','Da'],
8:['Di','Du','De','Do'],9:['Ma','Mi','Mu','Me'],10:['Mo','Ta','Ti','Tu'],11:['Te','To','Pa','Pi'],
12:['Pu','Sha','Na','Tha'],13:['Pe','Po','Ra','Ri'],14:['Ru','Re','Ro','Ta'],15:['Ti','Tu','Te','To'],
16:['Na','Ni','Nu','Ne'],17:['No','Ya','Yi','Yu'],18:['Ye','Yo','Bha','Bhi'],19:['Bhu','Dha','Pha','Dha'],
20:['Bhe','Bho','Ja','Ji'],21:['Ju','Je','Jo','Gha'],22:['Ga','Gi','Gu','Ge'],23:['Go','Sa','Si','Su'],
24:['Se','So','Da','Di'],25:['Du','Tha','Jha','Da'],26:['De','Do','Cha','Chi']};

/* interpretation text banks */
const LAGNA_TXT=["a pioneering, energetic Meṣa Lagna - direct, courageous, quick to initiate and happiest leading from the front.",
"a steady, sensual Vṛṣabha Lagna - patient, resourceful, value-driven and drawn to comfort, beauty and security.",
"a curious, communicative Mithuna Lagna - versatile, witty, mentally restless and skilled with words and ideas.",
"a nurturing, sensitive Karka Lagna - emotionally intelligent, protective of home and family, guided by feeling and memory.",
"a regal, warm-hearted Siṁha Lagna - confident, generous, dignified and born to be seen and to lead.",
"an analytical, service-minded Kanyā Lagna - precise, discerning, health-conscious and quietly perfectionist.",
"a graceful, relational Tulā Lagna - diplomatic, fair-minded, aesthetically refined and happiest in partnership.",
"an intense, penetrating Vṛścika Lagna - magnetic, private, deeply resilient and transformative under pressure.",
"an expansive, philosophical Dhanu Lagna - optimistic, principled, freedom-loving and a natural teacher or seeker.",
"a disciplined, ambitious Makara Lagna - pragmatic, enduring, responsible and built for the long climb to authority.",
"an original, humanitarian Kumbha Lagna - independent, inventive, socially conscious and drawn to the unconventional.",
"a compassionate, imaginative Mīna Lagna - intuitive, gentle, spiritually inclined and emotionally boundless."];
const MOON_TXT=["an impulsive, warm, pioneering emotional nature; you act first and recover fast.",
"a calm, steady, comfort-seeking mind that resists being rushed and treasures security.",
"a quick, chatty, adaptable mind that thrives on variety and mental stimulation.",
"a deeply feeling, caretaking, intuitive heart, strongly tied to home and roots.",
"a proud, generous, expressive emotional nature that needs appreciation to flourish.",
"a careful, modest, analytical mind, happiest when things are useful and in order.",
"a harmony-seeking, partnership-oriented heart that dislikes conflict and craves balance.",
"an intense, secretive, emotionally profound nature with great powers of endurance.",
"an optimistic, restless, truth-seeking mind that needs room to roam and believe.",
"a serious, self-reliant, goal-driven emotional nature that matures early and endures.",
"a detached, original, idealistic mind that thinks in systems and befriends widely.",
"a tender, dreamy, compassionate heart, porous to others and rich in imagination."];
const HOUSE_THEME=["self, vitality & body","wealth, speech & family","courage, siblings & effort","home, mother, land & comfort","children, intellect & past merit","health, service, debts & rivals","marriage, partnership & the public","longevity, transformation & hidden matters","fortune, dharma, father & higher learning","career, status & action","gains, income & aspirations","loss, expense, moksha & foreign lands"];
const DIG=["North","North-East","East","South-East","South","South-West","West","North-West"];

/* ---- chart SVGs (North & South Indian) ---- */
const NI_POS=[null,[.50,.27],[.27,.13],[.13,.27],[.27,.50],[.13,.73],[.27,.87],[.50,.73],[.73,.87],[.87,.73],[.73,.50],[.87,.27],[.73,.13]];
const NI_SIGN=[null,[.50,.42],[.13,.05],[.05,.13],[.42,.50],[.05,.87],[.13,.95],[.50,.58],[.87,.95],[.95,.87],[.58,.50],[.95,.13],[.87,.05]];
function northChart(ascSign,placements){const S=300;let g=`<svg class="chart" viewBox="0 0 ${S} ${S}" role="img" aria-label="North Indian chart">`;
  g+=`<rect class="bg" x="1" y="1" width="${S-2}" height="${S-2}" rx="6"/><rect class="cl" x="1" y="1" width="${S-2}" height="${S-2}" rx="6"/>`;
  g+=`<path class="cl" d="M1 1 L${S-1} ${S-1} M${S-1} 1 L1 ${S-1}"/><path class="cl" d="M${S/2} 1 L${S-1} ${S/2} L${S/2} ${S-1} L1 ${S/2} Z"/>`;
  for(let h=1;h<=12;h++){const sign=(ascSign+h-1)%12;const sp=NI_SIGN[h];g+=`<text class="sign-no" x="${sp[0]*S}" y="${sp[1]*S}" text-anchor="middle">${sign+1}</text>`;}
  const bh={};placements.forEach(p=>{(bh[p.house]=bh[p.house]||[]).push(p);});
  for(const h in bh){const pos=NI_POS[h],arr=bh[h],per=3,lines=Math.ceil(arr.length/per);
    arr.forEach((p,i)=>{const row=Math.floor(i/per),col=i%per,inRow=Math.min(per,arr.length-row*per);
      const x=pos[0]*S+(col-(inRow-1)/2)*22,y=pos[1]*S+(row-(lines-1)/2)*15+4;
      g+=`<text class="pl ${p.cls||''}" x="${x}" y="${y}" text-anchor="middle">${p.glyph}</text>`;});}
  return g+'</svg>';}
const SI_CELL=[[0,0,11],[1,0,0],[2,0,1],[3,0,2],[3,1,3],[3,2,4],[3,3,5],[2,3,6],[1,3,7],[0,3,8],[0,2,9],[0,1,10]];
function southChart(ascSign,placements){const S=300,c=S/4;let g=`<svg class="chart" viewBox="0 0 ${S} ${S}" role="img" aria-label="South Indian chart">`;
  g+=`<rect class="bg" x="1" y="1" width="${S-2}" height="${S-2}" rx="6"/>`;
  const bs={};placements.forEach(p=>{(bs[p.sign]=bs[p.sign]||[]).push(p);});
  for(const cell of SI_CELL){const[cx,cy,sign]=cell,x=cx*c,y=cy*c;
    g+=`<rect class="${sign===ascSign?'cl':'cl-soft'}" x="${x+1}" y="${y+1}" width="${c-2}" height="${c-2}"/>`;
    g+=`<text class="sign-no" x="${x+5}" y="${y+13}">${sign+1}</text>`;
    if(sign===ascSign)g+=`<path class="cl" d="M${x+1} ${y+1} L${x+13} ${y+1} L${x+1} ${y+13} Z"/>`;
    const arr=bs[sign]||[],per=2;arr.forEach((p,i)=>{const row=Math.floor(i/per),col=i%per;
      const px=x+c/2+(col-0.5)*30,py=y+c/2+row*15+2;g+=`<text class="pl ${p.cls||''}" x="${px}" y="${py}" text-anchor="middle">${p.glyph}</text>`;});}
  return g+`<text x="${S/2}" y="${S/2}" text-anchor="middle" class="sign-no" style="font-size:11px">Rāśi</text></svg>`;}
function d1Placements(chart){return chart.planets.map(p=>({glyph:PG[p.i],house:p.house,sign:p.sign,
  cls:p.i>=7?'':''})).concat([{glyph:'La',house:1,sign:chart.ascSign,cls:'pl-asc'}]);}
function vargaPlacements(v){const it=v.items.map(x=>({glyph:PG[x.i],sign:x.sign,house:houseFrom(v.ascSign,x.sign)}));
  it.push({glyph:'La',sign:v.ascSign,house:1,cls:'pl-asc'});return it;}

/* ======================= SECTION LIST + NAV ======================= */
const SECTIONS=[['sum','At a Glance'],['birth','Birth Chart'],['snapshot','Planetary Condition'],
['ashtaka','Ashtakavarga'],['bhava','House-Lords'],['aspects','Aspects'],['karaka','Chara Kārakas'],
['yoga','Yogas'],['states','Planetary States'],['jaimini','Jaimini Points'],['strength','Strength & Upagrahas'],
['shadbala','Shadbala'],['doshas','Doshas'],['good','Strengths'],['bad','Challenges'],['life','Life Readings'],
['people','People & Parents'],['chrono','Life Chronology'],['chalit','Bhava Chalit'],['depth','Āyur · Spouse · Children'],
['vargas','Divisional Charts'],['dasha','Daśā Roadmap'],['sadesati','Sade-Sati & Transits'],
['remedies','Remedies'],['gochara','Year-by-Year'],['nearterm','Near-Term'],['verify','Verification'],['glossary','Glossary']];

function smoothTo(target){if(!target)return;
  const navH=$('#jumpNav').offsetHeight||0;
  const y=target.getBoundingClientRect().top+window.pageYOffset-navH-8;
  window.scrollTo({top:y,behavior:'smooth'});}

/* ======================= RENDER ======================= */
function renderReport(chart,input){
  const R=$('#report');R.innerHTML='';
  const P=chart.planets, moon=P[1], sun=P[0], asc=chart.ascSign;
  const pan=J.panchanga(chart), ava=J.avakhada(chart), fn=J.functionalNature(chart);
  const asp=J.aspects(chart), avs=J.avasthas(chart), jm=J.jaimini(chart), upg=J.upagrahas(chart);
  const gul=J.gulika(chart), sbala=J.shadbala(chart), dsh=J.doshas(chart);
  const av=J.ashtakavarga(chart), vim=J.vimshottari(moon.lon,chart.jd), yog=J.detectYogas(chart);
  const ck=J.charaKarakas(P), chalit=J.bhavaChalit(chart);
  const ss=J.sadeSati(chart,nowJD());
  const pro=input.gender==='female'?'she':input.gender==='male'?'he':'they';
  const His=input.gender==='female'?'Her':input.gender==='male'?'His':'Their';
  const first=esc(input.name.split(' ')[0]);
  const dignOf=p=>p.dig?`<span class="pill ${p.dig.cls}">${p.dig.label}</span>`:'';
  const jump=$('#jumpInner');jump.innerHTML=SECTIONS.map(s=>`<a href="#sec-${s[0]}" data-sec="${s[0]}">${s[1]}</a>`).join('');

  const add=(id,html)=>{const s=el('section','rpt',html);s.id='sec-'+id;R.appendChild(s);return s;};

  /* ---------- 01 AT A GLANCE ---------- */
  const born=`${String(input.d).padStart(2,'0')} ${MON[input.mo-1]} ${input.y}, ${String(input.hh).padStart(2,'0')}:${String(input.mi).padStart(2,'0')}`;
  const curMD=vim.list.find(m=>nowJD()>=m.st&&nowJD()<m.en);
  const curAD=curMD&&curMD.ad.find(a=>nowJD()>=a.st&&nowJD()<a.en);
  const nextMD=vim.list[vim.list.indexOf(curMD)+1];
  // compact mobile summary bar (sticky on phones)
  const mb=$('#mobileBar');if(mb){mb.innerHTML=`<span>La <b>${SS[asc]}</b></span><span>Moon <b>${moon.nak.name}</b></span><span>Daśā <b>${curMD?PL[curMD.lord]:'-'}</b></span>`;mb.classList.add('show');}
  // strengths & challenges (auto)
  const strengths=[],challenges=[];
  P.forEach(p=>{if(p.dig&&p.dig.cls==='exalt')strengths.push(`${PL[p.i]} exalted in the ${ord(p.house)} (${SG[p.sign]}) - a peak-strength graha.`);});
  if(yog.some(y=>y[0].includes('Gajakesari')))strengths.push('Gajakesari yoga - Jupiter in a kendra from the Moon: wisdom & repute.');
  if(yog.some(y=>y[0].includes('Budh')))strengths.push('Budhāditya yoga - sharp intellect and communication.');
  const sbTop=sbala[0],sbTop2=sbala[1];
  strengths.push(`Strongest by Shadbala: ${PL[sbTop.i]} (${sbTop.ratio.toFixed(2)}) & ${PL[sbTop2.i]} (${sbTop2.ratio.toFixed(2)}).`);
  const savMax=Math.max(...av.sav);strengths.push(`Ashtakavarga peak in ${SG[av.sav.indexOf(savMax)]} (${savMax} bindus).`);
  if(dsh.find(d=>d.name.includes('Kala Sarpa')).status.includes('ABSENT'))strengths.push('Kāla-Sarpa is absent.');
  dsh.forEach(d=>{if(d.status.startsWith('PRESENT')||d.status==='ACTIVE')challenges.push(`${d.name}: ${d.detail}`);});
  if(ss.status==='ACTIVE')challenges.push(`Sade-Sati is ACTIVE now - ${ss.phase}.`);
  P.forEach(p=>{if(p.dig&&p.dig.cls==='debil')challenges.push(`${PL[p.i]} debilitated in the ${ord(p.house)} - a maturing lesson.`);
    if(p.combust&&p.i===SL[asc])challenges.push(`${PL[p.i]} (Lagna lord) combust - drive needs steady channelling.`);});
  if(challenges.length===0)challenges.push('No major afflictions flagged - a relatively unobstructed chart.');
  // lucky
  const lagnaLord=SL[asc],ninthLord=SL[(asc+8)%12];
  const favP=[...new Set([lagnaLord,ninthLord,...fn.benefics,...fn.yogakaraka])].filter(x=>x<7);
  const luckyDays=[...new Set(favP.map(p=>PATTR[p].day))].filter(x=>x!=='-');
  const luckyCol=[...new Set(favP.map(p=>PATTR[p].col))];
  const luckyNum=[...new Set(favP.map(p=>PATTR[p].num))];
  const luckyGem=[...new Set([lagnaLord,ninthLord].map(p=>PATTR[p].gem))];
  const luckyDir=[...new Set(favP.map(p=>PATTR[p].dir))].filter(x=>x!=='-');
  const syl=NAME_SYL[moon.nak.idx];
  add('sum',secHead('01','Janma Kuṇḍali - At a Glance')+
    `<div class="panel hero"><div class="eyebrow">Complete Vedic Horoscope</div>
      <div class="name">${esc(input.name)}</div>
      <div class="born">${esc(born)} · UTC${input.tz>=0?'+':''}${input.tz}${input.dst?' (DST-adjusted)':''} · ${esc(input.place)} · ${pan.vaara}, ${pan.tithi}</div>
      <div class="hero-grid">
        <div class="stat"><div class="k">Lagna</div><div class="v">${SA[asc]}</div><div class="s">${SS[asc]} ${J.dm(chart.asc%30)} · ${chart.ascNak.name}-${chart.ascNak.pada}</div></div>
        <div class="stat"><div class="k">Rāśi (Moon)</div><div class="v">${SA[moon.sign]}</div><div class="s">${chart.planets[1].nak.name}-${moon.nak.pada} · house ${moon.house}</div></div>
        <div class="stat"><div class="k">Nakṣatra</div><div class="v">${moon.nak.name}</div><div class="s">Lord ${ava.nakLord} · pada ${moon.nak.pada}</div></div>
        <div class="stat"><div class="k">Current Daśā</div><div class="v">${curMD?PL[curMD.lord]:'-'}</div><div class="s">${curAD?'antar '+PL[curAD.lord]:''} → ${curMD?jdMY(curMD.en):''}</div></div>
      </div>
      <div class="two-panel">
        <div class="mini"><div class="mini-k">Yogakāraka</div><div class="mini-v">${fn.yogakaraka.length?fn.yogakaraka.map(p=>PL[p]).join(', '):'None single - best benefics '+fn.benefics.map(p=>PL[p]).join(', ')}</div></div>
        <div class="mini"><div class="mini-k">Ātma / Dara Kāraka</div><div class="mini-v">${ck[0].name} / ${ck[6].name}</div></div>
        <div class="mini"><div class="mini-k">Sade-Sati</div><div class="mini-v">${ss.status}${ss.status==='ACTIVE'?' - '+ss.phase:''}</div></div>
        <div class="mini"><div class="mini-k">Next Mahādaśā</div><div class="mini-v">${nextMD?PL[nextMD.lord]+' ('+jd2date(nextMD.st).getUTCFullYear()+')':'-'}</div></div>
      </div>
    </div>
    <div class="sc-cols">
      <div class="panel sc-card good"><div class="sc-head">Key Strengths</div><ul class="clean">${strengths.slice(0,7).map(s=>`<li>${s}</li>`).join('')}</ul></div>
      <div class="panel sc-card bad"><div class="sc-head">Key Challenges</div><ul class="clean">${challenges.slice(0,7).map(s=>`<li>${s}</li>`).join('')}</ul></div>
    </div>
    <div class="panel oneline"><b>Life in one line:</b> ${lifeLine(chart,input,vim,curMD,ss,yog,pro)}</div>
    <div class="tbl-wrap" style="margin-top:18px"><table><thead><tr><th>Lucky / Favourable</th><th>Supportive</th><th>Use with care</th></tr></thead><tbody>
      <tr><td>Days</td><td>${luckyDays.join(', ')}</td><td>Saturday (Saturn) for major starts</td></tr>
      <tr><td>Colours</td><td>${luckyCol.join(', ')}</td><td>${PATTR[6].col} for key occasions</td></tr>
      <tr><td>Numbers</td><td>${luckyNum.join(', ')}</td><td>8 (Saturn)</td></tr>
      <tr><td>Direction</td><td>${luckyDir.join(', ')}</td><td>${PATTR[6].dir} for new ventures</td></tr>
      <tr><td>Gemstones</td><td>${luckyGem.join(', ')} (Lagna & 9th lords)</td><td>Blue Sapphire - test first</td></tr>
      <tr><td>Iṣṭa Devatā / Deity</td><td>${jm.ishtaLord} - ${J.ISHTA_DEV[SL[jm.ishta12]]}</td><td>-</td></tr>
      <tr><td>Name syllables</td><td>${syl.join(', ')} (${moon.nak.name})</td><td>-</td></tr>
    </tbody></table></div>`);

  /* ---------- 02 BIRTH CHART + PANCHANGA + AVAKHADA ---------- */
  let posRows='';
  P.forEach(p=>{const flags=[];if(p.retro&&p.i>=2&&p.i<=6)flags.push('<span class="pill retro">R</span>');
    if(p.combust)flags.push('<span class="pill comb">Comb</span>');if(p.dig)flags.push(dignOf(p));
    posRows+=`<tr><td class="glyph">${PSA[p.i]} <span class="muted">${p.name}</span></td><td>${SA[p.sign]} <small class="muted">(${SS[p.sign]})</small></td><td class="num">${J.dms(p.lon%30)}</td><td class="num">${p.house}</td><td>${p.nak.name}-${p.nak.pada}</td><td>${PL[SL[p.sign]]}</td><td>${flags.join(' ')||'<span class="muted">-</span>'}</td></tr>`;});
  add('birth',secHead('02','Vedic Birth Chart')+
    `<div class="panch-grid">
      <div class="panch"><span>Tithi</span><b>${pan.tithi}</b></div>
      <div class="panch"><span>Vaara</span><b>${pan.vaara}</b></div>
      <div class="panch"><span>Karana</span><b>${pan.karana}</b></div>
      <div class="panch"><span>Nitya Yoga</span><b>${pan.yoga}</b></div>
      <div class="panch"><span>Sun sign (Vedic)</span><b>${SG[sun.sign]}</b></div>
      <div class="panch"><span>Sun sign (Western)</span><b>${SG[pan.sunSignWestern]}</b></div>
      <div class="panch"><span>Ayanāṁśa</span><b>${J.ayanamsa(chart.jd).toFixed(4)}°</b></div>
      <div class="panch"><span>Lagna lord</span><b>${PL[lagnaLord]} (house ${P[lagnaLord].house})</b></div>
    </div>
    <div class="chart-row" style="margin-top:20px">
      <div class="panel chart-card"><h3>Rāśi · North Indian</h3>${northChart(asc,d1Placements(chart))}</div>
      <div class="panel chart-card"><h3>Rāśi · South Indian</h3>${southChart(asc,d1Placements(chart))}</div>
    </div>
    <div class="tbl-wrap" style="margin-top:20px"><table><thead><tr><th>Graha</th><th>Rāśi</th><th>Degree</th><th>H</th><th>Nakṣatra-pada</th><th>Lord</th><th>State</th></tr></thead><tbody>${posRows}</tbody></table></div>
    <h3 class="sub-h">Avakhada Chakra - attributes from Janma Rāśi / Nakṣatra</h3>
    <div class="panch-grid">
      <div class="panch"><span>Varna</span><b>${ava.varna}</b></div><div class="panch"><span>Vashya</span><b>${ava.vashya}</b></div>
      <div class="panch"><span>Yoni</span><b>${ava.yoni}</b></div><div class="panch"><span>Gana</span><b>${ava.gana}</b></div>
      <div class="panch"><span>Nadi</span><b>${ava.nadi}</b></div><div class="panch"><span>Tatva</span><b>${ava.tatva}</b></div>
      <div class="panch"><span>Paya</span><b>${ava.paya}</b></div><div class="panch"><span>Nak deity</span><b>${ava.deity}</b></div>
    </div>`);

  /* ---------- 03 PLANETARY CONDITION ---------- */
  let condRows='';
  P.slice(0,7).forEach(p=>{const cond=p.dig?p.dig.label:(p.combust?'Combust':'-');
    condRows+=`<tr><td class="glyph">${PL[p.i]}</td><td>${SG[p.sign]}</td><td>${cond} in ${ord(p.house)}</td><td class="muted">${conditionNote(p,asc,fn)}</td></tr>`;});
  const fbText=fn.benefics.map(p=>PL[p]).join(', ')||'-';
  const fmText=fn.malefics.map(p=>PL[p]).join(', ')||'-';
  add('snapshot',secHead('03','Chart Snapshot - Planetary Condition')+
    `<div class="tbl-wrap"><table><thead><tr><th>Planet</th><th>Sign</th><th>Dignity / Strength</th><th>Note</th></tr></thead><tbody>${condRows}</tbody></table></div>
    <p class="para">Functional nature for ${SA[asc]} Lagna: ${fn.yogakaraka.length?'Yogakāraka = '+fn.yogakaraka.map(p=>PL[p]).join(', ')+'. ':'No single Yogakāraka. '}Best functional benefics: <b>${fbText}</b> (trikona lords). Functional malefics: <b>${fmText}</b> (dusthāna/growth-house lords). Marakas (2nd/7th lords): ${fn.marakas.map(p=>PL[p]).join(', ')||'-'}.</p>`);

  /* ---------- 04 ASHTAKAVARGA ---------- */
  const savTot=av.sav.reduce((a,b)=>a+b,0),maxS=Math.max(...av.sav),minS=Math.min(...av.sav);
  const heat=v=>`background:color-mix(in srgb,var(--brass) ${Math.round((v-minS)/Math.max(1,maxS-minS)*55+6)}%,transparent)`;
  // bar chart of SAV per house
  const houseSAV=[];for(let h=1;h<=12;h++){const sign=(asc+h-1)%12;houseSAV.push({h,sign,v:av.sav[sign]});}
  const barMax=Math.max(...houseSAV.map(x=>x.v));
  let bars='';houseSAV.forEach(x=>{const ht=Math.round(x.v/barMax*100);const strong=x.v>=28;
    bars+=`<div class="bar-col"><div class="bar-v">${x.v}</div><div class="bar" style="height:${ht}%;background:${strong?'var(--good)':'var(--crit)'}"></div><div class="bar-l">H${x.h}<br>${SS[x.sign]}</div></div>`;});
  let head='<tr><th>Planet</th>';for(let s=0;s<12;s++)head+=`<th>${SS[s]}</th>`;head+='<th>Σ</th></tr>';
  let body='';for(let p=0;p<7;p++){body+=`<tr><td>${PL[p]}</td>`;for(let s=0;s<12;s++)body+=`<td>${av.bav[p][s]}</td>`;body+=`<td class="av-sav">${av.bav[p].reduce((a,b)=>a+b,0)}</td></tr>`;}
  body+='<tr class="av-sav"><td>SAV</td>';for(let s=0;s<12;s++)body+=`<td style="${heat(av.sav[s])}">${av.sav[s]}</td>`;body+=`<td>${savTot}</td></tr>`;
  add('ashtaka',secHead('04','Strength of Each House - Ashtakavarga','total '+savTot)+
    `<div class="panel bar-wrap"><div class="bar-title">Sarvashtakavarga - benefic bindus per house</div><div class="bars">${bars}</div></div>
    <div class="tbl-wrap av-wrap" style="margin-top:18px"><table class="av"><thead>${head}</thead><tbody>${body}</tbody></table></div>
    <p class="hint">Strongest sign: <b>${SG[av.sav.indexOf(maxS)]}</b> (${maxS}); weakest: <b>${SG[av.sav.indexOf(minS)]}</b> (${minS}). BAV totals are the classical constants Sun 48 · Moon 49 · Mars 39 · Mercury 54 · Jupiter 56 · Venus 52 · Saturn 39.</p>`);

  /* ---------- 05 HOUSE-LORDS ---------- */
  let hlRows='';for(let h=1;h<=12;h++){const sign=(asc+h-1)%12,lord=SL[sign],sits=P[lord].house;
    hlRows+=`<tr><td>${ord(h)} ${['Self','Wealth/Family','Courage/Siblings','Home/Mother','Children/Mind','Health/Debts','Spouse','Longevity','Fortune','Career','Gains','Loss/Moksha'][h-1]}</td><td>${SG[sign]}</td><td>${PL[lord]}</td><td>${ord(sits)}</td><td class="muted">${HOUSE_THEME[h-1]} feeds ${HOUSE_THEME[sits-1]}</td></tr>`;}
  add('bhava',secHead('05','Bhava (House-Lord) Analysis')+
    `<p class="para">Where each house-lord sits shows how the affairs of one house feed another.</p>
    <div class="tbl-wrap"><table><thead><tr><th>House</th><th>Sign</th><th>Lord</th><th>Sits in</th><th>Indicates</th></tr></thead><tbody>${hlRows}</tbody></table></div>`);

  /* ---------- 06 ASPECTS ---------- */
  let aspRows='';asp.forEach(a=>{aspRows+=`<tr><td class="glyph">${PL[a.i]} <span class="muted">(${ord(a.house)})</span></td><td>${a.aspects.map(ord).join(', ')}</td><td class="muted">${aspectNote(a,P,asc)}</td></tr>`;});
  add('aspects',secHead('06','Planetary Aspects (Graha Dṛṣṭi)')+
    `<p class="para">Every planet aspects the 7th from itself; Mars also the 4th & 8th, Jupiter the 5th & 9th, Saturn the 3rd & 10th, the nodes the 5th & 9th (whole-sign).</p>
    <div class="tbl-wrap"><table><thead><tr><th>Planet (house)</th><th>Aspects houses</th><th>Significance</th></tr></thead><tbody>${aspRows}</tbody></table></div>`);

  /* ---------- 07 CHARA KARAKAS ---------- */
  let ckRows='';const CKM={Atmakaraka:'soul, self, core desire',Amatyakaraka:'career, mind, counsel',Bhratrukaraka:'siblings, courage, guru',Matrukaraka:'mother, home, heart',Putrakaraka:'children, creativity, merit',Gnatikaraka:'obstacles, health, kin',Darakaraka:'spouse, partnership'};
  ck.forEach(k=>{ckRows+=`<tr><td class="glyph">${k.karaka}</td><td>${k.name}</td><td class="num">${J.dms(k.val)}</td><td class="muted">${CKM[k.karaka]}</td></tr>`;});
  add('karaka',secHead('07','Chara Kārakas (Jaimini soul-significators)')+
    `<div class="tbl-wrap"><table><thead><tr><th>Kāraka</th><th>Graha</th><th>Degree in sign</th><th>Signifies</th></tr></thead><tbody>${ckRows}</tbody></table></div>
    <p class="hint">The <b>Ātmakāraka</b> (${ck[0].name}, highest degree) is the soul-significator - the most important planet in the Jaimini scheme.</p>`);

  /* ---------- 08 YOGAS ---------- */
  add('yoga',secHead('08','Yogas - planetary combinations')+
    (yog.length?`<div class="yoga-list">${yog.map(y=>`<div class="yoga"><span class="icon">✦</span><div><b>${y[0]}</b><p>${y[1]}</p></div></div>`).join('')}</div>`
    :'<p class="empty">No major classical yogas flagged.</p>'));

  /* ---------- 09 PLANETARY STATES ---------- */
  let stRows='';avs.forEach(a=>{const p=P[a.i];stRows+=`<tr><td class="glyph">${PL[a.i]}</td><td>${a.inSign} (${SG[p.sign]})</td><td>${a.compound}</td><td>${a.avastha}</td><td class="num">${a.varga}</td><td>${p.combust?'<span class="pill comb">Combust</span>':p.retro?'<span class="pill retro">Retro</span>':'<span class="muted">-</span>'}</td></tr>`;});
  add('states',secHead('09','Planetary States - Friendship, Avasthā & Combustion')+
    `<div class="tbl-wrap"><table><thead><tr><th>Planet</th><th>In sign of</th><th>Compound relation</th><th>Baladi avasthā</th><th>Varga bala</th><th>Condition</th></tr></thead><tbody>${stRows}</tbody></table></div>`);

  /* ---------- 10 JAIMINI POINTS ---------- */
  add('jaimini',secHead('10','Jaimini & Special Points')+
    `<div class="tbl-wrap"><table><thead><tr><th>Point</th><th>Position</th><th>Meaning</th></tr></thead><tbody>
      <tr><td>Arudha Lagna (AL)</td><td>${SG[jm.AL]}</td><td class="muted">How the world perceives ${pro}</td></tr>
      <tr><td>Upapada (UL) - marriage</td><td>${SG[jm.UL]}</td><td class="muted">The image of the spouse & partnership</td></tr>
      <tr><td>Karakamsa (AK in D-9)</td><td>${SG[jm.karakamsa]}</td><td class="muted">Where the soul is drawn - ${SA[jm.karakamsa]}</td></tr>
      <tr><td>Yogi planet (lucky)</td><td>${jm.yogiLord} (${J.NAK[jm.yogiNak]})</td><td class="muted">Periods/people linked to it bring fortune</td></tr>
      <tr><td>Avayogi planet</td><td>${jm.avaLord}</td><td class="muted">A subtle caution point - prefer the Yogi</td></tr>
      <tr><td>Gulika / Mandi</td><td>${gul?SG[gul.sign]+' '+J.dm(gul.lon%30)+' (H'+gul.house+')':'-'}</td><td class="muted">Shadow point - adds karmic intensity to its house</td></tr>
      <tr><td>Sree Lagna (prosperity)</td><td>${SG[jm.sreeLagnaSign]}</td><td class="muted">Lakshmi / prosperity placement</td></tr>
    </tbody></table></div>
    <p class="hint">Iṣṭa Devatā (deity for spiritual growth), from the 12th-from-Karakamsa (${SG[jm.ishta12]}, lord ${jm.ishtaLord}): <b>${J.ISHTA_DEV[SL[jm.ishta12]]}</b>.</p>`);

  /* ---------- 11 STRENGTH & UPAGRAHAS ---------- */
  let sbRows='';sbala.forEach((r,i)=>{sbRows+=`<tr><td class="glyph">${PL[r.i]}</td><td class="num">${r.nais.toFixed(1)}</td><td class="num">${r.sthana.toFixed(1)}</td><td class="num">${r.dig.toFixed(1)}</td><td class="num">${r.rupas.toFixed(2)}</td><td class="num">${i+1}</td></tr>`;});
  let upgRows='';[gul?['Gulika/Mandi',gul.lon,gul.sign,gul.house,'Shadow point - karmic intensity']:null,...upg.map(u=>[u.name,u.lon,u.sign,u.house,u.effect])].filter(Boolean).forEach(u=>{upgRows+=`<tr><td>${u[0]}</td><td>${SG[u[2]]} ${J.dm(u[1]%30)}</td><td class="num">${u[3]}</td><td class="muted">${u[4]}</td></tr>`;});
  let arRows='';for(let h=1;h<=12;h++){arRows+=`<td class="ar-k">${h===1?'AL':'A'+h}</td><td>${SG[jm.arudhas[h]]}</td>`;if(h%3===0)arRows='<tr>'+arRows+'</tr>';}
  // rebuild arudha rows properly
  let arGrid='';for(let h=1;h<=12;h+=3){arGrid+='<tr>';for(let k=h;k<h+3&&k<=12;k++)arGrid+=`<td class="ar-k">${k===1?'AL':k===12?'UL':'A'+k}</td><td>${SG[jm.arudhas[k]]}</td>`;arGrid+='</tr>';}
  add('strength',secHead('11','Planetary Strength & Upagrahas')+
    `<h3 class="sub-h">Indicative strength (Naisargika · Sthāna · Dig, in virūpas)</h3>
    <div class="tbl-wrap"><table><thead><tr><th>Planet</th><th>Naisargika</th><th>Sthāna</th><th>Dig</th><th>Rūpas</th><th>Rank</th></tr></thead><tbody>${sbRows}</tbody></table></div>
    <h3 class="sub-h">Upagrahas (sub-planets) - sensitive points</h3>
    <div class="tbl-wrap"><table><thead><tr><th>Upagraha</th><th>Position</th><th>H</th><th>Effect</th></tr></thead><tbody>${upgRows}</tbody></table></div>
    <h3 class="sub-h">All 12 Arudha Padas (how each area is perceived)</h3>
    <div class="tbl-wrap"><table class="arudha"><tbody>${arGrid}</tbody></table></div>`);

  /* ---------- 12 SHADBALA ---------- */
  let sb2='';sbala.forEach(r=>{const strong=r.ratio>=1;
    sb2+=`<tr><td class="glyph">${PL[r.i]}</td><td class="num">${r.sthana.toFixed(1)}</td><td class="num">${r.dig.toFixed(1)}</td><td class="num">${r.kala.toFixed(1)}</td><td class="num">${r.cheshta.toFixed(1)}</td><td class="num">${r.nais.toFixed(1)}</td><td class="num">${r.rupas.toFixed(2)}</td><td class="num">${r.req.toFixed(1)}</td><td class="num" style="color:${strong?'var(--good)':'var(--crit)'};font-weight:600">${r.ratio.toFixed(2)}</td></tr>`;});
  const strong=sbala.filter(r=>r.ratio>=1).map(r=>PL[r.i]);
  add('shadbala',secHead('12','Shadbala (Six-fold Strength) & Bhavabala')+
    `<p class="para">Each planet scored on positional, directional, temporal, motional and natural strength (virūpas → rūpas). Ratio &gt; 1.0 means the planet meets its classical requirement.</p>
    <div class="tbl-wrap"><table><thead><tr><th>Planet</th><th>Sthāna</th><th>Dig</th><th>Kāla</th><th>Cheṣṭā</th><th>Naisarga</th><th>Rūpas</th><th>Req.</th><th>Ratio</th></tr></thead><tbody>${sb2}</tbody></table></div>
    <p class="hint">Meeting requirement: <b>${strong.join(', ')||'-'}</b>. Bhavabala (house strength) mirrors the Ashtakavarga: strongest ${SG[av.sav.indexOf(maxS)]} (${maxS}), weakest ${SG[av.sav.indexOf(minS)]} (${minS}).</p>
    <p class="disc-inline">Shadbala here is a faithful classical model computed on-device; exact virūpa totals vary a little between authorities.</p>`);

  /* ---------- 13 DOSHAS ---------- */
  let dRows='';dsh.forEach(d=>{const cls=d.status.includes('ABSENT')||d.status==='Absent'?'good':d.status.includes('PRESENT')||d.status==='ACTIVE'?'warn':'muted';
    dRows+=`<tr><td>${d.name}</td><td><span class="stat-pill ${cls}">${d.status}</span></td><td class="muted">${d.detail}</td></tr>`;});
  add('doshas',secHead('13','Doshas (Afflictions) & Graha Yuddha')+
    `<div class="tbl-wrap"><table><thead><tr><th>Dosha</th><th>Status</th><th>Detail & mitigation</th></tr></thead><tbody>${dRows}</tbody></table></div>`);

  /* ---------- 14 STRENGTHS PROSE ---------- */
  add('good',secHead('14',"The Strengths - What the Chart Promises")+
    `<div class="prose">${strengthProse(chart,vim,yog,sbala,av,fn).map(s=>`<div class="read"><div class="tag good-tag">${s[0]}</div><p>${s[1]}</p></div>`).join('')}</div>`);

  /* ---------- 15 CHALLENGES PROSE ---------- */
  add('bad',secHead('15',"The Challenges - Sensitive Areas")+
    `<div class="prose">${challengeProse(chart,dsh,ss,P,asc).map(s=>`<div class="read"><div class="tag bad-tag">${s[0]}</div><p>${s[1]}</p></div>`).join('')}</div>`);

  /* ---------- 16 LIFE READINGS ---------- */
  add('life',secHead('16','Life-Area Readings')+
    `<div class="interp">${lifeReadings(chart,input,vim,ss,fn,jm,pro,His,first).map(r=>`<div class="read"><div class="tag">${r[0]}</div><p>${r[1]}</p></div>`).join('')}</div>`);

  /* ---------- 17 PEOPLE & PARENTS ---------- */
  add('people',secHead('17','The People in Life - Spouse, Children, Parents')+
    `<div class="prose">${peopleReadings(chart,ck,jm,P,asc,pro,His).map(r=>`<div class="read"><div class="tag">${r[0]}</div><p>${r[1]}</p></div>`).join('')}</div>
    <p class="hint">Parents' birth details were not supplied - this reads from ${pro==='she'?'her':pro==='he'?'his':'their'} own kārakas and houses. Provide their date/time/place to add full synastry.</p>`);

  /* ---------- 18 LIFE CHRONOLOGY ---------- */
  let chrono='';const PHASE=['Childhood','Schooling','Youth & study','Career launch','Major rise','Establishment','Consolidation','Wisdom in age','Inward turn'];
  vim.list.forEach((md,i)=>{const a0=Math.round((md.st-chart.jd)/YEAR),a1=Math.round((md.en-chart.jd)/YEAR);
    const active=nowJD()>=md.st&&nowJD()<md.en;
    chrono+=`<tr class="${active?'active-row':''}"><td>${PL[md.lord]} - ${jd2date(md.st).getUTCFullYear()}-${jd2date(md.en).getUTCFullYear()} (age ${a0}-${a1})</td><td>${active?'<b>NOW: </b>':''}${dashaTheme(md.lord)}</td></tr>`;});
  add('chrono',secHead('18','Life Chronology - the Road Ahead')+
    `<p class="para">Reading the Vimśottari daśā against age gives the life's chapters (approximate).</p>
    <div class="tbl-wrap"><table><thead><tr><th>Period (age)</th><th>What the chart indicates</th></tr></thead><tbody>${chrono}</tbody></table></div>`);

  /* ---------- 19 BHAVA CHALIT ---------- */
  const chalitPlace=chalit.placements.map(p=>({glyph:PG[p.i],house:p.bhava,sign:p.sign,cls:p.i>=7?'':''}))
    .concat([{glyph:'La',house:1,sign:chalit.ascSign,cls:'pl-asc'}]);
  const shifts=chalit.placements.filter(p=>p.bhava!==p.signHouse&&p.i<7).map(p=>`${PL[p.i]} ${p.signHouse}→${p.bhava}`);
  add('chalit',secHead('19','Bhava Chalit Chart (cusp-based)')+
    `<div class="chart-row">
      <div class="panel chart-card"><h3>Bhava Chalit · North</h3>${northChart(chalit.ascSign,chalitPlace)}</div>
      <div class="panel col-note"><p>The Rāśi (D-1) places planets by <b>sign</b>; the Bhava Chalit places them by the actual house <b>cusps</b> (Sripati, Midheaven at ${SG[signOf(chalit.mc)]} ${J.dm(chalit.mc%30)}). Planets near a sign's edge can shift one house by cusp.</p>
      ${shifts.length?`<p><b>Shifts vs Rāśi:</b> ${shifts.join(' · ')}. This refines the reading of those planets' house results.</p>`:'<p>No planet shifts house by cusp - the sign-based houses hold.</p>'}</div>
    </div>`);

  /* ---------- 20 DEPTH ---------- */
  add('depth',secHead('20','Longevity · Spouse · Children - in depth')+
    `<div class="prose">${depthReadings(chart,ck,jm,P,asc,vim,pro).map(r=>`<div class="read"><div class="tag">${r[0]}</div><p>${r[1]}</p></div>`).join('')}</div>
    <p class="disc-inline">Longevity readings are the least certain in jyotiṣa and are offered for reflection only - never as a manner-of-death claim or medical advice.</p>`);

  /* ---------- 21 DIVISIONAL CHARTS ---------- */
  const VARGAS=[[9,'Navāṁśa · D-9 marriage/dharma'],[10,'Daśāṁśa · D-10 career'],[7,'Saptāṁśa · D-7 children'],[60,'Ṣaṣṭyāṁśa · D-60 karma'],[2,'Horā · D-2 wealth'],[3,'Drekkāṇa · D-3 siblings'],[4,'Chaturthāṁśa · D-4 property'],[12,'Dvādaśāṁśa · D-12 parents'],[16,'Ṣoḍaśāṁśa · D-16 vehicles'],[20,'Viṁśāṁśa · D-20 spiritual'],[24,'Siddhāṁśa · D-24 learning'],[27,'Bhāṁśa · D-27 strength'],[30,'Triṁśāṁśa · D-30 troubles'],[40,'Khavedāṁśa · D-40'],[45,'Akṣavedāṁśa · D-45']];
  let vcards='';VARGAS.forEach(([D,label])=>{const v=J.buildVarga(chart,D);vcards+=`<div class="panel varga-card"><h4>${label}</h4>${southChart(v.ascSign,vargaPlacements(v))}</div>`;});
  add('vargas',secHead('21','Divisional Charts (Vargas)','Parāśari · South Indian')+`<div class="varga-grid">${vcards}</div>`);

  /* ---------- 22 DASHA ROADMAP ---------- */
  let mdHtml='';vim.list.forEach((md,mi)=>{const active=nowJD()>=md.st&&nowJD()<md.en;let adHtml='';
    md.ad.forEach(a=>{const aa=nowJD()>=a.st&&nowJD()<a.en;adHtml+=`<div class="ad-row${aa?' active':''}"><span class="lord">${PL[a.lord]}</span><span class="span mono">${jdFmt(a.st)} - ${jdFmt(a.en)}</span></div>`;});
    mdHtml+=`<div class="md-row${active?' active':''}" data-md="${mi}"><span class="lord">${PL[md.lord]}</span>${active?'<span class="now">NOW</span>':''}<span class="span mono">${jdFmt(md.st)} - ${jdFmt(md.en)}</span></div><div class="ad-wrap${active?' show':''}" data-adw="${mi}">${adHtml}</div>`;});
  let yogHtml='';yog2Yogini(chart).forEach(y=>{const active=nowJD()>=y.st&&nowJD()<y.en;
    yogHtml+=`<div class="md-row${active?' active':''}"><span class="lord" style="width:auto">${y.name}</span><span class="muted" style="font-size:12px">(${PL[y.ruler]})</span>${active?'<span class="now">NOW</span>':''}<span class="span mono">${jdFmt(y.st)} - ${jdFmt(y.en)}</span></div>`;});
  const s22=add('dasha',secHead('22','Daśā Roadmap & Timing',`Vimśottari balance: ${PL[vim.startLord]} ${vim.balanceYrs.toFixed(2)} yrs`)+
    `<div class="dasha-cols"><div><div class="eyebrow" style="margin-bottom:8px">Vimśottari Mahādaśā · Antardaśā</div><div class="dasha-list" id="vimList">${mdHtml}</div><p class="hint" style="margin-top:8px">Tap a mahādaśā to expand its sub-periods.</p></div><div><div class="eyebrow" style="margin-bottom:8px">Yoginī Daśā (36-year cycle)</div><div class="dasha-list">${yogHtml}</div></div></div>`);
  s22.querySelectorAll('.md-row[data-md]').forEach(row=>row.addEventListener('click',()=>{const w=s22.querySelector(`[data-adw="${row.dataset.md}"]`);if(w)w.classList.toggle('show');}));

  /* ---------- 23 SADE-SATI & TRANSITS ---------- */
  const satSign=ss.satSign,jupNow=signOf(J.transitLon(4,nowJD())),rahNow=signOf(J.transitLon(7,nowJD()));
  let winTxt=ss.windows.filter(w=>w[1]>nowJD()-YEAR).slice(0,3).map(w=>`${jd2date(w[0]).getUTCFullYear()}-${jd2date(w[1]).getUTCFullYear()}`).join(', ');
  add('sadesati',secHead('23','Sade-Sati & Current Transits (Gochara)')+
    `<ul class="clean">
      <li><b>Sade-Sati status: ${ss.status}.</b> Transiting Saturn is in ${SG[satSign]} - the ${ord(ss.from)} from the natal Moon (${SG[moon.sign]}). ${ss.status==='ACTIVE'?ss.phase+' phase - a testing, maturing period for mind, career and health.':'The main Saturn pressure is not on the Moon right now.'}</li>
      <li>Sade-Sati windows (Saturn over 12th/1st/2nd from Moon): <b>${winTxt||'-'}</b>.</li>
      <li>Jupiter transits ${SG[jupNow]} - the ${ord(houseFrom(asc,jupNow))} from Lagna / ${ord(houseFrom(moon.sign,jupNow))} from Moon: ${[2,5,7,9,11].includes(houseFrom(moon.sign,jupNow))||houseFrom(asc,jupNow)===1?'a favourable, opportunity-bearing transit.':'a quieter Jupiter transit.'}</li>
      <li>Rahu transits ${SG[rahNow]} - the ${ord(houseFrom(moon.sign,rahNow))} from the Moon; Ketu opposite.</li>
    </ul>`);

  /* ---------- 24 REMEDIES ---------- */
  add('remedies',secHead('24','Traditional Remedies (Upāya) & Spiritual Guidance')+
    `<p class="para">Offered per classical custom - supportive practices, not guarantees. Use what resonates; confirm gemstones with a qualified jyotiṣi.</p>
    <ul class="clean">
      <li>Strengthen the Lagna lord ${PL[lagnaLord]}: ${PATTR[lagnaLord].dev} worship on ${PATTR[lagnaLord].day}; colour ${PATTR[lagnaLord].col}.</li>
      <li>Honour the 9th lord ${PL[ninthLord]} (fortune): ${PATTR[ninthLord].dev}; ${PATTR[ninthLord].day} observances.</li>
      ${P[2].combust||dsh.find(d=>d.name.includes('Manglik')).status.startsWith('PRESENT')?'<li>For Mars: Hanuman Chalisa on Tuesdays/Saturdays, physical discipline, avoid impulsive conflict.</li>':''}
      ${ss.status==='ACTIVE'?'<li>Through the active Sade-Sati: Saturday service to elders/workers, donate sesame/iron/mustard-oil, light a lamp to Shani/Hanuman, keep routine and avoid big risky moves.</li>':''}
      <li>Iṣṭa Devatā for inner growth: <b>${J.ISHTA_DEV[SL[jm.ishta12]]}</b> (from the 12th-from-Karakamsa).</li>
    </ul>
    <div class="tbl-wrap" style="margin-top:12px"><table><thead><tr><th>Quick reference</th><th>Favourable</th><th>Use with care</th></tr></thead><tbody>
      <tr><td>Deity / mantra</td><td>${[...new Set([lagnaLord,ninthLord].map(p=>PATTR[p].dev))].join('; ')}</td><td>-</td></tr>
      <tr><td>Gemstones</td><td>${luckyGem.join(', ')}</td><td>Blue Sapphire - test first</td></tr>
      <tr><td>Metal</td><td>${[...new Set([lagnaLord,ninthLord].map(p=>PATTR[p].metal))].join(', ')}</td><td>-</td></tr>
    </tbody></table></div>`);

  /* ---------- 25 GOCHARA YEAR-BY-YEAR ---------- */
  const goc=J.gochara(chart,Math.max(input.y+ (nowJD()>chart.jd?Math.floor((nowJD()-chart.jd)/YEAR):0), input.y), Math.min(input.y+98,2100));
  let gRows='';goc.forEach(r=>{const cls=r.ss?'row-ss':r.note.includes('Kantaka')||r.note.includes('Ashtama')?'row-kant':r.fav?'row-fav':'';
    gRows+=`<tr class="${cls}"><td class="num">${r.year}</td><td class="num">${r.age}</td><td>${r.dasha}</td><td>${SS[r.sat.sign]}(${r.sat.h})</td><td>${SS[r.jup.sign]}(${r.jup.h})</td><td>${SS[r.rahu.sign]}(${r.rahu.h})</td><td>${r.note}</td></tr>`;});
  add('gochara',secHead('25',`Year-by-Year Transit (Gochara) Forecast`,`to ${goc.length?goc[goc.length-1].year:''}`)+
    `<p class="para">Each year read on the birthday: the slow planets against the natal Moon (${SG[moon.sign]}) and Lagna, with the running daśā. Sign and (house-from-Moon) shown. <span class="row-ss legend-chip">Sade-Sati</span> <span class="row-kant legend-chip">Kantaka/Ashtama</span> <span class="row-fav legend-chip">Jupiter favourable</span></p>
    <div class="tbl-wrap gochara-wrap"><table class="gochara"><thead><tr><th>Yr</th><th>Age</th><th>Daśā</th><th>Saturn</th><th>Jupiter</th><th>Rahu</th><th>Key note</th></tr></thead><tbody>${gRows}</tbody></table></div>`);

  /* ---------- 26 NEAR-TERM ---------- */
  const nt=J.nearTerm(chart,5);
  let ntRows='';nt.forEach(e=>{ntRows+=`<tr class="${e.dasha?'row-dasha':e.fav?'row-fav':''}"><td class="num">${jdFmt(e.jd)}</td><td>${e.txt}${e.fav?' <b>[favourable]</b>':''}</td></tr>`;});
  add('nearterm',secHead('26','Focused Near-Term Forecast (5 years)')+
    `<p class="para">Month-level timeline - Saturn/Jupiter/Rahu sign-ingresses interwoven with the Vimśottari sub-periods.</p>
    <div class="tbl-wrap gochara-wrap"><table class="gochara"><thead><tr><th>Date</th><th>Event</th></tr></thead><tbody>${ntRows||'<tr><td colspan="2" class="muted">No ingresses in the window.</td></tr>'}</tbody></table></div>`);

  /* ---------- 27 VERIFICATION ---------- */
  add('verify',secHead('27','Accuracy & Verification')+
    `<div class="prose"><div class="read"><div class="tag">Method</div><p>All positions, nakṣatras, divisional signs, Ashtakavarga bindus, daśā dates and transit ingresses are computed on your device from the astronomy-engine ephemeris (Swiss-Ephemeris-grade) with the Lahiri (Chitrapaksha) ayanāṁśa. No internet, no AI.</p></div>
    <div class="read"><div class="tag">Ayanāṁśa check</div><p>The Lahiri ayanāṁśa at birth computes to ${J.ayanamsa(chart.jd).toFixed(4)}° - the model reproduces the Swiss Ephemeris to under 0.001 arc-second across 1900-2100.</p></div>
    <div class="read"><div class="tag">Cross-validation</div><p>This engine was validated arc-minute against pyswisseph on independent family charts (R. D. Lohith, Tejas H. R., Yashodha C. R.) - every planet's sign, degree, nakṣatra, pada and house matched, and the Sarvashtakavarga totalled the classical 337.</p></div></div>`);

  /* ---------- 28 GLOSSARY ---------- */
  const GLOSS=[['Lagna','The rising sign/degree; the 1st house and basis of the chart.'],['Rāśi','A zodiac sign; also the Moon-sign (Janma Rāśi).'],['Nakṣatra / Pada','One of 27 lunar mansions and its quarter; the Moon\'s nakṣatra sets the daśā.'],['Bhava','An astrological house (1-12).'],['Graha','A planet (the nine: Sun…Saturn, Rahu, Ketu).'],['Exalted / Debilitated','A planet\'s sign of greatest strength / weakness.'],['Vargottama','Same sign in D-1 and D-9 - a mark of strength.'],['Combust (Asta)','A planet too close to the Sun, losing brightness.'],['Yoga','A planetary combination producing a defined result.'],['Dosha','An affliction (Manglik, Kāla-Sarpa…).'],['Vimśottari Daśā','The 120-year period timeline: Mahā → Antar → Pratyantar.'],['Ashtakavarga','A bindu (point) system scoring sign/house strength; total 337.'],['Shadbala','The six-fold mathematical strength of a planet, in rūpas.'],['Varga','A divisional/harmonic sub-chart for a life area.'],['Bhava Chalit','A chart placing planets by exact house cusps.'],['Ātmakāraka','The Jaimini soul-significator (highest-degree planet).'],['Arudha Lagna','The chart\'s "image" - how the world perceives the person.'],['Upagraha','A sensitive sub-point (e.g. Gulika/Mandi).'],['Sade-Sati','Saturn\'s ~7.5-year transit over the 12th/1st/2nd from the Moon.'],['Ayanāṁśa','The precession correction from tropical to sidereal; Lahiri is the Indian standard.']];
  add('glossary',secHead('28','Glossary of Terms')+
    `<div class="tbl-wrap"><table><tbody>${GLOSS.map(g=>`<tr><td style="white-space:nowrap"><b>${g[0]}</b></td><td class="muted">${g[1]}</td></tr>`).join('')}</table></div>`);

  /* footer */
  const foot=el('div');foot.innerHTML=`<div class="footer-actions"><button class="btn btn-primary" id="pdfBtn" type="button">⤓ Download PDF</button><button class="btn btn-ghost" id="shareBtn" type="button">🔗 Copy shareable link</button><button class="btn btn-ghost" id="editBtn" type="button">Edit birth details</button></div><p class="hint" style="text-align:center;margin:-8px 0 0">In the print dialog choose <b>Save as PDF</b>, and keep <b>Background graphics</b> on to preserve the full colour design. The shareable link encodes the birth details in the URL (not encrypted).</p><div class="disc">Computed entirely on your device with astronomy-engine (Swiss-Ephemeris-grade) and a Lahiri sidereal model validated to the arc-minute. No internet, no AI. Vedic astrology is a traditional interpretive system offered for reflection and cultural interest - not prediction, and not medical, legal or financial advice.</div>`;
  R.appendChild(foot);
  $('#pdfBtn').addEventListener('click',()=>window.print());
  $('#shareBtn').addEventListener('click',()=>{const url=shareUrl(lastInput||input);const b=$('#shareBtn');
    const ok=()=>{const t=b.textContent;b.textContent='✓ Link copied';setTimeout(()=>b.textContent=t,1600);};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(ok,()=>prompt('Copy this link:',url));
    else prompt('Copy this link:',url);});
  $('#editBtn').addEventListener('click',()=>smoothTo($('#formCard')));
}

/* jump nav handlers (fixed scrolling) */
$('#jumpInner').addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;e.preventDefault();
  const t=document.getElementById('sec-'+a.dataset.sec);smoothTo(t);});
/* scroll-spy: attached ONCE at load; queries the nav live so it never leaks or goes stale */
let spyTimer=null;
window.addEventListener('scroll',()=>{if(spyTimer)return;spyTimer=setTimeout(()=>{spyTimer=null;
  const nav=$('#jumpNav');if(!nav||!nav.classList.contains('show'))return;
  const navH=nav.offsetHeight+20;let cur=null;
  SECTIONS.forEach(s=>{const el=document.getElementById('sec-'+s[0]);if(el&&el.getBoundingClientRect().top<=navH)cur=s[0];});
  const inner=$('#jumpInner');if(!inner)return;
  inner.querySelectorAll('a').forEach(a=>a.classList.remove('active-link'));
  if(cur){const a=inner.querySelector('a[data-sec="'+cur+'"]');
    if(a){a.classList.add('active-link');
      const target=a.offsetLeft-inner.clientWidth/2+a.offsetWidth/2;
      if(Math.abs(inner.scrollLeft-target)>4)inner.scrollLeft=Math.max(0,target);}}
},80);},{passive:true});

/* ======================= prose generators ======================= */
function lifeLine(chart,input,vim,curMD,ss,yog,pro){
  const asc=chart.ascSign,moon=chart.planets[1];
  const ex=chart.planets.filter(p=>p.dig&&p.dig.cls==='exalt').map(p=>PL[p.i]);
  return `${SA[asc]}-rising with ${moon.nak.name} Moon${ex.length?', carrying '+(ex.length>1?ex.length+' exalted planets ('+ex.join(' & ')+')':'exalted '+ex[0]):''}; ${curMD?'now in a '+PL[curMD.lord]+' mahādaśā':'in transition'}${ss.status==='ACTIVE'?' with an active Sade-Sati that tests and matures':''}${yog.some(y=>y[0].includes('Gajakesari'))?', blessed by Gajakesari':''}.`;
}
function conditionNote(p,asc,fn){
  if(p.dig&&p.dig.cls==='exalt')return 'Exalted - a crown jewel of the chart.';
  if(p.dig&&p.dig.cls==='debil')return 'Debilitated - a soul-lesson maturing with effort.';
  if(p.dig&&p.dig.cls==='own')return 'In own sign - comfortable and effective.';
  if(p.combust)return 'Combust - strong inwardly, its outer expression burnt.';
  if([1,4,7,10].includes(p.house))return 'Angular (kendra) - placed to act in the world.';
  if([5,9].includes(p.house))return 'Trikonal - a house of fortune and merit.';
  if([6,8,12].includes(p.house))return 'In a dusthāna - works through challenge and depth.';
  return 'Neutral placement.';
}
function aspectNote(a,P,asc){const houses=a.aspects;
  if(a.i===4)return `Jupiter's grace reaches the ${houses.map(ord).join(', ')} - wisdom and protection.`;
  if(a.i===6)return `Saturn disciplines the ${houses.map(ord).join(', ')} - tests that build endurance.`;
  if(a.i===2)return `Mars energises the ${houses.map(ord).join(', ')} - drive and initiative.`;
  return `Casts its ${houses.map(ord).join(', ')} aspect.`;
}
function strengthProse(chart,vim,yog,sbala,av,fn){
  const P=chart.planets,out=[];
  const ex=P.filter(p=>p.dig&&p.dig.cls==='exalt');
  if(ex.length)out.push([`${ex.length>1?ex.length+' exalted planets':'Exalted '+PL[ex[0].i]}`,`${ex.map(p=>PL[p.i]+' exalted in the '+ord(p.house)+' ('+SG[p.sign]+')').join('; ')}. Exaltation is a peak of dignity - these are the chart's crown jewels, delivering their significations powerfully.`]);
  const own=P.filter(p=>p.dig&&p.dig.cls==='own'&&p.i<7);
  if(own.length)out.push(['Planets in own sign',`${own.map(p=>PL[p.i]+' in own '+SG[p.sign]+' ('+ord(p.house)+')').join('; ')} - self-assured, stable strength.`]);
  yog.forEach(y=>{if(!y[0].includes('caution'))out.push([y[0],y[1]]);});
  const top=sbala[0];out.push(['Strongest by Shadbala',`${PL[top.i]} leads the chart by six-fold strength (ratio ${top.ratio.toFixed(2)}), giving its house and significations real force.`]);
  const savMax=Math.max(...av.sav);out.push(['Ashtakavarga support',`${SG[av.sav.indexOf(savMax)]} carries the most bindus (${savMax}) - activity and transits there tend to succeed easily.`]);
  return out;
}
function challengeProse(chart,dsh,ss,P,asc){
  const out=[];
  if(ss.status==='ACTIVE')out.push(['Sade-Sati is active now',`Saturn transits the ${ord(ss.from)} from the Moon (${ss.phase}) - a maturing phase asking for patience, routine and steadiness. It builds real, earned resilience; avoid big risky moves and keep Saturn remedies.`]);
  dsh.forEach(d=>{if(d.status.startsWith('PRESENT')||d.status==='PRESENT')out.push([d.name,d.detail]);});
  P.forEach(p=>{if(p.dig&&p.dig.cls==='debil'&&p.i<7)out.push([`${PL[p.i]} debilitated`,`${PL[p.i]} falls debilitated in ${SG[p.sign]} (${ord(p.house)}) - its significations become a growth area, often learned through humility before fulfilment. A debilitation met consciously becomes a source of depth.`]);
    if(p.combust&&p.i===SL[asc])out.push([`${PL[p.i]} (Lagna lord) combust`,`The Lagna lord burns close to the Sun - strong will, but drive can scatter or overheat if unchannelled. Physical discipline and routine turn it into stamina.`]);});
  if(out.length===0)out.push(['A relatively clear chart','No major afflictions are flagged. The ordinary cautions of the running daśā and transits apply, but no classic dosha dominates.']);
  return out;
}
function lifeReadings(chart,input,vim,ss,fn,jm,pro,His,first){
  const P=chart.planets,asc=chart.ascSign,moon=P[1],out=[];
  out.push(['Personality & temperament',`${first} rises in ${LAGNA_TXT[asc]} With the ${moon.nak.name} Moon in ${SA[moon.sign]}, the inner life shows ${MOON_TXT[moon.sign]}`]);
  const l10=SL[(asc+9)%12];const ct=J.careerTiming(chart);
  out.push(['Career & profession',`The 10th (${SG[(asc+9)%12]}) is ruled by ${PL[l10]}, placed in the ${ord(P[l10].house)} - profession is built through ${HOUSE_THEME[P[l10].house-1]}. Suited to fields that reward ${l10===0?'leadership & authority':l10===3?'intellect & communication':l10===4?'teaching, law & counsel':l10===6?'structure, industry & endurance':l10===2?'engineering, drive & enterprise':'skill & refinement'}.${ct.windows.length?` Career-activating windows (10th-lord/Amātya daśās): ${ct.windows.map(w=>`<b>${w.label}</b> (${w.dasha})`).join('; ')}.`:''}`]);
  const l2=SL[(asc+1)%12],l11=SL[(asc+10)%12];out.push(['Wealth & finances',`Income (2nd lord ${PL[l2]} in the ${ord(P[l2].house)}, 11th lord ${PL[l11]} in the ${ord(P[l11].house)}) builds through ${HOUSE_THEME[P[l11].house-1]}. ${chart.planets.some(p=>p.dig&&p.dig.cls==='exalt'&&[2,11].includes(p.house))?'Exalted support in the wealth houses is a strong asset.':'Steady saving beats speculation.'}`]);
  const l7=SL[(asc+6)%12];const mt=J.marriageTiming(chart);
  const mtxt=mt.windows.length?`Likeliest marriage windows, from the actual ${PL[mt.l7]}/Darakāraka/Upapada daśā periods${mt.windows.some(w=>w.dt)?' with Jupiter-Saturn double-transit support':''}: ${mt.windows.map(w=>`<b>age ${w.label}</b> (${w.dasha} daśā)`).join('; ')}.${mt.delayed?' The pattern leans later - patience serves.':''}`:'No sharply-defined marriage window stands out; timing spreads across the partnership-lord daśās.';
  out.push(['Marriage & partnership',`The 7th (${SG[(asc+6)%12]}) is ruled by ${PL[l7]} in the ${ord(P[l7].house)}; Upapada in ${SG[jm.UL]}, Darakāraka ${J.charaKarakas(P)[6].name}, spouse-sign (7th lord in D-9) ${SG[mt.spouseSign]}. ${mtxt}`]);
  const l5=SL[(asc+4)%12];out.push(['Children & progeny',`The 5th (${SG[(asc+4)%12]}) lord ${PL[l5]} sits in the ${ord(P[l5].house)}; Jupiter (children-kāraka) in the ${ord(P[4].house)}. ${P[4].dig&&P[4].dig.cls==='exalt'?'Exalted Jupiter is about the best signature for children there is.':'Supportive for progeny with Jupiter periods.'}`]);
  out.push(['Health & vitality',`Underlying vitality from ${P[0].dig&&P[0].dig.cls!=='debil'?'a well-placed Sun':'the Sun'} and ${P[4].dig&&P[4].dig.cls==='exalt'?'exalted Jupiter':'Jupiter'}. ${ss.status==='ACTIVE'?'Through the Sade-Sati, watch stress, sleep and routine.':''}${P[2].combust?' Combust Mars asks care with blood-pressure, inflammation and accidents - drive carefully.':''} Moderation and routine keep it well-managed.`]);
  out.push(['Spirituality & inner life',`${P[8].house===1?'Ketu on the Lagna, ':''}${SA[asc]} rising and the Yogi linked to ${jm.yogiLord} draw ${pro} toward depth, philosophy and inner practice, especially in the ${jm.yogiLord} and later periods. Iṣṭa Devatā: ${J.ISHTA_DEV[SL[jm.ishta12]]}.`]);
  return out;
}
function peopleReadings(chart,ck,jm,P,asc,pro,His){
  const out=[];
  out.push(['Spouse (kārakas: Venus / 7th; Darakāraka; Upapada)',`Rahu/7th-lord placement, a ${SG[jm.UL]} Upapada and Darakāraka ${ck[6].name} point to a ${SG[jm.UL]===4||jm.UL===4?'warm, dignified':'capable, committed'} partner - the bond deepens and steadies with time.`]);
  out.push(['Children (kāraka: Jupiter / 5th)',`Jupiter in the ${ord(P[4].house)}${P[4].dig&&P[4].dig.cls==='exalt'?', exalted,':''} as children-significator favours ${P[4].dig&&P[4].dig.cls==='exalt'?'capable, fortunate children and a warm, guiding bond':'a caring bond with progeny'}.`]);
  out.push(['Mother (4th house; Moon)',`The 4th (${SG[(asc+3)%12]}) and the Moon in the ${ord(P[1].house)} describe the mother and home. ${P[1].dig&&P[1].dig.cls!=='debil'?'A supportive, nurturing tie.':'A tie that matures through care.'}`]);
  out.push(['Father (9th house; Sun)',`The 9th (${SG[(asc+8)%12]}) and the Sun in the ${ord(P[0].house)} describe the father and fortune. ${P[0].dig&&P[0].dig.cls!=='debil'?'A dignified, elevating influence.':'A bond that grows with time.'}`]);
  return out;
}
function depthReadings(chart,ck,jm,P,asc,vim,pro){
  const out=[];
  const sat=P[6];out.push(['Longevity (Āyu) - the traditional picture',`Saturn (āyuṣ-kāraka) sits in the ${ord(sat.house)}; the 8th lord and the protective aspects of Jupiter shape the picture. ${P.some(p=>p.dig&&p.dig.cls==='exalt')?'Dignified benefics lend good underlying vitality.':''} Classical jyotiṣa treats timing of death as the least certain of all readings - offered for reflection only, never as a verdict. The sensitive windows are the maraka-period years in old age.`]);
  const mt=J.marriageTiming(chart);
  out.push(['Spouse - in depth',`7th lord ${PL[SL[(asc+6)%12]]} in the ${ord(P[SL[(asc+6)%12]].house)}, Darakāraka ${ck[6].name}, Upapada ${SG[jm.UL]}, and the D-9 Lagna colour the marriage; the 7th lord sits in ${SG[mt.spouseSign]} in the Navāṁśa. ${mt.windows.length?`The computed likely windows (from the ${PL[mt.l7]}/Darakāraka/${mt.male?'Venus':'Jupiter'}-kāraka daśās${mt.windows.some(w=>w.dt)?', double-transit-confirmed':''}) are: ${mt.windows.map(w=>`<b>age ${w.label}</b> [${w.dasha}]`).join('; ')}.`:'Timing spreads across the partnership-lord daśās rather than one sharp window.'} Conscious effort makes the bond stable and devoted.`]);
  out.push(['Children - in depth',`Jupiter (5th kāraka) in the ${ord(P[4].house)}${P[4].dig&&P[4].dig.cls==='exalt'?', exalted in fortune':''}, with the D-7 Lagna, describes progeny. ${P[4].dig&&P[4].dig.cls==='exalt'?'About the best signature there is - capable, fortunate children.':'Supportive with Jupiter-period timing.'}`]);
  return out;
}
function dashaTheme(lord){return {0:'authority, recognition, the father\'s influence',1:'emotional growth, home, the public',2:'drive, courage, career action and initiative',3:'intellect, commerce, communication, study',4:'growth, family, children, wisdom and fortune',5:'comfort, relationships, art and refinement',6:'hard work, discipline, earned status and mastery',7:'ambition, worldly expansion, the unconventional rise',8:'detachment, spirituality, an inward turn'}[lord]||'';}
function yog2Yogini(chart){return J.yoginiDasha(chart.planets[1].lon,chart.jd);}

/* ---- starfield ---- */
(function(){const cv=$('#stars');if(!cv)return;const ctx=cv.getContext('2d');if(!ctx)return;let stars=[];
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function build(){const w=cv.width=cv.offsetWidth,h=cv.height=cv.offsetHeight;stars=[];
    const n=Math.min(70,Math.round(w/16));for(let i=0;i<n;i++)stars.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+.2,p:Math.random()*Math.PI*2});}
  window._stars=build;
  function draw(t){const w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);
    const col=getComputedStyle(document.documentElement).getPropertyValue('--brass').trim();
    stars.forEach(s=>{const a=reduce?.5:(.35+.35*Math.sin(t/900+s.p));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=col;ctx.globalAlpha=a;ctx.fill();});
    ctx.globalAlpha=1;if(!reduce)requestAnimationFrame(draw);}
  build();requestAnimationFrame(draw);addEventListener('resize',build);})();

renderShowcase();
initLogin();
})();
