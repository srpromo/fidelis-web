import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
const forbidden = [
 /\b[A-Z]+_(?:API|ACCESS)_(?:KEY|TOKEN)\b/,
 /sk-[a-zA-Z0-9_-]{8,}/,
 /\/(?:Users|home)\/[^/]+\//,
 /\.env(?:["'\s]|$)/,
 /BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/,
 /<(?:SEC-DOCUMENT|DOCUMENT)>/i,
 /(?:recognition[_-]pilot|sec_documents_batch)/i
];
async function scan(dir) {
 for (const entry of await readdir(dir,{withFileTypes:true})) {
  const path=join(dir,entry.name);
  if (entry.isDirectory()) { await scan(path); continue; }
  if (!/\.(html|js|css|svg)$/.test(path)) throw Error("Unexpected public asset: "+path);
  const text=await readFile(path,"utf8");
  if (forbidden.some(pattern=>pattern.test(text))) throw Error("Public-build audit failed: "+path);
 }
}
await scan("dist");
console.log("PASS: approved static assets only; no credential markers, private paths or research artifacts.");
