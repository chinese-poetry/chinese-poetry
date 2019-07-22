# -*- coding: utf-8 -*-
from AppKit import NSPasteboard, NSStringPboardType

pb = NSPasteboard.generalPasteboard()
pbstring = pb.stringForType_(NSStringPboardType)

body = ''

for i in pbstring.split('\n'):
    content = i.strip()[0:]
    cs = content.split(u'：')

    content = '"'+ cs[0] + '--' + u'：'.join(cs[1:]) + '",\n'
    body += content


print body.strip(',\n')
