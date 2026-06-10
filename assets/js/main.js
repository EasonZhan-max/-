/*
  Eason Blog - Clean JavaScript
  模块标注：
  01 Data          文章、歌单、配置数据
  02 Utilities     常用工具函数
  03 ThemePalette  主题、调色板、壁纸开关
  04 Background    星星与流星
  05 Navigation    顶部栏收起、下拉菜单、返回顶部
  06 Music         音乐播放器与歌单
  07 PostsGallery  文章筛选、分页、相册、弹窗
  08 Reserved      预留模块
  09 Init          初始化入口
*/

/* 01 Data */
const CONFIG = {
  siteStartDate: '2026-06-04',
  postsPerPage: 10,
  typingTexts: [
    '慢慢来，所有热爱都会发光。',
    '把普通日子过成自己的星河。',
    '今天也要向喜欢的未来靠近一点。',
    '奔赴星辰大海，不负心中热爱。'
  ],
  playlist: [
    { name: '一点', artist: 'muyoi pezzi', cover: 'assets/images/cover-yidian.jpg', src: 'assets/music/yidian.mp3' },
    { name: '星辰不坠落', artist: '蓝心羽', cover: 'assets/images/cover-xingchen-buzhuiluo.jpg', src: 'assets/music/xingchen-buzhuiluo.mp3' },
    { name: '记忆停留', artist: '蓝心羽', cover: 'assets/images/cover-jiyi-tingliu.jpg', src: 'assets/music/jiyi-tingliu.mp3' },
    { name: '你在左边 我紧靠右', artist: 'Lipp', cover: 'assets/images/cover-zuobian-jinkaoyou.jpg', src: 'assets/music/zuobian-jinkaoyou.mp3' }
  ]
};

/* 02 Utilities */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const root = document.documentElement;
const safeText = (value) => String(value || '').replace(/[<>&]/g, (m) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[m]));
const fmtTime = (sec) => {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};
const openModal = (id) => {
  const modal = typeof id === 'string' ? $(id) : id;
  if (!modal) return;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  if (modal.id === 'paletteModal') document.body.classList.add('palette-open');
};
const closeModal = (modal) => {
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  if (modal.id === 'paletteModal') document.body.classList.remove('palette-open');
  if (!$('.modal.show')) document.body.classList.remove('modal-open');
};

