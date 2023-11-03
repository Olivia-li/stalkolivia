from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import threading
import time
import json

app = Flask(__name__)
CORS(app)

latest_location_data = {}

def fetch_location_data():
    global latest_location_data
    while True:
        try:
            result = subprocess.run(
                [
                    'jq',
                    '-r',
                    '.[] | select(.name == "Keys") | {latitude: .location.latitude, longitude: .location.longitude, timestamp: (.location.timeStamp/1000 | todate)}',
                    '/Users/oliviali/Library/Caches/com.apple.findmy.fmipcore/Items.data'
                ],
                capture_output=True,
                text=True,
                check=True
            )
            latest_location_data = json.loads(result.stdout)
        except subprocess.CalledProcessError as e:
            print(f"Subprocess error: {e.output}")
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e.msg}")
        except Exception as e:
            print(f"Unexpected error: {e}")
        finally:
            time.sleep(4)
@app.route('/location')
def get_location():
    if latest_location_data:
        return jsonify(latest_location_data)
    else:
        return jsonify({"error": "Location data is not available"}), 503

if __name__ == '__main__':
    threading.Thread(target=fetch_location_data, daemon=True).start()
    app.run(debug=True, host='0.0.0.0', port=3001)

