export interface FlashlightPosition {
  xPx: number;
  yPx: number;
  xPercent: number;
  yPercent: number;
  latFormatted: string;
  lonFormatted: string;
}

export interface BoundingBoxRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Computes clamped cursor position inside the hero container and interpolates
 * real Guanabara Bay (Baía de Guanabara - RJ) hydrographic coordinates.
 */
export function computeFlashlightCoordinates(
  clientX: number,
  clientY: number,
  rect: BoundingBoxRect
): FlashlightPosition {
  const safeWidth = Math.max(1, rect.width);
  const safeHeight = Math.max(1, rect.height);

  const rawX = clientX - rect.left;
  const rawY = clientY - rect.top;

  const xPx = Math.max(0, Math.min(safeWidth, Math.round(rawX)));
  const yPx = Math.max(0, Math.min(safeHeight, Math.round(rawY)));

  const xPercent = Number(((xPx / safeWidth) * 100).toFixed(2));
  const yPercent = Number(((yPx / safeHeight) * 100).toFixed(2));

  // Guanabara Bay entrance to Rio-Niterói bridge hydrographic bounding box:
  // Lat: 22° 50.0' S to 22° 58.0' S
  // Lon: 043° 07.0' W to 043° 13.0' W
  const latMinutes = (50 + (yPercent / 100) * 8).toFixed(2);
  const lonMinutes = (13 - (xPercent / 100) * 6).toFixed(2);

  return {
    xPx,
    yPx,
    xPercent,
    yPercent,
    latFormatted: `22°${latMinutes.padStart(5, '0')}'S`,
    lonFormatted: `043°${lonMinutes.padStart(5, '0')}'W`,
  };
}

export interface ArpaVesselInput {
  targetXNm: number; // East-West offset in Nautical Miles
  targetYNm: number; // North-South offset in Nautical Miles
  targetCourseDeg: number;
  targetSpeedKts: number;
  ownCourseDeg: number;
  ownSpeedKts: number;
}

export interface ArpaKinematicsResult {
  rangeNm: number;
  bearingDeg: number;
  cpaNm: number;
  tcpaMin: number;
  collisionRisk: 'SAFE' | 'CAUTION' | 'CRITICAL';
  ialaBAction: string;
}

/**
 * Computes real naval ARPA radar target metrics (Range, True Bearing, CPA, TCPA)
 * and IALA Region B navigation rules for Guanabara Bay channel approach.
 */
export function calculateArpaTargetMetrics(input: ArpaVesselInput): ArpaKinematicsResult {
  const { targetXNm, targetYNm, targetCourseDeg, targetSpeedKts, ownCourseDeg, ownSpeedKts } = input;

  const rangeNm = Number(Math.hypot(targetXNm, targetYNm).toFixed(2));
  const rawBearing = (Math.atan2(targetXNm, targetYNm) * 180) / Math.PI;
  const bearingDeg = Math.round((rawBearing + 360) % 360);

  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  // Velocity vectors in knots (x = East, y = North)
  const ownVx = ownSpeedKts * Math.sin(degToRad(ownCourseDeg));
  const ownVy = ownSpeedKts * Math.cos(degToRad(ownCourseDeg));

  const tgtVx = targetSpeedKts * Math.sin(degToRad(targetCourseDeg));
  const tgtVy = targetSpeedKts * Math.cos(degToRad(targetCourseDeg));

  const relVx = tgtVx - ownVx;
  const relVy = tgtVy - ownVy;
  const relSpeedSq = relVx * relVx + relVy * relVy;

  let tcpaHours = 0;
  let cpaNm = rangeNm;

  if (relSpeedSq > 0.0001) {
    // Dot product of relative position and relative velocity
    tcpaHours = -(targetXNm * relVx + targetYNm * relVy) / relSpeedSq;
    if (tcpaHours > 0) {
      const cpaX = targetXNm + relVx * tcpaHours;
      const cpaY = targetYNm + relVy * tcpaHours;
      cpaNm = Number(Math.hypot(cpaX, cpaY).toFixed(2));
    } else {
      tcpaHours = 0;
      cpaNm = rangeNm;
    }
  }

  const tcpaMin = Number((tcpaHours * 60).toFixed(1));

  let collisionRisk: 'SAFE' | 'CAUTION' | 'CRITICAL' = 'SAFE';
  if (tcpaMin > 0 && cpaNm < 0.35 && tcpaMin <= 15) {
    collisionRisk = 'CRITICAL';
  } else if (tcpaMin > 0 && cpaNm < 0.75 && tcpaMin <= 25) {
    collisionRisk = 'CAUTION';
  }

  const ialaBAction =
    collisionRisk === 'CRITICAL'
      ? 'Manobra imediata: guinar a Boreste (balizas verdes IALA B a BE na entrada do canal).'
      : collisionRisk === 'CAUTION'
      ? 'Monitorar vetor relativo ARPA e manter canal de varredura Cotunduba-Fiscal.'
      : 'Vetor livre. Prosseguir no alinhamento do canal principal IALA B.';

  return {
    rangeNm,
    bearingDeg,
    cpaNm,
    tcpaMin,
    collisionRisk,
    ialaBAction,
  };
}

