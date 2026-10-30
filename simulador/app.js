const MULT_KEYS={mov:"Movimento do salão",del:"Pedidos de delivery",eq:"Tamanho da equipe",rep:"Repasse aos cotistas"};
const DEFAULTS={mc_mov:0.8,mc_del:0.5,mc_eq:0.75,mc_rep:0.714,mo_mov:1.333,mo_del:1.571,mo_eq:1.25,mo_rep:1.429,modo:"dias",a0:0,a1:0,a2:0,a3:0,a4:0,a5:0,a6:0,al_pizzas:0.8,al_precoPizza:55,al_bebidas:1.2,al_precoBebida:14,al_sobremesa:0.15,al_precoSobremesa:28,d0:0,d1:55,d2:55,d3:65,d4:95,d5:100,d6:70,lugares:60,giro:1.5,aprov:85,dias:24,pizzas:0.8,precoPizza:70,bebidas:2,precoBebida:28,sobremesa:0.25,precoSobremesa:32,
  pedidos:35,ticketDeliv:110,cmv:20,simples:10,cartao:2.5,custoDeliv:20,func:12,sal:3500,enc_fgts:8,enc_13:8.33,enc_ferias:11.11,enc_multa:3.2,enc_inss:0,enc_rat:0,enc_terc:0,enc_vt:200,enc_ref:350,prolabore:24000,aluguel:10000,energia:4000,mkt:10000,manut:2000,adm:4000,
  reaj:5,ramp1:70,ramp2:85,g2:30,g3:30,aporte:660000,cotas:3,rep1:7,rep2:9.8,rep3:12.6,reserva:30,caixa:200000};

const GROUPS=[
 {t:"Salão",open:true,modeSwitch:true,c:[
  ["lugares","Lugares no salão",20,200,1,"","Mesas × cadeiras"]]},
 {t:"Cálculo Jantar",open:true,c:[
  ["__sub__","Pessoas por dia"],
  ["d0","Segunda",0,400,1,"pessoas","0 = sem jantar","dias"],
  ["d1","Terça",0,400,1,"pessoas","","dias"],
  ["d2","Quarta",0,400,1,"pessoas","","dias"],
  ["d3","Quinta",0,400,1,"pessoas","","dias"],
  ["d4","Sexta",0,400,1,"pessoas","","dias"],
  ["d5","Sábado",0,400,1,"pessoas","","dias"],
  ["d6","Domingo",0,400,1,"pessoas","","dias"],
  ["giro","Giro por noite",0.5,3.5,0.05,"x","Quantas vezes cada lugar é ocupado","giro"],
  ["aprov","Aproveitamento dos lugares",50,100,1,"%","Cadeiras vazias em mesas parciais","giro"],
  ["dias","Dias abertos por mês",16,30,1,"dias","","giro"],
  ["__sub__","Ticket médio do jantar"],
  ["__calc__","ticket"],
  ["pizzas","Pizzas por cliente",0,2,0.05,"un",""],
  ["precoPizza","Preço médio da pizza",0,150,1,"R$",""],
  ["bebidas","Bebidas por cliente",0,5,0.1,"un","Drinks, vinho, chopp, soft"],
  ["precoBebida","Preço médio da bebida",0,80,1,"R$",""],
  ["sobremesa","Sobremesas por cliente",0,1,0.05,"un",""],
  ["precoSobremesa","Preço da sobremesa",0,60,1,"R$",""]]},
 {t:"Cálculo Almoço",open:true,c:[
  ["__sub__","Pessoas por dia"],
  ["a0","Segunda",0,400,1,"pessoas","0 = sem almoço"],
  ["a1","Terça",0,400,1,"pessoas",""],
  ["a2","Quarta",0,400,1,"pessoas",""],
  ["a3","Quinta",0,400,1,"pessoas",""],
  ["a4","Sexta",0,400,1,"pessoas",""],
  ["a5","Sábado",0,400,1,"pessoas",""],
  ["a6","Domingo",0,400,1,"pessoas",""],
  ["__sub__","Ticket médio do almoço"],
  ["__calc__","ticketAl"],
  ["al_pizzas","Pizzas por cliente",0,2,0.05,"un",""],
  ["al_precoPizza","Preço médio da pizza",0,150,1,"R$",""],
  ["al_bebidas","Bebidas por cliente",0,5,0.1,"un",""],
  ["al_precoBebida","Preço médio da bebida",0,80,1,"R$",""],
  ["al_sobremesa","Sobremesas por cliente",0,1,0.05,"un",""],
  ["al_precoSobremesa","Preço da sobremesa",0,60,1,"R$",""]]},
 {t:"Delivery",c:[
  ["pedidos","Pedidos por dia",0,300,1,"pedidos","Média por dia aberto, somando almoço e jantar"],
  ["ticketDeliv","Ticket por pedido",50,200,1,"R$",""],
  ["custoDeliv","Custo do delivery",0,35,0.5,"%","App, embalagem e entrega"]]},
 {t:"Custos variáveis",c:[
  ["cmv","Insumos (CMV)",10,45,0.5,"%","Mercado: 25% a 32%"],
  ["__tax__"],
  ["simples","Imposto (Simples Nacional)",0,25,0.1,"%","Alíquota efetiva usada nos cálculos"],
  ["cartao","Taxa de cartão",0,6,0.1,"%","Maquininha, média entre débito, crédito e Pix"]]},
 {t:"Equipe e encargos",regime:true,note:"Encargos sobre o salário bruto. No Simples, INSS patronal, RAT e Terceiros já estão no imposto do Simples.",c:[
  ["sal","Salário médio bruto",0,12000,50,"R$","Por funcionário, sem encargos"],
  ["enc_fgts","FGTS",0,12,0.01,"%",""],
  ["enc_13","13º salário (provisão)",0,12,0.01,"%","1/12 do salário"],
  ["enc_ferias","Férias + 1/3 (provisão)",0,15,0.01,"%","1/12 de 4/3 do salário"],
  ["enc_multa","Multa do FGTS (provisão)",0,6,0.1,"%","40% do FGTS em demissões sem justa causa"],
  ["enc_inss","INSS patronal",0,25,0.1,"%","0% no Simples · 20% no Lucro Presumido"],
  ["enc_rat","RAT (acidente de trabalho)",0,6,0.1,"%","0% no Simples · 1% a 3% fora dele"],
  ["enc_terc","Terceiros (Sistema S)",0,8,0.1,"%","0% no Simples · 5,8% fora dele"],
  ["enc_vt","Vale-transporte",0,800,10,"R$","Por funcionário, já descontados os 6% do salário"],
  ["enc_ref","Refeição",0,1200,10,"R$","Por funcionário, por mês"]]},
 {t:"Custos fixos",c:[
  ["func","Funcionários",3,30,1,"pessoas",""],
  ["prolabore","Pró-labore",0,60000,1000,"R$",""],
  ["aluguel","Aluguel e IPTU",0,40000,500,"R$",""],
  ["energia","Luz, água e gás",0,15000,500,"R$",""],
  ["mkt","Marca e marketing",0,30000,500,"R$",""],
  ["manut","Manutenção",0,10000,500,"R$",""],
  ["adm","Administrativo",0,15000,500,"R$","Contador, sistema, seguro"],
  ["reaj","Reajuste anual dos fixos",0,15,0.5,"%",""]]},
 {t:"Crescimento",c:[
  ["ramp1","Movimento no mês 1",30,100,1,"%",""],
  ["ramp2","Movimento no mês 2",30,100,1,"%","Do mês 3 em diante: 100%"],
  ["g2","Crescimento no ano 2",-20,60,1,"%",""],
  ["g3","Crescimento no ano 3",-20,60,1,"%",""]]},
 {t:"Multiplicadores dos cenários",note:"Aplicados sobre as premissas acima. O Base usa 1x em tudo.",c:[
  ["mc_mov","Conservador · movimento do salão",0.3,1.5,0.01,"x",""],
  ["mc_del","Conservador · pedidos de delivery",0.2,1.5,0.01,"x",""],
  ["mc_eq","Conservador · tamanho da equipe",0.3,1.5,0.01,"x",""],
  ["mc_rep","Conservador · repasse aos cotistas",0.2,1.5,0.001,"x",""],
  ["mo_mov","Otimista · movimento do salão",0.8,2.5,0.01,"x",""],
  ["mo_del","Otimista · pedidos de delivery",0.8,3,0.01,"x",""],
  ["mo_eq","Otimista · tamanho da equipe",0.8,2.5,0.01,"x",""],
  ["mo_rep","Otimista · repasse aos cotistas",0.8,3,0.001,"x",""]]},
 {t:"Investidor",c:[
  ["aporte","Aporte total",100000,2000000,10000,"R$",""],
  ["cotas","Número de cotas",1,6,1,"cotas",""],
  ["rep1","Repasse por cota · ano 1",0,40,0.1,"R$ mil/mês",""],
  ["rep2","Repasse por cota · ano 2",0,40,0.1,"R$ mil/mês",""],
  ["rep3","Repasse por cota · ano 3",0,40,0.1,"R$ mil/mês",""],
  ["reserva","Reserva de caixa",0,60,1,"%","Do que sobra após o repasse"],
  ["caixa","Capital de giro",0,600000,10000,"R$",""]]}
];

