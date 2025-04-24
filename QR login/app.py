from flask import Flask, render_template, request, jsonify, redirect
import qrcode
import io
import base64
import uuid

app = Flask(__name__)

# In-memory token store
session_tokens = {}

@app.route('/')
def login_page():
    # Generate unique token
    token = str(uuid.uuid4())
    session_tokens[token] = None

    # Only send the token in QR code now
    qr_data = f"{token}"
    img = qrcode.make(qr_data)
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    img_str = base64.b64encode(buf.getvalue()).decode("utf-8")

    return render_template('qr_login.html', qr_img=img_str, token=token)

@app.route('/qr-login')
def qr_login():
    token = request.args.get('token')
    return f"<h3>Token received: {token}</h3><p>Send POST request to /mobile-login with this token to simulate login.</p>"

@app.route('/mobile-login', methods=['POST'])
def mobile_login():
    # Read form-data (not JSON)
    token = request.form.get("token")
    user_id = request.form.get("user_id")

    print(">>> Received token:", token)
    print(">>> User ID:", user_id)

    if token in session_tokens:
        session_tokens[token] = user_id
        return jsonify({"status": "success"})
    return jsonify({"status": "invalid"})

@app.route('/check-login')
def check_login():
    token = request.args.get('token')
    user = session_tokens.get(token)
    if user:
        return "LOGGED_IN"
    return "WAITING"

@app.route('/dashboard')
def dashboard():
    return redirect("https://preview--iob-remit-flow-portal.lovable.app/#dashboard")

if __name__ == '__main__':
    print("✅ Flask app is starting...")
    app.run(host='192.168.0.162')
