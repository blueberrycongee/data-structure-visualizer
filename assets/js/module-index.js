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
  function renderPapers(){ var grid=document.getElementById('module-grid'); if(!grid) return; fetchJSON('/_papers.json').then(function(list){ if(!list||!Array.isArray(list)||list.length===0) return; var items=list.map(function(f){ return { href: 'exam-viewer.html?paper='+encodeURIComponent(f.name), icon:{type:'emoji',value:'🧪'}, title: f.title || f.name, desc: (f.sizeKb?('大小约 '+f.sizeKb+' KB · 更新 '+(f.mtime||'')):(f.mtime||'')), status:'online' }; }); grid.innerHTML = items.map(cardHTML).join(''); }); }
  window.ModuleIndex = { render: render, cardHTML: cardHTML };
  document.addEventListener('DOMContentLoaded', function(){ render(); if(isExams()) renderPapers(); });
})();