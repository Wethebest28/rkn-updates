// Signs items.json + patches.json into site/feed.json. Run by GitHub Actions on every merge to main.
// Local use: FEED_KEY="$(cat FEED_KEY.pem)" node tools/sign.mjs
import fs from 'fs';import crypto from 'crypto';
const key=process.env.FEED_KEY||'';if(!key.includes('PRIVATE KEY')){console.error('FEED_KEY secret missing');process.exit(1)}
const items=JSON.parse(fs.readFileSync('items.json','utf8'));const patches=JSON.parse(fs.readFileSync('patches.json','utf8'));
const CATS=['price','launch','handover','metro','infra','law','market','rkn'];const ids=new Set();const errs=[];
items.forEach((i,n)=>{const w=m=>errs.push(`item ${n} (${i.id||'?'}): ${m}`);
  if(!i.id||ids.has(i.id))w('missing or duplicate id');ids.add(i.id);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(i.date||''))w('date must be YYYY-MM-DD');
  if(!CATS.includes(i.cat))w('cat must be one of '+CATS.join(', '));
  if(!i.title||i.title.length>140)w('title missing or too long');
  if(!i.source||!/^https:\/\//.test(i.source.url||''))w('source.url must be an https link');
  if(i.impact&&!['positive','neutral','caution'].includes(i.impact))w('impact must be positive, neutral or caution')});
Object.entries(patches.dxb||{}).forEach(([k,u])=>{if(!k.includes('|'))errs.push('patch key must be "developerKey|Project name": '+k);if(!u.src||!/^https:\/\//.test(u.src))errs.push('patch needs src link: '+k)});
if(errs.length){console.error(errs.join('\n'));process.exit(1)}
const payload=JSON.stringify({v:1,seq:Math.floor(Date.now()/1000),issued:new Date().toISOString(),items,patches});
const sig=crypto.sign('sha256',Buffer.from(payload),{key,dsaEncoding:'ieee-p1363'}).toString('base64');
fs.mkdirSync('site',{recursive:true});fs.writeFileSync('site/feed.json',JSON.stringify({payload,sig}));
fs.writeFileSync('site/index.html','<!doctype html><title>RKN Suite updates</title><p>Signed update feed for RKN Suite. See feed.json.</p>');
console.log(`Signed ${items.length} items, ${Object.keys(patches.dxb||{}).length} patches`);
