(() => {
/* o Fórum agora tem página própria */
document.querySelectorAll("a[data-embreve]").forEach(a=>{ if(a.textContent.trim() === "Fórum"){ a.href = "#forum"; a.removeAttribute("data-embreve"); } });

/* Votar: reorganiza a seção (arte ao lado do título; sites e bônus lado a lado) */
(function arrumarVotar(){
  const sec = document.getElementById("votar"); if(!sec || sec.querySelector(".vt2-topo")) return;
  const q = c => sec.querySelector(c);
  const wrap = q(".wrap"), mold = q(".moldura"), bonus = q(".vt-bonus"), tit = q(".titulo"), lead = q(".lead"), sites = document.getElementById("sitesVoto"), como = q(".vt-como");
  if(!wrap || !mold || !bonus || !tit || !sites) return;
  document.head.insertAdjacentHTML("beforeend", `<style id="rf-votar2-css">
.votar .wrap.vt2{display:block}
.vt2-topo{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;margin-bottom:56px}
.vt2-topo .lead{margin-bottom:24px}
.vt2-passos{list-style:none;margin:0;padding:0;display:grid;gap:12px;counter-reset:vt}
.vt2-passos li{display:grid;grid-template-columns:30px 1fr;gap:12px;align-items:center;font-size:15px;color:var(--tinta-2);counter-increment:vt}
.vt2-passos li::before{content:counter(vt);width:30px;height:30px;display:grid;place-items:center;border-radius:9px;background:#F2B01E;color:#2A1A00;font:700 14px/1 var(--display)}
.vt2-grade{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:stretch}
.vt2-col{display:flex;flex-direction:column;gap:14px}
.vt2-col>h3{font:700 22px/1.15 var(--display);margin:0}
.vt2-col>p{margin:-8px 0 0;font-size:15px;color:var(--tinta-2)}
.vt2-col .sites{margin:0}
.vt2-col .sites li{padding:10px 12px 10px 14px}
.vt2-lado{gap:18px}
.vt2-lado .vt-bonus{flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:26px 28px}
.vt2-lado .vt-bonus h3{font-size:21px}
.vt2-lado .vt-escada{margin:10px 0 18px}
@media (max-width:980px){.vt2-topo,.vt2-grade{grid-template-columns:1fr;gap:28px}.vt2-topo .moldura{order:2}}
</style>`);
  const passos = como ? [...como.querySelectorAll("li")].map(li=>li.innerHTML) : [];
  const total = document.getElementById("vtTotal");
  wrap.classList.add("vt2"); wrap.textContent = "";
  const topo = document.createElement("div"); topo.className = "vt2-topo";
  const txt = document.createElement("div"); txt.append(tit, lead);
  if(passos.length){ const ol = document.createElement("ol"); ol.className = "vt2-passos"; ol.innerHTML = passos.map(p=>`<li><span>${p.replace("Vote nos sites acima", "Vote nos sites abaixo")}</span></li>`).join(""); txt.append(ol); }
  topo.append(mold, txt);
  const grade = document.createElement("div"); grade.className = "vt2-grade";
  const colSites = document.createElement("div"); colSites.className = "vt2-col";
  colSites.innerHTML = `<h3>Onde votar</h3><p>Um voto por dia em cada site. O botão abre a página de votação.</p>`; colSites.append(sites);
  const colBonus = document.createElement("div"); colBonus.className = "vt2-col vt2-lado vt-esq";
  colBonus.innerHTML = `<h3>O que você ganha</h3><p>Quanto mais sites você vota no dia, mais você ganha.</p>`;
  colBonus.append(bonus);
  grade.append(colSites, colBonus);
  wrap.append(topo, grade);
  q(".vt-esq:not(.vt2-lado)")?.remove();
})();
/* ============================================================
   CONFIGURAÇÃO DO SITE
   Edite o arquivo config.json (ao lado do index.html) e o site
   inteiro se atualiza: IP, versão do modpack, links e votação.
   Os valores abaixo só são usados se o config.json não carregar.
   ============================================================ */
let CONFIG = {
  servidor:{nome:"O Refúgio", ip:"atm10.rede-orefugio.com.br", maxJogadores:200},
  rankings:{url:"https://raw.githubusercontent.com/lucasgabrieldosanjos-creator/refugio-site/main/dados/rankings.json"},
  wiki:{base:"https://raw.githubusercontent.com/lucasgabrieldosanjos-creator/refugio-site/main/wiki/", editar:"https://github.com/lucasgabrieldosanjos-creator/refugio-site/edit/main/wiki/"},
  forum:{url:"https://raw.githubusercontent.com/lucasgabrieldosanjos-creator/refugio-site/main/dados/forum.json"},
  modpack:{nome:"All the Mods 10", sigla:"ATM10", versao:"8.5", minecraft:"1.21.1", loader:"NeoForge"},
  links:{forumDiscord:"", discord:"https://discord.gg/6SEqBJyVmr", ticket:"https://discord.gg/cM8F5sTetW", instagram:"https://www.instagram.com/rede_orefugio", tiktok:"#", youtube:"https://www.youtube.com/@CanalORefugio", loja:"#", sklauncher:"https://skmedix.pl/", curseforge:"https://www.curseforge.com/minecraft/modpacks/all-the-mods-10"},
  votacao:[{"nome": "Minecraft-MP", "url": "https://minecraft-mp.com/server/352179/vote/"}, {"nome": "ModdedMinecraftServers", "url": "https://moddedminecraftservers.com/server/o-refugio-atm10.60860/"}, {"nome": "TopG", "url": "https://topg.org/pt/servidores-minecraft/server-678031"}, {"nome": "MinecraftServers.org", "url": "https://minecraftservers.org/vote/681646"}, {"nome": "Minecraft.Buzz", "url": "https://minecraft.buzz/vote/18231"}, {"nome": "Minecraft-ServerList.com", "url": "https://minecraft-serverlist.com/server/3869/vote"}, {"nome": "CurseForge Servers", "url": "https://www.curseforge.com/servers/minecraft/game/o-refugio-atm10/vote"}]
};
let IP = CONFIG.servidor.ip;
const pegar = (obj, caminho) => caminho.split(".").reduce((o,k)=>o==null?o:o[k], obj);
/* membros online no Discord (contagem pública do convite) */
let discordContado = false;
function contarDiscord(){
  const el = document.querySelector(".rede.discord .online"); if(!el || discordContado) return;
  const cod = ((CONFIG.links.discord || "").match(/discord\.(?:gg|com\/invite)\/([\w-]+)/) || [])[1];
  if(!cod){ el.textContent = "Entre na comunidade"; return; }
  discordContado = true;
  fetch(`https://discord.com/api/v10/invites/${cod}?with_counts=true`).then(r=>r.ok ? r.json() : Promise.reject()).then(j=>{
    const on = j.approximate_presence_count, tot = j.approximate_member_count;
    el.textContent = on != null ? `${on.toLocaleString("pt-BR")} online agora · ${tot.toLocaleString("pt-BR")} membros` : "Entre na comunidade";
  }).catch(()=>{ el.textContent = "Entre na comunidade"; });
}
function aplicarConfig(){
  IP = CONFIG.servidor.ip;
  document.querySelectorAll("[data-cfg]").forEach(el=>{ const v = pegar(CONFIG, el.dataset.cfg); if(v != null) el.textContent = v; });
    document.querySelectorAll("[data-link]").forEach(a=>{ const v = CONFIG.links[a.dataset.link]; if(v) a.href = v; if(/^https?:/.test(a.getAttribute("href") || "")){ a.target = "_blank"; a.rel = "noopener"; } });
  contarDiscord();
  const sv = document.getElementById("sitesVoto");
  sv.innerHTML = CONFIG.votacao.map((v,k)=>`<li${v.aviso?' class="instavel"':""}><span class="vt-n">${k+1}</span><div><b>${v.nome}</b>${v.aviso?`<span class="vt-aviso">${v.aviso}</span>`:""}</div><a class="btn btn-tinta" href="${v.url}" target="_blank" rel="noopener" data-voto="${k}">Votar</a></li>`).join("");
  sv.querySelectorAll("[data-voto]").forEach(a=>a.addEventListener("click",()=>{ a.closest("li").classList.add("feito"); a.textContent = "Votado"; }));
  const tot = document.getElementById("vtTotal"); if(tot) tot.textContent = CONFIG.votacao.length;
  sv.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener("click",e=>{ e.preventDefault(); avisar("Link de votação ainda não configurado."); }));
}
Promise.resolve({ok:false}).then(r=>r.ok?r.json():null).then(c=>{ if(c){ CONFIG = {...CONFIG, ...c, servidor:{...CONFIG.servidor,...c.servidor}, modpack:{...CONFIG.modpack,...c.modpack}, links:{...CONFIG.links,...c.links}}; aplicarConfig(); } }).catch(()=>{});
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Ícones: texturas reais dos mods ---------- */
/* Redes: liga o Instagram mesmo com o tema antigo importado */
(function ligarRedes(){
  const url = CONFIG.links.instagram; if(!url || url === "#") return;
  document.querySelectorAll(".rede.embreve").forEach(div=>{
    if(!/Instagram/.test(div.textContent)) return;
    const a = document.createElement("a"); a.className = "rede"; a.href = url; a.target = "_blank"; a.rel = "noopener"; a.dataset.link = "instagram";
    a.innerHTML = div.innerHTML; a.querySelector(".rede-breve")?.remove();
    const sub = a.querySelector("div span"); if(sub) sub.textContent = "@rede_orefugio";
    div.replaceWith(a);
  });
  document.querySelectorAll(".rod-breve").forEach(sp=>{
    if(!/Instagram/.test(sp.textContent)) return;
    const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = "Instagram"; sp.replaceWith(a);
  });
  document.querySelectorAll('a[data-link="instagram"]').forEach(a=>{ a.href = url; a.target = "_blank"; a.rel = "noopener"; });
})();
const ico = nome => `<img class="ico px" src="https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/itens/${nome}.png" alt="" aria-hidden="true">`;
document.querySelectorAll("[data-ico]").forEach(el=>{ el.outerHTML = ico(el.dataset.ico); });

const REDES = {
  discord:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.6 5.6A16 16 0 0 0 15.6 4.4l-.5 1a14.7 14.7 0 0 0-6.2 0l-.5-1a16 16 0 0 0-4 1.2C1.9 9.4 1.2 13 1.5 16.6a16.2 16.2 0 0 0 4.9 2.5l1-1.6a10 10 0 0 1-1.6-.8l.4-.3a11.4 11.4 0 0 0 9.6 0l.4.3c-.5.3-1 .6-1.6.8l1 1.6a16.2 16.2 0 0 0 4.9-2.5c.4-4.2-.6-7.7-2.9-11zM8.7 14.4c-.9 0-1.7-.9-1.7-2s.7-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2zm6.6 0c-.9 0-1.7-.9-1.7-2s.7-2 1.7-2 1.7.9 1.7 2-.8 2-1.7 2z"/></svg>',
  instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="#C13584" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="#C13584" stroke="none"/></svg>',
  tiktok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h3c.2 1.9 1.6 3.4 3.5 3.6v3a7 7 0 0 1-3.5-1.1V15a6 6 0 1 1-6-6v3.1a3 3 0 1 0 3 3V3z" fill="#111"/></svg>',
  youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0033"/><path d="M10 9v6l5-3z" fill="#fff"/></svg>'
};
document.querySelectorAll("[data-svg]").forEach(el=>{ el.outerHTML = REDES[el.dataset.svg]; });

/* ---------- Navegação ---------- */
function visaoDe(h){ return h === "#equipe" ? "equipe" : h === "#rankup" ? "rankup" : (h === "#wiki" || h.startsWith("#wiki/")) ? "wiki" : h === "#forum" ? "forum" : h === "#vips" ? "loja" : (h === "#regras" || h.startsWith("#regra-")) ? "regras" : (h === "#guia-guildas" || h.startsWith("#gd-")) ? "guia" : "home"; }
const nav = document.getElementById("nav"), hero = document.getElementById("inicio"), heroImg = document.getElementById("heroImg");
const secoes = ["inicio","guildas","rankings","votar","wiki","loja"].map(id=>document.getElementById(id));
const linksNav = [...document.querySelectorAll("#links a")];
function aoRolar(){
  const y = scrollY;
  const vh = visaoDe(location.hash), loja = vh === "loja";
  nav.classList.toggle("solida", vh !== "home" ? y > 60 : y > hero.offsetHeight - 90);
  if(!reduz && y < hero.offsetHeight) heroImg.style.transform = `translateY(${y*0.2}px) scale(${1.02+y*0.0001})`;
  let atualSec = "inicio";
  for(const s of secoes){ if(s.getBoundingClientRect().top < innerHeight*0.35) atualSec = s.id; }
  if(loja) atualSec = "vips";
  if(vh === "regras") atualSec = "regras";
  if(vh === "guia") atualSec = "guildas";
  if(vh === "forum") atualSec = "forum";
  if(vh === "wiki") atualSec = "wiki";
  if(vh === "rankup") atualSec = "sobre";
  linksNav.forEach(a=>a.classList.toggle("ativo", a.getAttribute("href") === "#"+atualSec));
}
addEventListener("scroll", aoRolar, {passive:true}); aoRolar();
const menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click",()=>{ const a = nav.classList.toggle("aberta"); menuBtn.setAttribute("aria-expanded",a); });
linksNav.forEach(a=>a.addEventListener("click",()=>{ nav.classList.remove("aberta"); menuBtn.setAttribute("aria-expanded",false); }));

/* ---------- Toast e copiar IP ---------- */
const toast = document.getElementById("toast"); let tT;
function avisar(msg, ms=2200){ toast.textContent = msg; toast.classList.add("on"); clearTimeout(tT); tT = setTimeout(()=>toast.classList.remove("on"), ms); }
document.querySelectorAll(".ip-texto").forEach(e=>e.textContent = IP);
document.querySelectorAll("[data-copiar]").forEach(b=>b.addEventListener("click", async ()=>{
  try{ await navigator.clipboard.writeText(IP); avisar("IP copiado: " + IP); } catch(e){ avisar("Copie o IP: " + IP); }
}));
document.querySelectorAll("[data-jogar]").forEach(b=>b.addEventListener("click", async ()=>{
  const dica = `No ATM10 ${CONFIG.modpack.versao}, vá em Multijogador › Adicionar servidor e cole o IP.`;
  try{ await navigator.clipboard.writeText(IP); avisar("IP copiado! " + dica, 5000); } catch(e){ avisar("IP: " + IP + " · " + dica, 6000); }
}));
function ligarEmBreve(raiz){ raiz.querySelectorAll("[data-embreve]").forEach(a=>a.addEventListener("click",e=>{ e.preventDefault(); avisar("Essa página vem na próxima etapa."); })); }
ligarEmBreve(document);
aplicarConfig();

/* ---------- Partículas ---------- */
const cv = document.getElementById("particulas"), cx = cv.getContext("2d");
let P = [], W, H, rodando = true;
const CORES = ["#FFD24A","#FFB21E","#6FF3EC","#B79BFF","#FFFFFF"];
function medir(){ const d = Math.min(devicePixelRatio||1,2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W*d; cv.height = H*d; cx.setTransform(d,0,0,d,0,0);
  ESC = W > 900 ? 1.4 : 1;
  P = Array.from({length:Math.round(Math.min(W > 900 ? 170 : 70, W*H/(W > 900 ? 9000 : 7000)))},()=>nova(true)); }
let ESC = 1;
function nova(inicio){ const r = Math.random(); return {x:Math.random()*W, y:inicio?Math.random()*H:H+10, s:Math.round((r<.15?4:r<.5?3:2)*ESC), g:r<.15, v:(.15+Math.random()*.5)*ESC*.8, d:(Math.random()-.5)*.3, c:CORES[Math.random()*CORES.length|0], f:Math.random()*6.28, fv:.01+Math.random()*.03}; }
function quadro(){
  cx.clearRect(0,0,W,H);
  for(const p of P){
    if(!reduz){ p.y -= p.v; p.x += p.d + Math.sin(p.f)*.15; p.f += p.fv; if(p.y < -10) Object.assign(p, nova(false)); }
    cx.globalAlpha = (.35 + .65*Math.abs(Math.sin(p.f)))*Math.min(1, p.y/(H*.25));
    cx.fillStyle = p.c;
    if(p.g){ const a0 = cx.globalAlpha; cx.globalAlpha = a0*.18; cx.fillRect(Math.round(p.x-p.s), Math.round(p.y-p.s), p.s*3, p.s*3); cx.globalAlpha = a0; }
    cx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
  }
  cx.globalAlpha = 1;
  if(rodando && !reduz) requestAnimationFrame(quadro);
}
medir(); quadro(); addEventListener("resize", ()=>{ medir(); if(reduz) quadro(); });
new IntersectionObserver(([e])=>{ const r = rodando; rodando = e.isIntersecting; if(rodando && !r && !reduz) requestAnimationFrame(quadro); }).observe(hero);

/* ---------- Tooltip ---------- */
const tip = document.getElementById("tip");
function abrirTip(el, x, y){ tip.innerHTML = `<div class="t">${el.dataset.tipT}</div><div class="l">${el.dataset.tipL}</div><div class="m">${el.dataset.tipM}</div>`; tip.classList.add("on"); posTip(x,y); }
function posTip(x,y){ const w = tip.offsetWidth, h = tip.offsetHeight; let L = x+16, T = y-h-8; if(L+w > innerWidth-8) L = x-w-16; if(T < 8) T = y+20; tip.style.left = L+"px"; tip.style.top = T+"px"; }
function ligarTips(raiz){
  raiz.querySelectorAll("[data-tip-t]").forEach(el=>{
    el.addEventListener("mouseenter",e=>abrirTip(el,e.clientX,e.clientY));
    el.addEventListener("mousemove",e=>posTip(e.clientX,e.clientY));
    el.addEventListener("mouseleave",()=>tip.classList.remove("on"));
    el.addEventListener("focus",()=>{ const r = el.getBoundingClientRect(); abrirTip(el, r.left+r.width/2, r.top); });
    el.addEventListener("blur",()=>tip.classList.remove("on"));
  });
}

/* ---------- Pilares ---------- */
const PILARES = [
  {nome:"Tecnologia", item:"Gerador Solar", cor:"#F2B01E", frase:"Máquinas que trabalham enquanto você explora.",
   desc:"Comece com engrenagens e esteiras do Create, processe minério no Mekanism e monte um sistema ME que guarda e fabrica tudo sozinho.",
   mods:[["mekanism","Mekanism","Processamento de minério, energia e reatores."],["ae2","Applied Energistics 2","Armazenamento digital e autocrafting."],["create","Create","Máquinas mecânicas, esteiras e trens."],["powah","Powah","Geração de energia em larga escala."],["if","Industrial Foregoing","Fazendas e coleta automatizada."]]},
  {nome:"Magia", item:"Creative Spell Book", cor:"#3FD6CF", frase:"Poder que vem do estudo, não da energia.",
   desc:"Monte seus próprios feitiços com glifos, invoque espíritos para trabalhar na base e domine escolas de magia com grimórios e chefes próprios.",
   mods:[["ars","Ars Nouveau","Monte seus próprios feitiços com glifos."],["occultism","Occultism","Invoque espíritos para trabalhar por você."],["irons","Iron's Spells 'n Spellbooks","Grimórios, escolas de magia e chefes."],["forbidden","Forbidden & Arcanus","Rituais, relíquias e artefatos arcanos."],["apotheosis","Apotheosis","Encantamentos além do limite vanilla."]]},
  {nome:"Exploração", item:"Bússola", cor:"#A98BFF", frase:"Os melhores recursos estão longe de casa.",
   desc:"Dimensões inteiras, masmorras, chefes e os metais raros que levam até a ATM Star. Leve comida e um bom equipamento.",
   mods:[["twilight","Twilight Forest","Uma dimensão inteira de chefes e labirintos."],["atm_lingote","Allthemodium","Os metais raros e suas dimensões."],["aether","The Aether","A dimensão do céu, com ilhas e masmorras."],["cataclysm","L_Ender's Cataclysm","Chefes enormes em estruturas perigosas."],["waystones","Waystones","Pontos de teleporte entre suas descobertas."]]}
];
const painel = document.getElementById("painel"), tabs = [...document.querySelectorAll(".hotbar button")], artes = [...document.querySelectorAll(".painel-arte img")];
let atual = 0;
const panes = document.getElementById("panes");
panes.innerHTML = PILARES.map((c,k)=>`<div class="pane" style="--c:${c.cor}" ${k?'aria-hidden="true"':''}><h3>${c.nome}</h3><p class="frase">${c.frase}</p><p class="desc">${c.desc}</p><ul class="mods">${c.mods.map(([icone,n,d])=>`<li><button class="mod" data-tip-t="${n}" data-tip-l="${d}" data-tip-m="${n}"><span class="slot-mini">${ico(icone)}</span>${n}</button></li>`).join("")}</ul></div>`).join("");
ligarTips(panes);
const listaPanes = [...panes.children];
function mostrar(i, foco){
  atual = i; const c = PILARES[i];
  painel.style.setProperty("--cor", c.cor);
  hbNome.textContent = c.item;
  listaPanes.forEach((p,k)=>{ p.classList.toggle("on", k===i); p.setAttribute("aria-hidden", k!==i); p.querySelectorAll("button").forEach(b=>b.tabIndex = k===i?0:-1); });
  tabs.forEach((t,k)=>{ t.setAttribute("aria-selected", k===i); t.tabIndex = k===i?0:-1; });
  const antiga = artes.find(a=>a.classList.contains("on")), nova = artes[i];
  if(antiga !== nova){
    artes.forEach(a=>a.classList.remove("sai"));
    if(antiga){ antiga.classList.remove("on"); antiga.classList.add("sai"); clearTimeout(antiga._t); antiga._t = setTimeout(()=>antiga.classList.remove("sai"), 650); }
    nova.classList.remove("sai"); nova.classList.add("on");
  }
  if(foco) tabs[i].focus();
}
tabs.forEach((t,k)=>{ t.addEventListener("click",()=>mostrar(k)); t.addEventListener("keydown",e=>{ if(e.key==="ArrowRight"){mostrar((atual+1)%3,true);e.preventDefault()} if(e.key==="ArrowLeft"){mostrar((atual+2)%3,true);e.preventDefault()} }); });
addEventListener("keydown",e=>{
  if(e.target.matches("input,textarea")) return;
  if(["1","2","3"].includes(e.key)){ const r = painel.getBoundingClientRect(); if(r.top < innerHeight && r.bottom > 0) mostrar(+e.key-1); }
});
mostrar(0);

/* ---------- Abas genéricas ---------- */
function abas(grupo, aoTrocar){
  /* a lista de abas é lida na hora, então abas criadas depois (ex.: Rank-up) também funcionam */
  const bs = () => [...grupo.querySelectorAll("[role=tab]")];
  function sel(b, foco){ bs().forEach(x=>{ const on = x===b; x.setAttribute("aria-selected", on); x.tabIndex = on?0:-1; }); if(foco) b.focus(); aoTrocar(b); }
  grupo.addEventListener("click", e=>{ const b = e.target.closest("[role=tab]"); if(b && grupo.contains(b)) sel(b); });
  grupo.addEventListener("keydown", e=>{ const l = bs(), i = l.indexOf(e.target.closest("[role=tab]")); if(i < 0) return;
    if(e.key==="ArrowRight"){ sel(l[(i+1)%l.length], true); e.preventDefault(); }
    if(e.key==="ArrowLeft"){ sel(l[(i-1+l.length)%l.length], true); e.preventDefault(); } });
  return sel;
}

/* ---------- Rankings (exemplo) ---------- */
function cabeca(nome){
  let h = 0; for(const ch of nome) h = (h*31 + ch.charCodeAt(0))>>>0;
  const rnd = ()=>{ h = (h*1664525+1013904223)>>>0; return h/4294967296; };
  const peles = ["#F1C6A0","#D9A27A","#B07A55","#8A5A3C","#5E3B26"], cabelos = ["#2B1B10","#5A3A1E","#C9952E","#1F1F2A","#8E2F2F","#6E45D8","#18B5AF"], olhos = ["#3B5BDB","#2E7D32","#5D4037","#18B5AF","#7B52E6"];
  const pele = peles[rnd()*5|0], cab = cabelos[rnd()*7|0], olho = olhos[rnd()*5|0];
  const c = document.createElement("canvas"); c.width = 8; c.height = 8; c.className = "px"; const g = c.getContext("2d");
  g.fillStyle = pele; g.fillRect(0,0,8,8);
  g.fillStyle = cab; g.fillRect(0,0,8,2); g.fillRect(0,2,1,2+(rnd()*3|0)); g.fillRect(7,2,1,2+(rnd()*3|0)); if(rnd()<.5) g.fillRect(1,2,2,1);
  g.fillStyle = "#fff"; g.fillRect(1,4,2,1); g.fillRect(5,4,2,1);
  g.fillStyle = olho; g.fillRect(2,4,1,1); g.fillRect(5,4,1,1);
  g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(3,6,2,1);
  return c;
}
function iconeGuilda(n,c){ const s = document.createElement("span"); s.className = "gico"; s.style.background = c; s.textContent = n.split(" ").filter(w=>w.length>2).map(w=>w[0]).join("").slice(0,2); return s; }
const RK = {
  tempo:{sub:"horas no mês", dados:[["Lyra_Arcana","Ordem do Latão","182 h"],["TioReator","Núcleo ME","169 h"],["bia.explora","Cartógrafos","151 h"],["Miguelzin_","Raízes Antigas","138 h"],["kaio_ae2","Núcleo ME","124 h"],["Duda_Runas","Raízes Antigas","117 h"],["PedroForja","Ordem do Latão","109 h"]]},
  pvp:{sub:"abates", dados:[["kaio_ae2","Núcleo ME","214"],["Ravena_","Os Sem Mapa","198"],["TioReator","Núcleo ME","171"],["Lucca.exe","Cartógrafos","140"],["Lyra_Arcana","Ordem do Latão","133"],["Nanda_PvP","Os Sem Mapa","121"],["Miguelzin_","Raízes Antigas","98"]]},
  mobs:{sub:"mobs abatidos", dados:[["bia.explora","Cartógrafos","18.402"],["PedroForja","Ordem do Latão","16.977"],["Ravena_","Os Sem Mapa","15.310"],["Duda_Runas","Raízes Antigas","14.088"],["Lyra_Arcana","Ordem do Latão","12.645"],["Lucca.exe","Cartógrafos","11.920"],["TioReator","Núcleo ME","10.471"]]},
  guildas:{sub:"nível", guilda:true, dados:[["Ordem do Latão","14 membros","Nível 12","#B8862B"],["Raízes Antigas","9 membros","Nível 11","#18A39E"],["Núcleo ME","11 membros","Nível 9","#5A34C2"],["Cartógrafos","6 membros","Nível 8","#C0477A"],["Os Sem Mapa","4 membros","Nível 5","#4F4870"],["Guarda Rubra","7 membros","Nível 4","#B23A3A"],["Vapor & Cia","3 membros","Nível 3","#6B7A8C"]]}
};
const podio = document.getElementById("podio"), rkLista = document.getElementById("rkLista");
/* estilos dos rankings reais (ficam no script para mudar sem reimportar o tema) */
document.head.insertAdjacentHTML("beforeend", `<style id="rf-rk-css">
.pod img.cab3d{width:88px;height:94px;object-fit:contain;margin-bottom:10px;filter:drop-shadow(0 12px 14px rgba(0,0,0,.55));animation:rkFlutua 4s ease-in-out infinite}
.pod:nth-child(2) img.cab3d{width:116px;height:124px;animation-delay:-2s}
.pod:nth-child(3) img.cab3d{animation-delay:-1s}
@keyframes rkFlutua{50%{transform:translateY(-6px)}}
@media (prefers-reduced-motion:reduce){.pod img.cab3d{animation:none}}
.rk-lista img.cab{display:block;width:40px;height:40px;border-radius:6px;image-rendering:pixelated;background:#2a2150;box-shadow:0 2px 6px rgba(28,21,53,.18)}
.rk-c{display:none}
@media (max-width:760px){.rk-l{display:none}.rk-c{display:inline}.pod img.cab3d{width:62px;height:66px}.pod:nth-child(2) img.cab3d{width:80px;height:86px}#abasRk{display:flex;width:100%;overflow:visible}#abasRk button{flex:1 1 auto;padding-left:8px;padding-right:8px;font-size:13px;white-space:nowrap}}
</style>`);
const ROTULOS = {tempo:["Tempo jogado","Tempo"], rankup:["Rank-up","Rank-up"], pvp:["PvP","PvP"], mobs:["Mobs abatidos","Mobs"], guildas:["Guildas","Guildas"]};
function rotular(b){ const r = ROTULOS[b.dataset.rk]; if(r) b.innerHTML = `<span class="rk-l">${r[0]}</span><span class="rk-c">${r[1]}</span>`; }
document.querySelectorAll("#abasRk [data-rk]").forEach(rotular);
function avatar(r, g, noPodio){
  if(g) return iconeGuilda(r[0], r[3]);
  if(!RK.real) return cabeca(r[0]);
  const im = new Image(); im.alt = ""; im.loading = "lazy"; im.decoding = "async";
  im.className = noPodio ? "cab3d" : "cab";
  pedirCabeca(im, r[0], noPodio ? "3d" : "2d", noPodio ? 128 : 64);
  return im;
}
/* Cabeças de skin: mc-heads, depois Visage; o minotar fica por último porque às vezes devolve a skin padrão */
const CAB_VAZIO = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const CAB_PROMESSAS = new Map();
function fontesCabeca(nick, tipo, tam){
  const n = encodeURIComponent(nick);
  return tipo === "3d"
    ? [`https://mc-heads.net/head/${n}/${tam}`, `https://visage.surgeplay.com/head/${tam}/${n}`, `https://minotar.net/cube/${n}/${tam}`]
    : [`https://mc-heads.net/avatar/${n}/${tam}`, `https://visage.surgeplay.com/face/${tam}/${n}`, `https://minotar.net/helm/${n}/${tam}`];
}
function testarImagem(u){ return new Promise(res=>{ const t = new Image(); const to = setTimeout(()=>{ t.onload = t.onerror = null; res(false); }, 4000); t.onload = ()=>{ clearTimeout(to); res(t.naturalWidth > 0); }; t.onerror = ()=>{ clearTimeout(to); res(false); }; t.src = u; }); }
function pedirCabeca(img, nick, tipo, tam){
  const k = tipo + "|" + nick + "|" + tam;
  let p = CAB_PROMESSAS.get(k);
  if(!p){ p = (async()=>{ for(const u of fontesCabeca(nick, tipo, tam)) if(await testarImagem(u)) return u; return null; })(); CAB_PROMESSAS.set(k, p); }
  if(!img.getAttribute("src")) img.src = CAB_VAZIO;
  p.then(u=>{ img.src = u || cabeca(nick).toDataURL(); });
}
function ligarCabecas(raiz){ raiz.querySelectorAll("img[data-cab]").forEach(im=>{ if(im.dataset.cabFeito) return; im.dataset.cabFeito = "1"; pedirCabeca(im, im.dataset.cab, im.dataset.cabTipo || "2d", +(im.dataset.cabTam || 64)); }); }
const esc = t => String(t).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
function renderRk(tipo){
  const R = RK[tipo], d = R.dados;
  podio.innerHTML = ""; rkLista.innerHTML = "";
  if(d.length < 3){ podio.innerHTML = '<p style="margin:auto;padding:40px;color:rgba(255,255,255,.7)">Ainda não há dados suficientes.</p>'; }
  if(d.length >= 3) [1,0,2].forEach(i=>{ const r = d[i], el = document.createElement("div"); el.className = "pod";
    el.append(avatar(r, R.guilda, true)); el.insertAdjacentHTML("beforeend", `<div class="nm">${esc(r[0])}</div><div class="vl">${esc(r[2])}${R.guilda?"":" "+(tipo==="tempo"?"":R.sub)}</div><div class="base">${i+1}</div>`); podio.append(el); });
  d.slice(3, 7).forEach((r,k)=>{ const li = document.createElement("li");
    li.innerHTML = `<span class="pos">${k+4}</span><span></span><span class="nome">${esc(r[0])}<small>${esc(r[1])}</small></span><span class="val">${esc(r[2])}</span>`;
    li.children[1].replaceWith(avatar(r, R.guilda)); rkLista.append(li); });
  if(d.length <= 3){ const li = document.createElement("li"); li.className = "rk-vazio"; li.style.cssText = "display:block;border:0;padding:48px 24px;text-align:center;color:var(--tinta-2);font-size:15px;line-height:1.5";
    li.textContent = R.guilda ? "As próximas guildas aparecem aqui assim que forem fundadas. Que tal ser a próxima?" : "As próximas posições aparecem aqui conforme mais jogadores entram no ranking.";
    rkLista.append(li); }
}
const selRk = abas(document.getElementById("abasRk"), b=>renderRk(b.dataset.rk));
renderRk("tempo");
/* rankings reais: o servidor publica um rankings.json (ver dados/LEIA-ME.md no GitHub) */
/* top votantes (soma de todos os sites), dentro da seção Votar */
function mostrarVotantes(J){
  const lista = Array.isArray(J.votos) ? J.votos : (J.votos && J.votos.lista) || [];
  if(!lista.length) return;
  const periodo = (J.votos && J.votos.periodo) || J.votos_periodo || "deste mês";
  if(!document.getElementById("rf-votos-css")) document.head.insertAdjacentHTML("beforeend", `<style id="rf-votos-css">
.vt-top{padding:22px 24px;border-radius:18px;background:var(--cosmos);color:#fff}
.vt-top h3{font:700 19px/1.2 var(--display);margin:0 0 4px;color:#FFD36B}
.vt-top>p{margin:0 0 14px;font-size:14px;color:rgba(255,255,255,.7)}
.vt-top ol{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.vt-top li{display:grid;grid-template-columns:26px 34px 1fr auto;gap:12px;align-items:center;padding:8px 12px;border-radius:12px;background:rgba(255,255,255,.06)}
.vt-top li.p1{background:linear-gradient(90deg,rgba(255,201,58,.28),rgba(255,201,58,.06));box-shadow:inset 0 0 0 1px rgba(255,211,107,.45)}
.vt-top .pos{font:700 15px/1 var(--display);color:rgba(255,255,255,.6);text-align:center}
.vt-top li.p1 .pos{color:#FFD36B}
.vt-top img,.vt-top canvas{width:34px;height:34px;border-radius:6px;image-rendering:pixelated;background:#2a2150;display:block}
.vt-top .nm{font-weight:600;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vt-top .nm small{display:block;font-weight:500;font-size:12px;color:rgba(255,255,255,.55)}
.vt-top .qt{font:700 15px/1 var(--display);color:#FFD36B;white-space:nowrap}
.vt-top .qt span{font:500 12px var(--corpo);color:rgba(255,255,255,.6);margin-left:3px}
</style>`);
  let box = document.getElementById("vtTop");
  if(!box){ box = document.createElement("div"); box.className = "vt-top"; box.id = "vtTop"; const esq = document.querySelector(".vt-esq"); (esq || document.getElementById("votar")).append(box); }
  box.innerHTML = `<h3>Top votantes ${esc(periodo)}</h3><p>Soma dos votos em todos os sites.</p><ol></ol>`;
  const ol = box.querySelector("ol");
  lista.slice(0, 5).forEach((v, i)=>{
    const li = document.createElement("li"); if(i === 0) li.className = "p1";
    const n = +v.valor || 0;
    li.innerHTML = `<span class="pos">${i + 1}º</span><span></span><span class="nm">${esc(v.nome)}${v.guilda ? `<small>${esc(v.guilda)}</small>` : ""}</span><span class="qt">${n.toLocaleString("pt-BR")}<span>${n === 1 ? "voto" : "votos"}</span></span>`;
    li.children[1].replaceWith(avatar([v.nome], false, false)); ol.append(li);
  });
}
const fmt = v => typeof v === "number" ? v.toLocaleString("pt-BR") : String(v);
function haQuanto(iso){ const m = Math.round((Date.now() - new Date(iso)) / 60000); if(!(m >= 0)) return ""; if(m < 2) return "agora mesmo"; if(m < 60) return `há ${m} min`; const h = Math.round(m/60); return h < 24 ? `há ${h} h` : `há ${Math.round(h/24)} dias`; }
fetch(CONFIG.rankings && CONFIG.rankings.url, {cache:"no-store"}).then(r=>r.ok ? r.json() : Promise.reject()).then(J=>{
  const jog = (lista, un) => (lista||[]).map(x=>[x.nome, x.guilda || "Sem guilda", un ? `${fmt(x.valor)} ${un}` : fmt(x.valor)]);
  if(J.tempo) RK.tempo.dados = jog(J.tempo, "h");
  if(J.pvp) RK.pvp.dados = jog(J.pvp);
  if(J.mobs) RK.mobs.dados = jog(J.mobs);
  if(Array.isArray(J.rankup) && J.rankup.length){
    RK.rankup = {sub:"", dados: J.rankup.map(x=>[x.nome, x.guilda || "Sem guilda", x.rank ? String(x.rank) : `Rank ${fmt(x.nivel)}`])};
    if(!document.querySelector("#abasRk [data-rk=rankup]")){
      const b = document.createElement("button"); b.setAttribute("role","tab"); b.setAttribute("aria-selected","false"); b.tabIndex = -1; b.dataset.rk = "rankup"; rotular(b);
      document.querySelector("#abasRk [data-rk=tempo]").after(b);
    }
  }
  if(J.guildas) RK.guildas.dados = J.guildas.map(g=>[g.nome, `${g.membros} ${g.membros === 1 ? "membro" : "membros"}`, `Nível ${g.nivel}`, g.cor || "#5A34C2"]);
  RK.real = true;
  mostrarVotantes(J);
  const aberta = document.querySelector("#abasRk [aria-selected=true]"); renderRk(aberta ? aberta.dataset.rk : "tempo");
  const nota = document.querySelector(".rk-rodape > span");
  if(nota) nota.textContent = J.atualizado ? `Dados do servidor, atualizados ${haQuanto(J.atualizado)}.` : "Dados do servidor.";
}).catch(()=>{});
document.querySelectorAll("[data-aba=guildas]").forEach(a=>a.addEventListener("click",()=>selRk(document.querySelector('[data-rk=guildas]'))));

/* ---------- Tutorial ---------- */
abas(document.getElementById("abasTut"), b=>{ document.querySelectorAll(".tut").forEach(t=>t.classList.toggle("on", t.id === "tut-"+b.dataset.tut)); });
const zoom = document.getElementById("zoom");
document.querySelectorAll("[data-zoom]").forEach(b=>b.addEventListener("click",()=>{ zoom.querySelector("img").src = b.dataset.zoom; try{ zoom.showModal(); }catch(e){} }));
zoom.addEventListener("click",()=>zoom.close());

/* ---------- Wiki ---------- */
const GUIAS = [
  ["Primeiros passos no ATM10","O que fazer na primeira hora de jogo","#F2B01E"],
  ["Regras do servidor","O que pode e o que dá ban","#4F4870"],
  ["Guia das guildas","Fundação, cidade, evolução e Colossos","#7B52E6"],
  ["Proteger sua base","Claims de chunk e convidar amigos","#18B5AF"],
  ["Mekanism do zero","Duplicar, triplicar e quintuplicar minérios","#F2B01E"],
  ["Começando no Ars Nouveau","Fonte de magia e primeiros glifos","#18B5AF"],
  ["Sistema ME sem dor de cabeça","Canais, controladores e autocrafting","#F2B01E"],
  ["Achando Allthemodium","Onde procurar e o que levar","#7B52E6"],
  ["Comandos do servidor","Home, warp, guilda, tpa e mais","#4F4870"],
  ["Caminho até a ATM Star","Checklist do endgame","#7B52E6"]
];
const lista = document.getElementById("guias"), vazio = document.getElementById("vazio");
/* a lista é trocada pelo índice da wiki (wiki/indice.json no GitHub) assim que ele carrega */
const LINK_GUIA = {"Regras do servidor":"#regras","Guia das guildas":"#guia-guildas"};
lista.innerHTML = GUIAS.map(([t,d,c])=>`<li><a href="${LINK_GUIA[t]||"#"}" ${LINK_GUIA[t]?"":"data-embreve"}><span class="tag" style="background:${c}"></span><span class="gt">${t}</span><span class="gd">${d}</span></a></li>`).join("");
ligarEmBreve(lista);
const norm = s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
document.getElementById("buscaWiki").addEventListener("input",e=>{
  const q = norm(e.target.value.trim()); let n = 0;
  [...lista.children].forEach(li=>{ const ok = !q || norm(li.textContent).includes(q); li.hidden = !ok; if(ok) n++; });
  vazio.style.display = n ? "none" : "block";
});

/* ---------- Baú da loja (exemplo) ---------- */
const ITENS = {1:["atm_star","Título Estelar","Cosmético de nome no chat",""],4:["coroa","Coroa de apoiador","Tag especial no chat",""],10:["cristal","Rastro mágico","Partículas ao andar","3"],13:["tempo","Apoiador mensal","Benefícios por 30 dias",""],16:["moeda","Cash","Moeda da loja","64"],20:["waystones","Pacote de warps","Warps pessoais extras","2"],24:["cartao","Chunks extras","Mais chunks para proteger","16"]};
const bauEl = document.getElementById("bau");
bauEl.innerHTML = Array.from({length:27},(_,i)=>{ const it = ITENS[i]; return it
  ? `<button class="s" data-tip-t="${it[1]}" data-tip-l="${it[2]}" data-tip-m="Loja do Refúgio" aria-label="${it[1]}: ${it[2]}">${ico(it[0])}${it[3]?`<span class="q">${it[3]}</span>`:""}</button>`
  : `<span class="s" aria-hidden="true"></span>`; }).join("");
ligarTips(bauEl);



const KIT_IMG = {};
const KITS = window.RF_KITS;
/* ================= LOJA ================= */
const kitSrc = arq => KIT_IMG[arq] || ("https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/kit/"+arq+".png");
const LOJA_URL = "/package/";
const MC = {"0":"#000000","1":"#0000AA","2":"#00AA00","3":"#00AAAA","4":"#AA0000","5":"#AA00AA","6":"#FFAA00","7":"#AAAAAA","8":"#555555","9":"#5555FF","a":"#55FF55","b":"#55FFFF","c":"#FF5555","d":"#FF55FF","e":"#FFFF55","f":"#FFFFFF"};
function mcTag(partes){ return `<span class="mctag"><span style="color:${MC[7]}">[</span>${partes.map(([c,t])=>`<span style="color:${MC[c]}">${t}</span>`).join("&nbsp;")}<span style="color:${MC[7]}">]</span></span>`; }
const SEMANAIS = n => Array.from({length:n},(_,i)=>"semanal"+(i+1));
const DIARIOS = n => ["diario_forjador","diario_arquiteto","diario_cientista","diario_arconte","diario_major"].slice(0,n);
const MAJOR = {id:"major", nome:"ATM Major", tag:[["6","ATM"],["e","MAJOR"]], cor:"#FFAA00", img:"major-v2", preco:"R$ 600,00", dias:80, topo:true};
const TRILHAS = {
  tech:{nome:"Tech", ranks:[
    {id:"forjador", nome:"Forjador", tag:[["3","FORJADOR"]], cor:"#00AAAA", img:"forjador-v2", preco:"R$ 30,00", dias:30, url:"vip-tecnico", kits:["tech2",...DIARIOS(1),...SEMANAIS(1)]},
    {id:"arquiteto", nome:"Arquiteto", tag:[["9","ARQUITETO"]], cor:"#5555FF", img:"arquiteto-v2", preco:"R$ 55,00", dias:31, url:"vip-arquiteto-(31d)", kits:["tech3",...DIARIOS(2),...SEMANAIS(2)]},
    {id:"cientista", nome:"Cientista", tag:[["d","CIENTISTA"]], cor:"#FF55FF", img:"cientista-v2", preco:"R$ 89,00", dias:32, url:"vip-cientista(32d)", kits:["tech4",...DIARIOS(3),...SEMANAIS(3)]},
    {id:"arconte", nome:"Arconte", tag:[["e","ARCONTE"]], cor:"#FFFF55", img:"arconte-v2", preco:"R$ 200,00", dias:40, url:"vip-mestre(40d)", kits:["tech5",...DIARIOS(4),...SEMANAIS(4)]},
    {...MAJOR, dias:100, url:"atm-major-(80d)", kits:["tech6",...DIARIOS(5),...SEMANAIS(4)]}
  ]},
  magic:{nome:"Magic & Exploration", ranks:[
    {id:"peregrino", nome:"Peregrino", tag:[["3","PEREGRINO"]], cor:"#00AAAA", img:"peregrino-v2", preco:"R$ 30,00", dias:30, url:"vip-acolito-(30d)", kits:["magic1",...DIARIOS(1),...SEMANAIS(1)]},
    {id:"runista", nome:"Runista", tag:[["9","RUNISTA"]], cor:"#5555FF", img:"runista-v2", preco:"R$ 55,00", dias:31, url:"vip-runista-(31d)", kits:["magic2",...DIARIOS(2),...SEMANAIS(2)]},
    {id:"arcanista", nome:"Arcanista", tag:[["d","ARCANISTA"]], cor:"#FF55FF", img:"arcanista-v2", preco:"R$ 89,00", dias:32, url:"XXIW1In9NH", kits:["magic3",...DIARIOS(3),...SEMANAIS(3)]},
    {id:"ascendente", nome:"Ascendente", tag:[["e","ASCENDENTE"]], cor:"#FFFF55", img:"ascendente-v2", preco:"R$ 200,00", dias:40, url:"vip-ascendente(40d)", kits:["magic4",...DIARIOS(4),...SEMANAIS(4)]},
    {...MAJOR, url:"IVm8DiTlZe", kits:["tech6",...DIARIOS(5),...SEMANAIS(3)]}
  ]}
};
/* Benefícios: CentralCart + LuckPerms (permissões efetivas, com herança).
   Valor: true / false / texto, ou {tech:[...], magic:[...]} quando as trilhas diferem. */
const T=true, F=false;
const BENEFICIOS = [
  {g:"Chat e comunidade", linhas:[
    ["Tag no chat", "tag"],
    ["Tag VIP e chat do servidor no Discord", [T,T,T,T,T]],
    ["Mensagens com cor, formatação e links", [T,T,T,T,T]],
    ["/cor e /definir (cor do nick e do chat)", [T,T,T,T,T]],
    ["/cor2 com cores novas e exclusivas", [F,F,T,T,T]],
    ["/nick: trocar o nick e a cor do nick", [F,F,F,T,T]],
    ["Chat em RGB e texto mágico", [F,F,F,T,T]],
    ["Sala escritório no Discord", [F,F,F,F,T]]
  ]},
  {g:"Economia", linhas:[
    ["Moedas ao ativar", ["10 mil","20 mil","30 mil","100 mil","300 mil"]],
    ["Cash ao ativar", [F,F,F,F,"150"]],
    ["Bônus na venda de fluidos", ["Nível 2","Nível 3","Nível 3","Nível 4","Nível 6"], "fluidos"],
    ["Venda de fluidos em massa", [T,T,T,T,T]],
    ["Desconto para criar guilda", [F,F,"25%","50%","Grátis (100%)"]],
    ["Salário a cada 30 min (sem VIP: 500)", ["20 mil","30 mil","40 mil","50 mil","60 mil"]],
    ["Lojas próprias: criar, anunciar e definir o spawn", [T,T,T,T,T]],
    ["Placas de compra, venda e troca", [T,T,T,T,T]]
  ]},
  {g:"Kits", linhas:[
    ["Kit de ativação", [T,T,T,T,"Todas as 14 shulkers"]],
    ["Kits diários", ["1","2","3","4","5 (todos)"]],
    ["Kits semanais", {tech:["VIP1","VIP1 e 2","VIP1 a 3","VIP1 a 4","VIP1 a 4"], magic:["VIP1","VIP1 e 2","VIP1 a 3","VIP1 a 4","VIP1 a 3"]}]
  ]},
  {g:"Mundo e terreno", linhas:[
    ["Homes", ["10","15","15","30","50"]],
    ["Quarrys na dimensão Mining", ["2","3","4","5","6"]],
    ["Claim-chunks", ["24 temporárias","48 temporárias","72 permanentes","112 permanentes","160 permanentes"]],
    ["Chunk loaders", [F,F,"1 temporário","2 temporários","3 permanentes"]]
  ]},
  {g:"Comandos", linhas:[
    ["Teleporte instantâneo, sem cooldown, e /back", [T,T,T,T,T]],
    ["/hat, /compass, /depth, /luz e /phantom", [T,T,T,T,T]],
    ["/disposal (lixeira)", [T,T,T,T,T]],
    ["/enderchest, /near e /workbench", [F,T,T,T,T]],
    ["/anvil, /itemname, /repair e /feed", [F,F,F,T,T]],
    ["/fly", {tech:[F,F,T,T,T], magic:[F,F,F,T,T]}],
    ["/repair da armadura inteira", [F,F,F,F,T]],
    ["/loom, /stonecutter, /grindstone e /smithingtable", [F,F,F,F,T]]
  ]},
  {g:"Itens liberados", linhas:[
    ["Building Gadgets", [F,T,T,T,T]],
    ["Schematicannon e Time Wand", [F,F,F,F,T]]
  ]},
  {g:"Conforto", linhas:[
    ["Entrar com o servidor cheio", [T,T,T,T,T]],
    ["Kick por ficar AFK", ["Depois de 1 hora","Nunca","Nunca","Nunca","Nunca"]],
    ["Posição de destaque na lista de jogadores (TAB)", [T,T,T,T,T]]
  ]}
];
const ESP = {
  "Tag VIP e chat do servidor no Discord":[T,"Cargo de Comerciante"], "Mensagens com cor, formatação e links":[T,F], "/cor e /definir (cor do nick e do chat)":[T,T], "/cor2 com cores novas e exclusivas":[T,F], "/nick: trocar o nick e a cor do nick":[T,F],
  "Chat em RGB e texto mágico":[F,F], "Sala escritório no Discord":[F,F], "Moedas ao ativar":["50 mil","5 mil"], "Cash ao ativar":[F,F],
  "Bônus na venda de fluidos":["Nível 5","Nível 1"], "Venda de fluidos em massa":[T,T], "Desconto para criar guilda":[F,F], "Salário a cada 30 min (sem VIP: 500)":["40 mil","2 mil"],
  "Lojas próprias: criar, anunciar e definir o spawn":[T,T], "Placas de compra, venda e troca":[T,T],
  "Kit de ativação":["Kit do Construtor",F], "Kits diários":["3",F], "Kits semanais":["VIP1 a 3",F],
  "Homes":["15",F], "Quarrys na dimensão Mining":["3",F], "Claim-chunks":["60 permanentes","5 temporárias"], "Chunk loaders":["1 temporário",F],
  "Teleporte instantâneo, sem cooldown, e /back":[T,F], "/hat, /compass, /depth, /luz e /phantom":[T,F], "/disposal (lixeira)":[T,T],
  "/enderchest, /near e /workbench":[T,F], "/anvil, /itemname, /repair e /feed":[F,F], "/fly":[T,F], "/repair da armadura inteira":[F,F],
  "/loom, /stonecutter, /grindstone e /smithingtable":[F,F], "Building Gadgets":[T,F], "Schematicannon e Time Wand":[T,F],
  "Entrar com o servidor cheio":[T,T], "Kick por ficar AFK":["Nunca","Nunca"], "Posição de destaque na lista de jogadores (TAB)":[T,T]
};
const valorDe = (vals, i, nome) => vals === "tag" ? "tag" : trilha === "especiais" ? (ESP[nome] || [F,F])[i] : Array.isArray(vals) ? vals[i] : vals[trilha][i];
const SIM = '<svg class="ck" viewBox="0 0 24 24" aria-label="Sim"><circle cx="12" cy="12" r="11" fill="#2FA84F"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const NAO = '<svg class="ck" viewBox="0 0 24 24" aria-label="Não"><circle cx="12" cy="12" r="10" fill="none" stroke="#B9B3CC" stroke-width="1.8"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#B9B3CC" stroke-width="1.8" stroke-linecap="round"/></svg>';
const valorHTML = (v, r) => v === "tag" ? (r.tag ? mcTag(r.tag) : `<span class="vl">${r.tagTexto}</span>`) : v === true ? SIM : v === false ? NAO : `<span class="vl">${v}</span>`;
const linkCompra = r => LOJA_URL + encodeURI(r.url);
TRILHAS.tech.lead = TRILHAS.magic.lead = "Duas trilhas com os mesmos benefícios. O que muda é o kit de ativação: máquinas e tecnologia, ou magia e exploração.";
TRILHAS.especiais = {nome:"Classes especiais", lead:"Classes com benefícios próprios, fora da escada de VIPs. O Construtor fica entre o Cientista e o Arconte.", ranks:[
  {id:"construtor", nome:"Construtor", tag:[["6","CONSTRUTOR"]], cor:"#FFAA00", img:"construtor-v2", preco:"R$ 150,00", dias:40, url:"vip-construtor(40d)", kits:["vipconstrutor",...DIARIOS(3),...SEMANAIS(3)]},
  {id:"comerciante", nome:"Comerciante", tag:null, tagTexto:"Badge de Comerciante", cor:"#C98E2E", img:"comerciante-v2", preco:"R$ 15,00", dias:30, url:"comerciante-(30d)", kits:[]}
]};
let trilha = "tech";
const NIVEL = {forjador:1,peregrino:1,arquiteto:2,runista:2,cientista:3,arcanista:3,construtor:3.5,arconte:4,ascendente:4,major:5};
const NOME_TRILHA = {tech:"Tech", magic:"Magic", especiais:"Classe especial"};
const colsDe = t => TRILHAS[t].ranks.filter(r=>r.id!=="comerciante").map((r,i)=>({r, t, i}));
function valorCol(nome, vals, c){
  if(vals === "tag") return "tag";
  if(c.t === "especiais") return (ESP[nome] || [F,F])[c.i];
  return Array.isArray(vals) ? vals[c.i] : vals[c.t][c.i];
}
const tem = v => v !== false && v != null;
/* Linhas em ordem de progressão: primeiro o que todos têm, depois o que aparece mais cedo na escada. */
function ordenar(linhas, cols){
  return linhas.map((l,k)=>{
    if(l[1] === "tag") return {l, k, idx:-1};
    const idx = cols.findIndex(c=>tem(valorCol(l[0], l[1], c)));
    return {l, k, idx: idx < 0 ? 99 : idx};
  }).sort((a,b)=>a.idx-b.idx || a.k-b.k).map(x=>x.l);
}
function tabelaHTML(cols, mostrarTrilha){
  const n = cols.length;
  const cab = `<thead><tr><th class="canto"><span class="sr">Benefício</span></th>${cols.map(c=>`<th scope="col"${c.r.topo?' class="topo"':""}><img src="https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/ranks/${c.r.img}.webp" alt=""><b>${c.r.nome}</b>${mostrarTrilha?`<em>${NOME_TRILHA[c.t]}</em>`:""}<span>${c.r.preco}</span></th>`).join("")}</tr></thead>`;
  const corpo = BENEFICIOS.map(b=>`<tbody><tr class="grupo"><th colspan="${n+1}" scope="colgroup">${b.g}</th></tr>${ordenar(b.linhas, cols).map(([nome,vals])=>`<tr><th scope="row">${nome}</th>${cols.map(c=>`<td${c.r.topo?' class="topo"':""}>${valorHTML(valorCol(nome, vals, c), c.r)}</td>`).join("")}</tr>`).join("")}</tbody>`).join("");
  const pe = `<tfoot><tr><th></th>${cols.map(c=>`<td${c.r.topo?' class="topo"':""}><a class="btn btn-ouro" href="${linkCompra(c.r)}" target="_blank" rel="noopener">Comprar</a></td>`).join("")}</tr></tfoot>`;
  return cab + corpo + pe;
}
let colsAtuais = [];
function renderTrilha(){
  const R = TRILHAS[trilha].ranks;
  document.getElementById("trilhaLead").textContent = TRILHAS[trilha].lead;
  document.getElementById("ranks").innerHTML = R.map(r=>`<article class="rank${r.topo?" topo":""}" style="--rc:${r.cor}">
    <img src="https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/ranks/${r.img}.webp" alt="Brasão do VIP ${r.nome}" loading="lazy">
    <div class="rank-corpo">
      <h3>${r.nome}</h3>
      <div class="dur">${r.dias} dias</div>
      <div class="preco">${r.preco}</div>
      <div class="rank-acoes"><a class="btn btn-ouro" href="${linkCompra(r)}" target="_blank" rel="noopener">Comprar</a>${r.kits.length?`<button class="btn btn-claro" data-vip="${r.id}">Ver itens</button>`:""}</div>
    </div></article>`).join("");
  /* Classes especiais: o Construtor é comparado com os vizinhos da escada */
  colsAtuais = trilha === "especiais"
    ? [{r:TRILHAS.tech.ranks[2], t:"tech", i:2}, {r:{...TRILHAS.especiais.ranks[0], topo:true}, t:"especiais", i:0}, {r:TRILHAS.tech.ranks[3], t:"tech", i:3}]
    : colsDe(trilha);
  document.getElementById("cmpTit").textContent = trilha === "especiais" ? "Construtor entre o Cientista e o Arconte" : "Compare os benefícios";
  document.getElementById("cmp").innerHTML = tabelaHTML(colsAtuais, false);
  const chips = document.getElementById("mobChips");
  const ini = trilha === "especiais" ? 1 : colsAtuais.length-1;
  chips.innerHTML = colsAtuais.map((c,i)=>`<button role="tab" aria-selected="${i===ini}" data-mi="${i}" ${i===ini?"":'tabindex="-1"'}>${c.r.nome}</button>`).join("");
  renderMob(ini);
  const sel = chips.querySelector("[aria-selected=true]"); if(sel) chips.scrollLeft = sel.offsetLeft;
}
function renderMob(i){
  const c = colsAtuais[i], r = c.r;
  document.querySelectorAll("#mobChips button").forEach((b,k)=>{ b.setAttribute("aria-selected", k===i); b.tabIndex = k===i?0:-1; });
  document.getElementById("mobLista").innerHTML = `<div class="mob-cab"><img src="https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/ranks/${r.img}.webp" alt=""><div><b>${r.nome}</b><span>${r.preco} · ${r.dias} dias</span></div></div>` +
    BENEFICIOS.map(b=>`<h4>${b.g}</h4><dl>${ordenar(b.linhas, colsAtuais).map(([nome,vals])=>`<div><dt>${nome}</dt><dd>${valorHTML(valorCol(nome, vals, c), r)}</dd></div>`).join("")}</dl>`).join("") +
    `<a class="btn btn-ouro" style="width:100%;margin-top:18px" href="${linkCompra(r)}" target="_blank" rel="noopener">Comprar ${r.nome}</a>`;
}
document.getElementById("mobChips").addEventListener("click",e=>{ const b = e.target.closest("[data-mi]"); if(b) renderMob(+b.dataset.mi); });
abas(document.getElementById("trilhas"), b=>{ trilha = b.dataset.trilha; renderTrilha(); });
renderTrilha();

/* ---------- Comparador livre ---------- */
const OPCOES = [
  ...colsDe("tech").map(c=>({...c, chave:"tech:"+c.i, rot:c.r.nome})),
  ...colsDe("magic").map(c=>({...c, chave:"magic:"+c.i, rot:c.r.nome})),
  {r:TRILHAS.especiais.ranks[0], t:"especiais", i:0, chave:"especiais:0", rot:"Construtor"}
];
const grupoOpt = (t, rot) => `<optgroup label="${rot}">${OPCOES.filter(o=>o.t===t).map(o=>`<option value="${o.chave}">${o.rot}</option>`).join("")}</optgroup>`;
const opcoesHTML = vazio => (vazio ? '<option value="">Nenhum</option>' : "") + grupoOpt("tech","Tech") + grupoOpt("magic","Magic & Exploration") + grupoOpt("especiais","Classes especiais");
const selects = [...document.querySelectorAll("#cmpEscolhas select")];
selects.forEach((s,k)=>{ s.innerHTML = opcoesHTML(k===2); });
selects[0].value = "tech:2"; selects[1].value = "magic:2"; selects[2].value = "especiais:0";
function renderLivre(){
  const cols = selects.map(s=>OPCOES.find(o=>o.chave===s.value)).filter(Boolean)
    .filter((o,k,a)=>a.findIndex(x=>x.chave===o.chave)===k)
    .sort((a,b)=>(NIVEL[a.r.id]||0)-(NIVEL[b.r.id]||0) || (a.t<b.t?-1:1));
  document.getElementById("cmpLivre").innerHTML = cols.length ? tabelaHTML(cols, true) : "";
}
selects.forEach(s=>s.addEventListener("change", renderLivre));
const tgl = document.getElementById("cmpToggle"), corpoLivre = document.getElementById("cmpCorpo");
tgl.addEventListener("click",()=>{
  const abre = tgl.getAttribute("aria-expanded") !== "true";
  tgl.setAttribute("aria-expanded", abre);
  corpoLivre.classList.toggle("on", abre);
  if(abre){ renderLivre(); setTimeout(()=>corpoLivre.scrollIntoView({behavior: reduz ? "auto" : "smooth", block:"nearest"}), 350); }
});

/* Equipe: edite aqui */
const EQUIPE = {
  lider: {nick:"AdvancedGames", nome:"Fono Lucas", cargo:"CORE LEADER", cor:"#F2B01E", texto:"Fundador e dono do Refúgio. Desenvolve os mods e sistemas exclusivos do servidor e responde por tudo que faz o Refúgio funcionar, desde o primeiro dia."},
  times: [
    {nome:"Administradores", cor:"#FF5555", texto:"Cuidam do funcionamento do Refúgio junto com o Core Leader: acompanham a equipe, resolvem os casos mais graves e mantêm o servidor no ar.", membros:[{nick:"Hypnoseey", funcao:"Recuperação do servidor: liga, reinicia e desliga quando é preciso"}]},
    {nome:"Moderadores", cor:"#55FF55", texto:"Mantêm a ordem no jogo e no Discord, aplicam as regras e acompanham denúncias.", membros:[]},
    {nome:"Ajudantes", cor:"#55FFFF", texto:"Tiram dúvidas dos jogadores no jogo, no Discord e nos tickets.", membros:[{nick:"Evandrort", funcao:"Suporte aos jogadores"}]}
  ]
};
function criarEquipe(){
  document.head.insertAdjacentHTML("beforeend", `<style id="rf-equipe-css">
.rg-topo.eq-topo::before{background-image:url(https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/img/hero.webp);background-position:center 35%}
.eq-lider{display:grid;grid-template-columns:auto 1fr;gap:34px;align-items:center;padding:34px 40px;border-radius:22px;background:radial-gradient(80% 140% at 0% 0%,rgba(242,176,30,.22),transparent 60%),var(--cosmos);color:#fff;box-shadow:0 0 0 2px #F2B01E,0 28px 60px -34px rgba(242,176,30,.6)}
.eq-lider .eq-cab{width:132px;height:132px;image-rendering:pixelated;filter:drop-shadow(0 14px 18px rgba(0,0,0,.45))}
.eq-cargo{display:inline-block;padding:5px 10px;border-radius:6px;font:700 12px/1 var(--display);letter-spacing:.06em;color:#1b1535;background:var(--c)}
.eq-lider h3{font:700 clamp(28px,3.4vw,40px)/1.05 var(--display);margin:12px 0 2px}
.eq-lider .eq-real{color:rgba(255,255,255,.66);font-size:15px}
.eq-lider p{margin:14px 0 0;max-width:62ch;color:rgba(255,255,255,.84);font-size:17px}
.eq-grade{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:20px}
.eq-time{display:flex;flex-direction:column;gap:14px;padding:24px;border-radius:18px;background:#fff;box-shadow:0 0 0 1px var(--linha);border-top:4px solid var(--c)}
.eq-time h3{font:700 20px/1.1 var(--display);margin:0}
.eq-time>p{margin:0;font-size:14px;color:var(--tinta-2)}
.eq-time ul{list-style:none;margin:auto 0 0;padding:0;display:grid;gap:10px}
.eq-membro{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:12px;background:#F6F4FB}
.eq-membro img{width:40px;height:40px;border-radius:6px;image-rendering:pixelated}
.eq-membro b{display:block;font:700 16px/1.15 var(--display)}
.eq-membro span{font-size:13px;color:var(--tinta-2)}
.eq-vaga{padding:12px;border-radius:12px;border:1.5px dashed var(--linha);font-size:14px;color:var(--tinta-2);text-align:center}
@media (max-width:900px){.eq-grade{grid-template-columns:1fr}}
@media (max-width:600px){.eq-lider{grid-template-columns:1fr;padding:26px;gap:18px}.eq-lider .eq-cab{width:96px;height:96px}}
.extra>img{display:block;width:calc(100% + 40px);max-width:none;margin:0 -20px 4px;aspect-ratio:16/9;object-fit:cover;background:#1a0f2b}
.rede.embreve{cursor:default;opacity:.72}.rede.embreve:hover{transform:none;box-shadow:0 0 0 1px var(--linha)}
.rede-breve{display:block;width:fit-content;margin-top:8px;padding:4px 9px;border-radius:999px;background:#EDEAF5;color:var(--tinta-2);font:600 12px/1 var(--corpo);font-style:normal}
.rod-breve{opacity:.6}
</style>`);
  const velha = document.getElementById("equipe"); if(velha) velha.remove();
  const v = document.createElement("main"); v.id = "viewEquipe"; v.hidden = true;
  v.innerHTML = `
  <section class="rg-topo eq-topo">
    <div class="wrap"><h1>A equipe</h1><p>Quem mantém o Refúgio de pé, cuida do servidor e responde você.</p></div>
    <div class="hero-borda" aria-hidden="true"></div>
  </section>
  <section class="secao" style="padding-top:64px">
    <div class="wrap">
      <div id="eqLider"></div>
      <div class="eq-grade" id="eqGrade"></div>
      <div class="ajuda" style="margin-top:28px"><span class="slot-mini">${ico("ticket")}</span><p><b>Precisa falar com a equipe?</b> Abra um ticket no Discord. Assim o seu caso fica registrado e chega a quem pode resolver. <a class="btn btn-ouro" href="${CONFIG.links.ticket}" target="_blank" rel="noopener" style="margin-left:8px;padding:10px 16px">Abrir ticket</a></p></div>
    </div>
  </section>`;
  const home = document.getElementById("viewHome"); home.parentNode.insertBefore(v, home.nextSibling);
  const cab = (n, t) => `data-cab="${esc(n)}" data-cab-tipo="${t === "head" ? "3d" : "2d"}" data-cab-tam="${t === "head" ? 160 : 64}"`;
  const L = EQUIPE.lider;
  v.querySelector("#eqLider").innerHTML = `<article class="eq-lider" style="--c:${L.cor}"><img class="eq-cab" ${cab(L.nick,"head")} alt=""><div><span class="eq-cargo">${L.cargo}</span><h3>${L.nick}</h3><div class="eq-real">${L.nome}</div><p>${L.texto}</p></div></article>`;
  v.querySelector("#eqGrade").innerHTML = EQUIPE.times.map(t=>`<article class="eq-time" style="--c:${t.cor}"><h3>${t.nome}</h3><p>${t.texto}</p><ul>${t.membros.length ? t.membros.map(m=>`<li class="eq-membro"><img ${cab(m.nick,"avatar")} alt=""><div><b>${m.nick}</b><span>${m.funcao}</span></div></li>`).join("") : `<li class="eq-vaga">Vagas em breve. Fique de olho no Discord.</li>`}</ul></article>`).join("");
  ligarCabecas(v);
  return v;
}

/* Extras */
const EXTRAS = [
  {nome:"Chunks permanentes", ico:"x_chunks", arte:"x-chunks", url:"chunks-permanentes", desc:"Proteção de terreno que não expira.", vars:[["5 chunks","R$ 20,00"],["10 chunks","R$ 37,50"],["15 chunks","R$ 50,00"]]},
  {nome:"Chunk loader", ico:"x_loader", arte:"x-loader", url:"chunk-loader", desc:"Mantém suas chunks carregadas enquanto você está online.", vars:[["1 temporário (30 dias)","R$ 35,00"],["4 temporários (40 dias)","R$ 85,00"],["12 permanentes","R$ 224,90"]]},
  {nome:"Cash", ico:"x_cash", arte:"x-cash", url:"pacote-cash", desc:"Creditado direto na sua conta após a compra.", vars:[["50 cash","R$ 17,00"],["150 cash","R$ 37,00"],["300 cash","R$ 50,00"]]},
  {nome:"Desbanimento", ico:"x_unban", arte:"x-unban", url:"desbanimento", desc:"Só vale após aprovação por ticket no Discord. Abra o ticket antes de comprar.", ticket:true, vars:[["Desbanimento","R$ 35,00"]]}
];
document.getElementById("extras").innerHTML = EXTRAS.map(x=>`<article class="extra">
  <img src="https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/img/${x.arte}.webp" alt="Emblema ${x.nome}" loading="lazy"><h3>${x.nome}</h3>
  <p>${x.desc}</p>
  <ul>${x.vars.map(([n,p])=>`<li><span>${n}</span><b>${p}</b></li>`).join("")}</ul>
  ${x.ticket?`<a class="btn btn-linha" href="${CONFIG.links.ticket}" target="_blank" rel="noopener">1. Abrir ticket</a>`:""}<a class="btn btn-ouro"${x.ticket?' style="margin-top:0"':""} href="${LOJA_URL+x.url}" target="_blank" rel="noopener">${x.ticket?"2. Comprar":"Comprar"}</a></article>`).join("");

/* Kits individuais */
function slotItem([arq,nome,q,enc,cor,mod,extra,sub], si){
  const linhas = [...(enc||[]), ...(extra?[extra]:[])].join("<br>");
  const corNome = cor || (enc ? "#55FFFF" : "#FFFFFF");
  const img = arq ? `<img class="ico px" src="${kitSrc(arq)}" alt="">` : `<span class="falta" aria-hidden="true">?</span>`;
  return `<button class="s${enc&&arq?" brilho":""}${sub&&si!=null?" abre":""}"${sub&&si!=null?` data-si="${si}"`:""} ${arq?`style="--img:url(${kitSrc(arq)})"`:""} data-tip-t="<span style='color:${corNome}'>${nome}</span>" data-tip-l="${linhas || (q>1?q+" unidades":"1 unidade")}" data-tip-m="${mod || "Loja do Refúgio"}" aria-label="${q>1?q+" × ":""}${nome}${enc?", encantado":""}">${img}${q>1?`<span class="q">${q}</span>`:""}</button>`;
}
const individuais = KITS.filter(k=>!/^(diario|semanal|tech|magic)/.test(k.id));
const kitsLista = document.getElementById("kits-lista");
kitsLista.innerHTML = individuais.map(k=>{ const comImg = k.itens.filter(i=>i[0]); return `<article class="vip" style="--v:${k.id==="vipconstrutor"?"#F2B01E":"#7B52E6"}">
  <div class="vip-cab"><h3>${k.nome}</h3><div class="emblema">${k.emblema?`<img class="ico px" src="${kitSrc(k.emblema)}" alt="">`:""}</div><div class="preco" style="font-size:20px">${k.itens.length} itens</div></div>
  <div class="vip-corpo">
    <div><div class="previa">${comImg.slice(0,6).map(slotItem).join("")}${k.itens.length>6?`<span class="mais">+${k.itens.length-6}</span>`:""}</div></div>
    <div class="vip-acoes" style="grid-template-columns:1fr"><button class="btn btn-linha" data-ver="${k.id}">Ver kit</button></div>
  </div></article>`; }).join("");
ligarTips(kitsLista);

/* Baú */
const bau = document.getElementById("bauKit");
const vazios = n => Array.from({length:n},()=>'<span class="s" aria-hidden="true"></span>').join("");
const NOME_DIARIO = {diario_forjador:"Forjador",diario_arquiteto:"Arquiteto",diario_cientista:"Cientista",diario_arconte:"Arconte",diario_major:"Major"};
const rotuloKit = id => /^(tech|magic)/.test(id) ? "Ativação" : id.startsWith("diario") ? "Diário "+NOME_DIARIO[id] : id.startsWith("semanal") ? "Semanal VIP"+id.slice(7) : id==="vipconstrutor" ? "Exclusivo" : "Kit";
function mostrarKit(id){
  const v = KITS.find(x=>x.id===id); if(!v) return;
  document.getElementById("bauTit").textContent = v.nome;
  const g = document.getElementById("bauItens");
  const total = Math.max(27, Math.ceil(v.itens.length/9)*9);
  g.innerHTML = v.itens.map((it,i)=>slotItem(it, it[7] ? i : null)).join("") + vazios(total - v.itens.length);
  ligarTips(g);
  kitAtual = v; fecharSub();
  document.getElementById("subDica").hidden = !v.itens.some(it=>it[7]);
  document.querySelectorAll("#kitAbas button").forEach(b=>{ const on = b.dataset.k===id; b.setAttribute("aria-selected", on); b.tabIndex = on?0:-1; });
}
let kitAtual = null;
function fecharSub(){ document.getElementById("bauSubArea").classList.remove("on"); document.querySelectorAll("#bauItens .aberto").forEach(x=>x.classList.remove("aberto")); }
function abrirSub(i, botao){
  const it = kitAtual.itens[i]; if(!it || !it[7]) return;
  if(botao.classList.contains("aberto")){ fecharSub(); return; }
  const area = document.getElementById("bauSubArea"), jaAberta = area.classList.contains("on");
  document.querySelectorAll("#bauItens .aberto").forEach(x=>x.classList.remove("aberto"));
  botao.classList.add("aberto");
  document.getElementById("subIcone").innerHTML = it[0] ? `<img class="ico px" src="${kitSrc(it[0])}" alt="">` : "";
  const nome = document.getElementById("subNome"); nome.textContent = it[1]; nome.style.color = it[4] || "#2a2340";
  const sub = it[7], total = Math.max(27, Math.ceil(sub.length/9)*9);
  const grade = document.getElementById("bauSubGrade");
  grade.innerHTML = sub.map(x=>x ? slotItem(x) : '<span class="s" aria-hidden="true"></span>').join("") + vazios(total - sub.length);
  [...grade.children].forEach((c,k)=>c.style.setProperty("--d", (Math.floor(k/9)*55 + (k%9)*12)+"ms"));
  ligarTips(grade);
  if(jaAberta){ area.classList.remove("on"); void area.offsetWidth; }
  area.classList.add("on");
  tip.classList.remove("on");
  setTimeout(()=>area.scrollIntoView({behavior: reduz ? "auto" : "smooth", block:"nearest"}), jaAberta ? 60 : 260);
}
document.getElementById("bauItens").addEventListener("click",e=>{ const b = e.target.closest("[data-si]"); if(b) abrirSub(+b.dataset.si, b); });
document.getElementById("subFechar").addEventListener("click", fecharSub);
function abrirBau(kits, rank){
  const abasK = document.getElementById("kitAbas");
  abasK.innerHTML = kits.length > 1 ? kits.map(k=>`<button role="tab" data-k="${k}">${rotuloKit(k)}</button>`).join("") : "";
  abasK.hidden = kits.length < 2;
  const rod = document.getElementById("bauRodape");
  if(rank){ rod.hidden = false; document.getElementById("bauPreco").textContent = rank.preco; document.getElementById("bauSub").textContent = `VIP ${rank.nome} · ${rank.dias} dias`; document.getElementById("bauComprar").href = linkCompra(rank); }
  else rod.hidden = true;
  mostrarKit(kits[0]);
  bau.append(tip);
  try{ bau.showModal(); }catch(e){ bau.setAttribute("open",""); }
}
document.getElementById("kitAbas").addEventListener("click",e=>{ const b = e.target.closest("[data-k]"); if(b) mostrarKit(b.dataset.k); });
bau.addEventListener("close",()=>{ document.body.append(tip); tip.classList.remove("on"); });
bau.addEventListener("click",e=>{ if(e.target === bau) bau.close(); });
document.getElementById("fecharBau").addEventListener("click",()=>bau.close());
const todosRanks = [...TRILHAS.tech.ranks, ...TRILHAS.magic.ranks, ...TRILHAS.especiais.ranks];
document.addEventListener("click",e=>{
  const ver = e.target.closest("[data-ver]"); if(ver) abrirBau([ver.dataset.ver], null);
  const vip = e.target.closest("[data-vip]"); if(vip){ const lista = TRILHAS[trilha].ranks; const r = lista.find(x=>x.id===vip.dataset.vip) || todosRanks.find(x=>x.id===vip.dataset.vip); abrirBau(r.kits, r); }
});
abas(document.getElementById("cats"), b=>{ const c = b.dataset.cat;
  document.querySelectorAll(".pane-loja").forEach(p=>p.hidden = p.id !== "pane-"+c); });

/* ================= REGRAS ================= */
const ATUALIZADO = "5 de novembro de 2026";
const GRAV = {
  leve:{nome:"Leve", cor:"#2E8B57"},
  media:{nome:"Média", cor:"#C98E00"},
  grave:{nome:"Grave", cor:"#D9601C"},
  gravissima:{nome:"Gravíssima", cor:"#C0262D"}
};
const ESSENCIAL = [
  ["respeito","Respeite todos. Preconceito e discurso de ódio dão banimento."],
  ["cheat","Nada de x-ray, cheats, autoclicker, macro ou bots."],
  ["bug","Achou um bug? Ticket na hora. Dupe dá banimento e reset."],
  ["chunk","Só vale o force load do FTB Chunks. Qualquer outro chunk loader é proibido."],
  ["troca","Comércio só de forma justa. Doar itens de graça é proibido."],
  ["dinheiro","Nada de trocar coisas do servidor por dinheiro real fora da loja oficial."],
  ["claim","Proteja sua base com claim. A claim nunca pode virar armadilha."],
  ["conta","Uma conta por pessoa, com nick próprio."]
];
/* Cada regra: [id, título, gravidade, texto (parágrafos), lista opcional, nota opcional] */
const REGRAS = [
  {n:1, t:"Aceite das regras", r:[
    ["1.1","Ao jogar, você aceita as regras","leve",["Ao entrar no servidor, participar do Discord ou usar qualquer sistema da comunidade, você concorda com as regras oficiais, com as decisões da staff e com as punições aplicadas quando houver infração."]],
    ["1.2","Ninguém tem imunidade","media",["VIP, tempo de servidor, cargo, amizade com a staff ou participação na comunidade não dão imunidade. Tentar burlar uma regra também é infração."]]
  ]},
  {n:2, t:"Denúncias, suporte e provas", r:[
    ["2.1","Use o ticket","leve",["Denúncias, problemas e pedidos de suporte são feitos só por ticket no Discord. Não exponha denúncias no chat público."]],
    ["2.2","Envie provas","leve",["Sempre que possível, mande provas. Denúncias sem prova podem ser indeferidas. A staff usa logs para ajudar, mas registrar trocas e acordos importantes é responsabilidade de quem joga."],["prints ou vídeos","coordenadas e horário aproximado","nome dos envolvidos","descrição clara do que aconteceu"]]
  ]},
  {n:3, t:"Convivência e respeito", r:[
    ["3.1","Respeito em todo lugar","media",["O respeito é obrigatório no jogo e no Discord. É proibido:"],["ofender, humilhar, perseguir ou provocar jogadores","criar tumulto no chat ou no Discord","atacar outro jogador pessoalmente","usar nick, skin, placa, construção ou mensagem ofensiva","insistir em discussões já encerradas pela staff","tentar burlar os filtros de linguagem"],"Brincadeira só vale quando todos estão confortáveis. Se virou incômodo, perseguição ou humilhação, pode ser punido."]
  ]},
  {n:4, t:"Preconceito, ódio e conteúdo impróprio", r:[
    ["4.1","Tolerância zero","gravissima",["Discriminação, assédio e discurso de ódio dão banimento. Casos graves podem resultar em banimento permanente imediato. É proibido qualquer conteúdo com:"],["racismo, xenofobia, homofobia, transfobia, capacitismo ou misoginia","apologia a crime","exposição de dados pessoais","conteúdo sexual, +18, violento, ilegal ou impróprio"],"Vale para chat, Discord, nick, skin, placas, construções, imagens, links, nomes de itens, nomes de times, hologramas e qualquer outro meio."]
  ]},
  {n:5, t:"Regras dentro do jogo", r:[
    ["5.1","Cheats e vantagens indevidas","grave",["É proibido usar qualquer recurso que dê vantagem injusta:"],["x-ray, radar ilegal ou textura que revele minérios, bases ou entidades","autoclicker e macro, inclusive para manter farm ativa","bots e scripts de automação","qualquer método para burlar sistemas, bloqueios ou itens banidos","qualquer método que dê vantagem indevida, como alterar atributos, status, vida, velocidade ou alcance do personagem"],"Os mods do próprio modpack e utilitários comuns, como JEI e JourneyMap, são permitidos. Na dúvida, pergunte antes."],
    ["5.2","Bugs, glitches e dupes","gravissima",["Abuso de bug é uma das infrações mais graves do servidor. É proibido:"],["duplicar itens","explorar glitches ou falhas de mods, plugins ou do Minecraft","atravessar paredes ou passar da bedrock por falhas","causar lag de propósito","esconder, ensinar, vender, usar ou lucrar com item obtido por bug"],"Achou um bug? Reporte por ticket imediatamente. Não teste de novo, não distribua e não venda. Dupe ou abuso grave pode dar banimento permanente e reset já na primeira vez."],
    ["5.3","Anti-jogo","grave",["É proibido atrapalhar de propósito a experiência de outros jogadores ou do servidor, por exemplo:"],["bloquear acessos importantes","atrair mobs para matar jogadores, prender alguém ou criar traps de roubo ou morte","usar máquinas ou mecânicas do modpack para prejudicar bases, travar, sugar, empurrar ou teleportar jogadores","criar estruturas ou comportamentos que geram lag"],"Algo ser possível no modpack não quer dizer que seja permitido."],
    ["5.4","Chunk loaders: só FTB Chunks","grave",["O único jeito permitido de manter chunks carregadas é o force load do FTB Chunks, dentro do limite da sua conta."],["chunk loaders de qualquer mod são proibidos","métodos vanilla de carregar chunks são proibidos","qualquer método que simule um chunk loader é proibido"],"A staff pode remover qualquer estrutura que mantenha chunks carregadas fora do FTB Chunks, sem aviso prévio."]
  ]},
  {n:6, t:"Economia, comércio e progressão", r:[
    ["6.1","Ajuda justa e proibição de doação","grave",["Ajudar outros jogadores é permitido, desde que de forma justa:"],["venda por preço compatível ou troca justa","prestação de serviço","parceria de farm ou construção","sistemas oficiais do servidor","ensinar a usar os mods"],"Dar itens de graça, sem cobrar um valor justo, é proibido. Envie produtos vendidos pelo /correio e registre a negociação. Ensinar é sempre melhor do que entregar a progressão pronta."],
    ["6.2","Preços","media",["O preço deve ser compatível com a raridade, a dificuldade de obtenção, o estágio de progressão, a utilidade e o impacto do item na economia. Na dúvida, compare com a /warp loja."],null,"Itens de late game, máquinas avançadas e equipamentos fortes não devem ser vendidos barato só para ajudar um amigo. Progressão indevida prejudica a economia e o servidor inteiro."],
    ["6.3","Preço mínimo dos itens da ATM Star","grave",["Itens que envolvem diretamente a ATM Star devem ser vendidos, obrigatoriamente, na casa dos milhões de moedas. A própria ATM Star deve custar no mínimo 20 milhões."],null,"Vender abaixo desses valores é considerado manipulação de economia, mesmo entre amigos ou membros do mesmo time."],
    ["6.4","Manipulação de economia","grave",["É proibido prejudicar a economia com:"],["dumping, vendendo em massa muito abaixo do valor","combinação de preços para prejudicar outros jogadores","monopólio abusivo","compra e venda simulada para transferir riqueza","comércio com itens obtidos ilegalmente"],"A staff pode remover lojas, cancelar negociações, confiscar itens e reverter vantagens obtidas."],
    ["6.5","Trocas externas","gravissima",["É proibido trocar qualquer coisa do servidor por dinheiro real, Pix, contas, itens de outros jogos ou servidores, serviços externos ou qualquer benefício fora dos sistemas oficiais. A única exceção são os produtos da loja oficial."],null,"Troca externa pode dar banimento permanente direto."]
  ]},
  {n:7, t:"Claims, bases e segurança", r:[
    ["7.1","Proteja sua base","leve",["Proteger a base com o FTB Chunks é responsabilidade de cada jogador. Em áreas sem claim, a solução para roubo ou griefing pode ser limitada, mas isso não autoriza má-fé: com provas, a staff pode punir mesmo em área sem proteção."]],
    ["7.2","A claim não é armadilha","grave",["É proibido matar, prender ou prejudicar jogadores dentro da própria claim ou em áreas protegidas, incluindo:"],["convidar alguém para a base e matá-lo","criar armadilhas em área protegida","usar mobs, máquinas, fluidos, radiação, explosões ou teleportes para matar","bloquear saídas ou prender em salas, portais, elevadores ou máquinas","fingir segurança para roubar ou matar"]],
    ["7.3","Trust e permissões","grave",["Dar trust é decisão do dono da claim, mas trust não autoriza abuso. É proibido usar o acesso para roubar, quebrar ou alterar máquinas sem permissão, mover itens para benefício próprio, esconder mecanismos ou prejudicar a base depois de sair do time."],null,"Escolha bem quem entra no seu time. Em acordos sem registro, a atuação da staff é limitada."],
    ["7.4","Griefing","grave",["É proibido destruir construções alheias, sujar terreno, fazer construção troll, cavar buracos para atrapalhar, construir símbolos ofensivos, bloquear entradas e usar máquinas para minerar, sugar ou destruir a área de outro jogador sem permissão."]]
  ]},
  {n:8, t:"Roubo, acordos e apropriação", r:[
    ["8.1","Roubo e apropriação indevida","grave",["É proibido ficar com o que não é seu, incluindo:"],["pegar itens de baús, máquinas, mochilas, storages ou do chão sabendo que são de outro jogador","não devolver item recebido por engano","mudar os termos de uma troca depois do combinado","sair de um time ou guilda levando recursos coletivos sem acordo","enganar jogadores novos para conseguir itens baratos ou de graça"],"Registre negociações importantes com print ou vídeo. Sem prova, a staff tem atuação limitada."]
  ]},
  {n:9, t:"AFK, farms, máquinas e lag", r:[
    ["9.1","Cuide do impacto da sua base","media",["O servidor tem muitos mods pesados, e cada jogador responde pelo impacto da própria base. É proibido:"],["criar loops propositais de entidades, itens ou máquinas","criar farms com excesso de mobs ou deixar drops acumulando","causar lag de propósito ou por negligência depois de avisado"],"Autoclicker, macro e chunk loaders seguem as regras 5.1 e 5.4."],
    ["9.2","O que a staff pode fazer","leve",["Para proteger a estabilidade do servidor, a staff pode pedir ajustes, desligar máquinas, remover entidades, limitar farms, remover chunk loaders, alterar configs e remover estruturas. Em casos graves, sem aviso prévio."]]
  ]},
  {n:10, t:"Chat, Discord e comunicação", r:[
    ["10.1","Flood e spam","leve",["É proibido repetir mensagens, abusar do caps lock, mandar sequências de caracteres, fazer propaganda repetitiva, criar eventos no chat sem permissão, poluir canais do Discord e marcar a staff sem necessidade."]],
    ["10.2","Divulgação","media",["Divulgar outro servidor, Discord, live, vídeo, loja ou projeto externo precisa de autorização. Conteúdo sobre o próprio Refúgio é bem-vindo, com bom senso."]],
    ["10.3","Canal certo para cada coisa","leve",["Comércio no local apropriado, denúncias por ticket ou /helpop, e discussões longas fora do chat público."]],
    ["10.4","Uso do /nick","media",["É proibido usar nicks para enganar jogadores, se passar por staff ou por outro jogador, ofender, burlar punição ou causar confusão."]]
  ]},
  {n:11, t:"Contas", r:[
    ["11.1","Uma conta por pessoa","grave",["É proibido usar conta secundária ou fake, compartilhar, vender ou comprar contas, e usar outra conta para burlar punição, receber recompensas, votar, farmar ou transferir itens."],null,"Mais de uma conta no mesmo IP é permitida quando forem familiares ou amigos jogando juntos. Contas fake podem levar ao banimento de todas as contas envolvidas."],
    ["11.2","Contas alternativas: nick próprio","leve",["O Refúgio aceita contas alternativas, desde que usem um nick próprio, que não pertença a nenhuma conta original do Minecraft. Contas alternativas entram com /login."]]
  ]},
  {n:12, t:"Itens proibidos e restritos", r:[
    ["12.1","Itens bloqueados","grave",["Itens proibidos, bloqueados ou restritos não podem ser usados, colocados, vendidos, comprados, trocados ou guardados com intenção de uso. Se o item aparece como proibido no JEI, na descrição, na config ou num aviso oficial, a regra vale."],null,"Tentar burlar o bloqueio com mochila, cardboard box, storage, transporte, claim ou máquina é considerado abuso."]
  ]},
  {n:13, t:"Reposição de itens", r:[
    ["13.1","Quando há reposição","leve",["A staff não garante reposição por morte natural, erro do jogador, rollback, queda de conexão, máquina mal configurada, trust dado indevidamente, acordo sem registro ou bug sem prova. A reposição só é considerada com provas claras e, mesmo assim, não é automática."]]
  ]},
  {n:14, t:"Loja e VIP", proposta:true, r:[
    ["14.1","Benefícios não dão imunidade","media",["VIPs e produtos da loja não colocam ninguém acima das regras. Itens de kits seguem as mesmas regras de comércio e de itens proibidos."]],
    ["14.2","Contestação de pagamento","gravissima",["Contestar uma compra já entregue (chargeback) resulta em banimento permanente e remoção dos benefícios."]]
  ]},
  {n:15, t:"Decisão da staff", r:[
    ["15.1","Casos não listados","leve",["A staff pode agir para proteger o servidor mesmo quando a situação não está descrita palavra por palavra. Casos não listados são avaliados pela intenção, pelo dano causado, pelo impacto na economia e na progressão, pela reincidência, pelo histórico do jogador, pela cooperação na investigação, por tentativas de esconder provas e pelo benefício obtido."]]
  ]}
];
const PUNICOES = [
  ["leve","Aviso, depois mute de 1 a 24 horas","Flood, caps lock, canal errado, trust mal usado"],
  ["media","Mute longo, kick ou banimento de 1 a 3 dias","Ofensas, divulgação sem autorização, nick inadequado, lag por negligência"],
  ["grave","Banimento de 7 a 30 dias, com confisco ou remoção","Cheats, autoclicker, macro, chunk loader proibido, roubo, griefing, doação de itens"],
  ["gravissima","Banimento permanente, com ou sem reset","Dupe, discurso de ódio, troca externa, chargeback"]
];
const slugRegra = id => "regra-" + id.replace(".","-");
function htmlRegras(){
  const ind = REGRAS.map(s=>`<li><a href="#${slugRegra(s.n+".1").replace(/-1$/,"-1")}" data-sec="${s.n}"><span>${s.n}</span>${s.t}</a></li>`).join("");
  document.getElementById("regrasIndice").innerHTML = ind + `<li><a href="#regra-punicoes" data-sec="p"><span>!</span>Punições e recursos</a></li>`;
  document.getElementById("regrasEssencial").innerHTML = ESSENCIAL.map(([k,t])=>`<li>${t}</li>`).join("");
  document.getElementById("regrasCorpo").innerHTML = REGRAS.map(s=>`<section class="rg-sec" data-sec="${s.n}">
    <h2><span class="rg-num">${s.n}</span>${s.t}${s.proposta?'<em class="rg-prop">Nova, a confirmar</em>':""}</h2>
    ${s.r.map(([id,t,g,ps,lista,nota])=>`<article class="rg" id="${slugRegra(id)}" data-busca="${(id+" "+t+" "+ps.join(" ")+" "+(lista||[]).join(" ")+" "+(nota||"")).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")}">
      <header><span class="rg-id">${id}</span><h3>${t}</h3><a class="rg-grav" href="#regra-punicoes" style="--g:${GRAV[g].cor}">${GRAV[g].nome}</a><button class="rg-link" data-copia="${slugRegra(id)}" aria-label="Copiar link da regra ${id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></header>
      ${ps.map(p=>`<p>${p}</p>`).join("")}
      ${lista?`<ul>${lista.map(l=>`<li>${l}</li>`).join("")}</ul>`:""}
      ${nota?`<p class="rg-nota">${nota}</p>`:""}
    </article>`).join("")}
  </section>`).join("") + `<section class="rg-sec" data-sec="p" id="regra-punicoes">
    <h2><span class="rg-num">!</span>Punições e recursos <em class="rg-prop">Proposta</em></h2>
    <p class="rg-intro">Cada regra tem um selo de gravidade. A punição parte desse nível e pode subir com reincidência, intenção ou impacto no servidor.</p>
    <div class="rg-tab">${PUNICOES.map(([g,p,ex])=>`<div class="rg-linha" style="--g:${GRAV[g].cor}"><span class="rg-grav">${GRAV[g].nome}</span><b>${p}</b><span>${ex}</span></div>`).join("")}</div>
    <article class="rg" id="regra-recurso"><header><span class="rg-id">R</span><h3>Revisão de punição e desbanimento</h3></header><p>Para pedir revisão, <a data-link="ticket" href="https://discord.gg/cM8F5sTetW">abra um ticket no Discord</a> explicando o caso. O desbanimento só pode ser comprado na loja depois que o ticket for aprovado pela staff. Não compre sem abrir o ticket antes.</p></article>
  </section>`;
}
htmlRegras();
document.getElementById("regrasData").textContent = ATUALIZADO;
/* Busca */
const buscaRg = document.getElementById("buscaRegras"), vazioRg = document.getElementById("regrasVazio");
buscaRg.addEventListener("input",()=>{
  const q = buscaRg.value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
  let n = 0;
  document.querySelectorAll("#regrasCorpo .rg[data-busca]").forEach(a=>{ const ok = !q || a.dataset.busca.includes(q); a.hidden = !ok; if(ok) n++; });
  document.querySelectorAll("#regrasCorpo .rg-sec").forEach(s=>{ if(s.dataset.sec==="p") { s.hidden = !!q; return; } s.hidden = ![...s.querySelectorAll(".rg")].some(a=>!a.hidden); });
  vazioRg.hidden = n > 0;
});
/* Copiar link de uma regra */
document.getElementById("regrasCorpo").addEventListener("click", async e=>{
  const b = e.target.closest("[data-copia]"); if(!b) return;
  const url = location.href.split("#")[0] + "#" + b.dataset.copia;
  try{ await navigator.clipboard.writeText(url); avisar("Link da regra copiado"); }catch(x){ avisar(url); }
  history.replaceState(null, "", "#" + b.dataset.copia);
});
/* Índice: marca a seção visível */
const secsRg = [...document.querySelectorAll("#regrasCorpo .rg-sec")];
function indiceAtivo(){
  if(document.getElementById("viewRegras").hidden) return;
  let at = secsRg[0];
  for(const s of secsRg){ if(s.getBoundingClientRect().top < innerHeight*0.3) at = s; }
  document.querySelectorAll("#regrasIndice a").forEach(a=>a.classList.toggle("ativo", a.dataset.sec === at.dataset.sec));
}
addEventListener("scroll", indiceAtivo, {passive:true});

