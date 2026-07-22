// ---------- mobile nav ----------
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  if(menuBtn && mainNav){
    menuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
    // mobile: tap a nav item with a dropdown to expand instead of navigating away
    document.querySelectorAll('.navitem').forEach(item => {
      const trigger = item.querySelector(':scope > span');
      if(trigger){
        trigger.addEventListener('click', (e) => {
          if(window.innerWidth <= 920){
            e.preventDefault();
            item.classList.toggle('expanded');
          }
        });
      }
    });
  }

  // ---------- scroll reveal for cards ----------
  const cards = document.querySelectorAll('.card');
  if(cards.length){
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach(c => cardObserver.observe(c));
  }

  // ---------- radial gauges ----------
  const gauges = document.querySelectorAll('.gauge-fill');
  if(gauges.length){
    const gaugeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const pct = Number(entry.target.dataset.pct);
          const circumference = 283;
          entry.target.style.strokeDashoffset = circumference - (circumference * pct / 100);
          gaugeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    gauges.forEach(g => gaugeObserver.observe(g));
  }

  // ---------- hud bars ----------
  const hudBars = document.querySelectorAll('.hud-bar-fill');
  hudBars.forEach(b => { b.style.width = (b.dataset.pct || 0) + '%'; });

  // ---------- copy buttons on code blocks ----------
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeEl = btn.closest('.codebox').querySelector('code');
      if(codeEl){
        navigator.clipboard.writeText(codeEl.textContent.trim()).then(() => {
          const original = btn.textContent;
          btn.textContent = 'کپی شد ✓';
          setTimeout(() => { btn.textContent = original; }, 1500);
        }).catch(() => {});
      }
    });
  });

  // ---------- live telemetry strip ----------
  const telemetryTrack = document.getElementById('telemetryTrack');
  if(telemetryTrack){
    const items = JSON.parse(telemetryTrack.dataset.items || '[]');
    // duplicate the list so the CSS scroll animation loops seamlessly
    const renderItems = (list) => list.map(it =>
      `<span><span class="dot"></span>${it}</span>`
    ).join('');
    telemetryTrack.innerHTML = renderItems(items) + renderItems(items);
  }

  // ---------- animated circuit field ----------
  document.querySelectorAll('.circuit-field').forEach(field => {
    animateCircuitField(field);
  });
});

function animateCircuitField(field){
  const svg = field.querySelector('svg');
  if(!svg) return;
  const pulses = svg.querySelectorAll('.pulse');
  const paths = svg.querySelectorAll('.trace');
  pulses.forEach((pulse, i) => {
    const path = paths[i % paths.length];
    if(!path) return;
    const len = path.getTotalLength();
    let progress = Math.random();
    const speed = 0.0015 + Math.random() * 0.001;
    function step(){
      progress += speed;
      if(progress > 1.15){ progress = -0.15; }
      const clamped = Math.max(0, Math.min(1, progress));
      const point = path.getPointAtLength(clamped * len);
      pulse.setAttribute('cx', point.x);
      pulse.setAttribute('cy', point.y);
      pulse.setAttribute('opacity', (progress >= 0 && progress <= 1) ? 0.9 : 0);
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ---------- small numeric ticker used on some pages (e.g. live sensor demo) ----------
function tickerJitter(el, base, spread, unit, decimals){
  if(!el) return;
  function update(){
    const val = base + (Math.random() * 2 - 1) * spread;
    el.textContent = val.toFixed(decimals !== undefined ? decimals : 0) + (unit || '');
    setTimeout(update, 1200 + Math.random() * 900);
  }
  update();
}
