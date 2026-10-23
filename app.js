const nav=[...document.querySelectorAll('.nav button')], views=[...document.querySelectorAll('.view')], crumb=document.getElementById('crumb');
nav.forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.view; nav.forEach(x=>x.classList.remove('active'));b.classList.add('active');views.forEach(v=>v.classList.toggle('active',v.id===id));crumb.textContent=b.innerText.trim();window.scrollTo({top:0,behavior:'smooth'})}));
document.querySelectorAll('.mode button').forEach(b=>b.addEventListener('click',()=>{ if(b.dataset.role===state.role||(b.dataset.role==='organiser'&&state.role==='organiser'))return; showLogin(b.dataset.role==='command'?'command':'organiser') }));
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove('show'),2200)}

/* ---- Event Wizard State & 8-Step Logic ---- */
let currentWizardStep = 1;
const eventData = {};

const wizardStepTitles = [
  "Step 1 of 8: Basic Event Information",
  "Step 2 of 8: Date, Time and Venue",
  "Step 3 of 8: Tickets and Pricing",
  "Step 4 of 8: Attendee Registration",
  "Step 5 of 8: Event Operations and Safety",
  "Step 6 of 8: Entry Management and Technology",
  "Step 7 of 8: Payments and Settlement",
  "Step 8 of 8: Publish and Manage"
];

function openModal(){
  currentWizardStep = 1;
  document.getElementById('modal').classList.add('show');
  renderWizardStep();
}
function closeModal(){
  document.getElementById('modal').classList.remove('show');
}
function closeIncidentModal(){
  document.getElementById('incModal').classList.remove('show');
}

