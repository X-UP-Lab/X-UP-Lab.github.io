/**
 * MeshSuite / MeshSplatBench Project Page Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initComparisonSlider();
  initBenchmarkTabs();
  initCodeTabs();
  initVideoTabs();
  initCopyButtons();
});

/* -------------------------------------------------------------
 * 1. 4-Way Image Split Slider (Standard -> Dedicated -> Non-Engine -> GT)
 * ------------------------------------------------------------- */
const QUAD_IMG_DATA = {
  '2dts': {
    name: '2DTS (Bonsai)',
    method: '2DTS (2D Triangle Splatting)',
    badgeClass: 'badge-2dts',
    standard: 'static/images/2dts/standard.png',
    dedicated: 'static/images/2dts/dedicated.png',
    non_engine: 'static/images/2dts/non-engine.png',
    gt: 'static/images/2dts/gt.png',
    hasStandard: true,
    explanation: '<strong>The Soup Deployment Collapse:</strong> 2DTS relies heavily on alpha blending of independent triangle facelets. In Standard Deployment with hardware Z-buffering, overlapping semi-transparent triangles degenerate into opaque black shards (15.6 dB drop). Dedicated Deployment recovers multi-pass alpha compositing.'
  },
  'triangle-splatting': {
    name: 'Triangle-Splatting (Treehill)',
    method: 'Triangle-Splatting',
    badgeClass: 'badge-ts',
    standard: 'static/images/triangle-splatting/standard.png',
    dedicated: 'static/images/triangle-splatting/dedicated.png',
    non_engine: 'static/images/triangle-splatting/non-engine.png',
    gt: 'static/images/triangle-splatting/gt.png',
    hasStandard: true,
    explanation: '<strong>Foliage & Transparency Loss:</strong> Triangle-Splatting uses learned continuous opacity. Under Standard Deployment, fine leaves and tree branches become thick solid geometric occluders (12.4 dB drop). Dedicated Deployment in Unity restores view-dependent spherical harmonics and soft window coverage.'
  },
  'mesh-splatting': {
    name: 'MeshSplatting (Garden)',
    method: 'MeshSplatting',
    badgeClass: 'badge-ms',
    standard: 'static/images/mesh-splatting/standard.png',
    dedicated: 'static/images/mesh-splatting/dedicated.png',
    non_engine: 'static/images/mesh-splatting/non-engine.png',
    gt: 'static/images/mesh-splatting/gt.png',
    hasStandard: true,
    explanation: '<strong>Indexed Delaunay Mesh:</strong> MeshSplatting features explicit shared vertex indexing and per-vertex colors, losing the least quality (4.9 dB) under Standard Deployment among the studied methods. However, its meshes suffer severe topological defects (over 65% non-manifold vertices).'
  },
  'diffsoup': {
    name: 'DiffSoup (Bicycle)',
    method: 'DiffSoup',
    badgeClass: 'badge-ds',
    standard: '',
    dedicated: 'static/images/diffsoup/dedicated.png',
    non_engine: 'static/images/diffsoup/non-engine.png',
    gt: 'static/images/diffsoup/gt.png',
    hasStandard: false,
    explanation: '<strong>Neural Texture In-Shader Decoding:</strong> DiffSoup encodes appearance as latent features decoded by a neural micro-MLP. Standard Deployment is completely unsupported (N/A). Our Dedicated Deployment implements an optimized compute shader in Unity, recovering 23.15 dB at nearly 2000 FPS.'
  }
};

