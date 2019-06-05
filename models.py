#!/usr/bin/env python # coding: utf-8
from sqlalchemy import create_engine, Column, Integer, Unicode, UnicodeText, ForeignKey, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()  # データベースのテーブルの親です

class Custom_overlay(Base):

    __tablename__ = "custom_overlays"
    id = Column(Integer, primary_key=True, unique=True)
    title = Column(Unicode(32))
    author = Column(Unicode(32))
    layers = Column(Unicode)
    pwdhash = Column(String(32), nullable=True)

    #初期化
    def __init__(self, title, author, layers, pwdhash=None):
        self.title = title
        self.author = author
        self.layers = layers
        self.pwdhash = pwdhash

if __name__ == "__main__":
    engine = create_engine('sqlite:///db.sqlite3', echo=True)
    Base.metadata.create_all(engine)  # テーブル作成