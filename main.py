from flask import Flask, render_template, request, jsonify
from convert import zipped_shp_to_geojson
from decode import decode_to_geojson
import json, io

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/', methods=["POST"])
#TODO SHP,GEOJSON以外にも対応（CSV）
def return_geojson():
	file = request.files['datafile']
	mimetype = file.filename.lower()
	geojson = None
	if mimetype.endswith('.geojson'):
		geojson = decode_to_geojson(file.read())
	elif mimetype.endswith('.zip'):
		geojson = zipped_shp_to_geojson(file)
	return jsonify(geojson)


if __name__ == '__main__':
	app.run()