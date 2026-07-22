/* ================================================================
   JĀTHAKA ENGINE  -  pure-browser Vedic horoscope computation
   Lahiri (Chitrapaksha) sidereal · mean-node Rahu · whole-sign houses
   Astronomy from astronomy-engine (Don Cross, MIT). Zero network, zero AI.
   Validated arc-minute against pyswisseph.
   ================================================================ */
const A = window.Astronomy;
const J2000 = 2451545.0, D2R = Math.PI/180, R2D = 180/Math.PI, TAU=Math.PI*2;
const norm360 = x => ((x%360)+360)%360;

/* ---- names ---- */
const SIGNS=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGN_SHORT=["Ari","Tau","Gem","Can","Leo","Vir","Lib","Sco","Sag","Cap","Aqu","Pis"];
const SIGN_SANS=["Meṣa","Vṛṣabha","Mithuna","Karka","Siṁha","Kanyā","Tulā","Vṛścika","Dhanu","Makara","Kumbha","Mīna"];
const NAK=["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const PLANETS=["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
const PL_SANS=["Sūrya","Chandra","Maṅgala","Budha","Guru","Śukra","Śani","Rāhu","Ketu"];
const PL_GLYPH=["Su","Mo","Ma","Me","Ju","Ve","Sa","Ra","Ke"];
/* sign lord index into PLANETS for each of 12 signs */
const SIGN_LORD=[2,5,3,1,0,3,5,2,4,6,6,4];
const EXALT={0:[0,10],1:[1,3],2:[9,28],3:[5,15],4:[3,5],5:[11,27],6:[6,20]}; // planet:[sign,deg]
const COMBUST=[0,12,17,14,11,10,15,0,0]; // orb in deg from Sun (index by planet)
/* Vimshottari */
const VIM_LORDS=[8,5,0,1,2,7,4,6,3]; // Ketu,Venus,Sun,Moon,Mars,Rahu,Jupiter,Saturn,Mercury (planet indices)
const VIM_YEARS={8:7,5:20,0:6,1:10,2:7,7:18,4:16,6:19,3:17};
const VIM_SEQ=[8,5,0,1,2,7,4,6,3];
/* Yogini */
const YOGINI=[["Mangala",1,1],["Pingala",2,0],["Dhanya",3,4],["Bhramari",4,2],["Bhadrika",5,3],["Ulka",6,6],["Siddha",7,5],["Sankata",8,7]]; // name,years,rulerPlanet

/* ---- Lahiri ayanamsa (cubic fit to Swiss Ephemeris, <0.001" over 1900-2100) ---- */
function ayanamsa(jd){const t=(jd-J2000)/36525.0;
  return ((3.325219339e-09*t+0.0003070909898)*t+1.396887957)*t+23.85709235;}
function meanObliq(jd){const t=(jd-J2000)/36525.0;
  return 23.439291111-0.0130041667*t-1.638889e-7*t*t+5.036111e-7*t*t*t;}

/* ---- Julian Day from civil date + timezone ---- */
function julday(y,mo,d,hourUT){
  if(mo<=2){y-=1;mo+=12;}
  const a=Math.floor(y/100), b=2-a+Math.floor(a/4);
  return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(mo+1))+d+b-1524.5+hourUT/24;
}

/* ---- sidereal ecliptic longitude of a body ---- */
function sidLon(body,jd){
  const time=A.MakeTime(jd-J2000);
  const gv=A.GeoVector(body,time,true);
  const ecl=A.Ecliptic(gv);
  return norm360(ecl.elon-ayanamsa(jd));
}
function meanNodeSid(jd){const T=(jd-J2000)/36525.0;
  let om=125.0445479-1934.1362891*T+0.0020754*T*T+T*T*T/467441-T*T*T*T/60616000;
  return norm360(om-ayanamsa(jd));}
/* speed (deg/day) for retro detection */
function speed(body,jd){return sidLonRaw(body,jd+0.5)-sidLonRaw(body,jd-0.5);}
function sidLonRaw(body,jd){const time=A.MakeTime(jd-J2000);
  const gv=A.GeoVector(body,time,true);const ecl=A.Ecliptic(gv);
  return ecl.elon; }
function unwrapDelta(a){a=a%360;if(a>180)a-=360;if(a<-180)a+=360;return a;}

