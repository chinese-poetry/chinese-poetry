import json
from os import listdir


class CheckTangShi:
    data = None
    file_name = None

    def __init__(self, file_name: str):
        with open(file_name, encoding='UTF-8') as f:
            self.data = json.load(f)
        self.file_name = file_name

    def check_one(self):
        """检查最后一个标点是否为句号"""
        result = []
        for each in self.data:
            juhao = False
            for x in each['paragraphs']:
                for y in x:
                    if y == '，':
                        juhao = False
                    elif y == '。':
                        juhao = True
            if not juhao:
                result.append(f"{self.file_name}：{each['title']}-{each['author']}")
                print(f"{self.file_name}：{each['title']}-{each['author']}")
        return result

    def check_two(self):
        """检查是否有异常字符"""
        res = []  # 疑似出错
        for each in self.data:
            for x in each['paragraphs']:
                for y in x:
                    if y == '—':  # 跳过联句作者提示，默认留空
                        break
                    if y == '□':  # 跳过留空
                        break
                    if y != '，' and y != '。':  # 跳过逗号句号
                        if not ('\u2e80' <= y <= '\u9fff'):  # [\u4E00-\u9FFF]
                            res.append(f"{self.file_name}：{each['title']}-{each['author']}")
                            print(f"{self.file_name}：{each['title']}-{each['author']}")
                            break
        return res


if __name__ == '__main__':
    dirs = listdir('../json/')
    res_one = []
    res_two = []
    for file in dirs:
        if file == '011.json':  # 调试中断
            break
        check_x = CheckTangShi(f'../json/{file}')
        res_one = res_one + check_x.check_one()
        res_two = res_two + check_x.check_two()
    print(f'疑似缺句：{len(res_one)} 首')
    print(f'疑似缺字：{len(res_two)} 首')
