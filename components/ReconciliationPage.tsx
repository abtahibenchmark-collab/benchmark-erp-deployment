'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Search, Scale, TriangleAlert, CheckCircle2, PackageCheck, Boxes, Lightbulb } from 'lucide-react';
import Sidebar from './Sidebar';

const fallback:any[]=[];
const fmt=(n:number)=>Number(n||0).toLocaleString();
const qty=(r:any,k:string)=>Number(r?.[k]||0);

export default function ReconciliationPage(){
  const router = useRouter();
  const [rows,setRows]=useState(fallback);
  const [connected,setConnected]=useState(false);
  const [q,setQ]=useState('');
  const [last,setLast]=useState(new Date().toISOString());
  async function refresh(){
    try{
      const r=await fetch('/api/erp?action=reconciliation',{cache:'no-store'});
      if(!r.ok) throw new Error('Unable to load reconciliation');
      const j=await r.json();
      if(j.connected&&Array.isArray(j.reconciliation)){setRows(j.reconciliation);setConnected(true);setLast(j.lastUpdated||new Date().toISOString());}
      else setConnected(false);
    }catch{setConnected(false)}
  }
  useEffect(()=>{
    try{if(!localStorage.getItem('erp_user')){router.replace('/login');return;}}
    catch{router.replace('/login');return;}
    void refresh();
    const id=setInterval(()=>void refresh(),30000);
    return()=>clearInterval(id);
  },[router]);
  const filtered=useMemo(()=>rows.filter((r:any)=>Object.values(r).join(' ').toLowerCase().includes(q.toLowerCase())),[rows,q]);
  const totals=useMemo(()=>filtered.reduce((a:any,r:any)=>{
    a.order+=qty(r,'orderQty');a.ship+=qty(r,'shipmentQty');a.balance+=Math.max(0,qty(r,'balance'));
    a.variance+=qty(r,'variance');a.storeBalance+=qty(r,'storeBalance');a.materialShortage+=qty(r,'materialShortage');
    a.materialRequired+=qty(r,'materialRequired');a.materialReceived+=qty(r,'materialReceived');
    a.storeReceived+=qty(r,'storeReceived');a.storeIssued+=qty(r,'storeIssued');
    return a;
  },{order:0,ship:0,balance:0,variance:0,storeBalance:0,materialShortage:0,materialRequired:0,materialReceived:0,storeReceived:0,storeIssued:0}),[filtered]);
  const shortageRows=filtered.filter((r:any)=>qty(r,'materialShortage')>0);
  const varianceRows=filtered.filter((r:any)=>qty(r,'variance')>0);
  const openRows=filtered.filter((r:any)=>qty(r,'balance')>0);
  const depletedStoreRows=filtered.filter((r:any)=>qty(r,'storeReceived')>0&&qty(r,'storeBalance')<=0);
  return <div className="tower-shell"><Sidebar connected={connected}/><main className="tower-content">
    <header className="page-header">
      <div><h1>Reconciliation Control</h1><p>Order → Material → Store → Cutting → Sewing → Finishing → FG → Shipment</p><small className="live-note">{connected?'LIVE • Google Sheets':'DEMO DATA • Connect Google Sheets'} · Updated {new Date(last).toLocaleTimeString()}</small></div>
      <div className="header-actions"><label className="search-box"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search buyer, style, color, month, PO..."/></label><button className="field-btn" onClick={()=>void refresh()}><RefreshCw size={16}/>Refresh</button></div>
    </header>
    <section className="recon-kpis">
      <ReconKpi title="Total Order Qty" value={fmt(totals.order)} tone="blue" note="pcs"/>
      <ReconKpi title="Shipment Qty" value={fmt(totals.ship)} tone="green" note="pcs"/>
      <ReconKpi title="Store Balance" value={fmt(totals.storeBalance)} tone="orange" note="units"/>
      <ReconKpi title="Material Shortage" value={fmt(totals.materialShortage)} tone="red" note="units"/>
    </section>
    <section className="panel recon-flow"><div className="panel-top"><div><h3><Scale size={16}/> End-to-End Reconciliation Flow</h3><p>Stock movement and process variance by buyer, style, factory and order month</p></div></div><div className="flow-strip">{['Order','Material Required','Material Received','Material Issued','Store Received','Store Issued','Cutting','Sewing','Finishing','FG/Packing','Shipment','Balance'].map((x,i)=><div className="flow-node" key={x}><b>{x}</b>{i<11&&<span>→</span>}</div>)}</div></section>
    <section className="panel recon-insights"><div className="panel-top"><div><h3><Lightbulb size={16}/> Operational Insights</h3><p>Rule-based action signals from current reconciliation records</p></div></div>
      <div className="recon-insight-grid">
        <article className={shortageRows.length?'insight-alert':'insight-ok'}><div><Boxes size={18}/><b>Material shortage</b></div><strong>{shortageRows.length} style group(s)</strong><p>{fmt(totals.materialShortage)} units short against required material quantity. Follow up with suppliers and material planning.</p></article>
        <article className={depletedStoreRows.length?'insight-alert':'insight-ok'}><div><PackageCheck size={18}/><b>Store stock</b></div><strong>{depletedStoreRows.length} depleted group(s)</strong><p>{fmt(totals.storeReceived)} units received and {fmt(totals.storeIssued)} units issued across the filtered records. Review balances before the next issue.</p></article>
        <article className={varianceRows.length?'insight-alert':'insight-ok'}><div><TriangleAlert size={18}/><b>Process variance</b></div><strong>{varianceRows.length} group(s) with variance</strong><p>{fmt(totals.variance)} units of cutting-to-finished-goods variance. Check WIP, rejection and transaction posting.</p></article>
        <article className={openRows.length?'insight-alert':'insight-ok'}><div><CheckCircle2 size={18}/><b>Shipment balance</b></div><strong>{openRows.length} open group(s)</strong><p>{fmt(totals.balance)} units remain unshipped. Compare shipment plan, finished goods and booking dates.</p></article>
      </div>
    </section>
    <section className="panel table-card"><div className="panel-top"><div><h3>Buyer / Style / Order Month Reconciliation</h3><p>Store and material quantities are grouped by style, buyer, factory and order month. Existing PO-linked records remain supported.</p></div></div>
      <div className="table-scroll recon-table"><table><thead><tr>
        <th>Buyer</th><th>Style No.</th><th>Color</th><th>PO(s)</th><th>Factory</th><th>Order Month</th><th>Order</th>
        <th>Material Required</th><th>Material Ordered</th><th>Material Received</th><th>Material Issued</th><th>Material Balance</th><th>Material Shortage</th>
        <th>Store Received</th><th>Store Issued</th><th>Store Balance</th><th>Cut</th><th>Sew</th><th>Finish</th><th>FG</th><th>Shipment</th><th>Balance</th><th>Variance</th><th>Status</th>
      </tr></thead><tbody>{filtered.map((r:any,i:number)=><tr key={`${r.factory}-${r.buyer}-${r.style}-${r.color}-${r.orderMonth}-${r.po}-${i}`}>
        <td>{r.buyer||'—'}</td><td>{r.style||'—'}</td><td>{r.color||'—'}</td><td><b>{r.po||'—'}</b></td><td>{r.factory||'—'}</td><td>{r.orderMonth||'—'}</td><td>{fmt(r.orderQty)}</td>
        <td>{fmt(r.materialRequired)}</td><td>{fmt(r.materialOrdered)}</td><td>{fmt(r.materialReceived)}</td><td>{fmt(r.materialIssued)}</td><td>{fmt(r.materialBalance)}</td><td className={qty(r,'materialShortage')>0?'bad':'good'}>{fmt(r.materialShortage)}</td>
        <td>{fmt(r.storeReceived)}</td><td>{fmt(r.storeIssued)}</td><td>{fmt(r.storeBalance)}</td><td>{fmt(r.cutQty)}</td><td>{fmt(r.sewQty)}</td><td>{fmt(r.finishQty)}</td><td>{fmt(r.fgQty)}</td><td>{fmt(r.shipmentQty)}</td><td><b>{fmt(r.balance)}</b></td><td className={qty(r,'variance')>0?'bad':'good'}>{fmt(r.variance)}</td>
        <td><span className={`status-pill ${String(r.status||'Attention').toLowerCase().replace(/\s+/g,'-')}`}>{r.status==='Complete'?<CheckCircle2 size={12}/>:<TriangleAlert size={12}/>} {r.status||'Attention'}</span></td>
      </tr>)}</tbody></table></div>
    </section>
  </main></div>;
}
function ReconKpi({title,value,tone,note}:{title:string,value:string,tone:string,note:string}){return <div className={`panel recon-kpi ${tone}`}><span>{title}</span><strong>{value}</strong><small>{note}</small></div>}
