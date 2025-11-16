(function(){
  function statusHTML(s) {
    if (s === 'online') return '<div class="card-status online" style="background:#4CAF50;color:#fff;">已上线</div>';
    return '<div class="card-status coming-soon">即将推出</div>';
  }
  function iconHTML(icon) {
    if (!icon) return '<div class="card-icon">📚</div>';
    if (icon.type === 'emoji' || icon.type === 'text') return '<div class="card-icon">' + icon.value + '</div>';
    return '<div class="card-icon">📚</div>';
  }
  function cardHTML(item) {
    var dataKind = item.kind ? ' data-kind="' + item.kind + '"' : '';
    var content = iconHTML(item.icon) +
      '<h3 class="card-title">' + item.title + '</h3>' +
      '<p class="card-description">' + (item.desc || '') + '</p>' +
      statusHTML(item.status);
    if (item.href) return '<a class="card"'+dataKind+' href="' + item.href + '" style="text-decoration:none;color:inherit;">' + content + '</a>';
    return '<div class="card"'+dataKind+'>' + content + '</div>';
  }
  function render(containerId, scriptId) {
    var grid = document.getElementById(containerId || 'module-grid');
    var script = document.getElementById(scriptId || 'module-index-data');
    if (!grid || !script) return;
    var data;
    try { data = JSON.parse(script.textContent || '[]'); } catch (e) { data = []; }
    grid.innerHTML = Array.isArray(data) ? data.map(cardHTML).join('') : '';
  }
  function fetchJSON(url){ return fetch(url).then(function(r){ return r.text(); }).then(function(t){ try{ return JSON.parse(t); }catch(e){ return null; } }); }
  function isExams(){ try{ return location.pathname.toLowerCase().indexOf('exams.html')!==-1; }catch(e){ return false; } }
  function renderPapers(){
    var grid=document.getElementById('module-grid'); if(!grid) return;
    function setItems(files){
      var grid=document.getElementById('module-grid'); if(!grid) return;
      if(!files||!Array.isArray(files)||files.length===0){
        var filter = { kind:'filter', href:'#', icon:{type:'emoji',value:'🧭'}, title:'刷题筛选', desc:'按熟练度筛选已练题', status:'online' };
        grid.innerHTML = cardHTML(filter) + '<div class="card"><h3 class="card-title">未发现试卷</h3><p class="card-description">请将 .md 文件放入 papers/ 目录</p>'+statusHTML('coming-soon')+'</div>';
        attachFilter(grid);
        return;
      }
      var seen={}; var list=files.filter(function(n){ if(!n||!/\.md$/i.test(n)) return false; var k=n.toLowerCase(); if(seen[k]) return false; seen[k]=true; return true; });
      var items=list.map(function(name){ var title=String(name||'').replace(/\.md$/i,''); return { href:'exam-viewer.html?paper='+encodeURIComponent(name), icon:{type:'emoji',value:'🧪'}, title:title, desc:'Markdown 试卷', status:'online' }; });
      var filter = { kind:'filter', href:'exams-filter.html', icon:{type:'emoji',value:'🧭'}, title:'刷题筛选', desc:'按熟练度筛选已练题', status:'online' };
      items.unshift(filter);
      grid.innerHTML=items.map(cardHTML).join('');
      
    }
    function listDir(dir){ return fetch(dir).then(function(r){ return r.text(); }).then(function(html){ var doc; try{ doc=new DOMParser().parseFromString(html,'text/html'); }catch(e){ doc=null; } var files=[]; if(doc){ var as=doc.querySelectorAll('a'); as.forEach(function(a){ var href=(a.getAttribute('href')||''); if(/\.md$/i.test(href)){ var nm=href.replace(/^\.\//,'').replace(/\?.*$/,''); try{ nm=decodeURIComponent(nm); }catch(e){} files.push(nm); } }); } else { String(html||'').replace(/href=["']([^"']+\.md)["']/ig,function(_,m){ try{ files.push(decodeURIComponent(m)); }catch(e){ files.push(m); } }); } return files; }); }
    fetchJSON('/_papers.json').then(function(list){ if(list&&Array.isArray(list)&&list.length>0){ setItems(list.map(function(f){ return f.name||f; })); return; }
      var bases=['papers/','/papers/','./papers/','../papers/','/blueberrycongee.github.io/visualizer/papers/'];
      return Promise.all(bases.map(function(b){ return listDir(b).catch(function(){ return []; }); })).then(function(all){ var files=[]; all.forEach(function(arr){ arr.forEach(function(n){ files.push(n); }); }); setItems(files); });
    });
  }
  function attachFilter(grid){ try{
    grid.addEventListener('click', function(e){
      var el = e.target.closest('.card');
      if(!el) return;
      if(el.getAttribute('data-kind')==='filter'){ e.preventDefault(); openFilterOverlay(); }
    });
  }catch(e){} }
  function openFilterOverlay(){
    var overlay = document.createElement('div');
    overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(0,0,0,0.45)'; overlay.style.zIndex='9999'; overlay.style.display='grid'; overlay.style.placeItems='center';
    var panel = document.createElement('div');
    panel.style.background='#fff'; panel.style.borderRadius='12px'; panel.style.width='min(900px, 96vw)'; panel.style.maxHeight='80vh'; panel.style.overflow='auto'; panel.style.boxShadow='0 12px 40px rgba(0,0,0,0.35)'; panel.style.padding='24px';
    panel.innerHTML = '<h3 style="margin:0 0 12px 0;">刷题筛选</h3>'+
      '<div style="margin:8px 0 16px 0; display:flex; gap:8px; flex-wrap:wrap;">'+
        [1,2,3,4,5].map(function(n){ return '<button class="pill" data-level="'+n+'" style="padding:6px 10px; border-radius:16px; border:1px solid #e6eaf2; background:#f8f9fa; cursor:pointer;">熟练度 '+n+'</button>'; }).join('')+
      '</div>'+
      '<div id="filter-results" style="display:grid; gap:8px;"></div>'+
      '<div style="margin-top:16px; display:flex; gap:8px;">'+
        '<button id="filter-close" class="btn" style="padding:8px 12px; border:1px solid #e6eaf2; background:#f8f9fa; border-radius:8px; cursor:pointer;">关闭</button>'+
      '</div>';
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    panel.addEventListener('click', function(e){ var t=e.target; if(t&&t.id==='filter-close'){ document.body.removeChild(overlay); } if(t&&t.dataset&&t.dataset.level){ var lvl=parseInt(t.dataset.level,10)||0; renderFiltered(lvl, panel.querySelector('#filter-results')); } });
  }
  function renderFiltered(level, container){ if(!container) return; var results=[]; try{
    for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(k&&k.indexOf('exam_proficiency:')===0){ var paper=k.slice('exam_proficiency:'.length); var raw=localStorage.getItem(k); var obj; try{ obj=JSON.parse(raw||'{}'); }catch(e){ obj={}; } for(var idx in obj){ if(Object.prototype.hasOwnProperty.call(obj, idx)){ var val=parseInt(obj[idx],10)||0; if(val===level){ var attemptsKey='exam_attempts:'+paper; var aRaw=localStorage.getItem(attemptsKey); var aObj; try{ aObj=JSON.parse(aRaw||'{}'); }catch(e){ aObj={}; } var times=parseInt(aObj[String(idx)]||0,10)||0; results.push({ paper: paper, idx: parseInt(idx,10)||0, times: times }); } } } } }
  }catch(e){}
    if(results.length===0){ container.innerHTML='<div class="card" style="padding:12px;">未找到符合条件的题目</div>'; return; }
    container.innerHTML = results.map(function(r){ var title='试卷 '+String(r.paper).replace(/\.md$/i,'')+' · 第 '+(r.idx+1)+' 题'; var href='exam-viewer.html?paper='+encodeURIComponent(r.paper)+'&goto='+r.idx; return '<a class="card" href="'+href+'" style="text-decoration:none;color:inherit; padding:16px;">'+title+'<div style="margin-top:6px; font-size:12px; opacity:0.7;">已练 '+r.times+' 次 · 熟练度 '+level+'</div></a>'; }).join('');
  }
  window.ModuleIndex = { render: render, cardHTML: cardHTML };
  document.addEventListener('DOMContentLoaded', function(){ render(); if(isExams()) renderPapers(); });
})();