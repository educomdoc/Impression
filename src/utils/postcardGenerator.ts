import { Impression } from '../types';

/**
 * Generates an elegant traditional contemplation postcard (사유 엽서) as a PNG data URL
 */
export async function generatePostcardImage(impression: Impression): Promise<string> {
  const canvas = document.createElement('canvas');
  // High resolution for crisp mobile display & saving (1200 x 1500)
  canvas.width = 1200;
  canvas.height = 1500;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Background: Warm Hanji stone paper tone
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1500);
  bgGrad.addColorStop(0, '#fbf9f4');
  bgGrad.addColorStop(0.5, '#f4efe5');
  bgGrad.addColorStop(1, '#ece4d5');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 1500);

  // Outer border frame (double hairline line)
  ctx.strokeStyle = '#8d7f71';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, 1120, 1420);
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 48, 1104, 1404);

  // Corner floral/corner accents
  const drawCorner = (x: number, y: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = '#a49585';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(25, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 25);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(55, 55, 0);
  drawCorner(1145, 55, Math.PI / 2);
  drawCorner(1145, 1445, Math.PI);
  drawCorner(55, 1445, -Math.PI / 2);

  // Top Header: "사유원 思惟園" Traditional Seal Stamp
  // Red Korean Stamp (낙관)
  ctx.save();
  ctx.fillStyle = '#b33927';
  ctx.fillRect(1000, 75, 110, 110);
  ctx.strokeStyle = '#8e2617';
  ctx.lineWidth = 3;
  ctx.strokeRect(1000, 75, 110, 110);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Noto Serif KR", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('思惟', 1055, 110);
  ctx.fillText('之園', 1055, 150);
  ctx.restore();

  // Top Title Bar
  ctx.fillStyle = '#4a5345';
  ctx.font = '600 35px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('사유원 숲체험 & 명상 소감록', 100, 110);

  ctx.fillStyle = '#837869';
  ctx.font = '400 32px "Noto Sans KR", sans-serif';
  ctx.fillText(`${impression.date} | ${impression.spaceName}`, 100, 150);

  // Separator Line
  ctx.strokeStyle = '#d2c7b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(100, 195);
  ctx.lineTo(1100, 195);
  ctx.stroke();

  let nextY = 240;

  // If there's an image, draw rounded picture
  if (impression.photoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // continue even if image fails
        img.src = impression.photoUrl!;
      });

      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        const imgH = 460;
        const imgW = 1000;
        const imgX = 100;
        const imgY = nextY;

        // Clip rounded rect
        const radius = 16;
        ctx.beginPath();
        ctx.moveTo(imgX + radius, imgY);
        ctx.lineTo(imgX + imgW - radius, imgY);
        ctx.quadraticCurveTo(imgX + imgW, imgY, imgX + imgW, imgY + radius);
        ctx.lineTo(imgX + imgW, imgY + imgH - radius);
        ctx.quadraticCurveTo(imgX + imgW, imgY + imgH, imgX + imgW - radius, imgY + imgH);
        ctx.lineTo(imgX + radius, imgY + imgH);
        ctx.quadraticCurveTo(imgX, imgY + imgH, imgX, imgY + imgH - radius);
        ctx.lineTo(imgX, imgY + radius);
        ctx.quadraticCurveTo(imgX, imgY, imgX + radius, imgY);
        ctx.closePath();
        ctx.clip();

        // Draw image cover
        ctx.drawImage(img, imgX, imgY, imgW, imgH);
        ctx.restore();

        nextY += imgH + 50;
      }
    } catch {
      // ignore image load error
    }
  }

  // Impression Title (Bold, Gowun Batang / Serif)
  ctx.fillStyle = '#222920';
  ctx.font = '700 44px "Gowun Batang", "Noto Serif KR", serif';
  ctx.textAlign = 'left';
  
  // Wrap title if needed
  const titleLines = wrapText(ctx, `"${impression.title}"`, 1000);
  titleLines.forEach(line => {
    ctx.fillText(line, 100, nextY);
    nextY += 56;
  });

  nextY += 20;

  // Emotion Shift Pill
  const emotionText = `마음의 여정:  ${impression.emotionBefore}  →  ${impression.emotionAfter} (온기 ${impression.mindTemperature}°C)`;
  ctx.fillStyle = '#e8dfd0';
  ctx.beginPath();
  ctx.roundRect(100, nextY - 32, 850, 48, 24);
  ctx.fill();

  ctx.fillStyle = '#554a3e';
  ctx.font = '500 32px "Noto Sans KR", sans-serif';
  ctx.fillText(emotionText, 124, nextY);

  nextY += 60;

  // Impression Body Content (Serif, line spaced)
  ctx.fillStyle = '#363c33';
  ctx.font = '400 40px "Gowun Batang", "Noto Serif KR", serif';
  const contentLines = wrapText(ctx, impression.content, 1000);
  const maxLines = 8;
  const renderedLines = contentLines.slice(0, maxLines);
  renderedLines.forEach((line) => {
    ctx.fillText(line, 100, nextY);
    nextY += 52;
  });

  if (contentLines.length > maxLines) {
    ctx.fillStyle = '#7a7063';
    ctx.fillText('...', 100, nextY);
    nextY += 40;
  }

  // Footer: Tags & Author Signature
  const footerY = 1380;
  ctx.strokeStyle = '#d2c7b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, footerY - 45);
  ctx.lineTo(1100, footerY - 45);
  ctx.stroke();

  // Tags
  if (impression.tags && impression.tags.length > 0) {
    ctx.fillStyle = '#6e7a68';
    ctx.font = '500 32px "Noto Sans KR", sans-serif';
    ctx.fillText(impression.tags.map(t => `#${t}`).join('   '), 100, footerY);
  }

  // Author Sign
  ctx.fillStyle = '#222920';
  ctx.font = '600 35px "Gowun Batang", "Noto Serif KR", serif';
  ctx.textAlign = 'right';
  ctx.fillText(`사유자  ${impression.authorName}  남김`, 1100, footerY);

  return canvas.toDataURL('image/png');
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split('');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const char = words[i];
    if (char === '\n') {
      lines.push(currentLine);
      currentLine = '';
      continue;
    }
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}
