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
            const deadline = new Date(item.deadline);
            const isExpired = now > deadline;

            return `
                <div class="assignment ${isExpired ? "expired" : ""}">
                    <p><strong>Assignment:</strong> ${item.fileName}</p>
                    <p><strong>Deadline:</strong> ${item.deadline}</p>
                    <p><strong>Time Remaining:</strong> <span id="timer${index}">${isExpired ? "Expired" : ""}</span></p>
                    ${item.googleFormUrl ? `<p><a href="${item.googleFormUrl}" target="_blank">📝 Google Form</a></p>` : ""}
                    <p><a href="${item.fileData}" download="${item.fileName}">⬇️ Download Assignment</a></p>
                    <div class="form-group">
                        <label for="answer${index}">Upload Answer:</label>
                        <input type="file" id="answer${index}" ${isExpired ? "disabled" : ""}>
                        <button onclick="uploadAnswer(${index})" ${isExpired ? "disabled" : ""}>
                            ${isExpired ? "Upload Disabled" : "Upload Answer"}
                        </button>
                        <p class="upload-message" id="uploadMessage${index}"></p>
                    </div>
                </div>
            `;
        })
        .join("");

    // Initialize timers for each assignment
    assignments.forEach((item, index) => {
        const deadline = new Date(item.deadline);
        if (now <= deadline) {
            startTimer(index, deadline);
        }
    });
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
            markAsExpired(index);
            return;
        }

        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        timerElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

// Function to mark an assignment as expired
function markAsExpired(index) {
    const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
    assignments[index].expired = true;
    localStorage.setItem("assignments", JSON.stringify(assignments));
    renderAssignments(assignments);
}

// Function to upload student answer
function uploadAnswer(index) {
    const answerInput = document.getElementById(`answer${index}`);
    const file = answerInput.files[0];
    const uploadMessage = document.getElementById(`uploadMessage${index}`);

    if (!file) {
        uploadMessage.textContent = "❌ Please select a file to upload.";
        uploadMessage.style.color = "red";
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignments[index].studentAnswer = {
            fileName: file.name,
            fileData: reader.result,
        };
        localStorage.setItem("assignments", JSON.stringify(assignments));
        uploadMessage.textContent = "✅ Answer uploaded successfully!";
        uploadMessage.style.color = "green";
    };
    reader.readAsDataURL(file);
}

// Retrieve assignments from localStorage and render them
const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
renderAssignments(assignments);
