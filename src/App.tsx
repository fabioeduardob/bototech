/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  Smartphone,
  Cpu,
  ArrowUpRight,
  Github,
  Linkedin,
  MessageCircle,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroFlashlightSection } from './components/HeroFlashlightSection';
import { BotoLogoSvg } from './components/BotoLogoSvg';
import {
  PROJECTS_DATA,
  STACK_ITEMS,
  StackTechItem,
  validateAndBuildWhatsAppContact,
} from './utils/portfolioLogic';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedStackFilter, setSelectedStackFilter] = useState<string>('Todos');
  const [focusedStackItem, setFocusedStackItem] = useState<StackTechItem>(STACK_ITEMS[0]);

  // Contact / WhatsApp Form state
  const [contactName, setContactName] = useState<string>('');
  const [contactType, setContactType] = useState<string>('Simuladores 3D (Three.js / Radar ARPA)');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [generatedWhatsApp, setGeneratedWhatsApp] = useState<{
    url: string;
    preview: string;
  } | null>(null);

  React.useEffect(() => {
    const sections = ['home', 'projetos', 'stack', 'sobre'];
    const onScroll = () => {
      const scrollY = window.scrollY + 240;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSmoothNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAndBuildWhatsAppContact({
      name: contactName,
      projectType: contactType,
      message: contactMessage,
    });

    if (!validation.valid) {
      setContactError(validation.error || 'Verifique os campos informados.');
      setGeneratedWhatsApp(null);
      return;
    }

    setContactError(null);
    setGeneratedWhatsApp({
      url: validation.whatsappUrl!,
      preview: validation.formattedPreview!,
    });
  };

  const filteredStack =
    selectedStackFilter === 'Todos'
      ? STACK_ITEMS
      : STACK_ITEMS.filter((item) => item.layer === selectedStackFilter);

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col">
      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <Navbar activeSection={activeSection} onNavigate={handleSmoothNavigate} />

      <main className="flex-1">
        {/* 1. HERO SECTION WITH MOUSE-FOLLOWING FLASHLIGHT */}
        <HeroFlashlightSection
          onExploreProjects={() => handleSmoothNavigate('projetos')}
        />

        {/* 2. SEÇÃO DE PROJETOS (GRID DE CARDS) */}
        <section id="projetos" className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-3 max-w-2xl">
              <div className="text-xs font-semibold tracking-wider text-[#06B6D4]">
                01. ENGENHARIA APLICADA &amp; PROJETOS
              </div>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Sistemas construídos para precisão, fluidez e independência técnica.
              </h2>
            </div>
          </div>

          {/* CSS Grid of the 3 Core Project Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {PROJECTS_DATA.map((project) => {
              const isCyan = project.accentColor === 'cyan';
              const ProjectIcon =
                project.id === 'simuladores-3d'
                  ? Compass
                  : project.id === 'mobile-flutter'
                  ? Smartphone
                  : Cpu;

              return (
                <article
                  key={project.id}
                  className={`boto-card group flex flex-col justify-between rounded-2xl bg-[#16213B]/75 border border-slate-800 p-7 ${
                    isCyan
                      ? 'hover:border-[#06B6D4] hover:shadow-xl hover:shadow-[#06B6D4]/10'
                      : 'hover:border-[#FF4D6D] hover:shadow-xl hover:shadow-[#FF4D6D]/10'
                  }`}
                >
                  <div className="space-y-5">
                    {/* Clean unboxed metadata kicker (Zero-Pill Discipline) */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        {project.indexNumber}. {project.category}
                      </span>
                      <ProjectIcon
                        className={`w-5 h-5 transition-colors ${
                          isCyan
                            ? 'text-[#06B6D4] group-hover:text-white'
                            : 'text-[#FF4D6D] group-hover:text-white'
                        }`}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-1.5">
                      <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                        {project.title}
                      </h3>
                      <div
                        className={`text-xs font-medium ${
                          isCyan ? 'text-[#06B6D4]' : 'text-[#FF4D6D]'
                        }`}
                      >
                        {project.subtitle}
                      </div>
                    </div>

                    {/* Exact requested description */}
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Architectural Bullet Points */}
                    <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                      {project.architectureHighlights.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span
                            className={`font-semibold mr-1.5 ${
                              isCyan ? 'text-[#06B6D4]' : 'text-[#FF4D6D]'
                            }`}
                          >
                            ›
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer: Unboxed Tech Stack Line + Interactive Sandbox Trigger */}
                  <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-4">
                    {/* Unboxed inline metadata with middle-dot separators */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-slate-400">
                      {project.technologies.map((tech, idx) => (
                        <React.Fragment key={tech}>
                          <span>{tech}</span>
                          {idx < project.technologies.length - 1 && (
                            <span aria-hidden="true" className="text-slate-600">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Quantified metrics row */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="text-left">
                          <div className="text-[11px] text-slate-400">{m.label}</div>
                          <div className="font-mono text-xs font-semibold text-white tabular-nums">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <a
                      href={project.appUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full inline-flex items-center justify-between px-4 py-3 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                        isCyan
                          ? 'bg-[#06B6D4]/15 hover:bg-[#06B6D4] text-[#06B6D4] hover:text-slate-950 border border-[#06B6D4]/40'
                          : 'bg-[#FF4D6D]/15 hover:bg-[#FF4D6D] text-[#FF4D6D] hover:text-white border border-[#FF4D6D]/40'
                      }`}
                    >
                      <span>{project.demoActionLabel}</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. STACK TECNOLÓGICO E INFRAESTRUTURA (#stack) */}
        <section
          id="stack"
          className="border-y border-slate-800/80 bg-[#0B1222] py-24"
        >
          <div className="max-w-[1200px] mx-auto px-6 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="text-xs font-semibold tracking-wider text-[#FF4D6D]">
                  02. STACK TECNOLÓGICO &amp; INFRAESTRUTURA
                </div>
                <h2
                  className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Domínio ponta a ponta: do pixel em WebGL ao servidor IIS dedicado.
                </h2>
              </div>

              {/* Interactive Layer Filter Controls (Segmented Buttons) */}
              <div
                role="group"
                aria-label="Filtrar tecnologias por camada"
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#0F172A] border border-slate-800 rounded-xl"
              >
                {['Todos', 'Front-end & 3D', 'Mobile & Dados', 'Automação & Infra'].map(
                  (filterName) => {
                    const active = selectedStackFilter === filterName;
                    return (
                      <button
                        key={filterName}
                        type="button"
                        onClick={() => setSelectedStackFilter(filterName)}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#FF4D6D] text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {filterName}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Minimalist Grid of the 7 Core Technologies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredStack.map((tech) => {
                const isSelected = focusedStackItem.id === tech.id;
                const isPink = tech.accent === 'pink';
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setFocusedStackItem(tech)}
                    className={`boto-card text-left p-5 rounded-xl bg-[#16213B]/70 border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                      isSelected
                        ? isPink
                          ? 'border-[#FF4D6D] shadow-lg shadow-[#FF4D6D]/15'
                          : 'border-[#06B6D4] shadow-lg shadow-[#06B6D4]/15'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{tech.layer}</span>
                        <span
                          className={`font-mono tabular-nums ${
                            isPink ? 'text-[#FF4D6D]' : 'text-[#06B6D4]'
                          }`}
                        >
                          {tech.metricBadge}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {tech.name}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {tech.roleSummary}
                      </p>
                    </div>

                    <div className="text-xs font-medium text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/70">
                      <span>Especificação técnica</span>
                      <span className={isPink ? 'text-[#FF4D6D]' : 'text-[#06B6D4]'}>→</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. SOBRE MIM (#sobre) */}
        <section id="sobre" className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="max-w-4xl space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-semibold tracking-wider text-[#06B6D4]">
                03. SOBRE O DESENVOLVEDOR — FÁBIO
              </div>

              <h2
                className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Precisão Naval e Agilidade no Código.
              </h2>

              <p className="text-base text-slate-200 leading-relaxed">
                Sou <strong className="text-white font-semibold">Fábio</strong>, desenvolvedor full-stack e fundador da{' '}
                <strong className="text-[#06B6D4] font-semibold">Bototech</strong>. Minha trajetória une a disciplina técnica militar da área de{' '}
                <strong className="text-white font-semibold">hidrografia e navegação</strong> à paixão por projetar arquiteturas de software otimizadas, ágeis e sem dependências excessivas.
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Na navegação costeira e no balizamento náutico, cada grau de marcação e cada segundo contam. Levo exatamente esse rigor para a engenharia de software: seja construindo simuladores 3D de Radar ARPA e balizamento IALA B na Baía de Guanabara com <span className="text-[#06B6D4]">Three.js</span>, aplicativos móveis <span className="text-[#FF4D6D]">Flutter + SQLite</span> que operam 100% offline em campo, ou utilitários web de arquivo único integrados a impressoras térmicas Bluetooth e fluxos <span className="text-white">N8N em VPS Windows Server/IIS próprio</span>.
              </p>
            </div>

            {/* Three Core Engineering Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#06B6D4]">
                  <Compass className="w-4 h-4" aria-hidden="true" />
                  <span>Rigor Hidrográfico</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Simulações fiéis a cartas náuticas, cinemática vetorial e normas IALA B.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FF4D6D]">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                  <span>Zero Inchaço</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Preferência por código nativo (HTML/CSS/JS puro) e pacotes estritamente necessários.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <ShieldCheck className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
                  <span>Infra Própria</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Autonomia em VPS Windows Server, IIS, bancos locais SQLite e automação N8N.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. RODAPÉ & CONTATO RÁPIDO (#contato) */}
      <footer id="contato" className="bg-[#080D1A] border-t border-slate-800/90 pt-20 pb-12">
        <div className="max-w-[1200px] mx-auto px-6 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 6 Columns: Direct Channels & Quick WhatsApp CTA */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <BotoLogoSvg className="w-11 h-11" />
                <span className="font-display text-2xl font-bold tracking-[0.12em] text-white">
                  BOTOTECH
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Pronto para tirar seu projeto do papel com alta performance?
              </h2>

              <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                Entre em contato direto para consultoria, desenvolvimento de simuladores 3D, aplicativos Flutter offline-first ou automações customizadas.
              </p>

              {/* Social Links & Direct WhatsApp Action Button */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://wa.me/5521999999999?text=Ol%C3%A1%20F%C3%A1bio%20(Bototech)!%20Gostaria%20de%20conversar%20sobre%20um%20projeto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-[#FF4D6D] hover:bg-[#FF3358] rounded-xl shadow-lg shadow-[#FF4D6D]/25 transition-all whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contato via WhatsApp</span>
                </a>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub da Bototech"
                  className="inline-flex items-center gap-2 px-4 py-3 text-xs font-medium text-slate-200 hover:text-[#06B6D4] bg-[#0F172A] border border-slate-800 hover:border-[#06B6D4] rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de Fábio — Bototech"
                  className="inline-flex items-center gap-2 px-4 py-3 text-xs font-medium text-slate-200 hover:text-[#06B6D4] bg-[#0F172A] border border-slate-800 hover:border-[#06B6D4] rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Right 6 Columns: Validated Project Briefing Composer for WhatsApp */}
            <div className="lg:col-span-6 rounded-2xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8">
              <h3 className="font-display text-lg font-bold text-white mb-1">
                Briefing Rápido para WhatsApp
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Estruture sua mensagem técnica antes de iniciar a conversa com Fábio:
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Seu Nome ou Empresa
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ex: Comandante Roberto / NavTech"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#080D1A] border border-slate-800 text-white focus:outline-none focus:border-[#06B6D4]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-type"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Frente Técnica
                    </label>
                    <select
                      id="contact-type"
                      value={contactType}
                      onChange={(e) => setContactType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#080D1A] border border-slate-800 text-white focus:outline-none focus:border-[#06B6D4]"
                    >
                      <option value="Simuladores 3D (Three.js / Radar ARPA)">
                        Simuladores 3D (Three.js / Radar ARPA)
                      </option>
                      <option value="App Mobile Offline-First (Flutter + SQLite)">
                        App Mobile Offline-First (Flutter + SQLite)
                      </option>
                      <option value="Web & Automação (HTML/JS / Impressão BLE / N8N)">
                        Web &amp; Automação (HTML/JS / Impressão BLE / N8N)
                      </option>
                      <option value="Infraestrutura VPS Windows Server / IIS">
                        Infraestrutura VPS Windows Server / IIS
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    Resumo da Demanda
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Descreva o cenário, requisitos de performance ou integração desejada..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#080D1A] border border-slate-800 text-white focus:outline-none focus:border-[#06B6D4]"
                  />
                </div>

                {contactError && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-[#FF4D6D]/15 border border-[#FF4D6D] text-xs text-[#FF4D6D]"
                  >
                    {contactError}
                  </div>
                )}

                {generatedWhatsApp && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 space-y-2">
                    <div className="text-xs font-semibold text-emerald-300">
                      Briefing validado e pronto para envio:
                    </div>
                    <pre className="text-xs text-slate-200 whitespace-pre-wrap font-mono">
                      {generatedWhatsApp.preview}
                    </pre>
                    <a
                      href={generatedWhatsApp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#06B6D4] text-slate-950 hover:bg-[#22D3EE] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Abrir Conversa no WhatsApp Agora</span>
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-5 text-xs font-semibold text-white bg-[#FF4D6D] hover:bg-[#FF3358] rounded-xl transition-colors cursor-pointer"
                >
                  Preparar Mensagem para WhatsApp
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Copyright & Quiet Navigation Mirror */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              © {new Date().getFullYear()} BOTOTECH — Fábio. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothNavigate('home');
                }}
                className="hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#projetos"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothNavigate('projetos');
                }}
                className="hover:text-white transition-colors"
              >
                Projetos
              </a>
              <a
                href="#stack"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothNavigate('stack');
                }}
                className="hover:text-white transition-colors"
              >
                Stack
              </a>
              <a
                href="#sobre"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothNavigate('sobre');
                }}
                className="hover:text-white transition-colors"
              >
                Sobre
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