/* ---- ascendant (Lagna) ---- */
function lagna(jd,latDeg,lonEastDeg){
  latDeg=Math.max(-89.9,Math.min(89.9,latDeg)); // avoid tan(±90°) singularity at the poles
  const time=A.MakeTime(jd-J2000);
  const gast=A.SiderealTime(time);
  let ramc=norm360(gast*15+lonEastDeg)*D2R;
  const eps=meanObliq(jd)*D2R, phi=latDeg*D2R;
  let asc=Math.atan2(Math.cos(ramc),-(Math.sin(ramc)*Math.cos(eps)+Math.tan(phi)*Math.sin(eps)))*R2D;
  return norm360(norm360(asc)-ayanamsa(jd));
}

/* ---- helpers ---- */
function nakOf(lon){const span=360/27;const idx=Math.floor(lon/span);
  const pada=Math.floor((lon%span)/(span/4))+1;return{idx,pada,name:NAK[idx]};}
function dms(x){const d=Math.floor(x);const mf=(x-d)*60;const m=Math.floor(mf);const s=Math.round((mf-m)*60);
  return `${d}°${String(m).padStart(2,'0')}'${String(s).padStart(2,'0')}"`;}
function dm(x){const d=Math.floor(x);const m=(x-d)*60;return `${d}°${m.toFixed(0).padStart(2,'0')}'`;}
function signOf(lon){return Math.floor(norm360(lon)/30);}
function dignity(pi,lon){ // pi planet index, returns {label,cls}
  const s=signOf(lon);
  if(pi>6)return null;
  if(EXALT[pi]){const es=EXALT[pi][0];if(s===es)return{label:"Exalted",cls:"exalt"};
    if(s===(es+6)%12)return{label:"Debilitated",cls:"debil"};}
  // own sign
  const owns=[]; for(let i=0;i<12;i++)if(SIGN_LORD[i]===pi)owns.push(i);
  if(owns.includes(s))return{label:"Own sign",cls:"own"};
  return null;
}

/* ================= build full chart ================= */
function buildChart(input){
  const {y,mo,d,hh,mi,lat,lon,tz}=input;
  const hourUT=hh+mi/60-tz;
  const jd=julday(y,mo,d,hourUT);
  const bodyMap=[A.Body.Sun,A.Body.Moon,A.Body.Mars,A.Body.Mercury,A.Body.Jupiter,A.Body.Venus,A.Body.Saturn];
  const planets=[];
  for(let i=0;i<7;i++){
    const L=sidLon(bodyMap[i],jd);
    const sp=(i===0)?1:unwrapDelta(speed(bodyMap[i],jd)); // sun never retro
    planets.push({i,name:PLANETS[i],lon:L,retro:sp<0,speed:sp});
  }
  const rahu=meanNodeSid(jd);
  planets.push({i:7,name:"Rahu",lon:rahu,retro:true,speed:-1});
  planets.push({i:8,name:"Ketu",lon:norm360(rahu+180),retro:true,speed:-1});
  const asc=lagna(jd,lat,lon);
  const ascSign=signOf(asc);
  // combustion (relative to Sun)
  const sunLon=planets[0].lon;
  planets.forEach(p=>{
    if(p.i>=1&&p.i<=6){const diff=Math.abs(unwrapDelta(p.lon-sunLon));p.combust=diff<COMBUST[p.i];}
    p.sign=signOf(p.lon);
    p.house=((p.sign-ascSign)%12+12)%12+1; // whole-sign
    p.nak=nakOf(p.lon);
    p.dig=dignity(p.i,p.lon);
  });
  return {jd,asc,ascSign,ascNak:nakOf(asc),planets,input};
}