/* ================= GUIA DAS GUILDAS ================= */
const C = t => `<button class="gcmd" data-cmd="${t}" title="Clique para copiar">${t}</button>`;
const GSEC = [
  {id:"comeco", t:"Seu primeiro passo", html:`
    <p class="gd-p">Sua Guilda reúne jogadores, tem uma cidade, organiza setores e junta recursos para evoluir. A progressão combina construção, produção e desafios em grupo.</p>
    <ol class="gd-passos">
      <li><b>Funde uma Guilda</b> ou entre em uma que já existe.</li>
      <li><b>Atravesse o portal</b> do spawn principal até o Mundo das Guildas.</li>
      <li><b>O fundador escolhe o terreno</b> e confirma a cidade.</li>
      <li><b>A liderança organiza</b> os membros e as permissões.</li>
      <li><b>Todos ajudam</b> com recursos, Dracmas e manutenção.</li>
      <li><b>A Guilda evolui</b> e amplia território, membros e indústria.</li>
    </ol>
    <p class="gd-nota">Fundar a Guilda e escolher o terreno são duas etapas. A fundação vem primeiro, e o terreno é escolhido depois, sem nova cobrança.</p>`},
  {id:"fundar", t:"Como fundar sua Guilda", html:`
    <div class="gd-cols">
      <div class="gd-card"><h4>Escolha a identidade</h4><ul class="gd-ul"><li><b>TAG:</b> de 2 a 5 letras ou números. Exemplo: LUA.</li><li><b>Nome:</b> de 3 a 32 caracteres. Exemplo: Guardiões da Lua.</li><li>Nome e TAG precisam estar disponíveis.</li><li>Cada jogador participa de uma Guilda por vez.</li></ul></div>
      <div class="gd-card"><h4>Escolha uma forma de pagamento</h4><div class="gd-preco"><div><span>Coins</span><b>10.000.000</b>${C("/guilda fundar TAG Nome")}</div><div class="ou">ou</div><div><span>Dracmas</span><b>1.000</b>${C("/guilda fundardracmas TAG Nome")}</div></div><p class="gd-mini">Você paga com uma das moedas, não com as duas.</p></div>
    </div>
    <div class="gd-card"><h4>Confira e confirme em até 5 minutos</h4><p>O comando mostra uma prévia com nome, TAG e cobrança. Confira tudo e use ${C("/guilda fundar confirmar")} Para desistir, ${C("/guilda fundar cancelar")}</p></div>`},
  {id:"vip", t:"VIPs e Direito de Fundação", html:`
    <div class="gd-desc">
      <div><span class="gd-pill">25% de desconto</span><b>7.500.000 Coins</b><small>ou 750 Dracmas</small><em>Cientista e Arcanista</em></div>
      <div><span class="gd-pill">50% de desconto</span><b>5.000.000 Coins</b><small>ou 500 Dracmas</small><em>Arconte e Ascendente</em></div>
      <div class="ouro"><span class="gd-pill">Direito de Fundação</span><b>Grátis</b><small>sem custo inicial</small><em>ATM Major</em></div>
    </div>
    <p class="gd-p">Vale sempre o maior desconto disponível, e os descontos não se somam. Consulte seus direitos com ${C("/guilda direitos")} Se tiver um Direito de Fundação, use a rota normal (${C("/guilda fundar TAG Nome")} e depois a confirmação). A prévia mostra o consumo do direito.</p>
    <p class="gd-nota">O desconto VIP vale só para a fundação. A manutenção semanal de 2.000.000 de Coins continua sendo responsabilidade coletiva da Guilda.</p>`},
  {id:"entrar", t:"Como entrar em uma Guilda", html:`
    <div class="gd-cols">
      <div class="gd-card"><h4>Procure um grupo</h4><p>${C("/guildas")} lista as Guildas, ${C("/guilda ranking")} mostra a classificação e ${C("/guilda ver TAG")} abre os detalhes.</p></div>
      <div class="gd-card"><h4>Pela candidatura</h4><p>Envie com ${C("/guilda aplicar TAG")} acompanhe em ${C("/guilda aplicacoes")} e retire com ${C("/guilda aplicar cancelar TAG")}</p><p class="gd-mini">Quem recruta usa ${C("/guilda candidaturas")} ${C("/guilda candidatura aceitar NICK")} e ${C("/guilda candidatura recusar NICK")}</p></div>
      <div class="gd-card"><h4>Por convite</h4><p>Um integrante autorizado usa ${C("/guilda convidar NICK")} com o convidado online. O convite vale 5 minutos: ${C("/guilda aceitar")} ou ${C("/guilda recusar")}</p></div>
    </div>
    <p class="gd-nota"><b>Entrei e não consigo construir.</b> Quem entra começa como Iniciado, com acesso limitado. A liderança promove com ${C("/guilda cargo definir NICK membro")}</p>`},
  {id:"terreno", t:"Portal e escolha do terreno", html:`
    <p class="gd-p">Com a Guilda fundada, ativa e com a manutenção em dia, atravesse o portal do spawn principal. Guildas sem terreno chegam ao ponto de entrada. Guildas com cidade vão direto ao próprio Núcleo.</p>
    <ol class="gd-passos curto">
      <li>Explore e fique no chunk que será o centro da cidade.</li>
      <li>Use ${C("/guilda terreno definir")} e leia a prévia e os avisos de distância ou conflito.</li>
      <li>Confirme com ${C("/guilda terreno confirmar")} em até 5 minutos, no mesmo chunk.</li>
    </ol>
    <p class="gd-p">Depois, ${C("/guilda ir")} leva de volta à cidade e ${C("/guilda nucleo")} mostra o Núcleo. Um chunk tem 16 × 16 blocos, e F3 + G mostra as bordas.</p>
    <p class="gd-nota">Escolha o centro com cuidado: a confirmação estabelece a cidade e não serve para mudar de terreno depois.</p>`},
  {id:"setores", t:"Cidade e setores", html:`
    <p class="gd-p">Abra ${C("/guilda painel")} ou interaja com o Núcleo. O território é dividido em setores por chunk. Os comandos de setor valem para o chunk em que você está: ${C("/guilda setor info")} ${C("/guilda setor definir residencial")} ${C("/guilda setor definir industrial")}</p>
    <div class="gd-setores">
      ${[["Comum","Convivência e atividades compartilhadas"],["Residencial","Moradias com acesso controlado"],["Industrial","Máquinas e produção, com limite por nível"],["Armazenamento","Estoque estratégico, só o Grão-Mestre altera"],["Administração","Gestão e áreas restritas à liderança"],["Público","Interação com visitantes, quando habilitada"],["Diplomático","Contatos externos"],["Arena e Eventos","Atividades da cidade"],["Bloqueado","Uso suspenso"]].map(([n,d])=>`<div><b>${n}</b><span>${d}</span></div>`).join("")}
    </div>
    <p class="gd-nota">O tipo do setor organiza uso e permissões. Ele não dá bônus de produção, buffs nem carregamento de chunks.</p>`},
  {id:"permissoes", t:"Permissões e segurança", html:`
    <p class="gd-p">Cargo na Guilda e acesso ao setor são camadas diferentes. Cada chunk tem seus próprios vínculos:</p>
    <div class="gd-setores quatro">
      <div><b>Responsável</b><span>Cuida daquele espaço</span></div>
      <div><b>Autorizado</b><span>Usa e constrói no setor</span></div>
      <div><b>Convidado</b><span>Usa recursos e abre armazenamento, sem construir</span></div>
      <div><b>Aliado externo</b><span>De outra Guilda, interações limitadas, sem armazenamento</span></div>
    </div>
    <p class="gd-p">No chunk certo, com o jogador online: ${C("/guilda setor responsavel alternar NICK")} ${C("/guilda setor autorizado alternar NICK")} ${C("/guilda setor convidado alternar NICK")} ${C("/guilda setor aliado alternar NICK")}</p>`},
  {id:"hierarquia", t:"Hierarquia", html:`
    <ol class="gd-cargos">
      <li><span>1</span><b>Grão-Mestre</b><small>Líder, decisões principais e setores críticos</small></li>
      <li><span>até 2</span><b>Regente</b><small>Administra grande parte da organização</small></li>
      <li><span>até 4</span><b>Guardião</b><small>Ajuda na gestão, convida e expulsa cargos inferiores</small></li>
      <li><span></span><b>Membro</b><small>Participa conforme os setores e autorizações</small></li>
      <li><span></span><b>Iniciado</b><small>Recruta: pode ajudar financeiramente, precisa de promoção</small></li>
    </ol>
    <p class="gd-p">Para alterar: ${C("/guilda cargo definir NICK membro")} ${C("/guilda cargo definir NICK guardiao")} ${C("/guilda cargo definir NICK regente")} Você precisa de hierarquia superior à da pessoa e à do cargo concedido. Veja a equipe com ${C("/guilda membros")}</p>`},
  {id:"funcoes", t:"Funções e classes de guerra", html:`
    <div class="gd-cols">
      <div class="gd-card"><h4>Funções, acumuláveis</h4><ul class="gd-ul"><li><b>Arquiteto:</b> planeja os setores permitidos.</li><li><b>Tesoureiro:</b> finanças e evolução.</li><li><b>Artífice:</b> usa e configura máquinas.</li><li><b>Diplomata:</b> relações e acessos diplomáticos.</li><li><b>Mestre de Guerra:</b> organiza as classes de combate.</li></ul><p class="gd-mini">${C("/guilda funcao dar NICK artifice")} ${C("/guilda funcao remover NICK artifice")}</p></div>
      <div class="gd-card"><h4>Classes de guerra</h4><div class="gd-classes">${["Guerreiro","Tanque","Mago","Atirador","Suporte"].map(c=>`<span>${c}</span>`).join("")}</div><p>Consulte com ${C("/guilda classe")} e defina com ${C("/guilda classe definir NICK tanque")}</p><p class="gd-mini">As classes organizam o grupo e não dão buffs automáticos.</p></div>
    </div>`},
  {id:"financas", t:"Coins, Dracmas e reservas", html:`
    <div class="gd-reservas">
      <div><span class="gd-pill">Dracmas</span><h4>Tesouro</h4><p>Paga o desenvolvimento e a evolução.</p><p class="gd-mini">${C("/guilda banco")} ${C("/guilda banco depositar VALOR")} ${C("/guilda banco extrato")}</p></div>
      <div><span class="gd-pill">Coins</span><h4>Reserva de manutenção</h4><p>Paga a taxa semanal de 2.000.000.</p><p class="gd-mini">${C("/guilda manutencao")} ${C("/guilda manutencao depositar VALOR")}</p></div>
      <div><span class="gd-pill">Materiais</span><h4>Cofre de Recursos</h4><p>Guarda materiais e troféus da progressão.</p><p class="gd-mini">${C("/guilda cofre")} ${C("/guilda cofre status")} ${C("/guilda cofre contribuir")}</p></div>
    </div>
    <p class="gd-nota">Escolha o destino certo ao contribuir: Dracmas no Tesouro não pagam a manutenção em Coins. Nos comandos, use números sem separadores, como 2000000.</p>`},
  {id:"evolucao", t:"Evolução: do nível 1 ao 5", html:`
    <p class="gd-p">Cada nível amplia o território, a capacidade de membros e o limite de setores industriais.</p>
    <div class="gd-niveis">
      ${[["1 → 2","500 mil","1 ATM Star","A + B","20",""],["2 → 3","2 milhões","5 ATM Stars","A + B + C","30","4.096"],["3 → 4","5 milhões","10 ATM Stars","A a D","40","8.192"],["4 → 5","15 milhões","1 bloco de ATM Star 3x","A a E","50","16.384"]].map(([n,d,s,col,t,u],i)=>`<div class="gd-nivel n${i+2}"><span class="gd-nv">${n}</span><dl><div><dt>Dracmas</dt><dd>${d}</dd></div><div><dt>ATM Star</dt><dd>${s}</dd></div><div><dt>Troféus</dt><dd>${t} (coleções ${col})</dd></div>${u?`<div><dt>Urânio 235 e 238</dt><dd>${u} de cada</dd></div>`:""}</dl></div>`).join("")}
    </div>
    <ol class="gd-passos curto">
      <li>Defina o território e mantenha a manutenção em dia.</li>
      <li>Complete os materiais e troféus no cofre. Veja o que falta em ${C("/guilda cofre status")}</li>
      <li>Abasteça o Tesouro com as Dracmas necessárias e confira XP e prestígio.</li>
      <li>Uma pessoa autorizada usa ${C("/guilda cofre evoluir")}</li>
    </ol>
    <p class="gd-nota">Além dos marcos acima, o cofre pede recursos tecnológicos, mágicos e comprimidos. Os materiais da etapa são consumidos e o excedente continua guardado.</p>`},
  {id:"trofeus", t:"Troféus da progressão", html:`
    <p class="gd-p">São 50 troféus exclusivos em 5 coleções, emitidos para quem dá o último golpe na criatura correspondente, dentro do Mundo das Guildas. Item comum, renomeado ou craftado não substitui o troféu autêntico.</p>
    <div class="gd-col-abas" role="tablist" aria-label="Coleções de troféus" id="gdColAbas"></div>
    <div class="gd-trofeus" id="gdTrofeus"></div>
    <p class="gd-nota">As coleções são cumulativas e os troféus são consumidos a cada evolução: para o próximo nível, é preciso conquistá-los de novo. Se houver troféus aguardando espaço, use ${C("/guilda trofeus receber")}</p>`},
  {id:"premios", t:"Prêmios por evolução", html:`
    <p class="gd-p">Quem está na Guilda quando o upgrade é concluído, inclusive offline, recebe chaves das cinco crates: Applied Energistics 2, Ars Nouveau, Create, Draconic Evolution e Iron's Spells.</p>
    <div class="gd-chaves">${[["Nível 2",1],["Nível 3",2],["Nível 4",3],["Nível 5",5]].map(([n,q])=>`<div><span>${n}</span><b>${q}</b><small>chave${q>1?"s":""} de cada crate</small><em>${q*5} no total</em></div>`).join("")}</div>
    <p class="gd-p">Consulte em ${C("/guilda recompensas")} e retire com ${C("/guilda recompensas receber")} Quem entrar depois não recebe o prêmio daquela evolução.</p>`},
  {id:"manutencao", t:"Manutenção semanal e Hiato", html:`
    <div class="gd-linha">
      <div><span>Semana a semana</span><b>2.000.000 Coins</b><p>Saem da reserva coletiva. A primeira cobrança vem 7 dias após a fundação.</p></div>
      <div class="alerta-gd"><span>Faltou saldo</span><b>Hiato</b><p>Acesso ao Mundo das Guildas suspenso. Construções, cargos e canais são preservados.</p></div>
      <div class="perigo-gd"><span>Após 10 dias</span><b>Encerramento</b><p>Cargo e canais do Discord são removidos. As construções não são apagadas, mas a área deixa de ser garantida.</p></div>
    </div>
    <p class="gd-p">Os membros dividem a contribuição como quiserem: o sistema não cobra de cada carteira. Para sair do Hiato, deposite em ${C("/guilda manutencao depositar VALOR")} O líder recebe lembretes no Discord, se a conta estiver vinculada.</p>`},
  {id:"colossos", t:"Colossos e prêmios dos bosses", html:`
    <p class="gd-p">Colossos são encontros do sistema de Guildas, com vida, dano e regras diferentes das criaturas comuns do modpack. Organize dano, resistência e suporte.</p>
    <div class="gd-reservas">
      <div><span class="gd-pill">Último golpe</span><h4>Prêmio principal</h4><p>Os itens principais e os troféus vão para quem dá o golpe final.</p></div>
      <div><span class="gd-pill">Dano</span><h4>Prêmio proporcional</h4><p>A moeda do encontro é dividida pelo dano efetivo registrado.</p></div>
      <div><span class="gd-pill">Participação</span><h4>Itens de participação</h4><p>Quem causou dano recebe a lista de itens do encontro.</p></div>
    </div>
    <div class="gd-divisao"><b>Exemplo com 500.000 Dracmas</b>${[[50,"250.000"],[30,"150.000"],[20,"100.000"]].map(([p,v])=>`<div><span style="--p:${p}%"></span><em>${p}% do dano</em><strong>${v}</strong></div>`).join("")}</div>
    <p class="gd-p">${C("/guilda colosso")} ${C("/guilda colosso ranking")} ${C("/guilda colosso resultado")} ${C("/guilda colosso historico")} Estar perto do boss não conta: só o dano registrado.</p>`},
  {id:"pvp", t:"PvP e proteção do mundo", html:`
    <p class="gd-p">No Mundo das Guildas, o PvP é controlado pelo sistema de eventos e fica nas zonas de Colossos ativos com PvP habilitado. Marcar um setor como Arena e Eventos não liga o PvP dele.</p>
    <p class="gd-p">A paisagem fora das cidades e das reservas tem restrições de quebra, colocação e interação. Se uma ação for bloqueada, leia o aviso: ele diz se é área protegida, reserva, falta de cargo ou de autorização.</p>`},
  {id:"discord", t:"Sua Guilda no Discord", html:`
    <div class="gd-setores quatro">
      <div><b>Cargo próprio</b><span>No formato [TAG] Nome da Guilda</span></div>
      <div><b>Canal de texto</b><span>Privado, só membros e administração</span></div>
      <div><b>Canal de voz</b><span>Todos veem, só os membros entram</span></div>
      <div><b>Líder de Guilda</b><span>Identificação especial do Grão-Mestre</span></div>
    </div>
    <p class="gd-p">Mantenha sua conta do Minecraft vinculada para receber os acessos. Entradas, saídas e trocas de liderança atualizam tudo sozinhas.</p>`},
  {id:"lideranca", t:"Liderança, saída e dissolução", html:`
    <div class="gd-cols">
      <div class="gd-card"><h4>Transferir a liderança</h4><p>${C("/guilda lideranca transferir NICK")} e ${C("/guilda lideranca confirmar")} O antigo líder vira Regente.</p></div>
      <div class="gd-card"><h4>Sair ou expulsar</h4><p>${C("/guilda sair")} ou ${C("/guilda expulsar NICK")} O líder precisa resolver a sucessão antes de sair.</p></div>
      <div class="gd-card"><h4>Dissolver</h4><p>${C("/guilda dissolver")} e ${C("/guilda dissolver confirmar")} Organize saldos e bens antes. As construções não são apagadas.</p></div>
    </div>`},
  {id:"vitoriosa", t:"A Guilda Vitoriosa do Mês", html:`
    <div class="gd-vitoria"><div><h4>Evento mensal entre as Guildas</h4><p>Previsto para começar entre meados e o fim de novembro. A Guilda campeã terá suas cores na decoração do spawn principal do Refúgio, em um dos lugares mais vistos do servidor.</p><p class="gd-mini">Regras e critérios serão anunciados no Discord.</p></div></div>`},
  {id:"comandos", t:"Comandos do dia a dia", html:`
    <div class="gd-rapidos">${[["/guilda ajuda","Ajuda geral"],["/guilda info","Informações da sua Guilda"],["/guilda membros","Integrantes e cargos"],["/guilda ir","Voltar à cidade"],["/guilda painel","Planejamento e gestão"],["/guilda setor info","Área em que você está"],["/guilda cofre status","Requisitos do próximo nível"],["/guilda banco","Tesouro de Dracmas"],["/guilda manutencao","Reserva semanal de Coins"],["/guilda recompensas","Entregas pendentes"],["/guilda salario","Salários, quando habilitados"],["/guilda direitos","Seus direitos de fundação"]].map(([c,d])=>`<div>${C(c)}<span>${d}</span></div>`).join("")}</div>
    <p class="gd-nota">Precisa de ajuda? <a data-link="ticket" href="https://discord.gg/cM8F5sTetW" target="_blank" rel="noopener">Abra um ticket no Discord</a> com seu nick, a TAG, o comando usado e o aviso recebido, com print se possível.</p>`}
];
const COLECOES = {
  A:{nivel:"Exigida desde o nível 2", t:[["Escama Ancestral da Naga","Naga"],["Insígnia do Minoshroom","Minoshroom"],["Selo do Slider","Slider"],["Relíquia do Guardião Esquecido","Guardião Esquecido"],["Pele Ancestral do Yeti","Alpha Yeti"],["Brasão dos Cavaleiros Fantasmas","Cavaleiros Fantasmas"],["Runa do Arquievocador","Archevoker"],["Runa do Necromante","Necromante"],["Carapaça Imperial de Ametista","Caranguejo de Ametista"],["Brasa do Revenant","Ignited Revenant"]]},
  B:{nivel:"Exigida desde o nível 2", t:[["Coroa Espectral do Lich","Lich"],["Lágrima Ancestral do Ur-Ghast","Ur-Ghast"],["Diadema da Rainha da Neve","Rainha da Neve"],["Sangue Primordial da Hidra","Hidra da Twilight Forest"],["Insígnia da Rainha Valquíria","Rainha Valquíria"],["Coração da Quimera Wilden","Wilden Chimera"],["Fragmento do Golem do End","Ender Golem"],["Núcleo do Prowler","The Prowler"],["Olho da Wadjet","Wadjet"],["Emblema do Kobolediator","Kobolediator"]]},
  C:{nivel:"Exigida a partir do nível 3", t:[["Estrela do Wither Soberano","Wither"],["Memória do Dragão do End","Ender Dragon"],["Centelha do Espírito Solar","Espírito do Sol"],["Chave do Gatekeeper","The Gatekeeper"],["Núcleo do Golem Estelar","Starlight Golem"],["Fragmento do Permafrost","Permafrost"],["Pinça do Clawdian","Clawdian"],["Selo do Aptrgangr","Aptrgangr"],["Coração da Hidra Primordial","Hidra de Ice and Fire"],["Olhar da Górgona","Górgona"]]},
  D:{nivel:"Exigida a partir do nível 4", t:[["Coração do Dragão Ígneo","Dragão de Fogo"],["Coração do Dragão Glacial","Dragão de Gelo"],["Coração do Dragão Tempestuoso","Dragão de Raios"],["Presa da Serpente Abissal","Serpente Marinha"],["Olho do Ciclope Ancestral","Ciclope"],["Segmento do Verme das Profundezas","Death Worm"],["Eco do Warden","Warden"],["Brasão do Piglich","Piglich"],["Fragmento da Coroa do Rei Morto","Rei Morto"],["Chama Primeva de Tyros","Tyros"]]},
  E:{nivel:"Exigida para o nível 5", t:[["Crânio do Remanescente Ancestral","Ancient Remnant"],["Olho do Harbinger","The Harbinger"],["Chifre da Monstruosidade","Netherite Monstrosity"],["Núcleo do Guardião do End","Ender Guardian"],["Olho Abissal do Leviatã","The Leviathan"],["Olho da Tempestade de Scylla","Scylla"],["Fragmento Maldito de Maledictus","Maledictus"],["Essência Incandescente de Ignis","Ignis"],["Núcleo do Eclipse Lunar","Lunar Monstrosity"],["Selo do Guardião do Caos","Draconic Guardian"]]}
};
document.getElementById("gdIndice").innerHTML = GSEC.map(s=>`<li><a href="#gd-${s.id}" data-sec="${s.id}">${s.t}</a></li>`).join("");
document.getElementById("gdCorpo").innerHTML = GSEC.map((s,i)=>`<section class="rg-sec gd-sec" data-sec="${s.id}" id="gd-${s.id}"><h2><span class="rg-num">${i+1}</span>${s.t}</h2>${s.html}</section>`).join("");
const colAbas = document.getElementById("gdColAbas");
colAbas.innerHTML = Object.keys(COLECOES).map((k,i)=>`<button role="tab" aria-selected="${i===0}" data-col="${k}" ${i?'tabindex="-1"':""}>Coleção ${k}</button>`).join("");
function mostraCol(k){
  const c = COLECOES[k];
  document.getElementById("gdTrofeus").innerHTML = `<p class="gd-col-nivel">${c.nivel}</p><ol>${c.t.map(([n,cr],i)=>`<li><span class="gd-tid">${k}${String(i+1).padStart(2,"0")}</span><div><b>${n}</b><small>${cr}</small></div></li>`).join("")}</ol>`;
}
abas(colAbas, b=>mostraCol(b.dataset.col)); mostraCol("A");
document.getElementById("viewGuia").addEventListener("click", async e=>{
  const b = e.target.closest("[data-cmd]"); if(!b) return;
  try{ await navigator.clipboard.writeText(b.dataset.cmd); avisar("Comando copiado: " + b.dataset.cmd); }catch(x){ avisar(b.dataset.cmd); }
});
const secsGd = [...document.querySelectorAll("#gdCorpo .gd-sec")];
function indiceGuia(){
  if(document.getElementById("viewGuia").hidden) return;
  let at = secsGd[0];
  for(const s of secsGd){ if(s.getBoundingClientRect().top < innerHeight*0.3) at = s; }
  document.querySelectorAll("#gdIndice a").forEach(a=>a.classList.toggle("ativo", a.dataset.sec === at.dataset.sec));
}
addEventListener("scroll", indiceGuia, {passive:true});




