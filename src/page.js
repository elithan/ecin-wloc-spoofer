export function getPageHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>ECIN 虚拟定位</title>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="WLOC">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
:root {
  --bg: #0a0a0a;
  --card: #121212;
  --border: #222;
  --text: #f0f0f0;
  --text-secondary: #888;
  --accent: #ffffff;
  --accent-light: #333;
  --success: #10b981;
  --danger: #ef4444;
  --radius: 10px;
  --transition: 0.2s ease;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  padding-bottom: 20px;
}
#map {
  height: 46vh;
  width: 100%;
  min-height: 240px;
  border-bottom: 1px solid var(--border);
}
.panel {
  padding: 14px;
  max-width: 600px;
  margin: 0 auto;
}
.card {
  background: var(--card);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--border);
}
.card h3 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--text);
  letter-spacing: 0.3px;
}
.coords {
  font-family: "SF Mono", Menlo, Monaco, monospace;
  font-size: 13px;
  color: var(--text);
  padding: 10px 12px;
  background: var(--bg);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  word-break: break-all;
  min-height: 40px;
  display: flex;
  align-items: center;
}
.row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.btn {
  flex: 1;
  min-width: 100px;
  padding: 11px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  background: var(--card);
  color: var(--text);
  outline: none;
}
.btn:active {
  transform: scale(0.97);
  opacity: 0.9;
}
.btn-primary {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
}
.btn-primary:hover {
  background: #e0e0e0;
}
.btn-secondary {
  background: transparent;
  color: var(--text);
  border-color: var(--border);
}
.btn-secondary:hover {
  background: var(--accent-light);
}
.btn-danger {
  background: transparent;
  color: var(--danger);
  border-color: var(--danger);
}
.btn-success {
  background: transparent;
  color: var(--success);
  border-color: var(--success);
}
.btn-sm {
  flex: none;
  min-width: auto;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 8px;
}
.input-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.input-row input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 13px;
  outline: none;
  min-width: 0;
  background: var(--bg);
  color: var(--text);
}
.input-row input:focus {
  border-color: var(--accent);
}
.status {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 10px;
  text-align: center;
}
.error-banner {
  background: #1a0b0b;
  color: var(--danger);
  padding: 14px 16px;
  border-radius: var(--radius);
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.5;
  display: none;
  border: 1px solid #331111;
}
.error-banner b {
  display: block;
  margin-bottom: 4px;
}
.toast {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 9999;
  max-width: 90vw;
  text-align: center;
  border: 1px solid var(--border);
}
.toast.show {
  opacity: 1;
}
.active-loc {
  background: var(--bg);
  border-radius: var(--radius);
  padding: 11px 12px;
  font-size: 13px;
  color: var(--text);
  border: 1px solid var(--border);
}
.active-loc .label {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}
.active-loc .value {
  font-family: "SF Mono", monospace;
  font-size: 13px;
}
.fav-list {
  max-height: 220px;
  overflow-y: auto;
}
.fav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--bg);
  border-radius: var(--radius);
  margin-bottom: 6px;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border);
}
.fav-item:active {
  background: var(--accent-light);
}
.fav-item .fav-info {
  flex: 1;
  min-width: 0;
}
.fav-item .fav-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fav-item .fav-coords {
  font-size: 11px;
  color: var(--text-secondary);
  font-family: "SF Mono", monospace;
  margin-top: 2px;
}
.fav-item .fav-active {
  font-size: 10px;
  color: var(--success);
  font-weight: 600;
  margin-top: 2px;
}
.fav-item .fav-del {
  flex: none;
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: transparent;
  color: var(--danger);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}
.fav-item .fav-del:hover {
  background: #221111;
}
.fav-empty {
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
  padding: 16px 0;
}
.fav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.fav-header h3 {
  margin-bottom: 0;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-overlay.show {
  display: flex;
}
.modal {
  background: var(--card);
  border-radius: 14px;
  padding: 20px;
  width: 100%;
  max-width: 340px;
  border: 1px solid var(--border);
}
.modal h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  text-align: center;
}
.modal input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 14px;
  outline: none;
  margin-bottom: 12px;
  background: var(--bg);
  color: var(--text);
}
.modal input:focus {
  border-color: var(--accent);
}
.modal .modal-btns {
  display: flex;
  gap: 8px;
}
.modal .modal-btns .btn {
  padding: 12px;
}
.layer-switch {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  gap: 4px;
  background: rgba(10, 10, 10, 0.85);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid var(--border);
}
.layer-btn {
  border: none;
  background: transparent;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}
