document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.getElementById("downloadBtn");
    const videoUrlInput = document.getElementById("videoUrl");
    const statusEl = document.getElementById("status");

    function showStatus(msg) {
        statusEl.textContent = msg;
    }

    async function downloadVideo() {
        const url = videoUrlInput.value.trim();
        if (!url) {
            showStatus("❌ Please enter a valid TeraBox video URL.");
            return;
        }

        showStatus("⏳ Fetching download link...");

        try {
            // API used from original repo
            const apiUrl = `https://api.teraboxdownloader.com/get?url=${encodeURIComponent(url)}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                showStatus("❌ Failed to reach server.");
                return;
            }

            const data = await response.json();

            if (!data || !data.direct_link) {
                showStatus("❌ Unable to extract video. Invalid link.");
                return;
            }

            const direct = data.direct_link;
            const filename = data.filename || "terabox_video.mp4";

            showStatus("⬇️ Downloading… please wait.");

            // Create invisible link to auto-download
            const a = document.createElement("a");
            a.href = direct;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            showStatus("✅ Download started!");
        } catch (e) {
            console.error(e);
            showStatus("❌ Error fetching download link.");
        }
    }

    // Button click → download
    downloadBtn.addEventListener("click", downloadVideo);
});
