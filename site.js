(() => {
/* ============================================================
   CONFIGURAÇÃO DO SITE
   Edite o arquivo config.json (ao lado do index.html) e o site
   inteiro se atualiza: IP, versão do modpack, links e votação.
   Os valores abaixo só são usados se o config.json não carregar.
   ============================================================ */
let CONFIG = {
  servidor:{nome:"O Refúgio", ip:"atm10.rede-orefugio.com.br", maxJogadores:200},
  rankings:{url:"https://raw.githubusercontent.com/lucasgabrieldosanjos-creator/refugio-site/main/dados/rankings.json"},
  modpack:{nome:"All the Mods 10", sigla:"ATM10", versao:"8.3", minecraft:"1.21.1", loader:"NeoForge"},
  links:{discord:"https://discord.gg/6SEqBJyVmr", instagram:"#", tiktok:"#", youtube:"#", loja:"#", sklauncher:"https://skmedix.pl/", curseforge:"https://www.curseforge.com/minecraft/modpacks/all-the-mods-10"},
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
function visaoDe(h){ return h === "#vips" ? "loja" : (h === "#regras" || h.startsWith("#regra-")) ? "regras" : (h === "#guia-guildas" || h.startsWith("#gd-")) ? "guia" : "home"; }
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
  im.src = noPodio ? "https://mc-heads.net/head/" + encodeURIComponent(r[0]) + "/128" : "https://mc-heads.net/avatar/" + encodeURIComponent(r[0]) + "/64";
  im.onerror = () => im.replaceWith(cabeca(r[0]));
  return im;
}
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
    {...MAJOR, url:"atm-major-(80d)", kits:["tech6",...DIARIOS(5),...SEMANAIS(4)]}
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
    ["Chat em RGB e texto mágico", [F,F,F,T,T]],
    ["Sala escritório no Discord", [F,F,F,F,T]]
  ]},
  {g:"Economia", linhas:[
    ["Moedas ao ativar", ["10 mil","20 mil","30 mil","100 mil","300 mil"]],
    ["Cash ao ativar", [F,F,F,F,"150"]],
    ["Bônus na venda de fluidos", ["Nível 2","Nível 3","Nível 3","Nível 4","Nível 6"], "fluidos"],
    ["Venda de fluidos em massa", [T,T,T,T,T]],
    ["Desconto para criar guilda", [F,F,"25%","50%","Grátis (100%)"]],
    ["Salário VIP", [T,T,T,T,T]],
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
    ["Prioridade para entrar com o servidor cheio", [T,T,T,T,T]],
    ["Sem kick por AFK", [T,T,T,T,T]],
    ["Posição de destaque na lista de jogadores (TAB)", [T,T,T,T,T]]
  ]}
];
const ESP = {
  "Tag VIP e chat do servidor no Discord":[T,"Cargo de Comerciante"], "Mensagens com cor, formatação e links":[T,F], "/cor e /definir (cor do nick e do chat)":[T,T], "/cor2 com cores novas e exclusivas":[T,F],
  "Chat em RGB e texto mágico":[F,F], "Sala escritório no Discord":[F,F], "Moedas ao ativar":["50 mil","5 mil"], "Cash ao ativar":[F,F],
  "Bônus na venda de fluidos":["Nível 5","Nível 1"], "Venda de fluidos em massa":[T,T], "Desconto para criar guilda":[F,F], "Salário VIP":[T,F],
  "Lojas próprias: criar, anunciar e definir o spawn":[T,T], "Placas de compra, venda e troca":[T,T],
  "Kit de ativação":["Kit do Construtor",F], "Kits diários":["3",F], "Kits semanais":["VIP1 a 3",F],
  "Homes":["15",F], "Quarrys na dimensão Mining":["3",F], "Claim-chunks":["60 permanentes","5 temporárias"], "Chunk loaders":["1 temporário",F],
  "Teleporte instantâneo, sem cooldown, e /back":[T,F], "/hat, /compass, /depth, /luz e /phantom":[T,F], "/disposal (lixeira)":[T,T],
  "/enderchest, /near e /workbench":[T,F], "/anvil, /itemname, /repair e /feed":[F,F], "/fly":[T,F], "/repair da armadura inteira":[F,F],
  "/loom, /stonecutter, /grindstone e /smithingtable":[F,F], "Building Gadgets":[T,F], "Schematicannon e Time Wand":[T,F],
  "Prioridade para entrar com o servidor cheio":[T,F], "Sem kick por AFK":[T,T], "Posição de destaque na lista de jogadores (TAB)":[T,T]
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

/* Extras */
const EXTRAS = [
  {nome:"Chunks permanentes", ico:"x_chunks", url:"chunks-permanentes", desc:"Proteção de terreno que não expira.", vars:[["5 chunks","R$ 20,00"],["10 chunks","R$ 37,50"],["15 chunks","R$ 50,00"]]},
  {nome:"Chunk loader", ico:"x_loader", url:"chunk-loader", desc:"Mantém suas chunks carregadas enquanto você está online.", vars:[["1 temporário (30 dias)","R$ 35,00"],["4 temporários (40 dias)","R$ 85,00"],["12 permanentes","R$ 224,90"]]},
  {nome:"Cash", ico:"x_cash", url:"pacote-cash", desc:"Creditado direto na sua conta após a compra.", vars:[["50 cash","R$ 17,00"],["150 cash","R$ 37,00"],["300 cash","R$ 50,00"]]},
  {nome:"Desbanimento", ico:"x_unban", url:"desbanimento", desc:"Só vale após aprovação por ticket no Discord. Abra o ticket antes de comprar.", vars:[["Desbanimento","R$ 35,00"]]}
];
document.getElementById("extras").innerHTML = EXTRAS.map(x=>`<article class="extra">
  <div class="extra-cab"><span class="slot-mini"><img class="ico px" src="https://cdn.jsdelivr.net/gh/lucasgabrieldosanjos-creator/refugio-site@main/itens/${x.ico}.png" alt=""></span><h3>${x.nome}</h3></div>
  <p>${x.desc}</p>
  <ul>${x.vars.map(([n,p])=>`<li><span>${n}</span><b>${p}</b></li>`).join("")}</ul>
  <a class="btn btn-ouro" href="${LOJA_URL+x.url}" target="_blank" rel="noopener">Comprar</a></article>`).join("");

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
    <article class="rg" id="regra-recurso"><header><span class="rg-id">R</span><h3>Revisão de punição e desbanimento</h3></header><p>Para pedir revisão, abra um ticket no Discord explicando o caso. O desbanimento só pode ser comprado na loja depois que o ticket for aprovado pela staff. Não compre sem abrir o ticket antes.</p></article>
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
    <p class="gd-nota">Precisa de ajuda? Abra um ticket no Discord com seu nick, a TAG, o comando usado e o aviso recebido, com print se possível.</p>`}
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

/* ================= Rotas: início e loja ================= */
const viewHome = document.getElementById("viewHome"), viewLoja = document.getElementById("viewLoja"), viewRegras = document.getElementById("viewRegras"), viewGuia = document.getElementById("viewGuia");
let visaoAtual = null;
function rota(){
  const v = visaoDe(location.hash), mudou = v !== visaoAtual;
  visaoAtual = v;
  viewHome.hidden = v !== "home"; viewLoja.hidden = v !== "loja"; viewRegras.hidden = v !== "regras"; viewGuia.hidden = v !== "guia";
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