function renderWizardStep(){
  document.getElementById('wizardSubtitle').textContent = wizardStepTitles[currentWizardStep - 1];
  const body = document.getElementById('wizardBody');
  const backBtn = document.getElementById('wizardBackBtn');
  const nextBtn = document.getElementById('wizardNextBtn');

  backBtn.style.display = currentWizardStep > 1 ? 'inline-block' : 'none';
  nextBtn.textContent = currentWizardStep === 8 ? 'Publish Event' : 'Continue to event setup';

  let html = '';
  switch(currentWizardStep){
    case 1:
      html = `
        <div class="field"><label>Event name *</label><input id="w_name" placeholder="e.g. Summer Festival" value="${eventData.name||''}" /></div>
        <div class="field"><label>Event category *</label>
          <select id="w_category">
            <option>Concert</option><option>Festival</option><option>Sporting event</option><option>Conference</option><option>Exhibition</option><option>Corporate event</option><option>Community event</option><option>Private function</option><option>Other</option>
          </select>
        </div>
        <div class="field"><label>Short event description *</label><input id="w_shortDesc" placeholder="Brief tagline or summary" value="${eventData.shortDesc||''}" /></div>
        <div class="field"><label>Full event description</label><textarea id="w_fullDesc" style="background:#0b0e13;color:#fff;border:1px solid var(--line);padding:12px;border-radius:10px;font:inherit;height:80px;" placeholder="Detailed event overview">${eventData.fullDesc||''}</textarea></div>
        <div class="field"><label>Event organiser or company name *</label><input id="w_organiser" placeholder="e.g. XCESS Entertainment" value="${eventData.organiser||''}" /></div>
        <div class="field"><label>Event contact email & telephone *</label><input id="w_contact" placeholder="contact@event.co.za | +27 ..." value="${eventData.contact||''}" /></div>
      `;
      break;
    case 2:
      html = `
        <div class="field"><label>Event format *</label>
          <select id="w_format"><option>Physical event</option><option>Online event</option><option>Hybrid event</option></select>
        </div>
        <div class="field"><label>Venue name *</label><input id="w_venue" placeholder="e.g. FNB Stadium / Sandton Convention Centre" value="${eventData.venue||''}" /></div>
        <div class="field"><label>Venue street address *</label><input id="w_address" placeholder="Street address & suburb" value="${eventData.address||''}" /></div>
        <div class="field"><label>City, province and country *</label><input id="w_city" placeholder="Johannesburg, Gauteng, South Africa" value="${eventData.city||'Johannesburg, Gauteng, South Africa'}" /></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="field"><label>Event start date & time *</label><input type="datetime-local" id="w_start" value="${eventData.start||''}" /></div>
          <div class="field"><label>Event end date & time *</label><input type="datetime-local" id="w_end" value="${eventData.end||''}" /></div>
        </div>
        <div class="field"><label>Venue capacity *</label><input type="number" id="w_capacity" placeholder="e.g. 15000" value="${eventData.capacity||''}" /></div>
      `;
      break;
    case 3:
      html = `
        <div class="field"><label>Is the event free or paid? *</label>
          <select id="w_isPaid"><option>Paid event</option><option>Free event</option></select>
        </div>
        <div class="field"><label>Ticket types & pricing</label><input id="w_ticketTypes" placeholder="e.g. General Admission (R350), VIP (R750)" value="${eventData.ticketTypes||''}" /></div>
        <div class="field"><label>Number of tickets available per type *</label><input id="w_ticketQty" placeholder="e.g. General: 12000, VIP: 3000" value="${eventData.ticketQty||''}" /></div>
        <div class="field"><label>Refund and cancellation policy *</label><input id="w_refundPolicy" placeholder="e.g. Strict, Moderate, or Flexible up to 7 days prior" value="${eventData.refundPolicy||''}" /></div>
      `;
      break;
    case 4:
      html = `
        <p style="color:var(--muted); font-size:13px; margin-bottom:12px;">Choose mandatory and optional information to collect from ticket buyers and attendees:</p>
        <div class="field"><label>Mandatory Attendee Fields</label>
          <div style="display:flex; gap:16px; font-size:13px; color:#fff; align-items:center;"><label><input type="checkbox" checked disabled> Full name</label> <label><input type="checkbox" checked disabled> Email address</label></div>
        </div>
        <div class="field"><label>Additional Registration Fields</label>
          <input id="w_customReg" placeholder="e.g. Dietary requirements, Emergency contact, Company name" value="${eventData.customReg||''}" />
        </div>
        <div class="field"><label>Attendee terms and conditions acceptance *</label>
          <select id="w_tc"><option>Required at checkout</option><option>Optional</option></select>
        </div>
      `;
      break;
    case 5:
      html = `
        <div class="field"><label>Expected attendance and approved capacity *</label><input id="w_expAttendance" placeholder="e.g. 15,000 expected (18,000 max capacity)" value="${eventData.expAttendance||''}" /></div>
        <div class="field"><label>Safety officer and event manager contact details *</label><input id="w_safetyOfficer" placeholder="Name, Role, Phone number" value="${eventData.safetyOfficer||''}" /></div>
        <div class="field"><label>Operations & Safety Plans Required</label>
          <div style="font-size:12px; color:var(--muted); display:grid; gap:6px; background:#0b0e13; padding:12px; border-radius:10px; border:1px solid var(--line);">
            <div>✓ Traffic management & parking requirements</div>
            <div>✓ Medical, fire and emergency arrangements</div>
            <div>✓ JOC, municipal or safety permits upload status</div>
          </div>
        </div>
      `;
      break;
    case 6:
      html = `
        <div class="field"><label>Entry method & technology *</label>
          <select id="w_entryMethod"><option>QR code & Barcode scanning via mobile app</option><option>RFID Wristbands</option><option>Guest list / Manual check-in</option></select>
        </div>
        <div class="field"><label>Number of entry gates & scanning devices *</label><input id="w_gates" placeholder="e.g. 4 Gates, 20 handheld scanners" value="${eventData.gates||''}" /></div>
        <div class="field"><label>Offline scanning requirements</label><input id="w_offlineScan" placeholder="e.g. Enabled with local device cache syncing" value="${eventData.offlineScan||'Enabled'}" /></div>
      `;
      break;
    case 7:
      html = `
        <div class="field"><label>Legal organiser or business name *</label><input id="w_legalName" placeholder="Registered business or legal entity name" value="${eventData.legalName||''}" /></div>
        <div class="field"><label>Settlement account & verification *</label><input id="w_bank" placeholder="Secure banking details / Payout destination" value="${eventData.bank||''}" /></div>
        <div class="field"><label>Payment gateway configuration *</label><input id="w_gateway" placeholder="e.g. Paystack / Peach Payments / Yoco" value="${eventData.gateway||'Paystack (Default)'}" /></div>
      `;
      break;
    case 8:
      html = `
        <div class="field"><label>Event visibility *</label>
          <select id="w_visibility"><option>Public event page</option><option>Unlisted (Private link only)</option><option>Password protected</option></select>
        </div>
        <div class="field"><label>Organiser cancellation & event rules *</label><input id="w_rules" placeholder="Summary of event rules for attendees" value="${eventData.rules||''}" /></div>
        <div style="background:#0b0e13; border:1px solid var(--line); border-radius:12px; padding:16px; margin-top:14px;">
          <h3 style="margin:0 0 8px; color:var(--accent);">Ready to launch?</h3>
          <p style="color:var(--muted); font-size:13px; margin:0;">Review your 8-step configuration. Clicking 'Publish Event' will save your event shell and open your live operations workspace.</p>
        </div>
      `;
      break;
  }
  body.innerHTML = html;
}

