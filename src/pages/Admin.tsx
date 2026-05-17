import { useState, useEffect, useCallback, useRef } from 'react';
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
type Settings = Record<string, string>;

// ── Login Page ─────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (token: string, username: string) => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api('login', { username: user, password: pass });
      if (data.error) { setError(data.error); setLoading(false); return; }
      onLogin(data.token, data.username);
    } catch {
      setError('Ошибка соединения');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen login-bg flex items-center justify-center px-4 relative overflow-hidden crt">
      {/* Hex grid */}
      <div className="absolute inset-0 hex-bg opacity-60" />

      {/* Animated corner elements */}
      <div className="absolute top-8 left-8 w-16 h-16 opacity-20">
        <div className="w-full h-full border-t-2 border-l-2 border-red-600" />
      </div>
      <div className="absolute top-8 right-8 w-16 h-16 opacity-20">
        <div className="w-full h-full border-t-2 border-r-2 border-red-600" />
      </div>
      <div className="absolute bottom-8 left-8 w-16 h-16 opacity-20">
        <div className="w-full h-full border-b-2 border-l-2 border-red-600" />
      </div>
      <div className="absolute bottom-8 right-8 w-16 h-16 opacity-20">
        <div className="w-full h-full border-b-2 border-r-2 border-red-600" />
      </div>

      {/* Radar rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[1, 2, 3].map(i => (
          <div key={i} className="absolute rounded-full border border-red-900/20 animate-radar-pulse"
            style={{ width: i * 200 + 'px', height: i * 200 + 'px', top: -(i * 100) + 'px', left: -(i * 100) + 'px', animationDelay: i * 0.6 + 's' }} />
        ))}
      </div>

      {/* Vertical scan line */}
      <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-600/20 to-transparent animate-pulse" style={{ left: '30%' }} />

      <div className="relative z-10 w-full max-w-sm animate-rise-glow">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-5">
            <div className="w-20 h-20 flex items-center justify-center mx-auto relative"
              style={{ background: 'var(--red)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <span className="text-white font-black text-xl z-10 relative" style={{ fontFamily: 'Orbitron' }}>SK</span>
            </div>
            {/* Rotating hex ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 border border-red-800/30 rounded-full animate-rotate-slow" style={{ borderStyle: 'dashed' }} />
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-[0.4em] text-white mb-1 glitch-text"
            data-text="STANSKILL" style={{ fontFamily: 'Orbitron' }}>
            STANSKILL
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, var(--red))' }} />
            <span className="text-red-500 text-[10px] tracking-[0.5em] uppercase" style={{ fontFamily: 'Oswald' }}>Admin Panel</span>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, var(--red))' }} />
          </div>
        </div>

        {/* Card */}
        <div className="login-card rounded-sm p-8 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--red), var(--red-bright), var(--red), transparent)' }} />

          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-red-700/50" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-700/50" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-red-700/50" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-red-700/50" />

          <form onSubmit={submit} className="space-y-5">
            {/* Username field */}
            <div className={`relative transition-all duration-300 ${focused === 'user' ? 'transform scale-[1.01]' : ''}`}>
              <label className="text-red-700 text-[10px] tracking-[0.35em] uppercase block mb-2" style={{ fontFamily: 'Orbitron' }}>
                Логин
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-700">
                  <Icon name="User" size={15} />
                </div>
                <input
                  className="dark-input w-full pl-9 pr-4 py-3.5 rounded-sm text-sm font-medium"
                  style={{ background: 'rgba(204,0,0,0.04)', letterSpacing: '0.05em' }}
                  value={user}
                  onChange={e => setUser(e.target.value)}
                  onFocus={() => setFocused('user')}
                  onBlur={() => setFocused(null)}
                  required
                  autoComplete="username"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Password field */}
            <div className={`relative transition-all duration-300 ${focused === 'pass' ? 'transform scale-[1.01]' : ''}`}>
              <label className="text-red-700 text-[10px] tracking-[0.35em] uppercase block mb-2" style={{ fontFamily: 'Orbitron' }}>
                Пароль
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-700">
                  <Icon name="KeyRound" size={15} />
                </div>
                <input
                  className="dark-input w-full pl-9 pr-11 py-3.5 rounded-sm text-sm"
                  style={{ background: 'rgba(204,0,0,0.04)', letterSpacing: '0.1em' }}
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused(null)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-red-900 hover:text-red-500 transition-colors"
                  onClick={() => setShowPass(!showPass)}>
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={15} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm"
                style={{ background: 'rgba(204,0,0,0.12)', border: '1px solid rgba(204,0,0,0.3)', color: '#ff6666' }}>
                <Icon name="AlertTriangle" size={14} />
                <span style={{ fontFamily: 'Oswald', letterSpacing: '0.05em' }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-red-shine w-full py-4 rounded-sm font-black tracking-[0.2em] uppercase text-sm relative overflow-hidden group mt-2"
              style={{ fontFamily: 'Orbitron' }}>
              <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Авторизация...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="LogIn" size={16} />
                  Войти
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-700 text-xs mt-6 tracking-widest" style={{ fontFamily: 'Orbitron' }}>
          AVALON GAMES · STANSKILL
        </p>
      </div>
    </div>
  );
}

// ── Field components ───────────────────────────────────────────────────────────
function Field({ label, value, onChange, multiline = false, placeholder = '', type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-gray-600 text-[10px] tracking-[0.3em] uppercase block mb-1.5" style={{ fontFamily: 'Orbitron' }}>{label}</label>
      {multiline
        ? <textarea className="dark-input w-full px-3.5 py-2.5 rounded-sm text-sm resize-none h-24 leading-relaxed" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input className="dark-input w-full px-3.5 py-2.5 rounded-sm text-sm" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

// ── Admin Panel ────────────────────────────────────────────────────────────────
type Tab = 'downloads' | 'news' | 'hero' | 'team' | 'contacts';

function AdminPanel({ token, username, onLogout }: { token: string; username: string; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('downloads');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [downloads, setDownloads] = useState<Downloads>({});
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'ok' | 'err'>('ok');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Downloads
  const [androidUrl, setAndroidUrl] = useState('');
  const [androidVer, setAndroidVer] = useState('');
  const [iosUrl, setIosUrl] = useState('');
  const [iosVer, setIosVer] = useState('');

  // News
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: 'news', image_url: '', published: true });

  // Settings edits
  const [s, setS] = useState<Settings>({});
  const flashRef = useRef<ReturnType<typeof setTimeout>>();

  const flash = (m: string, type: 'ok' | 'err' = 'ok') => {
    setMsg(m); setMsgType(type);
    clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => setMsg(''), 3000);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [nd, nn, ns] = await Promise.all([
      api('get_downloads'),
      api('get_news_all', {}, token),
      api('get_settings'),
    ]);
    if (nd && !nd.error) {
      setDownloads(nd);
      setAndroidUrl(nd.android?.url || '');
      setAndroidVer(nd.android?.version || '');
      setIosUrl(nd.ios?.url || '');
      setIosVer(nd.ios?.version || '');
    }
    if (Array.isArray(nn)) setNews(nn);
    if (ns && !ns.error) { setSettings(ns); setS(ns); }
    setLoading(false);
  }, [token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function saveDownloads() {
    setLoading(true);
    try {
      await api('update_downloads', { android: { url: androidUrl, version: androidVer }, ios: { url: iosUrl, version: iosVer } }, token);
      flash('Ссылки сохранены!');
    } catch { flash('Ошибка сохранения', 'err'); }
    setLoading(false);
  }

  async function saveSettings(keys: string[]) {
    const patch: Settings = {};
    keys.forEach(k => { patch[k] = s[k] ?? settings[k] ?? ''; });
    setLoading(true);
    try {
      await api('update_settings', { settings: patch }, token);
      flash('Сохранено!');
      await loadAll();
    } catch { flash('Ошибка', 'err'); }
    setLoading(false);
  }

  async function saveNews() {
    setLoading(true);
    try {
      if (editing) {
        await api('update_news', { id: editing.id, ...newsForm }, token);
        flash('Обновлено!');
      } else {
        await api('create_news', newsForm, token);
        flash('Новость создана!');
      }
      setEditing(null);
      setNewsForm({ title: '', content: '', category: 'news', image_url: '', published: true });
      await loadAll();
    } catch { flash('Ошибка', 'err'); }
    setLoading(false);
  }

  async function deleteNews(id: number) {
    if (!confirm('Удалить?')) return;
    setLoading(true);
    await api('delete_news', { id }, token);
    flash('Удалено');
    await loadAll();
    setLoading(false);
  }

  function startEdit(item: NewsItem) {
    setEditing(item);
    setNewsForm({ title: item.title, content: item.content, category: item.category, image_url: item.image_url || '', published: item.published });
    setTab('news');
    window.scrollTo(0, 0);
  }

  const sv = (key: string) => s[key] ?? settings[key] ?? '';
  const setSv = (key: string, val: string) => setS(prev => ({ ...prev, [key]: val }));

  const tabs: { id: Tab; label: string; icon: string; desc: string }[] = [
    { id: 'downloads', label: 'Скачивание', icon: 'Download', desc: 'Ссылки Android / iOS' },
    { id: 'hero', label: 'Главный экран', icon: 'Layout', desc: 'Текст и статистика' },
    { id: 'team', label: 'Команда', icon: 'Users', desc: 'Описание и цифры' },
    { id: 'contacts', label: 'Контакты', icon: 'Mail', desc: 'Email и соцсети' },
    { id: 'news', label: 'Новости', icon: 'Newspaper', desc: 'Статьи и события' },
  ];

  const cats: Record<string, string> = { news: 'Новость', update: 'Обновление', event: 'Событие' };

  return (
    <div className="min-h-screen flex" style={{ background: '#080808' }}>
      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} shrink-0 border-r border-red-900/20 flex flex-col transition-all duration-300 sticky top-0 h-screen overflow-hidden`}
        style={{ background: 'rgba(10,8,8,0.98)' }}>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-red-900/20 flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center"
            style={{ background: 'var(--red)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            <span className="text-white font-black text-[9px]" style={{ fontFamily: 'Orbitron' }}>SK</span>
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white text-xs font-black tracking-widest" style={{ fontFamily: 'Orbitron' }}>STANSKILL</div>
              <div className="text-red-700 text-[9px] tracking-widest" style={{ fontFamily: 'Oswald' }}>ADMIN PANEL</div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-gray-600 hover:text-red-500 transition-colors shrink-0">
            <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`admin-nav-item w-full text-left ${tab === t.id ? 'active' : ''}`}>
              <Icon name={t.icon} size={16} className="shrink-0" />
              {sidebarOpen && (
                <div className="min-w-0">
                  <div className="truncate">{t.label}</div>
                  {tab === t.id && <div className="text-[9px] text-red-700/70 truncate normal-case" style={{ letterSpacing: '0.05em', fontFamily: 'Roboto' }}>{t.desc}</div>}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-red-900/20 px-3 py-4 space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="admin-nav-item w-full text-left">
            <Icon name="ExternalLink" size={16} className="shrink-0" />
            {sidebarOpen && <span>Открыть сайт</span>}
          </a>
          <button onClick={onLogout} className="admin-nav-item w-full text-left text-red-800 hover:text-red-400">
            <Icon name="LogOut" size={16} className="shrink-0" />
            {sidebarOpen && <span>Выйти</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="border-b border-red-900/20 px-6 py-3 flex items-center justify-between sticky top-0 z-40"
          style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)' }}>
          <div>
            <div className="section-header mb-0" style={{ marginBottom: 0 }}>
              {tabs.find(t => t.id === tab)?.label || ''}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {loading && (
              <div className="flex items-center gap-2 text-red-700 text-xs" style={{ fontFamily: 'Oswald' }}>
                <div className="w-3 h-3 border border-red-700 border-t-transparent rounded-full animate-spin" />
                Загрузка...
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-red-900/30"
              style={{ background: 'rgba(204,0,0,0.06)' }}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gray-400 text-xs" style={{ fontFamily: 'Oswald', letterSpacing: '0.05em' }}>{username}</span>
            </div>
          </div>
        </header>

        {/* Flash message */}
        {msg && (
          <div className={`mx-6 mt-4 px-4 py-3 rounded-sm text-sm flex items-center gap-2 ${msgType === 'ok' ? '' : ''}`}
            style={{
              background: msgType === 'ok' ? 'rgba(0,180,60,0.1)' : 'rgba(204,0,0,0.12)',
              border: `1px solid ${msgType === 'ok' ? 'rgba(0,180,60,0.3)' : 'rgba(204,0,0,0.4)'}`,
              color: msgType === 'ok' ? '#4ade80' : 'var(--red-bright)',
              fontFamily: 'Oswald',
              letterSpacing: '0.05em',
            }}>
            <Icon name={msgType === 'ok' ? 'CheckCircle' : 'AlertCircle'} size={16} />
            {msg}
          </div>
        )}

        <div className="flex-1 p-6">

          {/* ── DOWNLOADS TAB ── */}
          {tab === 'downloads' && (
            <div>
              <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: 'Roboto' }}>
                Укажи ссылки на скачивание игры. Они отображаются на кнопках главного экрана и в секции «Готов к бою».
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  { label: 'Android', icon: 'Smartphone', color: '#a4c639', url: androidUrl, setUrl: setAndroidUrl, ver: androidVer, setVer: setAndroidVer, ph: 'https://play.google.com/store/apps/...' },
                  { label: 'iOS / App Store', icon: 'Tablet', color: '#888', url: iosUrl, setUrl: setIosUrl, ver: iosVer, setVer: setIosVer, ph: 'https://apps.apple.com/app/...' },
                ].map(p => (
                  <div key={p.label} className="game-card rounded-sm p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: `linear-gradient(to bottom, ${p.color}33, ${p.color}11)` }} />
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 flex items-center justify-center rounded-sm" style={{ background: 'rgba(204,0,0,0.1)', border: '1px solid rgba(204,0,0,0.2)' }}>
                        <Icon name={p.icon} size={20} className="text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm" style={{ fontFamily: 'Oswald', letterSpacing: '0.06em' }}>{p.label}</h3>
                        {p.url ? <div className="text-green-600 text-[10px]">● Ссылка установлена</div> : <div className="text-gray-600 text-[10px]">○ Ссылка не указана</div>}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Field label="Ссылка на скачивание" value={p.url} onChange={p.setUrl} placeholder={p.ph} />
                      <Field label="Версия приложения" value={p.ver} onChange={p.setVer} placeholder="1.0.0" />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={saveDownloads} disabled={loading}
                className="btn-red-shine px-8 py-3.5 rounded-sm flex items-center gap-2 font-bold text-sm"
                style={{ fontFamily: 'Oswald', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <Icon name="Save" size={18} />{loading ? 'Сохраняю...' : 'Сохранить ссылки'}
              </button>
            </div>
          )}

          {/* ── HERO TAB ── */}
          {tab === 'hero' && (
            <div>
              <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: 'Roboto' }}>Текст на главном экране сайта — подзаголовок, описание игры и три цифры статистики.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="game-card rounded-sm p-5 space-y-4">
                  <div className="section-header">Текст</div>
                  <Field label="Подзаголовок" value={sv('hero_subtitle')} onChange={v => setSv('hero_subtitle', v)} placeholder="Вступи в бой" />
                  <Field label="Описание игры" value={sv('hero_description')} onChange={v => setSv('hero_description', v)} multiline placeholder="Тактические бои..." />
                </div>
                <div className="game-card rounded-sm p-5 space-y-4">
                  <div className="section-header">Статистика (3 цифры)</div>
                  {[
                    { vk: 'hero_stat1_val', lk: 'hero_stat1_label' },
                    { vk: 'hero_stat2_val', lk: 'hero_stat2_label' },
                    { vk: 'hero_stat3_val', lk: 'hero_stat3_label' },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      <Field label={`Цифра ${i+1}`} value={sv(row.vk)} onChange={v => setSv(row.vk, v)} placeholder="50K+" />
                      <Field label="Подпись" value={sv(row.lk)} onChange={v => setSv(row.lk, v)} placeholder="Игроков" />
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => saveSettings(['hero_subtitle','hero_description','hero_stat1_val','hero_stat1_label','hero_stat2_val','hero_stat2_label','hero_stat3_val','hero_stat3_label'])}
                disabled={loading} className="btn-red-shine px-8 py-3.5 rounded-sm flex items-center gap-2 font-bold text-sm"
                style={{ fontFamily: 'Oswald', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <Icon name="Save" size={18} />{loading ? 'Сохраняю...' : 'Сохранить главный экран'}
              </button>
            </div>
          )}

          {/* ── TEAM TAB ── */}
          {tab === 'team' && (
            <div>
              <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: 'Roboto' }}>Раздел «Команда AVALON» — описание студии, цитата и статистика.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="game-card rounded-sm p-5 space-y-4">
                  <div className="section-header">Описание</div>
                  <Field label="Основной текст" value={sv('team_description')} onChange={v => setSv('team_description', v)} multiline />
                  <Field label="Цитата (выделенная строка)" value={sv('team_quote')} onChange={v => setSv('team_quote', v)} multiline />
                </div>
                <div className="game-card rounded-sm p-5 space-y-4">
                  <div className="section-header">Статистика команды</div>
                  {[
                    { vk: 'team_stat1_val', lk: 'team_stat1_label' },
                    { vk: 'team_stat2_val', lk: 'team_stat2_label' },
                    { vk: 'team_stat3_val', lk: 'team_stat3_label' },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      <Field label={`Цифра ${i+1}`} value={sv(row.vk)} onChange={v => setSv(row.vk, v)} />
                      <Field label="Подпись" value={sv(row.lk)} onChange={v => setSv(row.lk, v)} />
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => saveSettings(['team_description','team_quote','team_stat1_val','team_stat1_label','team_stat2_val','team_stat2_label','team_stat3_val','team_stat3_label'])}
                disabled={loading} className="btn-red-shine px-8 py-3.5 rounded-sm flex items-center gap-2 font-bold text-sm"
                style={{ fontFamily: 'Oswald', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <Icon name="Save" size={18} />{loading ? 'Сохраняю...' : 'Сохранить раздел команды'}
              </button>
            </div>
          )}

          {/* ── CONTACTS TAB ── */}
          {tab === 'contacts' && (
            <div>
              <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: 'Roboto' }}>Email, ссылки на соцсети и текст копирайта в подвале сайта.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="game-card rounded-sm p-5 space-y-4">
                  <div className="section-header">Основные контакты</div>
                  <Field label="Email для связи" value={sv('contact_email')} onChange={v => setSv('contact_email', v)} placeholder="support@avalon.games" type="email" />
                  <Field label="Копирайт в подвале" value={sv('footer_copyright')} onChange={v => setSv('footer_copyright', v)} placeholder="© 2024 AVALON GAMES" />
                </div>
                <div className="game-card rounded-sm p-5 space-y-4">
                  <div className="section-header">Социальные сети</div>
                  {[
                    { lk: 'Telegram', sk: 'contact_telegram', ph: 'https://t.me/...' },
                    { lk: 'Instagram', sk: 'contact_instagram', ph: 'https://instagram.com/...' },
                    { lk: 'YouTube', sk: 'contact_youtube', ph: 'https://youtube.com/...' },
                    { lk: 'Twitter / X', sk: 'contact_twitter', ph: 'https://x.com/...' },
                  ].map(row => (
                    <Field key={row.sk} label={row.lk} value={sv(row.sk)} onChange={v => setSv(row.sk, v)} placeholder={row.ph} />
                  ))}
                </div>
              </div>
              <button onClick={() => saveSettings(['contact_email','footer_copyright','contact_telegram','contact_instagram','contact_youtube','contact_twitter'])}
                disabled={loading} className="btn-red-shine px-8 py-3.5 rounded-sm flex items-center gap-2 font-bold text-sm"
                style={{ fontFamily: 'Oswald', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <Icon name="Save" size={18} />{loading ? 'Сохраняю...' : 'Сохранить контакты'}
              </button>
            </div>
          )}

          {/* ── NEWS TAB ── */}
          {tab === 'news' && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Form — 2/5 */}
              <div className="xl:col-span-2">
                <div className="game-card rounded-sm p-5 sticky top-24">
                  <div className="section-header">{editing ? 'Редактирование' : 'Новая запись'}</div>
                  <div className="space-y-4">
                    <Field label="Заголовок" value={newsForm.title} onChange={v => setNewsForm({ ...newsForm, title: v })} placeholder="Заголовок новости..." />
                    <div>
                      <label className="text-gray-600 text-[10px] tracking-[0.3em] uppercase block mb-1.5" style={{ fontFamily: 'Orbitron' }}>Категория</label>
                      <select className="dark-input w-full px-3.5 py-2.5 rounded-sm text-sm cursor-pointer"
                        value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })}>
                        <option value="news">Новость</option>
                        <option value="update">Обновление</option>
                        <option value="event">Событие</option>
                      </select>
                    </div>
                    <Field label="Текст" value={newsForm.content} onChange={v => setNewsForm({ ...newsForm, content: v })} multiline placeholder="Текст..." />
                    <Field label="Картинка (URL)" value={newsForm.image_url} onChange={v => setNewsForm({ ...newsForm, image_url: v })} placeholder="https://..." />
                    <div className="flex items-center gap-3 py-1">
                      <input type="checkbox" id="pub" checked={newsForm.published} onChange={e => setNewsForm({ ...newsForm, published: e.target.checked })} className="cursor-pointer accent-red-600 w-4 h-4" />
                      <label htmlFor="pub" className="text-gray-400 text-sm cursor-pointer" style={{ fontFamily: 'Oswald' }}>Опубликовать на сайте</label>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={saveNews} disabled={loading}
                        className="btn-red-shine flex-1 py-3 rounded-sm flex items-center justify-center gap-2 text-sm font-bold"
                        style={{ fontFamily: 'Oswald', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        <Icon name="Save" size={16} />{editing ? 'Обновить' : 'Создать'}
                      </button>
                      {editing && (
                        <button onClick={() => { setEditing(null); setNewsForm({ title: '', content: '', category: 'news', image_url: '', published: true }); }}
                          className="btn-outline-red px-4 py-3 rounded-sm text-sm">
                          <Icon name="X" size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* List — 3/5 */}
              <div className="xl:col-span-3 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="section-header" style={{ marginBottom: 0 }}>Все записи ({news.length})</div>
                </div>
                {news.length === 0 && (
                  <div className="text-center py-16 text-gray-700 game-card rounded-sm p-8" style={{ fontFamily: 'Oswald', letterSpacing: '0.05em' }}>
                    <Icon name="Newspaper" size={32} className="mx-auto mb-3 text-red-900/40" />
                    Записей пока нет
                  </div>
                )}
                {news.map(item => (
                  <div key={item.id} className="game-card rounded-sm p-4 flex items-start gap-3 group">
                    {item.image_url && (
                      <div className="w-14 h-14 rounded-sm shrink-0 overflow-hidden">
                        <img src={item.image_url} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-sm" style={{ background: 'rgba(204,0,0,0.18)', color: 'var(--red-bright)', fontFamily: 'Orbitron', letterSpacing: '0.1em' }}>
                          {cats[item.category] || item.category}
                        </span>
                        {!item.published && (
                          <span className="text-[10px] px-2 py-0.5 rounded-sm" style={{ background: 'rgba(255,255,255,0.05)', color: '#666', fontFamily: 'Oswald' }}>
                            скрыто
                          </span>
                        )}
                        <span className="text-gray-600 text-[10px]">{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <p className="text-white text-sm font-medium truncate" style={{ fontFamily: 'Oswald' }}>{item.title}</p>
                      <p className="text-gray-600 text-xs mt-0.5 line-clamp-1">{item.content}</p>
                    </div>
                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-sm border border-red-900/30 text-gray-500 hover:text-white hover:border-red-500 hover:bg-red-950/30 transition-all">
                        <Icon name="Pencil" size={13} />
                      </button>
                      <button onClick={() => deleteNews(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-sm border border-red-900/30 text-gray-500 hover:text-red-400 hover:border-red-500 hover:bg-red-950/20 transition-all">
                        <Icon name="Trash2" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('sk_token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('sk_user') || '');

  function handleLogin(t: string, u: string) {
    setToken(t); setUsername(u);
    localStorage.setItem('sk_token', t);
    localStorage.setItem('sk_user', u);
  }

  function handleLogout() {
    setToken(''); setUsername('');
    localStorage.removeItem('sk_token');
    localStorage.removeItem('sk_user');
  }

  if (!token) return <AdminLogin onLogin={handleLogin} />;
  return <AdminPanel token={token} username={username} onLogout={handleLogout} />;
}