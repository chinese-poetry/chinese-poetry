import json
import os
import time
from os.path import join

import opencc
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from modules import *


def create_table(is_force=False):
    if is_force:
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)
    else:
        Base.metadata.create_all(engine, checkfirst=True)


class JsonData(object):
    def __init__(self, path, besides=[]):
        self.path = path
        self.besides = besides

    def get_files(self):
        files = os.listdir(self.path)
        files_new = [os.path.join(self.path, _) for _ in files if _.endswith(".json")]
        return files_new

    @staticmethod
    def filter_files(files, besides: list = [], regex: str = None):
        def check_file(file):
            is_in = False
            for check in besides:
                if check in file:
                    is_in = True
                    break
            return is_in

        result = []
        for json_file in files:
            # 排除文件路径干扰，只取文件名检测
            json_file_name = os.path.basename(json_file)
            ret = check_file(json_file_name)
            if not ret:
                result.append(json_file)
        if regex:
            ...
        return result

    @staticmethod
    def get_data(path):
        with open(path, 'r', encoding="utf-8") as f:
            json_data = json.load(f)
        return json_data

    def get_all_data(self):
        files = self.get_files()
        files_new = self.filter_files(files, besides=self.besides)
        _temp = []
        for file in files_new:
            json_data = self.get_data(file)
            for d in json_data:
                _temp.append(d)
        return _temp

    def run(self):
        return self.get_all_data()


def yuanqu(path, besides, _session: Session):
    datas = JsonData(path, besides=besides).run()
    for data in datas:
        dynasty = data.get("dynasty", "None")
        author = data.get("author", "None")
        paragraphs = data.get("paragraphs", "None")
        paragraphs = "".join(paragraphs)
        title = data.get("title", "None")
        _session.add(YuanQu(dynasty=dynasty, author=author, paragraphs=paragraphs, title=title))


def huajian(path, besides, _session: Session):
    datas = JsonData(path, besides=besides).run()
    for data in datas:
        title = data.get("title", "None")
        paragraphs = data.get("paragraphs", "None")
        paragraphs = "".join(paragraphs)
        author = data.get("author", "None")
        rhythmic = data.get("rhythmic", "None")
        notes = data.get("notes", "None")
        notes = "".join(notes)
        _session.add(HuaJianJi(rhythmic=rhythmic, author=author, paragraphs=paragraphs, title=title, notes=notes))


def quantangshi(path, besides, _session: Session, is_simplified=False):
    datas = JsonData(path, besides=besides).run()
    converter = opencc.OpenCC('t2s')
    for data in datas:
        author = data.get("author", "None")
        paragraphs = data.get("paragraphs", "None")
        paragraphs = "".join(paragraphs)
        note = data.get("note", "None")
        note = "".join(note)
        title = data.get("title", "None")
        _session.add(TangShi(author=author, paragraphs=paragraphs, note=note, title=title))
        if is_simplified:
            _session.add(TangShi_Simple(author=converter.convert(author), paragraphs=converter.convert(paragraphs),
                                        note=converter.convert(note), title=converter.convert(title)))


def sishuwujing(path, besides, _session: Session):
    datas = JsonData(path, besides=besides).run()
    for data in datas:
        if not isinstance(data, dict):
            continue
        chapter = data.get("chapter", "None")
        paragraphs = data.get("paragraphs", "None")
        paragraphs = "".join(paragraphs)
        _session.add(SiShuWuJing(chapter=chapter, paragraphs=paragraphs))
    pass


def songci(path, besides, _session: Session):
    datas = JsonData(path, besides=besides).run()
    for data in datas:
        author = data.get("author", "None")
        paragraphs = data.get("paragraphs", "None")
        paragraphs = "".join(paragraphs)
        rhythmic = data.get("rhythmic", "None")
        _session.add(SongCi(author=author, paragraphs=paragraphs, rhythmic=rhythmic))
    pass


def chuci(path, besides, _session: Session):
    datas = JsonData(path, besides=besides).run()
    for data in datas:
        section = data.get("section", "None")
        author = data.get("author", "None")
        title = data.get("title", "None")
        content = data.get("content", "None")
        content = "".join(content)
        _session.add(ChuCi(section=section, author=author, content=content, title=title))


def lunyu(path, besides, _session: Session):
    datas = JsonData(path, besides=besides).run()
    for data in datas:
        chapter = data.get("chapter", "None")
        paragraphs = data.get("paragraphs", "None")
        paragraphs = "".join(paragraphs)
        _session.add(LunYu(chapter=chapter, paragraphs=paragraphs))
    pass


def shijing(path, besides, _session: Session):
    datas = JsonData(path, besides=besides).run()
    for data in datas:
        section = data.get("section", "None")
        title = data.get("title", "None")
        chapter = data.get("chapter", "None")
        content = data.get("content", "None")
        content = "".join(content)
        _session.add(ShiJing(section=section, chapter=chapter, content=content, title=title))


def core(_session: Session):
    current_dir = os.path.dirname(__file__)
    basedir = os.path.dirname(current_dir)

    yuanqu_dir = join(basedir, f"元曲")
    hujian_dir = join(basedir, f"五代诗词{os.sep}huajianji")
    chuci_dir = join(basedir, f"楚辞")
    shijing_dir = join(basedir, f"诗经")
    lunyu_dir = join(basedir, f"论语")
    sishuwujing_dir = join(basedir, f"四书五经")
    songci_dir = join(basedir, f"宋词")
    quantangshi_dir = join(basedir, f"全唐诗")

    yuanqu(_session=_session, path=yuanqu_dir, besides=[])
    huajian(_session=_session, path=hujian_dir, besides=['huajianji-0-preface.json'])
    sishuwujing(_session=_session, path=sishuwujing_dir, besides=[])
    chuci(_session=_session, path=chuci_dir, besides=[])
    lunyu(_session=_session, path=lunyu_dir, besides=[])
    shijing(_session=_session, path=shijing_dir, besides=[])
    songci(_session=_session, path=songci_dir, besides=["author.song.json"])
    quantangshi(_session=_session, path=quantangshi_dir, besides=["authors", "唐诗", "表面结构字"], is_simplified=True)


if __name__ == '__main__':
    s = time.time()
    url = f"""sqlite:///{os.path.join(os.path.dirname(__file__), "culture.db")}"""
    engine = create_engine(url)
    session = Session(engine)
    create_table(is_force=True)
    core(_session=session)
    session.commit()
    session.close()
    e = time.time()
    print(f"spend time {int(e - s)} seconds")
