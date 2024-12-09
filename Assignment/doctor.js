const form = document.getElementById("uploadForm");
const responseMessage = document.getElementById("responseMessage");
const assignmentFileInput = document.getElementById("assignmentFile");
const deadlineInput = document.getElementById("deadline");
const assignmentList = document.getElementById("assignmentList");

// Function to toggle deadline based on file presence
assignmentFileInput.addEventListener("change", function () {
    if (assignmentFileInput.files.length === 0) {
        deadlineInput.disabled = true;
        deadlineInput.value = ""; // Clear the deadline
    } else {
        deadlineInput.disabled = false;
    }
});

// Function to render existing assignments
function renderAssignments(assignments) {
    assignmentList.innerHTML = `
        <h2>📋 Existing Assignments</h2>
        <p>Manage deadlines or remove assignments:</p>
    `;

    if (assignments.length === 0) {
        assignmentList.innerHTML += "<p>No assignments available.</p>";
        return;
    }

    assignmentList.innerHTML += assignments
        .map(
            (item, index) => `
            <div class="assignment">
                <p><strong>Assignment:</strong> ${item.fileName || "Google Form"}</p>
                ${item.googleFormUrl ? `<p><strong>Google Form:</strong> <a href="${item.googleFormUrl}" target="_blank">View Form</a></p>` : ""}
                ${item.deadline ? `<p><strong>Deadline:</strong> ${item.deadline}</p>` : ""}
                <button onclick="removeAssignment(${index})" class="remove-btn">Remove Assignment</button>
            </div>
        `
        )
        .join("");
}

// Function to remove an assignment
function removeAssignment(index) {
    const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
    assignments.splice(index, 1); // Remove the assignment from the array
    localStorage.setItem("assignments", JSON.stringify(assignments));
    renderAssignments(assignments); // Re-render the updated assignments
    responseMessage.textContent = "✅ Assignment removed successfully!";
    responseMessage.style.color = "green";
}

// Handle assignment upload
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("assignmentFile");
    const googleFormUrl = document.getElementById("googleFormUrl").value;
    const deadline = document.getElementById("deadline").value;
    const file = fileInput.files[0];

    // Check if either a file or a form link is provided
    if (!file && !googleFormUrl) {
        responseMessage.textContent = "❌ Please upload a file or provide a Google Form link.";
        responseMessage.style.color = "red";
        return;
    }

    if (file && !deadline) {
        responseMessage.textContent = "❌ Please set a deadline for the uploaded file.";
        responseMessage.style.color = "red";
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        const fileData = {
            fileName: file ? file.name : null,
            fileData: file ? reader.result : null,
            googleFormUrl: googleFormUrl,
            deadline: file ? deadline : null, // Deadline is only relevant if a file is uploaded
        };

        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignments.push(fileData);
        localStorage.setItem("assignments", JSON.stringify(assignments));

        responseMessage.textContent = "✅ Assignment uploaded successfully!";
        responseMessage.style.color = "green";

        // Reset the form and re-render assignments
        form.reset();
        deadlineInput.disabled = true;
        renderAssignments(assignments);
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        // If no file is uploaded, directly store the data
        const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
        assignments.push({
            fileName: null,
            fileData: null,
            googleFormUrl: googleFormUrl,
            deadline: null,
        });
        localStorage.setItem("assignments", JSON.stringify(assignments));
        responseMessage.textContent = "✅ Google Form link saved successfully!";
        responseMessage.style.color = "green";

        // Reset the form and re-render assignments
        form.reset();
        deadlineInput.disabled = true;
        renderAssignments(assignments);
    }
});

// Render assignments on page load
const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
renderAssignments(assignments);
// Function to render existing assignments
function renderAssignments(assignments) {
    assignmentList.innerHTML = `
        <h2>📋 Existing Assignments</h2>
        <p>Manage deadlines or remove assignments:</p>
    `;

    if (assignments.length === 0) {
        assignmentList.innerHTML += "<p>No assignments available.</p>";
        return;
    }

    assignmentList.innerHTML += assignments
        .map(
            (item, index) => `
            <div class="assignment">
                <div class="assignment-info">
                    <p><strong>Assignment:</strong> ${item.fileName || "Google Form"}</p>
                    ${item.googleFormUrl ? `<p><strong>Google Form:</strong> <a href="${item.googleFormUrl}" target="_blank">View Form</a></p>` : ""}
                    ${item.deadline ? `<p><strong>Deadline:</strong> ${item.deadline}</p>` : ""}
                    ${item.fileData ? `<label for="editDeadline${index}">Edit Deadline:</label>
                    <input type="datetime-local" id="editDeadline${index}" value="${item.deadline || ''}">` : ""}
                </div>
                <div class="assignment-buttons">
                    ${item.fileData ? `<button onclick="updateDeadline(${index})">Update</button>` : ""}
                    <button onclick="removeAssignment(${index})" class="remove-btn">Remove</button>
                </div>
            </div>
        `
        )
        .join("");
}

// Function to update an assignment's deadline
function updateDeadline(index) {
    const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
    const newDeadline = document.getElementById(`editDeadline${index}`).value;
    const updateMessage = document.createElement("p");

    if (!newDeadline) {
        alert("❌ Please select a valid deadline.");
        return;
    }

    assignments[index].deadline = newDeadline;
    localStorage.setItem("assignments", JSON.stringify(assignments));
    alert("✅ Deadline updated successfully!");

    // Re-render assignment list to reflect changes
    renderAssignments(assignments);
}
