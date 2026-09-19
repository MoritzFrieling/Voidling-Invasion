  // Canvas rendering, minimap, HUD synchronization, and visual effects.
  function addParticle(x, y, options = {}) {
    if (particles.length > 520) return;
    particles.push({
      x, y,
      vx: options.vx ?? rand(-50, 50),
      vy: options.vy ?? rand(-50, 50),
      color: options.color ?? COLORS.cyan,
      life: options.life ?? .4,
      maxLife: options.life ?? .4,
      size: options.size ?? 2,
    });
  }

  function burst(x, y, color, count = 12, speed = 180) {
    for (let i = 0; i < count; i += 1) {
      const angle = rand(0, Math.PI * 2);
      const velocity = rand(speed * .2, speed);
      addParticle(x, y, { vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, color, life: rand(.25, .78), size: rand(1.3, 4.4) });
    }
  }

  function addFloater(x, y, text, color) {
    floaters.push({ x, y, text, color, life: 1.05, maxLife: 1.05 });
  }

  function updateCamera(dt) {
    const leadX = player.vx * .28;
    const leadY = player.vy * .28;
    const targetX = clamp(player.x - screenWidth / 2 + leadX, 0, Math.max(0, WORLD.width - screenWidth));
    const targetY = clamp(player.y - screenHeight / 2 + leadY, 0, Math.max(0, WORLD.height - screenHeight));
    const smoothing = 1 - Math.pow(.0003, dt);
    camera.x = lerp(camera.x, targetX, smoothing);
    camera.y = lerp(camera.y, targetY, smoothing);
    camera.shake *= Math.pow(.015, dt);
    const shakeAmount = settings.shake ? camera.shake : 0;
    camera.shakeX = rand(-shakeAmount, shakeAmount);
    camera.shakeY = rand(-shakeAmount, shakeAmount);
  }

  function worldToScreen(x, y) {
    return { x: x - camera.x + camera.shakeX, y: y - camera.y + camera.shakeY };
  }

  function updateAimWorld() {
    input.aimWorldX = input.mouseX + camera.x - camera.shakeX;
    input.aimWorldY = input.mouseY + camera.y - camera.shakeY;
  }

  function isVisible(object, padding = 100) {
    const position = worldToScreen(object.x, object.y);
    return position.x > -padding && position.y > -padding && position.x < screenWidth + padding && position.y < screenHeight + padding;
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const background = ctx.createRadialGradient(screenWidth * .53, screenHeight * .45, 20, screenWidth * .5, screenHeight * .5, Math.max(screenWidth, screenHeight));
    background.addColorStop(0, '#0b2029');
    background.addColorStop(.52, '#061018');
    background.addColorStop(1, '#020509');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    drawBackground();
    drawWorld();
    drawScreenEffects();
    drawMinimap();
  }

  function drawBackground() {
    ctx.save();
    const parallaxX = camera.x * .2;
    const parallaxY = camera.y * .2;
    for (const star of stars) {
      let sx = (star.x - parallaxX * star.depth) % (WORLD.width + screenWidth);
      let sy = (star.y - parallaxY * star.depth) % (WORLD.height + screenHeight);
      if (sx < 0) sx += WORLD.width + screenWidth;
      if (sy < 0) sy += WORLD.height + screenHeight;
      if (sx > screenWidth || sy > screenHeight) continue;
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = star.size > 1.5 ? COLORS.cyanSoft : '#b8cdd0';
      ctx.fillRect(sx, sy, star.size, star.size);
    }
    ctx.globalAlpha = 1;

    const gridSize = 160;
    const gridX = -((camera.x * .34) % gridSize);
    const gridY = -((camera.y * .34) % gridSize);
    ctx.strokeStyle = 'rgba(93, 181, 182, .035)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = gridX; x < screenWidth; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, screenHeight); }
    for (let y = gridY; y < screenHeight; y += gridSize) { ctx.moveTo(0, y); ctx.lineTo(screenWidth, y); }
    ctx.stroke();
    ctx.restore();
  }

  function drawWorld() {
    ctx.save();
    ctx.translate(-camera.x + camera.shakeX, -camera.y + camera.shakeY);
    drawCorridor();
    drawPortal();
    resources.forEach(drawResource);
    pickups.forEach(drawPickup);
    stations.forEach(drawStation);
    enemies.forEach(drawEnemy);
    drawTargetLock();
    drawJumpDestination();
    bullets.forEach(drawBullet);
    rockets.forEach(drawRocket);
    enemyRockets.forEach(drawEnemyRocket);
    particles.forEach(drawParticle);
    drawPlayer();
    floaters.forEach(drawFloater);
    ctx.restore();
  }

  function drawJumpDestination() {
    if (!Number.isFinite(player.jumpDestinationX) || !Number.isFinite(player.jumpDestinationY)) return;
    const pulse = 1 + Math.sin(elapsed * 5) * .12;
    const ready = player.jumpDestinationCooldown <= 0;
    ctx.save();
    ctx.translate(player.jumpDestinationX, player.jumpDestinationY);
    ctx.rotate(elapsed * .8);
    ctx.globalAlpha = ready ? .9 : .42;
    ctx.strokeStyle = ready ? COLORS.purple : '#6f748d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 17 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-25, 0); ctx.lineTo(-10, 0); ctx.moveTo(10, 0); ctx.lineTo(25, 0);
    ctx.moveTo(0, -25); ctx.lineTo(0, -10); ctx.moveTo(0, 10); ctx.lineTo(0, 25);
    ctx.stroke();
    ctx.fillStyle = COLORS.purple;
    ctx.globalAlpha *= .35;
    ctx.beginPath(); ctx.arc(0, 0, 7 * pulse, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function tracePath(path) {
    const points = path.points;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
    }
    ctx.lineTo(PORTAL.x, PORTAL.y);
  }

  function drawCorridor() {
    ctx.save();
    for (const path of activePaths) {
      tracePath(path);
      ctx.strokeStyle = 'rgba(70, 219, 211, .045)';
      ctx.lineWidth = 130;
      ctx.stroke();
      tracePath(path);
      ctx.setLineDash([13, 22]);
      ctx.lineDashOffset = -gameClock * 28;
      ctx.strokeStyle = 'rgba(109, 247, 232, .23)';
      ctx.lineWidth = 2;
      ctx.stroke();
      tracePath(path);
      ctx.setLineDash([2, 72]);
      ctx.lineDashOffset = -gameClock * 42;
      ctx.strokeStyle = 'rgba(255, 179, 92, .45)';
      ctx.lineWidth = 7;
      ctx.stroke();
    }
    ctx.setLineDash([]);
    for (const wormhole of LEVELS[currentLevel].wormholes) drawWormhole(wormhole);
    ctx.restore();
  }

  function drawWormhole(wormhole) {
    ctx.save();
    ctx.translate(wormhole.x, wormhole.y);
    ctx.rotate(-elapsed * .7);
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.strokeStyle = `rgba(168,140,255,${.7 - ring * .18})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([7 + ring * 3, 9]);
      ctx.beginPath(); ctx.ellipse(0, 0, 34 + ring * 11, 17 + ring * 5, ring * .4, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  function drawPortal() {
    if (!isVisible(PORTAL, 180)) return;
    ctx.save();
    ctx.translate(PORTAL.x, PORTAL.y);
    const pulse = 1 + Math.sin(elapsed * 2.2) * .025;
    ctx.scale(pulse, pulse);
    const glow = ctx.createRadialGradient(0, 0, 12, 0, 0, 132);
    glow.addColorStop(0, 'rgba(81,190,225,.3)');
    glow.addColorStop(.62, 'rgba(32,114,126,.1)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, 132, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.rotate(elapsed * .16);
    for (let ring = 0; ring < 3; ring += 1) {
      ctx.strokeStyle = ring === 1 ? 'rgba(255,179,92,.62)' : 'rgba(109,247,232,.62)';
      ctx.lineWidth = ring === 1 ? 2 : 1;
      ctx.setLineDash([ring === 1 ? 11 : 4, ring === 1 ? 12 : 18]);
      ctx.beginPath(); ctx.arc(0, 0, 60 + ring * 19, ring * .7, Math.PI * 2 + ring * .7); ctx.stroke();
      ctx.rotate(-elapsed * .35 * (ring + 1));
    }
    ctx.restore();
    ctx.setLineDash([]);

    ctx.save();
    ctx.beginPath(); ctx.arc(0, 0, 39, 0, Math.PI * 2); ctx.clip();
    const ocean = ctx.createRadialGradient(-13, -16, 3, 6, 8, 50);
    ocean.addColorStop(0, '#48c8dc');
    ocean.addColorStop(.48, '#157ea1');
    ocean.addColorStop(1, '#062d50');
    ctx.fillStyle = ocean;
    ctx.fillRect(-44, -44, 88, 88);
    ctx.fillStyle = '#62c58d';
    ctx.beginPath();
    ctx.moveTo(-32, -13); ctx.bezierCurveTo(-24, -26, -11, -28, -5, -18); ctx.bezierCurveTo(1, -10, -7, -4, -2, 3); ctx.bezierCurveTo(-10, 8, -21, 3, -29, 9); ctx.bezierCurveTo(-35, 2, -38, -6, -32, -13); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(12, -25); ctx.bezierCurveTo(27, -20, 37, -8, 31, 1); ctx.bezierCurveTo(25, 4, 22, 14, 11, 13); ctx.bezierCurveTo(5, 5, 5, -5, -2, -10); ctx.bezierCurveTo(3, -19, 6, -23, 12, -25); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(9, 20); ctx.bezierCurveTo(18, 15, 30, 20, 29, 29); ctx.bezierCurveTo(18, 36, 10, 32, 5, 27); ctx.closePath(); ctx.fill();
    const night = ctx.createLinearGradient(-34, -24, 37, 28);
    night.addColorStop(.35, 'rgba(1,8,20,0)');
    night.addColorStop(.72, 'rgba(1,8,20,.38)');
    night.addColorStop(1, 'rgba(1,8,20,.78)');
    ctx.fillStyle = night;
    ctx.fillRect(-44, -44, 88, 88);
    ctx.restore();

    ctx.strokeStyle = '#9cfff4';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 14;
    ctx.shadowColor = COLORS.cyan;
    ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = COLORS.pale;
    ctx.font = '700 10px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EARTH GATE', 0, 57);
    ctx.restore();
  }

  function drawResource(rock) {
    if (!isVisible(rock, 70)) return;
    ctx.save();
    ctx.translate(rock.x, rock.y);
    ctx.rotate(rock.rotation);
    ctx.beginPath();
    for (let i = 0; i < rock.sides; i += 1) {
      const angle = (i / rock.sides) * Math.PI * 2;
      const radius = rock.radius * (.75 + ((i * 47) % 25) / 100);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = rock.crystal ? 'rgba(168,140,255,.18)' : 'rgba(73,133,137,.25)';
    ctx.strokeStyle = rock.crystal ? COLORS.purple : 'rgba(125,205,201,.55)';
    ctx.lineWidth = rock.crystal ? 2 : 1;
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-rock.radius * .45, -rock.radius * .2); ctx.lineTo(rock.radius * .2, rock.radius * .34); ctx.lineTo(rock.radius * .5, -rock.radius * .42); ctx.stroke();
    ctx.restore();
    if (rock.hp < rock.maxHp) drawHealthBar(rock.x, rock.y - rock.radius - 10, 42, rock.hp / rock.maxHp, rock.crystal ? COLORS.purple : COLORS.cyan);
  }

  function drawPickup(item) {
    if (!isVisible(item, 60)) return;
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(elapsed * .55);
    const scale = 1 + Math.sin(item.pulse) * .08;
    ctx.scale(scale, scale);
    ctx.shadowBlur = 18;
    ctx.shadowColor = item.kind === 'repair' ? COLORS.cyan : COLORS.amber;
    ctx.strokeStyle = item.kind === 'repair' ? COLORS.cyan : COLORS.amber;
    ctx.fillStyle = item.kind === 'repair' ? 'rgba(109,247,232,.12)' : 'rgba(255,179,92,.12)';
    ctx.lineWidth = 2;
    if (item.kind === 'repair') {
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = i % 2 ? 10 : 19;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.rotate(-elapsed * .55);
      ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.moveTo(0, -7); ctx.lineTo(0, 7); ctx.stroke();
    } else {
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = -Math.PI / 2 + (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 19;
        const y = Math.sin(angle) * 19;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  function drawStation(station) {
    if (!isVisible(station, station.range)) return;
    ctx.save();
    ctx.translate(station.x, station.y);
    ctx.strokeStyle = 'rgba(255,179,92,.12)';
    ctx.setLineDash([7, 13]);
    ctx.beginPath(); ctx.arc(0, 0, station.range, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.rotate(elapsed * .22);
    ctx.strokeStyle = COLORS.amber;
    ctx.fillStyle = 'rgba(17,28,31,.95)';
    ctx.shadowBlur = 14;
    ctx.shadowColor = COLORS.amber;
    ctx.lineWidth = 2;
    for (let arm = 0; arm < 4; arm += 1) {
      ctx.rotate(Math.PI / 2);
      ctx.fillRect(12, -5, 23 + station.level * 2, 10);
      ctx.strokeRect(12, -5, 23 + station.level * 2, 10);
    }
    ctx.rotate(-elapsed * .22);
    ctx.fillStyle = '#09161d';
    ctx.beginPath(); ctx.arc(0, 0, 18 + station.level * 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.rotate(station.angle);
    ctx.fillStyle = COLORS.cyan;
    ctx.fillRect(4, -3, 26, 6);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = COLORS.amber;
    ctx.font = '700 9px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`DEFENSE STATION // MK ${station.level}`, station.x, station.y - 46);
    ctx.restore();
  }

  function drawTargetLock() {
    if (!lockedTarget || lockedTarget.dead || mode !== 'playing') return;
    ctx.save();
    ctx.translate(lockedTarget.x, lockedTarget.y);
    ctx.rotate(elapsed * .9);
    ctx.strokeStyle = COLORS.amber;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.arc(0, 0, lockedTarget.radius + 16, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    for (let corner = 0; corner < 4; corner += 1) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(lockedTarget.radius + 10, -7); ctx.lineTo(lockedTarget.radius + 10, 7); ctx.stroke();
    }
    ctx.restore();
  }

  function traceEnemyHull(target, type, r) {
    target.beginPath();
    if (type === 'scout' || type === 'striker') {
      target.moveTo(r, 0); target.lineTo(-r * .7, -r * .72); target.lineTo(-r * .35, 0); target.lineTo(-r * .7, r * .72);
    } else if (type === 'interceptor') {
      target.moveTo(r, 0); target.lineTo(0, -r * .62); target.lineTo(-r, 0); target.lineTo(0, r * .62);
    } else if (type === 'raider') {
      target.moveTo(r, 0); target.lineTo(r * .2, -r * .7); target.lineTo(-r, -r * .48); target.lineTo(-r * .62, 0); target.lineTo(-r, r * .48); target.lineTo(r * .2, r * .7);
    } else if (type === 'carrier' || type === 'bossCarrier') {
      target.moveTo(r, 0); target.lineTo(r * .35, -r * .6); target.lineTo(-r * .45, -r); target.lineTo(-r, -r * .3); target.lineTo(-r * .72, 0); target.lineTo(-r, r * .3); target.lineTo(-r * .45, r); target.lineTo(r * .35, r * .6);
    } else if (type === 'sentinel' || type === 'bossTitan') {
      for (let side = 0; side < 6; side += 1) {
        const a = side / 6 * Math.PI * 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (!side) target.moveTo(px, py); else target.lineTo(px, py);
      }
    } else {
      target.moveTo(r, 0); target.lineTo(r * .52, -r * .7); target.lineTo(-r * .35, -r); target.lineTo(-r, -r * .45); target.lineTo(-r * .7, 0); target.lineTo(-r, r * .45); target.lineTo(-r * .35, r); target.lineTo(r * .52, r * .7);
    }
    target.closePath();
  }

  function drawIntelShip(type) {
    const preview = ui.intelShip;
    const previewCtx = preview.getContext('2d');
    const blueprint = ENEMY_TYPES[type];
    const r = clamp(blueprint.radius * 2.25, 45, 92);
    previewCtx.clearRect(0, 0, preview.width, preview.height);
    previewCtx.save();
    previewCtx.translate(preview.width / 2, preview.height / 2);
    previewCtx.shadowBlur = 26;
    previewCtx.shadowColor = blueprint.color;
    previewCtx.fillStyle = 'rgba(17,22,30,.98)';
    previewCtx.strokeStyle = blueprint.color;
    previewCtx.lineWidth = blueprint.major ? 4 : 3;
    traceEnemyHull(previewCtx, type, r);
    previewCtx.fill(); previewCtx.stroke();
    previewCtx.shadowBlur = 10;
    previewCtx.fillStyle = blueprint.color;
    previewCtx.globalAlpha = .82;
    previewCtx.fillRect(-r * .72, -r * .14, r * .62, r * .28);
    previewCtx.globalAlpha = 1;
    if (blueprint.major) {
      previewCtx.strokeStyle = 'rgba(255,255,255,.48)';
      previewCtx.beginPath(); previewCtx.arc(r * .12, 0, r * .33, 0, Math.PI * 2); previewCtx.stroke();
      previewCtx.fillStyle = blueprint.color;
      previewCtx.beginPath(); previewCtx.arc(r * .12, 0, r * .12, 0, Math.PI * 2); previewCtx.fill();
    }
    if (blueprint.shielded) {
      previewCtx.strokeStyle = 'rgba(121,168,255,.9)';
      previewCtx.setLineDash([10, 8]);
      previewCtx.lineWidth = 3;
      previewCtx.beginPath(); previewCtx.arc(0, 0, r + 17, 0, Math.PI * 2); previewCtx.stroke();
    }
    previewCtx.restore();
  }

  function drawEnemy(enemy) {
    if (!isVisible(enemy, enemy.radius + 80)) return;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.angle);
    ctx.shadowBlur = enemy.major ? 14 : 6;
    ctx.shadowColor = enemy.color;
    ctx.strokeStyle = enemy.hitFlash > 0 ? '#ffffff' : enemy.color;
    ctx.fillStyle = enemy.hitFlash > 0 ? 'rgba(255,255,255,.55)' : 'rgba(17,22,30,.96)';
    ctx.lineWidth = enemy.boss ? 3 : enemy.major ? 2 : 1.4;
    const r = enemy.radius;
    traceEnemyHull(ctx, enemy.type, r);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = enemy.color;
    ctx.globalAlpha = .8;
    ctx.fillRect(-r * .72, -r * .14, r * .62, r * .28);
    if (enemy.major) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(255,255,255,.35)';
      ctx.beginPath(); ctx.arc(r * .12, 0, r * .33, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = enemy.color;
      ctx.beginPath(); ctx.arc(r * .12, 0, r * .12, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = enemy.boss ? '#ffffff' : enemy.shielded ? '#79a8ff' : COLORS.amber;
      ctx.lineWidth = enemy.boss ? 2.8 : 1.8;
      ctx.globalAlpha = .82;
      ctx.setLineDash(enemy.boss ? [10, 7] : [6, 6]);
      ctx.beginPath(); ctx.arc(0, 0, r + (enemy.boss ? 9 : 6), 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    if (enemy.shieldCharges > 0 || enemy.shieldHp > 0) {
      const shieldBarY = enemy.y - enemy.radius - (enemy.boss ? 34 : 24);
      const shieldBarWidth = enemy.boss ? 110 : 72;
      const chargeShield = enemy.shieldCharges > 0;
      const shieldRatio = chargeShield ? enemy.shieldCharges / enemy.maxShieldCharges : enemy.shieldHp / enemy.maxShield;
      drawHealthBar(enemy.x, shieldBarY, shieldBarWidth, shieldRatio, '#79a8ff');
      ctx.save();
      ctx.fillStyle = '#9acbff';
      ctx.font = '700 8px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(chargeShield ? `SHIELD ${enemy.shieldCharges}/${enemy.maxShieldCharges}` : `SHIELD ${Math.ceil(enemy.shieldHp)}`, enemy.x, shieldBarY - 4);
      ctx.restore();
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.rotate(-elapsed * .65);
      ctx.strokeStyle = enemy.shieldHitTimer > 0 ? '#ffffff' : 'rgba(121,168,255,.8)';
      ctx.lineWidth = enemy.shieldHitTimer > 0 ? 4 : 2;
      ctx.setLineDash([8, 6]);
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#79a8ff';
      ctx.beginPath(); ctx.arc(0, 0, enemy.radius + 10, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    if (enemy.major || enemy.interceptor || enemy.hp < enemy.maxHp) drawHealthBar(enemy.x, enemy.y - enemy.radius - 13, enemy.boss ? 110 : enemy.major ? 72 : 38, enemy.hp / enemy.maxHp, enemy.color);
    if (enemy.boss) {
      ctx.save();
      ctx.fillStyle = COLORS.coral;
      ctx.font = '700 10px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ENEMY_TYPES[enemy.type].name, enemy.x, enemy.y - enemy.radius - 25);
      ctx.restore();
    }
  }

  function drawPlayer() {
    if (!player) return;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 18) % 2 === 0) ctx.globalAlpha = .35;
    ctx.shadowBlur = 14;
    ctx.shadowColor = COLORS.cyan;
    ctx.fillStyle = '#081a22';
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(27, 0);
    ctx.lineTo(-17, -15);
    ctx.lineTo(-10, -4);
    ctx.lineTo(-22, 0);
    ctx.lineTo(-10, 4);
    ctx.lineTo(-17, 15);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = COLORS.amber;
    ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(-3, -5); ctx.lineTo(-3, 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(109,247,232,.75)';
    ctx.beginPath(); ctx.moveTo(-13, -5); ctx.lineTo(-25, 0); ctx.lineTo(-13, 5); ctx.closePath(); ctx.fill();
    ctx.restore();

    if (player.jumpFlash > 0) {
      ctx.save();
      ctx.globalAlpha = clamp(player.jumpFlash / .42, 0, 1) * .72;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 8]);
      ctx.beginPath(); ctx.arc(player.x, player.y, 30 + (1 - player.jumpFlash / .42) * 28, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    if (player.rocketCharge > 0) {
      const progress = 1 - player.rocketCharge / .62;
      ctx.save();
      ctx.strokeStyle = COLORS.amber;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(player.x, player.y, 31, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress); ctx.stroke();
      ctx.restore();
    }
  }

  function drawBullet(bullet) {
    ctx.save();
    ctx.strokeStyle = COLORS.cyanSoft;
    ctx.lineWidth = 2.2;
    ctx.shadowBlur = 9;
    ctx.shadowColor = COLORS.cyan;
    ctx.beginPath(); ctx.moveTo(bullet.x, bullet.y); ctx.lineTo(bullet.x - bullet.vx * .018, bullet.y - bullet.vy * .018); ctx.stroke();
    ctx.restore();
  }

  function drawRocket(rocket) {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.angle);
    ctx.fillStyle = COLORS.amber;
    ctx.shadowBlur = 13;
    ctx.shadowColor = COLORS.amber;
    ctx.beginPath(); ctx.moveTo(13, 0); ctx.lineTo(-8, -5); ctx.lineTo(-4, 0); ctx.lineTo(-8, 5); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawEnemyRocket(rocket) {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.angle);
    ctx.fillStyle = rocket.hitFlash > 0 ? '#ffffff' : COLORS.coral;
    ctx.shadowBlur = 12;
    ctx.shadowColor = COLORS.coral;
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-7, -4); ctx.lineTo(-7, 4); ctx.closePath(); ctx.fill();
    ctx.restore();
    if (rocket.hp < rocket.maxHp) drawHealthBar(rocket.x, rocket.y - rocket.radius - 8, 22, rocket.hp / rocket.maxHp, COLORS.coral);
  }

  function drawParticle(particle) {
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
    ctx.globalAlpha = 1;
  }

  function drawFloater(floater) {
    ctx.save();
    ctx.globalAlpha = clamp(floater.life / floater.maxLife, 0, 1);
    ctx.fillStyle = floater.color;
    ctx.font = '700 11px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();
  }

  function drawHealthBar(x, y, width, ratio, color) {
    ctx.save();
    ctx.fillStyle = 'rgba(2,7,11,.82)';
    ctx.fillRect(x - width / 2, y, width, 4);
    ctx.fillStyle = color;
    ctx.fillRect(x - width / 2, y, width * clamp(ratio, 0, 1), 4);
    ctx.restore();
  }

  function drawScreenEffects() {
    if (!player || mode === 'menu') return;
    const lowHealth = 1 - player.hp / player.maxHp;
    if (lowHealth > .45) {
      const vignette = ctx.createRadialGradient(screenWidth / 2, screenHeight / 2, screenHeight * .25, screenWidth / 2, screenHeight / 2, screenWidth * .72);
      vignette.addColorStop(.4, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, `rgba(130, 11, 20, ${lowHealth * .34})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, screenWidth, screenHeight);
    }
    if (announcementTimer > 0) {
      const alpha = clamp(Math.min(announcementTimer, 2.2 - announcementTimer) * 1.8, 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      const bossStage = wave === LEVELS[currentLevel].stages;
      ctx.fillStyle = bossStage ? COLORS.coral : COLORS.pale;
      ctx.font = `700 ${Math.min(48, screenWidth * .045)}px "Chakra Petch", sans-serif`;
      ctx.fillText(bossStage ? 'FINAL STAGE' : `STAGE ${String(wave).padStart(2, '0')}`, screenWidth / 2, screenHeight * .36);
      ctx.fillStyle = COLORS.muted || '#8ca9aa';
      ctx.font = '700 10px "Space Mono", monospace';
      ctx.fillText(bossStage ? 'COMMAND SHIP ENTERING THE CORRIDOR' : 'HOSTILE FORMATION DETECTED', screenWidth / 2, screenHeight * .36 + 26);
      ctx.restore();
    }
  }

  function drawMinimap() {
    const width = mapCanvas.width;
    const height = mapCanvas.height;
    const sx = width / WORLD.width;
    const sy = height / WORLD.height;
    mctx.clearRect(0, 0, width, height);
    mctx.fillStyle = 'rgba(2,9,14,.92)';
    mctx.fillRect(0, 0, width, height);
    mctx.strokeStyle = 'rgba(109,247,232,.18)';
    mctx.lineWidth = 1;
    for (const path of activePaths) {
      mctx.beginPath();
      mctx.moveTo(path.points[0].x * sx, path.points[0].y * sy);
      for (let i = 1; i < path.points.length; i += 1) mctx.lineTo(path.points[i].x * sx, path.points[i].y * sy);
      mctx.stroke();
    }
    for (const rock of resources) {
      mctx.fillStyle = rock.crystal ? 'rgba(168,140,255,.65)' : 'rgba(109,247,232,.25)';
      mctx.fillRect(rock.x * sx, rock.y * sy, 2, 2);
    }
    for (const enemy of enemies) {
      mctx.fillStyle = enemy.boss ? '#ffffff' : enemy.major ? enemy.shielded ? '#79a8ff' : COLORS.amber : COLORS.coral;
      const size = enemy.boss ? 5 : enemy.major ? 4 : 2.5;
      mctx.fillRect(enemy.x * sx - size / 2, enemy.y * sy - size / 2, size, size);
    }
    for (const station of stations) {
      mctx.fillStyle = COLORS.amber;
      mctx.fillRect(station.x * sx - 2, station.y * sy - 2, 4, 4);
    }
    for (const wormhole of LEVELS[currentLevel].wormholes) {
      mctx.strokeStyle = COLORS.purple;
      mctx.beginPath(); mctx.arc(wormhole.x * sx, wormhole.y * sy, 3, 0, Math.PI * 2); mctx.stroke();
    }
    if (player) {
      mctx.fillStyle = COLORS.cyan;
      mctx.beginPath(); mctx.arc(player.x * sx, player.y * sy, 3.5, 0, Math.PI * 2); mctx.fill();
      mctx.strokeStyle = 'rgba(109,247,232,.35)';
      mctx.strokeRect(camera.x * sx, camera.y * sy, screenWidth * sx, screenHeight * sy);
    }
    mctx.fillStyle = COLORS.amber;
    mctx.beginPath(); mctx.arc(PORTAL.x * sx, PORTAL.y * sy, 4.5, 0, Math.PI * 2); mctx.fill();
  }

  function syncUi() {
    if (!player) return;
    const level = LEVELS[currentLevel];
    ui.sectorText.textContent = `${level.short} // ${level.name}`;
    ui.waveText.textContent = `STAGE ${wave ? String(wave).padStart(2, '0') : '—'} / ${level.stages}`;
    ui.waveState.textContent = spawnQueue.length || enemies.length
      ? `WAVE ${formation}/${formationsInStage} · ${spawnQueue.length + enemies.length} HOSTILES`
      : wave ? `WAVE ${formation}/${formationsInStage} CLEAR` : 'STANDBY';
    ui.scoreText.textContent = formatScore(score);
    ui.bestText.textContent = formatScore(isAdminPilot() ? 0 : Math.max(highScore, score));
    const healthRatio = clamp(player.hp / player.maxHp, 0, 1);
    ui.healthBar.style.transform = `scaleX(${healthRatio})`;
    ui.healthBar.style.background = healthRatio < .3 ? COLORS.coral : COLORS.cyan;
    ui.healthText.textContent = `${Math.ceil(player.hp)}`;
    ui.levelText.textContent = String(player.level);
    ui.xpBar.style.transform = `scaleX(${clamp(player.xp / player.xpNext, 0, 1)})`;
    ui.xpText.textContent = `${Math.floor(player.xp)} / ${player.xpNext}`;
    ui.creditText.textContent = String(player.credits).padStart(3, '0');
    ui.speedTierText.textContent = `${player.speedTier}/7`;
    ui.damageTierText.textContent = `${player.damageTier}/7`;
    ui.rateTierText.textContent = `${player.rateTier}/7`;
    ui.hullTierText.textContent = `${player.hullTier}/7`;
    ui.rocketTierText.textContent = `${player.rocketTier}/7`;
    ui.coolingTierText.textContent = `${player.coolingTier}/7`;
    ui.shieldPips.innerHTML = Array.from({ length: 5 }, (_, index) => `<i class="${index >= gateShields ? 'empty' : ''}"></i>`).join('');
    ui.shieldPips.setAttribute('aria-label', `${gateShields} portal shields`);

    const rocketProgress = player.rocketCharge > 0 ? 1 - player.rocketCharge / .62 : 1 - player.rocketCooldown / player.rocketMax;
    ui.rocketCooldown.style.width = `${clamp(rocketProgress, 0, 1) * 100}%`;
    ui.rocketState.textContent = player.rocketCharge > 0 ? 'CHARGING' : player.rocketCooldown > 0 ? `${player.rocketCooldown.toFixed(1)}S` : 'READY';
    ui.rocketCooldown.closest('.ability-card').classList.toggle('cooling', player.rocketCooldown > 0 || player.rocketCharge > 0);

    const boostProgress = 1 - player.boostCooldown / player.boostMax;
    ui.boostCooldown.style.width = `${clamp(boostProgress, 0, 1) * 100}%`;
    if (player.boostCooldown > 0) ui.boostState.textContent = `${player.boostCooldown.toFixed(1)}S`;
    else if (player.jumpDestinationCooldown > 0) ui.boostState.textContent = `JUMP READY · T ${player.jumpDestinationCooldown.toFixed(1)}S`;
    else ui.boostState.textContent = Number.isFinite(player.jumpDestinationX) ? 'JUMP READY · T REPLACE' : 'T PLACE DEST';
    ui.boostCooldown.closest('.ability-card').classList.toggle('cooling', player.boostCooldown > 0);

    const docked = nearestStation(110);
    const buildCost = stationBuildCost();
    if (docked) {
      const upgradeCost = 90 + docked.level * 80;
      ui.stationState.textContent = docked.level >= 4 ? 'MAXIMUM POWER' : `${upgradeCost} ◈ TO UPGRADE`;
    } else {
      ui.stationState.textContent = stations.length >= 3 ? 'STATION LIMIT' : `${buildCost} ◈ TO BUILD`;
    }
    document.getElementById('stationButton').disabled = false;
  }
