import React, { useRef, useEffect } from 'react';

// Preset color configurations for different fire styles
export const FIRE_TYPES = {
  classic: {
    id: 'classic',
    name: 'Classic Hearth',
    desc: 'Cozy split hardwood logs with golden-orange dancing flames',
    flameBase: [255, 60, 0],
    flameMid: [255, 145, 0],
    flameTip: [255, 220, 100],
    emberColor: [255, 170, 50],
    flameHeight: 1.0,
    flameWidth: 1.0,
    sparkRate: 1.0,
    smokeRate: 1.0,
    logStyle: 'split_hardwood',
  },
  embers: {
    id: 'embers',
    name: 'Deep Sleep Embers',
    desc: 'Low soothing glow, breathing crimson coals for restorative sleep',
    flameBase: [180, 20, 0],
    flameMid: [230, 70, 10],
    flameTip: [255, 160, 40],
    emberColor: [255, 90, 20],
    flameHeight: 0.45,
    flameWidth: 1.2,
    sparkRate: 0.35,
    smokeRate: 0.4,
    logStyle: 'charred_coals',
  },
  roaring: {
    id: 'roaring',
    name: 'Roaring Winter Hearth',
    desc: 'Energetic tall flames with intense crackling heat for cold nights',
    flameBase: [255, 40, 0],
    flameMid: [255, 130, 0],
    flameTip: [255, 245, 180],
    emberColor: [255, 200, 100],
    flameHeight: 1.45,
    flameWidth: 1.15,
    sparkRate: 2.2,
    smokeRate: 1.4,
    logStyle: 'stacked_heavy',
  },
  campfire: {
    id: 'campfire',
    name: 'Rustic Campfire',
    desc: 'Criss-cross pine logs with wide sparks drifting into the night sky',
    flameBase: [230, 50, 0],
    flameMid: [255, 160, 20],
    flameTip: [255, 235, 120],
    emberColor: [255, 180, 60],
    flameHeight: 1.1,
    flameWidth: 1.35,
    sparkRate: 1.8,
    smokeRate: 1.6,
    logStyle: 'teepee_pine',
  },
  gas: {
    id: 'gas',
    name: 'Modern Linear Gas',
    desc: 'Clean blue-to-amber ribbon flames over smooth river pebbles',
    flameBase: [30, 100, 255],
    flameMid: [255, 140, 20],
    flameTip: [255, 220, 150],
    emberColor: [100, 180, 255],
    flameHeight: 0.85,
    flameWidth: 1.4,
    sparkRate: 0.2,
    smokeRate: 0.1,
    logStyle: 'river_pebbles',
  },
  mystic: {
    id: 'mystic',
    name: 'Aurora Mystic Flame',
    desc: 'Enchanting celestial emerald and violet tones for meditation',
    flameBase: [140, 20, 255],
    flameMid: [0, 230, 180],
    flameTip: [240, 255, 180],
    emberColor: [80, 255, 200],
    flameHeight: 1.1,
    flameWidth: 1.05,
    sparkRate: 1.3,
    smokeRate: 0.8,
    logStyle: 'mystic_altar',
  },
};

