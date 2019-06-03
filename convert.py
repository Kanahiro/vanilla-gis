CODECS = ['utf-8','shift_jis','euc_jp','cp932',
          'euc_jis_2004','euc_jisx0213',
          'iso2022_jp','iso2022_jp_1','iso2022_jp_2','iso2022_jp_2004','iso2022_jp_3','iso2022_jp_ext',
          'shift_jis_2004','shift_jisx0213',
          'utf_16','utf_16_be','utf_16_le','utf_7','utf_8_sig']

import shapefile, io, zipfile

#ZIP保存されたSHP群をGEOJSON形式で返す
def zipped_shp_to_geojson(zipped_shp):
	zipped_files = zipfile.ZipFile(zipped_shp)
	shp_name = zipped_shp.filename[:-4]
	#TODO shapefile適合判定
	shp_file_bytes = zipped_files.read(shp_name + '.shp')
	shx_file_bytes = zipped_files.read(shp_name + '.shx')
	dbf_file_bytes = zipped_files.read(shp_name + '.dbf')

	geojson = dict(name=shp_name,
					type="FeatureCollection",
					features=[])
	#pyshpはライブラリ内部でデコードするので、正しいエンコーディングでデコード出来るまでループ
	for codec in CODECS:
		try:
			reader = shapefile.Reader(shp=io.BytesIO(shp_file_bytes),
					                    shx=io.BytesIO(shx_file_bytes),
					                    dbf=io.BytesIO(dbf_file_bytes),encoding=codec)

			fields = reader.fields[1:]
			field_names = [field[0] for field in fields]
			for sr in reader.shapeRecords():
				atr = dict(zip(field_names, sr.record))
				geom = sr.shape.__geo_interface__
				geojson['features'].append(dict(type="Feature", \
				 geometry=geom, properties=atr))
			print(codec + 'encoding is correct.' )
			break
		except UnicodeDecodeError:
			print(codec + 'is not suitable for this file.')
			continue
	return geojson
#TODO CSV対応