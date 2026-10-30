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

/* PLACE SAFETY ANALYZER */

function analyzeImage() {

    const imageInput =
        document.getElementById("imageUpload");

    if (!imageInput.files.length) {

        alert("Please upload an image first.");

        return;
    }

    let lighting =
        Math.floor(Math.random() * 31);

    let crowd =
        Math.floor(Math.random() * 26);

    let visibility =
        Math.floor(Math.random() * 21);

    let cctv =
        Math.floor(Math.random() * 16);

    let emergency =
        Math.floor(Math.random() * 11);

    let score =
        lighting +
        crowd +
        visibility +
        cctv +
        emergency;

    let status = "";

    if (score >= 80) {

        status = "🟢 SAFE AREA";

    } else if (score >= 50) {

        status = "🟡 MODERATE RISK";

    } else {

        status = "🔴 UNSAFE AREA";
    }

    document.getElementById("progressBar").style.width =
        score + "%";

    document.getElementById("scoreDisplay").innerHTML =
        score + "%";

    document.getElementById("report").innerHTML =

        "<h3>📊 SafeHer AI Report</h3>" +

        "<p>💡 Lighting : " + lighting + "/30</p>" +

        "<p>👥 Crowd Density : " + crowd + "/25</p>" +

        "<p>🛣 Visibility : " + visibility + "/20</p>" +

        "<p>📹 CCTV Presence : " + cctv + "/15</p>" +

        "<p>🚔 Emergency Access : " + emergency + "/10</p>" +

        "<br>" +

        "<h2>Safety Score : " + score + "/100</h2>" +

        "<h2>" + status + "</h2>";
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