function wizardBack(){
  if(currentWizardStep > 1){
    currentWizardStep--;
    renderWizardStep();
  }
}

function wizardNext(){
  if(currentWizardStep < 8){
    currentWizardStep++;
    renderWizardStep();
  } else {
    // Final Step: Publish Event
    const n = document.getElementById('w_name') ? document.getElementById('w_name').value.trim() : 'New XCESS Event';
    closeModal();
    audit('Event created via 8-step wizard: ' + n);
    toast(n + ' created & published — setup workspace ready');
    document.querySelector('[data-view="events"]').click();
  }
}

function createEvent(){
  openModal();
}

/* ================= XCESS DEMO LAYER (all data below is simulated in the browser) ================= */
const ZONES={'Gate 1':[10,28],'Gate 3':[10,70],'Main Stage':[48,30],'VIP':[76,22],'Medical Tent':[46,70],'Parking B':[82,72],'Sandton Drive':[28,90]};
const ROLES={
 organiser:{name:'John Doe',label:'Event Director',ini:'JD',mfa:false,views:'all'},
 command:{name:'Nomsa Dlamini',label:'JOC Commander',ini:'ND',mfa:true,views:['dashboard','access','security','traffic','joc','medical','map','audit']},
 safety:{name:'Pieter Naidoo',label:'Safety Officer',ini:'PN',mfa:true,views:['joc','medical','map','audit','security','traffic']},
 security:{name:'Johnson Mokoena',label:'Security Supervisor',ini:'JM',mfa:false,views:['security','map']},
 traffic:{name:'Lebo Khumalo',label:'Traffic Supervisor',ini:'LK',mfa:false,views:['traffic','map']}
};
const state={role:'organiser',online:true,pending:null,
 incidents:[{type:'Theft',zone:'Parking B',time:'19:04',status:'Open',tone:'red'},{type:'Crowd pressure',zone:'Main Stage',time:'19:17',status:'Monitoring',tone:'warn'},{type:'Medical',zone:'Gate 3',time:'18:21',status:'Resolved',tone:''}],
 medical:[{zone:'Gate 3',patient:'Adult male',stage:3,hospital:'Netcare Milpark'}],queue:[],audit:[],sitreps:[],
 closures:[{road:'Sandton Drive (north)',open:false},{road:'Rivonia Road slip',open:false},{road:'Main entrance access',open:true},{road:'Emergency route A',open:true}],
 files:[{n:'Risk assessment',ok:true},{n:'Emergency plan',ok:true},{n:'Security plan',ok:false},{n:'Traffic management plan',ok:false},{n:'Medical plan',ok:true},{n:'Evacuation plan',ok:false}],
 ip:'41.185.'+(20+Math.floor(Math.random()*200))+'.'+(2+Math.floor(Math.random()*250))};