/* ================= Rank-up (página de apresentação, sem revelar requisitos) ================= */
/* Quantos degraus aparecem abertos; o resto fica escondido ("descubra no jogo"). */
const RU_ABERTOS = 4;
const RU_ESCADA = [
  ["Stone","minecraft:stone"], ["Copper","minecraft:copper_ingot"], ["Iron","minecraft:iron_ingot"], ["Redstone","minecraft:redstone"],
  ["Gold","minecraft:gold_ingot"], ["Diamond","minecraft:diamond"], ["Netherite","minecraft:netherite_ingot"], ["Steam","modern_industrialization:bronze_boiler"],
  ["Osmium","mekanism:ingot_osmium"], ["Uraninite","powah:uraninite"], ["Tungsten","modern_industrialization:tungsten_ingot"], ["Allthemodium","allthemodium:allthemodium_ingot"],
  ["Vibranium","allthemodium:vibranium_ingot"], ["Unobtainium","allthemodium:unobtainium_ingot"], ["Star","allthetweaks:atm_star"]
];
function criarRankup(){
  document.head.insertAdjacentHTML("beforeend", `<style id="rf-rankup-css">
.ru-topo{padding:140px 0 84px}
.ru-topo::before{background-image:url(https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/img/rankup.webp);background-position:62% 50%}
.ru-topo::after{background:linear-gradient(90deg,rgba(14,10,34,.95) 0%,rgba(14,10,34,.78) 45%,rgba(14,10,34,.2) 100%)}
.ru-nums{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:34px;max-width:860px}
.ru-nums div{padding:16px 18px;border-radius:14px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}
.ru-nums b{display:block;font:700 clamp(26px,3vw,34px)/1 var(--display);color:#FFD36B}
.ru-nums span{display:block;margin-top:6px;font-size:14px;color:rgba(255,255,255,.75)}
.ru-escada{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;counter-reset:ru}
.ru-deg{position:relative;counter-increment:ru;padding:20px 14px 18px;border-radius:16px;background:#fff;box-shadow:0 0 0 1px var(--linha);text-align:center}
.ru-deg::before{content:counter(ru);position:absolute;top:10px;left:12px;font:700 12px/1 var(--display);color:var(--tinta-2)}
.ru-deg img{width:56px;height:56px;image-rendering:pixelated;object-fit:contain;display:block;margin:2px auto 10px}
.ru-deg b{display:block;font:700 17px/1.2 var(--display)}
.ru-deg small{display:block;margin-top:4px;font:600 12px/1 var(--pixel);color:var(--tinta-2);letter-spacing:.06em}
.ru-deg.fechado{background:var(--cosmos);box-shadow:0 0 0 1px rgba(255,255,255,.06)}
.ru-deg.fechado::before{color:rgba(255,255,255,.45)}
.ru-deg.fechado img{filter:brightness(0) invert(.18) drop-shadow(0 0 1px rgba(255,255,255,.35))}
.ru-deg.fechado b{color:rgba(255,255,255,.55);letter-spacing:.2em}
.ru-deg.fechado small{color:rgba(255,255,255,.4)}
.ru-deg.topo{background:radial-gradient(90% 90% at 50% 30%,rgba(242,176,30,.35),transparent 70%),var(--cosmos)}
.ru-deg.topo img{filter:brightness(0) invert(.85) sepia(1) saturate(4) hue-rotate(5deg) drop-shadow(0 0 10px rgba(255,201,58,.8))}
.ru-deg.topo b{color:#FFD36B;letter-spacing:0}
.ru-passos{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;counter-reset:rp}
.ru-passos li{counter-increment:rp;padding:22px;border-radius:16px;background:#fff;box-shadow:0 0 0 1px var(--linha)}
.ru-passos li::before{content:counter(rp);display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--cosmos);color:#FFD36B;font:700 16px/1 var(--display);margin-bottom:12px}
.ru-passos h3{font:700 18px/1.25 var(--display);margin:0 0 6px}
.ru-passos p{margin:0;color:var(--tinta-2);font-size:15px;line-height:1.55}
.ru-ganhos{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.ru-ganhos li{display:flex;gap:14px;align-items:center;padding:16px 18px;border-radius:14px;background:#fff;box-shadow:0 0 0 1px var(--linha);font-size:15px}
.ru-ganhos img{width:36px;height:36px;image-rendering:pixelated;object-fit:contain;flex:none}
.ru-ganhos b{display:block;font:700 16px/1.25 var(--display)}
.ru-ganhos span{color:var(--tinta-2);font-size:14px}
.ru-fim{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap;padding:30px 32px;border-radius:20px;background:var(--cosmos);color:#fff}
.ru-fim h3{font:700 clamp(22px,2.4vw,28px)/1.2 var(--display);margin:0 0 6px}
.ru-fim p{margin:0;color:rgba(255,255,255,.75)}
.ru-fim .acoes{display:flex;gap:12px;flex-wrap:wrap}
.ru-sec{margin:0 0 64px}
.ru-sec>h2{font:700 clamp(24px,2.8vw,34px)/1.15 var(--display);margin:0 0 8px}
.ru-sec>p{margin:0 0 24px;color:var(--tinta-2);max-width:62ch}
@media (max-width:980px){.ru-escada{grid-template-columns:repeat(3,minmax(0,1fr))}.ru-passos,.ru-ganhos{grid-template-columns:1fr}.ru-nums{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:520px){.ru-escada{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>`);
  const ic = id=>`<img src="${ICONES + id.replace(":", "__")}.png" alt="" loading="lazy">`;
  const total = RU_ESCADA.length;
  const v = document.createElement("main"); v.id = "viewRankup"; v.hidden = true;
  v.innerHTML = `
  <section class="rg-topo ru-topo">
    <div class="wrap">
      <span class="selo" style="background:rgba(242,176,30,.15);color:#FFD36B;box-shadow:inset 0 0 0 1px rgba(242,176,30,.4)">Só no Refúgio</span>
      <h1>Rank-up</h1>
      <p>Da pedra à Estrela. Cada degrau pede progresso de verdade no ATM10 e devolve recompensas que aceleram o próximo.</p>
      <div class="ru-nums"><div><b>${total}</b><span>ranks</span></div><div><b>${total * 3}</b><span>níveis para subir</span></div><div><b>+1.000</b><span>entregas no caminho</span></div><div><b>Todos</b><span>os níveis dão prêmios</span></div></div>
    </div>
    <div class="hero-borda" aria-hidden="true"></div>
  </section>
  <section class="secao" style="padding-top:64px">
    <div class="wrap">
      <div class="ru-sec"><h2>A escada</h2><p>Cada rank tem três níveis (I, II e III). Os primeiros você conhece aqui. O resto só se revela para quem chega lá.</p>
        <ol class="ru-escada">${RU_ESCADA.map(([n, id], i)=>{
          if(i < RU_ABERTOS) return `<li class="ru-deg">${ic(id)}<b>${n}</b><small>I · II · III</small></li>`;
          if(i === total - 1) return `<li class="ru-deg fechado topo">${ic(id)}<b>O topo</b><small>só para os melhores</small></li>`;
          return `<li class="ru-deg fechado">${ic(id)}<b>???</b><small>descubra no jogo</small></li>`;
        }).join("")}</ol></div>
      <div class="ru-sec"><h2>Como funciona</h2><p>Sem atalho e sem compra: o rank-up mede o quanto você avançou no modpack.</p>
        <ol class="ru-passos">
          <li><h3>Junte as entregas</h3><p>Cada nível pede um conjunto de itens do ATM10. Começa no básico e vai até os materiais mais raros do modpack.</p></li>
          <li><h3>Pague a taxa</h3><p>Além dos itens, cada nível cobra um valor em dinheiro do jogo, que cresce conforme você sobe.</p></li>
          <li><h3>Suba e receba</h3><p>Use <button type="button" class="gcmd" data-copiar="/rankup">/rankup</button> e leve as recompensas na hora. Todo o servidor fica sabendo.</p></li>
        </ol></div>
      <div class="ru-sec"><h2>O que você ganha</h2><p>Os prêmios mudam a cada nível e acompanham a fase do jogo em que você está.</p>
        <ul class="ru-ganhos">
          <li>${ic("minecraft:gold_ingot")}<div><b>Dinheiro do jogo</b><span>Para investir na base e na economia</span></div></li>
          <li>${ic("minecraft:map")}<div><b>Mais terreno protegido</b><span>Claims permanentes a mais conforme sobe</span></div></li>
          <li>${ic("mekanism:digital_miner")}<div><b>Chunk loaders</b><span>Nos ranks avançados, sua base trabalha sozinha</span></div></li>
          <li>${ic("minecraft:chest")}<div><b>Itens de cada fase</b><span>Equipamentos e máquinas do momento em que você está</span></div></li>
          <li>${ic("minecraft:name_tag")}<div><b>Tag no chat</b><span>O símbolo do seu rank ao lado do nome</span></div></li>
          <li>${ic("minecraft:firework_rocket")}<div><b>Anúncio para todos</b><span>Cada subida aparece no chat do servidor</span></div></li>
        </ul></div>
      <div class="ru-fim"><div><h3>Os requisitos só aparecem dentro do jogo</h3><p>Entre no servidor e digite <button type="button" class="gcmd" data-copiar="/rankup info">/rankup info</button> para ver o seu próximo nível.</p></div><div class="acoes"><a class="btn btn-ouro" href="#jogar" data-jogar>Jogar agora</a><a class="btn btn-claro" href="#rankings">Ver quem está no topo</a></div></div>
    </div>
  </section>`;
  const ref = document.getElementById("viewForum") || document.getElementById("viewGuia") || document.querySelector("main:last-of-type");
  ref.after(v);
  v.addEventListener("click", e=>{ const b = e.target.closest("[data-copiar]"); if(!b) return; navigator.clipboard.writeText(b.dataset.copiar).then(()=>avisar("Comando copiado: " + b.dataset.copiar), ()=>{}); });
  return v;
}
/* cartão "Rank-up exclusivo" da página inicial leva para a página */
(function(){ const li = [...document.querySelectorAll(".dif-grade li")].find(x=>/Rank-up/.test(x.textContent)); if(li && !li.querySelector(".ru-link")) li.insertAdjacentHTML("beforeend", '<a class="ru-link" href="#rankup" style="display:inline-block;margin-top:10px;font-weight:600;color:var(--violeta-texto)">Conhecer o rank-up</a>'); })();