.layer-btn.active {
  background: var(--accent);
  color: #000;
}
.layer-btn:active {
  transform: scale(0.95);
}
@media(max-width: 480px) {
  #map { height: 42vh; }
  .panel { padding: 12px; }
  .layer-btn { padding: 4px 6px; font-size: 10px; }
  .card { padding: 14px; }
}
</style>
</head>
<body>
<div style="position:relative">
<div id="map"></div>
<div class="layer-switch">
  <button class="layer-btn active" data-layer="satellite" onclick="switchLayer('satellite')">卫星</button>
  <button class="layer-btn" data-layer="wgs84" onclick="switchLayer('wgs84')">WGS84</button>
  <button class="layer-btn" data-layer="amap" onclick="switchLayer('amap')">高德</button>
  <button class="layer-btn" data-layer="voyager" onclick="switchLayer('voyager')">彩色</button>
  <button class="layer-btn" data-layer="standard" onclick="switchLayer('standard')">标准</button>
  <button class="layer-btn" data-layer="dark" onclick="switchLayer('dark')">暗色</button>
</div>
</div>
<div class="panel">
  <div class="error-banner" id="errorBanner">
    <b>模块未生效</b>
    请检查以下配置：<br>
    1. 已安装并启用 ECIN 定位模块<br>
    2. MITM 已开启且信任证书<br>
    3. MITM 主机名包含 gs-loc.apple.com<br>
    4. 当前网络已走代理
  </div>
  <div class="card">
    <h3>选择目标位置</h3>
    <div class="coords" id="coords">点击地图或使用下方工具选择位置</div>
    <div class="row">
      <button class="btn btn-primary" id="saveBtn" onclick="save()">储存到设备</button>
      <button class="btn btn-secondary" onclick="addFav()">收藏位置</button>
      <button class="btn btn-secondary" onclick="locateMe()">当前位置</button>
    </div>
  </div>
  <div class="card">
    <div class="fav-header">
      <h3>收藏的位置</h3>
      <button class="btn btn-sm btn-secondary" onclick="clearAllFav()" id="clearAllBtn" style="display:none">清空全部</button>
    </div>
    <div id="favList" class="fav-list"></div>
  </div>
  <div class="card">
    <h3>当前生效坐标</h3>
    <div class="active-loc" id="activeLoc">
      <div class="label">设备持久化数据 (wloc_settings)</div>
      <div class="value" id="activeValue">查询中...</div>
    </div>
    <div class="row">
      <button class="btn btn-sm btn-secondary" onclick="queryActive()">刷新</button>
      <button class="btn btn-sm btn-danger" onclick="clearActive()">清除数据</button>
    </div>
  </div>
  <div class="card">
    <h3>粘贴地图链接</h3>
    <div class="input-row">
      <input id="urlInput" placeholder="Apple/Google/高德地图链接 或 经纬度" />
      <button class="btn btn-secondary" style="flex:none;min-width:56px" onclick="parseUrl()">解析</button>
    </div>
    <div style="font-size:11px;color:var(--text-secondary);margin-top:6px">支持 Apple Maps · Google Maps · 高德 · 百度 · 坐标文本</div>
  </div>
  <div class="card">
    <h3>搜索地点</h3>
    <div class="input-row">
      <input id="searchInput" placeholder="输入地名（如: 上海外滩）" />
      <button class="btn btn-secondary" style="flex:none;min-width:56px" onclick="searchPlace()">搜索</button>
    </div>
  </div>
  <div class="status" id="status">选好位置后点击「储存到设备」写入代理工具</div>
</div>
<div class="toast" id="toast"></div>
<div class="modal-overlay" id="favModal">
  <div class="modal">
    <h3>收藏此位置</h3>
    <input id="favNameInput" placeholder="输入备注名称（如: 公司、家）" maxlength="30" />
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;text-align:center" id="favModalCoords"></div>
    <div class="modal-btns">
      <button class="btn btn-secondary" onclick="closeFavModal()">取消</button>
      <button class="btn btn-primary" onclick="confirmFav()">保存</button>
    </div>
  </div>
</div>
<script>
const SAVE_API = 'https://gs-loc.apple.com/wloc-settings/save';
const FAV_KEY = 'wloc_favorites';
let lat = 22.544577, lon = 113.94114;
let selected = false;
let activeLon = null, activeLat = null;

const map = L.map('map').setView([lat, lon], 13);
const tiles = {
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {maxZoom:19, attribution:'ArcGIS'}),
  wgs84: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {maxZoom:19, attribution:'ArcGIS WGS84'}),
  standard: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'\\u00a9 OSM'}),
  dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {maxZoom:19, attribution:'\\u00a9 Carto'}),
  amap: L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {maxZoom:18, subdomains:'1234', attribution:'\\u00a9 高德'}),
  voyager: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {maxZoom:19, attribution:'\\u00a9 Carto'})
};
let currentLayer = tiles.satellite;
currentLayer.addTo(map);
function switchLayer(name) {
  map.removeLayer(currentLayer);
  currentLayer = tiles[name];
  currentLayer.addTo(map);
  document.querySelectorAll('.layer-btn').forEach(b => b.classList.toggle('active', b.dataset.layer === name));
}
let marker = L.marker([lat, lon], {draggable:true}).addTo(map);

