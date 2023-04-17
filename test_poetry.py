# -*- coding: utf-8 -*-
import os
import json
import sys
import traceback
import functools

namespace = locals()


def check_json(f, _dir):
    filepath = os.path.join(_dir, f)

    if os.path.isdir(filepath):
        [check_json(f, filepath) for f in os.listdir(filepath)]

    if not f.endswith('.json'):
        return True

    with open(filepath) as file:
        try:
            _ = json.loads(file.read())
            sys.stdout.write(f"{filepath} 校验成功")
            return True
        except Exception as e:
            sys.stderr.write(traceback.format_exc())
            print(dir(e))
            assert False, f"{filepath} 校验失败, {e}"


def check_path(path):
    """校验 指定目录 中的 json 文件"""
    [check_json(f, path) for f in os.listdir(path)]


def is_book_directory(book):
    if not os.path.isdir(book):
        return False

    for i in book:
        if i > u'\u4e00' and i < u'\u9fff':
            return True
    return False


for path in [i for i in os.listdir('.') if is_book_directory(i)]:
    namespace[f'test_{path}'] = functools.partial(check_path, f'{path}')
