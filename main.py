import json, io

from flask import Flask, render_template, request, jsonify, make_response
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

from convert import zipped_shp_to_geojson
from decode import decode_to_geojson
from models import Custom_overlay

app = Flask(__name__)
engine = create_engine('sqlite:///db.sqlite3')  # custom_overlay.db というデータベースを使うという宣言です
SessionMaker = sessionmaker(bind=engine)
session = scoped_session(SessionMaker)

@app.route('/')
def index():
	return render_template('index.html',map_title="", author_name="", layers=[])

@app.route('/', methods=["POST"])
#TODO SHP,GEOJSON以外にも対応（CSV）、ラスター対応
def return_geojson():
	file = request.files['datafile']
	mimetype = file.filename.lower()
	geojson = None
	if mimetype.endswith('.geojson'):
		geojson = decode_to_geojson(file.read())
	elif mimetype.endswith('.zip'):
		geojson = zipped_shp_to_geojson(file)
	return jsonify(geojson)

#DBにオーバーレイを保存する
#DBにはpickledされたleafletのlayersオブジェクトを保存する
@app.route('/save', methods=["POST"])
def save_overlay():
	map_title = request.form['mapTitle']
	author_name = request.form['authorName']
	geojsons = request.form['geojsons']
	#DBにカスタムレイヤーを追加する処理
	#geojsonsはGeoJSONデータをStringに変換している
	#StringをDBに保存
	new_map = Custom_overlay(title=map_title, author=author_name, layers=geojsons)
	session.add(new_map)
	session.commit()
	print(session.query(Custom_overlay).all())
	return "OK"

#TODO パスワード設定
@app.route('/user_map/<map_id>')
def custom_map(map_id):
	map = session.query(Custom_overlay).get(map_id)
	parsed_json = json.loads(map.layers)
	return render_template('usermap.html',map_title=map.title, author_name=map.author, layers=parsed_json)


if __name__ == '__main__':
	app.run()