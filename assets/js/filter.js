(function(){
  function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function mapTag(t){ var idx=(window.KNOWLEDGE_INDEX||{}); return idx[t]||null; }
  function listByLevel(level){
    var res=[];
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(k&&k.indexOf('exam_proficiency:')===0){
        var paper=k.slice('exam_proficiency:'.length);
        var raw=localStorage.getItem(k);
        var obj; try{ obj=JSON.parse(raw||'{}'); }catch(e){ obj={}; }
        for(var idx in obj){ if(Object.prototype.hasOwnProperty.call(obj, idx)){ var val=parseInt(obj[idx],10)||0; if(val===level){ res.push({ paper: paper, idx: parseInt(idx,10)||0 }); } } }
      }
    }
    return res;
  }
  function fetchText(url){ return fetch(url).then(function(r){ var isFile=(typeof location!=='undefined' && location.protocol==='file:'); if(!isFile && !r.ok) throw new Error('fail'); return r.text(); }); }
  function tryFetchPaper(paper){ var bases=['papers/','', '计算机网络/']; var tries=bases.map(function(b){ return fetchText(b+paper).catch(function(){ return null; }); }); return Promise.all(tries).then(function(arr){ for(var i=0;i<arr.length;i++){ if(arr[i] && String(arr[i]).trim()) return arr[i]; } throw new Error('not found'); }); }
  function readProf(paper){ try{ var k='exam_proficiency:'+paper; var s=localStorage.getItem(k); return s?JSON.parse(s):{}; }catch(e){ return {}; } }
  function writeProf(paper, obj){ try{ var k='exam_proficiency:'+paper; localStorage.setItem(k, JSON.stringify(obj||{})); }catch(e){} }
  function readAttempts(paper){ try{ var k='exam_attempts:'+paper; var s=localStorage.getItem(k); return s?JSON.parse(s):{}; }catch(e){ return {}; } }
  function writeAttempts(paper, obj){ try{ var k='exam_attempts:'+paper; localStorage.setItem(k, JSON.stringify(obj||{})); }catch(e){} }
  function keyOf(paper, idx){ return String(paper).replace(/[^A-Za-z0-9_-]/g,'_')+'-'+idx; }
  function renderQuestion(q, idx, paper, level){
    var meta=[q.difficulty?('难度：'+esc(q.difficulty)):'', esc(q.knowledge||'')].filter(Boolean).join(' · ');
    var body=(window.ExamsRenderMd? window.ExamsRenderMd(q.body||'') : esc(q.body||''));
    var opts=(q.options||[]).length?('<div class="q-options">'+q.options.map(function(o){ return '<div>'+esc(o)+'</div>'; }).join('')+'</div>'):'';
    var ans=q.answer?('<div><strong>答案：</strong>'+ esc(q.answer) +'</div>'):'';
    var sol=(q.solution? (window.ExamsRenderMd? window.ExamsRenderMd(q.solution||'') : esc(q.solution)) : '');
    var head='试卷 '+esc(String(paper).replace(/\.md$/i,''))+' · 第 '+(idx+1)+' 题';
    var tagsHTML=(q.tags||[]).map(function(t){ var href=mapTag(t); if(href){ var parts=String(href).split('#'); var base=parts[0]; var hash=parts[1]?('#'+parts[1]):''; var ref='exams-filter.html?level='+(level||''); var join=base.indexOf('?')>-1?'&':'?'; var link=base+join+'ref='+encodeURIComponent(ref)+hash; return '<a class="pill" href="'+link+'">'+esc(t)+'</a>'; } return '<span class="pill">'+esc(t)+'</span>'; }).join('');
    var learnHref=null; (q.tags||[]).some(function(t){ var h=mapTag(t); if(h){ var parts=String(h).split('#'); var base=parts[0]; var hash=parts[1]?('#'+parts[1]):''; var ref='exams-filter.html?level='+(level||''); var join=base.indexOf('?')>-1?'&':'?'; learnHref=base+join+'ref='+encodeURIComponent(ref)+hash; return true; } return false; });
    var prof=readProf(paper); var cur=parseInt(prof[String(idx)]||0,10);
    var rate='<div class="q-rate">'+[1,2,3,4,5].map(function(n){ return '<button class="pill'+(cur===n?' active':'')+'" data-rating="'+n+'" data-paper="'+paper+'" data-idx="'+idx+'">'+n+'级·'+(n===1?'初看懂':n===2?'仿着做':n===3?'查资料':n===4?'独立解':'能迁移')+'</button>'; }).join('')+'</div>';
    var attempts=readAttempts(paper); var times=parseInt(attempts[String(idx)]||0,10);
    var key=keyOf(paper, idx);
    var solBtn='<div class="q-ops"><button class="btn btn-sol" data-toggle="sol" data-key="'+key+'">解析</button>'+(learnHref?('<a class="btn" href="'+learnHref+'">去学</a>'):'')+'<button class="btn" data-attempt="'+idx+'" data-paper="'+paper+'">记录一次</button><button class="btn" data-unattempt="'+idx+'" data-paper="'+paper+'">撤销一次</button><button class="btn" data-resetattempt="'+idx+'" data-paper="'+paper+'">清零</button><span class="pill" id="attempt-'+key+'">已练：'+times+' 次</span></div>';
    var solution='<div class="q-solution hidden" id="sol-'+key+'">'+ans+(sol?('<div class="md-body">'+sol+'</div>'):'')+'</div>';
    return '<div class="question" id="q-'+key+'"><div class="q-title">'+head+'</div><div class="q-meta">'+meta+'</div><div class="q-body">'+body+'</div>'+opts+rate+'<div class="q-tags">'+tagsHTML+'</div>'+solBtn+solution+'</div>';
  }
  function renderResults(level){
    var box=document.getElementById('questions'); var empty=document.getElementById('empty'); if(!box) return;
    box.innerHTML=''; var items=listByLevel(level);
    if(items.length===0){ empty && (empty.style.display=''); return; } empty && (empty.style.display='none');
    var byPaper={}; items.forEach(function(it){ (byPaper[it.paper]||(byPaper[it.paper]=[])).push(it.idx); });
    var papers=Object.keys(byPaper);
    var tasks=papers.map(function(p){ return tryFetchPaper(p).then(function(txt){ var parsed=(window.ExamsParse? window.ExamsParse(txt) : null); var html=''; if(parsed&&parsed.questions&&parsed.questions.length){ byPaper[p].forEach(function(idx){ var q=parsed.questions[idx]; if(q) html+=renderQuestion(q, idx, p, level); }); } box.innerHTML+=html; }).catch(function(){ }); });
    Promise.all(tasks).then(function(){ if(window.MathJax && window.MathJax.typesetPromise){ window.MathJax.typesetPromise([box]); } });
  }
  function init(){ var tb=document.getElementById('filter-toolbar'); if(!tb) return; tb.innerHTML=[1,2,3,4,5].map(function(n){ return '<button class="pill" data-level="'+n+'">熟练度 '+n+'</button>'; }).join(''); tb.addEventListener('click', function(e){ var t=e.target; if(t&&t.dataset&&t.dataset.level){ var lvl=parseInt(t.dataset.level,10)||0; renderResults(lvl); } }); var container=document.getElementById('questions'); var search=document.getElementById('search'); var toggleAll=document.getElementById('toggleAnswers'); if(search){ search.addEventListener('input', function(){ var q=String(search.value||'').trim().toLowerCase(); var nodes=container.querySelectorAll('.question'); nodes.forEach(function(n){ var text=n.textContent.toLowerCase(); n.style.display = q && text.indexOf(q)===-1 ? 'none' : ''; }); }); } if(container){ container.addEventListener('click', function(e){ var t=e.target; if(t&&t.dataset&&t.dataset.toggle==='sol'){ var key=t.dataset.key; var el=document.getElementById('sol-'+key); if(el){ el.classList.toggle('hidden'); } } if(t&&t.dataset&& t.dataset.rating){ var paper=t.dataset.paper; var idx=t.dataset.idx; var level=parseInt(t.dataset.rating,10)||0; var prof=readProf(paper); prof[String(idx)]=level; writeProf(paper, prof); var group=t.closest('.q-rate'); var peers=group? group.querySelectorAll('[data-rating]') : []; peers.forEach(function(el){ el.classList.toggle('active', el.dataset.rating==String(level)); }); } if(t&&t.dataset&& t.dataset.attempt){ var paper=t.dataset.paper; var idx=t.dataset.attempt; var attempts=readAttempts(paper); var n=parseInt(attempts[String(idx)]||0,10)+1; attempts[String(idx)]=n; writeAttempts(paper, attempts); var el=document.getElementById('attempt-'+keyOf(paper, idx)); if(el){ el.textContent='已练：'+n+' 次'; } } if(t&&t.dataset&& t.dataset.unattempt){ var paper=t.dataset.paper; var idx=t.dataset.unattempt; var attempts=readAttempts(paper); var n=parseInt(attempts[String(idx)]||0,10)-1; if(n<0) n=0; attempts[String(idx)]=n; writeAttempts(paper, attempts); var el=document.getElementById('attempt-'+keyOf(paper, idx)); if(el){ el.textContent='已练：'+n+' 次'; } } if(t&&t.dataset&& t.dataset.resetattempt){ var paper=t.dataset.paper; var idx=t.dataset.resetattempt; var attempts=readAttempts(paper); attempts[String(idx)]=0; writeAttempts(paper, attempts); var el=document.getElementById('attempt-'+keyOf(paper, idx)); if(el){ el.textContent='已练：0 次'; } } }); } if(toggleAll){ toggleAll.addEventListener('click', function(){ var els=container.querySelectorAll('.q-solution'); els.forEach(function(el){ el.classList.toggle('hidden'); }); }); } }
  document.addEventListener('DOMContentLoaded', init);
})();