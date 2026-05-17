import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const API = 'https://functions.poehali.dev/e781b4c7-e823-4b09-82d3-59213c241c6a';

async function api(action: string, extra: object = {}, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['X-Auth-Token'] = token;
  const res = await fetch(API, { method: 'POST', headers, body: JSON.stringify({ action, ...extra }) });
  return res.json();
}

interface NewsItem { id: number; title: string; content: string; category: string; image_url: string; created_at: string; published: boolean; }
interface Downloads { android?: { url: string; version: string }; ios?: { url: string; version: string }; }

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

function Navbar({ onAdmin }: { onAdmin: () => void }) {
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
          <button onClick={onAdmin} className="btn-outline-red px-4 py-1.5 text-xs rounded">Войти</button>
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'X' : 'Menu'} size={24} />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-red-900/30 px-6 py-4 flex flex-col gap-4" style={{ background: 'rgba(10,10,10,0.98)' }}>
          {links.map(l => <a key={l.label} href={l.href} className="nav-link text-sm py-2" onClick={() => setOpen(false)}>{l.label}</a>)}
          <button onClick={() => { onAdmin(); setOpen(false); }} className="btn-outline-red px-4 py-2 text-xs rounded w-full">Войти в панель</button>
        </div>
      )}
    </nav>
  );
}

