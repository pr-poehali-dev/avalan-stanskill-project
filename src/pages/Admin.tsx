import { useState, useEffect, useCallback } from 'react';
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

// ─── Login ────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (token: string, username: string) => void }) {
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
              <input className="dark-input w-full px-4 py-3 rounded" value={user} onChange={e => setUser(e.target.value)} required autoComplete="username" />
            </div>
            <div>
              <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>Пароль</label>
              <input className="dark-input w-full px-4 py-3 rounded" type="password" value={pass} onChange={e => setPass(e.target.value)} required autoComplete="current-password" />
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center py-2 rounded" style={{ background: 'rgba(204,0,0,0.1)' }}>{error}</div>
            )}
            <button type="submit" disabled={loading} className="btn-red w-full py-3 rounded mt-2">
              {loading ? 'Вход...' : 'Войти в панель'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable field ────────────────────────────────────────────────────────────
function Field({ label, value, onChange, multiline = false, placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>{label}</label>
      {multiline
        ? <textarea className="dark-input w-full px-3 py-2.5 rounded text-sm resize-none h-24" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input className="dark-input w-full px-3 py-2.5 rounded text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="game-card p-6 rounded">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 flex items-center justify-center rounded" style={{ background: 'rgba(204,0,0,0.12)' }}>
          <Icon name={icon} size={18} className="text-red-500" />
        </div>
        <h3 className="text-white font-bold" style={{ fontFamily: 'Oswald', fontSize: '1rem', letterSpacing: '0.06em' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Main Panel ────────────────────────────────────────────────────────────────
function AdminPanel({ token, username, onLogout }: { token: string; username: string; onLogout: () => void }) {
  type Tab = 'downloads' | 'news' | 'hero' | 'team' | 'contacts';
  const [tab, setTab] = useState<Tab>('downloads');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [downloads, setDownloads] = useState<Downloads>({});
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Downloads
  const [androidUrl, setAndroidUrl] = useState('');
  const [androidVer, setAndroidVer] = useState('');
  const [iosUrl, setIosUrl] = useState('');
  const [iosVer, setIosVer] = useState('');

  // News form
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: 'news', image_url: '', published: true });

  // Settings state (local edits)
  const [s, setS] = useState<Settings>({});

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

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
    if (ns && !ns.error) {
      setSettings(ns);
      setS(ns);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function saveDownloads() {
    setLoading(true);
    await api('update_downloads', { android: { url: androidUrl, version: androidVer }, ios: { url: iosUrl, version: iosVer } }, token);
    flash('Ссылки сохранены!');
    setLoading(false);
  }

  async function saveSettings(keys: string[]) {
    const patch: Settings = {};
    keys.forEach(k => { patch[k] = s[k] ?? settings[k] ?? ''; });
    setLoading(true);
    await api('update_settings', { settings: patch }, token);
    flash('Сохранено!');
    await loadAll();
    setLoading(false);
  }

  async function saveNews() {
    setLoading(true);
    if (editing) {
      await api('update_news', { id: editing.id, ...newsForm }, token);
      flash('Новость обновлена!');
    } else {
      await api('create_news', newsForm, token);
      flash('Новость создана!');
    }
    setEditing(null);
    setNewsForm({ title: '', content: '', category: 'news', image_url: '', published: true });
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
    setNewsForm({ title: item.title, content: item.content, category: item.category, image_url: item.image_url || '', published: item.published });
    setTab('news');
    window.scrollTo(0, 0);
  }

  const sv = (key: string) => s[key] ?? settings[key] ?? '';
  const setSv = (key: string, val: string) => setS(prev => ({ ...prev, [key]: val }));

  const tabs: [Tab, string, string][] = [
    ['downloads', 'Скачивание', 'Download'],
    ['hero', 'Главный экран', 'Layout'],
    ['team', 'Команда', 'Users'],
    ['contacts', 'Контакты', 'Mail'],
    ['news', 'Новости', 'Newspaper'],
  ];

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
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xs hover:text-red-400 transition-colors hidden sm:flex items-center gap-1" style={{ fontFamily: 'Oswald' }}>
              <Icon name="ExternalLink" size={13} />Сайт
            </a>
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

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(([t, l, ic]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs transition-all ${tab === t ? 'btn-red' : 'btn-outline-red'}`}
              style={{ fontFamily: 'Oswald', letterSpacing: '0.05em' }}>
              <Icon name={ic} size={14} />{l}
            </button>
          ))}
        </div>

        {/* ── DOWNLOADS ── */}
        {tab === 'downloads' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {[
                { label: 'Android', icon: 'Smartphone', url: androidUrl, setUrl: setAndroidUrl, ver: androidVer, setVer: setAndroidVer },
                { label: 'iOS', icon: 'Tablet', url: iosUrl, setUrl: setIosUrl, ver: iosVer, setVer: setIosVer },
              ].map(p => (
                <SectionCard key={p.label} title={p.label} icon={p.icon}>
                  <div className="space-y-4">
                    <Field label="Ссылка на скачивание" value={p.url} onChange={p.setUrl} placeholder="https://play.google.com/..." />
                    <Field label="Версия" value={p.ver} onChange={p.setVer} placeholder="1.0.0" />
                  </div>
                </SectionCard>
              ))}
            </div>
            <button onClick={saveDownloads} disabled={loading} className="btn-red px-8 py-3 rounded flex items-center gap-2">
              <Icon name="Save" size={18} />{loading ? 'Сохраняю...' : 'Сохранить ссылки'}
            </button>
          </div>
        )}

        {/* ── HERO ── */}
        {tab === 'hero' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SectionCard title="Текст главного экрана" icon="Type">
              <div className="space-y-4">
                <Field label="Подзаголовок (под названием)" value={sv('hero_subtitle')} onChange={v => setSv('hero_subtitle', v)} />
                <Field label="Описание" value={sv('hero_description')} onChange={v => setSv('hero_description', v)} multiline />
              </div>
            </SectionCard>
            <SectionCard title="Статистика" icon="BarChart2">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Значение 1" value={sv('hero_stat1_val')} onChange={v => setSv('hero_stat1_val', v)} />
                  <Field label="Подпись 1" value={sv('hero_stat1_label')} onChange={v => setSv('hero_stat1_label', v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Значение 2" value={sv('hero_stat2_val')} onChange={v => setSv('hero_stat2_val', v)} />
                  <Field label="Подпись 2" value={sv('hero_stat2_label')} onChange={v => setSv('hero_stat2_label', v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Значение 3" value={sv('hero_stat3_val')} onChange={v => setSv('hero_stat3_val', v)} />
                  <Field label="Подпись 3" value={sv('hero_stat3_label')} onChange={v => setSv('hero_stat3_label', v)} />
                </div>
              </div>
            </SectionCard>
            <div className="md:col-span-2">
              <button onClick={() => saveSettings(['hero_subtitle','hero_description','hero_stat1_val','hero_stat1_label','hero_stat2_val','hero_stat2_label','hero_stat3_val','hero_stat3_label'])}
                disabled={loading} className="btn-red px-8 py-3 rounded flex items-center gap-2">
                <Icon name="Save" size={18} />{loading ? 'Сохраняю...' : 'Сохранить главный экран'}
              </button>
            </div>
          </div>
        )}

        {/* ── TEAM ── */}
        {tab === 'team' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SectionCard title="Описание команды" icon="Users">
              <div className="space-y-4">
                <Field label="Основной текст" value={sv('team_description')} onChange={v => setSv('team_description', v)} multiline />
                <Field label="Цитата (выделенная)" value={sv('team_quote')} onChange={v => setSv('team_quote', v)} multiline />
              </div>
            </SectionCard>
            <SectionCard title="Статистика команды" icon="Award">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Значение 1" value={sv('team_stat1_val')} onChange={v => setSv('team_stat1_val', v)} />
                  <Field label="Подпись 1" value={sv('team_stat1_label')} onChange={v => setSv('team_stat1_label', v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Значение 2" value={sv('team_stat2_val')} onChange={v => setSv('team_stat2_val', v)} />
                  <Field label="Подпись 2" value={sv('team_stat2_label')} onChange={v => setSv('team_stat2_label', v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Значение 3" value={sv('team_stat3_val')} onChange={v => setSv('team_stat3_val', v)} />
                  <Field label="Подпись 3" value={sv('team_stat3_label')} onChange={v => setSv('team_stat3_label', v)} />
                </div>
              </div>
            </SectionCard>
            <div className="md:col-span-2">
              <button onClick={() => saveSettings(['team_description','team_quote','team_stat1_val','team_stat1_label','team_stat2_val','team_stat2_label','team_stat3_val','team_stat3_label'])}
                disabled={loading} className="btn-red px-8 py-3 rounded flex items-center gap-2">
                <Icon name="Save" size={18} />{loading ? 'Сохраняю...' : 'Сохранить раздел команды'}
              </button>
            </div>
          </div>
        )}

        {/* ── CONTACTS ── */}
        {tab === 'contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SectionCard title="Контактные данные" icon="Mail">
              <div className="space-y-4">
                <Field label="Email" value={sv('contact_email')} onChange={v => setSv('contact_email', v)} placeholder="support@avalon.games" />
                <Field label="Копирайт в футере" value={sv('footer_copyright')} onChange={v => setSv('footer_copyright', v)} />
              </div>
            </SectionCard>
            <SectionCard title="Социальные сети" icon="Share2">
              <div className="space-y-4">
                <Field label="Telegram (ссылка)" value={sv('contact_telegram')} onChange={v => setSv('contact_telegram', v)} placeholder="https://t.me/..." />
                <Field label="Instagram (ссылка)" value={sv('contact_instagram')} onChange={v => setSv('contact_instagram', v)} placeholder="https://instagram.com/..." />
                <Field label="YouTube (ссылка)" value={sv('contact_youtube')} onChange={v => setSv('contact_youtube', v)} placeholder="https://youtube.com/..." />
                <Field label="Twitter / X (ссылка)" value={sv('contact_twitter')} onChange={v => setSv('contact_twitter', v)} placeholder="https://x.com/..." />
              </div>
            </SectionCard>
            <div className="md:col-span-2">
              <button onClick={() => saveSettings(['contact_email','footer_copyright','contact_telegram','contact_instagram','contact_youtube','contact_twitter'])}
                disabled={loading} className="btn-red px-8 py-3 rounded flex items-center gap-2">
                <Icon name="Save" size={18} />{loading ? 'Сохраняю...' : 'Сохранить контакты'}
              </button>
            </div>
          </div>
        )}

        {/* ── NEWS ── */}
        {tab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SectionCard title={editing ? 'Редактировать' : 'Новая запись'} icon="PenSquare">
              <div className="space-y-4">
                <Field label="Заголовок" value={newsForm.title} onChange={v => setNewsForm({ ...newsForm, title: v })} placeholder="Заголовок новости..." />
                <div>
                  <label className="text-gray-500 text-xs tracking-widest uppercase block mb-1.5" style={{ fontFamily: 'Oswald' }}>Категория</label>
                  <select className="dark-input w-full px-3 py-2.5 rounded text-sm cursor-pointer"
                    value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })}>
                    <option value="news">Новость</option>
                    <option value="update">Обновление</option>
                    <option value="event">Событие</option>
                  </select>
                </div>
                <Field label="Текст" value={newsForm.content} onChange={v => setNewsForm({ ...newsForm, content: v })} multiline placeholder="Текст новости..." />
                <Field label="Изображение (URL)" value={newsForm.image_url} onChange={v => setNewsForm({ ...newsForm, image_url: v })} placeholder="https://..." />
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="pub" checked={newsForm.published} onChange={e => setNewsForm({ ...newsForm, published: e.target.checked })} className="cursor-pointer accent-red-600" />
                  <label htmlFor="pub" className="text-gray-400 text-sm cursor-pointer" style={{ fontFamily: 'Oswald' }}>Опубликовать</label>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={saveNews} disabled={loading} className="btn-red px-6 py-2.5 rounded flex items-center gap-2 text-sm flex-1">
                    <Icon name="Save" size={16} />{editing ? 'Сохранить' : 'Создать'}
                  </button>
                  {editing && (
                    <button onClick={() => { setEditing(null); setNewsForm({ title: '', content: '', category: 'news', image_url: '', published: true }); }}
                      className="btn-outline-red px-4 py-2.5 rounded text-sm">Отмена</button>
                  )}
                </div>
              </div>
            </SectionCard>

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
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

// ─── Entry ─────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('sk_token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('sk_user') || '');

  function handleLogin(t: string, u: string) {
    setToken(t);
    setUsername(u);
    localStorage.setItem('sk_token', t);
    localStorage.setItem('sk_user', u);
  }

  function handleLogout() {
    setToken('');
    setUsername('');
    localStorage.removeItem('sk_token');
    localStorage.removeItem('sk_user');
  }

  if (!token) return <AdminLogin onLogin={handleLogin} />;
  return <AdminPanel token={token} username={username} onLogout={handleLogout} />;
}