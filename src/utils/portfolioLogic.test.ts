import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeFlashlightCoordinates,
  calculateArpaTargetMetrics,
  PROJECTS_DATA,
  STACK_ITEMS,
  validateAndBuildWhatsAppContact,
  generateStandaloneVanillaHtml,
} from './portfolioLogic';

test('computeFlashlightCoordinates clamps cursor within container and formats Guanabara coordinates', () => {
  const rect = { left: 100, top: 50, width: 1000, height: 500 };
  const center = computeFlashlightCoordinates(600, 300, rect);

  assert.equal(center.xPx, 500);
  assert.equal(center.yPx, 250);
  assert.equal(center.xPercent, 50);
  assert.equal(center.yPercent, 50);
  assert.match(center.latFormatted, /^22°54\.00'S$/);
  assert.match(center.lonFormatted, /^043°10\.00'W$/);

  const outOfBounds = computeFlashlightCoordinates(10, -20, rect);
  assert.equal(outOfBounds.xPx, 0);
  assert.equal(outOfBounds.yPx, 0);
  assert.equal(outOfBounds.xPercent, 0);
  assert.equal(outOfBounds.yPercent, 0);
});

test('calculateArpaTargetMetrics identifies head-on critical CPA and safe passing vectors', () => {
  // Target 1.5 NM due North, moving South at 12 kts; Own ship moving North at 12 kts -> head-on collision
  const critical = calculateArpaTargetMetrics({
    targetXNm: 0.05,
    targetYNm: 1.5,
    targetCourseDeg: 180,
    targetSpeedKts: 12,
    ownCourseDeg: 0,
    ownSpeedKts: 12,
  });

  assert.equal(critical.collisionRisk, 'CRITICAL');
  assert.ok(critical.cpaNm < 0.35);
  assert.ok(critical.tcpaMin > 0 && critical.tcpaMin < 10);

  // Target well clear to East moving away
  const safe = calculateArpaTargetMetrics({
    targetXNm: 2.4,
    targetYNm: 1.8,
    targetCourseDeg: 90,
    targetSpeedKts: 10,
    ownCourseDeg: 0,
    ownSpeedKts: 8,
  });

  assert.equal(safe.collisionRisk, 'SAFE');
  assert.equal(safe.rangeNm, 3);
});

test('PROJECTS_DATA and STACK_ITEMS contain all required Bototech specifications', () => {
  assert.equal(PROJECTS_DATA.length, 3);
  assert.equal(PROJECTS_DATA[0].title, 'Simuladores 3D');
  assert.equal(PROJECTS_DATA[0].appUrl, 'https://simuladornavio.bototech.com.br/');
  assert.equal(PROJECTS_DATA[1].title, 'Calculadora de Coordenadas Geográficas');
  assert.equal(PROJECTS_DATA[1].appUrl, 'https://calgeo.bototech.com.br/');
  assert.equal(PROJECTS_DATA[2].title, 'Web & Automação');
  assert.equal(PROJECTS_DATA[2].appUrl, 'https://impressora.bototech.com.br/');

  const stackNames = STACK_ITEMS.map((item) => item.name);
  assert.deepEqual(stackNames, [
    'HTML/JS Vanilla',
    'Three.js',
    'Flutter',
    'SQLite',
    'N8N',
    'Windows Server',
    'IIS',
  ]);
});

test('validateAndBuildWhatsAppContact rejects invalid fields and formats valid payload', () => {
  const emptyResult = validateAndBuildWhatsAppContact({
    name: 'F',
    projectType: 'Simuladores 3D',
    message: 'Curto',
  });
  assert.equal(emptyResult.valid, false);
  assert.ok(emptyResult.error);

  const validResult = validateAndBuildWhatsAppContact({
    name: 'Comandante Marcos',
    projectType: 'Simuladores 3D (Three.js / Radar ARPA)',
    message: 'Precisamos de um simulador de manobra IALA B para treinamento na Baía de Guanabara.',
  });
  assert.equal(validResult.valid, true);
  assert.ok(validResult.whatsappUrl?.startsWith('https://wa.me/'));
  assert.ok(validResult.formattedPreview?.includes('Comandante Marcos'));
});

test('generateStandaloneVanillaHtml outputs valid self-contained HTML with flashlight script', () => {
  const html = generateStandaloneVanillaHtml();
  assert.ok(html.includes('<!DOCTYPE html>'));
  assert.ok(html.includes('Desenvolvimento Full-Stack, Simulações 3D e Apps.'));
  assert.ok(html.includes('--mouse-x'));
});