marker.on('dragend', e => { const p=e.target.getLatLng(); setPos(p.lat, p.lng); });
map.on('click', e => { setPos(e.latlng.lat, e.latlng.lng); });

function setPos(newLat, newLon) {
  lat = newLat; lon = newLon; selected = true;
  marker.setLatLng([lat, lon]);
  document.getElementById('coords').textContent = '经度 ' + lon.toFixed(6) + '  纬度 ' + lat.toFixed(6);
}

function moveTo(newLat, newLon, zoom) {
  setPos(newLat, newLon);
  map.setView([lat, lon], zoom || 15);
}

function toast(msg, ms) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms || 2500);
}

function showError(show) {
  document.getElementById('errorBanner').style.display = show ? 'block' : 'none';
}

/* ---- Favorites (localStorage) ---- */
function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch(e) { return []; }
}
function saveFavs(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function renderFavs() {
  const favs = getFavs();
  const el = document.getElementById('favList');
  const clearBtn = document.getElementById('clearAllBtn');
  clearBtn.style.display = favs.length ? '' : 'none';
  if (!favs.length) {
    el.innerHTML = '<div class="fav-empty">暂无收藏，选好位置后点击「收藏位置」</div>';
    return;
  }
  el.innerHTML = favs.map((f, i) => {
    const isActive = activeLon !== null && Math.abs(f.lon - activeLon) < 0.000001 && Math.abs(f.lat - activeLat) < 0.000001;
    return '<div class="fav-item" onclick="loadFav(' + i + ')">' +
      '<div class="fav-info">' +
        '<div class="fav-name">' + escHtml(f.name) + '<\\/div>' +
        '<div class="fav-coords">' + f.lon.toFixed(6) + ', ' + f.lat.toFixed(6) + '<\\/div>' +
        (isActive ? '<div class="fav-active">\\u2713 当前生效<\\/div>' : '') +
      '<\\/div>' +
      '<button class="fav-del" onclick="event.stopPropagation();delFav(' + i + ')" title="删除">\\u00d7<\\/button>' +
    '<\\/div>';
  }).join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function addFav() {
  if (!selected) { toast('请先在地图上选择一个位置'); return; }
  document.getElementById('favModalCoords').textContent = lon.toFixed(6) + ', ' + lat.toFixed(6);
  document.getElementById('favNameInput').value = '';
  document.getElementById('favModal').classList.add('show');
  setTimeout(() => document.getElementById('favNameInput').focus(), 100);
}

function closeFavModal() {
  document.getElementById('favModal').classList.remove('show');
}

function confirmFav() {
  const name = document.getElementById('favNameInput').value.trim();
  if (!name) { toast('请输入备注名称'); return; }
  const favs = getFavs();
  favs.push({ name, lon, lat, time: new Date().toISOString() });
  saveFavs(favs);
  closeFavModal();
  renderFavs();
  toast('已收藏: ' + name);
}

function loadFav(i) {
  const favs = getFavs();
  if (!favs[i]) return;
  moveTo(favs[i].lat, favs[i].lon, 15);
  toast(favs[i].name + ' (' + favs[i].lon.toFixed(4) + ', ' + favs[i].lat.toFixed(4) + ')');
}

function delFav(i) {
  const favs = getFavs();
  if (!favs[i]) return;
  const name = favs[i].name;
  favs.splice(i, 1);
  saveFavs(favs);
  renderFavs();
  toast('已删除: ' + name);
}

function clearAllFav() {
  if (!confirm('确定清空所有收藏？')) return;
  saveFavs([]);
  renderFavs();
  toast('已清空所有收藏');
}

/* ---- Active location query ---- */
function queryActive() {
  const el = document.getElementById('activeValue');
  el.textContent = '查询中...';
  fetch(SAVE_API + '?action=query', { method:'GET', mode:'cors', cache:'no-store' })
    .then(r => r.json())
    .then(d => {
      if (d.success && d.longitude && d.latitude) {
        activeLon = parseFloat(d.longitude);
        activeLat = parseFloat(d.latitude);
        el.textContent = '经度 ' + activeLon.toFixed(6) + '  纬度 ' + activeLat.toFixed(6) + (d.accuracy ? '  精度 ' + d.accuracy + 'm' : '');
        renderFavs();
      } else {
        activeLon = null; activeLat = null;
        el.textContent = '无已保存的坐标';
        renderFavs();
      }
    })
    .catch(() => {
      el.textContent = '查询失败 (需要代理模块支持)';
    });
}

function clearActive() {
  if (!confirm('确定清除设备上已保存的坐标？清除后将使用模块默认参数或停止修改定位。')) return;
  fetch(SAVE_API + '?action=clear', { method:'GET', mode:'cors', cache:'no-store' })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        activeLon = null; activeLat = null;
        document.getElementById('activeValue').textContent = '已清除';
        renderFavs();
        toast('已清除设备坐标');
      } else { toast('清除失败: ' + (d.error || ''), 3000); }
    })
    .catch(() => { toast('清除失败 - 请检查模块配置', 3000); });
}

