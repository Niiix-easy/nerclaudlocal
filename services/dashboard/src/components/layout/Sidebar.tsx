'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Table,
  TerminalSquare,
  Database,
  Users,
  Archive,
  Zap,
  Radio,
  Lightbulb,
  Activity,
  List,
  Blocks,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Visão geral do projeto', href: '/', icon: Home },
    { name: 'Editor de tabelas', href: '/editor', icon: Table },
    { name: 'Editor SQL', href: '/sql-editor', icon: TerminalSquare },
    { name: 'Banco de dados', href: '/database', icon: Database, separator: true },
    { name: 'Autenticação', href: '/auth', icon: Users },
    { name: 'Armazenar', href: '/storage', icon: Archive },
    { name: 'Funções de Borda', href: '/functions', icon: Zap },
    { name: 'Em tempo real', href: '/realtime', icon: Radio },
    { name: 'Conselheiros', href: '/advisors', icon: Lightbulb, separator: true },
    { name: 'Observabilidade', href: '/observability', icon: Activity },
    { name: 'Registros', href: '/logs', icon: List },
    { name: 'Integrações', href: '/integrations', icon: Blocks },
    { name: 'Configurações do proj...', href: '/settings', icon: Settings, separator: true },
  ];

  return (
    <aside className="w-64 bg-[#1c1c1c] text-[#a0a0a0] flex flex-col h-full border-r border-[#333]">
      <div className="p-4 flex items-center gap-2 border-b border-[#333]">
        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-xl">
          N
        </div>
        <span className="text-white font-semibold text-lg">NeerCloud</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <React.Fragment key={item.name}>
                {item.separator && index !== 0 && (
                  <li className="my-3 border-t border-[#333]" />
                )}
                <li>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#333] text-white border-l-2 border-green-500 pl-[14px]'
                        : 'hover:bg-[#2c2c2c] hover:text-white'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-green-500' : ''} />
                    {item.name}
                  </Link>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#333] text-xs">
        NeerCloud v0.1.0
      </div>
    </aside>
  );
};

export default Sidebar;
