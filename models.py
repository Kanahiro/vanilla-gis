#!/usr/bin/env python # coding: utf-8
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, Unicode, UnicodeText, ForeignKey, PickleType
from sqlalchemy.orm import relationship, backref
from datetime import datetime

db = SQLAlchemy()

class CustomOverLay(db.Model):

    __tablename__ = "customOverLay"
    id = Column(Integer, primary_key=True)
    title = Column(Unicode(32))
    auther = Column(Unicode(32))
    layers = Column(PickleType)
    pwdhash = Column(String(32), nullable=True)

    #初期化
    def __init__(title, auther, pickled_layers, pwdhash):
        self.title = title
        self.auther = auther
        self.layers = pickled_layers
        self.pwdhash = pwdhash