const STAGES=['Call logged','Dispatched','On scene','Transferred','Closed'];
const now=()=>new Date().toLocaleTimeString('en-ZA',{hour:'2-digit',minute:'2-digit'});
const R=()=>ROLES[state.role];

function audit(action){state.audit.unshift({t:new Date().toLocaleTimeString('en-ZA'),user:R().name+' ('+R().label+')',ip:state.ip,dev:(/Mobi/.test(navigator.userAgent)?'Mobile':'Desktop')+' browser',action});renderAudit()}

/* ---- auth: login, RBAC, MFA for high-level roles ---- */
function showLogin(pre){document.getElementById('login').classList.add('show');document.getElementById('step1').style.display='';document.getElementById('step2').style.display='none';if(pre)document.getElementById('loginRole').value=pre}
function doLogin(){const r=document.getElementById('loginRole').value;state.pending=r;if(ROLES[r].mfa){document.getElementById('step1').style.display='none';document.getElementById('step2').style.display='';document.getElementById('mfaCode').value='';document.getElementById('mfaCode').focus()}else enter(r)}
function verifyMFA(){if(document.getElementById('mfaCode').value.trim()==='123456')enter(state.pending);else{state.role=state.pending;audit('Failed MFA attempt');toast('Incorrect code — try 123456')}}
function enter(r){state.role=r;const u=ROLES[r];document.getElementById('login').classList.remove('show');
 
 document.querySelectorAll('.mode button').forEach(b=>b.classList.toggle('active',(b.dataset.role==='command')===(r!=='organiser')));
 const allowed=u.views==='all'?null:u.views;
 nav.forEach(b=>b.style.display=(!allowed||allowed.includes(b.dataset.view))?'':'none');
 (allowed?document.querySelector('[data-view="'+allowed[0]+'"]'):document.querySelector('[data-view="dashboard"]')).click();
 audit('Signed in'+(u.mfa?' with MFA':''));toast('Welcome, '+u.name.split(' ')[0]+' — '+u.label);renderAll();
 clearTimeout(window.pushT);window.pushT=setTimeout(()=>{if(state.online)commit({type:'Congestion',zone:'Sandton Drive',time:now(),status:'Open',tone:'warn'},'Live push received from Traffic post')},14000)}

/* ---- incidents, offline queue & live sync ---- */
function openIncident(t){const z=document.getElementById('incZone');z.innerHTML=Object.keys(ZONES).map(k=>'<option>'+k+'</option>').join('');if(t)document.getElementById('incType').value=t;document.getElementById('incModal').classList.add('show')}
function submitIncident(){const type=document.getElementById('incType').value,zone=document.getElementById('incZone').value;closeIncidentModal();
 const inc={type,zone,time:now(),status:'Open',tone:type==='Emergency'||type==='Theft'?'red':type==='Medical'?'':'warn'};
 if(!state.online){state.queue.push(inc);audit('Incident saved offline: '+type+' @ '+zone);toast('No signal — saved on device, will sync');renderSync();return}
 commit(inc,'Incident logged')}
function commit(inc,verb){inc.fresh=true;state.incidents.unshift(inc);if(inc.type==='Medical')state.medical.unshift({zone:inc.zone,patient:'Unassigned',stage:0,hospital:'—'});audit(verb+': '+inc.type+' @ '+inc.zone);renderAll();toast(inc.type+' — '+inc.zone+' pushed to JOC screens')}
function toggleOnline(){state.online=!state.online;if(state.online&&state.queue.length){const n=state.queue.length;state.queue.splice(0).forEach(i=>commit(i,'Synced from offline queue'));toast('Back online — '+n+' queued report'+(n>1?'s':'')+' synced')}else toast(state.online?'Back online':'Offline mode — reports will be queued');audit(state.online?'Connection restored':'Connection lost');renderSync()}
function renderSync(){const b=document.getElementById('syncBtn');if(!b)return;b.classList.toggle('off',!state.online);b.textContent=state.online?'● Online':'○ Offline'+(state.queue.length?' · '+state.queue.length+' queued':'');document.getElementById('liveChip').style.opacity=state.online?1:.35}