export interface ProjectCardItem {
  id: 'simuladores-3d' | 'mobile-flutter' | 'web-automacao';
  indexNumber: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: 'pink' | 'cyan';
  technologies: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  architectureHighlights: string[];
  demoActionLabel: string;
  appUrl: string;
}

export const PROJECTS_DATA: ProjectCardItem[] = [
  {
    id: 'simuladores-3d',
    indexNumber: '01',
    category: 'Simuladores 3D & Engenharia Naval',
    title: 'Simuladores 3D',
    subtitle: 'Radar ARPA, Baía de Guanabara e Balizamento IALA B',
    description:
      'Simuladores de Radar ARPA, cenários de navegação na Baía de Guanabara e balizamento IALA B desenvolvidos com Three.js.',
    accentColor: 'cyan',
    technologies: ['Three.js', 'WebGL', 'HTML/JS Vanilla', 'Cinemática ARPA', 'IALA B'],
    metrics: [
      { label: 'Taxa de Quadros', value: '60 FPS estáveis' },
      { label: 'Precisão Cartográfica', value: '0.01 MN (CPA/TCPA)' },
      { label: 'Dependências Extras', value: 'Zero bloat' },
    ],
    architectureHighlights: [
      'Renderização 3D otimizada em Three.js reproduzindo o relevo costeiro e alinhamentos da Baía de Guanabara (Pão de Açúcar, Ilha Fiscal, Ponte Rio-Niterói).',
      'Sinalização náutica noturna e diurna fiel ao padrão IALA Região B (Encarnado a Bombordo, Verde a Boreste na entrada do porto) com curvas rítmicas de luzes (Lp, Oc, Iso).',
      'Cálculo vetorial em tempo real para plote radar ARPA: distância, marcação verdadeira, CPA (ponto de maior aproximação) e TCPA.',
    ],
    demoActionLabel: 'Acessar Simulador Naval',
    appUrl: 'https://simuladornavio.bototech.com.br/',
  },
  {
    id: 'mobile-flutter',
    indexNumber: '02',
    category: 'Engenharia Mobile Offline-First',
    title: 'Mobile',
    subtitle: 'Flutter de Alta Performance & Persistência SQLite',
    description:
      'Aplicativos desenvolvidos em Flutter utilizando SQLite para alta performance offline e arquitetura limpa.',
    accentColor: 'pink',
    technologies: ['Flutter', 'Dart', 'SQLite', 'Clean Architecture', 'Sync Engine'],
    metrics: [
      { label: 'Consulta Local SQLite', value: '< 1.8 ms (10k linhas)' },
      { label: 'Disponibilidade em Campo', value: '100% Offline-First' },
      { label: 'Inicialização Cold-Start', value: '380 ms' },
    ],
    architectureHighlights: [
      'Camadas estritamente desacopladas (Domain, Data, Presentation) sem dependência de pacotes inchados de terceiros.',
      'Modelagem relacional SQLite com índices compostos, transações atômicas em lote (Batch) e fila determinística de sincronização.',
      'Projetado para operação crítica em embarcações, armazéns e áreas remotas sem cobertura de dados móveis.',
    ],
    demoActionLabel: 'Acessar CalGeo',
    appUrl: 'https://calgeo.bototech.com.br/',
  },
  {
    id: 'web-automacao',
    indexNumber: '03',
    category: 'Utilitários Web, Hardware & Orquestração',
    title: 'Web & Automação',
    subtitle: 'Single-File Apps, Impressão Bluetooth & Fluxos N8N',
    description:
      'Utilitários de arquivo único (HTML/JS), integração para impressão térmica Bluetooth, automações via n8n e webhooks rodando em VPS próprio.',
    accentColor: 'cyan',
    technologies: ['HTML/JS Vanilla', 'Web Bluetooth ESC/POS', 'N8N', 'Webhooks', 'VPS Windows Server / IIS'],
    metrics: [
      { label: 'Tamanho de Utilitário', value: '< 45 KB (Arquivo Único)' },
      { label: 'Impressão Térmica BLE', value: '220 ms / cupom' },
      { label: 'Latência de Webhook VPS', value: '34 ms (IIS + N8N)' },
    ],
    architectureHighlights: [
      'Ferramentas auto-contidas em um único arquivo .html (HTML5 + CSS3 + JS Vanilla) prontas para execução instantânea em qualquer navegador.',
      'Comunicação direta via Web Bluetooth API enviando comandos binários ESC/POS para impressoras térmicas portáteis de 58mm/80mm.',
      'Pipelines N8N e ouvintes de Webhook auto-hospedados em VPS próprio com Windows Server e IIS ajustado para máxima confiabilidade.',
    ],
    demoActionLabel: 'Acessar Utilitário de Impressão',
    appUrl: 'https://impressora.bototech.com.br/',
  },
];