/* 03 ThemePalette */
function currentTheme() {
  return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function updateThemeButton() {
  const text = $('#themeText');
  const icon = $('#themeIcon');
  const dark = currentTheme() === 'dark';
  if (text) text.textContent = dark ? '浅色' : '深色';
  if (icon) icon.innerHTML = dark
    ? '<path d="M12 4v1.5M12 18.5V20M4 12h1.5M18.5 12H20M6.3 6.3l1 1M16.7 16.7l1 1M17.7 6.3l-1 1M7.3 16.7l-1 1"></path><circle cx="12" cy="12" r="4"></circle>'
    : '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path>';
}

const customState = {
  hue: Number(localStorage.getItem('custom-hue') || 210),
  bgMode: localStorage.getItem('custom-bg-mode') || 'default',
  showHeroText: localStorage.getItem('custom-show-hero-text') !== '0',
  showStars: localStorage.getItem('custom-show-stars') !== '0',
  showMeteor: localStorage.getItem('custom-show-meteor') !== '0',
  showMist: localStorage.getItem('custom-show-mist') !== '0',
  showDividerFx: localStorage.getItem('custom-show-divider-fx') !== '0'
};

function applyAccentHue(hueValue) {
  const hue = ((Number(hueValue) % 360) + 360) % 360;
  const dark = currentTheme() === 'dark';
  root.style.setProperty('--mist', dark ? `hsl(${hue} 42% 66%)` : `hsl(${hue} 42% 74%)`);
  root.style.setProperty('--mist-2', dark ? `hsl(${(hue + 14) % 360} 25% 38%)` : `hsl(${(hue + 12) % 360} 42% 84%)`);
  root.style.setProperty('--mist-3', dark ? `hsl(${(hue + 8) % 360} 32% 12%)` : `hsl(${(hue + 8) % 360} 48% 96%)`);
  root.style.setProperty('--pink', dark ? `hsl(${(hue + 34) % 360} 46% 72%)` : `hsl(${(hue + 34) % 360} 52% 78%)`);
  root.style.setProperty('--line', dark ? `hsla(${hue} 28% 82% / .14)` : `hsla(${hue} 24% 46% / .22)`);
  $('#hueValue') && ($('#hueValue').textContent = hue);
  $('#hueSlider') && ($('#hueSlider').value = hue);
  customState.hue = hue;
  localStorage.setItem('custom-hue', String(hue));
}

function applyBackgroundMode(mode) {
  const safeMode = ['default', 'gradient', 'night', 'solid'].includes(mode) ? mode : 'default';
  root.classList.remove('bg-gradient', 'bg-night', 'bg-solid');
  if (safeMode !== 'default') root.classList.add(`bg-${safeMode}`);
  customState.bgMode = safeMode;
  localStorage.setItem('custom-bg-mode', safeMode);
  $$('[data-bg-mode]').forEach((btn) => btn.classList.toggle('active', btn.dataset.bgMode === safeMode));
}

function applyWallpaperSwitches() {
  root.classList.toggle('custom-hide-hero-text', !customState.showHeroText);
  root.classList.toggle('custom-hide-stars', !customState.showStars);
  root.classList.toggle('custom-hide-meteor', !customState.showMeteor);
  root.classList.toggle('custom-hide-mist', !customState.showMist);
  root.classList.toggle('custom-hide-divider-fx', !customState.showDividerFx);
  const pairs = [
    ['toggleHeroText', 'showHeroText'], ['toggleStars', 'showStars'],
    ['toggleMeteor', 'showMeteor'], ['toggleMist', 'showMist'], ['toggleDividerFx', 'showDividerFx']
  ];
  pairs.forEach(([id, key]) => {
    const input = $(`#${id}`);
    if (input) input.checked = customState[key];
    localStorage.setItem(`custom-${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`, customState[key] ? '1' : '0');
  });
}

function initThemePalette() {
  if (localStorage.getItem('theme')) root.dataset.theme = localStorage.getItem('theme');
  updateThemeButton();
  applyAccentHue(customState.hue);
  applyBackgroundMode(customState.bgMode);
  applyWallpaperSwitches();

  $('#themeBtn')?.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
    updateThemeButton();
    applyAccentHue(customState.hue);
  });

  $('#paletteBtn')?.addEventListener('click', () => openModal('#paletteModal'));
  $('#hueSlider')?.addEventListener('input', (event) => applyAccentHue(event.target.value));
  $$('[data-bg-mode]').forEach((btn) => btn.addEventListener('click', () => applyBackgroundMode(btn.dataset.bgMode)));
  $('#paletteResetBtn')?.addEventListener('click', () => {
    localStorage.removeItem('custom-hue');
    localStorage.removeItem('custom-bg-mode');
    ['custom-show-hero-text', 'custom-show-stars', 'custom-show-meteor', 'custom-show-mist', 'custom-show-divider-fx'].forEach((key) => localStorage.removeItem(key));
    Object.assign(customState, { hue: 210, bgMode: 'default', showHeroText: true, showStars: true, showMeteor: true, showMist: true, showDividerFx: true });
    applyAccentHue(210);
    applyBackgroundMode('default');
    applyWallpaperSwitches();
  });
  [
    ['toggleHeroText', 'showHeroText'], ['toggleStars', 'showStars'],
    ['toggleMeteor', 'showMeteor'], ['toggleMist', 'showMist'], ['toggleDividerFx', 'showDividerFx']
  ].forEach(([id, key]) => $(`#${id}`)?.addEventListener('change', (e) => {
    customState[key] = e.target.checked;
    applyWallpaperSwitches();
  }));
}

/* 04 Background */
function initTyping() {
  const target = $('#typeText');
  let typeIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const loop = () => {
    const text = CONFIG.typingTexts[typeIndex];
    target.textContent = text.slice(0, charIndex);
    if (!deleting && charIndex < text.length) { charIndex += 1; setTimeout(loop, 90); return; }
    if (!deleting) { deleting = true; setTimeout(loop, 1600); return; }
    if (charIndex > 0) { charIndex -= 1; setTimeout(loop, 45); return; }
    deleting = false;
    typeIndex = (typeIndex + 1) % CONFIG.typingTexts.length;
    setTimeout(loop, 300);
  };
  if (target) loop();
}

