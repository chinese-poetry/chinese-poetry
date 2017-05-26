#! -*- coding: utf-8 -*-
"""

   测试古诗JSON文件是否有效

"""

import os, json

def check_json(f):
    filepath = os.path.join('./json', f)
    with open(filepath) as file:
        try:
            _ = json.loads(file.read())
            return True
        except:
            assert False, "校验(%s)失败" % f


def test_json():
    map(check_json, os.listdir('./json'))
