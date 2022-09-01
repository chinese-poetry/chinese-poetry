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

    def check_xy(self):
        """檢查逗號句號是否連續"""
        result = []
        for each in self.data:
            juhao = 0
            for x in each['paragraphs']:
                for y in x:
                    if y == '，':
                        juhao += 1  # 需要一个句号
                    elif y in ['。', '！', '？']:
                        juhao -= 1
            if juhao != 0:
                result.append(f"{self.file_name}：{each['title']}-{each['author']}")
                print(f"{self.file_name}：{each['title']}-{each['author']}")
                print(each['paragraphs'])
        return result

    def check_two(self):
        """检查是否有异常字符"""
        res = []  # 疑似出错
        for each in self.data:
            for x in each['paragraphs']:
                for y in x:
                    if y in ['—', '□', '𪒶']:  # 跳过联句作者提示等特殊字符
                        continue
                    if y != '，' and y != '。' and y != '？' and y != '！':  # 跳过逗号句号
                        if not ('\u2e80' <= y <= '\u9fff'):  # [\u4E00-\u9FFF]
                            res.append(f"{self.file_name}：{each['title']}-{each['author']}")
                            print(f"{self.file_name}：{each['title']}-{each['author']}")
                            break
                else:
                    continue
                break
        return res

    def check_title(self):
        """检查标题是否单边书名号"""
        res = []  # 疑似出错
        for each in self.data:
            right = False  # 右括号
            left = False  # 左
            for x in each['title']:
                if x == '《':
                    left = True
                elif x == '》':
                    right = True
            if right ^ left:
                res.append(f"{self.file_name}：{each['title']}-{each['author']}")
                print(f"{self.file_name}：{each['title']}-{each['author']}")
        return res


if __name__ == '__main__':
    dirs = listdir('../json/')
    res_one = []
    res_two = []
    for file in dirs[0: 15]:
        check_x = CheckTangShi(f'../json/{file}')
        res_one = res_one + check_x.check_one()
        res_two = res_two + check_x.check_two()
    print(f'疑似缺句：{len(res_one)} 首')
    print(f'疑似缺字：{len(res_two)} 首')