function initStars() {
  const canvas = $('#starsCanvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  let stars = [];
  let size = { w: 0, h: 0 };
  const createStar = (w, h) => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + .3, a: Math.random(), s: Math.random() * .018 + .006 });
  const resize = (force = false) => {
    const w = Math.max(window.innerWidth, document.documentElement.clientWidth);
    const h = Math.max(window.innerHeight, document.documentElement.clientHeight);
    if (!force && size.w && Math.abs(w - size.w) < 2 && Math.abs(h - size.h) < 120) return;
    const old = { ...size };
    canvas.width = w;
    canvas.height = h;
    const target = Math.min(160, Math.floor((w * h) / 9000));
    stars = stars.length ? stars.slice(0, target).map((star) => ({ ...star, x: star.x / (old.w || w) * w, y: star.y / (old.h || h) * h })) : [];
    while (stars.length < target) stars.push(createStar(w, h));
    size = { w, h };
  };
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rgb = getComputedStyle(root).getPropertyValue('--star-rgb').trim() || '159,185,201';
    stars.forEach((star) => {
      star.a += star.s;
      const alpha = .25 + Math.abs(Math.sin(star.a)) * .75;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
      ctx.fill();
      star.y += .05;
      if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(draw);
  };
  let timer;
  window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(() => resize(), 120); });
  window.addEventListener('orientationchange', () => setTimeout(() => resize(true), 180));
  resize(true);
  draw();
}

function initMeteors() {
  const layer = $('#meteorLayer');
  if (!layer) return;
  const launch = () => {
    if (root.classList.contains('custom-hide-meteor')) return;
    const meteor = document.createElement('span');
    meteor.className = 'meteor';
    meteor.style.left = `${55 + Math.random() * 50}vw`;
    meteor.style.top = `${5 + Math.random() * 50}vh`;
    meteor.style.animationDuration = `${1.8 + Math.random() * 1.4}s`;
    layer.appendChild(meteor);
    requestAnimationFrame(() => meteor.classList.add('fly'));
    setTimeout(() => meteor.remove(), 3600);
  };
  setInterval(launch, 4200);
  setTimeout(launch, 800);
}

/* 05 Navigation */
function initNavigation() {
  const nav = $('#siteNav');
  const backTop = $('#backTopBtn');
  const mobileNavToggle = $('#mobileNavToggle');
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const getScrollTop = () => Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0, document.body.scrollTop || 0);
  const sync = () => {
    const top = getScrollTop();
    nav?.classList.toggle('nav-collapsed-top', top <= 48);
    backTop?.classList.toggle('is-hidden', top < 220);
  };
  const setMobileNavCollapsed = (collapsed) => {
    if (!nav || !mobileNavToggle) return;
    const active = mobileQuery.matches && collapsed;
    nav.classList.toggle('mobile-links-collapsed', active);
    mobileNavToggle.setAttribute('aria-expanded', String(!active));
    mobileNavToggle.setAttribute('aria-label', active ? '展开顶部栏' : '收起顶部栏');
    mobileNavToggle.setAttribute('title', active ? '展开顶部栏' : '收起顶部栏');
  };
  const syncMobileNav = () => {
    if (!mobileQuery.matches) {
      setMobileNavCollapsed(false);
      return;
    }
    const saved = localStorage.getItem('eason-mobile-nav-collapsed') === '1';
    setMobileNavCollapsed(saved);
  };
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    [80, 220, 460, 760].forEach((delay) => setTimeout(sync, delay));
  });
  $$('[data-scroll-target]').forEach((btn) => btn.addEventListener('click', () => $(btn.dataset.scrollTarget)?.scrollIntoView({ behavior: 'smooth' })));
  const closeNavDropdown = (drop) => {
    drop.classList.remove('open');
    $('.nav-drop-btn', drop)?.setAttribute('aria-expanded', 'false');
  };
  $$('.nav-dropdown').forEach((drop) => {
    const btn = $('.nav-drop-btn', drop);
    const menu = $('.nav-dropdown-menu', drop);
    btn?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const shouldOpen = !drop.classList.contains('open');
      $$('.nav-dropdown.open').forEach((other) => closeNavDropdown(other));
      if (shouldOpen) {
        drop.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    menu?.addEventListener('click', () => closeNavDropdown(drop));
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-dropdown')) $$('.nav-dropdown.open').forEach((drop) => closeNavDropdown(drop));
  });

  mobileNavToggle?.addEventListener('click', () => {
    const collapsed = !nav?.classList.contains('mobile-links-collapsed');
    setMobileNavCollapsed(collapsed);
    localStorage.setItem('eason-mobile-nav-collapsed', collapsed ? '1' : '0');
    $$('.nav-dropdown.open').forEach((drop) => closeNavDropdown(drop));
  });
  window.addEventListener('resize', syncMobileNav, { passive: true });
  syncMobileNav();

  // 头像跳转到“关于我”
  const goAbout = () => $('#aboutMe')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('.avatar-large')?.addEventListener('click', goAbout);
  $('.avatar-large')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); goAbout(); }
  });
  sync();
}