function initComparisonSlider() {
  const canvas = document.getElementById('quad-img-canvas');
  if (!canvas) return;

  const imgStd = document.getElementById('img-view-std');
  const imgDed = document.getElementById('img-view-ded');
  const imgNe = document.getElementById('img-view-ne');
  const imgGt = document.getElementById('img-view-gt');

  const layerStd = document.getElementById('img-layer-std');

  const div1 = document.getElementById('img-divider-1');
  const div2 = document.getElementById('img-divider-2');
  const div3 = document.getElementById('img-divider-3');

  const badgeStd = document.getElementById('img-badge-std');
  const badgeDed = document.getElementById('img-badge-ded');
  const badgeNe = document.getElementById('img-badge-ne');
  const badgeGt = document.getElementById('img-badge-gt');

  const statusBadge = document.getElementById('img-status-badge');
  const diffsoupNote = document.getElementById('img-diffsoup-note');

  const sceneBadge = document.getElementById('img-scene-badge');
  const sceneText = document.getElementById('img-scene-text');

  const methodTabs = document.querySelectorAll('.img-method-tab');
  const presetBtns = document.querySelectorAll('.img-preset-btn');
  const viewModeBtns = document.querySelectorAll('.img-view-mode-btn');

  const sliderView = document.getElementById('quad-img-canvas');
  const gridView = document.getElementById('quad-grid-view');

  const gridStd = document.getElementById('grid-col-img-std');
  const gridDed = document.getElementById('grid-col-img-ded');
  const gridNe = document.getElementById('grid-col-img-ne');
  const gridGt = document.getElementById('grid-col-img-gt');
  const gridColStd = document.getElementById('grid-col-std');

  const resetBtn = document.getElementById('img-reset-btn');
  const fullscreenBtn = document.getElementById('img-fullscreen-btn');

  let currentMethod = '2dts';
  let x1 = 25.0;
  let x2 = 50.0;
  let x3 = 75.0;
  let isDragging = null; // 1, 2, or 3

  function updateDividers(newX1, newX2, newX3) {
    const hasStd = QUAD_IMG_DATA[currentMethod].hasStandard;

    if (!hasStd) {
      x1 = 0;
      x2 = Math.max(2, Math.min(newX2, (newX3 || x3) - 2));
      x3 = Math.max(x2 + 2, Math.min(newX3, 98));
    } else {
      x1 = Math.max(0, Math.min(newX1, (newX2 || x2) - 2));
      x2 = Math.max(x1 + 2, Math.min(newX2, (newX3 || x3) - 2));
      x3 = Math.max(x2 + 2, Math.min(newX3, 100));
    }

    canvas.style.setProperty('--img-x1', `${x1}%`);
    canvas.style.setProperty('--img-x2', `${x2}%`);
    canvas.style.setProperty('--img-x3', `${x3}%`);

    if (div1) {
      div1.style.left = `${x1}%`;
      div1.style.display = hasStd ? 'block' : 'none';
    }
    if (div2) {
      div2.style.left = `${x2}%`;
      div2.style.display = 'block';
    }
    if (div3) {
      div3.style.left = `${x3}%`;
      div3.style.display = 'block';
    }

    if (badgeStd) {
      badgeStd.style.left = `${x1 / 2}%`;
      badgeStd.style.opacity = (hasStd && x1 > 6) ? '1' : '0';
      badgeStd.style.display = hasStd ? 'flex' : 'none';
    }
    if (badgeDed) {
      badgeDed.style.left = `${(x1 + x2) / 2}%`;
      badgeDed.style.opacity = ((x2 - x1) > 6) ? '1' : '0';
    }
    if (badgeNe) {
      badgeNe.style.left = `${(x2 + x3) / 2}%`;
      badgeNe.style.opacity = ((x3 - x2) > 6) ? '1' : '0';
    }
    if (badgeGt) {
      badgeGt.style.left = `${(x3 + 100) / 2}%`;
      badgeGt.style.opacity = ((100 - x3) > 6) ? '1' : '0';
    }
  }

  function loadMethod(methodKey) {
    currentMethod = methodKey;
    const data = QUAD_IMG_DATA[methodKey];
    if (!data) return;

    if (data.hasStandard) {
      if (layerStd) layerStd.style.display = 'block';
      if (gridColStd) gridColStd.style.display = 'flex';
      if (imgStd) imgStd.src = data.standard;
      if (gridStd) gridStd.src = data.standard;

      if (statusBadge) {
        statusBadge.textContent = 'Standard → Dedicated → Non-Engine → GT';
      }
      if (diffsoupNote) diffsoupNote.style.display = 'none';
      updateDividers(25.0, 50.0, 75.0);
    } else {
      // DiffSoup: Standard N/A
      if (layerStd) layerStd.style.display = 'none';
      if (gridColStd) gridColStd.style.display = 'none';

      if (statusBadge) {
        statusBadge.textContent = 'Dedicated → Non-Engine → GT (Standard N/A)';
      }
      if (diffsoupNote) diffsoupNote.style.display = 'block';
      updateDividers(0, 33.33, 66.66);
    }

    if (imgDed) imgDed.src = data.dedicated;
    if (imgNe) imgNe.src = data.non_engine;
    if (imgGt) imgGt.src = data.gt;

    if (gridDed) gridDed.src = data.dedicated;
    if (gridNe) gridNe.src = data.non_engine;
    if (gridGt) gridGt.src = data.gt;

    if (sceneBadge) {
      sceneBadge.className = `badge ${data.badgeClass}`;
      sceneBadge.textContent = data.method;
    }
    if (sceneText) {
      sceneText.innerHTML = data.explanation;
    }
  }

  // Method Tabs Click
  methodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      methodTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadMethod(tab.getAttribute('data-method'));

      // Reset preset active state to quad-split
      presetBtns.forEach(p => p.classList.remove('active'));
      const defPreset = document.querySelector('.img-preset-btn[data-preset="quad-split"]');
      if (defPreset) defPreset.classList.add('active');
    });
  });

  // Presets
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = btn.getAttribute('data-preset');
      const hasStd = QUAD_IMG_DATA[currentMethod].hasStandard;

      if (!hasStd) {
        // DiffSoup: 3 zones
        if (preset === 'quad-split') updateDividers(0, 33.33, 66.66);
        else if (preset === 'ded-vs-ne') updateDividers(0, 50.0, 100.0);
        else if (preset === 'ne-vs-gt') updateDividers(0, 0.0, 50.0);
        else if (preset === 'full-ded') updateDividers(0, 100.0, 100.0);
        else if (preset === 'full-ne') updateDividers(0, 0.0, 100.0);
        else if (preset === 'full-gt') updateDividers(0, 0.0, 0.0);
        return;
      }

      switch (preset) {
        case 'quad-split':
          updateDividers(25.0, 50.0, 75.0);
          break;
        case 'std-vs-ded':
          updateDividers(50.0, 100.0, 100.0);
          break;
        case 'ded-vs-ne':
          updateDividers(0.0, 50.0, 100.0);
          break;
        case 'ne-vs-gt':
          updateDividers(0.0, 0.0, 50.0);
          break;
        case 'full-std':
          updateDividers(100.0, 100.0, 100.0);
          break;
        case 'full-ded':
          updateDividers(0.0, 100.0, 100.0);
          break;
        case 'full-ne':
          updateDividers(0.0, 0.0, 100.0);
          break;
        case 'full-gt':
          updateDividers(0.0, 0.0, 0.0);
          break;
      }
    });
  });

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      const defPreset = document.querySelector('.img-preset-btn[data-preset="quad-split"]');
      if (defPreset) defPreset.classList.add('active');

      if (QUAD_IMG_DATA[currentMethod].hasStandard) {
        updateDividers(25.0, 50.0, 75.0);
      } else {
        updateDividers(0, 33.33, 66.66);
      }
    });
  }

  // View Mode Buttons (Slider vs Grid)
  viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');
      if (mode === 'grid') {
        sliderView.style.display = 'none';
        gridView.style.display = 'grid';
      } else {
        sliderView.style.display = 'block';
        gridView.style.display = 'none';
      }
    });
  });

  // Divider Dragging Logic
  function handleDragStart(clientX) {
    const rect = canvas.getBoundingClientRect();
    const clickPct = ((clientX - rect.left) / rect.width) * 100;
    const hasStd = QUAD_IMG_DATA[currentMethod].hasStandard;

    if (!hasStd) {
      const dist2 = Math.abs(clickPct - x2);
      const dist3 = Math.abs(clickPct - x3);
      if (dist2 <= dist3) {
        isDragging = 2;
        updateDividers(0, clickPct, x3);
      } else {
        isDragging = 3;
        updateDividers(0, x2, clickPct);
      }
      return;
    }

    const dist1 = Math.abs(clickPct - x1);
    const dist2 = Math.abs(clickPct - x2);
    const dist3 = Math.abs(clickPct - x3);

    if (dist1 <= dist2 && dist1 <= dist3) {
      isDragging = 1;
      updateDividers(clickPct, x2, x3);
    } else if (dist2 <= dist1 && dist2 <= dist3) {
      isDragging = 2;
      updateDividers(x1, clickPct, x3);
    } else {
      isDragging = 3;
      updateDividers(x1, x2, clickPct);
    }
  }

  function handleDragMove(clientX) {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const movePct = ((clientX - rect.left) / rect.width) * 100;

    if (isDragging === 1) {
      updateDividers(movePct, x2, x3);
    } else if (isDragging === 2) {
      updateDividers(x1, movePct, x3);
    } else if (isDragging === 3) {
      updateDividers(x1, x2, movePct);
    }
  }

  function handleDragEnd() {
    if (isDragging) {
      isDragging = null;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  }

  // Mouse Listeners
  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
    handleDragStart(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      handleDragMove(e.clientX);
    }
  });

  window.addEventListener('mouseup', handleDragEnd);

  // Touch Listeners
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      e.preventDefault();
      handleDragStart(e.touches[0].clientX);
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length > 0) {
      e.preventDefault();
      handleDragMove(e.touches[0].clientX);
    }
  }, { passive: false });

  window.addEventListener('touchend', handleDragEnd);

  // Fullscreen
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (canvas.requestFullscreen) canvas.requestFullscreen();
        else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  // Initial load
  loadMethod('2dts');
}

