#! -*- coding: utf-8 -*-
import os, json, sqlite3, sys, traceback

def check_json(f, _dir):
    if not f.endswith('.json'):
        return True

    filepath = os.path.join(_dir, f)
    with open(filepath) as file:
        try:
            _ = json.loads(file.read())
            return True
        except:
            sys.stderr.write(traceback.format_exc())            
            assert False, u"校验(%s)失败" % f


def test_shi_json():
    """
        测试古诗JSON文件是否有效
    """
    [ check_json(f, './json') for f in os.listdir('./json') ]


def test_ci_json():
    """
        测试词JSON文件是否有效
    """
    [ check_json(f, './ci') for f in os.listdir('./ci') ]


#def test_sqlite():
#    """
#        测试ci数据库文件是否有效
#    """
#    conn = sqlite3.connect('./ci/ci.db')
#
#    c = conn.cursor()
#
#    c.execute("SELECT name FROM sqlite_master WHERE type='table'")
#
#    tables = c.fetchall()
#    
#    assert len(tables) == 2, u"Sqlite文件异常"


def main():
    test_shi_json()
    test_ci_json()


if __name__ == '__main__':
    main()
