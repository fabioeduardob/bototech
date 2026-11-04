import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BotoLogoSvg } from './BotoLogoSvg';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'stack', label: 'Stack' },
  { id: 'sobre', label: 'Sobre' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand logo + wordmark in futuristic Outfit display font */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-[0.14em] text-white hover:text-[#06B6D4] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#06B6D4] rounded"
        >
          <BotoLogoSvg className="w-9 h-9 shrink-0" />
          <span>BOTOTECH</span>
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav aria-label="Navegação Principal" className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                  isActive ? 'text-[#06B6D4]' : 'text-slate-300 hover:text-white'
                } after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:transition-transform after:duration-150 ${
                  isActive
                    ? 'after:scale-x-100 after:bg-[#06B6D4]'
                    : 'after:scale-x-0 after:bg-[#FF4D6D] hover:after:scale-x-100'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contato"
            onClick={(e) => handleLinkClick(e, 'contato')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#FF4D6D] hover:bg-[#FF3358] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-[#FF4D6D]/25 focus-visible:outline-2 focus-visible:outline-[#06B6D4]"
          >
            Iniciar Projeto
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800/70 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menu Mobile"
          className="md:hidden bg-[#0F172A]/95 border-b border-slate-800 px-6 py-4 flex flex-col gap-3"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              className={`py-2.5 text-sm font-medium border-b border-slate-800/60 ${
                activeSection === item.id ? 'text-[#06B6D4]' : 'text-slate-200'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={(e) => handleLinkClick(e, 'contato')}
            className="mt-2 inline-flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-white bg-[#FF4D6D] rounded-lg"
          >
            Iniciar Projeto
          </a>
        </nav>
      )}
    </header>
  );
};
