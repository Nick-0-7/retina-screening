/**
 * Generates dynamic high-quality Retinal Fundus illustrations onto an HTML5 Canvas or Data URL
 * Renders optic disc, retinal blood vessel tree, macula, and disease artifacts (microaneurysms, exudates, hemorrhages)
 */

export function generateFundusDataUrl(stageKey = 'Moderate', width = 600, height = 600) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.45;

  // 1. Dark background
  ctx.fillStyle = '#080a0f';
  ctx.fillRect(0, 0, width, height);

  // 2. Retinal Fundus Base Globe (Orange-red gradient)
  const eyeGrad = ctx.createRadialGradient(cx - 30, cy - 20, 10, cx, cy, radius);
  eyeGrad.addColorStop(0, '#e65100');
  eyeGrad.addColorStop(0.4, '#c62828');
  eyeGrad.addColorStop(0.85, '#8e0000');
  eyeGrad.addColorStop(1, '#4a0000');

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = eyeGrad;
  ctx.shadowColor = 'rgba(255, 100, 50, 0.4)';
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.restore();

  // 3. Optic Disc (Bright yellowish circle on nasal side, e.g., left)
  const discX = cx - radius * 0.45;
  const discY = cy - radius * 0.05;
  const discR = radius * 0.18;

  const discGrad = ctx.createRadialGradient(discX, discY, 2, discX, discY, discR);
  discGrad.addColorStop(0, '#fffde7');
  discGrad.addColorStop(0.6, '#ffe082');
  discGrad.addColorStop(1, '#ffb74d');

  ctx.beginPath();
  ctx.arc(discX, discY, discR, 0, Math.PI * 2);
  ctx.fillStyle = discGrad;
  ctx.fill();

  // Optic Cup
  ctx.beginPath();
  ctx.arc(discX, discY, discR * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fill();

  // 4. Macula & Fovea (Darker red-brown spot on temporal side, e.g., right)
  const maculaX = cx + radius * 0.25;
  const maculaY = cy;
  const maculaR = radius * 0.14;

  const macGrad = ctx.createRadialGradient(maculaX, maculaY, 2, maculaX, maculaY, maculaR);
  macGrad.addColorStop(0, '#3e0000');
  macGrad.addColorStop(0.7, '#5c0a0a');
  macGrad.addColorStop(1, 'transparent');

  ctx.beginPath();
  ctx.arc(maculaX, maculaY, maculaR, 0, Math.PI * 2);
  ctx.fillStyle = macGrad;
  ctx.fill();

  // Foveal reflex dot
  ctx.beginPath();
  ctx.arc(maculaX, maculaY, 2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 235, 200, 0.8)';
  ctx.fill();

  // 5. Vascular Tree (Blood Vessels branching out from Optic Disc)
  const branches = [
    { angle: -Math.PI * 0.65, length: radius * 0.85, width: 7 },
    { angle: -Math.PI * 0.35, length: radius * 0.88, width: 6.5 },
    { angle: Math.PI * 0.4, length: radius * 0.82, width: 6 },
    { angle: Math.PI * 0.68, length: radius * 0.85, width: 7 },
    { angle: Math.PI * 0.05, length: radius * 0.5, width: 4 }
  ];

  ctx.strokeStyle = '#4a0004';
  ctx.lineCap = 'round';

  branches.forEach(b => {
    drawVessel(ctx, discX, discY, b.angle, b.length, b.width, 3);
  });

  // Highlight main vessels in deep crimson
  ctx.strokeStyle = '#80000a';
  branches.forEach(b => {
    drawVessel(ctx, discX, discY, b.angle, b.length, b.width * 0.65, 3);
  });

  // 6. Disease Lesions based on DR Stage Grade
  const stageGrades = { No_DR: 0, Mild: 1, Moderate: 2, Severe: 3, Proliferate_DR: 4 };
  const grade = stageGrades[stageKey] ?? 2;

  if (grade >= 1) {
    // Microaneurysms (Small red dots)
    const microCount = grade * 12;
    for (let i = 0; i < microCount; i++) {
      const rx = cx + (Math.sin(i * 3.7) * radius * 0.6);
      const ry = cy + (Math.cos(i * 2.3) * radius * 0.6);
      ctx.beginPath();
      ctx.arc(rx, ry, Math.random() * 2 + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#b71c1c';
      ctx.fill();
    }
  }

  if (grade >= 2) {
    // Hard Exudates (Yellowish waxy deposits near macula)
    for (let i = 0; i < 15; i++) {
      const exX = maculaX + (Math.sin(i * 1.8) * radius * 0.25);
      const exY = maculaY + (Math.cos(i * 2.4) * radius * 0.25);
      ctx.beginPath();
      ctx.arc(exX, exY, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fillStyle = '#fff59d';
      ctx.fill();
    }

    // Cotton Wool Spots (Fluffy white spots)
    for (let i = 0; i < 4; i++) {
      const cwX = cx + (Math.cos(i * 2.1) * radius * 0.4);
      const cwY = cy + (Math.sin(i * 3.1) * radius * 0.4);
      ctx.beginPath();
      ctx.arc(cwX, cwY, 6 + i, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();
    }
  }

  if (grade >= 3) {
    // Blot Hemorrhages (Larger dark red patches)
    for (let i = 0; i < 8; i++) {
      const hX = cx + (Math.sin(i * 4.2) * radius * 0.5);
      const hY = cy + (Math.cos(i * 1.5) * radius * 0.5);
      ctx.beginPath();
      ctx.ellipse(hX, hY, Math.random() * 7 + 4, Math.random() * 5 + 3, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = '#5c0000';
      ctx.fill();
    }
  }

  if (grade >= 4) {
    // Neovascularization (Thin tangles of new blood vessels near disc & macula)
    ctx.strokeStyle = '#d50000';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 10; i++) {
      const neoStartX = discX + (Math.cos(i) * 20);
      const neoStartY = discY + (Math.sin(i) * 20);
      ctx.beginPath();
      ctx.moveTo(neoStartX, neoStartY);
      ctx.quadraticCurveTo(
        neoStartX + Math.sin(i) * 35,
        neoStartY + Math.cos(i) * 35,
        neoStartX + Math.cos(i * 2) * 55,
        neoStartY + Math.sin(i * 2) * 55
      );
      ctx.stroke();
    }
  }

  // Outer border ring clip mask effect
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 4;
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

function drawVessel(ctx, x, y, angle, length, width, depth) {
  if (depth <= 0 || width < 0.8) return;

  const endX = x + Math.cos(angle) * length;
  const endY = y + Math.sin(angle) * length;
  const ctrlX = x + Math.cos(angle + 0.2) * (length * 0.5);
  const ctrlY = y + Math.sin(angle - 0.2) * (length * 0.5);

  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
  ctx.stroke();

  // Sub-branches
  const subAngle1 = angle - 0.35 + (Math.random() * 0.1);
  const subAngle2 = angle + 0.35 - (Math.random() * 0.1);

  drawVessel(ctx, endX, endY, subAngle1, length * 0.65, width * 0.65, depth - 1);
  drawVessel(ctx, endX, endY, subAngle2, length * 0.65, width * 0.65, depth - 1);
}