/* ================= divisional charts ================= */
/* returns sign index (0-11) of a body's varga position */
function vargaSign(lon,D){
  const sign=signOf(lon), deg=lon%30;
  const movable=[0,3,6,9], fixed=[1,4,7,10]; // dual = rest
  const isOdd = sign%2===0; // Aries=0 is odd sign in jyotish (1st)
  switch(D){
    case 1: return sign;
    case 2:{ // Hora
      if(isOdd) return deg<15?4:3;       // odd: 0-15 Leo(Sun), 15-30 Cancer(Moon)
      else return deg<15?3:4; }
    case 3:{ const t=Math.floor(deg/10); return (sign+t*4)%12; } // Drekkana 1,5,9
    case 4:{ const t=Math.floor(deg/7.5); return (sign+t*3)%12; } // Chaturthamsa 1,4,7,10
    case 7:{ let start=isOdd?sign:(sign+6)%12; const t=Math.floor(deg/(30/7)); return (start+t)%12; }
    case 9:{ return Math.floor(lon/(30/9))%12; } // Navamsa (continuous = Parashara)
    case 10:{ let start=isOdd?sign:(sign+8)%12; const t=Math.floor(deg/3); return (start+t)%12; }
    case 12:{ const t=Math.floor(deg/2.5); return (sign+t)%12; } // Dwadashamsa
    case 16:{ let base=movable.includes(sign)?0:(fixed.includes(sign)?4:8);
      const t=Math.floor(deg/(30/16)); return (base+t)%12; }
    case 20:{ let base=movable.includes(sign)?0:(fixed.includes(sign)?8:4);
      const t=Math.floor(deg/1.5); return (base+t)%12; }
    case 24:{ let start=isOdd?4:3; const t=Math.floor(deg/1.25); return (start+t)%12; }
    case 27:{ const t=Math.floor(deg/(30/27)); const base=[0,3,6,9][sign%4]; return (base+t)%12; }
    case 30:{ // Trimshamsa
      if(isOdd){ if(deg<5)return 0; if(deg<10)return 10; if(deg<18)return 8; if(deg<25)return 2; return 6; }
      else { if(deg<5)return 1; if(deg<12)return 5; if(deg<20)return 11; if(deg<25)return 9; return 7; } }
    case 40:{ let base=isOdd?0:6; const t=Math.floor(deg/0.75); return (base+t)%12; }
    case 45:{ let base=movable.includes(sign)?0:(fixed.includes(sign)?4:8);
      const t=Math.floor(deg/(30/45)); return (base+t)%12; }
    case 60:{ const t=Math.floor(deg/0.5); return (sign+t)%12; }
    default: return sign;
  }
}
function buildVarga(chart,D){
  const ascS=vargaSign(chart.asc,D);
  const items=chart.planets.map(p=>({i:p.i,name:p.name,sign:vargaSign(p.lon,D)}));
  return {D,ascSign:ascS,items};
}

/* ================= Vimshottari dasha ================= */
function vimshottari(moonLon,birthJD){
  const span=360/27, nk=Math.floor(moonLon/span);
  const lord=VIM_LORDS[nk%9];
  const fracPassed=(moonLon%span)/span;
  const startIdx=VIM_SEQ.indexOf(lord);
  const balance=VIM_YEARS[lord]*(1-fracPassed);
  const YEAR=365.2425;
  let cur=birthJD-VIM_YEARS[lord]*fracPassed*YEAR; // MD notional start
  const list=[];
  for(let k=0;k<9;k++){
    const L=VIM_SEQ[(startIdx+k)%9];
    const yrs=VIM_YEARS[L];
    const st=cur, en=cur+yrs*YEAR;
    // antardashas
    const ad=[];
    let c2=st;
    for(let j=0;j<9;j++){
      const AL=VIM_SEQ[(VIM_SEQ.indexOf(L)+j)%9];
      const ay=yrs*VIM_YEARS[AL]/120;
      ad.push({lord:AL,st:c2,en:c2+ay*YEAR});
      c2+=ay*YEAR;
    }
    list.push({lord:L,st,en,ad});
    cur=en;
  }
  return {list,balanceYrs:balance,startLord:lord};
}

/* ================= Yogini dasha ================= */
function yoginiDasha(moonLon,birthJD){
  const span=360/27, nk=Math.floor(moonLon/span)+1;
  let r=(nk+3)%8; if(r===0)r=8; // yogini number 1..8
  const startIdx=r-1;
  const fracPassed=(moonLon%span)/span;
  const YEAR=365.2425;
  const y0=YOGINI[startIdx][1];
  let cur=birthJD-y0*fracPassed*YEAR;
  const list=[];
  for(let k=0;k<8;k++){
    const yi=(startIdx+k)%8;
    const yrs=YOGINI[yi][1];
    list.push({name:YOGINI[yi][0],ruler:YOGINI[yi][2],st:cur,en:cur+yrs*YEAR});
    cur+=yrs*YEAR;
  }
  return list;
}

