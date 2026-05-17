import json
import os
import hashlib
import hmac
import time
import psycopg2
from psycopg2.extras import RealDictCursor

"""
API для сайта STANSKILL — единый endpoint, роутинг через action в body или query.
Actions:
  login, get_news, get_news_all, create_news, update_news, delete_news,
  get_downloads, update_downloads
"""

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}

SECRET_KEY = os.environ.get('STANSKILL_SECRET', 'stanskill-secret-2024')


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'], cursor_factory=RealDictCursor)


def make_token(admin_id: int, username: str) -> str:
    payload = f"{admin_id}:{username}:{int(time.time() // 3600)}"
    sig = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}:{sig}"


def verify_token(token: str):
    if not token:
        return None
    parts = token.split(':')
    if len(parts) != 4:
        return None
    admin_id, username, ts, sig = parts
    payload = f"{admin_id}:{username}:{ts}"
    expected = hmac.new(SECRET_KEY.encode(), payload.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        return None
    if abs(int(time.time() // 3600) - int(ts)) > 24:
        return None
    return {'id': int(admin_id), 'username': username}


def ok(data, status=200):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str)
    }


def err(msg, status=400):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({'error': msg}, ensure_ascii=False)
    }


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    qs = event.get('queryStringParameters') or {}
    action = body.get('action') or qs.get('action', '')

    token = (event.get('headers') or {}).get('X-Auth-Token', '')
    admin = verify_token(token)

    # GET_NEWS — публичный
    if action == 'get_news':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM news WHERE published = TRUE ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()
        return ok([dict(r) for r in rows])

    # GET_NEWS_ALL — только admin
    if action == 'get_news_all':
        if not admin:
            return err('Нет доступа', 401)
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM news ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()
        return ok([dict(r) for r in rows])

    # GET_DOWNLOADS — публичный
    if action == 'get_downloads':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM download_links")
        rows = cur.fetchall()
        conn.close()
        result = {r['platform']: dict(r) for r in rows}
        return ok(result)

    # LOGIN
    if action == 'login':
        username = body.get('username', '').strip()
        password = body.get('password', '').strip()
        if not username or not password:
            return err('Заполните все поля')
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, username, password_hash FROM admins WHERE username = %s", (username,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return err('Неверный логин или пароль', 401)
        import bcrypt
        if not bcrypt.checkpw(password.encode(), row['password_hash'].encode()):
            return err('Неверный логин или пароль', 401)
        token_str = make_token(row['id'], row['username'])
        return ok({'token': token_str, 'username': row['username']})

    # CREATE_NEWS
    if action == 'create_news':
        if not admin:
            return err('Нет доступа', 401)
        title = body.get('title', '').strip()
        content = body.get('content', '').strip()
        if not title or not content:
            return err('Заполните заголовок и текст')
        category = body.get('category', 'news')
        image_url = body.get('image_url', '')
        published = body.get('published', True)
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO news (title, content, category, image_url, published) VALUES (%s,%s,%s,%s,%s) RETURNING *",
            (title, content, category, image_url, published)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return ok(dict(row), 201)

    # UPDATE_NEWS
    if action == 'update_news':
        if not admin:
            return err('Нет доступа', 401)
        news_id = body.get('id')
        if not news_id:
            return err('Не указан id')
        title = body.get('title')
        content = body.get('content')
        category = body.get('category')
        image_url = body.get('image_url')
        published = body.get('published')
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "UPDATE news SET title=COALESCE(%s,title), content=COALESCE(%s,content), category=COALESCE(%s,category), image_url=COALESCE(%s,image_url), published=COALESCE(%s,published), updated_at=NOW() WHERE id=%s RETURNING *",
            (title, content, category, image_url, published, news_id)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if not row:
            return err('Новость не найдена', 404)
        return ok(dict(row))

    # DELETE_NEWS
    if action == 'delete_news':
        if not admin:
            return err('Нет доступа', 401)
        news_id = body.get('id')
        if not news_id:
            return err('Не указан id')
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM news WHERE id=%s", (news_id,))
        conn.commit()
        conn.close()
        return ok({'success': True})

    # UPDATE_DOWNLOADS
    if action == 'update_downloads':
        if not admin:
            return err('Нет доступа', 401)
        conn = get_db()
        cur = conn.cursor()
        for platform in ['android', 'ios']:
            if platform in body:
                data = body[platform]
                cur.execute(
                    "UPDATE download_links SET url=%s, version=%s, updated_at=NOW() WHERE platform=%s",
                    (data.get('url', ''), data.get('version', ''), platform)
                )
        conn.commit()
        cur.execute("SELECT * FROM download_links")
        rows = cur.fetchall()
        conn.close()
        return ok({r['platform']: dict(r) for r in rows})

    # GET_SETTINGS — публичный
    if action == 'get_settings':
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT key, value FROM site_settings")
        rows = cur.fetchall()
        conn.close()
        return ok({r['key']: r['value'] for r in rows})

    # UPDATE_SETTINGS — только admin
    if action == 'update_settings':
        if not admin:
            return err('Нет доступа', 401)
        settings = body.get('settings', {})
        if not settings:
            return err('Нет данных')
        conn = get_db()
        cur = conn.cursor()
        for key, value in settings.items():
            cur.execute(
                "INSERT INTO site_settings (key, value, updated_at) VALUES (%s, %s, NOW()) ON CONFLICT (key) DO UPDATE SET value=%s, updated_at=NOW()",
                (key, str(value), str(value))
            )
        conn.commit()
        cur.execute("SELECT key, value FROM site_settings")
        rows = cur.fetchall()
        conn.close()
        return ok({r['key']: r['value'] for r in rows})

    return err('Неизвестный action', 400)