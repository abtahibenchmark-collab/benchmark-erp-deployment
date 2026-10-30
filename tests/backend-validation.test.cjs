const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = readFileSync(require('node:path').join(__dirname,'../google-apps-script/Code.gs'),'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
function accepts(module,record) {context.validateERPRecord_(module,record);}
function rejects(module,record,pattern){assert.throws(()=>accepts(module,record),pattern);}
accepts('orders',{'Order Qty':100,'SMV':10});
rejects('orders',{'Order Qty':-1},/non-negative/);
rejects('orders',{'Order Qty':0},/greater than zero/);
rejects('orders',{'Order Qty':'not a number'},/non-negative/);
rejects('store',{'Style No':'ST-01','Color':'Navy','Buyer':'Buyer A','Order Month':'2026-10','Factory':'Benchmark Apparels','GRN Qty':10,'Issue Qty':11},/exceed/);
rejects('material',{'Style No':'ST-01','Color':'Navy','Buyer':'Buyer A','Order Month':'2026-10','Factory':'Benchmark Apparels','Received Qty':10,'Issued Qty':11},/exceed/);
accepts('material',{'Style No':'ST-01','Color':'Navy','Buyer':'Buyer A','Order Month':'2026-10','Factory':'Benchmark Apparels','Required Qty':100,'Ordered Qty':100,'Received Qty':50,'Issued Qty':25});
rejects('production',{'Sewing Output':10,'Finishing':11},/exceed/);
rejects('quality',{'Checked Qty':5,'Reject Qty':6,'Defect Qty':1},/exceed/);
rejects('quality',{'Checked Qty':0,'Defect Qty':0},/greater than zero/);
rejects('production',{'SMV':0,'Manpower':20,'Working Hours':8,'Sewing Output':200},/SMV must be greater than zero/);
accepts('shipment',{'Actual Shipment':0});
assert.equal(context.redactAudit_({Username:'test','Password Hash':'sensitive',token:'secret',Qty:20}).Qty,20);
assert.equal(context.redactAudit_({Username:'test','Password Hash':'sensitive',token:'secret',Qty:20})['Password Hash'],undefined);
assert.equal(context.safeCell_('=IMPORTXML(\"x\",\"y\")').startsWith("'"),true);
assert.equal(context.safeCell_(null),'');
assert.equal(context.productionEfficiency_({'Sewing Output':500,SMV:12,Manpower:25,'Working Hours':8,Target:800}),50);
assert.equal(context.productionEfficiency_({'Sewing Output':400,Target:800}),50);
rejects('material',{'Style No':'ST-01','Buyer':'Buyer A','Order Month':'2026-10','Factory':'Benchmark Apparels'},/Color is required/);
accepts('store',{'Style No':'ST-01','Color':'Navy','Buyer':'Buyer A','Order Month':'2026-10','Factory':'Benchmark Apparels','GRN Qty':10,'Issue Qty':4});
console.log('PASS: backend validation/redaction assertions including style-wise store/material fields.');
