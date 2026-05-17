import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const API = 'https://functions.poehali.dev/e781b4c7-e823-4b09-82d3-59213c241c6a';

async function api(action: string) {
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) });
  return res.json();
}

interface NewsItem { id: number; title: string; content: string; category: string; image_url: string; created_at: string; }
interface Downloads { android?: { url: string; version: string }; ios?: { url: string; version: string }; }
type Settings = Record<string, string>;

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: (Math.random() * 3 + 1) + 'px',
            height: (Math.random() * 3 + 1) + 'px',
            left: (Math.random() * 100) + '%',
            top: (Math.random() * 100) + '%',
            background: i % 3 === 0 ? '#cc0000' : 'rgba(255,255,255,0.25)',
            animation: `ember ${3 + Math.random() * 4}s ${Math.random() * 5}s ease-out infinite`,
            '--drift': (Math.random() * 40 - 20) + 'px',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = [
    { label: 'Игра', href: '#hero' },
    { label: 'Механики', href: '#mechanics' },
    { label: 'Новости', href: '#news' },
    { label: 'Команда', href: '#team' },
    { label: 'Контакты', href: '#contact' },
  ];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md border-b border-red-900/40' : ''}`}
      style={{ background: scrolled ? 'rgba(10,10,10,0.96)' : 'transparent' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#hero" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background: 'var(--red)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
            <span className="text-white font-black text-[10px]" style={{ fontFamily: 'Orbitron' }}>SK</span>
          </div>
          <span className="text-white font-black tracking-widest text-lg" style={{ fontFamily: 'Orbitron' }}>STANSKILL</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => <a key={l.label} href={l.href} className="nav-link text-sm">{l.label}</a>)}
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'X' : 'Menu'} size={24} />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-red-900/30 px-6 py-4 flex flex-col gap-4" style={{ background: 'rgba(10,10,10,0.98)' }}>
          {links.map(l => <a key={l.label} href={l.href} className="nav-link text-sm py-2" onClick={() => setOpen(false)}>{l.label}</a>)}
        </div>
      )}
    </nav>
  );
}

