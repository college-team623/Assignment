const assignmentList = document.getElementById("assignmentList");

// Function to render assignments
function renderAssignments(assignments) {
    const now = new Date();

    if (assignments.length === 0) {
        assignmentList.innerHTML = "<p>⚠️ No assignments available.</p>";
        return;
    }

    assignmentList.innerHTML = assignments
        .map((item, index) => {
            const deadline = item.deadline ? new Date(item.deadline) : null;
            const isExpired = deadline && now > deadline;

            // Render differently for form-only assignments
            if (!item.fileData) {
                return `
                    <div class="assignment">
                        <p><strong>Google Form:</strong></p>
                        <p><a href="${item.googleFormUrl}" target="_blank">📝 Google Form Link</a></p>
                    </div>
                `;
            }

            return `
                <div class="assignment ${isExpired ? "expired" : ""}">
                    <p><strong>Assignment:</strong> ${item.fileName}</p>
                    <p><strong>Deadline:</strong> ${item.deadline || "None"}</p>
                    <p><strong>Time Remaining:</strong> <span id="timer${index}">${isExpired ? "Expired" : ""}</span></p>
                    <p><a href="${item.fileData}" download="${item.fileName}">⬇️ Download Assignment</a></p>
                    ${!isExpired ? `
                        <div class="form-group">
                            <label for="answer${index}">Upload Answer:</label>
                            <input type="file" id="answer${index}">
                            <button onclick="uploadAnswer(${index})">Upload Answer</button>
                        </div>` : `<p class="expired-message">⏰ Upload Disabled (Deadline Passed)</p>`}
                </div>
            `;
        })
        .join("");

    // Initialize timers for assignments with deadlines
    assignments.forEach((item, index) => {
        if (item.deadline && now <= new Date(item.deadline)) {
            startTimer(index, new Date(item.deadline));
        }
    });
}

// Function to upload student answer
function uploadAnswer(index) {
    const answerInput = document.getElementById(`answer${index}`);
    const file = answerInput.files[0];
    const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
    const uploadMessage = document.createElement("p");

    if (!file) {
        alert("❌ Please select a file to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        assignments[index].studentAnswer = {
            fileName: file.name,
            fileData: reader.result,
        };
        localStorage.setItem("assignments", JSON.stringify(assignments));
        alert("✅ Answer uploaded successfully!");
    };
    reader.readAsDataURL(file);
}

// Function to start a countdown timer
function startTimer(index, deadline) {
    const timerElement = document.getElementById(`timer${index}`);
    const interval = setInterval(() => {
        const now = new Date();
        const timeRemaining = deadline - now;

        if (timeRemaining <= 0) {
            clearInterval(interval);
            timerElement.textContent = "Expired";
            return;
        }

        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        timerElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

// Retrieve assignments from localStorage and render them
const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
renderAssignments(assignments);