export default function FireplaceCanvas({
  fireType = 'classic',
  glowIntensity = 0.85,
  glowWarmth = '#f97316',
  flameIntensity = 1.0,
  sparkDensity = 1.0,
  smokeDensity = 1.0,
  mantelStyle = 'stone', // 'stone', 'iron', 'wood', 'minimal'
  showHeatShimmer = true,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pools
    const flames = [];
    const embers = [];
    const smokeParticles = [];
    const maxFlames = 160;
    const maxEmbers = 180;
    const maxSmoke = 60;

    let time = 0;

    // Helper: create random flame particle
    const createFlame = (originX, originY, spreadX, currentType) => {
      const p = currentType || FIRE_TYPES[fireType] || FIRE_TYPES.classic;
      const hMult = p.flameHeight * flameIntensity;
      const wMult = p.flameWidth;

      return {
        x: originX + (Math.random() - 0.5) * spreadX * wMult,
        y: originY + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 3.5 + 2.5) * hMult,
        life: 0,
        maxLife: Math.random() * 35 + 30,
        size: (Math.random() * 26 + 18) * Math.min(1.5, Math.max(0.6, flameIntensity)),
        growth: -0.4,
        heat: 1.0,
        curve: (Math.random() - 0.5) * 0.08,
      };
    };

    // Helper: create ember spark particle
    const createEmber = (originX, originY, spreadX, currentType) => {
      const p = currentType || FIRE_TYPES[fireType] || FIRE_TYPES.classic;
      return {
        x: originX + (Math.random() - 0.5) * spreadX,
        y: originY + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3.2,
        vy: -(Math.random() * 4.0 + 1.8),
        size: Math.random() * 2.8 + 1.0,
        life: 0,
        maxLife: Math.random() * 90 + 50,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        wobbleAmp: Math.random() * 2.2 + 0.5,
        coolingRate: Math.random() * 0.008 + 0.005,
        brightness: 1.0,
      };
    };

    // Helper: create soft smoke puff
    const createSmoke = (originX, originY, spreadX) => {
      return {
        x: originX + (Math.random() - 0.5) * spreadX,
        y: originY - 60,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.5 + 1.0),
        size: Math.random() * 35 + 25,
        maxSize: Math.random() * 120 + 80,
        life: 0,
        maxLife: Math.random() * 120 + 90,
        opacity: Math.random() * 0.09 + 0.04,
      };
    };

    // Draw fireplace background architecture
    const drawArchitecture = (hearthW, hearthH, hearthX, hearthY, currentFlicker) => {
      // 1. Surrounding Room Darkness & Wall tone
      ctx.fillStyle = '#050302';
      ctx.fillRect(0, 0, width, height);

      // 2. Mantel / Surround Frame
      if (mantelStyle !== 'minimal') {
        const framePad = Math.max(40, width * 0.05);
        const outerX = hearthX - framePad;
        const outerY = hearthY - framePad - 20;
        const outerW = hearthW + framePad * 2;
        const outerH = hearthH + framePad + 20;

        if (mantelStyle === 'stone') {
          // Rustic stone mantel gradient
          const stoneGrad = ctx.createLinearGradient(outerX, outerY, outerX + outerW, outerY + outerH);
          stoneGrad.addColorStop(0, '#1c1713');
          stoneGrad.addColorStop(0.5, '#29221b');
          stoneGrad.addColorStop(1, '#18130f');
          ctx.fillStyle = stoneGrad;
          ctx.fillRect(outerX, outerY, outerW, outerH);

          // Stone block joints / texture lines
          ctx.strokeStyle = 'rgba(10, 8, 6, 0.7)';
          ctx.lineWidth = 3;
          for (let y = outerY; y < outerY + outerH; y += 45) {
            ctx.beginPath();
            ctx.moveTo(outerX, y);
            ctx.lineTo(outerX + outerW, y);
            ctx.stroke();
          }
        } else if (mantelStyle === 'iron') {
          // Nordic dark cast iron frame
          ctx.fillStyle = '#111214';
          ctx.fillRect(outerX, outerY, outerW, outerH);
          ctx.strokeStyle = '#22252a';
          ctx.lineWidth = 6;
          ctx.strokeRect(outerX, outerY, outerW, outerH);
        } else if (mantelStyle === 'wood') {
          // Rich cabin cedar/oak mantel
          const woodGrad = ctx.createLinearGradient(outerX, outerY, outerX, outerY + outerH);
          woodGrad.addColorStop(0, '#361e12');
          woodGrad.addColorStop(0.5, '#24140c');
          woodGrad.addColorStop(1, '#180d08');
          ctx.fillStyle = woodGrad;
          ctx.fillRect(outerX, outerY, outerW, outerH);
        }

        // Inner frame bevel / depth shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.lineWidth = 8;
        ctx.strokeRect(hearthX - 4, hearthY - 4, hearthW + 8, hearthH + 8);
      }

      // 3. Firebox Inner Chamber (Deep curved cavern)
      const fireboxGrad = ctx.createRadialGradient(
        hearthX + hearthW / 2,
        hearthY + hearthH * 0.7,
        10,
        hearthX + hearthW / 2,
        hearthY + hearthH * 0.5,
        hearthW * 0.75
      );
      // Dynamic inner reflection based on flame intensity
      const p = FIRE_TYPES[fireType] || FIRE_TYPES.classic;
      const r = Math.round(p.flameBase[0] * 0.25 * currentFlicker);
      const g = Math.round(p.flameBase[1] * 0.18 * currentFlicker);
      const b = Math.round(p.flameBase[2] * 0.15 * currentFlicker);

      fireboxGrad.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
      fireboxGrad.addColorStop(0.5, 'rgba(18, 9, 4, 0.95)');
      fireboxGrad.addColorStop(1, 'rgba(6, 3, 1, 1)');

      ctx.fillStyle = fireboxGrad;
      ctx.fillRect(hearthX, hearthY, hearthW, hearthH);

      // Backplate Soot Arch
      ctx.beginPath();
      ctx.ellipse(
        hearthX + hearthW / 2,
        hearthY + hearthH * 0.45,
        hearthW * 0.38,
        hearthH * 0.4,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(4, 2, 1, 0.85)';
      ctx.fill();

      // Hearth Floor Stone
      const floorGrad = ctx.createLinearGradient(
        hearthX,
        hearthY + hearthH,
        hearthX,
        hearthY + hearthH - 70
      );
      floorGrad.addColorStop(0, 'rgba(25, 15, 8, 0.9)');
      floorGrad.addColorStop(1, 'rgba(10, 5, 2, 0.2)');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(hearthX, hearthY + hearthH - 60, hearthW, 60);
    };

    // Draw Realistic Glowing Logs & Charcoal Bed
    const drawLogsAndCoals = (centerX, baseY, widthSpan, currentFlicker) => {
      const p = FIRE_TYPES[fireType] || FIRE_TYPES.classic;

      // 1. Deep Incandescent Charcoal Bed
      const coalGrad = ctx.createRadialGradient(
        centerX,
        baseY + 5,
        20,
        centerX,
        baseY + 5,
        widthSpan * 0.55
      );
      const coalHeat = Math.min(1.0, currentFlicker * flameIntensity);
      coalGrad.addColorStop(0, `rgba(${p.flameTip[0]}, ${p.flameTip[1] * 0.7}, 20, ${0.9 * coalHeat})`);
      coalGrad.addColorStop(0.35, `rgba(${p.flameMid[0]}, ${p.flameMid[1] * 0.5}, 10, ${0.75 * coalHeat})`);
      coalGrad.addColorStop(0.7, `rgba(${p.flameBase[0]}, 20, 0, ${0.5 * coalHeat})`);
      coalGrad.addColorStop(1, 'rgba(10, 3, 0, 0)');

      ctx.fillStyle = coalGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, baseY + 8, widthSpan * 0.45, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Ember Chunks
      const chunkCount = 18;
      for (let i = 0; i < chunkCount; i++) {
        const offX = Math.sin(i * 1.7) * (widthSpan * 0.36);
        const offY = Math.cos(i * 2.3) * 12 + 6;
        const radius = 6 + (i % 5) * 2.5;

        const pulse = 0.7 + Math.sin(time * 0.05 + i) * 0.3;
        ctx.fillStyle = `rgba(${p.emberColor[0]}, ${Math.round(p.emberColor[1] * pulse)}, 10, ${0.85 * coalHeat})`;
        ctx.beginPath();
        ctx.arc(centerX + offX, baseY + offY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Realistic Log Structures based on fire type
      if (p.logStyle === 'river_pebbles') {
        // Modern Linear Gas Fireplace: smooth dark river pebbles & lava glass
        const pebbleCount = 22;
        for (let i = 0; i < pebbleCount; i++) {
          const px = centerX - widthSpan * 0.42 + (i / pebbleCount) * (widthSpan * 0.84);
          const py = baseY + 12 + (i % 2) * 5;
          const pr = 14 + (i % 4) * 3;

          const pGrad = ctx.createRadialGradient(px - 3, py - 3, 2, px, py, pr);
          pGrad.addColorStop(0, '#3a3a42');
          pGrad.addColorStop(0.7, '#16171a');
          pGrad.addColorStop(1, '#090a0c');
          ctx.fillStyle = pGrad;

          ctx.beginPath();
          ctx.ellipse(px, py, pr, pr * 0.65, (i % 5) * 0.2 - 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }

      // Draw Main Logs (Background and Foreground cross-logs)
      ctx.save();

      // Rear Log 1 (angled left)
      drawSingleLog(
        ctx,
        centerX - widthSpan * 0.32,
        baseY - 18,
        centerX + widthSpan * 0.22,
        baseY - 26,
        28,
        p,
        currentFlicker,
        0.8
      );

      // Rear Log 2 (angled right)
      drawSingleLog(
        ctx,
        centerX - widthSpan * 0.18,
        baseY - 32,
        centerX + widthSpan * 0.35,
        baseY - 14,
        24,
        p,
        currentFlicker,
        0.75
      );

      // Foreground Split Hardwood Log (Heavy front log)
      drawSingleLog(
        ctx,
        centerX - widthSpan * 0.36,
        baseY + 4,
        centerX + widthSpan * 0.34,
        baseY + 2,
        34,
        p,
        currentFlicker,
        1.0
      );

      // Criss-Cross Top Burning Branch
      drawSingleLog(
        ctx,
        centerX - widthSpan * 0.15,
        baseY + 8,
        centerX + widthSpan * 0.12,
        baseY - 36,
        20,
        p,
        currentFlicker,
        1.1
      );

      ctx.restore();
    };

    // Helper: Draw single textured log with incandescent fissures
    const drawSingleLog = (c, x1, y1, x2, y2, thickness, p, currentFlicker, heatMult) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);
      const len = Math.hypot(dx, dy);

      c.save();
      c.translate(x1, y1);
      c.rotate(angle);

      // Bark Gradient
      const logGrad = c.createLinearGradient(0, -thickness / 2, 0, thickness / 2);
      logGrad.addColorStop(0, '#120b06');
      logGrad.addColorStop(0.25, '#22140c');
      logGrad.addColorStop(0.5, '#150d08');
      logGrad.addColorStop(0.75, '#1e110a');
      logGrad.addColorStop(1, '#0e0704');

      c.fillStyle = logGrad;
      c.beginPath();
      c.roundRect(0, -thickness / 2, len, thickness, thickness * 0.3);
      c.fill();

      // Deep fiery cracks/fissures in the wood
      const heat = Math.min(1.0, currentFlicker * heatMult * flameIntensity);
      c.strokeStyle = `rgba(${p.flameMid[0]}, ${p.flameMid[1]}, ${p.flameTip[2] * 0.3}, ${0.85 * heat})`;
      c.lineWidth = 2.5;

      // Draw jagged glowing fissures along the log body
      c.beginPath();
      for (let i = 15; i < len - 15; i += 22) {
        c.moveTo(i, -thickness * 0.2);
        c.lineTo(i + 8, thickness * 0.15);
        c.lineTo(i + 14, -thickness * 0.1);
      }
      c.stroke();

      // Glowing cut end of the log
      c.fillStyle = `rgba(${p.flameTip[0]}, ${p.flameTip[1] * 0.7}, 30, ${0.9 * heat})`;
      c.beginPath();
      c.ellipse(len, 0, thickness * 0.25, thickness * 0.45, 0, 0, Math.PI * 2);
      c.fill();

      // Outer bark ring on cut end
      c.strokeStyle = '#180e08';
      c.lineWidth = 3;
      c.stroke();

      c.restore();
    };

    // Draw Dynamic Ambient Room Glow & Hearth Floor Reflection
    const drawAmbientGlow = (hearthCenterX, hearthCenterY, currentFlicker) => {
      // Screen edge / whole room illumination glow
      const glowRadius = Math.max(width, height) * 0.75;
      const glowGrad = ctx.createRadialGradient(
        hearthCenterX,
        hearthCenterY,
        50,
        hearthCenterX,
        hearthCenterY,
        glowRadius
      );

      // Parse glowWarmth color hex to RGB
      let gr = 249, gg = 115, gb = 22;
      if (glowWarmth.startsWith('#') && glowWarmth.length === 7) {
        gr = parseInt(glowWarmth.slice(1, 3), 16);
        gg = parseInt(glowWarmth.slice(3, 5), 16);
        gb = parseInt(glowWarmth.slice(5, 7), 16);
      }

      const alpha1 = 0.26 * glowIntensity * currentFlicker;
      const alpha2 = 0.12 * glowIntensity * currentFlicker;
      const alpha3 = 0.04 * glowIntensity * currentFlicker;

      glowGrad.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, ${alpha1})`);
      glowGrad.addColorStop(0.35, `rgba(${gr}, ${Math.round(gg * 0.7)}, ${Math.round(gb * 0.5)}, ${alpha2})`);
      glowGrad.addColorStop(0.7, `rgba(${Math.round(gr * 0.5)}, ${Math.round(gg * 0.3)}, 0, ${alpha3})`);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Cinematic Vignette around outer screen edges
      const vignetteGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.45,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.75)');
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, width, height);
    };

    // Main Animation Loop
    const render = () => {
      time += 1;

      // Realistic non-linear organic flame flicker
      const organicFlicker =
        0.88 +
        Math.sin(time * 0.06) * 0.06 +
        Math.sin(time * 0.14) * 0.04 +
        (Math.random() - 0.5) * 0.03;

      // Hearth Geometry (Responsive 4K / mobile scaling)
      const hearthW = Math.min(width * 0.68, 860);
      const hearthH = Math.min(height * 0.65, 620);
      const hearthX = (width - hearthW) / 2;
      const hearthY = height - hearthH - Math.max(30, height * 0.08);

      const fireCenterX = hearthX + hearthW / 2;
      const fireBaseY = hearthY + hearthH - 85;
      const flameSpread = hearthW * 0.46;

      const p = FIRE_TYPES[fireType] || FIRE_TYPES.classic;

      // 1. Draw Architecture
      drawArchitecture(hearthW, hearthH, hearthX, hearthY, organicFlicker);

      // 2. Draw Logs & Glowing Coals
      drawLogsAndCoals(fireCenterX, fireBaseY, flameSpread, organicFlicker);

      // 3. Spawn New Flames
      const spawnCount = Math.round(5 * flameIntensity);
      for (let i = 0; i < spawnCount; i++) {
        if (flames.length < maxFlames) {
          flames.push(createFlame(fireCenterX, fireBaseY, flameSpread, p));
        }
      }

      // 4. Spawn Embers / Sparks
      const emberRate = p.sparkRate * sparkDensity;
      if (Math.random() < emberRate * 0.7 && embers.length < maxEmbers) {
        embers.push(createEmber(fireCenterX, fireBaseY - 15, flameSpread * 0.8, p));
      }

      // 5. Spawn Smoke
      const smkRate = p.smokeRate * smokeDensity;
      if (Math.random() < smkRate * 0.3 && smokeParticles.length < maxSmoke) {
        smokeParticles.push(createSmoke(fireCenterX, fireBaseY - 40, flameSpread * 0.5));
      }

      // 6. Update and Draw Smoke Particles
      ctx.save();
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const s = smokeParticles[i];
        s.x += s.vx + Math.sin(time * 0.02 + s.y * 0.01) * 0.5;
        s.y += s.vy;
        s.life++;
        const progress = s.life / s.maxLife;
        const currentSize = s.size + (s.maxSize - s.size) * progress;
        const currentAlpha = s.opacity * (1 - progress);

        ctx.fillStyle = `rgba(18, 14, 12, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        if (s.life >= s.maxLife || s.y < hearthY - 80) {
          smokeParticles.splice(i, 1);
        }
      }
      ctx.restore();

      // 7. Update and Draw Flame Particles (Additive Blending for Luminescence)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = flames.length - 1; i >= 0; i--) {
        const f = flames[i];
        f.x += f.vx + Math.sin(time * 0.08 + f.life * 0.1) * 0.8 + f.curve * f.life;
        f.y += f.vy;
        f.size += f.growth;
        f.life++;

        const lifeFrac = f.life / f.maxLife;
        const currentRadius = Math.max(0.1, f.size * (1 - lifeFrac * 0.7));

        // Color interpolation based on flame life:
        // Hot core (Yellow/White) -> Mid (Amber/Orange) -> Tip (Deep Red/Smoke)
        let r, g, b, alpha;
        if (lifeFrac < 0.25) {
          // White-hot flame base
          const t = lifeFrac / 0.25;
          r = Math.round(p.flameTip[0] + (255 - p.flameTip[0]) * (1 - t));
          g = Math.round(p.flameTip[1] + (255 - p.flameTip[1]) * (1 - t));
          b = Math.round(p.flameTip[2] + (220 - p.flameTip[2]) * (1 - t));
          alpha = 0.85 * (1 - lifeFrac * 0.3);
        } else if (lifeFrac < 0.65) {
          // Mid radiant flame
          const t = (lifeFrac - 0.25) / 0.4;
          r = Math.round(p.flameMid[0] * (1 - t) + p.flameBase[0] * t);
          g = Math.round(p.flameMid[1] * (1 - t) + p.flameBase[1] * t);
          b = Math.round(p.flameMid[2] * (1 - t) + p.flameBase[2] * t);
          alpha = 0.65 * (1 - t * 0.4);
        } else {
          // Flame tip fading into dark ember
          const t = (lifeFrac - 0.65) / 0.35;
          r = Math.round(p.flameBase[0] * (1 - t * 0.5));
          g = Math.round(p.flameBase[1] * (1 - t));
          b = Math.round(p.flameBase[2] * (1 - t));
          alpha = 0.4 * (1 - t);
        }

        const flameGrad = ctx.createRadialGradient(
          f.x,
          f.y,
          currentRadius * 0.15,
          f.x,
          f.y,
          currentRadius
        );
        flameGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        flameGrad.addColorStop(0.5, `rgba(${r}, ${Math.round(g * 0.8)}, ${b}, ${alpha * 0.6})`);
        flameGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        if (f.life >= f.maxLife || f.size <= 1.0 || f.y < hearthY + 20) {
          flames.splice(i, 1);
        }
      }
      ctx.restore();

      // 8. Update and Draw Embers & Sparks
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++;
        e.x += e.vx + Math.sin(time * e.wobbleSpeed + e.y * 0.05) * e.wobbleAmp;
        e.y += e.vy;
        e.vy += 0.015; // Subtle air draft gravity / drag

        const progress = e.life / e.maxLife;
        const currentAlpha = Math.max(0, 1 - progress);
        const currentSize = Math.max(0.6, e.size * (1 - progress * 0.4));

        // Color shifts from glowing white-gold to orange-red spark
        const r = p.emberColor[0];
        const g = Math.round(p.emberColor[1] * (1 - progress * 0.6));
        const b = Math.round(p.emberColor[2] * (1 - progress * 0.9));

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.95})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Ember micro glow halo
        ctx.fillStyle = `rgba(${r}, ${g}, 0, ${currentAlpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, currentSize * 2.5, 0, Math.PI * 2);
        ctx.fill();

        if (e.life >= e.maxLife || e.y < 0) {
          embers.splice(i, 1);
        }
      }
      ctx.restore();

      // 9. Draw Dynamic Ambient Room Glow
      drawAmbientGlow(fireCenterX, fireBaseY - 50, organicFlicker);

      // 10. Optional Heat Shimmer subtle scanline effect
      if (showHeatShimmer) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 200, 150, 0.015)';
        for (let y = Math.round(hearthY + 20); y < fireBaseY; y += 4) {
          const shift = Math.sin(time * 0.15 + y * 0.1) * 3;
          ctx.fillRect(fireCenterX - flameSpread * 0.4 + shift, y, flameSpread * 0.8, 1);
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    fireType,
    glowIntensity,
    glowWarmth,
    flameIntensity,
    sparkDensity,
    smokeDensity,
    mantelStyle,
    showHeatShimmer,
  ]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-pointer select-none"
      />
    </div>
  );
}