function Hero({ downloads, settings }: { downloads: Downloads; settings: Settings }) {
  const stat1 = { val: settings.hero_stat1_val || '50K+', label: settings.hero_stat1_label || 'Игроков' };
  const stat2 = { val: settings.hero_stat2_val || '200+', label: settings.hero_stat2_label || 'Карт' };
  const stat3 = { val: settings.hero_stat3_val || '4.8★', label: settings.hero_stat3_label || 'Рейтинг' };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--black)' }}>
      <div className="absolute inset-0">
        <img src="https://cdn.poehali.dev/projects/1460ef91-964e-4ed8-9bef-ef131b375cae/files/8e44f71f-e599-4b60-88eb-13d3c6fa533a.jpg"
          className="w-full h-full object-cover" style={{ opacity: 0.32 }} alt="STANSKILL" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,10,10,0.92) 0%, rgba(80,0,0,0.35) 50%, rgba(10,10,10,0.95) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: 'linear-gradient(transparent, var(--black))' }} />
      </div>
      <div className="absolute inset-0 grid-bg" style={{ opacity: 0.35 }} />
      <Particles />
      <div className="scan-lines absolute inset-0" />
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'linear-gradient(to bottom, transparent, var(--red), var(--red), transparent)' }} />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-red-800/60 animate-fade-in-up"
          style={{ background: 'rgba(139,0,0,0.25)', backdropFilter: 'blur(8px)', fontFamily: 'Oswald' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--red)' }} />
          <span className="text-red-400 text-xs tracking-[0.3em] uppercase">AVALON GAMES · Мобильный шутер</span>
        </div>

        <h1 className="font-black tracking-widest mb-2 animate-fade-in-up delay-100"
          style={{ fontFamily: 'Orbitron', fontSize: 'clamp(3.5rem, 12vw, 8rem)', color: '#fff', textShadow: '0 0 40px rgba(204,0,0,0.9), 0 0 80px rgba(204,0,0,0.4)' }}>
          STAN<span style={{ color: 'var(--red)' }}>SKILL</span>
        </h1>

        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up delay-200">
          <div className="h-px flex-1 max-w-32" style={{ background: 'linear-gradient(to right, transparent, var(--red))' }} />
          <span className="text-red-400 text-sm tracking-[0.5em] uppercase" style={{ fontFamily: 'Oswald' }}>
            {settings.hero_subtitle || 'Вступи в бой'}
          </span>
          <div className="h-px flex-1 max-w-32" style={{ background: 'linear-gradient(to left, transparent, var(--red))' }} />
        </div>

        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300" style={{ fontWeight: 300 }}>
          {settings.hero_description || 'Тактические бои. Реалистичная физика. Бесконечные арены. Только сильнейшие выживают в мире STANSKILL.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
          <a href={downloads.android?.url || '#'} className="btn-red px-8 py-4 text-base rounded flex items-center gap-3 justify-center">
            <Icon name="Smartphone" size={20} />
            <span style={{ fontFamily: 'Oswald' }}>Скачать Android</span>
            {downloads.android?.version && <span className="text-xs opacity-70">v{downloads.android.version}</span>}
          </a>
          <a href={downloads.ios?.url || '#'} className="btn-outline-red px-8 py-4 text-base rounded flex items-center gap-3 justify-center">
            <Icon name="Tablet" size={20} />
            <span style={{ fontFamily: 'Oswald' }}>iOS / App Store</span>
            {downloads.ios?.version && <span className="text-xs opacity-70">v{downloads.ios.version}</span>}
          </a>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-20 max-w-sm mx-auto animate-fade-in-up delay-500">
          {[stat1, stat2, stat3].map(s => (
            <div key={s.val} className="text-center">
              <div className="text-2xl font-black" style={{ fontFamily: 'Orbitron', color: 'var(--red-bright)', textShadow: '0 0 10px rgba(204,0,0,0.6)' }}>{s.val}</div>
              <div className="text-xs text-gray-500 tracking-widest uppercase mt-1" style={{ fontFamily: 'Oswald' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDown" size={24} className="text-red-600" />
      </div>
    </section>
  );
}

function Mechanics() {
  const features = [
    { icon: 'Crosshair', title: 'Тактические бои', desc: 'Реалистичная система прицеливания и перестрелок. Каждый выстрел имеет значение.' },
    { icon: 'Map', title: 'Динамичные карты', desc: 'Более 200 уникальных арен: городские руины, джунгли, заброшенные базы.' },
    { icon: 'Users', title: 'Командный режим', desc: 'Собери отряд из 5 бойцов и подавите противника скоординированными атаками.' },
    { icon: 'Trophy', title: 'Рейтинговые матчи', desc: 'Система рейтинга с сезонными наградами. Попади в топ-100 мировых игроков.' },
    { icon: 'Zap', title: 'Арсенал оружия', desc: '80+ видов оружия с уникальными характеристиками и системой прокачки.' },
    { icon: 'Shield', title: 'Тактическое снаряжение', desc: 'Броня, гранаты, дроны и спецоперации для настоящих профи.' },
  ];
  return (
    <section id="mechanics" className="relative py-32 overflow-hidden" style={{ background: 'var(--black)' }}>
      <div className="absolute inset-0 grid-bg" style={{ opacity: 0.18 }} />
      <div className="absolute top-0 left-0 right-0 red-divider" />
      <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block" style={{ opacity: 0.12 }}>
        <img src="https://cdn.poehali.dev/projects/1460ef91-964e-4ed8-9bef-ef131b375cae/files/b12ebea6-c713-4e9d-a818-03d3069145f2.jpg"
          className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--black), transparent 50%)' }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: 'var(--red)', fontFamily: 'Oswald' }}>— Игровые механики</div>
          <h2 className="text-4xl md:text-6xl font-black text-white" style={{ fontFamily: 'Orbitron' }}>
            БОЕВАЯ<br /><span style={{ color: 'var(--red)' }}>СИСТЕМА</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="game-card p-6 rounded relative overflow-hidden group">
              <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: 'var(--red)' }} />
              <div className="w-12 h-12 flex items-center justify-center mb-4 rounded" style={{ background: 'rgba(204,0,0,0.12)', border: '1px solid rgba(204,0,0,0.25)' }}>
                <Icon name={f.icon} size={22} className="text-red-500" />
              </div>
              <h3 className="text-white font-bold mb-2" style={{ fontFamily: 'Oswald', letterSpacing: '0.05em' }}>{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsSection({ news }: { news: NewsItem[] }) {
  const cats: Record<string, string> = { news: 'Новость', update: 'Обновление', event: 'Событие' };
  return (
    <section id="news" className="relative py-32" style={{ background: 'var(--black-card)' }}>
      <div className="absolute top-0 left-0 right-0 red-divider" />
      <div className="absolute inset-0 stripe-bg" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: 'var(--red)', fontFamily: 'Oswald' }}>— Последнее</div>
          <h2 className="text-4xl md:text-6xl font-black text-white" style={{ fontFamily: 'Orbitron' }}>
            НОВОСТИ<br /><span style={{ color: 'var(--red)' }}>И СОБЫТИЯ</span>
          </h2>
        </div>
        {news.length === 0 ? (
          <div className="text-center py-24">
            <Icon name="Newspaper" size={48} className="text-red-900 mx-auto mb-4" />
            <p className="text-gray-600 text-lg" style={{ fontFamily: 'Oswald' }}>Новости скоро появятся</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map(item => (
              <div key={item.id} className="game-card rounded overflow-hidden group cursor-pointer">
                {item.image_url ? (
                  <div className="h-48 overflow-hidden">
                    <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center" style={{ background: 'rgba(204,0,0,0.06)' }}>
                    <Icon name="Newspaper" size={40} className="text-red-900" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(204,0,0,0.18)', color: 'var(--red-bright)', fontFamily: 'Oswald', letterSpacing: '0.08em' }}>
                      {cats[item.category] || item.category}
                    </span>
                    <span className="text-gray-600 text-xs">{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <h3 className="text-white font-bold mb-2 line-clamp-2" style={{ fontFamily: 'Oswald' }}>{item.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Team({ settings }: { settings: Settings }) {
  const stats = [
    { val: settings.team_stat1_val || '5 лет', label: settings.team_stat1_label || 'Опыта' },
    { val: settings.team_stat2_val || '3', label: settings.team_stat2_label || 'Игры' },
    { val: settings.team_stat3_val || '12', label: settings.team_stat3_label || 'Человек' },
  ];
  return (
    <section id="team" className="relative py-32 overflow-hidden" style={{ background: 'var(--black)' }}>
      <div className="absolute top-0 left-0 right-0 red-divider" />
      <div className="absolute inset-0 grid-bg" style={{ opacity: 0.12 }} />
      <div className="absolute left-0 top-0 bottom-0 w-2/5 hidden lg:block" style={{ opacity: 0.18 }}>
        <img src="https://cdn.poehali.dev/projects/1460ef91-964e-4ed8-9bef-ef131b375cae/files/3da85903-05a2-46cb-b147-5941c77c4779.jpg"
          className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, var(--black), transparent 40%)' }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:pl-[calc(40%+3rem)]">
        <div className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: 'var(--red)', fontFamily: 'Oswald' }}>— Создатели</div>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-8" style={{ fontFamily: 'Orbitron' }}>
          КОМАНДА<br /><span style={{ color: 'var(--red)' }}>AVALON</span>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl">
          {settings.team_description || 'Мы — независимая студия мобильных игр, объединившая разработчиков, художников и геймдизайнеров с единой целью.'}
        </p>
        <div className="flex gap-5 mb-10 flex-wrap">
          {stats.map(s => (
            <div key={s.val} className="game-card p-5 rounded min-w-[100px]">
              <div className="text-3xl font-black mb-1" style={{ fontFamily: 'Orbitron', color: 'var(--red)' }}>{s.val}</div>
              <div className="text-gray-500 text-sm tracking-widest uppercase" style={{ fontFamily: 'Oswald' }}>{s.label}</div>
            </div>
          ))}
        </div>
        {settings.team_quote && (
          <p className="text-gray-500 text-sm leading-relaxed border-l-2 border-red-900 pl-4 max-w-md">
            {settings.team_quote}
          </p>
        )}
      </div>
    </section>
  );
}

function DownloadCTA({ downloads }: { downloads: Downloads }) {
  return (
    <section id="download" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)' }} />
      <div className="absolute inset-0 grid-bg" style={{ opacity: 0.28 }} />
      <div className="absolute top-0 left-0 right-0 red-divider" />
      <Particles />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--red)', fontFamily: 'Oswald' }}>— Скачать</div>
        <h2 className="font-black text-white mb-6" style={{ fontFamily: 'Orbitron', fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
          ГОТОВ<br /><span style={{ color: 'var(--red)' }}>К БОЮ?</span>
        </h2>
        <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
          Скачай STANSKILL прямо сейчас и присоединись к тысячам бойцов по всему миру.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a href={downloads.android?.url || '#'} className="btn-red px-10 py-5 text-lg rounded flex items-center gap-4 justify-center animate-pulse-red">
            <Icon name="Smartphone" size={24} />
            <div className="text-left">
              <div className="text-xs opacity-70 tracking-widest" style={{ fontFamily: 'Oswald' }}>СКАЧАТЬ ДЛЯ</div>
              <div className="font-bold" style={{ fontFamily: 'Oswald' }}>Android</div>
            </div>
          </a>
          <a href={downloads.ios?.url || '#'} className="btn-outline-red px-10 py-5 text-lg rounded flex items-center gap-4 justify-center">
            <Icon name="Tablet" size={24} />
            <div className="text-left">
              <div className="text-xs opacity-70 tracking-widest" style={{ fontFamily: 'Oswald' }}>СКАЧАТЬ ДЛЯ</div>
              <div className="font-bold" style={{ fontFamily: 'Oswald' }}>iOS / App Store</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function Contact({ settings }: { settings: Settings }) {
  const socials = [
    { icon: 'MessageCircle', label: 'Telegram', href: settings.contact_telegram || '#' },
    { icon: 'Instagram', label: 'Instagram', href: settings.contact_instagram || '#' },
    { icon: 'Youtube', label: 'YouTube', href: settings.contact_youtube || '#' },
    { icon: 'Twitter', label: 'Twitter', href: settings.contact_twitter || '#' },
  ];
  return (
    <section id="contact" className="relative py-32" style={{ background: 'var(--black-card)' }}>
      <div className="absolute top-0 left-0 right-0 red-divider" />
      <div className="absolute inset-0 stripe-bg" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: 'var(--red)', fontFamily: 'Oswald' }}>— Связаться</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8" style={{ fontFamily: 'Orbitron' }}>
              КОНТАКТЫ<br /><span style={{ color: 'var(--red)' }}>AVALON</span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Есть вопросы, предложения или хочешь сообщить о баге? Мы на связи.
            </p>
            {settings.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors mb-8">
                <Icon name="Mail" size={18} className="text-red-600" />
                <span>{settings.contact_email}</span>
              </a>
            )}
            <div className="flex gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.href} title={s.label}
                  className="w-11 h-11 flex items-center justify-center rounded border border-red-900/40 text-gray-500 hover:text-white hover:border-red-600 transition-all">
                  <Icon name={s.icon} size={18} />
                </a>
              ))}
            </div>
          </div>
          <div className="game-card p-8 rounded">
            <h3 className="text-white font-bold mb-6 text-xl" style={{ fontFamily: 'Oswald', letterSpacing: '0.05em' }}>НАПИСАТЬ НАМ</h3>
            <div className="space-y-4">
              <input className="dark-input w-full px-4 py-3 rounded text-sm" placeholder="Ваше имя" />
              <input className="dark-input w-full px-4 py-3 rounded text-sm" type="email" placeholder="Email" />
              <textarea className="dark-input w-full px-4 py-3 rounded text-sm h-28 resize-none" placeholder="Сообщение..." />
              <button className="btn-red w-full py-3 rounded text-sm">Отправить сообщение</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="py-10 border-t border-red-900/20" style={{ background: 'var(--black)' }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center" style={{ background: 'var(--red)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
            <span className="text-white font-black text-[8px]" style={{ fontFamily: 'Orbitron' }}>SK</span>
          </div>
          <span className="text-gray-600 text-sm tracking-widest" style={{ fontFamily: 'Orbitron' }}>STANSKILL</span>
        </div>
        <span className="text-gray-700 text-xs">{settings.footer_copyright || '© 2024 AVALON GAMES. Все права защищены.'}</span>
        <a href="#" className="text-gray-700 text-xs hover:text-red-600 transition-colors">Политика конфиденциальности</a>
      </div>
    </footer>
  );
}

export default function Index() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [downloads, setDownloads] = useState<Downloads>({});
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    api('get_news').then(d => { if (Array.isArray(d)) setNews(d); });
    api('get_downloads').then(d => { if (d && !d.error) setDownloads(d); });
    api('get_settings').then(d => { if (d && !d.error) setSettings(d); });
  }, []);

  return (
    <div>
      <Navbar />
      <Hero downloads={downloads} settings={settings} />
      <Mechanics />
      <NewsSection news={news} />
      <Team settings={settings} />
      <DownloadCTA downloads={downloads} />
      <Contact settings={settings} />
      <Footer settings={settings} />
    </div>
  );
}
