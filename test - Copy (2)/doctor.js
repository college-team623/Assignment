const form = document.getElementById("uploadForm");
const responseMessage = document.getElementById("responseMessage");
const assignmentList = document.getElementById("assignmentList");

// Function to render existing assignments for editing deadlines
function renderAssignments(assignments) {
    if (assignments.length === 0) {
        assignmentList.innerHTML += "<p>No assignments available.</p>";
        return;
    }

    assignmentList.innerHTML += assignments
        .map(
            (item, index) => `
            <div class="assignment">
                <p><strong>Assignment:</strong> ${item.fileName}</p>
                <p><strong>Google Form:</strong> ${item.googleFormUrl || "Not provided"}</p>
                <label for="editDeadline${index}">Edit Deadline:</label>
                <input type="datetime-local" id="editDeadline${index}" value="${item.deadline}">
                <button onclick="updateDeadline(${index})">Update Deadline</button>
                <p class="update-message" id="updateMessage${index}"></p>
            </div>
        `
        )
        .join("");
}

// Function to update an assignment's deadline
function updateDeadline(index) {
    const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
    const newDeadline = document.getElementById(`editDeadline${index}`).value;
    const updateMessage = document.getElementById(`updateMessage${index}`);

    if (!newDeadline) {
        updateMessage.textContent = "❌ Please select a valid deadline.";
        updateMessage.style.color = "red";
        return;
    }

    assignments[index].deadline = newDeadline;
    localStorage.setItem("assignments", JSON.stringify(assignments));
    updateMessage.textContent = "✅ Deadline updated successfully!";
    updateMessage.style.color = "green";
}

// Function to upload a new assignment
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("assignmentFile");
    const googleFormUrl = document.getElementById("googleFormUrl").value;
    const deadline = document.getElementById("deadline").value;
    const file = fileInput.files[0];

    if (!file || !deadline) {
        responseMessage.textContent = "❌ Please select a file and set a deadline.";
        responseMessage.style.color = "red";
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        const fileData = {
            fileName: file.name,
            fileData: reader.result,
            googleFormUrl: googleFormUrl,
            deadline: deadline,
        };

        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignments.push(fileData);
        localStorage.setItem("assignments", JSON.stringify(assignments));

        responseMessage.textContent = "✅ Assignment uploaded successfully!";
        responseMessage.style.color = "green";
    };
    reader.readAsDataURL(file);
});

// Render assignments for editing deadlines
const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
renderAssignments(assignments);
