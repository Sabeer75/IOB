from flask import Flask, request, jsonify
import requests
from phishing_model import analyze_phishing

app = Flask(__name__)

@app.route("/check", methods=["POST"])
def check():
    data = request.json
    url = data.get("url")

    is_phishing = analyze_phishing(url)
    return jsonify({"isPhishing": is_phishing})

if __name__ == "__main__":
    app.run(debug=True)
