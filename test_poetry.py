#! -*- coding: utf-8 -*-
"""

   测试古诗JSON文件是否有效

"""

import os, json

def check_json(json):
    filepath = os.path.join('./json', json)
    with open(filepath) as file:
        try:
            _ = json.loads(file.read())
            return True
        except:
            assert False, "校验(%s)失败" % json


def test_json():
    map(check_json, os.listdir('./json'))
