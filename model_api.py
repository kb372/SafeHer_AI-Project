
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "safeher_model.keras"

model = tf.keras.models.load_model(MODEL_PATH)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "SafeHer AI model API is running"})

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "Please upload an image"}), 400

    try:
        image = Image.open(
            io.BytesIO(request.files["image"].read())
        ).convert("RGB").resize((224, 224))

        array = np.array(image, dtype=np.float32)
        array = np.expand_dims(array, axis=0)

        score = float(model.predict(array, verbose=0)[0][0])

        return jsonify({
            "prediction": "unsafe" if score >= 0.5 else "safe",
            "unsafe_score": round(score * 100, 2),
            "note": "Experimental prediction, not a real-world safety guarantee."
        })
    except Exception as error:
        return jsonify({"error": str(error)}), 400

if __name__ == "__main__":
    import os
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5001)),
        debug=False
    )
