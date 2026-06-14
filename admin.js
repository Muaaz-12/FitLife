//: Admin Panel - Fetch Data & Calculate Stats ---

const API_URL = 'http://localhost:3000/logs';

async function loadAdminData() {
    const tbody = document.getElementById('admin-table-body');
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Server error");
        
        const logs = await response.json();
        
        // 1. Calculate 3 Summary Statistics (Capstone Requirement)
        const totalLogs = logs.length;
        const totalCalories = logs.reduce((sum, log) => sum + parseInt(log.calories), 0);
        const avgTime = totalLogs === 0 ? 0 : Math.round(logs.reduce((sum, log) => sum + parseInt(log.duration), 0) / totalLogs);

        // Update UI with calculated stats
        document.getElementById('stat-total').innerText = totalLogs;
        document.getElementById('stat-calories').innerText = totalCalories;
        document.getElementById('stat-avg-time').innerText = avgTime;

        // 2. Render Data Table
        tbody.innerHTML = ''; // Clear the initial loading/empty text

        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No records found in database.</td></tr>';
            return;
        }

        // Show newest records first
        logs.reverse().forEach(log => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 15px;"><strong>${log.date}</strong></td>
                <td style="padding: 15px;">${log.workoutType} <br><span style="font-size: 0.8rem; color: gray;">${log.intensity}</span></td>
                <td style="padding: 15px;">${log.duration} mins</td>
                <td style="padding: 15px; color: var(--accent); font-weight: bold;">${log.calories} kcal</td>
                <td style="padding: 15px;">
                    <button class="btn-delete" onclick="deleteLog('${log.id}')"><i class="fas fa-trash"></i> Delete</button>
                    <button class="btn-edit" onclick="openEditModal('${log.id}')"><i class="fas fa-edit"></i> Edit</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Admin fetch error", error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: red;">Cannot connect to JSON Server. Ensure "npx json-server --watch db.json" is running.</td></tr>';
    }
}

// Load data automatically when admin page opens
document.addEventListener('DOMContentLoaded', loadAdminData);


// Function to delete a specific log by ID
async function deleteLog(id) {
    // 1. Ask for confirmation before deleting
    if (!confirm("Are you sure you want to permanently delete this record?")) {
        return; // If user clicks Cancel, stop right here
    }

    try {
        // 2. Send DELETE request to JSON Server
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // 3. If successful, reload the data to update table and statistics
            loadAdminData(); 
        } else {
            alert("Failed to delete the record from the server.");
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("Error connecting to server to delete.");
    }
}


// 1. Edit button- Open Modal and Fetch existing data for the selected log
async function openEditModal(id) {
    try {
        // Fetch the specific log data from database
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Log not found");
        const log = await response.json();

        // Fill the popup form with the fetched data
        document.getElementById('edit-id').value = log.id;
        document.getElementById('edit-duration').value = log.duration;
        document.getElementById('edit-calories').value = log.calories;
        document.getElementById('edit-diet').value = log.diet;

        // Show the hidden modal
        document.getElementById('edit-modal').style.display = 'flex';
    } catch (error) {
        alert("Error fetching record details.");
    }
}

// 2. Close Modal when 'X' is clicked
document.getElementById('close-edit-modal').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
});

// 3. Handle Form Submission to Update Data in Database
document.getElementById('edit-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent page reload

    const id = document.getElementById('edit-id').value;
    const btn = document.getElementById('update-btn');
    
    // Prepare the updated data
    const updatedData = {
        duration: parseInt(document.getElementById('edit-duration').value),
        calories: parseInt(document.getElementById('edit-calories').value),
        diet: document.getElementById('edit-diet').value
    };

    btn.innerText = "Updating...";

    try {
        // Send PATCH request to JSON Server
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            // Success: Hide modal, reset button, and refresh data
            document.getElementById('edit-modal').style.display = 'none';
            btn.innerText = "Update Record (PATCH)";
            loadAdminData(); 
        } else {
            throw new Error("Failed to update on server");
        }
    } catch (error) {
        console.error("Update error:", error);
        alert("Error updating record. Ensure JSON Server is running.");
        btn.innerText = "Update Record (PATCH)";
    }
});