/* -------------------------------------------------------------
 * 2. Benchmark Table Tabs
 * ------------------------------------------------------------- */
function initBenchmarkTabs() {
  const tabs = document.querySelectorAll('.table-tab');
  const contents = document.querySelectorAll('.benchmark-table-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.style.display = 'none');

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
      }
    });
  });
}

/* -------------------------------------------------------------
 * 3. Code Tabs
 * ------------------------------------------------------------- */
function initCodeTabs() {
  const tabs = document.querySelectorAll('.code-tab-btn');
  const blocks = document.querySelectorAll('.code-block-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      blocks.forEach(b => b.style.display = 'none');

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-code');
      const targetBlock = document.getElementById(targetId);
      if (targetBlock) {
        targetBlock.style.display = 'block';
      }
    });
  });
}

/* -------------------------------------------------------------
 * 4. 3-Way Video Split Slider (Standard -> Dedicated -> Non-Engine)
 * ------------------------------------------------------------- */
const TRI_VIDEO_DATA = {
  '2dts': {
    name: '2DTS (Bicycle)',
    standard: 'static/videos/2dts/standard.mp4',
    dedicated: 'static/videos/2dts/dedicated.mp4',
    non_engine: 'static/videos/2dts/non-engine.mp4',
    hasStandard: true
  },
  'triangle-splatting': {
    name: 'Triangle-Splatting (Bonsai)',
    standard: 'static/videos/triangle-splatting/standard.mp4',
    dedicated: 'static/videos/triangle-splatting/dedicated.mp4',
    non_engine: 'static/videos/triangle-splatting/non-engine.mp4',
    hasStandard: true
  },
  'mesh-splatting': {
    name: 'MeshSplatting (Garden)',
    standard: 'static/videos/mesh-splatting/standard.mp4',
    dedicated: 'static/videos/mesh-splatting/dedicated.mp4',
    non_engine: 'static/videos/mesh-splatting/non-engine.mp4',
    hasStandard: true
  },
  'diffsoup': {
    name: 'DiffSoup (Stump)',
    standard: '',
    dedicated: 'static/videos/diffsoup/dedicated.mp4',
    non_engine: 'static/videos/diffsoup/non-engine.mp4',
    hasStandard: false
  }
};

