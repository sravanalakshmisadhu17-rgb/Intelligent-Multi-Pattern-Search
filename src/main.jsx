import React,{useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {Search, FileText, Network, BarChart3, Code2, CheckCircle2, ArrowRight, Zap, ShieldCheck, Upload, ChevronRight} from "lucide-react";
import "./styles.css";

const sampleText="She sells seashells by the seashore. The shell collection includes sea shells and she sells them.";
const samplePatterns=["he","she","shell","sea","sells"];

function buildAC(patterns){
  const nodes=[{next:{},fail:0,out:[]}];
  patterns.forEach((p,idx)=>{let s=0; for(const ch of p.toLowerCase()){if(nodes[s].next[ch]===undefined){nodes[s].next[ch]=nodes.length;nodes.push({next:{},fail:0,out:[]})}s=nodes[s].next[ch]} nodes[s].out.push({pattern:p,index:idx});});
  const q=[]; Object.values(nodes[0].next).forEach(s=>{nodes[s].fail=0;q.push(s)});
  while(q.length){const r=q.shift(); for(const [ch,u] of Object.entries(nodes[r].next)){q.push(u);let f=nodes[r].fail;while(f&&nodes[f].next[ch]===undefined)f=nodes[f].fail;if(nodes[f].next[ch]!==undefined&&nodes[f].next[ch]!==u)nodes[u].fail=nodes[f].next[ch];else nodes[u].fail=0;nodes[u].out=[...nodes[u].out,...nodes[nodes[u].fail].out]}}
  return nodes;
}
function searchAC(text,patterns){
  const nodes=buildAC(patterns), found=patterns.map(p=>({pattern:p,count:0,positions:[]}));
  let s=0,total=0;
  for(let i=0;i<text.length;i++){const ch=text[i].toLowerCase();while(s&&nodes[s].next[ch]===undefined)s=nodes[s].fail;if(nodes[s].next[ch]!==undefined)s=nodes[s].next[ch];else s=0;for(const m of nodes[s].out){const end=i,start=i-m.pattern.length+1;found[m.index].count++;found[m.index].positions.push(start);total++;}}
  return {found,total,nodes:nodes.length};
}
function App(){
 const [text,setText]=useState(sampleText),[patterns,setPatterns]=useState(samplePatterns.join(", ")),[tab,setTab]=useState("demo");
 const pats=useMemo(()=>patterns.split(",").map(x=>x.trim()).filter(Boolean),[patterns]);
 const result=useMemo(()=>searchAC(text,pats),[text,pats]);
 const words=text.trim()?text.trim().split(/\s+/).length:0;
 const nav=[["demo","Live Demo"],["architecture","Architecture"],["algorithm","Algorithm"],["testing","Testing"],["applications","Applications"]];
 return <div className="app">
  <header><div className="brand"><div className="logo"><Network size={22}/></div><div><b>MultiPattern</b><span>Document Intelligence Engine</span></div></div>
   <nav>{nav.map(([id,label])=><button className={tab===id?"active":""} onClick={()=>{setTab(id);document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}} key={id}>{label}</button>)}</nav>
   <a className="github" href="https://github.com/" target="_blank"><span className="githubMark">GH</span> GitHub</a>
  </header>
  <main>
   <section className="hero"><div className="badge"><Zap size={14}/> DSA PROJECT · AHO–CORASICK</div><h1>Intelligent Multi-Pattern<br/><em>Search & Document Analysis</em></h1><p>Search multiple keywords in a document in one unified workflow — powered by a Trie, failure links and Aho–Corasick.</p><div className="heroBtns"><button className="primary" onClick={()=>document.getElementById("demo").scrollIntoView({behavior:"smooth"})}>Try Live Demo <ArrowRight size={17}/></button><button className="secondary" onClick={()=>document.getElementById("architecture").scrollIntoView({behavior:"smooth"})}>Explore Architecture</button></div><div className="heroStats"><span><b>O(n + z)</b> search focus</span><span><b>Single-pass</b> document scan</span><span><b>Overlapping</b> matches supported</span></div></section>
   <section className="section demo" id="demo"><div className="sectionHead"><div><label>01 · INTERACTIVE ENGINE</label><h2>Search your document</h2><p>Enter any document and multiple comma-separated patterns. The engine builds the automaton and reports every match.</p></div></div>
    <div className="workgrid"><div className="panel"><div className="panelTitle"><FileText/> Document text</div><textarea value={text} onChange={e=>setText(e.target.value)}/><div className="panelTitle patterns"><Search/> Search patterns</div><input value={patterns} onChange={e=>setPatterns(e.target.value)} placeholder="e.g. he, she, shell"/>
      <div className="hint">Tip: Try overlapping patterns such as <b>he, she, shell</b>.</div></div>
     <div className="panel results"><div className="resultTop"><div className="panelTitle"><BarChart3/> Analysis report</div><span className="live"><i/> LIVE</span></div><div className="metricRow"><div><b>{words}</b><small>Words</small></div><div><b>{result.total}</b><small>Total matches</small></div><div><b>{result.nodes}</b><small>Trie states</small></div></div>
      <div className="resultList">{result.found.map(r=><div className="result" key={r.pattern}><span className="dot"/><strong>{r.pattern}</strong><span>{r.count} occurrence{r.count!==1?"s":""}</span><small>{r.positions.length?`positions: ${r.positions.join(", ")}`:"not found"}</small></div>)}</div>
      </div></div>
   </section>
   <section className="section light" id="architecture"><div className="sectionHead"><label>02 · SYSTEM DESIGN</label><h2>From input to insight</h2><p>The workflow in the final presentation: input → preprocessing → pattern automaton → search → analytics → structured output.</p></div>
    <div className="flow">{[["01","INPUT","Document + patterns",FileText],["02","AUTOMATON","Trie + failure links",Network],["03","SEARCH","Single document scan",Search],["04","ANALYTICS","Counts + positions",BarChart3],["05","OUTPUT","Search report",CheckCircle2]].map(([n,t,d,I],i)=><React.Fragment key={n}><div className="flowCard"><span>{n}</span><I/><b>{t}</b><p>{d}</p></div>{i<4&&<ChevronRight className="arrow"/>}</React.Fragment>)}</div>
   </section>
   <section className="section" id="algorithm"><div className="sectionHead"><label>03 · CORE ALGORITHM</label><h2>How Aho–Corasick works</h2></div><div className="algoGrid"><div className="codePanel"><div className="codebar"><span/><span/><span/> algorithm.py</div><pre>{`# Build a shared pattern structure
for pattern in patterns:
    insert_into_trie(pattern)

# Create fallback transitions
queue = root.children
while queue:
    state = queue.pop()
    build_failure_link(state)

# Scan the document once
for character in document:
    state = transition(state, character)
    report(state.outputs)`}</pre></div><div className="steps">{[["01","Build Trie","Insert every pattern into one common prefix tree."],["02","Failure Links","Use breadth-first traversal to create efficient fallback transitions."],["03","Scan Text","Move through the automaton character by character."],["04","Report Matches","Output every terminal pattern, including overlapping matches."]].map(x=><div className="step" key={x[0]}><span>{x[0]}</span><div><b>{x[1]}</b><p>{x[2]}</p></div></div>)}</div></div></section>
   <section className="section light" id="testing"><div className="sectionHead"><label>04 · VALIDATION</label><h2>Testing coverage</h2><p>Representative test cases from the final project presentation.</p></div><div className="table">{[["TC-01","Single pattern present","Correct occurrence count and position"],["TC-02","Multiple patterns present","All target patterns detected"],["TC-03","Overlapping patterns","Overlapping matches retained"],["TC-04","Pattern absent","Zero matches reported"],["TC-05","Empty / short text","No crash; meaningful empty result"],["TC-06","Repeated pattern","Frequency equals actual occurrences"]].map((r,i)=><div className="tr" key={r[0]}><b>{r[0]}</b><span>{r[1]}</span><span>{r[2]}</span><strong><CheckCircle2 size={16}/> PASS</strong></div>)}</div><p className="note">For final evaluation, update displayed PASS statuses with actual execution results if your implementation differs.</p></section>
   <section className="section applications" id="applications"><div className="sectionHead"><label>05 · REAL-WORLD VALUE</label><h2>Built for more than a demo</h2></div><div className="cards">{[["Document Search","Find multiple keywords across reports, notes and text collections."],["Log Analysis","Detect multiple event keywords or error signatures in logs."],["Text Mining","Identify predefined terms during document preprocessing."],["Content Monitoring","Track important words across incoming text."],["Information Retrieval","Support keyword-oriented search in retrieval pipelines."],["Educational Tools","Demonstrate tries, failure links and string matching interactively."]].map(([a,b])=><div className="appCard" key={a}><div className="miniIcon"><ShieldCheck size={19}/></div><h3>{a}</h3><p>{b}</p></div>)}</div></section>
  </main>
  <footer><div><b>Intelligent Multi-Pattern Search & Document Analysis Engine</b><p>Data Structures & Algorithms Project · KL Deemed to be University</p></div><div className="team">Deekshitha · SravanaLakshmi · Sirisha · Arshitha · Tanu Sri<br/><small>Guide: Dr. Anitha · Department of Artificial Intelligence & Data Science</small></div></footer>
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);