export interface StackTechItem {
  id: string;
  name: string;
  layer: 'Front-end & 3D' | 'Mobile & Dados' | 'Automação & Infra';
  roleSummary: string;
  technicalDetail: string;
  metricBadge: string;
  accent: 'pink' | 'cyan';
}

export const STACK_ITEMS: StackTechItem[] = [
  {
    id: 'html-js-vanilla',
    name: 'HTML/JS Vanilla',
    layer: 'Front-end & 3D',
    roleSummary: 'Utilitários de arquivo único e interfaces ultra-rápidas sem dependências.',
    technicalDetail:
      'Manipulação direta do DOM, CSS Grid/Flexbox moderno, Web APIs nativas (Bluetooth, Canvas, Storage) e zero overhead de bundlers pesados.',
    metricBadge: '0 KB Overhead',
    accent: 'pink',
  },
  {
    id: 'threejs',
    name: 'Three.js',
    layer: 'Front-end & 3D',
    roleSummary: 'Simulação hidrográfica 3D, Radar ARPA e balizamento náutico IALA B.',
    technicalDetail:
      'Cenas WebGL otimizadas para treinamento de navegação costeira na Baía de Guanabara, luzes rítmicas de boias/faróis e cinemática vetorial.',
    metricBadge: 'WebGL 60 FPS',
    accent: 'cyan',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    layer: 'Mobile & Dados',
    roleSummary: 'Aplicativos móveis nativos compilados com Clean Architecture.',
    technicalDetail:
      'Interfaces fluidas a 60/120fps, controle total de ciclo de vida, integração com sensores e periféricos Bluetooth.',
    metricBadge: 'Compilação Nativa',
    accent: 'pink',
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    layer: 'Mobile & Dados',
    roleSummary: 'Motor relacional embarcado para persistência 100% offline-first.',
    technicalDetail:
      'Consultas indexadas em milissegundos, integridade ACID, migrações versionadas e sincronização resiliente quando a conexão retorna.',
    metricBadge: '< 2ms Query',
    accent: 'cyan',
  },
  {
    id: 'n8n',
    name: 'N8N',
    layer: 'Automação & Infra',
    roleSummary: 'Orquestração de workflows, webhooks e integrações de API.',
    technicalDetail:
      'Automação de processos críticos de negócio, disparo de eventos assíncronos, transformação de payloads JSON e integração com mensageria.',
    metricBadge: 'Auto-Hospedado',
    accent: 'pink',
  },
  {
    id: 'windows-server',
    name: 'Windows Server',
    layer: 'Automação & Infra',
    roleSummary: 'Infraestrutura VPS dedicada, endurecida e sob controle total.',
    technicalDetail:
      'Administração de serviços em background, políticas de segurança, rotinas automatizadas de backup e monitoramento contínuo.',
    metricBadge: 'VPS Próprio',
    accent: 'cyan',
  },
  {
    id: 'iis',
    name: 'IIS',
    layer: 'Automação & Infra',
    roleSummary: 'Servidor web e proxy reverso de baixa latência no Windows Server.',
    technicalDetail:
      'Hospedagem de aplicações web, terminação TLS/SSL, roteamento de webhooks para instâncias N8N e compressão estática otimizada.',
    metricBadge: 'Proxy & TLS',
    accent: 'pink',
  },
];

export interface ContactFormInput {
  name: string;
  projectType: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  error?: string;
  whatsappUrl?: string;
  formattedPreview?: string;
}

