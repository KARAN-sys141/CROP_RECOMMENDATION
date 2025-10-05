from flask import Flask, request, jsonify, send_from_directory
import pickle
import numpy as np
import os

app = Flask(__name__, static_folder='src')

with open('model/crop_recommendation_model.pkl', 'rb') as f:
    model = pickle.load(f)
with open('model/label_encoder.pkl', 'rb') as f:
    label_encoder = pickle.load(f)
with open('model/model_scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/styles/<path:filename>')
def styles(filename):
    return send_from_directory(os.path.join(app.static_folder, 'styles'), filename)

@app.route('/scripts/<path:filename>')
def scripts(filename):
    return send_from_directory(os.path.join(app.static_folder, 'scripts'), filename)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        N = np.log1p(float(data['N']))
        P = np.log1p(float(data['P']))
        K = np.log1p(float(data['K']))
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        ph = float(data['ph'])
        rainfall = np.log1p(float(data['rainfall']))

        features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        

        prediction = model.predict(features)
        crop = label_encoder.inverse_transform(prediction)[0]
        return jsonify({'crop': crop})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)