const ZERO=(()=>{const z={};for(const k in DEFAULTS){const v=DEFAULTS[k];z[k]=(typeof v!=="number"||k.startsWith("mc_")||k.startsWith("mo_")||k.startsWith("enc_"))?v:0}z.ramp1=100;z.ramp2=100;return z})();
let P={...ZERO}, SC="base", CUR=null, DIRTY=false, SAVED=[];
const clone=o=>JSON.parse(JSON.stringify(o));
function mult(p,k){const pre=k==="conservador"?"mc_":k==="otimista"?"mo_":null;const g=x=>pre?p[pre+x]:1;return {mov:g("mov"),del:g("del"),eq:g("eq"),rep:g("rep")}}
const ENC=[["enc_fgts","FGTS"],["enc_13","13º salário"],["enc_ferias","Férias + 1/3"],["enc_multa","Multa do FGTS"],["enc_inss","INSS patronal"],["enc_rat","RAT"],["enc_terc","Terceiros (Sistema S)"]];
function team(p){const sal=p.sal||0,rows=ENC.map(([k,n])=>[n,p[k]||0,sal*(p[k]||0)/100]).filter(r=>r[1]>0);
  const enc=rows.reduce((a,r)=>a+r[2],0),ben=(p.enc_vt||0)+(p.enc_ref||0),per=sal+enc+ben;
  return {sal,rows,enc,ben,per,total:per*p.func,encPct:sal>0?enc/sal*100:0,fator:sal>0?per/sal:0}}
function eff(p,k){const m=mult(p,k),e={...p};e.giro=p.giro*m.mov;for(let i=0;i<7;i++){e["d"+i]=Math.round(p["d"+i]*m.mov);e["a"+i]=Math.round(p["a"+i]*m.mov)}
  e.pedidos=p.pedidos*m.del;e.func=p.func*m.eq;e.rep1=p.rep1*m.rep;e.rep2=p.rep2*m.rep;e.rep3=p.rep3*m.rep;return e}
function fromSaved(o){if(!o)return {...ZERO};const b=(o.sets&&o.sets.base)||o.p||{};return {...DEFAULTS,...b}}
try{const s=JSON.parse(localStorage.getItem("felicia-sim")||"null");if(s){P=fromSaved(s);SC=s.sc||"base";CUR=s.cur||null;DIRTY=!!s.dirty}}catch(e){}
try{SAVED=JSON.parse(localStorage.getItem("felicia-saved")||"[]")||[]}catch(e){SAVED=[]}
const hhmm=d=>d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
function save(){let ok=true;try{localStorage.setItem("felicia-sim",JSON.stringify({p:P,sc:SC,cur:CUR,dirty:DIRTY}))}catch(e){ok=false}
  const a=document.getElementById("autosave");if(a)a.textContent=ok?"Alterações salvas automaticamente às "+hhmm(new Date())+".":"Este navegador bloqueou o salvamento automático. Use Salvar para guardar um cenário enquanto a página estiver aberta.";}
function persistSaved(){try{localStorage.setItem("felicia-saved",JSON.stringify(SAVED))}catch(e){}}