export function validateAndBuildWhatsAppContact(input: ContactFormInput): ContactValidationResult {
  const cleanName = input.name.trim();
  const cleanType = input.projectType.trim();
  const cleanMessage = input.message.trim();

  if (cleanName.length < 2) {
    return {
      valid: false,
      error: 'Informe seu nome (mínimo de 2 caracteres) para iniciar o contato.',
    };
  }

  if (!cleanType) {
    return {
      valid: false,
      error: 'Selecione a frente técnica do projeto.',
    };
  }

  if (cleanMessage.length < 10) {
    return {
      valid: false,
      error: 'Descreva brevemente sua demanda (mínimo de 10 caracteres).',
    };
  }

  const text = `Olá Fábio (Bototech)! Meu nome é ${cleanName}.\nFrente de interesse: ${cleanType}.\nResumo do projeto: ${cleanMessage}`;
  const encoded = encodeURIComponent(text);

  return {
    valid: true,
    formattedPreview: text,
    whatsappUrl: `https://wa.me/5521999999999?text=${encoded}`,
  };
}

/**
 * Generates the standalone single-file Vanilla HTML/CSS/JS source code of the Bototech
 * portfolio page so users or developers can inspect or download the dependency-free artifact.
 */
export function generateStandaloneVanillaHtml(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BOTOTECH — Desenvolvimento Full-Stack, Simulações 3D e Apps</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg-navy: #0F172A;
      --bg-surface: #16213B;
      --boto-pink: #FF4D6D;
      --boto-cyan: #06B6D4;
      --text-white: #F8FAFC;
      --text-muted: #94A3B8;
      --mouse-x: 50%;
      --mouse-y: 45%;
      --radius: 500px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-navy); color: var(--text-white); }
    h1, h2, h3, .brand { font-family: 'Outfit', sans-serif; }
    header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 50;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 2rem; background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .brand { font-size: 1.35rem; font-weight: 700; letter-spacing: 0.08em; color: var(--text-white); text-decoration: none; }
    .brand span { color: var(--boto-pink); }
    nav { display: flex; gap: 2rem; }
    nav a { color: var(--text-muted); text-decoration: none; font-size: 0.95rem; transition: color 0.18s ease; }
    nav a:hover { color: var(--boto-cyan); }
    .hero {
      position: relative; min-height: 100vh; display: flex; align-items: center;
      padding: 7rem 2rem 4rem; overflow: hidden; background: #090F1E;
    }
    .hero-bg {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      opacity: 0.92; pointer-events: none;
      -webkit-mask-image: radial-gradient(circle var(--radius) at var(--mouse-x) var(--mouse-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0) 100%);
      mask-image: radial-gradient(circle var(--radius) at var(--mouse-x) var(--mouse-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0) 100%);
    }
    .hero-content { position: relative; z-index: 2; max-width: 780px; margin: 0 auto; text-align: left; }
    .hero h1 { font-size: clamp(2.25rem, 4.5vw, 3.75rem); line-height: 1.1; margin-bottom: 1.25rem; }
    .hero p { font-size: 1.2rem; color: var(--text-muted); margin-bottom: 2rem; }
    .btn-pink {
      display: inline-block; background: var(--boto-pink); color: #fff;
      padding: 0.9rem 1.8rem; border-radius: 0.5rem; font-weight: 600;
      text-decoration: none; transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .btn-pink:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255, 77, 109, 0.35); }
    section { max-width: 1200px; margin: 0 auto; padding: 5rem 2rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 2.5rem; }
    .card {
      background: var(--bg-surface); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 1rem; padding: 2rem; transition: transform 0.18s ease, border-color 0.18s ease;
    }
    .card:hover { transform: translateY(-4px); border-color: var(--boto-cyan); }
    .stack-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 2rem; }
    .stack-item {
      padding: 1rem; background: var(--bg-surface); border: 1px solid rgba(6, 182, 212, 0.25);
      border-radius: 0.75rem; text-align: center; font-weight: 600;
    }
  </style>
</head>
<body>
  <header>
    <a href="#home" class="brand">BOTO<span>TECH</span></a>
    <nav>
      <a href="#home">Home</a>
      <a href="#projetos">Projetos</a>
      <a href="#stack">Stack</a>
      <a href="#sobre">Sobre</a>
    </nav>
  </header>
  <section id="home" class="hero">
    <img src="/assets/aistudio/Hero_Section_Background_09180758.jpg" alt="Cena Naval Baía de Guanabara e Boto" class="hero-bg" />
    <div class="hero-content">
      <h1>Desenvolvimento Full-Stack, Simulações 3D e Apps.</h1>
      <p>Soluções independentes e de alta performance.</p>
      <a href="#projetos" class="btn-pink">Explorar Projetos</a>
    </div>
  </section>
  <script>
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      hero.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
  </script>
</body>
</html>`;
}
