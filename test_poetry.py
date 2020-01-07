#! -*- coding: utf-8 -*-
# import sqlite3
import os
import json
import sys
import traceback
import functools


def check_json(f, _dir):
    if not f.endswith('.json'):
        return True

    filepath = os.path.join(_dir, f)
    with open(filepath) as file:
        try:
            _ = json.loads(file.read())
            print(u"%s 校验成功" % _dir)
            return True
        except:
            sys.stderr.write(traceback.format_exc())            
            assert False, u"校验(%s)失败" % f


def __check_path__(path):
    """校验 指定目录 中的 json 文件"""
    [ check_json(f, path) for f in os.listdir(path) ]


test_shi = functools.partial(__check_path__, './json')

test_ci = functools.partial(__check_path__, './ci')

test_shijing = functools.partial(__check_path__, './shijing')

test_lunyu = functools.partial(__check_path__, './lunyu')

test_huajianji = functools.partial(__check_path__, u'./wudai/huajianji/')

test_nantang2 = functools.partial(__check_path__, u'./wudai/nantang/')

test_youmengying = functools.partial(__check_path__, u'./youmengying/')

test_sishuwujing = functools.partial(__check_path__, u'./sishuwujing/')

test_yuanqu = functools.partial(__check_path__, u'./yuanqu/')
