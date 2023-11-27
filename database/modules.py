from sqlalchemy import Column, Integer, Text
from sqlalchemy import String
from sqlalchemy.orm import declarative_base
from sqlalchemy_repr import RepresentableBase

Base = declarative_base(cls=RepresentableBase)

class YuanQu(Base):
    __tablename__ = "YuanQu"
    id = Column(Integer, primary_key=True)
    dynasty = Column(String(10))
    author = Column(String(20))
    paragraphs = Column(Text)
    title = Column(String(100))
    
class HuaJianJi(Base):
    __tablename__ = "HuaJianJi"
    id = Column(Integer, primary_key=True)
    title = Column(String(100))
    paragraphs = Column(Text)
    author = Column(String(20))
    rhythmic = Column(String(20))
    notes = Column(Text)

class ChuCi(Base):
    __tablename__ = "ChuCi"
    id = Column(Integer, primary_key=True)
    title = Column(String(100))
    section = Column(String(20))
    author = Column(String(20))
    content = Column(Text)

class ShiJing(Base):
    __tablename__ = "Shijing"
    id = Column(Integer, primary_key=True)
    title = Column(String(100))
    chapter = Column(String(20))
    section = Column(String(20))
    content = Column(Text)
    
class LunYu(Base):
    __tablename__ = "LunYu"
    id = Column(Integer, primary_key=True)
    chapter = Column(String(20))
    paragraphs = Column(Text)
class SiShuWuJing(Base):
    __tablename__ = "SiShuWuJing"
    id = Column(Integer, primary_key=True)
    chapter = Column(String(20))
    paragraphs = Column(Text)

class SongCi(Base):
    __tablename__ = "SongCi"
    id = Column(Integer, primary_key=True)
    author = Column(String(20))
    paragraphs = Column(Text)
    rhythmic = Column(String(100))

class TangShi(Base):
    __tablename__ = "TangShi"
    id = Column(Integer, primary_key=True)
    author = Column(String(20))
    paragraphs = Column(Text)
    note = Column(Text)
    title = Column(String(100))
    
class TangShi_Simple(Base):
    __tablename__ = "TangShi_Simple"
    id = Column(Integer, primary_key=True)
    author = Column(String(20))
    paragraphs = Column(Text)
    note = Column(Text)
    title = Column(String(100))


