from flask import Flask, request, jsonify, make_response
from models.access import preditAccess
from models.dos import preditDos
from models.unchecked_low_level_calls import preditUnchecked
app = Flask(__name__)


@app.route("/access")
def reentrancy():
    csv = request.args.get('csv')
    if csv is None:
        return "0"
    csvArr = csv.split(',')
    result, percentage = preditAccess(csvArr)
    d = {
        "result": int(result),
        "percentage": float(percentage)
    }
    return make_response(jsonify(d), 200)

@app.route("/dos")
def arithmetic():
    csv = request.args.get('csv')
    if csv is None:
        return "0"
    csvArr = csv.split(',')
    result, percentage = preditDos(csvArr)
    d = {
        "result": int(result),
        "percentage": float(percentage)
    }
    return make_response(jsonify(d), 200)

@app.route("/unchecked")
def unchecked():
    csv = request.args.get('csv')
    if csv is None:
        return "0"
    csvArr = csv.split(',')
    result, percentage = preditUnchecked(csvArr)
    d = {
        "result": int(result),
        "percentage": float(percentage)
    }
    return make_response(jsonify(d), 200)

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=1336)