/* ---- renderers ---- */
const feedHTML=l=>l.map(i=>'<div class="incident'+(i.fresh?' new':'')+'"><i class="dot '+i.tone+'"></i><div><b>'+i.type+'</b><div style="color:var(--muted);font-size:12px">'+i.zone+' • '+i.time+' • '+i.status+'</div></div></div>').join('');
function renderAll(){
 document.getElementById('secFeed').innerHTML=feedHTML(state.incidents.filter(i=>i.type!=='Medical').slice(0,6));
 document.getElementById('jocFeed').innerHTML=feedHTML(state.incidents.slice(0,7));
 const open=state.incidents.filter(i=>i.status!=='Resolved').length;document.getElementById('secOpen').textContent=state.incidents.filter(i=>i.type!=='Medical'&&i.status!=='Resolved').length;document.getElementById('jocActive').textContent=open;
 renderMedical();renderMap();renderClosures();renderFiles();renderSitreps();renderAudit();renderSync();
 state.incidents.forEach(i=>delete i.fresh)}
function renderMedical(){const m=state.medical;document.getElementById('medCalls').textContent=m.length;document.getElementById('medActive').textContent=m.filter(x=>x.stage<4).length;document.getElementById('medTransfers').textContent=m.filter(x=>x.stage>=3).length;
 document.getElementById('medRows').innerHTML=m.map((x,i)=>'<tr><td>'+x.zone+'</td><td>'+x.patient+'</td><td><span class="status'+(x.stage<2?' red':x.stage<4?' warn':'')+'">'+STAGES[x.stage]+'</span></td><td>'+x.hospital+'</td><td>'+(x.stage<4?'<button class="secondary" style="padding:7px 12px;font-size:12px" onclick="advance('+i+')">'+['Dispatch','Arrive','Transfer','Close'][x.stage]+'</button>':'')+'</td></tr>').join('')}
function advance(i){const x=state.medical[i];x.stage++;if(x.stage===3){x.hospital='Netcare Milpark';x.patient=x.patient==='Unassigned'?'Adult female':x.patient}if(x.stage===4){const inc=state.incidents.find(n=>n.type==='Medical'&&n.zone===x.zone&&n.status!=='Resolved');if(inc){inc.status='Resolved'}}audit('Medical call '+STAGES[x.stage]+' @ '+x.zone);renderAll()}
function renderMap(){const b=document.getElementById('mapBox');let s=Object.entries(ZONES).map(([k,p])=>'<span class="zone" style="left:'+p[0]+'%;top:'+(p[1]+7)+'%">'+k.toUpperCase()+'</span>').join('');
 const guards=[[16,24],[44,24],[80,16],[6,64],[86,66],[54,76]],med=[[46,64],[14,74]],traf=[[24,86],[34,92],[70,84]];
 s+=guards.map(p=>'<i class="pin g" style="left:'+p[0]+'%;top:'+p[1]+'%"></i>').join('')+med.map(p=>'<i class="pin b" style="left:'+p[0]+'%;top:'+p[1]+'%"></i>').join('')+traf.map(p=>'<i class="pin t" style="left:'+p[0]+'%;top:'+p[1]+'%"></i>').join('');
 const used={};state.incidents.filter(i=>i.status!=='Resolved').forEach(i=>{const p=ZONES[i.zone]||[50,50];const n=used[i.zone]=(used[i.zone]||0)+1;s+='<i class="pin '+(i.tone==='red'?'red':'w')+'" title="'+i.type+'" style="left:'+(p[0]+n*2.2)+'%;top:'+(p[1]-n*2.2)+'%"></i>'});b.innerHTML=s}