const nf=(v,d=0)=>(isFinite(v)?v:0).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d});
function brl(v){if(!isFinite(v))v=0;const a=Math.abs(v),s=v<0?"–":"";
  if(a>=1e6)return s+"R$ "+nf(a/1e6,2)+" mi";
  if(a>=1e3)return s+"R$ "+nf(a/1e3,0)+" mil";
  return s+"R$ "+nf(a,0)}

function run(p){
  const ticket=p.pizzas*p.precoPizza+p.bebidas*p.precoBebida+p.sobremesa*p.precoSobremesa;
  const WK=4.33, DAYS=[p.d0,p.d1,p.d2,p.d3,p.d4,p.d5,p.d6], LUNCH=[p.a0,p.a1,p.a2,p.a3,p.a4,p.a5,p.a6];
  const sumA=LUNCH.reduce((a,b)=>a+b,0), almocoM=sumA*WK, ticketAl=p.al_pizzas*p.al_precoPizza+p.al_bebidas*p.al_precoBebida+p.al_sobremesa*p.al_precoSobremesa, salaoAlmoco=almocoM*ticketAl;
  let pessoas,salao,dias,pico;
  let jantarM;
  if(p.modo==="dias"){const open=DAYS.filter((x,i)=>x>0||LUNCH[i]>0).length;dias=Math.max(open,1)*WK;jantarM=DAYS.reduce((a,b)=>a+b,0)*WK;pico=Math.max(...DAYS,...LUNCH)}
  else{dias=p.dias;jantarM=p.lugares*p.giro*p.aprov/100*dias;pico=Math.max(p.lugares*p.giro*p.aprov/100,...LUNCH)}
  pessoas=(jantarM+almocoM)/dias;
  const salaoJantar=jantarM*ticket;
  salao=salaoJantar+salaoAlmoco;
  const ticketMedio=(jantarM+almocoM)>0?salao/(jantarM+almocoM):0;
  const giroImp=p.lugares>0?pessoas/p.lugares:0;
  const deliv=p.pedidos*p.ticketDeliv*dias;
  const total=salao+deliv;
  const pedidos=p.pedidos;
  const delivShare=total>0?deliv/total:0;
  const varPct=(p.cmv+p.simples+p.cartao+delivShare*p.custoDeliv)/100;
  const T=team(p),equipe=T.total;
  const fixoBase=equipe+p.prolabore+p.aluguel+p.energia+p.mkt+p.manut+p.adm;
  const ramp=[p.ramp1/100,p.ramp2/100,...Array(10).fill(1)];
  const y1=ramp.map(f=>total*f), A1=y1.reduce((a,b)=>a+b,0);
  const A2=A1*(1+p.g2/100), A3=A2*(1+p.g3/100);
  const revs=[...y1,...Array(12).fill(A2/12),...Array(12).fill(A3/12)];
  const rep=[p.rep1,p.rep2,p.rep3].map(x=>x*1000*p.cotas);
  let F=0,L=0,Pg=0,C=0,cash=0,minCash=0,quit=null;
  const m=[],cum={};
  revs.forEach((r,i)=>{const y=Math.floor(i/12);
    const fixo=fixoBase*Math.pow(1+p.reaj/100,y);
    const lucro=r*(1-varPct)-fixo;
    const pay=Math.max(0,Math.min(rep[y],p.aporte-Pg));
    Pg+=pay;F+=r;L+=lucro;C+=r-lucro;cash+=lucro-pay;minCash=Math.min(minCash,cash);
    if(quit===null&&p.aporte>0&&Pg>=p.aporte-0.5)quit=i+1;
    m.push({r,lucro,pay,L,Pg});
    if((i+1)%12===0){const sob=L-Pg;cum[i+1]={F,B:F*(1-p.cmv/100),C,L,Pg,sob,res:Math.max(0,sob)*p.reserva/100,dist:Math.max(0,sob)*(1-p.reserva/100),pct:p.aporte>0?Pg/p.aporte:0}}
  });
  let pq=quit;
  if(pq===null){let pg=Pg,i=36;const last=Math.max(rep[2],0);while(pg<p.aporte&&i<240&&last>0){pg+=last;i++}pq=pg>=p.aporte?i:null}
  const mature=revs[11];
  const lucroM=mature*(1-varPct)-fixoBase;
  const be=fixoBase/(1-varPct);
  return {ticketAl,LUNCH,jantarM,almocoM,salaoJantar,salaoAlmoco,ticketMedio,delivShare,dias,giroImp,pico,DAYS,WK,ticket,pessoas,salao,total,deliv,pedidos,varPct,equipe,T,fixoBase,m,cum,quit,pq,mature,lucroM,be,minCash,annual:[A1,A2,A3],
    cost:{cmv:mature*p.cmv/100,simples:mature*p.simples/100,cartao:mature*p.cartao/100,del:mature*delivShare*p.custoDeliv/100}};
}

