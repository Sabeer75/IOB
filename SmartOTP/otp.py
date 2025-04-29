import time
import random
import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {'databaseURL': 'https://otp-system-ce0a2-default-rtdb.asia-southeast1.firebasedatabase.app/'})

def generate_otp():
    return str(random.randint(100000, 999999))

while True:
    otp = generate_otp()
    data = {
        'code': otp,
        'timestamp': int(time.time())
    }
    db.reference('otp').set(data)
    print("Updated OTP:", otp)
    time.sleep(30)