function renderClosures(){document.getElementById('closureList').innerHTML=state.closures.map((c,i)=>'<div class="rowbtn"><div>'+c.road+'<small>'+(c.open?'Open to traffic':'Closed — pointsmen deployed')+'</small></div><button class="secondary" onclick="flipRoad('+i+')">'+(c.open?'Close road':'Reopen')+'</button></div>').join('')}
function flipRoad(i){const c=state.closures[i];c.open=!c.open;audit((c.open?'Road reopened: ':'Road closed: ')+c.road);toast(c.road+(c.open?' reopened':' closed'));renderAll()}
function renderFiles(){document.getElementById('fileList').innerHTML=state.files.map((f,i)=>'<div class="rowbtn"><div>'+f.n+'<small>'+(f.ok?'Approved':'Awaiting approval')+'</small></div>'+(f.ok?'<span class="status">Approved</span>':'<button class="secondary" onclick="approve('+i+')">Approve</button>')+'</div>').join('')}
function approve(i){if(!['command','safety'].includes(state.role)){toast('Only a JOC Commander or Safety Officer can approve');audit('Denied: approval attempt on '+state.files[i].n);return}state.files[i].ok=true;audit('Master file approved: '+state.files[i].n);toast(state.files[i].n+' approved');renderAll()}
function makeSitrep(){const o=state.incidents.filter(i=>i.status!=='Resolved').length;state.sitreps.unshift({t:now(),txt:'Attendance 16,892 • '+o+' open incident'+(o===1?'':'s')+' • '+state.files.filter(f=>f.ok).length+'/'+state.files.length+' master files approved'});audit('Situation report generated');renderAll()}
function renderSitreps(){const el=document.getElementById('sitrepList');el.innerHTML=state.sitreps.length?state.sitreps.map(s=>'<div class="rowbtn"><div>SITREP '+s.t+'<small>'+s.txt+'</small></div></div>').join(''):'<p style="color:var(--muted);font-size:13px">No reports yet — press Generate.</p>'}
function renderAudit(){document.getElementById('auditRows').innerHTML=state.audit.slice(0,40).map(a=>'<tr><td>'+a.t+'</td><td>'+a.user+'</td><td>'+a.ip+'</td><td>'+a.dev+'</td><td>'+a.action+'</td></tr>').join('')||'<tr><td colspan="5" style="color:var(--muted)">No activity yet.</td></tr>'}

/* ---- ticketing / accreditation scan ---- */
let scanN=0;const SCANS=[['✓ ACCESS GRANTED — JOHN SMITH','General Admission • Gate 3',''],['✓ ACCESS GRANTED — VIP ACCREDITED','Artist hospitality • VIP gate','' ],['✕ ACCESS DENIED','Ticket already scanned at 17:12','color:#ff8089;background:#2b1216'],['⚠ WRONG ZONE','Ticket valid for General Admission only','color:var(--warn);background:#2a2310']];
function scan(){const s=SCANS[scanN++%SCANS.length],el=document.getElementById('scanOut');el.style.cssText=s[2];el.innerHTML=s[0]+'<br><small style="opacity:.75">'+s[1]+' • '+now()+'</small>';audit('Gate scan: '+s[0].replace(/^[^A-Z]+/,''))}

showLogin();renderAll();

function toggleMenu(){const app=document.querySelector('.app'),sc=document.getElementById('scrim');
 if(window.innerWidth>950)app.classList.toggle('collapsed');else{app.classList.toggle('open');sc.classList.toggle('show',app.classList.contains('open'))}}
(function(){const s=document.createElement('div');s.className='scrim';s.id='scrim';s.onclick=()=>{document.querySelector('.app').classList.remove('open');s.classList.remove('show')};document.body.appendChild(s);
 nav.forEach(b=>b.addEventListener('click',()=>{if(window.innerWidth<=950){document.querySelector('.app').classList.remove('open');s.classList.remove('show')}}))})();