/* ================= Wiki (guias em Markdown no GitHub) ================= */
let WIKI_IDX = null, wikiPromessa = null;
function carregarIndiceWiki(){
  if(!wikiPromessa) wikiPromessa = fetch(CONFIG.wiki.base + "indice.json", {cache:"no-cache"}).then(r=>r.ok ? r.json() : Promise.reject()).then(J=>{ WIKI_IDX = J; return J; });
  return wikiPromessa;
}
const wikiSlug = t => /^[a-z0-9-]{1,60}$/.test(t) ? t : "";
function wikiLink(g){ return g.url && /^#[\w-]+$/.test(g.url) ? g.url : "#wiki/" + g.slug; }
const ICONES = "https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/icones/";
function iconeItem(id, cls){
  if(!id || !/^[a-z0-9_.-]+:[a-z0-9_.\/-]+$/.test(id)) return `<span class="${cls} qi-vazio" aria-hidden="true"></span>`;
  return `<img class="${cls}" src="${ICONES + id.replace(":", "__").replace(/\//g, "_")}.png" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:this.className+' qi-vazio'}))">`;
}
let QIDX = null;
function carregarQuestsIdx(){ if(!QIDX) QIDX = fetch(CONFIG.wiki.base + "quests/indice.json", {cache:"no-cache"}).then(r=>r.ok ? r.json() : Promise.reject()); return QIDX; }
function abrirQuests(cap){
  cap = /^[a-z0-9-]{1,80}$/.test(cap) ? cap : "";
  const chave = "quests/" + cap; if(wikiAberto === chave) return; wikiAberto = chave;
  ["wkInicio","wkPagina"].forEach(i=>document.getElementById(i).hidden = true);
  document.getElementById("wkQuests").hidden = false; document.getElementById("wkBuscaBox").hidden = true; document.querySelector(".wk-migalha").hidden = false;
  const box = document.getElementById("wkQBox"); box.innerHTML = '<p class="wk-carregando">Carregando quests…</p>';
  scrollTo({top:0, behavior:"instant"});
  carregarQuestsIdx().then(I=>{
    if(!cap){
      document.getElementById("wkTitulo").textContent = "Livro de quests"; document.getElementById("wkResumo").textContent = "Todas as quests do ATM10 em português. Escolha um capítulo.";
      document.getElementById("wkCat").textContent = "Livro de quests"; document.title = "Livro de quests · Wiki do Refúgio";
      box.innerHTML = I.grupos.map(g=>`<section class="wk-cat"><h2>${esc(g.nome)}</h2><ul class="qc-lista">${g.capitulos.map(c=>`<li><a class="qc" href="#wiki/quests/${esc(c.slug)}">${iconeItem(c.icone, "qc-ic")}<span><b>${esc(c.titulo)}</b><small>${c.quests} ${c.quests === 1 ? "quest" : "quests"}</small></span></a></li>`).join("")}</ul></section>`).join("");
      return;
    }
    const grupo = I.grupos.find(g=>g.capitulos.some(c=>c.slug === cap));
    return fetch(CONFIG.wiki.base + "quests/" + cap + ".json", {cache:"no-cache"}).then(r=>r.ok ? r.json() : Promise.reject()).then(C=>{
      if(wikiAberto !== chave) return;
      document.getElementById("wkTitulo").textContent = C.titulo; document.getElementById("wkResumo").textContent = C.subtitulo || `${C.quests.length} quests neste capítulo.`;
      document.getElementById("wkCat").innerHTML = `<a href="#wiki/quests">Livro de quests</a>${grupo ? " › " + esc(grupo.nome) : ""}`;
      document.title = `${C.titulo} · Livro de quests`;
      const nomeQ = Object.fromEntries(C.quests.map(q=>[q.id, q.titulo]));
      const nav = grupo ? `<nav class="wk-nav qn-nav" aria-label="Capítulos"><h4>${esc(grupo.nome)}</h4><ul>${grupo.capitulos.map(c=>`<li><a href="#wiki/quests/${esc(c.slug)}"${c.slug === cap ? ' class="ativo" aria-current="page"' : ""}>${esc(c.titulo)}</a></li>`).join("")}</ul><h4>Outros</h4><ul><li><a href="#wiki/quests">Todos os capítulos</a></li></ul></nav>` : "<div></div>";
      box.innerHTML = `<div class="qn-grade">${nav}<div><label class="qn-busca"><span class="sr">Buscar quest</span><input id="qnBusca" type="search" placeholder="Buscar quest, item ou tarefa neste capítulo"></label><ol class="qn-lista">${C.quests.map((q, n)=>`
        <li class="qn" id="q-${esc(q.id)}"><div class="qn-cab">${iconeItem(q.icone, "qn-ic")}<div><h3>${esc(q.titulo)}${q.opcional ? ' <span class="qn-op">Opcional</span>' : ""}</h3>${q.subtitulo ? `<p class="qn-sub">${esc(q.subtitulo)}</p>` : ""}</div><span class="qn-n">${n + 1}</span></div>
        ${q.desc.length ? `<div class="qn-desc">${q.desc.map(p=>`<p>${mdInline(p)}</p>`).join("")}</div>` : ""}
        ${q.tarefas.length ? `<div class="qn-bloco"><b>Tarefas</b><ul class="qn-itens">${q.tarefas.map(t=>`<li>${t.item ? iconeItem(t.item, "qn-mini") : '<span class="qn-mini qn-tipo" aria-hidden="true">✓</span>'}<span>${esc(t.nome)}</span>${t.qtd > 1 ? `<em>× ${t.qtd.toLocaleString("pt-BR")}${t.unidade ? " baldes" : ""}</em>` : ""}</li>`).join("")}</ul></div>` : ""}
        ${q.recompensas.length ? `<div class="qn-bloco"><b>Recompensas</b><ul class="qn-itens qn-rec">${q.recompensas.map(r=>`<li>${r.item ? iconeItem(r.item, "qn-mini") : '<span class="qn-mini qn-tipo" aria-hidden="true">★</span>'}<span>${esc(r.nome)}</span>${r.qtd > 1 ? `<em>× ${r.qtd.toLocaleString("pt-BR")}</em>` : ""}</li>`).join("")}</ul></div>` : ""}
        ${q.deps.filter(d=>nomeQ[d]).length ? `<p class="qn-deps">Depois de: ${q.deps.filter(d=>nomeQ[d]).map(d=>`<a href="#wiki/quests/${esc(cap)}" data-ir="q-${esc(d)}">${esc(nomeQ[d])}</a>`).join(", ")}</p>` : ""}
        </li>`).join("")}</ol></div></div>`;
      document.getElementById("qnBusca").addEventListener("input", e=>{ const t = norm(e.target.value.trim()); box.querySelectorAll(".qn").forEach(li=>li.hidden = !!t && !norm(li.textContent).includes(t)); });
    });
  }).catch(()=>{ box.innerHTML = "<p>Não deu para carregar o livro de quests agora. Tente de novo em instantes.</p>"; });
}
/* cartão de guia (usado na vitrine da home e na página da wiki) */
function cartaoWiki(g){
  const cor = /^#[0-9a-fA-F]{6}$/.test(g.cor || "") ? g.cor : "#7B52E6";
  const ic = g.icone && wikiImg(g.icone);
  const tipo = g.autor ? "por " + esc(g.autor) : g.url ? "Página do site" : "Guia";
  return `<li><a class="wk-card" href="${wikiLink(g)}" style="--c:${cor}"><span class="wk-ic">${ic ? `<img src="${ic}" alt="" loading="lazy">` : ""}</span><span class="wk-ct"><b>${esc(g.titulo)}</b><span>${esc(g.resumo || "")}</span></span><em>${tipo}</em></a></li>`;
}
/* vitrine da wiki na página inicial: poucos destaques e um convite para abrir a wiki */
(function vitrineWiki(){
  const sec = document.getElementById("wiki"); if(!sec) return;
  sec.innerHTML = `<div class="wrap wk-vitrine"><div class="wk-vt-txt"><h2 class="titulo">Wiki do Refúgio</h2><p class="lead">Guias do servidor e dos mods do ATM10, do primeiro dia até a ATM Star. Escritos pela equipe, em português.</p><a class="btn btn-ouro" href="#wiki">Abrir a Wiki</a></div><ul class="wk-cards wk-cards-2" id="wkVitrine"></ul></div>`;
  carregarIndiceWiki().then(J=>{
    const gs = (J.guias || []).filter(g=>!g.rascunho), dest = gs.filter(g=>g.destaque);
    document.getElementById("wkVitrine").innerHTML = (dest.length >= 4 ? dest : gs).slice(0, 4).map(cartaoWiki).join("");
  }).catch(()=>{ sec.querySelector(".wk-vitrine ul").remove(); });
})();

/* Markdown simples e seguro: tudo é escapado antes de virar HTML */
function mdInline(t){
  t = esc(t);
  t = t.replace(/`([^`]+)`/g, (m, c)=> c.startsWith("/") ? `<button type="button" class="gcmd" data-copiar="${c}" title="Clique para copiar">${c}</button>` : `<code>${c}</code>`);
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, u)=>{ const src = wikiImg(u); return src ? `<img src="${src}" alt="${alt}" loading="lazy">` : ""; });
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, u)=>{ u = u.replace(/&amp;/g, "&"); if(/^#[\w\/-]*$/.test(u)) return `<a href="${u}">${txt}</a>`; if(/^https:\/\//.test(u)) return `<a href="${esc(u)}" target="_blank" rel="noopener">${txt}</a>`; return txt; });
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  return t;
}
function wikiImg(u){
  u = u.replace(/&amp;/g, "&");
  if(/^(img|itens|kit|ranks|wiki)\/[\w\/.-]+\.(png|webp|jpg|gif)$/.test(u)) return CONFIG.wiki.base.replace(/wiki\/$/, "") + u;
  if(/^https:\/\/(cdn\.jsdelivr\.net|raw\.githubusercontent\.com|i\.imgur\.com)\//.test(u)) return esc(u);
  return "";
}
function md(texto){
  const L = texto.replace(/\r/g, "").split("\n"), out = []; let i = 0;
  const titulos = [];
  while(i < L.length){
    let l = L[i];
    if(!l.trim()){ i++; continue; }
    let m;
    if((m = l.match(/^(#{2,3})\s+(.+)/))){ const n = m[1].length, txt = m[2].trim(); const id = "w-" + norm(txt).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); if(n === 2) titulos.push([id, txt]); out.push(`<h${n} id="${id}">${mdInline(txt)}</h${n}>`); i++; continue; }
    if(/^---+\s*$/.test(l)){ out.push("<hr>"); i++; continue; }
    if(l.startsWith("```")){ const buf = []; i++; while(i < L.length && !L[i].startsWith("```")) buf.push(L[i++]); i++; out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`); continue; }
    if(l.startsWith(">")){ const buf = []; while(i < L.length && L[i].startsWith(">")) buf.push(L[i++].replace(/^>\s?/, ""));
      let tipo = "nota"; const m2 = buf[0].match(/^\[!(DICA|AVISO|IMPORTANTE|NOTA)\]\s*/i); if(m2){ tipo = m2[1].toLowerCase(); buf[0] = buf[0].slice(m2[0].length); }
      const rot = {dica:"Dica", aviso:"Atenção", importante:"Importante", nota:"Nota"}[tipo];
      out.push(`<aside class="wk-caixa wk-${tipo}"><b>${rot}</b>${buf.filter(x=>x.trim()).map(x=>`<p>${mdInline(x)}</p>`).join("")}</aside>`); continue; }
    if(/^\|.*\|\s*$/.test(l)){ const rows = []; while(i < L.length && /^\|.*\|\s*$/.test(L[i])) rows.push(L[i++]);
      const cel = r=>r.trim().replace(/^\||\|$/g, "").split("|").map(c=>c.trim());
      const temCab = rows[1] && /^\|?\s*:?-{2,}/.test(rows[1]);
      const cab = temCab ? cel(rows[0]) : null, corpo = rows.slice(temCab ? 2 : 0).map(cel);
      out.push(`<div class="wk-tabela"><table>${cab ? `<thead><tr>${cab.map(c=>`<th>${mdInline(c)}</th>`).join("")}</tr></thead>` : ""}<tbody>${corpo.map(r=>`<tr>${r.map(c=>`<td>${mdInline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`); continue; }
    if(/^\s*([-*]|\d+\.)\s+/.test(l)){ const ord = /^\s*\d+\./.test(l), buf = [];
      while(i < L.length && /^\s*([-*]|\d+\.)\s+/.test(L[i])){ buf.push(L[i].replace(/^\s*([-*]|\d+\.)\s+/, "")); i++; while(i < L.length && /^\s{2,}\S/.test(L[i]) && !/^\s*([-*]|\d+\.)\s+/.test(L[i])) buf[buf.length - 1] += " " + L[i++].trim(); }
      out.push(`<${ord ? "ol" : "ul"}>${buf.map(x=>`<li>${mdInline(x)}</li>`).join("")}</${ord ? "ol" : "ul"}>`); continue; }
    const buf = [l]; i++;
    while(i < L.length && L[i].trim() && !/^(#{2,3}\s|>|\||```|---|\s*([-*]|\d+\.)\s+)/.test(L[i])) buf.push(L[i++]);
    out.push(`<p>${mdInline(buf.join(" "))}</p>`);
  }
  return {html: out.join("\n"), titulos};
}
function criarWiki(){
  document.head.insertAdjacentHTML("beforeend", `<style id="rf-wiki-css">
.wk-topo{background:linear-gradient(135deg,#1d1438 0%,#2c1d63 60%,#3a2380 100%);padding:130px 0 70px}
.wk-cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.wk-cards-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.wk-card{position:relative;display:grid;grid-template-columns:56px 1fr;gap:16px;align-items:start;height:100%;box-sizing:border-box;padding:20px 20px 40px;background:#fff;border-radius:16px;box-shadow:0 0 0 1px var(--linha);text-decoration:none;color:var(--tinta);transition:box-shadow .2s,transform .2s}
.wk-card:hover{transform:translateY(-2px);box-shadow:0 0 0 1px var(--c),0 14px 30px -18px var(--c)}
.wk-card:focus-visible{outline:3px solid var(--violeta);outline-offset:2px}
.wk-ic{width:56px;height:56px;border-radius:14px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 16%,#fff);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c) 35%,#fff)}
.wk-ic img{width:36px;height:36px;image-rendering:pixelated;object-fit:contain}
.wk-ct b{display:block;font:700 18px/1.25 var(--display);margin:2px 0 6px}
.wk-ct span{display:block;font-size:15px;line-height:1.45;color:var(--tinta-2)}
.wk-card em{position:absolute;left:92px;bottom:14px;font:600 12px/1 var(--corpo);font-style:normal;color:color-mix(in srgb,var(--c) 70%,#1C1535)}
.wk-vitrine{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:56px;align-items:center}
.wk-vt-txt .lead{margin-bottom:26px}
.wk-busca-g{position:relative;max-width:620px;margin-top:26px}
.wk-busca-g input{width:100%;box-sizing:border-box;height:58px;border:0;border-radius:14px;padding:0 20px 0 52px;font:500 17px var(--corpo);color:var(--tinta);background:#fff;box-shadow:0 18px 40px -20px rgba(0,0,0,.6)}
.wk-busca-g svg{position:absolute;left:18px;top:50%;translate:0 -50%;width:20px;height:20px;color:var(--tinta-2)}
.wk-cat{margin:0 0 52px}
.wk-cat h2{font:700 clamp(22px,2.4vw,28px)/1.2 var(--display);margin:0 0 6px}
.wk-cat>p{margin:0 0 20px;color:var(--tinta-2)}
.wk-nada{display:none;padding:40px;text-align:center;color:var(--tinta-2);background:#fff;border-radius:16px;box-shadow:0 0 0 1px var(--linha)}
.qc-lista{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.qc{display:flex;gap:14px;align-items:center;padding:14px 16px;background:#fff;border-radius:14px;box-shadow:0 0 0 1px var(--linha);text-decoration:none;color:var(--tinta);height:100%;box-sizing:border-box;transition:box-shadow .2s,transform .2s}
.qc:hover{transform:translateY(-2px);box-shadow:0 0 0 1px #cfc6e6,0 12px 26px -16px rgba(28,21,53,.35)}
.qc-ic{width:40px;height:40px;flex:none;image-rendering:pixelated;object-fit:contain}
.qc b{display:block;font:700 15px/1.25 var(--display)}
.qc small{color:var(--tinta-2);font-size:13px}
.qi-vazio{display:inline-block;border-radius:8px;background:repeating-linear-gradient(45deg,#ece7f7 0 6px,#f6f3fc 6px 12px)}
.qn-grade{display:grid;grid-template-columns:240px minmax(0,1fr);gap:44px;align-items:start}
.qn-busca input{width:100%;box-sizing:border-box;height:48px;border:1px solid var(--linha);border-radius:12px;padding:0 16px;font:500 15px var(--corpo);background:#fff;color:var(--tinta);margin-bottom:18px}
.qn-lista{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.qn{background:#fff;border-radius:16px;box-shadow:0 0 0 1px var(--linha);padding:20px 22px;scroll-margin-top:96px}
.qn:target,.qn.alvo{box-shadow:0 0 0 2px var(--ouro)}
.qn-cab{display:grid;grid-template-columns:48px 1fr auto;gap:14px;align-items:center}
.qn-ic{width:48px;height:48px;image-rendering:pixelated;object-fit:contain}
.qn h3{font:700 18px/1.25 var(--display);margin:0}
.qn-sub{margin:4px 0 0;color:var(--tinta-2);font-size:14px;font-style:italic}
.qn-n{font:700 13px/1 var(--display);color:var(--tinta-2);background:#F6F4FB;border-radius:8px;padding:6px 8px}
.qn-op{font:600 11px/1 var(--corpo);color:#0E7C78;background:#E3F7F6;border-radius:6px;padding:4px 7px;vertical-align:middle}
.qn-desc{margin:14px 0 0;font-size:15px;line-height:1.6;color:var(--tinta)}
.qn-desc p{margin:0 0 10px;max-width:75ch}
.qn-bloco{margin-top:12px}
.qn-bloco>b{display:block;font:700 13px/1 var(--display);color:var(--tinta-2);margin-bottom:8px}
.qn-itens{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.qn-itens li{display:flex;align-items:center;gap:8px;padding:6px 10px 6px 6px;border-radius:10px;background:#F6F4FB;font-size:14px}
.qn-rec li{background:#FFF7E0}
.qn-itens em{font-style:normal;font-weight:700;color:var(--tinta-2)}
.qn-mini{width:28px;height:28px;image-rendering:pixelated;object-fit:contain}
.qn-tipo{display:grid;place-items:center;font-size:14px;color:var(--violeta-texto);background:#fff;border-radius:8px}
.qn-deps{margin:12px 0 0;font-size:13px;color:var(--tinta-2)}
.qn-deps a{color:var(--violeta-texto);font-weight:600}
@media (max-width:1100px){.qc-lista{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:760px){.qn-grade{grid-template-columns:1fr}.qn-nav{display:none}.qc-lista{grid-template-columns:repeat(2,minmax(0,1fr))}.qn{padding:16px}}
@media (max-width:480px){.qc-lista{grid-template-columns:1fr}}
@media (max-width:980px){.wk-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.wk-vitrine{grid-template-columns:1fr;gap:32px}}
@media (max-width:620px){.wk-cards,.wk-cards-2{grid-template-columns:1fr}}
.wk-topo::before{background-image:url(https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/img/wiki.webp);background-position:70% 45%}
.wk-topo::after{background:linear-gradient(90deg,rgba(14,10,34,.95) 0%,rgba(14,10,34,.8) 45%,rgba(14,10,34,.25) 100%)}
.wk-migalha{font-size:14px;color:rgba(255,255,255,.7);margin:0 0 14px}
.wk-migalha a{color:#FFD36B;text-decoration:none}
.wk-grade{display:grid;grid-template-columns:240px minmax(0,1fr) 200px;gap:44px;align-items:start}
.wk-nav{position:sticky;top:96px;max-height:calc(100vh - 120px);overflow:auto}
.wk-nav h4{font:700 12px/1 var(--display);letter-spacing:.04em;color:var(--tinta-2);margin:18px 10px 8px}
.wk-nav h4:first-child{margin-top:0}
.wk-nav ul{list-style:none;margin:0;padding:0;display:grid;gap:2px}
.wk-nav a{display:block;padding:8px 10px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;color:var(--tinta-2)}
.wk-nav a:hover{background:#fff}
.wk-nav a.ativo{background:#fff;color:var(--tinta);box-shadow:0 0 0 1px var(--linha)}
.wk-art{min-width:0;font-size:17px;line-height:1.7;color:var(--tinta)}
.wk-art h2{font:700 clamp(22px,2.4vw,28px)/1.2 var(--display);margin:44px 0 12px;scroll-margin-top:96px}
.wk-art h3{font:700 19px/1.3 var(--display);margin:28px 0 8px;scroll-margin-top:96px}
.wk-art p{margin:0 0 16px;max-width:72ch}
.wk-art ul,.wk-art ol{margin:0 0 18px;padding-left:22px;max-width:70ch}
.wk-art li{margin:4px 0}
.wk-art a{color:var(--violeta-texto);font-weight:600}
.wk-art code{font:500 15px var(--pixel);background:#EDE8F8;padding:2px 6px;border-radius:5px}
.wk-art pre{background:var(--cosmos);color:#E9E4FF;padding:16px 18px;border-radius:12px;overflow:auto;font-size:14px}
.wk-art pre code{background:none;padding:0;color:inherit}
.wk-art img{max-width:100%;border-radius:12px;box-shadow:0 0 0 1px var(--linha);margin:6px 0 16px}
.wk-art hr{border:0;border-top:1px solid var(--linha);margin:32px 0}
.wk-art strong{font-weight:700}
.wk-caixa{margin:0 0 20px;padding:14px 18px;border-radius:12px;background:#fff;box-shadow:inset 4px 0 0 var(--violeta),0 0 0 1px var(--linha);max-width:70ch}
.wk-caixa b{display:block;font:700 14px/1.2 var(--display);margin-bottom:4px;color:var(--violeta-texto)}
.wk-caixa p{margin:0 0 6px;font-size:16px}
.wk-dica{box-shadow:inset 4px 0 0 var(--ciano),0 0 0 1px var(--linha)}.wk-dica b{color:#0E7C78}
.wk-aviso,.wk-importante{box-shadow:inset 4px 0 0 var(--ouro),0 0 0 1px var(--linha);background:#FFFBEF}.wk-aviso b,.wk-importante b{color:var(--ouro-texto)}
.wk-contrib{display:grid;grid-template-columns:1fr 1.2fr auto;gap:28px;align-items:center;margin-top:18px;padding:26px 30px;border-radius:18px;background:radial-gradient(70% 140% at 0% 0%,rgba(24,181,175,.25),transparent 60%),var(--cosmos);color:rgba(255,255,255,.82)}
.wk-contrib h3{font:700 22px/1.1 var(--display);color:#fff;margin:0 0 8px}
.wk-contrib p{margin:0;font-size:15px}
.wk-contrib ol{margin:0;padding-left:20px;font-size:14px;display:grid;gap:6px}
.wk-contrib b{color:#FFD36B}
@media (max-width:980px){.wk-contrib{grid-template-columns:1fr;gap:18px}}
.wk-autor{display:flex;align-items:center;gap:16px;margin:0 0 30px;padding:16px 20px;border-radius:14px;background:linear-gradient(90deg,rgba(242,176,30,.14),rgba(242,176,30,.03));box-shadow:inset 0 0 0 1.5px rgba(242,176,30,.55)}
.wk-autor img{width:56px;height:56px;image-rendering:pixelated;flex:none}
.wk-autor div{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}
.wk-autor-rot{font-size:13px;color:var(--tinta-2)}
.wk-autor b{font:700 20px/1.15 var(--display)}
.wk-autor div span:last-child:not(.wk-autor-rot){font-size:13px;color:var(--tinta-2)}
.wk-selo{flex:none;padding:6px 10px;border-radius:999px;background:#F2B01E;color:#1b1535;font:700 12px/1 var(--display)}
.wk-contrib-mini{margin:28px 0 0;padding:14px 18px;border-radius:12px;background:#F6F4FB;font-size:14px}
@media (max-width:560px){.wk-autor{flex-wrap:wrap}.wk-selo{order:3}}
.wk-tabela{overflow:auto;margin:0 0 20px;border-radius:12px;box-shadow:0 0 0 1px var(--linha);background:#fff}
.wk-tabela table{border-collapse:collapse;width:100%;font-size:15px;line-height:1.45}
.wk-tabela th,.wk-tabela td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--linha);vertical-align:top}
.wk-tabela td:first-child .gcmd{white-space:nowrap}
.wk-tabela th{font:700 14px var(--display);background:#F6F4FB}
.wk-tabela tr:last-child td{border-bottom:0}
.wk-toc{position:sticky;top:96px;font-size:14px}
.wk-toc b{display:block;font:700 13px var(--display);margin:0 0 8px;color:var(--tinta-2)}
.wk-toc a{display:block;padding:5px 0 5px 12px;border-left:2px solid var(--linha);color:var(--tinta-2);text-decoration:none}
.wk-toc a.ativo{border-color:var(--ouro);color:var(--tinta);font-weight:600}
.wk-rodape{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-top:40px;padding-top:18px;border-top:1px solid var(--linha);font-size:14px;color:var(--tinta-2)}
.wk-rodape a{color:var(--violeta-texto);font-weight:600}
.wk-carregando{color:var(--tinta-2)}
@media (max-width:1100px){.wk-grade{grid-template-columns:220px minmax(0,1fr)}.wk-toc{display:none}}
@media (max-width:760px){.wk-grade{grid-template-columns:1fr}.wk-nav{position:static;max-height:none}.wk-nav-lista{display:none}.wk-nav.aberto .wk-nav-lista{display:block}.wk-art{font-size:16px}}
.wk-nav-btn{display:none}
@media (max-width:760px){.wk-nav-btn{display:flex;width:100%;justify-content:space-between;align-items:center;padding:12px 14px;border-radius:12px;border:1px solid var(--linha);background:#fff;font:600 15px var(--corpo);color:var(--tinta)}}
</style>`);
  const v = document.createElement("main"); v.id = "viewWiki"; v.hidden = true;
  v.innerHTML = `
  <section class="rg-topo wk-topo">
    <div class="wrap">
      <p class="wk-migalha"><a href="#wiki">Wiki</a> <span aria-hidden="true">›</span> <span id="wkCat"></span></p>
      <h1 id="wkTitulo">Wiki do Refúgio</h1>
      <p id="wkResumo"></p>
      <label class="wk-busca-g" id="wkBuscaBox" hidden><span class="sr">Buscar na wiki</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="wkBusca" type="search" placeholder="Buscar guia, mod ou comando" autocomplete="off"></label>
    </div>
    <div class="hero-borda" aria-hidden="true"></div>
  </section>
  <section class="secao" id="wkInicio" style="padding-top:56px" hidden>
    <div class="wrap"><div id="wkCats"></div><p class="wk-nada" id="wkNada">Nenhum guia com essa palavra ainda. Peça o guia no fórum do Discord.</p></div>
  </section>
  <section class="secao" id="wkQuests" style="padding-top:48px" hidden><div class="wrap" id="wkQBox"></div></section>
  <section class="secao" id="wkPagina" style="padding-top:48px">
    <div class="wrap wk-grade">
      <nav class="wk-nav" id="wkNav" aria-label="Guias da wiki"><button class="wk-nav-btn" type="button" id="wkNavBtn" aria-expanded="false">Todos os guias <span aria-hidden="true">▾</span></button><div class="wk-nav-lista" id="wkNavLista"></div></nav>
      <article class="wk-art" id="wkArt"><p class="wk-carregando">Carregando guia…</p></article>
      <aside class="wk-toc" id="wkToc" aria-label="Nesta página"></aside>
    </div>
  </section>`;
  const ref = document.getElementById("viewForum") || document.getElementById("viewGuia") || document.querySelector("main:last-of-type");
  ref.after(v);
  v.querySelector("#wkNavBtn").addEventListener("click", e=>{ const n = document.getElementById("wkNav"); const a = n.classList.toggle("aberto"); e.currentTarget.setAttribute("aria-expanded", a); });
  v.querySelector("#wkBusca").addEventListener("input", filtrarWiki);
  v.querySelector("#wkBusca").addEventListener("keydown", e=>{ if(e.key === "Enter"){ const a = v.querySelector("#wkCats li:not([hidden]) a"); if(a) a.click(); } });
  v.addEventListener("click", e=>{ const b = e.target.closest("[data-copiar]"); if(!b) return; navigator.clipboard.writeText(b.dataset.copiar).then(()=>avisar("Comando copiado: " + b.dataset.copiar), ()=>{}); });
  return v;
}
let wikiAberto = null;
const DESC_CAT = {comeco:"Do download ao primeiro dia no servidor.", servidor:"O que é exclusivo do Refúgio: regras, guildas, votos e mais.", mods:"Os mods mais importantes do ATM10, explicados do zero.", endgame:"Os metais raros e o caminho até a ATM Star."};
function filtrarWiki(){
  const q = norm(document.getElementById("wkBusca").value.trim()); let total = 0;
  document.querySelectorAll("#wkCats .wk-cat").forEach(c=>{ let n = 0; c.querySelectorAll("li").forEach(li=>{ const ok = !q || norm(li.textContent).includes(q); li.hidden = !ok; if(ok) n++; }); c.hidden = !n && (!!q || !c.hasAttribute("data-fixa")); total += n; });
  document.getElementById("wkNada").style.display = total ? "none" : "block";
}
const CONTRIBUIR = `<div class="wk-contrib"><div><h3>Escreva para a wiki</h3><p>Conhece bem um mod, uma farm ou um sistema do servidor? Escreva um guia e ele fica aqui, com o seu nome no topo.</p></div><ol><li>Abra um ticket na modalidade <b>Suporte</b> no Discord.</li><li>Combine o tema do guia com o ADM.</li><li>Escreva o guia e envie pelo ticket.</li><li>Depois da revisão, ele é publicado aqui com o seu nick e a data, e você ganha +1 no badge <b>[Wiki]</b> de Contribuidor da Wiki, que aparece no chat do jogo.</li></ol><a class="btn btn-ouro" href="${CONFIG.links.ticket}" target="_blank" rel="noopener">Abrir ticket de suporte</a></div>`;
function autorWiki(g, n){
  const dt = /^\d{4}-\d{2}-\d{2}$/.test(g.data || "") ? new Date(g.data + "T12:00:00").toLocaleDateString("pt-BR") : "";
  return `<div class="wk-autor"><img data-cab="${esc(g.autor)}" data-cab-tipo="3d" data-cab-tam="96" alt="" width="56" height="56"><div><span class="wk-autor-rot">Wiki escrita por:</span><b>${esc(g.autor)}</b>${dt ? `<span>Data: ${dt}</span>` : ""}</div><span class="wk-selo" title="Badge [Wiki] no jogo">Contribuidor da Wiki · ${n} ${n === 1 ? "página" : "páginas"}</span></div>`;
}
function inicioWiki(){
  document.getElementById("wkQuests").hidden = true;
  const bq = document.getElementById("wkBusca"); if(bq.value){ bq.value = ""; }
  document.getElementById("wkInicio").hidden = false; document.getElementById("wkPagina").hidden = true; document.getElementById("wkBuscaBox").hidden = false;
  document.getElementById("wkTitulo").textContent = "Wiki do Refúgio";
  document.getElementById("wkResumo").textContent = "Guias do servidor e dos mods do ATM10, do primeiro dia até a ATM Star.";
  document.getElementById("wkCat").textContent = ""; document.querySelector(".wk-migalha").hidden = true;
  document.title = "Wiki · O Refúgio";
  carregarIndiceWiki().then(J=>{
    const gs = (J.guias || []).filter(g=>!g.rascunho);
    const livro = `<section class="wk-cat"><h2>Livro de quests</h2><p>Todas as quests do ATM10 em português, capítulo por capítulo, com tarefas e recompensas.</p><ul class="wk-cards wk-cards-2">${cartaoWiki({slug:"quests", titulo:"Livro de quests completo", resumo:"Os capítulos do livro de quests do modpack, da primeira quest até a criativa", cor:"#F2B01E", icone:"itens/livro_quests.png", url:""})}${cartaoWiki({slug:"quests/mainquestline-part-1", titulo:"Linha de missão principal", resumo:"O caminho principal do ATM10, do começo até a ATM Star", cor:"#7B52E6", icone:"itens/atm_star.png", url:""})}</ul></section>`;
    document.getElementById("wkCats").innerHTML = livro + (J.categorias || []).map(c=>{ const lista = gs.filter(g=>g.categoria === c.id); const col = lista.length <= 2 || lista.length === 4 ? " wk-cards-2" : ""; if(c.id === "jogadores") return `<section class="wk-cat" data-fixa><h2>${esc(c.nome)}</h2><p>${esc(c.descricao || "")}</p>${lista.length ? `<ul class="wk-cards${col}">${lista.map(cartaoWiki).join("")}</ul>` : ""}${CONTRIBUIR}</section>`; return lista.length ? `<section class="wk-cat"><h2>${esc(c.nome)}</h2><p>${esc(c.descricao || DESC_CAT[c.id] || "")}</p><ul class="wk-cards${col}">${lista.map(cartaoWiki).join("")}</ul></section>` : ""; }).join("");
    filtrarWiki();
  }).catch(()=>{ document.getElementById("wkCats").innerHTML = "<p>Não deu para carregar a wiki agora. Tente de novo em instantes.</p>"; });
}
function abrirArtigo(slug){
  if(/^quests(\/|$)/.test(slug)){ abrirQuests(slug.replace(/^quests\/?/, "")); return; }
  slug = wikiSlug(slug);
  if(slug === wikiAberto) return; wikiAberto = slug;
  if(!slug){ scrollTo({top:0, behavior:"instant"}); inicioWiki(); return; }
  document.getElementById("wkQuests").hidden = true;
  document.getElementById("wkInicio").hidden = true; document.getElementById("wkPagina").hidden = false; document.getElementById("wkBuscaBox").hidden = true; document.querySelector(".wk-migalha").hidden = false;
  const art = document.getElementById("wkArt"), toc = document.getElementById("wkToc");
  art.innerHTML = '<p class="wk-carregando">Carregando guia…</p>'; toc.innerHTML = "";
  scrollTo({top:0, behavior:"instant"});
  carregarIndiceWiki().then(J=>{
    const guias = (J.guias || []).filter(g=>!g.rascunho || g.slug === slug), cats = J.categorias || [];
    const g = guias.find(x=>x.slug === slug);
    document.getElementById("wkNavLista").innerHTML = cats.map(c=>{ const gs = guias.filter(x=>x.categoria === c.id && !x.rascunho); return gs.length ? `<h4>${esc(c.nome)}</h4><ul>${gs.map(x=>`<li><a href="${wikiLink(x)}"${x.slug === slug ? ' class="ativo" aria-current="page"' : ""}>${esc(x.titulo)}</a></li>`).join("")}</ul>` : ""; }).join("");
    document.getElementById("wkNav").classList.remove("aberto");
    if(!g){ document.getElementById("wkTitulo").textContent = "Guia não encontrado"; document.getElementById("wkResumo").textContent = ""; document.getElementById("wkCat").textContent = ""; art.innerHTML = '<p>Esse guia não existe ou mudou de nome. Escolha outro na lista.</p>'; return; }
    if(g.url && /^#[\w-]+$/.test(g.url)){ location.hash = g.url; return; }
    document.getElementById("wkTitulo").textContent = g.titulo; document.getElementById("wkResumo").textContent = g.resumo || "";
    const cat = cats.find(c=>c.id === g.categoria); document.getElementById("wkCat").textContent = cat ? cat.nome : "";
    document.title = `${g.titulo} · Wiki do Refúgio`;
    return fetch(CONFIG.wiki.base + slug + ".md", {cache:"no-cache"}).then(r=>r.ok ? r.text() : Promise.reject()).then(txt=>{
      if(wikiAberto !== slug) return;
      const R = md(txt);
      art.innerHTML = (g.autor ? autorWiki(g, Math.max(1, (J.guias || []).filter(x=>x.autor === g.autor && !x.rascunho).length)) : "") + R.html + (g.autor ? `<p class="wk-contrib-mini">Quer ver o seu nome numa página da wiki e ganhar o badge [Wiki] no jogo? <a href="${CONFIG.links.ticket}" target="_blank" rel="noopener">Abra um ticket de suporte</a> e combine o seu guia com o ADM.</p>` : "") + `<div class="wk-rodape"><span>${g.atualizado ? "Atualizado em " + esc(new Date(g.atualizado + "T12:00:00").toLocaleDateString("pt-BR")) : ""}</span><a href="${CONFIG.links.ticket}" target="_blank" rel="noopener">Achou um erro? Avise por ticket</a></div>`; ligarCabecas(art);
      toc.innerHTML = R.titulos.length > 1 ? `<b>Nesta página</b>${R.titulos.map(([id, t])=>`<a href="#wiki/${slug}" data-ir="${id}">${esc(t)}</a>`).join("")}` : "";
    });
  }).catch(()=>{ art.innerHTML = '<p>Não deu para carregar a wiki agora. Tente de novo em instantes.</p>'; });
}
document.addEventListener("click", e=>{ const a = e.target.closest("[data-ir]"); if(!a) return; e.preventDefault(); const alvo = document.getElementById(a.dataset.ir); if(alvo) alvo.scrollIntoView({behavior: reduz ? "auto" : "smooth"}); });
addEventListener("scroll", ()=>{ if(visaoDe(location.hash) !== "wiki") return; let at = null; document.querySelectorAll("#wkArt h2").forEach(h=>{ if(h.getBoundingClientRect().top < 140) at = h.id; }); document.querySelectorAll("#wkToc a").forEach(a=>a.classList.toggle("ativo", a.dataset.ir === at)); }, {passive:true});

/* ================= Fórum (tópicos do canal de fórum do Discord) ================= */
function criarForum(){
  document.head.insertAdjacentHTML("beforeend", `<style id="rf-forum-css">
.fr-topo::before{background-image:url(${ARTE_FORUM});background-position:center 40%}
.fr-acoes{display:flex;gap:12px;flex-wrap:wrap}
.fr-barra{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:22px}
.fr-tags{display:flex;gap:8px;flex-wrap:wrap}
.fr-tag{border:1px solid var(--linha);background:#fff;color:var(--tinta-2);border-radius:999px;padding:7px 14px;font:600 14px/1 var(--corpo);cursor:pointer}
.fr-tag[aria-pressed=true]{background:var(--tinta);border-color:var(--tinta);color:#fff}
.fr-busca{margin-left:auto;min-width:240px;flex:0 1 320px;border:1px solid var(--linha);border-radius:12px;padding:11px 14px;font:500 15px var(--corpo);background:#fff;color:var(--tinta)}
.fr-lista{display:grid;gap:12px;list-style:none;margin:0;padding:0}
.fr-post a{display:grid;grid-template-columns:48px 1fr auto;gap:16px;align-items:start;padding:18px 20px;background:#fff;border:1px solid var(--linha);border-radius:16px;text-decoration:none;color:inherit;transition:border-color .2s,box-shadow .2s,transform .2s}
.fr-post a:hover{border-color:#cfc6e6;box-shadow:0 10px 26px -14px rgba(28,21,53,.35);transform:translateY(-1px)}
.fr-post a:focus-visible{outline:3px solid var(--violeta);outline-offset:2px}
.fr-av{width:48px;height:48px;border-radius:50%;background:#e9e4f6;object-fit:cover}
.fr-tit{font:700 18px/1.25 var(--display);margin:0 0 6px;color:var(--tinta);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.fr-fix{font:700 11px/1 var(--corpo);color:var(--ouro-texto);background:#FFF3D1;border-radius:6px;padding:4px 7px}
.fr-res{margin:0 0 10px;color:var(--tinta-2);font-size:15px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.fr-meta{display:flex;gap:14px;flex-wrap:wrap;font-size:13px;color:var(--tinta-2)}
.fr-meta b{color:var(--tinta);font-weight:600}
.fr-chip{font:600 12px/1 var(--corpo);color:var(--violeta-texto);background:#EFE9FF;border-radius:6px;padding:4px 8px}
.fr-img{width:96px;height:72px;border-radius:10px;object-fit:cover;background:#eee}
.fr-vazio{padding:56px 24px;text-align:center;background:#fff;border:1px dashed var(--linha);border-radius:16px;color:var(--tinta-2)}
.fr-vazio h3{font:700 22px var(--display);color:var(--tinta);margin:0 0 8px}
@media (max-width:700px){.fr-post a{grid-template-columns:40px 1fr;padding:16px}.fr-av{width:40px;height:40px}.fr-img{display:none}.fr-busca{margin-left:0;flex:1 1 100%}}
</style>`);
  const v = document.createElement("main"); v.id = "viewForum"; v.hidden = true;
  v.innerHTML = `
  <section class="rg-topo fr-topo">
    <div class="wrap">
      <span class="selo" style="background:rgba(88,101,242,.2);color:#C9CEFF;box-shadow:inset 0 0 0 1px rgba(88,101,242,.45)">Ligado ao nosso Discord</span>
      <h1>Fórum da comunidade</h1>
      <p>Dúvidas, construções, guias, sugestões e trocas. Os tópicos são criados no canal de fórum do Discord e aparecem aqui sozinhos.</p>
      <div class="fr-acoes"><a class="btn btn-ouro" id="frCriar" target="_blank" rel="noopener" href="#">Criar tópico no Discord</a><a class="btn btn-linha" style="color:#fff;border-color:rgba(255,255,255,.45);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.45)" target="_blank" rel="noopener" data-link="discord" href="${CONFIG.links.discord}">Entrar no Discord</a></div>
    </div>
    <div class="hero-borda" aria-hidden="true"></div>
  </section>
  <section class="secao" style="padding-top:56px">
    <div class="wrap">
      <div class="fr-barra"><div class="fr-tags" id="frTags" role="group" aria-label="Filtrar por categoria"></div><input class="fr-busca" id="frBusca" type="search" placeholder="Buscar tópico" aria-label="Buscar tópico"></div>
      <ol class="fr-lista" id="frLista"></ol>
      <p class="rk-rodape" style="margin-top:16px"><span id="frNota"></span></p>
    </div>
  </section>`;
  (document.getElementById("viewGuia") || document.querySelector("main:last-of-type")).after(v);
  return v;
}
const ARTE_FORUM = "https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/img/forum.webp";
let forumCarregado = false, FORUM = null, frFiltro = "todos";
const frSeguro = (u, hosts) => { try{ const x = new URL(u); return x.protocol === "https:" && hosts.some(h=>x.hostname === h || x.hostname.endsWith("." + h)) ? x.href : ""; } catch(e){ return ""; } };
function frQuando(iso){ const m = Math.round((Date.now() - new Date(iso)) / 60000); if(!(m >= 0)) return ""; if(m < 60) return m < 2 ? "agora" : `há ${m} min`; const h = Math.round(m/60); if(h < 24) return `há ${h} h`; const d = Math.round(h/24); return d < 30 ? `há ${d} ${d === 1 ? "dia" : "dias"}` : new Date(iso).toLocaleDateString("pt-BR"); }
function carregarForum(){
  if(forumCarregado) return; forumCarregado = true;
  const criar = document.getElementById("frCriar"); criar.href = CONFIG.links.forumDiscord || CONFIG.links.discord;
  fetch(CONFIG.forum.url, {cache:"no-store"}).then(r=>r.ok ? r.json() : Promise.reject()).then(J=>{
    FORUM = J;
    const canal = J.canal && frSeguro(J.canal.url, ["discord.com"]); if(canal) criar.href = canal;
    const tags = [{id:"todos", nome:"Todos"}].concat(J.tags || []);
    document.getElementById("frTags").innerHTML = tags.map(t=>`<button class="fr-tag" type="button" data-tag="${esc(t.id)}" aria-pressed="${t.id === "todos"}">${t.emoji ? esc(t.emoji) + " " : ""}${esc(t.nome)}</button>`).join("");
    document.getElementById("frTags").addEventListener("click", e=>{ const b = e.target.closest("[data-tag]"); if(!b) return; frFiltro = b.dataset.tag; document.querySelectorAll("#frTags [data-tag]").forEach(x=>x.setAttribute("aria-pressed", x === b)); desenharForum(); });
    document.getElementById("frBusca").addEventListener("input", desenharForum);
    document.getElementById("frNota").textContent = J.atualizado ? `Tópicos do Discord, atualizados ${frQuando(J.atualizado)}.` : "";
    desenharForum();
  }).catch(()=>{ desenharForum(); });
}
function desenharForum(){
  const ul = document.getElementById("frLista");
  if(!FORUM || !(FORUM.posts || []).length){
    ul.innerHTML = `<li class="fr-vazio"><h3>O fórum está chegando</h3><p>Em breve os tópicos do canal de fórum do Discord aparecem aqui. Enquanto isso, entre no Discord e puxe assunto.</p></li>`; return;
  }
  const nomeTag = Object.fromEntries((FORUM.tags || []).map(t=>[t.id, t]));
  const q = document.getElementById("frBusca").value.trim().toLowerCase();
  const lista = FORUM.posts.filter(p=>(frFiltro === "todos" || (p.tags || []).includes(frFiltro)) && (!q || (p.titulo + " " + (p.resumo || "") + " " + ((p.autor || {}).nome || "")).toLowerCase().includes(q)))
    .sort((a,b)=>(b.fixado === true) - (a.fixado === true) || new Date(b.ultima_atividade || b.criado) - new Date(a.ultima_atividade || a.criado));
  if(!lista.length){ ul.innerHTML = `<li class="fr-vazio"><h3>Nenhum tópico encontrado</h3><p>Tente outra palavra ou outra categoria.</p></li>`; return; }
  ul.innerHTML = lista.slice(0, 60).map(p=>{
    const url = frSeguro(p.url, ["discord.com"]) || "#", av = frSeguro((p.autor || {}).avatar, ["discordapp.com", "discord.com"]), img = frSeguro(p.imagem, ["discordapp.com", "discordapp.net"]);
    const n = +p.respostas || 0;
    return `<li class="fr-post"><a href="${url}" target="_blank" rel="noopener">
      ${av ? `<img class="fr-av" src="${av}" alt="" loading="lazy">` : `<span class="fr-av" aria-hidden="true"></span>`}
      <div><h3 class="fr-tit">${p.fixado ? '<span class="fr-fix">Fixado</span>' : ""}${esc(p.titulo || "Sem título")}</h3>
        ${p.resumo ? `<p class="fr-res">${esc(p.resumo)}</p>` : ""}
        <div class="fr-meta"><span>por <b>${esc((p.autor || {}).nome || "alguém")}</b></span><span>${frQuando(p.ultima_atividade || p.criado)}</span><span>${n} ${n === 1 ? "resposta" : "respostas"}</span>${(p.tags || []).map(t=>nomeTag[t] ? `<span class="fr-chip">${esc(nomeTag[t].nome)}</span>` : "").join("")}</div></div>
      ${img ? `<img class="fr-img" src="${img}" alt="" loading="lazy">` : "<span></span>"}
    </a></li>`;
  }).join("");
}

/* ================= Rotas: início e loja ================= */
const viewRankup = criarRankup(), viewWiki = criarWiki(), viewForum = criarForum(), viewHome = document.getElementById("viewHome"), viewLoja = document.getElementById("viewLoja"), viewRegras = document.getElementById("viewRegras"), viewGuia = document.getElementById("viewGuia"), viewEquipe = criarEquipe();
let visaoAtual = null;
function rota(){
  const v = visaoDe(location.hash), mudou = v !== visaoAtual;
  visaoAtual = v;
  viewHome.hidden = v !== "home"; viewEquipe.hidden = v !== "equipe"; if(v === "equipe" && mudou) scrollTo({top:0, behavior:"instant"}); viewRankup.hidden = v !== "rankup"; if(v === "rankup" && mudou) scrollTo({top:0, behavior:"instant"}); viewWiki.hidden = v !== "wiki"; if(v === "wiki") abrirArtigo(location.hash.slice(6)); viewForum.hidden = v !== "forum"; if(v === "forum"){ carregarForum(); if(mudou) scrollTo({top:0, behavior:"instant"}); } viewLoja.hidden = v !== "loja"; viewRegras.hidden = v !== "regras"; viewGuia.hidden = v !== "guia";
  if(v === "loja"){ if(mudou) scrollTo(0,0); }
  else if(v === "regras"){
    const alvo = location.hash.startsWith("#regra-") ? document.getElementById(location.hash.slice(1)) : null;
    if(alvo) requestAnimationFrame(()=>alvo.scrollIntoView({block:"start", behavior: mudou ? "instant" : (reduz ? "auto" : "smooth")})); else if(mudou) scrollTo({top:0, behavior:"instant"});
    indiceAtivo();
  }
  else if(v === "guia"){
    const alvo = location.hash.startsWith("#gd-") ? document.getElementById(location.hash.slice(1)) : null;
    if(alvo) requestAnimationFrame(()=>alvo.scrollIntoView({block:"start", behavior: mudou ? "instant" : (reduz ? "auto" : "smooth")})); else if(mudou) scrollTo({top:0, behavior:"instant"});
    indiceGuia();
  }
  else if(v === "wiki" || v === "forum" || v === "rankup" || v === "equipe"){ /* cada página cuida da própria rolagem */ }
  else if(mudou && location.hash){ const alvo = document.querySelector(location.hash); if(alvo) alvo.scrollIntoView(); }
  aoRolar();
}
addEventListener("hashchange", rota); rota();

/* ---------- Jogadores online (status real do servidor) ---------- */
const on = document.getElementById("onlineN"), onTxt = document.getElementById("onlineTxt"), onBox = document.getElementById("onlineBox");
async function statusServidor(){
  try{
    const r = await fetch("https://api.mcstatus.io/v2/status/java/" + encodeURIComponent(CONFIG.servidor.ip), {cache:"no-store"});
    const j = await r.json();
    if(j.online){ const n = j.players ? j.players.online : 0; on.textContent = n; onTxt.textContent = n === 1 ? "jogando agora" : "jogando agora"; onBox.classList.remove("off"); onBox.hidden = false; }
    else { on.textContent = ""; onTxt.textContent = "Servidor offline no momento"; onBox.classList.add("off"); onBox.hidden = false; }
  } catch(e){ onBox.hidden = true; }
}
statusServidor(); setInterval(()=>{ if(!document.hidden) statusServidor(); }, 60000);
})();