function initVideoTabs() {
  const canvas = document.getElementById('tri-video-canvas');
  if (!canvas) return;

  const vStd = document.getElementById('tri-vid-std');
  const vDed = document.getElementById('tri-vid-ded');
  const vNe = document.getElementById('tri-vid-ne');
  const layerStd = document.getElementById('tri-layer-std');

  const div1 = document.getElementById('tri-divider-1');
  const div2 = document.getElementById('tri-divider-2');

  const badgeStd = document.getElementById('tri-badge-std');
  const badgeDed = document.getElementById('tri-badge-ded');
  const badgeNe = document.getElementById('tri-badge-ne');

  const statusBadge = document.getElementById('tri-video-status-badge');
  const diffsoupNote = document.getElementById('diffsoup-note');

  const playBtn = document.getElementById('tri-play-btn');
  const playIcon = document.getElementById('tri-play-icon');
  const seekBar = document.getElementById('tri-seek-bar');
  const timeDisplay = document.getElementById('tri-time-display');
  const muteBtn = document.getElementById('tri-mute-btn');
  const muteIcon = document.getElementById('tri-mute-icon');
  const speedSelect = document.getElementById('tri-speed-select');
  const fullscreenBtn = document.getElementById('tri-fullscreen-btn');

  const methodTabs = document.querySelectorAll('.tri-method-tab');
  const presetBtns = document.querySelectorAll('.tri-preset-btn');

  let currentMethod = '2dts';
  let x1 = 33.33;
  let x2 = 66.66;
  let isDragging = null; // 1 or 2

  const getMaster = () => {
    return (!TRI_VIDEO_DATA[currentMethod].hasStandard) ? vDed : vStd;
  };

  const getActiveVideos = () => {
    return (!TRI_VIDEO_DATA[currentMethod].hasStandard) ? [vDed, vNe] : [vStd, vDed, vNe];
  };

  function updateDividers(newX1, newX2) {
    const hasStd = TRI_VIDEO_DATA[currentMethod].hasStandard;
    
    if (!hasStd) {
      x1 = 0;
      x2 = Math.max(2, Math.min(newX2, 98));
    } else {
      x1 = Math.max(0, Math.min(newX1, 98));
      x2 = Math.max(x1 + 2, Math.min(newX2, 100));
    }

    canvas.style.setProperty('--x1', `${x1}%`);
    canvas.style.setProperty('--x2', `${x2}%`);

    if (div1) {
      div1.style.left = `${x1}%`;
      div1.style.display = hasStd ? 'block' : 'none';
    }
    if (div2) {
      div2.style.left = `${x2}%`;
      div2.style.display = 'block';
    }

    if (badgeStd) {
      badgeStd.style.left = `${x1 / 2}%`;
      badgeStd.style.opacity = (hasStd && x1 > 8) ? '1' : '0';
      badgeStd.style.display = hasStd ? 'flex' : 'none';
    }
    if (badgeDed) {
      badgeDed.style.left = `${(x1 + x2) / 2}%`;
      badgeDed.style.opacity = ((x2 - x1) > 8) ? '1' : '0';
    }
    if (badgeNe) {
      badgeNe.style.left = `${(x2 + 100) / 2}%`;
      badgeNe.style.opacity = ((100 - x2) > 8) ? '1' : '0';
    }
  }

  function loadMethod(methodKey) {
    currentMethod = methodKey;
    const data = TRI_VIDEO_DATA[methodKey];
    if (!data) return;

    if (data.hasStandard) {
      if (layerStd) layerStd.style.display = 'block';
      if (vStd) {
        vStd.src = data.standard;
        vStd.load();
      }
      if (statusBadge) {
        statusBadge.textContent = 'Standard → Dedicated → Non-Engine';
      }
      if (diffsoupNote) diffsoupNote.style.display = 'none';
      updateDividers(33.33, 66.66);
    } else {
      // DiffSoup case
      if (layerStd) layerStd.style.display = 'none';
      if (statusBadge) {
        statusBadge.textContent = 'Dedicated → Non-Engine (Standard N/A)';
      }
      if (diffsoupNote) diffsoupNote.style.display = 'block';
      updateDividers(0, 50.0);
    }

    if (vDed) {
      vDed.src = data.dedicated;
      vDed.load();
    }
    if (vNe) {
      vNe.src = data.non_engine;
      vNe.load();
    }

    // Play all muted
    const active = getActiveVideos();
    active.forEach(v => {
      v.muted = true;
      v.currentTime = 0;
      v.play().catch(() => {});
    });

    if (playIcon) {
      playIcon.className = 'fa-solid fa-pause';
    }
  }

  // Method Tab Click
  methodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      methodTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadMethod(tab.getAttribute('data-method'));

      // Reset preset active state to 3-way
      presetBtns.forEach(p => p.classList.remove('active'));
      const defPreset = document.querySelector('[data-preset="three-way"]');
      if (defPreset) defPreset.classList.add('active');
    });
  });

  // Preset Splits
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = btn.getAttribute('data-preset');
      const hasStd = TRI_VIDEO_DATA[currentMethod].hasStandard;

      if (!hasStd) {
        // DiffSoup only has 2 zones
        if (preset === 'three-way' || preset === 'ded-vs-ne') updateDividers(0, 50);
        else if (preset === 'full-ded') updateDividers(0, 100);
        else if (preset === 'full-ne') updateDividers(0, 0);
        return;
      }

      switch (preset) {
        case 'three-way':
          updateDividers(33.33, 66.66);
          break;
        case 'std-vs-ded':
          updateDividers(50.0, 100.0);
          break;
        case 'ded-vs-ne':
          updateDividers(0.0, 50.0);
          break;
        case 'full-std':
          updateDividers(100.0, 100.0);
          break;
        case 'full-ded':
          updateDividers(0.0, 100.0);
          break;
        case 'full-ne':
          updateDividers(0.0, 0.0);
          break;
      }
    });
  });

  // Divider Dragging Logic
  function handleDragStart(clientX) {
    const rect = canvas.getBoundingClientRect();
    const clickPct = ((clientX - rect.left) / rect.width) * 100;
    const hasStd = TRI_VIDEO_DATA[currentMethod].hasStandard;

    if (!hasStd) {
      isDragging = 2;
      return;
    }

    const dist1 = Math.abs(clickPct - x1);
    const dist2 = Math.abs(clickPct - x2);

    if (dist1 <= dist2) {
      isDragging = 1;
      updateDividers(clickPct, x2);
    } else {
      isDragging = 2;
      updateDividers(x1, clickPct);
    }
  }

  function handleDragMove(clientX) {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const movePct = ((clientX - rect.left) / rect.width) * 100;

    if (isDragging === 1) {
      updateDividers(movePct, x2);
    } else if (isDragging === 2) {
      updateDividers(x1, movePct);
    }
  }

  function handleDragEnd() {
    if (isDragging) {
      isDragging = null;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  }

  // Mouse Listeners
  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
    handleDragStart(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      handleDragMove(e.clientX);
    }
  });

  window.addEventListener('mouseup', handleDragEnd);

  // Touch Listeners
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      e.preventDefault();
      handleDragStart(e.touches[0].clientX);
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length > 0) {
      e.preventDefault();
      handleDragMove(e.touches[0].clientX);
    }
  }, { passive: false });

  window.addEventListener('touchend', handleDragEnd);

  // Synchronized Video Playback Engine
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function syncVideos() {
    const master = getMaster();
    if (!master || isNaN(master.duration)) return;

    const curTime = master.currentTime;
    const dur = master.duration;

    // Update progress bar
    if (seekBar && !seekBar.matches(':active')) {
      seekBar.value = (curTime / dur) * 100;
    }

    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(curTime)} / ${formatTime(dur)}`;
    }

    // Sync other videos to master if drift exceeds threshold (0.05s)
    const active = getActiveVideos();
    active.forEach(v => {
      if (v !== master && Math.abs(v.currentTime - curTime) > 0.05) {
        v.currentTime = curTime;
      }
    });
  }

  [vStd, vDed, vNe].forEach(v => {
    if (!v) return;
    v.addEventListener('timeupdate', () => {
      if (v === getMaster()) {
        syncVideos();
      }
    });

    v.addEventListener('ended', () => {
      const active = getActiveVideos();
      active.forEach(vid => {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      });
    });
  });

  // Play / Pause toggle
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const master = getMaster();
      const active = getActiveVideos();

      if (master.paused) {
        active.forEach(v => v.play().catch(() => {}));
        if (playIcon) playIcon.className = 'fa-solid fa-pause';
      } else {
        active.forEach(v => v.pause());
        if (playIcon) playIcon.className = 'fa-solid fa-play';
      }
    });
  }

  // Seek bar
  if (seekBar) {
    seekBar.addEventListener('input', () => {
      const master = getMaster();
      if (!master || isNaN(master.duration)) return;

      const targetTime = (seekBar.value / 100) * master.duration;
      const active = getActiveVideos();
      active.forEach(v => {
        v.currentTime = targetTime;
      });
    });
  }

  // Mute / Unmute
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const master = getMaster();
      const newMuted = !master.muted;
      const active = getActiveVideos();
      active.forEach(v => {
        v.muted = newMuted;
      });

      if (muteIcon) {
        muteIcon.className = newMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
      }
      muteBtn.innerHTML = `<i class="${newMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high'}"></i> ${newMuted ? 'Muted' : 'Sound On'}`;
    });
  }

  // Playback Speed
  if (speedSelect) {
    speedSelect.addEventListener('change', (e) => {
      const rate = parseFloat(e.target.value);
      const active = getActiveVideos();
      active.forEach(v => {
        v.playbackRate = rate;
      });
    });
  }

  // Fullscreen
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (canvas.requestFullscreen) canvas.requestFullscreen();
        else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  // Initialize first method
  loadMethod('2dts');
}

/* -------------------------------------------------------------
 * 5. Clipboard & Toast Notifications
 * ------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      let textToCopy = '';
      if (targetId === 'active-code-block') {
        const visibleCode = document.querySelector('.code-block-content:not([style*="none"]) code');
        if (visibleCode) textToCopy = visibleCode.innerText || visibleCode.textContent;
      } else if (targetId) {
        const targetElem = document.getElementById(targetId);
        if (targetElem) textToCopy = targetElem.innerText || targetElem.textContent;
      } else if (btn.getAttribute('data-copy-text')) {
        textToCopy = btn.getAttribute('data-copy-text');
      }

      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy.trim()).then(() => {
          showToast('Copied to clipboard!');
        }).catch(() => {
          showToast('Failed to copy');
        });
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}