/* ---- Save to device ---- */
async function save() {
  if (!selected) { toast('请先在地图上选择一个位置'); return; }
  const btn = document.getElementById('saveBtn');
  btn.textContent = '储存中...'; btn.disabled = true;
  showError(false);
  try {
    const r = await fetch(SAVE_API + '?lon=' + lon + '&lat=' + lat + '&acc=25', {
      method: 'GET', mode: 'cors', cache: 'no-store'
    });
    const d = await r.json();
    if (d.success) {
      activeLon = lon; activeLat = lat;
      btn.textContent = '\\u2713 已储存'; btn.className = 'btn btn-primary';
      document.getElementById('status').textContent = '\\u2713 已写入: ' + lon.toFixed(6) + ', ' + lat.toFixed(6) + ' \\u00b7 ' + new Date().toLocaleTimeString('zh-CN');
      document.getElementById('activeValue').textContent = '经度 ' + lon.toFixed(6) + '  纬度 ' + lat.toFixed(6) + '  精度 25m';
      renderFavs();
      toast('\\u2713 坐标已写入设备，下次定位生效');
      setTimeout(() => { btn.textContent='储存到设备'; btn.className='btn btn-primary'; btn.disabled=false; }, 2500);
    } else {
      throw new Error(d.error || '写入失败');
    }
  } catch(e) {
    btn.textContent = '储存到设备'; btn.className = 'btn btn-primary'; btn.disabled = false;
    showError(true);
    toast('\\u2717 储存失败 - 请检查模块配置', 4000);
  }
}

function locateMe() {
  if (!navigator.geolocation) return toast('浏览器不支持定位');
  toast('获取位置中...');
  navigator.geolocation.getCurrentPosition(
    pos => { moveTo(pos.coords.latitude, pos.coords.longitude, 16); toast('已获取当前位置'); },
    err => toast('定位失败: ' + err.message, 3000),
    { enableHighAccuracy:true, timeout:10000 }
  );
}

function parseMapUrl(text) {
  let m;
  m = text.match(/ll=([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  m = text.match(/@([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  m = text.match(/lnglat=([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[2]), lon: parseFloat(m[1]) };
  m = text.match(/(?:location|center)=([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[2]), lon: parseFloat(m[1]) };
  m = text.match(/([0-9]+\\.[0-9]+)[,\\s]+([0-9]+\\.[0-9]+)/);
  if (m) {
    const a = parseFloat(m[1]), b = parseFloat(m[2]);
    if (a < 90 && b > 90) return { lat: a, lon: b };
    if (b < 90 && a > 90) return { lat: b, lon: a };
    return { lat: a, lon: b };
  }
  return null;
}

function parseUrl() {
  const input = document.getElementById('urlInput').value.trim();
  if (!input) return toast('请粘贴地图链接或坐标');
  const result = parseMapUrl(input);
  if (!result) { toast('无法解析坐标，请检查链接格式', 3000); return; }
  moveTo(result.lat, result.lon, 15);
  toast('已解析: ' + result.lon.toFixed(4) + ', ' + result.lat.toFixed(4));
}

async function searchPlace() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) return toast('请输入地名');
  toast('搜索中...');
  try {
    const r = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(q));
    const results = await r.json();
    if (!results.length) { toast('未找到: ' + q, 3000); return; }
    const p = results[0];
    moveTo(parseFloat(p.lat), parseFloat(p.lon), 15);
    toast(p.display_name.slice(0, 40));
  } catch(e) { toast('搜索失败', 3000); }
}

document.addEventListener('paste', e => {
  const text = (e.clipboardData||window.clipboardData).getData('text');
  if (text && (text.includes('map') || text.includes('loc') || text.includes('lnglat') || /[0-9]+\\.[0-9]+/.test(text))) {
    document.getElementById('urlInput').value = text;
    setTimeout(parseUrl, 200);
  }
});
document.getElementById('searchInput').addEventListener('keydown', e => { if(e.key==='Enter') searchPlace(); });
document.getElementById('urlInput').addEventListener('keydown', e => { if(e.key==='Enter') parseUrl(); });
document.getElementById('favNameInput').addEventListener('keydown', e => { if(e.key==='Enter') confirmFav(); });

renderFavs();
queryActive();
<\/script>
</body>
</html>`;
}