/* 06 Music */
function initMusic() {
  const audio = $('#audio');
  if (!audio) return;
  let songIndex = 0;
  let playMode = localStorage.getItem('eason-play-mode') || 'loop';
  const playIcon = '<svg id="playIcon" viewBox="0 0 24 24"><path d="M8 6l10 6-10 6V6z"></path></svg>';
  const pauseIcon = '<svg id="playIcon" viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"></path></svg>';
  const modeNames = { list: '顺序播放', loop: '列表循环', single: '单曲循环' };

  const current = () => CONFIG.playlist[songIndex];
  const setText = (selector, text) => { const el = $(selector); if (el) el.textContent = text; };
  const setImage = (selector, src) => { const el = $(selector); if (el) el.src = src; };
  const renderMenus = () => {
    const html = CONFIG.playlist.map((track, index) => `
      <button class="playlist-item ${index === songIndex ? 'active' : ''}" type="button" data-song-index="${index}">
        <img src="${track.cover}" alt="${safeText(track.name)}封面" />
        <span class="playlist-item-text"><strong>${safeText(track.name)}</strong><small>${safeText(track.artist)}</small></span>
      </button>`).join('');
    ['#playlistMenu', '#modalPlaylistMenu', '#topMusicPlaylist'].forEach((selector) => { const el = $(selector); if (el) el.innerHTML = html; });
  };
  const syncMode = () => {
    ['#loopModeBtn', '#modalLoopModeBtn'].forEach((selector) => setText(selector, modeNames[playMode]));
    localStorage.setItem('eason-play-mode', playMode);
  };
  const updateUI = () => {
    const track = current();
    const isPlaying = !audio.paused;
    audio.src ||= track.src;
    setText('#songName', track.name); setText('#songStatus', isPlaying ? '正在播放' : '已暂停'); setText('#songArtist', track.artist);
    setText('#musicModalTitle', track.name); setText('#musicModalStatus', isPlaying ? '正在播放' : '已暂停'); setText('#musicModalArtist', track.artist);
    setText('#topMusicTitle', track.name); setText('#topMusicSub', track.artist);
    setText('#playlistTriggerName', track.name); setText('#playlistTriggerAlbum', track.artist);
    setText('#modalPlaylistName', track.name); setText('#modalPlaylistAlbum', track.artist);
    ['#albumCover img', '#musicModalCover', '#topMusicCover', '#playlistThumb', '#modalPlaylistThumb'].forEach((selector) => setImage(selector, track.cover));
    ['#albumCover', '#musicModalCoverWrap'].forEach((selector) => $(selector)?.classList.toggle('playing', isPlaying));
    $('#playBtn') && ($('#playBtn').innerHTML = isPlaying ? pauseIcon : playIcon);
    setText('#modalPlayBtn', isPlaying ? '暂停' : '播放');
    setText('#topMusicPlay', isPlaying ? '暂停' : '播放');
    renderMenus();
  };
  const loadSong = (index, autoplay = false) => {
    songIndex = (index + CONFIG.playlist.length) % CONFIG.playlist.length;
    audio.src = current().src;
    audio.load();
    updateUI();
    if (autoplay) audio.play().catch(() => {});
  };
  const playPause = () => audio.paused ? audio.play().catch(() => {}) : audio.pause();
  const nextSong = () => {
    if (playMode === 'single') { audio.currentTime = 0; audio.play().catch(() => {}); return; }
    const next = songIndex + 1;
    if (next >= CONFIG.playlist.length && playMode === 'list') { audio.pause(); audio.currentTime = 0; return; }
    loadSong(next % CONFIG.playlist.length, true);
  };
  const prevSong = () => loadSong(songIndex - 1, true);
  const cycleMode = () => { playMode = playMode === 'list' ? 'loop' : playMode === 'loop' ? 'single' : 'list'; syncMode(); };
  const syncProgress = () => {
    const duration = audio.duration || 0;
    const currentTime = audio.currentTime || 0;
    const percent = duration ? (currentTime / duration) * 100 : 0;
    ['#progress', '#musicModalProgress', '#topMusicProgress'].forEach((selector) => { const input = $(selector); if (input) input.value = percent; });
    ['#currentTime', '#musicModalCurrent'].forEach((selector) => setText(selector, fmtTime(currentTime)));
    ['#duration', '#musicModalDuration'].forEach((selector) => setText(selector, fmtTime(duration)));
    setText('#topMusicTime', `${fmtTime(currentTime)} / ${fmtTime(duration)}`);
  };
  const seek = (value) => { if (audio.duration) audio.currentTime = (Number(value) / 100) * audio.duration; };

  ['#playBtn', '#modalPlayBtn', '#topMusicPlay'].forEach((selector) => $(selector)?.addEventListener('click', playPause));
  ['#nextBtn', '#modalNextBtn', '#topMusicNext'].forEach((selector) => $(selector)?.addEventListener('click', nextSong));
  ['#prevBtn', '#modalPrevBtn', '#topMusicPrev'].forEach((selector) => $(selector)?.addEventListener('click', prevSong));
  ['#loopModeBtn', '#modalLoopModeBtn', '#topMusicMode'].forEach((selector) => $(selector)?.addEventListener('click', cycleMode));
  ['#progress', '#musicModalProgress', '#topMusicProgress'].forEach((selector) => $(selector)?.addEventListener('input', (e) => seek(e.target.value)));
  ['#playlistTrigger', '#modalPlaylistTrigger'].forEach((selector) => $(selector)?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = e.currentTarget.closest('.playlist-dropdown');
    dropdown?.classList.toggle('open');
    $('#music')?.classList.toggle('music-panel-open', !!$('#playlistDropdown')?.classList.contains('open'));
  }));
  $('#topMusicList')?.addEventListener('click', () => $('#topMusicPlaylist')?.classList.toggle('show'));
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.playlist-dropdown')) {
      $$('.playlist-dropdown.open').forEach((el) => el.classList.remove('open'));
      $('#music')?.classList.remove('music-panel-open');
    }
  });
  document.addEventListener('click', (event) => {
    const item = event.target.closest('[data-song-index]');
    if (!item) return;
    loadSong(Number(item.dataset.songIndex), true);
  });
  $('#musicQuick')?.addEventListener('click', () => $('#topMusicPopover')?.classList.toggle('show'));
  $('#topMusicClose')?.addEventListener('click', () => $('#topMusicPopover')?.classList.remove('show'));
  $('#music')?.addEventListener('click', (event) => { if (!event.target.closest('button,input,.playlist-dropdown')) openModal('#musicModal'); });
  $('#musicPromptYes')?.addEventListener('click', () => { $('#musicPlayTip')?.classList.remove('show'); audio.play().catch(() => {}); $('#topMusicPopover')?.classList.add('show'); });
  $('#musicPromptNo')?.addEventListener('click', () => { $('#musicPlayTip')?.classList.remove('show'); });
  audio.addEventListener('play', updateUI);
  audio.addEventListener('pause', updateUI);
  audio.addEventListener('timeupdate', syncProgress);
  audio.addEventListener('loadedmetadata', syncProgress);
  audio.addEventListener('ended', nextSong);
  syncMode();
  loadSong(0, false);
  window.addEventListener('load', () => { setTimeout(() => $('#musicPlayTip')?.classList.add('show'), 500); }, { once: true });
}

