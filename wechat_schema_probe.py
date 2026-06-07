import sqlite3

PATHS = [
    r"D:\Program Files (x86)\微信记录\xwechat_files\qilin_love_you_9894\db_storage\message\message_fts.db",
    r"D:\Program Files (x86)\微信记录\xwechat_files\qilin_love_you_9894\db_storage\message\message_0.db",
    r"D:\Program Files (x86)\微信记录\xwechat_files\qilin_love_you_9894\db_storage\session\session.db",
    r"D:\Program Files (x86)\微信记录\xwechat_files\kylin_love_you_ebdc\db_storage\message\message_fts.db",
    r"D:\Program Files (x86)\微信记录\xwechat_files\kylin_love_you_ebdc\db_storage\message\message_0.db",
    r"D:\Program Files (x86)\微信记录\xwechat_files\kylin_love_you_ebdc\db_storage\session\session.db",
]


for path in PATHS:
    print("\n###", path)
    with open(path, "rb") as f:
        print("header", f.read(16))
    try:
        con = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
        rows = con.execute(
            "select name, type, sql from sqlite_master "
            "where type in ('table','view') order by name"
        ).fetchall()
        for name, typ, sql in rows[:60]:
            print("-", typ, name, (sql or "")[:500].replace("\n", " "))
        con.close()
    except Exception as exc:
        print("ERR", repr(exc))