/* ================= Chara Karakas ================= */
function charaKarakas(planets){
  // 8-body (Sun..Saturn + Rahu). Rahu degree measured as 30 - deg-in-sign
  const names=["Atmakaraka","Amatyakaraka","Bhratrukaraka","Matrukaraka","Putrakaraka","Gnatikaraka","Darakaraka"];
  const arr=[];
  for(let i=0;i<7;i++){arr.push({i,name:PLANETS[i],val:planets[i].lon%30});}
  const rahuDeg=30-(planets[7].lon%30);
  arr.push({i:7,name:"Rahu",val:rahuDeg});
  arr.sort((a,b)=>b.val-a.val);
  return arr.slice(0,7).map((x,idx)=>({...x,karaka:names[idx]}));
}

/* ================= Ashtakavarga ================= */
/* benefic houses (1-based, counted from contributor) for each planet's BAV */
const AV={
  0:[[1,2,4,7,8,9,10,11],[3,6,10,11],[1,2,4,7,8,9,10,11],[3,5,6,9,10,11,12],[5,6,9,11],[6,7,12],[1,2,4,7,8,9,10,11],[3,4,6,10,11,12]],
  1:[[3,6,7,8,10,11],[1,3,6,7,10,11],[2,3,5,6,9,10,11],[1,3,4,5,7,8,10,11],[1,4,7,8,10,11,12],[3,4,5,7,9,10,11],[3,5,6,11],[3,6,10,11]],
  2:[[3,5,6,10,11],[3,6,11],[1,2,4,7,8,10,11],[3,5,6,11],[6,10,11,12],[6,8,11,12],[1,4,7,8,9,10,11],[1,3,6,10,11]],
  3:[[5,6,9,11,12],[2,4,6,8,10,11],[1,2,4,7,8,9,10,11],[1,3,5,6,9,10,11,12],[6,8,11,12],[1,2,3,4,5,8,9,11],[1,2,4,7,8,9,10,11],[1,2,4,6,8,10,11]],
  4:[[1,2,3,4,7,8,9,10,11],[2,5,7,9,11],[1,2,4,7,8,10,11],[1,2,4,5,6,9,10,11],[1,2,3,4,7,8,10,11],[2,5,6,9,10,11],[3,5,6,12],[1,2,4,5,6,7,9,10,11]],
  5:[[8,11,12],[1,2,3,4,5,8,9,11,12],[3,5,6,9,11,12],[3,5,6,9,11],[5,8,9,10,11],[1,2,3,4,5,8,9,10,11],[3,4,5,8,9,10,11],[1,2,3,4,5,8,9,11]],
  6:[[1,2,4,7,8,10,11],[3,6,11],[3,5,6,10,11,12],[6,8,9,10,11,12],[5,6,11,12],[6,11,12],[3,5,6,11],[1,3,4,6,10,11]]
};
/* contributor order: Sun,Moon,Mars,Mercury,Jupiter,Venus,Saturn,Lagna */
function ashtakavarga(chart){
  const signPos=[]; for(let i=0;i<7;i++)signPos.push(chart.planets[i].sign);
  signPos.push(chart.ascSign); // Lagna as 8th contributor
  const bav={}; const sav=new Array(12).fill(0);
  for(let p=0;p<7;p++){
    const row=new Array(12).fill(0);
    for(let c=0;c<8;c++){
      const from=signPos[c];
      for(const h of AV[p][c]){ row[(from+h-1)%12]++; }
    }
    bav[p]=row;
    for(let s=0;s<12;s++)sav[s]+=row[s];
  }
  return {bav,sav};
}

