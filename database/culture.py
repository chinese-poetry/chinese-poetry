import os

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from modules import *


def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = str(getattr(row, column.name))
    return d


def query_example(_session: Session):
    _results = _session.query(SongCi).filter(SongCi.paragraphs.like("%远山%")).filter_by(author="苏轼").all()
    for r in _results:
        print(row2dict(r))
    print(len(_results))

    statement = select(SongCi).filter_by(author="李煜")
    rows = _session.scalars(statement).all()
    for row in rows:
        print(str(row2dict(row)))
        print(row.author)
        break

    statement = select(SongCi).filter(SongCi.paragraphs.like("%七夕%"), SongCi.paragraphs.like("%千里%"))
    rows = _session.scalars(statement).all()  # result = _session.execute(statement);rows = result.scalars()
    for row in rows:
        _dict = row2dict(row)
        _str = str(row2dict(row))
        print(_str)


def query_content(_session: Session, _table: Base, _column: Base, _column_value: str, _column_like: Base = None,
                  _like_str: str = None):
    _contents = []
    if _column_like and _like_str:
        _results = session.query(_table).filter(_column == _column_value, _column_like.like(f"%{_like_str}%")).all()
    else:
        _results = session.query(_table).filter(_column == _column_value).all()
    for _ in _results:
        _contents.append(row2dict(_))
    return _contents


if __name__ == '__main__':
    url = f"""sqlite:///{os.path.join(os.path.dirname(__file__), "culture.db")}"""
    engine = create_engine(url, echo=True)
    session = Session(engine)
    results_ci = session.query(SongCi).filter(SongCi.author == "苏轼", SongCi.rhythmic=="行香子",SongCi.paragraphs.like("%%")).all()
    results_shi = session.query(TangShi_Simple).filter(TangShi_Simple.author == "苏轼", TangShi_Simple.paragraphs.like("%情%")).all()
    results = results_ci + results_shi
    results_dict = [row2dict(i) for i in results]
    for i in results_dict:
        print("词：",i.get("rhythmic",None), "诗：",i.get("title",None), "content:",i.get("paragraphs",None))
    keyword = "情"
    results = []
    result = session.query(TangShi_Simple).filter(TangShi_Simple.paragraphs.like(f"%{keyword}%")).all()
    for r in result:
        results.append(row2dict(r))
    result = session.query(SongCi).filter(SongCi.paragraphs.like(f"%{keyword}%")).all()
    for r in result:
        results.append(row2dict(r))
    for r in results:
        print(r)
    print(len(results))
    session.close()
    ...
