
from flask import Flask, request, jsonify
import cv2
import numpy as np

app = Flask(__name__)


@app.route("/")
def home():
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SafeHer AI - Image Analyzer</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 30px 16px;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #e0f2fe, #fce7f3, #dcfce7);
            min-height: 100vh;
            color: #17324d;
        }

        .container {
            max-width: 650px;
            margin: 25px auto;
            padding: 28px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
        }

        h1 {
            text-align: center;
            color: #087e8b;
        }

        .subtitle {
            text-align: center;
            color: #536579;
        }

        input, button {
            width: 100%;
            margin-top: 15px;
            padding: 13px;
            border-radius: 10px;
            font-size: 15px;
        }

        input {
            border: 1px solid #cbd5e1;
            background: #f8fafc;
        }

        button {
            border: none;
            color: white;
            background: #087e8b;
            cursor: pointer;
            font-weight: bold;
        }

        button:hover {
            background: #06616b;
        }

        #preview {
            display: none;
            width: 100%;
            max-height: 300px;
            object-fit: contain;
            margin-top: 18px;
            border-radius: 12px;
            background: #f1f5f9;
        }

        #report {
            margin-top: 22px;
            padding: 18px;
            border-radius: 12px;
            background: #f0fdfa;
            white-space: pre-line;
            overflow-wrap: anywhere;
            line-height: 1.7;
        }

        .note {
            font-size: 13px;
            color: #536579;
            line-height: 1.6;
        }
    </style>
</head>

<body>
    <main class="container">
        <h1>🛡️ SafeHer AI</h1>
        <p class="subtitle">Smart Place Image Analyzer</p>

        <p>
            Upload a photograph to examine its visible brightness
            and contrast.
        </p>

        <input type="file" id="photo" accept="image/*">
        <img id="preview" alt="Selected photograph">

        <button id="analyze">Analyze Image</button>

        <div id="report" aria-live="polite">
            Your image analysis report will appear here.
        </div>

        <p class="note">
            Educational prototype: image brightness and contrast alone
            cannot establish whether a location is safe.
        </p>
    </main>

    <script>
        const photo = document.getElementById("photo");
        const preview = document.getElementById("preview");
        const report = document.getElementById("report");
        const button = document.getElementById("analyze");

        photo.addEventListener("change", function () {
            const file = photo.files[0];

            if (!file) {
                preview.style.display = "none";
                return;
            }

            if (!file.type.startsWith("image/")) {
                report.textContent = "Please select an image file.";
                photo.value = "";
                preview.style.display = "none";
                return;
            }

            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
            report.textContent = "Image selected. Click Analyze Image.";
        });

        button.addEventListener("click", async function () {
            const file = photo.files[0];

            if (!file) {
                report.textContent = "Please select a photo first.";
                return;
            }

            const formData = new FormData();
            formData.append("image", file);

            button.disabled = true;
            button.textContent = "Analyzing...";
            report.textContent = "Please wait while the image is analyzed.";

            try {
                const response = await fetch("/analyze", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Analysis failed.");
                }

                report.textContent =
                    "IMAGE ANALYSIS REPORT\n\n" +
                    "Average brightness: " + data.brightness + " / 255\n" +
                    "Image contrast: " + data.contrast + "\n\n" +
                    "Observation: " + data.observation + "\n\n" +
                    "Important: This report describes image properties only. " +
                    "It does not detect crime, people, emergency services, " +
                    "or actual location safety.";
            } catch (error) {
                report.textContent =
                    "Could not analyze the image.\n" + error.message;
            } finally {
                button.disabled = false;
                button.textContent = "Analyze Image";
            }
        });
    </script>
</body>
</html>
"""


@app.route("/analyze", methods=["POST"])
def analyze():
    uploaded = request.files.get("image")

    if uploaded is None or not uploaded.filename:
        return jsonify(error="Please upload an image."), 400

    raw = uploaded.read()

    if not raw:
        return jsonify(error="The uploaded file is empty."), 400

    image_array = np.frombuffer(raw, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        return jsonify(
            error="Invalid image. Please choose a valid JPG or PNG."
        ), 400

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    brightness = float(np.mean(gray))
    contrast = float(np.std(gray))

    if brightness < 65:
        observation = (
            "The image appears relatively dark. "
            "Check the actual lighting and visibility in person."
        )
    elif brightness < 135:
        observation = (
            "The image has moderate brightness. "
            "Check the real-world lighting and visibility."
        )
    else:
        observation = (
            "The image appears relatively bright. "
            "Brightness alone does not establish safety."
        )

    return jsonify(
        brightness=round(brightness, 1),
        contrast=round(contrast, 1),
        observation=observation
    )


if __name__ == "__main__":
    app.run(debug=True)
    image_path = r"C:\Users\PC\Desktop\SafeHerAI_Web\test_image.jpg"

image = cv2.imread(image_path)

if image is None:
    print("Image not found. Check the file path.")
else:
    print("Image loaded successfully.")
    
import cv2
import numpy as np
import joblib

# Load the trained model
model = joblib.load("safeher_model.pkl")

# Read the uploaded image
image = cv2.imread(image_path)

if image is None:
    raise ValueError("Unable to read the uploaded image.")

# Resize to a standard size
image = cv2.resize(image, (128, 128))

# Convert to grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Extract basic visual features
brightness = float(np.mean(gray))
contrast = float(np.std(gray))
edges = cv2.Canny(gray, 100, 200)
edge_density = float(np.mean(edges > 0))

# Prepare features in the order used during training
features = np.array([[
    brightness,
    contrast,
    edge_density
]])

# Predict using the trained model
prediction = model.predict(features)

print("Model prediction:", prediction[0])