#! -*- coding: utf-8 -*-
import os, json, sqlite3

def check_json(f):
    filepath = os.path.join('./json', f)
    with open(filepath) as file:
        try:
            _ = json.loads(file.read())
            return True
        except:
            assert False, u"校验(%s)失败" % f


def test_json():
    """
        测试古诗JSON文件是否有效
    """
    map(check_json, os.listdir('./json'))



def test_sqlite():
    """
        测试ci数据库文件是否有效
    """
    conn = sqlite3.connect('./ci/ci.db')

    c = conn.cursor()

    c.execute("SELECT name FROM sqlite_master WHERE type='table'")

    tables = c.fetchall()
    
    assert len(tables) == 2, u"Sqlite文件异常"