// ---------- controls ----------
const aside=document.getElementById("controls");
{const n=document.createElement("p");n.className="hint";n.style.margin="4px 0 8px";n.textContent="Tudo que você muda aqui vale para os três cenários. Conservador e Otimista aplicam os multiplicadores do fim da lista.";aside.appendChild(n)}
function fmtVal(v,step){const d=step<1?(step<0.1?2:1):0;return d?String(+v.toFixed(d)):String(Math.round(v))}
GROUPS.forEach((g,gi)=>{
  const d=document.createElement("details");if(g.open)d.open=true;
  d.innerHTML=`<summary>${g.t}</summary>`;
  if(g.note){const n=document.createElement("p");n.className="hint";n.style.margin="0 0 12px";n.textContent=g.note;d.appendChild(n)}
  if(g.regime){const ms=document.createElement("div");ms.className="modeseg";ms.innerHTML=`<span class="hint">Regime tributário</span><div class="seg" role="group" aria-label="Regime tributário"><button type="button" data-reg="simples">Simples Nacional</button><button type="button" data-reg="presumido">Lucro Presumido</button></div>`;d.appendChild(ms);
    ms.querySelectorAll("[data-reg]").forEach(b=>b.addEventListener("click",()=>{const pr=b.dataset.reg==="simples";P.enc_inss=pr?0:20;P.enc_rat=pr?0:2;P.enc_terc=pr?0:5.8;markCustom();syncControls();update()}))}
  if(g.modeSwitch){const ms=document.createElement("div");ms.className="modeseg";ms.innerHTML=`<span class="hint">Calcular o salão por</span><div class="seg" role="group" aria-label="Forma de cálculo do salão"><button type="button" id="modo-dias" data-modo="dias">Pessoas por dia</button><button type="button" id="modo-giro" data-modo="giro">Giro</button></div>`;d.appendChild(ms);
    ms.querySelectorAll("[data-modo]").forEach(b=>b.addEventListener("click",()=>{P.modo=b.dataset.modo;applyMode();update()}))}
  g.c.forEach(([id,label,min,max,step,unit,hint,mode])=>{
    if(id==="__sub__"){const h=document.createElement("div");h.className="subhead";h.textContent=label;d.appendChild(h);return}
    if(id==="__tax__"){const c=document.createElement("div");c.className="taxban";c.id="taxBanner";d.appendChild(c);return}
    if(id==="__calc__"){const c=document.createElement("div");c.className="calc";c.innerHTML=`<span>Ticket médio por cliente</span><b id="calc-${label}">–</b>`;d.appendChild(c);return}
    const w=document.createElement("div");w.className="ctl";if(mode)w.dataset.mode=mode;
    w.innerHTML=`<div class="row"><label for="r-${id}">${label}</label><span class="num"><input type="number" id="n-${id}" min="${min}" max="${max}" step="${step}" aria-label="${label}"><span>${unit}</span></span></div>
      <input type="range" id="r-${id}" min="${min}" max="${max}" step="${step}">${hint?`<span class="hint">${hint}</span>`:""}`;
    d.appendChild(w);
    const r=w.querySelector("input[type=range]"),n=w.querySelector("input[type=number]");
    r.addEventListener("input",()=>{P[id]=+r.value;n.value=fmtVal(+r.value,step);markCustom();update()});
    n.addEventListener("change",()=>{let v=+n.value;if(isNaN(v))v=P[id];P[id]=v;r.value=v;markCustom();update()});
  });
  aside.appendChild(d);
});
function syncControls(){GROUPS.forEach(g=>g.c.forEach(([id,, , ,step])=>{if(id.startsWith("__"))return;const r=document.getElementById("r-"+id),n=document.getElementById("n-"+id);r.value=P[id];n.value=fmtVal(P[id],step)}))}
function markCustom(){if(CUR)DIRTY=true}
function applyMode(){document.querySelectorAll(".ctl[data-mode]").forEach(el=>el.hidden=el.dataset.mode!==P.modo);document.querySelectorAll("[data-modo]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.modo===P.modo))}

document.querySelectorAll("[data-sc]").forEach(b=>b.addEventListener("click",()=>{SC=b.dataset.sc;update()}));
const ANEXO1=[[180000,4,0],[360000,7.3,5940],[720000,9.5,13860],[1800000,10.7,22500],[3600000,14.3,87300],[4800000,19,378000]];
function simplesEf(rbt){if(rbt<=0)return {faixa:0,ef:0};for(let i=0;i<ANEXO1.length;i++){const [lim,nom,ded]=ANEXO1[i];if(rbt<=lim)return {faixa:i+1,ef:i===0?nom:(rbt*nom/100-ded)/rbt*100}}
  const [,nom,ded]=ANEXO1[5];return {faixa:7,ef:(rbt*nom/100-ded)/rbt*100}}
function renderTax(E,R){const el=document.getElementById("taxBanner");if(!el)return;
  const mes=R.mature,ano=mes*12,t=simplesEf(ano),usado=P.simples;
  if(mes<=0){el.innerHTML=`<span class="tb-l">Imposto do cenário</span><p class="tb-n">Preencha o movimento para calcular o imposto.</p>`;return}
  const yrs=R.annual.map(a=>simplesEf(a).ef);
  const diff=Math.abs(t.ef-usado)>=0.2;
  const faixa=t.faixa>6?"acima do limite do Simples":t.faixa+"ª faixa do Anexo I";
  let warn="";if(ano>4.8e6)warn=`<p class="tb-w">Acima de R$ 4,8 mi por ano a casa sai do Simples Nacional. O imposto real tende a ser maior.</p>`;
  else if(ano>3.6e6)warn=`<p class="tb-w">Acima de R$ 3,6 mi por ano, o ICMS passa a ser pago fora do Simples. Confirme o valor total com o contador.</p>`;
  el.innerHTML=`<span class="tb-l">Imposto do cenário ${SC==="base"?"Base":SC==="otimista"?"Otimista":"Conservador"}</span>
    <div class="tb-big"><b>${brl(mes*t.ef/100)}</b><span>por mês · ${brl(ano*t.ef/100)} por ano</span></div>
    <p class="tb-n">Faturamento de ${brl(mes)} por mês (${brl(ano)} em 12 meses), ${faixa}. Alíquota efetiva pela tabela: <b>${nf(t.ef,2)}%</b>.</p>
    <p class="tb-n">Por ano: ${R.annual.map((a,i)=>`ano ${i+1} ${nf(yrs[i],1)}%`).join(" · ")}.</p>
    ${diff?`<div class="tb-act"><span>Você está usando ${nf(usado,1)}% (${brl(mes*usado/100)} por mês).</span><button type="button" class="btn sm" id="useTax">Usar ${nf(t.ef,2)}%</button></div>`:`<p class="tb-ok">A alíquota usada nos cálculos bate com a tabela.</p>`}${warn}`;
  const b=document.getElementById("useTax");if(b)b.onclick=()=>{P.simples=Math.round(t.ef*100)/100;markCustom();syncControls();update()};
}
function confirmBtn(id,ask,apply){const b=document.getElementById(id),label=b.textContent;let t;b.addEventListener("click",()=>{
  if(!b.classList.contains("confirm")){b.classList.add("confirm");b.textContent=ask;t=setTimeout(()=>{b.classList.remove("confirm");b.textContent=label},3000);return}
  clearTimeout(t);b.classList.remove("confirm");b.textContent=label;P=apply();markCustom();syncControls();applyMode();update();const ml=document.getElementById("menuList");if(ml){ml.hidden=true;document.getElementById("menuBtn").setAttribute("aria-expanded","false")}})}
confirmBtn("zeroBtn","Confirmar: zerar tudo",()=>({...ZERO,mc_mov:P.mc_mov,mc_del:P.mc_del,mc_eq:P.mc_eq,mc_rep:P.mc_rep,mo_mov:P.mo_mov,mo_del:P.mo_del,mo_eq:P.mo_eq,mo_rep:P.mo_rep}));
confirmBtn("exampleBtn","Confirmar: carregar exemplo",()=>({...DEFAULTS}));
{const mb=document.getElementById("menuBtn"),ml=document.getElementById("menuList");
  const setM=o=>{ml.hidden=!o;mb.setAttribute("aria-expanded",String(o))};
  mb.addEventListener("click",e=>{e.stopPropagation();setM(ml.hidden)});
  document.addEventListener("click",e=>{if(!ml.hidden&&!ml.contains(e.target)&&e.target!==mb)setM(false)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!ml.hidden){setM(false);mb.focus()}});
  document.getElementById("present").addEventListener("click",()=>setM(false));
  const ci=document.getElementById("copyInv");ci.addEventListener("click",()=>{
    const code=btoa(unescape(encodeURIComponent(JSON.stringify(P)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
    const link=new URL("../?p="+code+"#calculos",location.href).href;
    const ok=()=>{ci.textContent="Link copiado";setTimeout(()=>{ci.textContent="Copiar link do investidor";setM(false)},1600)};
    try{navigator.clipboard.writeText(link).then(ok,()=>{ci.textContent="Não foi possível copiar"})}catch(e){ci.textContent="Não foi possível copiar"}});}
document.getElementById("present").addEventListener("click",e=>{const on=document.body.classList.toggle("present");e.currentTarget.textContent=on?"Mostrar premissas":"Modo apresentação";chart&&chart.resize()});

// ---------- render ----------
let chart=null;
function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()}
function update(){
  save();renderCur&&renderCur();
  document.querySelectorAll("[data-sc]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.sc===SC));
  document.querySelectorAll("[data-reg]").forEach(b=>b.setAttribute("aria-pressed",String((b.dataset.reg==="simples")===(P.enc_inss===0&&P.enc_rat===0&&P.enc_terc===0))));
  const E=eff(P,SC),R=run(E);
  document.getElementById("calc-ticket").textContent="R$ "+nf(R.ticket,2);
  renderTax(E,R);
  document.getElementById("calc-ticketAl").textContent="R$ "+nf(R.ticketAl,2);

  document.getElementById("k-fat").textContent=brl(R.mature);
  document.getElementById("k-fat-s").textContent="Ano 1 cheio · "+brl(R.mature*12)+" no ano";
  document.getElementById("k-luc").textContent=brl(R.lucroM);
  document.getElementById("k-luc-s").textContent="Margem de "+nf(R.lucroM/R.mature*100,1)+"%";
  document.getElementById("k-pay").textContent=P.aporte<=0?"Sem aporte":R.quit?("Mês "+R.quit):(R.pq?("Mês ~"+R.pq):"Não quita");
  document.getElementById("k-pay-s").textContent=brl(P.aporte)+" em "+P.cotas+(P.cotas>1?" cotas de ":" cota de ")+brl(P.cotas>0?P.aporte/P.cotas:0);
  document.getElementById("k-36").textContent=brl(R.cum[36].L);
  document.getElementById("k-36-s").textContent=brl(R.cum[36].dist)+" para distribuição";

  const night=[
    [nf(R.pessoas,0),"Clientes no salão por dia"+(R.almocoM>0?" · almoço e jantar":"")],
    ["R$ "+nf(R.ticketMedio,0),R.almocoM>0?"Ticket médio no salão · jantar R$ "+nf(R.ticket,0)+", almoço R$ "+nf(R.ticketAl,0):"Ticket médio no salão"],
    [nf(R.pedidos,0)+" pedidos","Delivery por dia · "+nf(R.delivShare*100,0)+"% do faturamento"],
    [brl(R.total/R.dias),"Faturamento por dia"],
    [brl(R.be),"Ponto de equilíbrio por mês"],
    [nf(R.giroImp,2)+"x","Giro médio por dia"]
  ];
  document.getElementById("night").innerHTML=night.map(([v,l])=>`<div class="stat"><span class="v">${v}</span><span class="l">${l}</span></div>`).join("");
  const wk=document.getElementById("week");
  if(P.modo==="dias"||R.almocoM>0){const names=["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
    const J=P.modo==="dias"?R.DAYS:R.DAYS.map(()=>Math.round(P.lugares*E.giro*P.aprov/100)),A=R.LUNCH;
    const mx=Math.max(1,...J.map((d,i)=>d+A[i])),wkTot=J.reduce((a,b)=>a+b,0)+A.reduce((a,b)=>a+b,0);
    wk.hidden=false;
    wk.innerHTML=`<p class="note">Semana típica · ${nf(wkTot,0)} pessoas no salão por semana, ${nf(wkTot*R.WK,0)} por mês</p><div class="legend" style="margin-top:0"><span><i style="background:var(--red)"></i>Jantar</span><span><i style="background:var(--red-deep);opacity:.45"></i>Almoço</span></div><div class="bars">`+
      J.map((d,i)=>{const a=A[i],t=d+a;return `<span class="n">${names[i]}</span><span class="t" style="display:flex"><div style="width:${d/mx*100}%;border-radius:0"></div><div style="width:${a/mx*100}%;border-radius:0;background:var(--red-deep);opacity:.45"></div></span><span class="val">${t?`${nf(t,0)} pessoas<small>${a?"almoço "+nf(a,0)+" · ":""}jantar ${nf(d,0)} · ${brl(d*R.ticket+a*R.ticketAl)}</small>`:"fechado"}</span>`}).join("")+`</div>`}
  else wk.hidden=true;

  // summary table
  const rows=[
    ["Faturamento total","F"],["Lucro bruto total","B"],["Custo total","C"],["Lucro líquido total","L",1],
    ["Repasse aos cotistas total","Pg"],["Sobra após repasse total","sob"],["Reserva ("+P.reserva+"%) total","res"],["Distribuição ("+(100-P.reserva)+"%) total","dist",1]];
  let h=`<thead><tr><th></th><th>12 meses total</th><th>24 meses total</th><th class="hl">36 meses total</th></tr></thead><tbody>`;
  rows.forEach(([n,k,key])=>{h+=`<tr${key?' class="key"':""}><td>${n}</td>${[12,24,36].map(x=>`<td>${brl(R.cum[x][k])}</td>`).join("")}</tr>`});
  h+=`<tr><td>Aporte devolvido</td>${[12,24,36].map(x=>{const c=R.cum[x];const done=R.quit&&R.quit<=x;return `<td>${nf(Math.min(c.pct,1)*100,0)}%${done?" (mês "+R.quit+")":""}</td>`}).join("")}</tr></tbody>`;
  document.getElementById("summary").innerHTML=h;
  document.getElementById("annual").textContent=`Faturamento por ano: ano 1 ${brl(R.annual[0])} · ano 2 ${brl(R.annual[1])} · ano 3 ${brl(R.annual[2])}. Repasse por cota: R$ ${nf(E.rep1,1)} mil, R$ ${nf(E.rep2,1)} mil e R$ ${nf(E.rep3,1)} mil por mês.`;

  // cost bars
  const items=[["Insumos (CMV)",R.cost.cmv],["Equipe ("+nf(E.func,1)+" pessoas)",R.equipe],["Pró-labore",P.prolabore],["Imposto (Simples)",R.cost.simples],["Taxa de cartão",R.cost.cartao],
    ["Aluguel e IPTU",P.aluguel],["Marca e marketing",P.mkt],["Delivery (app e embalagem)",R.cost.del],["Luz, água e gás",P.energia],
    ["Administrativo",P.adm],["Manutenção",P.manut]].filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
  const mx=Math.max(1,...items.map(x=>x[1]));
  document.getElementById("bars").innerHTML=items.map(([n,v])=>`<span class="n">${n}</span><span class="t"><div style="width:${v/mx*100}%"></div></span><span class="val">${brl(v)}<small>${nf(v/R.mature*100,1)}%</small></span>`).join("");
  const fixo=R.fixoBase, var$=R.mature*R.varPct;
  {const T=R.T,n=E.func,row=(a,b,c,d,k)=>`<tr${k?' class="key"':""}><td>${a}</td><td>${b}</td><td>${c}</td><td>${d}</td></tr>`;
    document.getElementById("teamLead").textContent=`${nf(n,1)} funcionários. Cada um custa ${nf(T.fator,2)}x o salário bruto${document.querySelector('[data-reg]')&&P.enc_inss>0?" (regime fora do Simples)":" (Simples Nacional)"}.`;
    document.getElementById("teamTable").innerHTML=`<thead><tr><th>Item</th><th>% do salário</th><th>Por funcionário</th><th class="hl">Equipe por mês</th></tr></thead><tbody>`+
      row("Salário bruto","100%",brl(T.sal),brl(T.sal*n))+
      T.rows.map(([nm,pc,v])=>row(nm,nf(pc,2)+"%",brl(v),brl(v*n))).join("")+
      row("Total de encargos",nf(T.encPct,1)+"%",brl(T.enc),brl(T.enc*n),1)+
      (P.enc_vt>0?row("Vale-transporte","–",brl(P.enc_vt),brl(P.enc_vt*n)):"")+
      (P.enc_ref>0?row("Refeição","–",brl(P.enc_ref),brl(P.enc_ref*n)):"")+
      row("Custo total da equipe",nf(T.fator*100,0)+"%",brl(T.per),brl(T.total),1)+`</tbody>`}
  document.getElementById("costfoot").innerHTML=`<span>Custo fixo <b>${brl(fixo)}/mês</b></span><span>Variável <b>${nf(R.varPct*100,1)}% da receita</b></span><span>Custo total <b>${brl(fixo+var$)}/mês</b></span>`;

  // compare
  const sc=["conservador","base","otimista"],names={conservador:"Conservador",base:"Base",otimista:"Otimista"};
  const Rs=sc.map(s=>run(eff(P,s)));
  const crow=(n,f)=>`<tr><td>${n}</td>${Rs.map((r,i)=>`<td class="${sc[i]===SC?"cur":""}">${f(r,sc[i])}</td>`).join("")}</tr>`;
  document.getElementById("compare").innerHTML=`<thead><tr><th></th>${sc.map(s=>`<th class="${s===SC?"cur hl":""}">${names[s]}</th>`).join("")}</tr></thead><tbody>`+
    crow("Giro médio por dia",r=>nf(r.giroImp,2)+"x")+
    crow("Multiplicador de movimento",(r,k)=>nf(mult(P,k).mov,2)+"x")+
    crow("Pedidos de delivery por dia",r=>nf(r.pedidos,0))+
    crow("Delivery no faturamento",r=>nf(r.delivShare*100,0)+"%")+
    crow("Faturamento por mês",r=>brl(r.mature))+
    crow("Lucro líquido por mês",r=>brl(r.lucroM))+
    crow("Margem",r=>nf(r.lucroM/r.mature*100,1)+"%")+
    crow("Lucro em 36 meses",r=>brl(r.cum[36].L))+
    crow("Aporte devolvido em",r=>r.quit?"mês "+r.quit:(r.pq?"mês ~"+r.pq:"não quita"))+
    crow("Pior momento do caixa",r=>r.minCash<0?brl(r.minCash):"nunca negativo")+`</tbody>`;

  // alerts
  const A=[];
  const yr=R.annual.findIndex(a=>a>4.8e6);
  A.push(yr>=0?["bad","Simples",`O faturamento passa de R$ 4,8 mi no ano ${yr+1}. A casa sai do Simples e os impostos sobem além dos ${nf(P.simples,1)}% usados aqui${P.enc_inss>0?"":", e a folha passa a pagar INSS patronal, RAT e Terceiros (troque o regime em Equipe e encargos)"}.`]:["ok","Simples","Faturamento dentro do limite do Simples Nacional nos 3 anos."]);
  A.push(P.cmv<25?["warn","CMV",`${nf(P.cmv,1)}% está abaixo da faixa de mercado (25% a 32%). Tenha a ficha técnica pronta para mostrar.`]:P.cmv>32?["bad","CMV",`${nf(P.cmv,1)}% está acima de 32%, o teto recomendado para pizzarias.`]:["ok","CMV","Dentro da faixa de mercado para pizzarias (25% a 32%)."]);
  const prime=(R.cost.cmv+R.equipe+P.prolabore)/R.mature*100;
  A.push(prime>60?["bad","Prime cost",`Insumos + equipe somam ${nf(prime,0)}% da receita. Acima de 60%, a conta costuma não fechar.`]:["ok","Prime cost",`Insumos + equipe somam ${nf(prime,0)}% da receita, abaixo do limite de 60%.`]);
  const mg=R.lucroM/R.mature*100;
  A.push(mg>20?["warn","Margem",`Margem de ${nf(mg,1)}% está acima da média do setor (12% a 15%). Prepare a justificativa, como equipe enxuta ou CMV baixo.`]:mg<5?["bad","Margem",`Margem de ${nf(mg,1)}% deixa pouca folga para imprevistos.`]:["ok","Margem",`Margem de ${nf(mg,1)}%, em linha com o setor.`]);
  A.push(R.minCash<-P.caixa?["bad","Caixa",`O caixa chega a ${brl(R.minCash)}, mais do que o capital de giro de ${brl(P.caixa)}.`]:R.minCash<0?["warn","Caixa",`Os primeiros meses usam ${brl(-R.minCash)} do capital de giro (${nf(-R.minCash/P.caixa*100,0)}% dele).`]:["ok","Caixa","O repasse cabe no lucro de todos os meses."]);
  const gp=R.pico/P.lugares;
  A.push(gp>2.2?["warn","Capacidade",`No serviço mais cheio, cada lugar gira ${nf(gp,1)}x. Isso exige mesas rápidas e equipe dimensionada para o pico.`]:["ok","Capacidade",`No serviço mais cheio, cada lugar gira ${nf(gp,1)}x, viável para um pizza bar.`]);
  if(P.g2+P.g3>30&&P.reaj<P.g2/2)A.push(["warn","Crescimento","O faturamento cresce bem mais rápido que os custos fixos. Com mais movimento, a equipe tende a crescer junto."]);
  A.push(R.quit&&R.quit<=36?["ok","Aporte",`Os cotistas recebem 100% do aporte no mês ${R.quit}.`]:["warn","Aporte",`O aporte não volta inteiro em 36 meses${R.pq?" (previsão: mês ~"+R.pq+")":""}.`]);
  if(R.mature<=0)A.splice(0,A.length,["warn","Premissas","As premissas estão zeradas. Preencha o movimento do salão, o ticket médio e os custos para ver a leitura."]);
  document.getElementById("alerts").innerHTML=A.map(([c,t,x])=>`<div class="alert"><span class="pill ${c}">${t}</span><p>${x}</p></div>`).join("");

  drawChart(R);
}

function drawChart(R){
  if(!window.Chart)return;
  const red=css("--red"),ink=css("--ink"),muted=css("--muted"),line=css("--line");
  const labels=R.m.map((_,i)=>String(i+1));
  const data={labels,datasets:[
    {type:"bar",label:"Lucro do mês",data:R.m.map(x=>x.lucro),backgroundColor:R.m.map(x=>x.lucro<0?muted:red),borderRadius:3,yAxisID:"y",order:3},
    {type:"line",label:"Lucro acumulado",data:R.m.map(x=>x.L),borderColor:ink,borderWidth:2,pointRadius:0,yAxisID:"y2",tension:.25,order:1},
    {type:"line",label:"Aporte devolvido",data:R.m.map(x=>x.Pg),borderColor:muted,borderDash:[5,4],borderWidth:2,pointRadius:0,yAxisID:"y2",tension:.1,order:2}]};
  const tick={color:muted,font:{family:"Outfit",size:12}};
  const opts={responsive:true,maintainAspectRatio:false,animation:{duration:250},interaction:{mode:"index",intersect:false},
    plugins:{legend:{display:false},tooltip:{callbacks:{title:i=>"Mês "+i[0].label,label:c=>c.dataset.label+": "+brl(c.parsed.y)}}},
    scales:{x:{grid:{display:false},ticks:{...tick,callback:(v,i)=>((i+1)%6===0||i===0)?"m"+(i+1):""}},
      y:{position:"left",grid:{color:line},ticks:{...tick,callback:v=>brl(v)},title:{display:true,text:"Lucro do mês",color:muted}},
      y2:{position:"right",grid:{display:false},ticks:{...tick,callback:v=>brl(v)},title:{display:true,text:"Acumulado",color:muted}}}};
  if(chart){chart.data=data;chart.options=opts;chart.update()}else chart=new Chart(document.getElementById("chart"),{data,options:opts});
}
try{window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>update())}catch(e){}
new MutationObserver(()=>update()).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
// ---------- cenários salvos ----------
const panel=document.getElementById("savedPanel"),fab=document.getElementById("savedBtn");
function openPanel(focus){panel.hidden=false;fab.setAttribute("aria-expanded","true");renderSaved();if(focus){const i=document.getElementById("saveName");const cur=SAVED.find(x=>x.id===CUR);if(cur&&!i.value)i.value=cur.name;i.focus();i.select()}}
function closePanel(){panel.hidden=true;fab.setAttribute("aria-expanded","false")}
fab.addEventListener("click",()=>panel.hidden?openPanel(false):closePanel());
document.getElementById("saveOpen").addEventListener("click",()=>openPanel(true));
document.getElementById("savedClose").addEventListener("click",closePanel);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)closePanel()});
document.getElementById("saveForm").addEventListener("submit",e=>{e.preventDefault();
  const inp=document.getElementById("saveName");const name=inp.value.trim();
  if(!name){inp.placeholder="Dê um nome ao cenário para salvar";inp.focus();return}
  const now=new Date().toISOString();let it=SAVED.find(x=>x.name.toLowerCase()===name.toLowerCase());
  if(it){it.p={...P};delete it.sets;it.sc=SC;it.date=now}else{it={id:"c"+Date.now(),name,date:now,p:{...P},sc:SC};SAVED.unshift(it)}
  CUR=it.id;DIRTY=false;persistSaved();inp.value="";save();renderSaved();renderCur()});
function renderCur(){const c=document.getElementById("curName"),it=SAVED.find(x=>x.id===CUR);
  if(it){c.hidden=false;c.textContent="Cenário: "+it.name+(DIRTY?" · alterado":"")}else c.hidden=true}
let SITE_SC=null;
fetch("../content.json",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(c=>{if(c&&c.scenarioId){SITE_SC=c.scenarioId;renderSaved()}}).catch(()=>{});
const enc64=o=>btoa(unescape(encodeURIComponent(o)));
function siteNote(li,cls,txt){let n=li.querySelector(".site-note");if(!n){n=document.createElement("span");n.className="site-note";li.appendChild(n)}n.className="site-note "+cls;n.textContent=txt}
async function publishToSite(it,btn,li){
  let g={};try{g=JSON.parse(localStorage.getItem("felicia-cms-gh")||"{}")}catch(e){}
  const prem={...DEFAULTS,...fromSaved(it)};
  if(!g.token||!g.owner||!g.repo){
    const code=enc64(JSON.stringify(prem)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
    const link=new URL("../?p="+code+"#calculos",location.href).href;
    try{await navigator.clipboard.writeText(link)}catch(e){}
    siteNote(li,"warn","O GitHub ainda não está conectado. Copiei o link do cenário: cole na aba Cálculos do CMS (endereço do site + /cms) ou envie para o Claude.");return}
  btn.disabled=true;btn.textContent="Publicando…";
  const H={Accept:"application/vnd.github+json",Authorization:"Bearer "+g.token,"X-GitHub-Api-Version":"2022-11-28"};
  const path=(g.dir?g.dir.replace(/^\/|\/$/g,"")+"/":"")+"content.json",branch=g.branch||"main",api="https://api.github.com/repos/"+g.owner+"/"+g.repo+"/contents/"+path;
  try{const r=await fetch(api+"?ref="+encodeURIComponent(branch),{headers:H});if(!r.ok)throw new Error(r.status===401?"token inválido":r.status===404?"content.json não encontrado no repositório":"erro "+r.status);
    const cur=await r.json();const c=JSON.parse(decodeURIComponent(escape(atob(cur.content.replace(/\n/g,"")))));
    c.premissas=prem;c.scenarioId=it.id;c.scenarioName=it.name;c.defaultScenario=it.sc||"base";c.updated=new Date().toISOString();
    const w=await fetch(api,{method:"PUT",headers:{...H,"Content-Type":"application/json"},body:JSON.stringify({message:"Simulador: cenário principal do site = "+it.name,content:enc64(JSON.stringify(c,null,1)),sha:cur.sha,branch})});
    if(!w.ok)throw new Error(w.status===403?"o token não tem permissão de escrita":"erro "+w.status);
    SITE_SC=it.id;renderSaved();const li2=[...document.querySelectorAll("#savedList .saved-item")].find(x=>x.querySelector("b").textContent.startsWith(it.name));
    if(li2)siteNote(li2,"ok","Publicado. O site mostra este cenário em cerca de 1 minuto.");
  }catch(e){btn.disabled=false;btn.textContent="Usar no site";siteNote(li,"bad","Não foi possível publicar: "+e.message+".")}
}
function renderSaved(){
  document.getElementById("savedCount").textContent=SAVED.length;
  const ul=document.getElementById("savedList");
  if(!SAVED.length){ul.innerHTML=`<li><p class="empty">Nenhum cenário salvo ainda. Ajuste as premissas, dê um nome e clique em Salvar.</p></li>`;return}
  ul.innerHTML="";
  SAVED.forEach(it=>{const r=run(eff(fromSaved(it),it.sc||"base"));const d=new Date(it.date);
    const li=document.createElement("li");li.className="saved-item"+(it.id===CUR?" cur":"");
    li.innerHTML=`<b></b><span class="meta">${d.toLocaleDateString("pt-BR")} às ${hhmm(d)} · ${brl(r.mature)}/mês · lucro ${brl(r.lucroM)}/mês</span>
      <span class="btns"><button type="button" class="btn sm red" data-a="site">Usar no site</button><button type="button" class="btn sm" data-a="open">Abrir</button><button type="button" class="btn sm" data-a="upd">Atualizar com o atual</button><button type="button" class="btn sm danger" data-a="del">Excluir</button></span>`;
    li.querySelector("b").textContent=it.name+(SITE_SC===it.id?"  ·  no site":"");
    li.querySelector('[data-a="site"]').onclick=e=>publishToSite(it,e.currentTarget,li);
    li.querySelector('[data-a="open"]').onclick=()=>{P=fromSaved(it);SC=it.sc||SC;CUR=it.id;DIRTY=false;syncControls();applyMode();update();renderSaved()};
    li.querySelector('[data-a="upd"]').onclick=()=>{it.p={...P};delete it.sets;it.sc=SC;it.date=new Date().toISOString();CUR=it.id;DIRTY=false;persistSaved();save();renderSaved();renderCur()};
    const del=li.querySelector('[data-a="del"]');let t;
    del.onclick=()=>{if(!del.classList.contains("confirm")){del.classList.add("confirm");del.textContent="Confirmar exclusão";t=setTimeout(()=>{del.classList.remove("confirm");del.textContent="Excluir"},3000);return}
      clearTimeout(t);SAVED=SAVED.filter(x=>x.id!==it.id);if(CUR===it.id){CUR=null;DIRTY=false}persistSaved();save();renderSaved();renderCur()};
    ul.appendChild(li)});
}
syncControls();applyMode();update();renderSaved();
// cores do CMS
fetch("../content.json",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(c=>{if(!c||!c.theme)return;const t=c.theme,rs=document.documentElement.style,set=(k,v)=>{if(v)rs.setProperty(k,v)};
  set("--red",t.red);set("--brand",t.red);set("--cream",t.cream);set("--red-deep",t.redDeep);
  if(t.red){const h=x=>{const n=parseInt(x.slice(1),16);return [n>>16&255,n>>8&255,n&255]},a=h(t.red),b=[255,255,255];set("--red-soft","#"+a.map((v,i)=>Math.round(v*.13+b[i]*.87).toString(16).padStart(2,"0")).join(""))}
  update()}).catch(()=>{});
