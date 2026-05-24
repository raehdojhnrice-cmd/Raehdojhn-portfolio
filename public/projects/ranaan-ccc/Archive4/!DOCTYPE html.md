<!DOCTYPE html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<meta name="viewport" content="width=device-width, initial-scale=1.0">  
<title>AKO STUDIOS — CCC SS25</title>  
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,900;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">  
<style>  
:root{--void:#0A0A0A;--cream:#F0EBE2;--ash:#555;--blood:#1A0A0A;--white:#FFF;--mid:#333;}  
*{margin:0;padding:0;box-sizing:border-box;}  
html{scroll-behavior:smooth;}  
body{background:var(--void);color:var(--cream);font-family:'Space Mono',monospace;overflow-x:hidden;cursor:crosshair;}  
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9998;opacity:.4;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23g)' opacity='.07'/%3E%3C/svg%3E");animation:gr .1s steps(1) infinite;}  
@keyframes gr{0%{transform:translate(0,0)}25%{transform:translate(-2px,1px)}50%{transform:translate(1px,-2px)}75%{transform:translate(2px,1px)}100%{transform:translate(-1px,2px)}}  
  
/* TICKER */  
#ticker{position:fixed;top:0;left:0;right:0;height:26px;background:var(--void);border-bottom:1px solid #111;z-index:1000;overflow:hidden;display:flex;align-items:center;}  
.tr{display:flex;gap:60px;animation:tm 28s linear infinite;white-space:nowrap;}  
@keyframes tm{from{transform:translateX(0)}to{transform:translateX(-50%)}}  
.ti{font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:#2a2a2a;flex-shrink:0;}  
.td{color:#3a1a1a;margin:0 40px;}  
.live{color:#3a3a3a;}  
  
/* NAV */  
nav{position:fixed;top:26px;left:0;right:0;height:50px;background:rgba(10,10,10,.97);border-bottom:1px solid #0f0f0f;display:flex;align-items:center;justify-content:space-between;padding:0 40px;z-index:999;}  
.nlogo{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:.12em;color:var(--white);text-decoration:none;}  
.nlinks{display:flex;gap:40px;list-style:none;}  
.nlinks a{font-size:9px;letter-spacing:.5em;text-transform:uppercase;color:#444;text-decoration:none;transition:color .2s;}  
.nlinks a:hover{color:var(--cream);}  
.nr{font-size:8px;letter-spacing:.3em;color:#1a1a1a;}  
  
/* HERO */  
#hero{position:relative;width:100vw;height:100vh;overflow:hidden;margin-top:76px;}  
#cc{position:absolute;inset:0;width:100%;height:100%;}  
.ho{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,10,.25) 0%,rgba(10,10,10,.05) 45%,rgba(10,10,10,.65) 100%);pointer-events:none;}  
#ts{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;z-index:10;}  
.sl{opacity:0;transform:translateY(18px);position:absolute;text-align:center;width:100%;padding:0 40px;transition:none;}  
.sl-tiny{font-size:clamp(9px,1.1vw,12px);letter-spacing:.5em;text-transform:uppercase;color:#555;}  
.sl-med{font-family:'Bebas Neue',sans-serif;font-size:clamp(40px,7vw,96px);letter-spacing:.04em;color:var(--white);line-height:1;}  
.sl-xl{font-family:'Bebas Neue',sans-serif;font-size:clamp(72px,13vw,180px);letter-spacing:-.01em;color:var(--white);line-height:.88;}  
.sl-it{font-family:'Playfair Display',serif;font-style:italic;font-size:clamp(14px,2vw,26px);letter-spacing:.1em;color:#777;}  
.sl-final{font-family:'Bebas Neue',sans-serif;font-size:clamp(52px,10vw,144px);letter-spacing:.05em;color:var(--white);line-height:1;}  
.sl-ccc-out{font-family:'Playfair Display',serif;font-weight:900;font-size:clamp(20px,3.5vw,52px);color:transparent;-webkit-text-stroke:1px #666;display:block;margin-top:1vw;}  
.hbi{position:absolute;bottom:28px;left:0;right:0;display:flex;justify-content:space-between;align-items:flex-end;padding:0 40px;z-index:20;pointer-events:none;}  
.hbs{font-size:8px;letter-spacing:.4em;color:#222;text-transform:uppercase;}  
.hsc{font-size:8px;letter-spacing:.5em;color:#444;display:flex;align-items:center;gap:10px;text-transform:uppercase;}  
.scl{width:36px;height:1px;background:#222;animation:sp 2s ease infinite;}  
@keyframes sp{0%,100%{width:36px;opacity:.3}50%{width:52px;opacity:.7}}  
  
/* MARQUEE */  
.mb{border-top:1px solid #0f0f0f;border-bottom:1px solid #0f0f0f;padding:9px 0;overflow:hidden;background:var(--void);}  
.mi2{display:flex;gap:60px;animation:mr 22s linear infinite;white-space:nowrap;}  
.mi2r{animation:ml 26s linear infinite;}  
@keyframes ml{from{transform:translateX(-50%)}to{transform:translateX(0)}}  
@keyframes mr{from{transform:translateX(0)}to{transform:translateX(-50%)}}  
.mt{font-size:9px;letter-spacing:.45em;text-transform:uppercase;color:#1a1a1a;flex-shrink:0;}  
.mta{color:#2a1010;}  
  
/* SECTIONS */  
section{padding:80px 40px;border-bottom:1px solid #0d0d0d;}  
.slbl{font-size:9px;letter-spacing:.6em;text-transform:uppercase;color:#2a2a2a;margin-bottom:48px;display:flex;align-items:center;gap:16px;}  
.slbl::before{content:'';width:20px;height:1px;background:#1a1a1a;}  
  
/* COLLECTION */  
.ch{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;}  
.ct{font-family:'Bebas Neue',sans-serif;font-size:clamp(44px,8vw,110px);letter-spacing:.03em;color:var(--white);line-height:.88;}  
.cs{font-size:8px;letter-spacing:.4em;color:#333;text-transform:uppercase;text-align:right;max-width:180px;line-height:2.2;}  
.pg{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#0f0f0f;}  
.pc{background:var(--void);aspect-ratio:3/4;position:relative;overflow:hidden;cursor:crosshair;}  
.pcc{width:100%;height:100%;display:block;}  
.pi{position:absolute;bottom:0;left:0;right:0;padding:18px 22px;background:linear-gradient(to top,rgba(10,10,10,.92),transparent);}  
.pn{font-size:8px;letter-spacing:.4em;text-transform:uppercase;color:var(--cream);margin-bottom:3px;}  
.ps{font-size:7px;letter-spacing:.3em;color:#333;}  
  
/* EDITORIAL */  
#editorial{padding:0;}  
.erow{display:grid;grid-template-columns:1fr 1fr;min-height:70vh;}  
.ecw{position:relative;overflow:hidden;min-height:70vh;}  
.ec{width:100%;height:100%;display:block;position:absolute;inset:0;}  
.etc{padding:80px 60px;display:flex;flex-direction:column;justify-content:space-between;border-left:1px solid #0f0f0f;}  
.ee{font-size:8px;letter-spacing:.6em;color:#2a2a2a;text-transform:uppercase;}  
.eh{font-family:'Bebas Neue',sans-serif;font-size:clamp(48px,5vw,80px);color:var(--white);line-height:.92;letter-spacing:.03em;margin-top:28px;}  
.eb{font-family:'Playfair Display',serif;font-style:italic;font-size:clamp(13px,1.4vw,17px);color:#555;line-height:1.9;margin-top:28px;flex:1;}  
.ecta{display:inline-flex;align-items:center;gap:12px;font-size:8px;letter-spacing:.5em;text-transform:uppercase;color:#444;text-decoration:none;margin-top:40px;border-bottom:1px solid #1a1a1a;padding-bottom:8px;transition:color .2s;}  
.ecta:hover{color:var(--cream);}  
.em{font-size:7px;letter-spacing:.3em;color:#1a1a1a;margin-top:40px;line-height:2;}  
  
/* MISSION */  
#mission{background:var(--cream);color:var(--void);padding:110px 40px;}  
.mg{display:grid;grid-template-columns:1fr 2.5fr;gap:80px;align-items:start;}  
.mlbl{font-size:8px;letter-spacing:.6em;text-transform:uppercase;color:#bbb;writing-mode:vertical-lr;transform:rotate(180deg);align-self:center;}  
.mn{font-family:'Bebas Neue',sans-serif;font-size:clamp(80px,14vw,190px);color:transparent;-webkit-text-stroke:1px #e0d9d0;line-height:.85;letter-spacing:-.02em;}  
.mt2{font-family:'Playfair Display',serif;font-style:italic;font-size:clamp(18px,2.8vw,38px);color:var(--void);line-height:1.4;margin-top:-16px;}  
.msub{margin-top:36px;font-size:9px;letter-spacing:.25em;color:#999;max-width:480px;line-height:2.2;}  
.mc{margin-top:56px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#d5cfc8;}  
.mcc{background:var(--cream);padding:28px 22px;}  
.mcn{font-family:'Bebas Neue',sans-serif;font-size:28px;color:#ddd;margin-bottom:10px;}  
.mcq{font-family:'Playfair Display',serif;font-style:italic;font-size:12px;color:var(--void);line-height:1.6;margin-bottom:6px;}  
.mca{font-size:8px;letter-spacing:.18em;color:#999;line-height:1.9;}  
  
/* DNA */  
#dna{background:#040404;}  
.dg{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#0f0f0f;margin-top:48px;}  
.dc{background:#040404;padding:28px 22px;}  
.dcl{font-size:8px;letter-spacing:.5em;text-transform:uppercase;color:#222;margin-bottom:14px;}  
.dcv{font-family:'Playfair Display',serif;font-style:italic;font-size:12px;color:#666;line-height:1.8;}  
.dcv strong{color:var(--cream);font-style:normal;font-weight:900;}  
.psw{width:100%;height:28px;margin-bottom:6px;border:1px solid #111;}  
  
/* MANIFESTO */  
#manifesto{background:var(--void);padding:110px 40px;text-align:center;position:relative;overflow:hidden;}  
.mbg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:22vw;color:transparent;-webkit-text-stroke:1px #0c0c0c;pointer-events:none;white-space:nowrap;user-select:none;}  
.ml-line{opacity:0;transform:translateY(22px);transition:opacity .9s,transform .9s;}  
.ml-line.vis{opacity:1;transform:translateY(0);}  
.mls{font-size:9px;letter-spacing:.6em;color:#333;text-transform:uppercase;display:block;margin-bottom:20px;}  
.mlm{font-family:'Bebas Neue',sans-serif;font-size:clamp(40px,7vw,96px);color:var(--white);letter-spacing:.04em;display:block;margin-bottom:8px;}  
.mlxl{font-family:'Bebas Neue',sans-serif;font-size:clamp(80px,15vw,190px);color:var(--white);letter-spacing:-.01em;line-height:.85;display:block;margin-bottom:20px;}  
.mli{font-family:'Playfair Display',serif;font-style:italic;font-size:clamp(13px,1.8vw,22px);color:#444;display:block;}  
  
/* FOOTER */  
footer{background:var(--void);border-top:1px solid #0d0d0d;padding:80px 40px 36px;}  
.fg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:56px;margin-bottom:72px;}  
.flogo{font-family:'Bebas Neue',sans-serif;font-size:44px;letter-spacing:.1em;color:var(--white);margin-bottom:14px;}  
.ftag{font-family:'Playfair Display',serif;font-style:italic;font-size:13px;color:#333;margin-bottom:28px;}  
.fccc{font-family:'Playfair Display',serif;font-weight:900;font-size:20px;color:transparent;-webkit-text-stroke:1px #1a1a1a;letter-spacing:-.03em;}  
.fcl{font-size:8px;letter-spacing:.6em;text-transform:uppercase;color:#222;margin-bottom:20px;}  
.flinks{list-style:none;}  
.flinks li{margin-bottom:10px;}  
.flinks a{font-size:9px;letter-spacing:.2em;color:#444;text-decoration:none;transition:color .2s;}  
.flinks a:hover{color:var(--cream);}  
.fb{border-top:1px solid #0d0d0d;padding-top:28px;display:flex;justify-content:space-between;align-items:center;}  
.fby{font-size:8px;letter-spacing:.3em;color:#1a1a1a;text-transform:uppercase;}  
.fest{font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:.4em;color:#0f0f0f;}  
  
/* REVEAL */  
.rv{opacity:0;transform:translateY(28px);transition:opacity .85s ease,transform .85s ease;}  
.rv.vis{opacity:1;transform:translateY(0);}  
  
@media(max-width:900px){  
  nav{padding:0 20px;}section{padding:56px 20px;}  
  .pg{grid-template-columns:1fr 1fr;}.erow{grid-template-columns:1fr;}  
  .mg{grid-template-columns:1fr;}.dg{grid-template-columns:1fr 1fr;}  
  .fg{grid-template-columns:1fr 1fr;}.mc{grid-template-columns:1fr;}  
  .hbi{padding:0 20px;}  
}  
@media(max-width:600px){  
  .pg{grid-template-columns:1fr;}.dg{grid-template-columns:1fr;}  
  .fg{grid-template-columns:1fr;}.mc{grid-template-columns:1fr;}  
}  
</style>  
</head>  
<body>  
  
<!-- TICKER BAR -->  
<div id="ticker">  
  <div class="tr">  
    <span class="ti">AKO STUDIOS<span class="td">◆</span></span>  
    <span class="ti">CCC CONTROLLED CHAOS COLLECTION<span class="td">◆</span></span>  
    <span class="ti">SS25<span class="td">◆</span></span>  
    <span class="ti live" id="lt">--:--:--</span><span class="td">◆</span>  
    <span class="ti live" id="ll">GLOBAL</span><span class="td">◆</span>  
    <span class="ti">EMBRACE THE CHAOS<span class="td">◆</span></span>  
    <span class="ti">MADE IN JAPAN<span class="td">◆</span></span>  
    <span class="ti">AKO STUDIOS<span class="td">◆</span></span>  
    <span class="ti">CCC CONTROLLED CHAOS COLLECTION<span class="td">◆</span></span>  
    <span class="ti">SS25<span class="td">◆</span></span>  
    <span class="ti live" id="lt2">--:--:--</span><span class="td">◆</span>  
    <span class="ti live" id="ll2">GLOBAL</span><span class="td">◆</span>  
    <span class="ti">EMBRACE THE CHAOS<span class="td">◆</span></span>  
    <span class="ti">MADE IN JAPAN<span class="td">◆</span></span>  
  </div>  
</div>  
  
<!-- NAV -->  
<nav>  
  <a href="#" class="nlogo">AKO</a>  
  <ul class="nlinks">  
    <li><a href="#collection">Collection</a></li>  
    <li><a href="#editorial">Editorial</a></li>  
    <li><a href="#mission">World</a></li>  
    <li><a href="#manifesto">Manifesto</a></li>  
  </ul>  
  <div class="nr">CCC / SS25</div>  
</nav>  
  
<!-- HERO COMMERCIAL -->  
<section id="hero">  
  <canvas id="cc"></canvas>  
  <div class="ho"></div>  
  <div id="ts"></div>  
  <div class="hbi">  
    <div class="hbs">CCC-SS25-001 / AKO STUDIOS / EMBRACE THE CHAOS</div>  
    <div class="hsc"><div class="scl"></div>Scroll</div>  
  </div>  
</section>  
  
<!-- MARQUEE 1 -->  
<div class="mb"><div class="mi2">  
  <span class="mt">CONTROLLED CHAOS COLLECTION</span><span class="mta">◆</span>  
  <span class="mt">AKO STUDIOS SS25</span><span class="mta">◆</span>  
  <span class="mt">EMBRACE THE CHAOS</span><span class="mta">◆</span>  
  <span class="mt">MADE IN JAPAN</span><span class="mta">◆</span>  
  <span class="mt">BORN IN THE NOISE</span><span class="mta">◆</span>  
  <span class="mt">TOKYO — LOS ANGELES — NEW YORK — PARIS</span><span class="mta">◆</span>  
  <span class="mt">CONTROLLED CHAOS COLLECTION</span><span class="mta">◆</span>  
  <span class="mt">AKO STUDIOS SS25</span><span class="mta">◆</span>  
  <span class="mt">EMBRACE THE CHAOS</span><span class="mta">◆</span>  
  <span class="mt">MADE IN JAPAN</span><span class="mta">◆</span>  
  <span class="mt">BORN IN THE NOISE</span><span class="mta">◆</span>  
  <span class="mt">TOKYO — LOS ANGELES — NEW YORK — PARIS</span><span class="mta">◆</span>  
</div></div>  
  
<!-- COLLECTION -->  
<section id="collection">  
  <div class="ch rv"><div class="ct">CCC<br>SS25</div><div class="cs">Controlled Chaos Collection<br>Six Objects.<br>One Universe.<br>Made in Japan.</div></div>  
  <div class="pg">  
    <div class="pc"><canvas class="pcc" id="p1"></canvas><div class="pi"><div class="pn">CCC Embroidered Coat</div><div class="ps">CCC-SS25-001 / BLACK / WOVEN COTTON / JP</div></div></div>  
    <div class="pc"><canvas class="pcc" id="p2"></canvas><div class="pi"><div class="pn">Deconstructed Blazer</div><div class="ps">CCC-SS25-002 / CREAM / CANVAS / JP</div></div></div>  
    <div class="pc"><canvas class="pcc" id="p3"></canvas><div class="pi"><div class="pn">Tonal Knit Sweater</div><div class="ps">CCC-SS25-003 / BLACK / COTTON KNIT / JP</div></div></div>  
    <div class="pc"><canvas class="pcc" id="p4"></canvas><div class="pi"><div class="pn">Woven Overshirt</div><div class="ps">CCC-SS25-004 / BLACK / WOVEN / JP</div></div></div>  
    <div class="pc"><canvas class="pcc" id="p5"></canvas><div class="pi"><div class="pn">Heavyweight Hoodie</div><div class="ps">CCC-SS25-005 / CREAM / FLEECE / JP</div></div></div>  
    <div class="pc"><canvas class="pcc" id="p6"></canvas><div class="pi"><div class="pn">Canvas Tote</div><div class="ps">CCC-SS25-006 / CREAM / CANVAS / JP</div></div></div>  
  </div>  
</section>  
  
<!-- MARQUEE 2 -->  
<div class="mb"><div class="mi2 mi2r">  
  <span class="mt">CHAOS IS A LANGUAGE — WE SPEAK IT FLUENTLY</span><span class="mta">◆</span>  
  <span class="mt">KODAK TRI-X 400 PUSHED TO 1600</span><span class="mta">◆</span>  
  <span class="mt">CCC / CONTROLLED CHAOS COLLECTION / SS25</span><span class="mta">◆</span>  
  <span class="mt">WOVEN COTTON — MADE IN JAPAN</span><span class="mta">◆</span>  
  <span class="mt">CHAOS IS A LANGUAGE — WE SPEAK IT FLUENTLY</span><span class="mta">◆</span>  
  <span class="mt">KODAK TRI-X 400 PUSHED TO 1600</span><span class="mta">◆</span>  
  <span class="mt">CCC / CONTROLLED CHAOS COLLECTION / SS25</span><span class="mta">◆</span>  
  <span class="mt">WOVEN COTTON — MADE IN JAPAN</span><span class="mta">◆</span>  
</div></div>  
  
<!-- EDITORIAL -->  
<section id="editorial" style="padding:0;">  
  <div class="erow">  
    <div class="ecw"><canvas id="ec" class="ec"></canvas></div>  
    <div class="etc rv">  
      <div>  
        <div class="ee">Editorial — SS25 / Looks 001–006</div>  
        <div class="eh">WE WERE<br>BORN IN<br>THE NOISE</div>  
        <div class="eb">"In beauty there is disorder. In disorder there is peace." Seven bodies. One concrete channel. Los Angeles at golden hour. The light cuts diagonal and the shadows know where to fall. This is not a campaign. This is documentation of something that already exists.</div>  
      </div>  
      <div>  
        <a href="#" class="ecta">Explore the Collection →</a>  
        <div class="em">AKO STUDIOS — SS25 — CCC<br>Photography: Film, pushed<br>Los Angeles / Tokyo / Paris / New York</div>  
      </div>  
    </div>  
  </div>  
</section>  
  
<!-- MISSION -->  
<section id="mission">  
  <div class="mg">  
    <div class="mlbl">Brand Philosophy</div>  
    <div>  
      <div class="mn rv">III</div>  
      <div class="mt2 rv" style="transition-delay:.1s">Three questions. Three sentences. The entire brand universe.</div>  
      <div class="msub rv" style="transition-delay:.2s">AKO Studios was not built from aesthetics. It was built from answers — three foundational statements that every garment, every image, and every interaction must pass through before it earns the CCC mark.</div>  
      <div class="mc">  
        <div class="mcc rv" style="transition-delay:.1s"><div class="mcn">01</div><div class="mcq">What does this brand stand for?</div><div class="mca">The dignity of chaos. The intelligence inside what others call disorder. Clothing as document of a life fully lived.</div></div>  
        <div class="mcc rv" style="transition-delay:.2s"><div class="mcn">02</div><div class="mcq">Who is it for?</div><div class="mca">Those who dress for themselves. Those who read the credits. Those between two places culturally. Multi-ethnic. Tattooed. Dyed hair. Ages 19–27. Real.</div></div>  
        <div class="mcc rv" style="transition-delay:.3s"><div class="mcn">03</div><div class="mcq">What does it reject?</div><div class="mca">Clean digital. Glossy corporate. Influencer aesthetic. Perfect skin retouching. Bright saturation. Retail urgency. Permission.</div></div>  
      </div>  
    </div>  
  </div>  
</section>  
  
<!-- DNA -->  
<section id="dna">  
  <div class="slbl">Brand DNA Constants — Applied To Every Image</div>  
  <div class="dg">  
    <div class="dc rv"><div class="dcl">Film Stock</div><div class="dcv"><strong>Kodak Tri-X 400</strong><br>pushed to 1600<br>+ Fuji Superia 400<br>cross-processed</div></div>  
    <div class="dc rv" style="transition-delay:.1s"><div class="dcl">Color Palette</div>  
      <div class="psw" style="background:#0A0A0A;"></div><div style="font-size:7px;letter-spacing:.3em;color:#222;margin-bottom:10px;">#0A0A0A VOID</div>  
      <div class="psw" style="background:#F0EBE2;border-color:#333;"></div><div style="font-size:7px;letter-spacing:.3em;color:#444;margin-bottom:10px;">#F0EBE2 BONE CREAM</div>  
      <div class="psw" style="background:#1A0A0A;"></div><div style="font-size:7px;letter-spacing:.3em;color:#2a1010;">#1A0A0A WOUND BLOOD</div>  
    </div>  
    <div class="dc rv" style="transition-delay:.2s"><div class="dcl">Typefaces</div><div class="dcv"><strong style="font-family:'Bebas Neue',sans-serif;font-size:18px;">Bebas Neue</strong><br><span style="font-size:7px;letter-spacing:.3em;color:#333;">POWER</span><br><br><strong style="font-family:'Playfair Display',serif;font-style:italic;">Playfair Display</strong><br><span style="font-size:7px;letter-spacing:.3em;color:#333;">HERITAGE</span><br><br><span style="font-family:'Space Mono',monospace;font-size:9px;color:#555;">Space Mono</span><br><span style="font-size:7px;letter-spacing:.3em;color:#333;">SYSTEM</span></div></div>  
    <div class="dc rv" style="transition-delay:.3s"><div class="dcl">Logo Rule</div><div class="dcv"><strong>NEVER</strong> show AKO and CCC in the same image.<br><br>AKO wordmark <em>OR</em> CCC embroidery. Never both. Exception: brand guidelines only.</div></div>  
    <div class="dc rv" style="transition-delay:.1s"><div class="dcl">Texture Overlays</div><div class="dcv">Xerox artifacts<br>VHS tracking lines<br>Newsprint halftone<br>Fabric weave<br>Grain 4–12%</div></div>  
    <div class="dc rv" style="transition-delay:.2s"><div class="dcl">Camera DNA</div><div class="dcv">Fish-eye distortion<br>Dutch angles<br>Ground-up diagonals<br>Macro intimacy<br>Surveillance distance</div></div>  
    <div class="dc rv" style="transition-delay:.3s"><div class="dcl">Casting</div><div class="dcv">Multi-ethnic<br>Tattooed<br>Dyed: platinum/<br>cobalt/cherry/mint<br>Ages 19–27</div></div>  
    <div class="dc rv" style="transition-delay:.4s"><div class="dcl">Era Fusion</div><div class="dcv"><strong>1993</strong> Supreme flyers<br><strong>1996</strong> CK One<br><strong>2003</strong> Raf Simons<br><strong>2024</strong> Shibuya</div></div>  
  </div>  
</section>  
  
<!-- MANIFESTO -->  
<section id="manifesto">  
  <div class="mbg">CHAOS</div>  
  <div class="ml-line" id="m1"><span class="mls">There are those who fear it —</span></div>  
  <div class="ml-line" id="m2" style="margin-top:20px;"><span class="mlm">And those who —</span></div>  
  <div class="ml-line" id="m3" style="margin-top:8px;"><span class="mlxl">WEAR IT</span></div>  
  <div class="ml-line" id="m4" style="margin-top:14px;"><span class="mli">— AKO Studios</span></div>  
</section>  
  
<!-- FOOTER -->  
<footer>  
  <div class="fg">  
    <div><div class="flogo">AKO</div><div class="ftag">Embrace the chaos.</div><div class="fccc">CCC</div></div>  
    <div><div class="fcl">Collection</div><ul class="flinks"><li><a href="#">CCC Embroidered Coat</a></li><li><a href="#">Deconstructed Blazer</a></li><li><a href="#">Tonal Knit</a></li><li><a href="#">Woven Overshirt</a></li><li><a href="#">Heavyweight Hoodie</a></li><li><a href="#">Canvas Tote</a></li></ul></div>  
    <div><div class="fcl">World</div><ul class="flinks"><li><a href="#">Editorial</a></li><li><a href="#">Archive</a></li><li><a href="#">Mission</a></li><li><a href="#">Stockists</a></li></ul></div>  
    <div><div class="fcl">Contact</div><ul class="flinks"><li><a href="#">studio@akostudios.com</a></li><li><a href="#">Tokyo — Los Angeles</a></li><li><a href="#">Press</a></li></ul></div>  
  </div>  
  <div class="fb"><div class="fby">© AKO Studios MMXXIV — All Rights Reserved</div><div class="fest">EST. MMXXIV</div></div>  
</footer>  
  
<script>  
// LIVE TIME  
function updT(){const n=new Date(),s=t=>String(t).padStart(2,'0');const v=s(n.getHours())+':'+s(n.getMinutes())+':'+s(n.getSeconds());['lt','lt2'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=v;});}  
setInterval(updT,1000);updT();  
  
// LOCATION  
if(navigator.geolocation){  
  navigator.geolocation.getCurrentPosition(p=>{  
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${p.coords.latitude}&lon=${p.coords.longitude}&format=json`)  
    .then(r=>r.json()).then(d=>{  
      const c=(d.address?.city||d.address?.town||d.address?.village||'GLOBAL').toUpperCase();  
      const cc=(d.address?.country_code||'').toUpperCase();  
      const loc=c+(cc?', '+cc:'');  
      ['ll','ll2'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=loc;});  
    }).catch(()=>{});  
  },()=>{});  
}  
  
// ── MAIN COMMERCIAL CANVAS ──  
const cv=document.getElementById('cc'),ctx=cv.getContext('2d');  
let W,H,scene=0,sT=0,last=0;  
const SD=4.5;  
  
function rsz(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;}  
rsz();window.addEventListener('resize',rsz);  
  
// Grain buffer  
const gC=document.createElement('canvas');gC.width=256;gC.height=256;  
const gX=gC.getContext('2d');  
let gO=[0,0];  
function apGrain(){  
  const d=gX.createImageData(256,256);  
  for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=Math.random()*18|0;}  
  gX.putImageData(d,0,0);  
  ctx.globalAlpha=.5;ctx.globalCompositeOperation='overlay';  
  for(let y=0;y<H;y+=256)for(let x=0;x<W;x+=256)ctx.drawImage(gC,x+gO[0],y+gO[1]);  
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;  
  gO=[Math.random()*4-2|0,Math.random()*4-2|0];  
}  
  
function S0(t){// Black dot  
  ctx.fillStyle='#0A0A0A';ctx.fillRect(0,0,W,H);  
  const r=Math.min(t/2*W*.06,W*.06);  
  if(r>0){const g=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,r);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.7,'rgba(255,255,255,.1)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(W/2,H/2,r,0,Math.PI*2);ctx.fill();}  
}  
function S1(t){// First C  
  ctx.fillStyle='#F0EBE2';ctx.fillRect(0,0,W,H);  
  ctx.strokeStyle='rgba(0,0,0,.04)';ctx.lineWidth=1;  
  for(let y=0;y<H;y+=8){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}  
  for(let x=0;x<W;x+=8){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}  
  const a=Math.min(t,1),sz=W*.55;  
  ctx.font=`900 ${sz}px 'Bebas Neue',sans-serif`;  
  ctx.fillStyle=`rgba(10,10,10,${a})`;ctx.textAlign='center';ctx.textBaseline='middle';  
  const sk=Math.max(0,(1-t)*.1);ctx.save();ctx.transform(1,0,-sk,1,0,0);ctx.fillText('C',W/2,H/2);ctx.restore();  
}  
function S2(t){// Chaos grid  
  ctx.fillStyle='#0A0A0A';ctx.fillRect(0,0,W,H);  
  const cols=12,rows=7,cw=W/cols,ch=H/rows;  
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const v=8+Math.sin(t*3+r+c*.5)*5+Math.random()*10;ctx.fillStyle=`rgb(${v|0},${v|0},${v|0})`;ctx.fillRect(c*cw+1,r*ch+1,cw-2,ch-2);}  
  const a=Math.min(t*.8,1),sz=W*.25;  
  ctx.font=`900 ${sz}px 'Bebas Neue',sans-serif`;ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('CHAOS',W/2,H/2);  
}  
function S3(t){// CCC fabric  
  ctx.fillStyle='#F0EBE2';ctx.fillRect(0,0,W,H);  
  ctx.strokeStyle='rgba(0,0,0,.05)';ctx.lineWidth=1;  
  for(let y=0;y<H;y+=8){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}  
  for(let x=0;x<W;x+=8){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}  
  const rv=Math.min(t/3,1),sz=W*.28;  
  ctx.font=`900 ${sz}px 'Playfair Display',serif`;ctx.textAlign='center';ctx.textBaseline='middle';  
  ctx.save();ctx.rect(0,0,W*rv,H);ctx.clip();ctx.fillStyle='#1A1A1A';ctx.fillText('CCC',W/2,H/2);ctx.restore();  
  ctx.strokeStyle=`rgba(26,26,26,${Math.max(0,1-rv*2)})`;ctx.lineWidth=2;ctx.strokeText('CCC',W/2,H/2);  
}  
function S4(t){// Manifesto  
  ctx.fillStyle='#0A0A0A';ctx.fillRect(0,0,W,H);  
  const vg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*.55);vg.addColorStop(0,'rgba(26,10,10,.5)');vg.addColorStop(1,'transparent');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);  
  const ly=[{tx:"There are those who fear it —",sz:W*.016,col:'rgba(80,80,80,',dl:0,f:"Space Mono"},  
    {tx:"And those who —",sz:W*.07,col:'rgba(255,255,255,',dl:.6,f:"Bebas"},  
    {tx:"WEAR IT",sz:W*.13,col:'rgba(255,255,255,',dl:1.2,f:"Bebas"},  
    {tx:"— AKO Studios",sz:W*.016,col:'rgba(60,60,60,',dl:2,f:"Playfair"}];  
  const y0=H/2-W*.12;  
  ly.forEach((l,i)=>{  
    const a=Math.max(0,Math.min(1,(t-l.dl)/.5));if(!a)return;  
    if(l.f==="Bebas")ctx.font=`900 ${l.sz}px 'Bebas Neue',sans-serif`;  
    else if(l.f==="Playfair")ctx.font=`italic 400 ${l.sz}px 'Playfair Display',serif`;  
    else ctx.font=`400 ${l.sz}px 'Space Mono',monospace`;  
    ctx.fillStyle=l.col+a+')';ctx.textAlign='center';ctx.textBaseline='top';  
    ctx.fillText(l.tx,W/2,y0+i*W*.095+(1-a)*18);  
  });  
}  
function S5(t){// Product  
  ctx.fillStyle='#0F0F0F';ctx.fillRect(0,0,W,H);  
  const sg=ctx.createRadialGradient(W/2,H/2,0,W/2,H*.45,W*.38);sg.addColorStop(0,'rgba(255,255,255,.04)');sg.addColorStop(1,'transparent');ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);  
  const em=Math.min(t/1.5,1),cw=W*.2,ch=H*.52,cx=W/2-cw/2,cy=H/2-ch/2+(1-em)*55;  
  ctx.globalAlpha=em;ctx.fillStyle='#1A1A1A';ctx.fillRect(cx,cy,cw,ch);  
  ctx.strokeStyle='rgba(255,255,255,.03)';ctx.lineWidth=1;  
  for(let y=cy;y<cy+ch;y+=6){ctx.beginPath();ctx.moveTo(cx,y);ctx.lineTo(cx+cw,y);ctx.stroke();}  
  for(let x=cx;x<cx+cw;x+=6){ctx.beginPath();ctx.moveTo(x,cy);ctx.lineTo(x,cy+ch);ctx.stroke();}  
  ctx.font=`900 ${cw*.32}px 'Playfair Display',serif`;ctx.fillStyle='rgba(255,255,255,.2)';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('CCC',W/2,cy+ch*.44);  
  ctx.globalAlpha=1;  
}  
function S6(t){// Embrace  
  ctx.fillStyle='#0A0A0A';ctx.fillRect(0,0,W,H);  
  const bg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*.5);bg.addColorStop(0,'rgba(26,10,10,.85)');bg.addColorStop(1,'transparent');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);  
  const a1=Math.min(t/.5,1),a2=Math.min(Math.max((t-.4)/.4,0),1),a3=Math.min(Math.max((t-.8)/.5,0),1);  
  const gl=t>1.8&&t<2.1;  
  ctx.textAlign='center';ctx.textBaseline='middle';  
  if(a1){ctx.font=`italic 400 ${W*.03}px 'Playfair Display',serif`;ctx.fillStyle=`rgba(255,255,255,${a1})`;ctx.fillText('Embrace',W/2,H*.33);}  
  if(a2){ctx.font=`400 ${W*.011}px 'Space Mono',monospace`;ctx.fillStyle=`rgba(70,70,70,${a2})`;ctx.fillText('t h e',W/2,H*.46);}  
  if(a3){  
    if(gl){ctx.font=`900 ${W*.175}px 'Bebas Neue',sans-serif`;ctx.fillStyle='rgba(255,0,60,.85)';ctx.fillText('CHAOS',W/2-5,H*.63);ctx.fillStyle='rgba(0,255,255,.85)';ctx.fillText('CHAOS',W/2+5,H*.63);}  
    ctx.font=`900 ${W*.175}px 'Bebas Neue',sans-serif`;ctx.fillStyle=`rgba(255,255,255,${a3})`;ctx.fillText('CHAOS',W/2,H*.63);  
  }  
}  
function S7(t){// Final lockup  
  ctx.fillStyle='#0A0A0A';ctx.fillRect(0,0,W,H);  
  const rv=Math.min(t/.9,1);  
  ctx.save();ctx.rect(0,H*(1-rv),W,H*rv);ctx.clip();  
  ctx.font=`900 ${W*.12}px 'Bebas Neue',sans-serif`;ctx.fillStyle='rgba(255,255,255,1)';ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText('AKO',W/2,H*.48);  
  ctx.restore();  
  const a2=Math.min(Math.max((t-.75)/.5,0),1);  
  if(a2){ctx.font=`400 ${W*.009}px 'Space Mono',monospace`;ctx.fillStyle=`rgba(85,85,85,${a2})`;ctx.textBaseline='top';ctx.fillText('S T U D I O S',W/2,H*.5);}  
  const a3=Math.min(Math.max((t-1.1)/.6,0),1);  
  if(a3){ctx.font=`900 ${W*.032}px 'Playfair Display',serif`;ctx.strokeStyle=`rgba(60,60,60,${a3})`;ctx.lineWidth=1.5;ctx.fillStyle='transparent';ctx.textBaseline='top';ctx.strokeText('CCC',W/2,H*.545);}  
  const a4=Math.min(Math.max((t-1.5)/.8,0),1);  
  if(a4){ctx.font=`italic 400 ${W*.013}px 'Playfair Display',serif`;ctx.fillStyle=`rgba(55,55,55,${a4})`;ctx.textBaseline='top';ctx.fillText('Embrace the chaos.',W/2,H*.605);}  
}  
  
const SR=[S0,S1,S2,S3,S4,S5,S6,S7];  
function frame(ts){  
  const dt=Math.min((ts-last)/1000,.05);last=ts;sT+=dt;  
  if(sT>SD){sT-=SD;scene=(scene+1)%SR.length;}  
  ctx.clearRect(0,0,W,H);  
  const fz=SD-.5;  
  if(sT>fz){  
    ctx.globalAlpha=1-(sT-fz)/.5;SR[scene](sT);ctx.globalAlpha=1;  
    ctx.globalAlpha=(sT-fz)/.5;SR[(scene+1)%SR.length](sT-fz);ctx.globalAlpha=1;  
  } else {SR[scene](sT);}  
  apGrain();  
  requestAnimationFrame(frame);  
}  
requestAnimationFrame(ts=>{last=ts;frame(ts);});  
  
// ── TEXT SUCCESSION ──  
const lines=[  
  {h:'<div class="sl-tiny">CONTROLLED CHAOS COLLECTION — SS25</div>',d:2400},  
  {h:'<div class="sl-tiny">AKO STUDIOS — EST. MMXXIV</div>',d:2000},  
  {h:'<div class="sl-med">There are those<br>who fear it —</div>',d:2800},  
  {h:'<div class="sl-xl">AND THOSE<br>WHO</div>',d:2500},  
  {h:'<div class="sl-xl">WEAR<br>IT</div>',d:2600},  
  {h:'<div class="sl-it">"in beauty there is disorder.<br>in disorder there is peace."</div>',d:3000},  
  {h:'<div class="sl-med">WE WERE BORN<br>IN THE NOISE</div>',d:2600},  
  {h:'<div class="sl-tiny">CCC-SS25-001 / TOKYO — LOS ANGELES</div>',d:2000},  
  {h:'<div class="sl-xl">CHAOS IS A<br>LANGUAGE</div>',d:2600},  
  {h:'<div class="sl-it">"We did not ask for permission."</div>',d:2600},  
  {h:'<div class="sl-final">AKO Studios<span class="sl-ccc-out">CCC</span></div>',d:4200},  
];  
const tc=document.getElementById('ts');  
let si=0,cur=null;  
function nxt(){  
  if(cur){cur.style.transition='opacity .4s,transform .4s';cur.style.opacity='0';cur.style.transform='translateY(-14px)';setTimeout(()=>{if(cur)cur.remove();},480);}  
  const l=lines[si%lines.length];  
  const el=document.createElement('div');el.className='sl';el.innerHTML=l.h;tc.appendChild(el);cur=el;  
  requestAnimationFrame(()=>{el.style.transition='opacity .55s,transform .55s';el.style.opacity='1';el.style.transform='translateY(0)';});  
  si++;setTimeout(nxt,l.d);  
}  
setTimeout(nxt,700);  
  
// ── PRODUCT CARDS ──  
const pcfg=[{bg:'#0A0A0A',dark:true},{bg:'#F0EBE2',dark:false},{bg:'#0A0A0A',dark:true},{bg:'#111',dark:true},{bg:'#F5F2EC',dark:false},{bg:'#F0EBE2',dark:false}];  
[1,2,3,4,5,6].forEach(i=>{  
  const c=document.getElementById('p'+i);if(!c)return;  
  const x=c.getContext('2d'),cfg=pcfg[i-1];  
  function d(){  
    const w=c.width=c.offsetWidth,h=c.height=c.offsetHeight;  
    x.fillStyle=cfg.bg;x.fillRect(0,0,w,h);  
    x.strokeStyle=cfg.dark?'rgba(255,255,255,.04)':'rgba(0,0,0,.06)';x.lineWidth=1;  
    for(let y=0;y<h;y+=8){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();}  
    for(let px=0;px<w;px+=8){x.beginPath();x.moveTo(px,0);x.lineTo(px,h);x.stroke();}  
    const fc=cfg.dark?'rgba(255,255,255,.05)':'rgba(0,0,0,.07)';  
    x.fillStyle=fc;x.fillRect(w*.3,h*.18,w*.4,h*.56);  
    x.font=`900 ${w*.14}px 'Playfair Display',serif`;  
    x.fillStyle=cfg.dark?'rgba(240,235,226,.14)':'rgba(10,10,10,.11)';  
    x.textAlign='center';x.textBaseline='middle';x.fillText('CCC',w/2,h*.465);  
  }  
  d();new ResizeObserver(d).observe(c);  
});  
  
// ── EDITORIAL CANVAS ──  
(function(){  
  const c=document.getElementById('ec');if(!c)return;  
  const x=c.getContext('2d');  
  function d(){  
    const w=c.width=c.offsetWidth,h=c.height=c.offsetHeight;  
    x.fillStyle='#0C0C0C';x.fillRect(0,0,w,h);  
    x.fillStyle='#161616';x.fillRect(0,0,w*.17,h);x.fillRect(w*.83,0,w*.17,h);  
    x.fillStyle='#121212';x.fillRect(0,h*.54,w,h*.46);  
    const rg=x.createLinearGradient(0,h*.54,0,h);rg.addColorStop(0,'rgba(255,190,90,.1)');rg.addColorStop(1,'transparent');  
    x.fillStyle=rg;x.fillRect(w*.22,h*.57,w*.56,h*.42);  
    x.fillStyle='rgba(255,170,70,.03)';x.beginPath();x.moveTo(w*.28,0);x.lineTo(w*.72,0);x.lineTo(w*.63,h);x.lineTo(w*.37,h);x.closePath();x.fill();  
    x.save();x.translate(w*.5,h*.54);  
    x.beginPath();x.moveTo(-w*.09,0);x.lineTo(-w*.12,-h*.28);x.lineTo(-w*.05,-h*.33);x.lineTo(0,-h*.4);x.lineTo(w*.05,-h*.33);x.lineTo(w*.12,-h*.28);x.lineTo(w*.09,0);x.closePath();x.fillStyle='rgba(18,18,18,.95)';x.fill();  
    x.beginPath();x.ellipse(0,-h*.44,w*.032,h*.038,0,0,Math.PI*2);x.fillStyle='rgba(195,165,125,.8)';x.fill();  
    x.restore();  
    x.font=`900 ${w*.12}px 'Bebas Neue',sans-serif`;x.fillStyle='rgba(255,255,255,.06)';x.textAlign='center';x.textBaseline='middle';x.fillText('CONTROLLED',w/2,h*.13);  
    for(let y=0;y<h;y+=3){const v=Math.random()*6|0;x.fillStyle=`rgba(${255-v},${255-v},${255-v},.012)`;x.fillRect(0,y,w,1.5);}  
  }  
  d();new ResizeObserver(d).observe(c);  
})();  
  
// ── SCROLL REVEAL ──  
const ro=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:.1});  
document.querySelectorAll('.rv,.ml-line').forEach(el=>ro.observe(el));  
</script>  
</body>  
</html>  
