import shapefile
import io

 def shp_to_geojson(shp):
   # read the shapefile
   reader = shapefile.Reader(shp)
   fields = reader.fields[1:]
   field_names = [field[0] for field in fields]
   buffer = []
   for sr in reader.shapeRecords():
       atr = dict(zip(field_names, sr.record))
       geom = sr.shape.__geo_interface__
       buffer.append(dict(type="Feature", \
        geometry=geom, properties=atr)) 
   
   # write the GeoJSON file
   from json import dumps
   f = io.BytesIO()
   geojson = open(f, "w")
   geojson.write(dumps({"type": "FeatureCollection",\
    "features": buffer}, indent=2) + "\n")
   return f.getvalue()