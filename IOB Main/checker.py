import pandas as pd
import numpy as np
import time
import pickle
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import os
import datetime
import requests  

# Function to preprocess data by dropping non-numeric or irrelevant columns
def preprocess_data(data):
    columns_to_drop = ['timestamp', 'browser', 'os', 'screen_resolution', 'timezone_mismatch', 'geolocation']
    preprocessed_data = data.drop(columns=columns_to_drop, errors='ignore')
    numeric_columns = preprocessed_data.select_dtypes(include=[np.number]).columns
    return preprocessed_data[numeric_columns]

# Function to train the Isolation Forest model and save the model and scaler
def train_isolation_forest(data_path):
    data = pd.read_csv(data_path)
    preprocessed_data = preprocess_data(data)
    scaler = StandardScaler()
    normalized_data = scaler.fit_transform(preprocessed_data)
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(normalized_data)

    # Save the trained model
    with open('isolation_forest_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    # Save the fitted scaler
    with open('isolation_forest_scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    print("Model and scaler saved successfully.")
    return model, scaler

# Function to load the saved model and scaler
def load_model_and_scaler():
    with open('isolation_forest_model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    with open('isolation_forest_scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)
    
    return model, scaler

# Function to notify the server if anomaly is detected
def notify_server():
    try:
        response = requests.post("http://localhost:3000/anomaly-detected")
        if response.status_code == 200:
            print("✅ Server notified about anomaly.")
        else:
            print("❌ Failed to notify server. Status:", response.status_code)
    except Exception as e:
        print("❌ Error sending request to server:", e)

# Function to monitor the CSV file in real-time for anomalies
def monitor_csv(data_path, model, scaler):
    last_modified_time = None
    already_alerted = False  # Ensure alert is sent once per anomaly event

    while True:
        current_modified_time = os.path.getmtime(data_path)
        # Check if file has been updated
        if last_modified_time is None or current_modified_time > last_modified_time:
            last_modified_time = current_modified_time
            try:
                data = pd.read_csv(data_path)
                latest_entry = data.iloc[-1:].copy()
                preprocessed_entry = preprocess_data(latest_entry)
                normalized_entry = scaler.transform(preprocessed_entry)
                prediction = model.predict(normalized_entry)[0]
                timestamp = latest_entry['timestamp'].values[0]
                current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                if prediction == -1:
                    # Anomaly detected
                    print(f"🚨 ANOMALY DETECTED at {current_time}!")
                    print(f"Anomalous behavior in entry with timestamp: {timestamp}")
                    print(f"Raw data: {latest_entry.to_dict('records')[0]}")
                    print("-" * 50)

                    if not already_alerted:
                        notify_server()
                        already_alerted = True
                else:
                    # Normal behavior detected
                    print(f"✅ Normal behavior detected at {current_time} (timestamp: {timestamp})")
                    already_alerted = False  # Reset if behavior returns to normal
            
            except Exception as e:
                print(f"Error processing data: {e}")
        time.sleep(10)

# Main function to either train a model or load existing model and start monitoring
def main():
    data_path = 'user_activity.csv'
    
    if os.path.exists('isolation_forest_model.pkl') and os.path.exists('isolation_forest_scaler.pkl'):
        print("Loading existing model and scaler...")
        model, scaler = load_model_and_scaler()
    else:
        print("Training new model...")
        model, scaler = train_isolation_forest(data_path)
    print("Starting real-time monitoring...")
    monitor_csv(data_path, model, scaler)

if __name__ == "__main__":
    main()
