CODECS = ['utf-8','shift_jis','euc_jp','cp932',
          'euc_jis_2004','euc_jisx0213',
          'iso2022_jp','iso2022_jp_1','iso2022_jp_2','iso2022_jp_2004','iso2022_jp_3','iso2022_jp_ext',
          'shift_jis_2004','shift_jisx0213',
          'utf_16','utf_16_be','utf_16_le','utf_7','utf_8_sig']

import json

def decode_to_geojson(data):
  for codec in CODECS:
    try:
      decoded = data.decode(codec)
      parsed_json = json.loads(decoded)
      print("OK:" + codec)
      return parsed_json
    except:
      print("NG:" + codec)
      continue