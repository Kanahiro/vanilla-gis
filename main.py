import json, io, datetime, codecs

from flask import Flask, render_template, request, jsonify, make_response, send_file
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

from convert import zipped_shp_to_geojson
from decode import decode_to_geojson
from models import Custom_overlay

app = Flask(__name__)
engine = create_engine('sqlite:///db.sqlite3') #define the database will be used
SessionMaker = sessionmaker(bind=engine)
session = scoped_session(SessionMaker)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/', methods=["POST"])
#TODO SHP,GEOJSON以外にも対応（CSV）、ラスター対応
def convert_to_geojson():
	file = request.files['datafile']
	mimetype = file.filename.lower()
	geojson = None
	if mimetype.endswith('.geojson'):
		geojson = decode_to_geojson(file.read())
		geojson['name'] = file.filename[:-8]
	elif mimetype.endswith('.zip'):
		geojson = zipped_shp_to_geojson(file)
	return jsonify(geojson)

@app.route('/export', methods=["POST"])
def export_geojson():
	#受信
	map_title = request.form['mapTitle']
	geojsons = request.form['geojsons']
	#受信データ処理と送信
	geojson = json.loads(geojsons)
	geojson_file = io.StringIO()
	json.dump(geojson, geojson_file, indent=4)
	downloadFileName = "test.geojson"
	response = make_response()
	response.data = geojson_file.getvalue()
	response.headers['Content-Disposition'] = 'attachment; filename=' + downloadFileName
	return response

'''

#DBにレイヤーグループを保存する
@app.route('/save', methods=["POST"])
def save_overlay():
	#DBにレイヤーグループを追加する処理
	#geojsonsはGeoJSONデータがStringに変換されたもの
	map_title = request.form['mapTitle']
	author_name = request.form['authorName']
	geojsons = request.form['geojsons']
	new_custom_map = Custom_overlay(title=map_title, author=author_name, layers=geojsons)
	session.add(new_custom_map)
	session.commit()
	print(session.query(Custom_overlay).all())
	return "OK"


#TODO パスワード設定
@app.route('/user_map/<map_id>')
def user_map(map_id):
	map = session.query(Custom_overlay).get(map_id)
	return render_template('usermap.html',map_title=map.title, author_name=map.author, id=map_id)

@app.route('/user_map', methods=["POST"])
def get_user_map():
	user_map_id = request.form["map_id"]
	map = session.query(Custom_overlay).get(user_map_id)
	parsed_json = json.loads(map.layers)
	return jsonify(parsed_json)

'''

if __name__ == '__main__':
	app.run()