/* 07 PostsGallery */
function initPostsGallery() {
  const allPosts = $$('.post').sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''));
  const postList = $('#postList');
  const pagination = $('#pagination');
  const detailPage = $('#postDetailPage');
  const contentArea = $('.content');
  let currentFilter = 'all';
  let currentPage = 1;

  const slugify = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-').replace(/^-|-$/g, '') || 'post';
  const getPostSlug = (post, index = 0) => {
    if (!post.dataset.slug) {
      const imgName = ($('img', post)?.getAttribute('src') || '').split('/').pop()?.replace(/\.[^.]+$/, '') || `post-${index + 1}`;
      post.dataset.slug = `${post.dataset.date || 'post'}-${slugify(imgName)}`;
    }
    return post.dataset.slug;
  };

  allPosts.forEach((post, index) => {
    postList.appendChild(post);
    getPostSlug(post, index);
    post.setAttribute('role', 'link');
    post.setAttribute('tabindex', '0');
    post.setAttribute('aria-label', `打开文章：${post.dataset.title || $('h3', post)?.textContent || '图片分享'}`);
  });
  $('#articleTotalText') && ($('#articleTotalText').textContent = `共 ${allPosts.length} 篇文章`);
  $('#articleCount') && ($('#articleCount').textContent = String(allPosts.length));

  const getFiltered = () => {
    const keyword = ($('#searchInput')?.value || '').trim().toLowerCase();
    return allPosts.filter((post) => {
      const matchFilter = currentFilter === 'all' || post.dataset.category === currentFilter || (post.dataset.tags || '').includes(currentFilter);
      const text = `${post.dataset.title} ${post.dataset.category} ${post.dataset.tags} ${post.textContent}`.toLowerCase();
      return matchFilter && (!keyword || text.includes(keyword));
    });
  };
  const renderPagination = (count) => {
    const pages = Math.max(1, Math.ceil(count / CONFIG.postsPerPage));
    currentPage = Math.min(currentPage, pages);
    if (!pagination) return;
    pagination.innerHTML = '';
    const addBtn = (label, page, disabled = false, active = false) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = active ? 'page-number active' : (Number.isInteger(page) ? 'page-number' : 'page-btn');
      btn.textContent = label;
      btn.disabled = disabled;
      btn.addEventListener('click', () => { currentPage = page; renderPosts(); $('#posts')?.scrollIntoView({ behavior: 'smooth' }); });
      pagination.appendChild(btn);
    };
    addBtn('上一页', currentPage - 1, currentPage <= 1);
    for (let page = 1; page <= pages; page += 1) addBtn(String(page), page, false, page === currentPage);
    addBtn('下一页', currentPage + 1, currentPage >= pages);
  };
  function renderPosts() {
    const filtered = getFiltered();
    const start = (currentPage - 1) * CONFIG.postsPerPage;
    const end = start + CONFIG.postsPerPage;
    const visiblePosts = filtered.slice(start, end);
    allPosts.forEach((post) => post.classList.add('hidden'));
    filtered.forEach((post, index) => {
      post.classList.toggle('hidden', index < start || index >= end);
    });
    postList?.classList.toggle('single-card', visiblePosts.length === 1);
    renderPagination(filtered.length);
  }
  const setFilter = (filter) => {
    showList(false);
    currentFilter = filter;
    currentPage = 1;
    $$('.tool-btn[data-filter]').forEach((btn) => btn.classList.toggle('active', btn.dataset.filter === filter));
    renderPosts();
  };

  $$('.tool-btn[data-filter]').forEach((btn) => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));
  $('#searchInput')?.addEventListener('input', () => { showList(false); currentPage = 1; renderPosts(); });
  $('#randomPostBtn')?.addEventListener('click', () => {
    const list = getFiltered();
    const post = list[Math.floor(Math.random() * list.length)];
    if (post) openArticle(post);
  });

  function renderStats() {
    const categories = new Map();
    const tags = new Map();
    allPosts.forEach((post) => {
      categories.set(post.dataset.category, (categories.get(post.dataset.category) || 0) + 1);
      (post.dataset.tags || '').split(',').filter(Boolean).forEach((tag) => tags.set(tag, (tags.get(tag) || 0) + 1));
    });
    $('#categoryStats').innerHTML = [...categories].map(([name, count]) => `<button class="category-item" type="button" data-stat-filter="${safeText(name)}"><span>${safeText(name)}</span><span class="count-badge">${count}</span></button>`).join('');
    $('#tagStats').innerHTML = [...tags].map(([name, count]) => `<button class="tag-stat" type="button" data-stat-filter="${safeText(name)}">#${safeText(name)} <small>${count}</small></button>`).join('');
  }
  renderStats();
  document.addEventListener('click', (event) => {
    const stat = event.target.closest('[data-stat-filter]');
    if (stat) { setFilter(stat.dataset.statFilter); $('#posts')?.scrollIntoView({ behavior: 'smooth' }); }
  });

  function showList(push = true) {
    contentArea?.classList.remove('detail-mode');
    detailPage?.classList.add('hidden');
    renderPosts();
    if (push && new URLSearchParams(location.search).has('post')) {
      history.pushState({ post: null }, '', location.pathname + location.hash);
    }
  }

  function openArticle(post, push = true) {
    if (!post || !detailPage) return;
    const slug = getPostSlug(post, allPosts.indexOf(post));
    const img = $('img', post)?.src || '';
    const title = $('h3', post)?.textContent || post.dataset.title || '图片分享';
    const date = post.dataset.date || '';
    const category = post.dataset.category || '';
    const tagsHtml = $('.tags', post)?.innerHTML || '';
    const body = $('p', post)?.textContent.trim() || '';
    const link = post.dataset.link || '';
    const linkHtml = link ? `<a class="single-post-link" href="${safeText(link)}" target="_blank" rel="noopener noreferrer">${safeText(link)}</a>` : '';
    detailPage.innerHTML = `
      <article class="single-post-card">
        <button class="single-back" type="button" id="postDetailBack">← 返回文章列表</button>
        <div class="single-post-head">
          <div class="single-post-kicker"><span>图片记录</span><span>1 分钟</span></div>
          <h1>${safeText(title)}</h1>
          <div class="single-meta"><span>日期 ${safeText(date)}</span><span>分类 ${safeText(category)}</span></div>
        </div>
        <img class="single-post-img" src="${img}" alt="${safeText(title)}" />
        <div class="single-post-content">
          ${body ? `<p>${safeText(body)}</p>` : '<p class="empty-post-text">这是一张图片分享。</p>'}
          ${linkHtml ? `<div class="single-link-box"><span>原链接</span>${linkHtml}</div>` : ''}
          <div class="tags">${tagsHtml}</div>
        </div>
      </article>`;
    contentArea?.classList.add('detail-mode');
    allPosts.forEach((item) => item.classList.add('hidden'));
    pagination && (pagination.innerHTML = '');
    $('#postDetailBack')?.addEventListener('click', () => { showList(true); $('#posts')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    if (push) history.pushState({ post: slug }, '', `${location.pathname}?post=${encodeURIComponent(slug)}`);
    $('#posts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  allPosts.forEach((post) => {
    post.addEventListener('click', () => openArticle(post));
    post.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openArticle(post); }
    });
  });

  $('#galleryOpen')?.addEventListener('click', () => {
    $('#galleryGrid').innerHTML = allPosts.map((post, index) => {
      const img = $('img', post)?.src || '';
      const title = $('h3', post)?.textContent || post.dataset.title;
      return `<button class="gallery-item" type="button" data-gallery-index="${index}"><img src="${img}" alt="${safeText(title)}" /><span>${safeText(title)} · ${post.dataset.date}</span></button>`;
    }).join('');
    openModal('#galleryModal');
  });
  $('#galleryGrid')?.addEventListener('click', (event) => {
    const item = event.target.closest('[data-gallery-index]');
    if (!item) return;
    closeModal($('#galleryModal'));
    openArticle(allPosts[Number(item.dataset.galleryIndex)]);
  });
  renderPosts();
  const openFromUrl = () => {
    const slug = new URLSearchParams(location.search).get('post');
    if (!slug) { showList(false); return; }
    const post = allPosts.find((item) => getPostSlug(item) === slug);
    if (post) openArticle(post, false);
  };
  window.addEventListener('popstate', openFromUrl);
  openFromUrl();
}


/* 09 Init */
function initModals() {
  $$('[data-close-modal]').forEach((btn) => btn.addEventListener('click', () => closeModal(btn.closest('.modal'))));
  $$('.modal').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal); }));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') $$('.modal.show').forEach(closeModal); });
  $('#notice')?.addEventListener('click', (event) => { if (!event.target.closest('a')) openModal('#noticeModal'); });
}

function initFooterStats() {
  const days = Math.max(1, Math.ceil((Date.now() - new Date(CONFIG.siteStartDate).getTime()) / 86400000));
  const articleCount = $$('.post').length;
  $('#runFooter') && ($('#runFooter').textContent = String(days));
  $('#lastVisit') && ($('#lastVisit').textContent = '2026-06-10');
  $('#siteInfoArticleCount') && ($('#siteInfoArticleCount').textContent = String(articleCount));
  $('#siteInfoRunDays') && ($('#siteInfoRunDays').textContent = String(days));
}

document.addEventListener('DOMContentLoaded', () => {
  initThemePalette();
  initTyping();
  initStars();
  initMeteors();
  initNavigation();
  initMusic();
  initPostsGallery();
  initModals();
  initFooterStats();
});
