-- Администраторы
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ссылки на скачивание
CREATE TABLE IF NOT EXISTS download_links (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(20) NOT NULL, -- 'android' | 'ios'
  url TEXT,
  version VARCHAR(50),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Новости / события
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'news', -- 'news' | 'update' | 'event'
  image_url TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Начальные данные
INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewZx1rKKl1kLnI5m')
ON CONFLICT (username) DO NOTHING;

INSERT INTO download_links (platform, url, version) VALUES
  ('android', '', '1.0.0'),
  ('ios', '', '1.0.0')
ON CONFLICT DO NOTHING;