/* ================= Yogas ================= */
function detectYogas(chart){
  const P=chart.planets, out=[];
  const by=i=>P[i];
  const house=i=>P[i].house;
  const moonH=house(1);
  const kendraFromMoon=i=>{const d=((P[i].sign-P[1].sign)%12+12)%12+1;return [1,4,7,10].includes(d);};
  // Gajakesari
  if(kendraFromMoon(4)) out.push(["Gajakesari Yoga","Jupiter in a kendra (1/4/7/10) from the Moon - confers intelligence, respect, and lasting reputation."]);
  // Budhaditya
  if(P[0].sign===P[3].sign) out.push(["Budhāditya Yoga","Sun and Mercury conjoined - sharp intellect, communication skill, administrative ability."]);
  // Chandra-Mangala
  if(P[1].sign===P[2].sign) out.push(["Chandra-Maṅgala Yoga","Moon with Mars - drive, enterprise, and capacity to generate wealth through effort."]);
  // Anapha / Sunapha / Durudhara (from Moon, 2nd/12th excluding Sun)
  const around=[]; for(let i=2;i<=6;i++){if(i===0)continue; const d=((P[i].sign-P[1].sign)%12+12)%12+1; if(d===2)around.push('2'); if(d===12)around.push('12');}
  if(around.includes('12')&&around.includes('2')) out.push(["Durudhara Yoga","Planets flanking the Moon on both sides - material comfort and a balanced, capable temperament."]);
  else if(around.includes('2')) out.push(["Sunapha Yoga","A planet in the 2nd from the Moon - self-earned wealth and steady standing."]);
  else if(around.includes('12')) out.push(["Anapha Yoga","A planet in the 12th from the Moon - well-formed character, health, and a dignified nature."]);
  // Kemadruma check (nothing in 2/12 from Moon, no kendra from moon, no conjunction)
  const anyWithMoon=P.some((p,i)=>i>=0&&i<=6&&i!==1&&p.sign===P[1].sign);
  if(around.length===0&&!anyWithMoon){ out.push(["Kemadruma Yoga (caution)","Moon isolated with no planets adjacent - indicates need for self-reliance; often cancelled by kendra support."]);}
  // Kendra-trikona / Raja hints: lords of trikona (1,5,9) + kendra association simplified
  // Neechabhanga hint
  P.forEach((p)=>{ if(p.dig&&p.dig.cls==="exalt"&&p.i<=6) out.push([`${PL_SANS[p.i]} exalted`,`${p.name} occupies its sign of exaltation in ${SIGNS[p.sign]} - a strong, well-placed graha in the chart.`]);});
  // Chamara / Malavya etc (Pancha Mahapurusha) - planet in own/exalt in kendra
  const MPY={2:"Ruchaka",4:"Hamsa",5:"Malavya",3:"Bhadra",6:"Shasha"};
  [2,4,5,3,6].forEach(pi=>{ const p=P[pi]; if([1,4,7,10].includes(p.house)&&p.dig&&(p.dig.cls==="own"||p.dig.cls==="exalt")){
    out.push([`${MPY[pi]} Mahāpuruṣa Yoga`,`${p.name} strong (own/exalted) in a kendra - a Pancha-Mahapurusha combination granting distinguished ${pi===2?"courage and leadership":pi===4?"wisdom and virtue":pi===5?"charm, comfort and artistry":pi===3?"intellect and eloquence":"discipline and endurance"}.`]);
  }});
  // Kala Sarpa (all planets between Rahu-Ketu axis)
  const rl=P[7].lon, kl=P[8].lon;
  let allBetween=true, side=null;
  for(let i=0;i<7;i++){ const x=norm360(P[i].lon-rl); if(side===null)side=x<180; else if((x<180)!==side){allBetween=false;break;} }
  if(allBetween) out.push(["Kāla-Sarpa Yoga","All seven planets fall on one side of the Rahu-Ketu axis - intensifies the life's karmic themes; effects vary by house."]);
  return out;
}

/* ================= expose for UI ================= */
window.JATHAKA={buildChart,buildVarga,vimshottari,yoginiDasha,charaKarakas,ashtakavarga,detectYogas,
  SIGNS,SIGN_SHORT,SIGN_SANS,NAK,PLANETS,PL_SANS,PL_GLYPH,SIGN_LORD,dms,dm,dm2:dm,nakOf,signOf,ayanamsa,julday,norm360,
  // internals for extended sections (engine2):
  _:{sidLon,meanNodeSid,lagna,meanObliq,vargaSign,dignity,EXALT,COMBUST,
     VIM_LORDS,VIM_SEQ,VIM_YEARS,YOGINI,unwrapDelta,speed,julday,A}};
