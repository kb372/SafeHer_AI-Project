/* =========================
   SAFEHER AI - SCRIPT.JS
========================= */

/* WELCOME USER */

function welcomeUser() {

    let name = document.getElementById("username").value;

    if (name.trim() === "") {
        alert("Please enter your name.");
        return;
    }

    document.getElementById("welcomeText").innerHTML =
        "🌸 Welcome, " + name + "! Stay Safe with SafeHer AI.";

}

/* PLACE SAFETY ANALYZER — CONNECTED TO MODEL API */

async function analyzeImage() {
    const imageInput = document.getElementById("imageUpload");
    const report = document.getElementById("report");
    const progressBar = document.getElementById("progressBar");
    const scoreDisplay = document.getElementById("scoreDisplay");

    if (!imageInput.files.length) {
        alert("Please upload an image first.");
        return;
    }

    const image = imageInput.files[0];

    report.innerHTML = "<p>🔍 Analyzing image with SafeHer AI...</p>";

    try {
        const formData = new FormData();
        formData.append("image", image);

        const response = await fetch(
            "http://127.0.0.1:5001/predict",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Prediction failed.");
        }

        const unsafeScore = Number(result.unsafe_score);
        const safeScore = 100 - unsafeScore;
        const isUnsafe = result.prediction === "unsafe";

        progressBar.style.width = safeScore + "%";
        scoreDisplay.textContent = safeScore.toFixed(2) + "%";

        report.innerHTML = `
            <h3>📊 SafeHer AI Image Analysis</h3>
            <p>🖼️ Image: ${image.name.replace(/[&<>"']/g, "")}</p>
            <p>🟢 Model safe score: ${safeScore.toFixed(2)}%</p>
            <p>🔴 Model unsafe score: ${unsafeScore.toFixed(2)}%</p>
            <h2>${isUnsafe ? "🔴 MODEL FLAGS THIS IMAGE" : "🟢 MODEL CLASSIFIES THIS IMAGE AS SAFE"}</h2>
            <p><strong>Important:</strong> This is an experimental AI classification,
            not a verified measure of real-world safety. Please assess the surroundings
            yourself and seek help if you feel unsafe.</p>
        `;

    } catch (error) {
        report.innerHTML = `
            <h3>⚠️ Unable to analyze image</h3>
            <p>${error.message}</p>
            <p>Check that model_api.py is running on this computer.</p>
        `;
    }
}


/* EMOTION PREDICTOR */

function detectEmotion() {

    let text =
        document.getElementById("emotionText")
        .value
        .toLowerCase();

    let emotion = "😐 Neutral";

    if (
        text.includes("happy") ||
        text.includes("great") ||
        text.includes("good") ||
        text.includes("awesome")
    ) {

        emotion = "😊 Happy";

    }

    else if (
        text.includes("sad") ||
        text.includes("cry") ||
        text.includes("depressed")
    ) {

        emotion = "😔 Sad";

    }

    else if (
        text.includes("angry") ||
        text.includes("mad")
    ) {

        emotion = "😠 Angry";

    }

    else if (
        text.includes("fear") ||
        text.includes("afraid") ||
        text.includes("scared")
    ) {

        emotion = "😨 Fear";

    }

    else if (
        text.includes("confident") ||
        text.includes("strong")
    ) {

        emotion = "💪 Confident";

    }

    document.getElementById("emotionResult").innerHTML =
        "Detected Emotion : " + emotion;

    document.getElementById("emotionDisplay").innerHTML =
        emotion;
}

/* ADVANCED CHATBOT */

function sendMessage() {

    let input =
        document.getElementById("userInput");

    let message =
        input.value.trim();

    if (message === "") {
        return;
    }

    let chatbox =
        document.getElementById("chatbox");

    chatbox.innerHTML +=
        "<div class='user'>" +
        message +
        "</div>";

    let reply =
        getBotReply(message.toLowerCase());

    setTimeout(function () {

        chatbox.innerHTML +=
            "<div class='bot'>🤖 " +
            reply +
            "</div>";

        chatbox.scrollTop =
            chatbox.scrollHeight;

    }, 600);

    input.value = "";
}

/* CHATBOT RESPONSES */

function getBotReply(message) {

    if (
        message.includes("help")
    ) {

        return "Use the SOS button immediately and contact trusted people.";

    }

    if (
        message.includes("night")
    ) {

        return "Stay in well-lit public areas and avoid isolated roads.";

    }

    if (
        message.includes("follow")
    ) {

        return "Move toward a crowded place and call someone you trust.";

    }

    if (
        message.includes("safe")
    ) {

        return "Share your live location with family or friends.";

    }

    if (
        message.includes("alone")
    ) {

        return "Stay connected with someone and avoid unsafe routes.";

    }

    if (
        message.includes("emergency")
    ) {

        return "Activate SOS and contact emergency services immediately.";

    }

    return "I am SafeHer AI. Ask me about safety, emergencies, self-defense or personal security.";
}

/* SOS ALERT */

function sendSOS() {

    alert(
        "🚨 SOS ALERT ACTIVATED!\n\nEmergency contacts have been notified."
    );
}


window.addEventListener("load", function () {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log("Location permission granted.");
      console.log("Latitude:", position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);
    },
    function (error) {
      console.log("Location error:", error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
});
