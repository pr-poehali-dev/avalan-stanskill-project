CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('hero_title', 'STANSKILL'),
  ('hero_subtitle', 'Вступи в бой'),
  ('hero_description', 'Тактические бои. Реалистичная физика. Бесконечные арены. Только сильнейшие выживают в мире STANSKILL.'),
  ('hero_stat1_val', '50K+'),
  ('hero_stat1_label', 'Игроков'),
  ('hero_stat2_val', '200+'),
  ('hero_stat2_label', 'Карт'),
  ('hero_stat3_val', '4.8★'),
  ('hero_stat3_label', 'Рейтинг'),
  ('team_title', 'КОМАНДА AVALON'),
  ('team_description', 'Мы — независимая студия мобильных игр, объединившая разработчиков, художников и геймдизайнеров с единой целью: создать мобильный шутер, которого ещё не было.'),
  ('team_quote', 'AVALON — это не просто команда. Это братство людей, которые верят, что лучшие игры рождаются из страсти, а не из денег.'),
  ('team_stat1_val', '5 лет'),
  ('team_stat1_label', 'Опыта'),
  ('team_stat2_val', '3'),
  ('team_stat2_label', 'Игры'),
  ('team_stat3_val', '12'),
  ('team_stat3_label', 'Человек'),
  ('contact_email', 'support@avalon.games'),
  ('contact_telegram', '#'),
  ('contact_instagram', '#'),
  ('contact_youtube', '#'),
  ('contact_twitter', '#'),
  ('footer_copyright', '© 2024 AVALON GAMES. Все права защищены.')
ON CONFLICT (key) DO NOTHING;
