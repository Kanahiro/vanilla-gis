from flask import Flask, render_template, request, jsonify
from convert import zipped_shp_to_geojson
from decode import decode_to_geojson
import json, io

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

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
	geojsons = request.form['geojsons']
	#DBにカスタムレイヤーを追加する処理
	#geojsonsはGeoJSONデータをStringに変換している
	#StringをDBに保存
	return "OK"

if __name__ == '__main__':
	app.run()