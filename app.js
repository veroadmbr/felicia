const MULT_KEYS={mov:"Movimento do salão",del:"Pedidos de delivery",eq:"Tamanho da equipe",rep:"Repasse aos cotistas"};
const DEFAULTS={mc_mov:0.8,mc_del:0.5,mc_eq:0.75,mc_rep:0.714,mo_mov:1.333,mo_del:1.571,mo_eq:1.25,mo_rep:1.429,modo:"dias",d0:0,d1:55,d2:55,d3:65,d4:95,d5:100,d6:70,lugares:60,giro:1.5,aprov:85,dias:24,pizzas:0.8,precoPizza:70,bebidas:2,precoBebida:28,sobremesa:0.25,precoSobremesa:32,
  pedidos:35,ticketDeliv:110,cmv:20,simples:10,cartao:2.5,custoDeliv:20,func:12,custoFunc:5000,prolabore:24000,aluguel:10000,energia:4000,mkt:10000,manut:2000,adm:4000,
  reaj:5,ramp1:70,ramp2:85,g2:30,g3:30,aporte:660000,cotas:3,rep1:7,rep2:9.8,rep3:12.6,reserva:30,caixa:200000};

const GROUPS=[
 {t:"Salão",open:true,modeSwitch:true,c:[
  ["lugares","Lugares no salão",20,150,1,"","Mesas × cadeiras"],
  ["d0","Segunda",0,300,1,"pessoas","0 = fechado","dias"],
  ["d1","Terça",0,300,1,"pessoas","","dias"],
  ["d2","Quarta",0,300,1,"pessoas","","dias"],
  ["d3","Quinta",0,300,1,"pessoas","","dias"],
  ["d4","Sexta",0,300,1,"pessoas","","dias"],
  ["d5","Sábado",0,300,1,"pessoas","","dias"],
  ["d6","Domingo",0,300,1,"pessoas","","dias"],
  ["giro","Giro por noite",0.5,3.5,0.05,"x","Quantas vezes cada lugar é ocupado","giro"],
  ["aprov","Aproveitamento dos lugares",50,100,1,"%","Cadeiras vazias em mesas parciais","giro"],
  ["dias","Dias abertos por mês",16,30,1,"dias","","giro"]]},
 {t:"Ticket médio",open:true,calc:"ticket",c:[
  ["pizzas","Pizzas por cliente",0.3,2,0.05,"un",""],
  ["precoPizza","Preço médio da pizza",30,150,1,"R$",""],
  ["bebidas","Bebidas por cliente",0,5,0.1,"un","Drinks, vinho, chopp, soft"],
  ["precoBebida","Preço médio da bebida",8,80,1,"R$",""],
  ["sobremesa","Sobremesas por cliente",0,1,0.05,"un",""],
  ["precoSobremesa","Preço da sobremesa",10,60,1,"R$",""]]},
 {t:"Delivery",c:[
  ["pedidos","Pedidos por noite",0,200,1,"pedidos","Média nas noites em que a casa abre"],
  ["ticketDeliv","Ticket por pedido",50,200,1,"R$",""],
  ["custoDeliv","Custo do delivery",0,35,0.5,"%","App, embalagem e entrega"]]},
 {t:"Custos variáveis",c:[
  ["cmv","Insumos (CMV)",10,45,0.5,"%","Mercado: 25% a 32%"],
  ["simples","Imposto (Simples Nacional)",4,19,0.1,"%","Anexo I · cerca de 10% nesta faixa de faturamento"],
  ["cartao","Taxa de cartão",0,6,0.1,"%","Maquininha, média entre débito, crédito e Pix"]]},
 {t:"Custos fixos",c:[
  ["func","Funcionários",3,30,1,"pessoas",""],
  ["custoFunc","Custo por funcionário",2000,10000,100,"R$","Com encargos"],
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

let P={...DEFAULTS}, SC="base", CUR=null, DIRTY=false, SAVED=[];
const clone=o=>JSON.parse(JSON.stringify(o));
function mult(p,k){const pre=k==="conservador"?"mc_":k==="otimista"?"mo_":null;const g=x=>pre?p[pre+x]:1;return {mov:g("mov"),del:g("del"),eq:g("eq"),rep:g("rep")}}
function eff(p,k){const m=mult(p,k),e={...p};e.giro=p.giro*m.mov;for(let i=0;i<7;i++)e["d"+i]=Math.round(p["d"+i]*m.mov);
  e.pedidos=p.pedidos*m.del;e.func=p.func*m.eq;e.rep1=p.rep1*m.rep;e.rep2=p.rep2*m.rep;e.rep3=p.rep3*m.rep;return e}
function fromSaved(o){if(!o)return {...DEFAULTS};const b=(o.sets&&o.sets.base)||o.p||{};return {...DEFAULTS,...b}}
try{const s=JSON.parse(localStorage.getItem("felicia-sim")||"null");if(s){P=fromSaved(s);SC=s.sc||"base";CUR=s.cur||null;DIRTY=!!s.dirty}}catch(e){}
try{SAVED=JSON.parse(localStorage.getItem("felicia-saved")||"[]")||[]}catch(e){SAVED=[]}
const hhmm=d=>d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
function save(){let ok=true;try{localStorage.setItem("felicia-sim",JSON.stringify({p:P,sc:SC,cur:CUR,dirty:DIRTY}))}catch(e){ok=false}
  const a=document.getElementById("autosave");if(a)a.textContent=ok?"Alterações salvas automaticamente às "+hhmm(new Date())+".":"Este navegador bloqueou o salvamento automático. Use Salvar para guardar um cenário enquanto a página estiver aberta.";}
function persistSaved(){try{localStorage.setItem("felicia-saved",JSON.stringify(SAVED))}catch(e){}}

const nf=(v,d=0)=>v.toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d});
function brl(v){const a=Math.abs(v),s=v<0?"–":"";
  if(a>=1e6)return s+"R$ "+nf(a/1e6,2)+" mi";
  if(a>=1e3)return s+"R$ "+nf(a/1e3,0)+" mil";
  return s+"R$ "+nf(a,0)}

function run(p){
  const ticket=p.pizzas*p.precoPizza+p.bebidas*p.precoBebida+p.sobremesa*p.precoSobremesa;
  const WK=4.33, DAYS=[p.d0,p.d1,p.d2,p.d3,p.d4,p.d5,p.d6];
  let pessoas,salao,dias,pico;
  if(p.modo==="dias"){const open=DAYS.filter(x=>x>0).length;dias=Math.max(open,1)*WK;const pm=DAYS.reduce((a,b)=>a+b,0)*WK;pessoas=pm/dias;salao=pm*ticket;pico=Math.max(...DAYS)}
  else{dias=p.dias;pessoas=p.lugares*p.giro*p.aprov/100;salao=pessoas*ticket*dias;pico=pessoas}
  const giroImp=pessoas/p.lugares;
  const deliv=p.pedidos*p.ticketDeliv*dias;
  const total=salao+deliv;
  const pedidos=p.pedidos;
  const delivShare=total>0?deliv/total:0;
  const varPct=(p.cmv+p.simples+p.cartao+delivShare*p.custoDeliv)/100;
  const equipe=p.func*p.custoFunc;
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
    if(quit===null&&Pg>=p.aporte-0.5)quit=i+1;
    m.push({r,lucro,pay,L,Pg});
    if((i+1)%12===0){const sob=L-Pg;cum[i+1]={F,B:F*(1-p.cmv/100),C,L,Pg,sob,res:Math.max(0,sob)*p.reserva/100,dist:Math.max(0,sob)*(1-p.reserva/100),pct:Pg/p.aporte}}
  });
  let pq=quit;
  if(pq===null){let pg=Pg,i=36;const last=Math.max(rep[2],0);while(pg<p.aporte&&i<240&&last>0){pg+=last;i++}pq=pg>=p.aporte?i:null}
  const mature=revs[11];
  const lucroM=mature*(1-varPct)-fixoBase;
  const be=fixoBase/(1-varPct);
  return {delivShare,dias,giroImp,pico,DAYS,WK,ticket,pessoas,salao,total,deliv,pedidos,varPct,equipe,fixoBase,m,cum,quit,pq,mature,lucroM,be,minCash,annual:[A1,A2,A3],
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
  if(g.modeSwitch){const ms=document.createElement("div");ms.className="modeseg";ms.innerHTML=`<span class="hint">Calcular o salão por</span><div class="seg" role="group" aria-label="Forma de cálculo do salão"><button type="button" id="modo-dias" data-modo="dias">Pessoas por dia</button><button type="button" id="modo-giro" data-modo="giro">Giro</button></div>`;d.appendChild(ms);
    ms.querySelectorAll("[data-modo]").forEach(b=>b.addEventListener("click",()=>{P.modo=b.dataset.modo;applyMode();update()}))}
  if(g.calc==="ticket"){const c=document.createElement("div");c.className="calc";c.innerHTML=`<span>Ticket médio por cliente</span><b id="calc-ticket">–</b>`;d.appendChild(c)}
  g.c.forEach(([id,label,min,max,step,unit,hint,mode])=>{
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
function syncControls(){GROUPS.forEach(g=>g.c.forEach(([id,, , ,step])=>{const r=document.getElementById("r-"+id),n=document.getElementById("n-"+id);r.value=P[id];n.value=fmtVal(P[id],step)}))}
function markCustom(){if(CUR)DIRTY=true}
function applyMode(){document.querySelectorAll(".ctl[data-mode]").forEach(el=>el.hidden=el.dataset.mode!==P.modo);document.querySelectorAll("[data-modo]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.modo===P.modo))}

document.querySelectorAll("[data-sc]").forEach(b=>b.addEventListener("click",()=>{SC=b.dataset.sc;update()}));
(()=>{const rb=document.getElementById("resetSc");let t;rb.addEventListener("click",()=>{
  if(!rb.classList.contains("confirm")){rb.classList.add("confirm");rb.textContent="Confirmar: voltar ao padrão";t=setTimeout(()=>{rb.classList.remove("confirm");rb.textContent="Restaurar padrão"},3000);return}
  clearTimeout(t);rb.classList.remove("confirm");rb.textContent="Restaurar padrão";P={...DEFAULTS};markCustom();syncControls();applyMode();update()})})();
document.getElementById("present").addEventListener("click",e=>{const on=document.body.classList.toggle("present");e.currentTarget.textContent=on?"Mostrar premissas":"Modo apresentação";chart&&chart.resize()});

// ---------- render ----------
let chart=null;
function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()}
function update(){
  save();renderCur&&renderCur();
  document.querySelectorAll("[data-sc]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.sc===SC));
  const E=eff(P,SC),R=run(E);
  document.getElementById("calc-ticket").textContent="R$ "+nf(R.ticket,2);

  document.getElementById("k-fat").textContent=brl(R.mature);
  document.getElementById("k-fat-s").textContent="Ano 1 cheio · "+brl(R.mature*12)+" no ano";
  document.getElementById("k-luc").textContent=brl(R.lucroM);
  document.getElementById("k-luc-s").textContent="Margem de "+nf(R.lucroM/R.mature*100,1)+"%";
  document.getElementById("k-pay").textContent=R.quit?("Mês "+R.quit):(R.pq?("Mês ~"+R.pq):"Não quita");
  document.getElementById("k-pay-s").textContent=brl(P.aporte)+" em "+P.cotas+(P.cotas>1?" cotas de ":" cota de ")+brl(P.aporte/P.cotas);
  document.getElementById("k-36").textContent=brl(R.cum[36].L);
  document.getElementById("k-36-s").textContent=brl(R.cum[36].dist)+" para distribuição";

  const night=[
    [nf(R.pessoas,0),"Clientes no salão por noite"],
    ["R$ "+nf(R.ticket,0),"Ticket médio no salão"],
    [nf(R.pedidos,0)+" pedidos","Delivery por noite · "+nf(R.delivShare*100,0)+"% do faturamento"],
    [brl(R.total/R.dias),"Faturamento por noite"],
    [brl(R.be),"Ponto de equilíbrio por mês"],
    [nf(R.giroImp,2)+"x","Giro médio por noite"]
  ];
  document.getElementById("night").innerHTML=night.map(([v,l])=>`<div class="stat"><span class="v">${v}</span><span class="l">${l}</span></div>`).join("");
  const wk=document.getElementById("week");
  if(P.modo==="dias"){const names=["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"],mx=Math.max(...R.DAYS,1);
    wk.hidden=false;
    wk.innerHTML=`<p class="note">Semana típica · ${nf(R.DAYS.reduce((a,b)=>a+b,0),0)} pessoas no salão por semana, ${nf(R.DAYS.reduce((a,b)=>a+b,0)*R.WK,0)} por mês</p><div class="bars">`+R.DAYS.map((d,i)=>`<span class="n">${names[i]}</span><span class="t"><div style="width:${d/mx*100}%"></div></span><span class="val">${d?nf(d,0)+" pessoas":"fechado"}${d?`<small>${nf(d/P.lugares,1)}x · ${brl(d*R.ticket)}</small>`:""}</span>`).join("")+`</div>`}
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
  const mx=Math.max(...items.map(x=>x[1]));
  document.getElementById("bars").innerHTML=items.map(([n,v])=>`<span class="n">${n}</span><span class="t"><div style="width:${v/mx*100}%"></div></span><span class="val">${brl(v)}<small>${nf(v/R.mature*100,1)}%</small></span>`).join("");
  const fixo=R.fixoBase, var$=R.mature*R.varPct;
  document.getElementById("costfoot").innerHTML=`<span>Custo fixo <b>${brl(fixo)}/mês</b></span><span>Variável <b>${nf(R.varPct*100,1)}% da receita</b></span><span>Custo total <b>${brl(fixo+var$)}/mês</b></span>`;

  // compare
  const sc=["conservador","base","otimista"],names={conservador:"Conservador",base:"Base",otimista:"Otimista"};
  const Rs=sc.map(s=>run(eff(P,s)));
  const crow=(n,f)=>`<tr><td>${n}</td>${Rs.map((r,i)=>`<td class="${sc[i]===SC?"cur":""}">${f(r,sc[i])}</td>`).join("")}</tr>`;
  document.getElementById("compare").innerHTML=`<thead><tr><th></th>${sc.map(s=>`<th class="${s===SC?"cur hl":""}">${names[s]}</th>`).join("")}</tr></thead><tbody>`+
    crow("Giro médio por noite",r=>nf(r.giroImp,2)+"x")+
    crow("Multiplicador de movimento",(r,k)=>nf(mult(P,k).mov,2)+"x")+
    crow("Pedidos de delivery por noite",r=>nf(r.pedidos,0))+
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
  A.push(yr>=0?["bad","Simples",`O faturamento passa de R$ 4,8 mi no ano ${yr+1}. A casa sai do Simples e os impostos sobem além dos ${nf(P.simples,1)}% usados aqui.`]:["ok","Simples","Faturamento dentro do limite do Simples Nacional nos 3 anos."]);
  A.push(P.cmv<25?["warn","CMV",`${nf(P.cmv,1)}% está abaixo da faixa de mercado (25% a 32%). Tenha a ficha técnica pronta para mostrar.`]:P.cmv>32?["bad","CMV",`${nf(P.cmv,1)}% está acima de 32%, o teto recomendado para pizzarias.`]:["ok","CMV","Dentro da faixa de mercado para pizzarias (25% a 32%)."]);
  const prime=(R.cost.cmv+R.equipe+P.prolabore)/R.mature*100;
  A.push(prime>60?["bad","Prime cost",`Insumos + equipe somam ${nf(prime,0)}% da receita. Acima de 60%, a conta costuma não fechar.`]:["ok","Prime cost",`Insumos + equipe somam ${nf(prime,0)}% da receita, abaixo do limite de 60%.`]);
  const mg=R.lucroM/R.mature*100;
  A.push(mg>20?["warn","Margem",`Margem de ${nf(mg,1)}% está acima da média do setor (12% a 15%). Prepare a justificativa, como equipe enxuta ou CMV baixo.`]:mg<5?["bad","Margem",`Margem de ${nf(mg,1)}% deixa pouca folga para imprevistos.`]:["ok","Margem",`Margem de ${nf(mg,1)}%, em linha com o setor.`]);
  A.push(R.minCash<-P.caixa?["bad","Caixa",`O caixa chega a ${brl(R.minCash)}, mais do que o capital de giro de ${brl(P.caixa)}.`]:R.minCash<0?["warn","Caixa",`Os primeiros meses usam ${brl(-R.minCash)} do capital de giro (${nf(-R.minCash/P.caixa*100,0)}% dele).`]:["ok","Caixa","O repasse cabe no lucro de todos os meses."]);
  const gp=R.pico/P.lugares;
  A.push(gp>2.2?["warn","Capacidade",`Na noite mais cheia, cada lugar gira ${nf(gp,1)}x. Isso exige mesas rápidas e equipe dimensionada para o pico.`]:["ok","Capacidade",`Na noite mais cheia, cada lugar gira ${nf(gp,1)}x, viável para um pizza bar.`]);
  if(P.g2+P.g3>30&&P.reaj<P.g2/2)A.push(["warn","Crescimento","O faturamento cresce bem mais rápido que os custos fixos. Com mais movimento, a equipe tende a crescer junto."]);
  A.push(R.quit&&R.quit<=36?["ok","Aporte",`Os cotistas recebem 100% do aporte no mês ${R.quit}.`]:["warn","Aporte",`O aporte não volta inteiro em 36 meses${R.pq?" (previsão: mês ~"+R.pq+")":""}.`]);
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
function renderSaved(){
  document.getElementById("savedCount").textContent=SAVED.length;
  const ul=document.getElementById("savedList");
  if(!SAVED.length){ul.innerHTML=`<li><p class="empty">Nenhum cenário salvo ainda. Ajuste as premissas, dê um nome e clique em Salvar.</p></li>`;return}
  ul.innerHTML="";
  SAVED.forEach(it=>{const r=run(eff(fromSaved(it),it.sc||"base"));const d=new Date(it.date);
    const li=document.createElement("li");li.className="saved-item"+(it.id===CUR?" cur":"");
    li.innerHTML=`<b></b><span class="meta">${d.toLocaleDateString("pt-BR")} às ${hhmm(d)} · ${brl(r.mature)}/mês · lucro ${brl(r.lucroM)}/mês</span>
      <span class="btns"><button type="button" class="btn sm" data-a="open">Abrir</button><button type="button" class="btn sm" data-a="upd">Atualizar com o atual</button><button type="button" class="btn sm danger" data-a="del">Excluir</button></span>`;
    li.querySelector("b").textContent=it.name;
    li.querySelector('[data-a="open"]').onclick=()=>{P=fromSaved(it);SC=it.sc||SC;CUR=it.id;DIRTY=false;syncControls();applyMode();update();renderSaved()};
    li.querySelector('[data-a="upd"]').onclick=()=>{it.p={...P};delete it.sets;it.sc=SC;it.date=new Date().toISOString();CUR=it.id;DIRTY=false;persistSaved();save();renderSaved();renderCur()};
    const del=li.querySelector('[data-a="del"]');let t;
    del.onclick=()=>{if(!del.classList.contains("confirm")){del.classList.add("confirm");del.textContent="Confirmar exclusão";t=setTimeout(()=>{del.classList.remove("confirm");del.textContent="Excluir"},3000);return}
      clearTimeout(t);SAVED=SAVED.filter(x=>x.id!==it.id);if(CUR===it.id){CUR=null;DIRTY=false}persistSaved();save();renderSaved();renderCur()};
    ul.appendChild(li)});
}
syncControls();applyMode();update();renderSaved();