function Hero({ downloads }: { downloads: Downloads }) {
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
          <span className="text-red-400 text-sm tracking-[0.5em] uppercase" style={{ fontFamily: 'Oswald' }}>Вступи в бой</span>
          <div className="h-px flex-1 max-w-32" style={{ background: 'linear-gradient(to left, transparent, var(--red))' }} />
        </div>

        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300" style={{ fontWeight: 300 }}>
          Тактические бои. Реалистичная физика. Бесконечные арены.<br />Только сильнейшие выживают в мире STANSKILL.
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
          {[{ val: '50K+', label: 'Игроков' }, { val: '200+', label: 'Карт' }, { val: '4.8★', label: 'Рейтинг' }].map(s => (
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
          {features.map((f) => (
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

function Team() {
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
          Мы — независимая студия мобильных игр, объединившая разработчиков, художников и геймдизайнеров с единой целью: создать мобильный шутер, которого ещё не было.
        </p>
        <div className="grid grid-cols-2 gap-5 mb-10 max-w-sm">
          {[{ n: '5 лет', l: 'Опыта' }, { n: '3', l: 'Игры' }, { n: '12', l: 'Человек' }, { n: '100%', l: 'Страсть' }].map(s => (
            <div key={s.n} className="game-card p-5 rounded">
              <div className="text-3xl font-black mb-1" style={{ fontFamily: 'Orbitron', color: 'var(--red)' }}>{s.n}</div>
              <div className="text-gray-500 text-sm tracking-widest uppercase" style={{ fontFamily: 'Oswald' }}>{s.l}</div>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm leading-relaxed border-l-2 border-red-900 pl-4 max-w-md">
          AVALON — это не просто команда. Это братство людей, которые верят, что лучшие игры рождаются из страсти, а не из денег.
        </p>
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

function Contact() {
  const socials = [
    { icon: 'MessageCircle', label: 'Telegram', href: '#' },
    { icon: 'Instagram', label: 'Instagram', href: '#' },
    { icon: 'Youtube', label: 'YouTube', href: '#' },
    { icon: 'Twitter', label: 'Twitter', href: '#' },
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
            <a href="mailto:support@avalon.games" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors mb-8">
              <Icon name="Mail" size={18} className="text-red-600" />
              <span>support@avalon.games</span>
            </a>
            <div className="flex gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.href} title={s.label}
                  className="w-11 h-11 flex items-center justify-center rounded border border-red-900/40 text-gray-500 hover:text-white hover:border-red-600 transition-all"
                  style={{ background: 'rgba(204,0,0,0)' }}>
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

function Footer() {
  return (
    <footer className="py-10 border-t border-red-900/20" style={{ background: 'var(--black)' }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center" style={{ background: 'var(--red)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
            <span className="text-white font-black text-[8px]" style={{ fontFamily: 'Orbitron' }}>SK</span>
          </div>
          <span className="text-gray-600 text-sm tracking-widest" style={{ fontFamily: 'Orbitron' }}>STANSKILL</span>
        </div>
        <span className="text-gray-700 text-xs">© 2024 AVALON GAMES. Все права защищены.</span>
        <a href="#" className="text-gray-700 text-xs hover:text-red-600 transition-colors">Политика конфиденциальности</a>
      </div>
    </footer>
  );
}

function AdminLogin({ onLogin }: { onLogin: (token: string, username: string) => void; onClose: () => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = await api('login', { username: user, password: pass });
    setLoading(false);
    if (data.error) return setError(data.error);
    onLogin(data.token, data.username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--black)' }}>
      <div className="absolute inset-0 grid-bg" style={{ opacity: 0.18 }} />
      <Particles />
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4 animate-pulse-red"
            style={{ background: 'var(--red)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
            <Icon name="Lock" size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest" style={{ fontFamily: 'Orbitron' }}>ADMIN</h1>
          <p className="text-gray-600 text-sm mt-1" style={{ fontFamily: 'Oswald' }}>STANSKILL · AVALON</p>
        </div>
        <div className="game-card p-8 rounded box-red-glow">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>Логин</label>
              <input className="dark-input w-full px-4 py-3 rounded" value={user} onChange={e => setUser(e.target.value)} placeholder="admin" required />
            </div>
            <div>
              <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>Пароль</label>
              <input className="dark-input w-full px-4 py-3 rounded" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center py-2 rounded" style={{ background: 'rgba(204,0,0,0.1)' }}>{error}</div>
            )}
            <button type="submit" disabled={loading} className="btn-red w-full py-3 rounded mt-2">
              {loading ? 'Вход...' : 'Войти в панель'}
            </button>
          </form>
        </div>
        <p className="text-gray-700 text-xs text-center mt-4">Логин: admin · Пароль: Avalon2024!</p>
      </div>
    </div>
  );
}

function AdminPanel({ token, username, onLogout }: { token: string; username: string; onLogout: () => void }) {
  const [tab, setTab] = useState<'downloads' | 'news'>('downloads');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [downloads, setDownloads] = useState<Downloads>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const [androidUrl, setAndroidUrl] = useState('');
  const [androidVer, setAndroidVer] = useState('');
  const [iosUrl, setIosUrl] = useState('');
  const [iosVer, setIosVer] = useState('');

  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'news', image_url: '', published: true });

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const [nd, nn] = await Promise.all([api('get_downloads'), api('get_news_all', {}, token)]);
    if (nd && !nd.error) {
      setDownloads(nd);
      setAndroidUrl(nd.android?.url || '');
      setAndroidVer(nd.android?.version || '');
      setIosUrl(nd.ios?.url || '');
      setIosVer(nd.ios?.version || '');
    }
    if (Array.isArray(nn)) setNews(nn);
    setLoading(false);
  }

  async function saveDownloads() {
    setLoading(true);
    await api('update_downloads', { android: { url: androidUrl, version: androidVer }, ios: { url: iosUrl, version: iosVer } }, token);
    flash('Ссылки сохранены!');
    setLoading(false);
  }

  async function saveNews() {
    setLoading(true);
    if (editing) {
      await api('update_news', { id: editing.id, ...form }, token);
      flash('Новость обновлена!');
    } else {
      await api('create_news', form, token);
      flash('Новость создана!');
    }
    setEditing(null);
    setForm({ title: '', content: '', category: 'news', image_url: '', published: true });
    await loadAll();
    setLoading(false);
  }

  async function deleteNews(id: number) {
    if (!confirm('Удалить новость?')) return;
    setLoading(true);
    await api('delete_news', { id }, token);
    flash('Удалено');
    await loadAll();
    setLoading(false);
  }

  function startEdit(item: NewsItem) {
    setEditing(item);
    setForm({ title: item.title, content: item.content, category: item.category, image_url: item.image_url || '', published: item.published });
    setTab('news');
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--black)' }}>
      <header className="border-b border-red-900/30 sticky top-0 z-50 backdrop-blur-md" style={{ background: 'rgba(10,10,10,0.96)' }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center" style={{ background: 'var(--red)', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
              <span className="text-white font-black text-[9px]" style={{ fontFamily: 'Orbitron' }}>SK</span>
            </div>
            <span className="text-white font-bold tracking-widest text-sm" style={{ fontFamily: 'Orbitron' }}>ADMIN PANEL</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-xs hidden sm:block" style={{ fontFamily: 'Oswald' }}>{username}</span>
            <button onClick={onLogout} className="btn-outline-red px-3 py-1 text-xs rounded flex items-center gap-1">
              <Icon name="LogOut" size={14} />Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {msg && (
          <div className="mb-6 px-4 py-3 rounded text-sm font-bold"
            style={{ background: 'rgba(204,0,0,0.12)', border: '1px solid rgba(204,0,0,0.4)', color: 'var(--red-bright)', fontFamily: 'Oswald', letterSpacing: '0.05em' }}>
            ✓ {msg}
          </div>
        )}

        <div className="flex gap-3 mb-8 flex-wrap">
          {([['downloads', 'Ссылки скачивания', 'Download'], ['news', 'Новости и события', 'Newspaper']] as const).map(([t, l, ic]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded text-sm transition-all ${tab === t ? 'btn-red' : 'btn-outline-red'}`}
              style={{ fontFamily: 'Oswald', letterSpacing: '0.05em' }}>
              <Icon name={ic as any} size={16} />{l}
            </button>
          ))}
        </div>

        {tab === 'downloads' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {[
                { label: 'Android', icon: 'Smartphone', url: androidUrl, setUrl: setAndroidUrl, ver: androidVer, setVer: setAndroidVer },
                { label: 'iOS', icon: 'Tablet', url: iosUrl, setUrl: setIosUrl, ver: iosVer, setVer: setIosVer },
              ].map(p => (
                <div key={p.label} className="game-card p-6 rounded">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded" style={{ background: 'rgba(204,0,0,0.12)' }}>
                      <Icon name={p.icon as any} size={20} className="text-red-500" />
                    </div>
                    <h3 className="text-white font-bold" style={{ fontFamily: 'Oswald', fontSize: '1.1rem' }}>{p.label}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>Ссылка на скачивание</label>
                      <input className="dark-input w-full px-3 py-2.5 rounded text-sm" placeholder="https://play.google.com/..." value={p.url} onChange={e => p.setUrl(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>Версия</label>
                      <input className="dark-input w-full px-3 py-2.5 rounded text-sm" placeholder="1.0.0" value={p.ver} onChange={e => p.setVer(e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveDownloads} disabled={loading} className="btn-red px-8 py-3 rounded flex items-center gap-2">
              <Icon name="Save" size={18} />
              {loading ? 'Сохраняю...' : 'Сохранить ссылки'}
            </button>
          </div>
        )}

        {tab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="game-card p-6 rounded">
              <h3 className="text-white font-bold mb-5" style={{ fontFamily: 'Oswald', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                {editing ? 'Редактировать' : 'Новая запись'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>Заголовок</label>
                  <input className="dark-input w-full px-3 py-2.5 rounded text-sm" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Заголовок..." />
                </div>
                <div>
                  <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>Категория</label>
                  <select className="dark-input w-full px-3 py-2.5 rounded text-sm cursor-pointer" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="news">Новость</option>
                    <option value="update">Обновление</option>
                    <option value="event">Событие</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>Текст</label>
                  <textarea className="dark-input w-full px-3 py-2.5 rounded text-sm h-28 resize-none" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Текст новости..." />
                </div>
                <div>
                  <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>Изображение (URL)</label>
                  <input className="dark-input w-full px-3 py-2.5 rounded text-sm" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="cursor-pointer accent-red-600" />
                  <label htmlFor="pub" className="text-gray-400 text-sm cursor-pointer" style={{ fontFamily: 'Oswald' }}>Опубликовать</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={saveNews} disabled={loading} className="btn-red px-6 py-2.5 rounded flex items-center gap-2 text-sm flex-1">
                    <Icon name="Save" size={16} />
                    {editing ? 'Сохранить изменения' : 'Создать'}
                  </button>
                  {editing && (
                    <button onClick={() => { setEditing(null); setForm({ title: '', content: '', category: 'news', image_url: '', published: true }); }}
                      className="btn-outline-red px-4 py-2.5 rounded text-sm">
                      Отмена
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {news.length === 0 && (
                <div className="text-center py-16 text-gray-600" style={{ fontFamily: 'Oswald' }}>Записей пока нет</div>
              )}
              {news.map(item => (
                <div key={item.id} className="game-card p-4 rounded flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(204,0,0,0.18)', color: 'var(--red-bright)', fontFamily: 'Oswald' }}>
                        {item.category}
                      </span>
                      {!item.published && <span className="text-xs text-gray-600">(скрыто)</span>}
                      <span className="text-gray-600 text-xs">{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <p className="text-white text-sm font-medium truncate" style={{ fontFamily: 'Oswald' }}>{item.title}</p>
                    <p className="text-gray-600 text-xs mt-0.5 line-clamp-1">{item.content}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(item)} className="w-8 h-8 flex items-center justify-center rounded border border-red-900/30 text-gray-500 hover:text-white hover:border-red-600 transition-all">
                      <Icon name="Pencil" size={14} />
                    </button>
                    <button onClick={() => deleteNews(item.id)} className="w-8 h-8 flex items-center justify-center rounded border border-red-900/30 text-gray-500 hover:text-red-500 hover:border-red-500 transition-all">
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [downloads, setDownloads] = useState<Downloads>({});
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('sk_token') || '');
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem('sk_user') || '');

  useEffect(() => {
    api('get_news').then(d => { if (Array.isArray(d)) setNews(d); });
    api('get_downloads').then(d => { if (d && !d.error) setDownloads(d); });
  }, []);

  function handleLogin(token: string, username: string) {
    setAdminToken(token);
    setAdminUser(username);
    localStorage.setItem('sk_token', token);
    localStorage.setItem('sk_user', username);
    setShowAdmin(true);
  }

  function handleLogout() {
    setAdminToken('');
    setAdminUser('');
    localStorage.removeItem('sk_token');
    localStorage.removeItem('sk_user');
    setShowAdmin(false);
  }

  if (showAdmin) {
    if (!adminToken) return <AdminLogin onLogin={handleLogin} onClose={() => setShowAdmin(false)} />;
    return <AdminPanel token={adminToken} username={adminUser} onLogout={handleLogout} />;
  }

  return (
    <div>
      <Navbar onAdmin={() => setShowAdmin(true)} />
      <Hero downloads={downloads} />
      <Mechanics />
      <NewsSection news={news} />
      <Team />
      <DownloadCTA downloads={downloads} />
      <Contact />
      <Footer />
    </div>
  );
}