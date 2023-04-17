#!-*- coding: utf-8 -*-

import json, sys
import sqlite3
from collections import OrderedDict

try:               # Python 2
    reload(sys)
    sys.setdefaultencoding('utf-8')
except NameError:  # Python 3
    pass

c = sqlite3.connect('ci.db')

cursor = c.execute("SELECT name, long_desc, short_desc from ciauthor;")

d = {"name": None, "description": None, "short_description": None}

authors = []

for row in cursor:
    author = OrderedDict(sorted(d.items(), key=lambda t: t[0]))
    author["name"] = row[0]
    author["description"] = row[1]
    author["short_description"] = row[2]
    authors.append(author) 

open('author.song.json', 'w').write(json.dumps(authors, indent=2, ensure_ascii=False))


cursor = c.execute("SELECT rhythmic, author, content from ci;")

d = {"rhythmic": None, "author": None, "paragraphs": None}

cis = []

for row in cursor:
    ci = OrderedDict(sorted(d.items(), key=lambda t: t[0]))
    ci["rhythmic"] = row[0]
    ci["author"] = row[1]
    ci["paragraphs"] = row[2].split('\n')
    cis.append(ci) 

for i in range(0, 21050, 1000):
    open('ci.song.%s.json' % i, 'w').write(json.dumps(cis[i:i+1000], indent=2, ensure_ascii=False))

