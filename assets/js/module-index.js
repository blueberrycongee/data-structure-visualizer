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
    var content = iconHTML(item.icon) +
      '<h3 class="card-title">' + item.title + '</h3>' +
      '<p class="card-description">' + (item.desc || '') + '</p>' +
      statusHTML(item.status);
    if (item.href) return '<a class="card" href="' + item.href + '" style="text-decoration:none;color:inherit;">' + content + '</a>';
    return '<div class="card">' + content + '</div>';
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
        grid.innerHTML = '<div class="card"><h3 class="card-title">未发现试卷</h3><p class="card-description">请将 .md 文件放入 papers/ 目录</p>'+statusHTML('coming-soon')+'</div>';
        return;
      }
      var seen={}; var list=files.filter(function(n){ if(!n||!/\.md$/i.test(n)) return false; var k=n.toLowerCase(); if(seen[k]) return false; seen[k]=true; return true; });
      var items=list.map(function(name){ var title=String(name||'').replace(/\.md$/i,''); return { href:'exam-viewer.html?paper='+encodeURIComponent(name), icon:{type:'emoji',value:'🧪'}, title:title, desc:'Markdown 试卷', status:'online' }; });
      grid.innerHTML=items.map(cardHTML).join('');
    }
    function listDir(dir){ return fetch(dir).then(function(r){ return r.text(); }).then(function(html){ var doc; try{ doc=new DOMParser().parseFromString(html,'text/html'); }catch(e){ doc=null; } var files=[]; if(doc){ var as=doc.querySelectorAll('a'); as.forEach(function(a){ var href=(a.getAttribute('href')||''); if(/\.md$/i.test(href)){ var nm=href.replace(/^\.\//,'').replace(/\?.*$/,''); try{ nm=decodeURIComponent(nm); }catch(e){} files.push(nm); } }); } else { String(html||'').replace(/href=["']([^"']+\.md)["']/ig,function(_,m){ try{ files.push(decodeURIComponent(m)); }catch(e){ files.push(m); } }); } return files; }); }
    fetchJSON('/_papers.json').then(function(list){ if(list&&Array.isArray(list)&&list.length>0){ setItems(list.map(function(f){ return f.name||f; })); return; }
      var bases=['papers/','/papers/','./papers/','../papers/','/blueberrycongee.github.io/visualizer/papers/'];
      return Promise.all(bases.map(function(b){ return listDir(b).catch(function(){ return []; }); })).then(function(all){ var files=[]; all.forEach(function(arr){ arr.forEach(function(n){ files.push(n); }); }); setItems(files); });
    });
  }
  window.ModuleIndex = { render: render, cardHTML: cardHTML };
  document.addEventListener('DOMContentLoaded', function(){ render(); if(isExams()) renderPapers(); });
})();