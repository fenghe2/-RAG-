import sqlite3
from contextlib import contextmanager

# SQLite 数据库文件路径
DATABASE = "app.db"

@contextmanager
def get_db():
    conn = sqlite3.connect("app.db")
    conn.row_factory = sqlite3.Row  # 使返回字典格式
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL
        )
        """)
        conn.commit()