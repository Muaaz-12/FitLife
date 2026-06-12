// --- Step 5: UI Interactions & Basic Logic ---

// 1. Sticky Navbar (Scroll effect)
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// 2. Dark/Light Theme Toggle (Saving to localStorage for Bonus Marks)
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggleBtn.querySelector('i');

// Check if user already preferred dark mode in a previous visit
if(localStorage.getItem('theme') === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fas fa-sun';
}

themeToggleBtn.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
});

// 3. Health Calculators Logic (BMI & Maintenance Calories)
function calculateHealth() {
    const weight = parseFloat(document.getElementById('calc-weight').value);
    const heightCm = parseFloat(document.getElementById('calc-height').value);
    const age = parseInt(document.getElementById('calc-age').value);

    // Simple validation
    if (!weight || !heightCm || !age || weight <= 0 || heightCm <= 0 || age <= 0) {
        alert("Please enter valid positive values.");
        return;
    }

    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    
    // Basal Metabolic Rate (BMR) simple formula
    const bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
    const maintenanceCalories = Math.round(bmr * 1.2); 

    let bmiMessage = "";
    if (bmi < 18.5) bmiMessage = "Status: Underweight. Goal: Calorie Surplus.";
    else if (bmi >= 18.5 && bmi < 24.9) bmiMessage = "Status: Normal Weight. Goal: Maintenance.";
    else if (bmi >= 25 && bmi < 29.9) bmiMessage = "Status: Overweight. Goal: Calorie Deficit.";
    else bmiMessage = "Status: Obese. Goal: Consult a Professional.";

    // Show results
    document.getElementById('res-bmi').innerText = `BMI: ${bmi}`;
    document.getElementById('res-bmi-msg').innerText = bmiMessage;
    document.getElementById('res-cal').innerText = `${maintenanceCalories} kcal/day`;
    document.getElementById('calc-results').classList.remove('hidden');
}

// 4. Trainer Modal & Booking Flow Logic
function openTrainerModal(name, specialty, exp, skills, style, timing, imgSrc) {
    // Fill Trainer Details
    document.getElementById('tm-name').innerText = name;
    document.getElementById('tm-spec').innerText = specialty;
    document.getElementById('tm-exp').innerText = exp;
    document.getElementById('tm-skills').innerText = skills;
    document.getElementById('tm-style').innerText = style;
    document.getElementById('tm-timing').innerText = timing;
    document.getElementById('tm-img').style.backgroundImage = `url('${imgSrc}')`;
    
    // Set Trainer name dynamically in the booking form
    document.getElementById('booking-trainer-name').innerText = name;
    
    // Always show details first, hide booking form when opening
    document.getElementById('trainer-details-section').classList.remove('hidden');
    document.getElementById('trainer-booking-section').classList.add('hidden');
    
    document.getElementById('trainerModal').style.display = 'flex';
}

// Close Modal Logic
function closeTrainerModal() {
    document.getElementById('trainerModal').style.display = 'none';
    document.getElementById('booking-form').reset(); 
}

document.getElementById('close-trainer').addEventListener('click', closeTrainerModal);
window.addEventListener('click', (e) => {
    const modal = document.getElementById('trainerModal');
    if (e.target === modal) closeTrainerModal();
});

// Show Booking Form when "Book Session" is clicked
document.getElementById('btn-show-booking').addEventListener('click', () => {
    document.getElementById('trainer-details-section').classList.add('hidden');
    document.getElementById('trainer-booking-section').classList.remove('hidden');
});

// Go back to details if "Cancel" is clicked
document.getElementById('btn-cancel-booking').addEventListener('click', () => {
    document.getElementById('trainer-booking-section').classList.add('hidden');
    document.getElementById('trainer-details-section').classList.remove('hidden');
});

// Handle Booking Form Submission

document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault(); // پیج ریلوڈ ہونے سے روکے گا
    
    const trainerName = document.getElementById('booking-trainer-name').innerText;
    const userEmail = document.getElementById('bk-email').value; // ای میل کی ویلیو اٹھائی
    
    // پریمیم الرٹ میسج
    alert(`🎉 Booking Successful!\n\nYour session request with ${trainerName} has been submitted. A confirmation backup has been sent to ${userEmail}.\n\nOur team will contact you on your phone shortly!`);
    
    closeTrainerModal(); // ماڈل بند کر دیں
});

// --- Step 6: API Integration (JSON Server - GET & POST) ---

const API_URL = 'http://localhost:3000/logs';

// 1. Fetch and Display Logs (GET)
async function fetchAndRenderLogs() {
    const logContainer = document.getElementById('log-container');
    const filterValue = document.getElementById('filter-type').value;

    logContainer.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Fetching data from database...</p>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        let logs = await response.json();

        // Filter Logic (Requirement)
        if (filterValue !== "All") {
            logs = logs.filter(log => log.workoutType === filterValue);
        }

        if (logs.length === 0) {
            logContainer.innerHTML = '<p>No logs found. Start working out!</p>';
            return;
        }

        logContainer.innerHTML = ''; // Clear loading text

        // Reverse to show newest logs at the top
        logs.reverse().forEach(log => {
            const card = document.createElement('div');
            card.className = 'log-item'; // Using the new specific class
            card.style.animation = 'fadeIn 0.5s ease forwards';
            card.innerHTML = `
                <div class="log-date">${log.date}</div>
                <p><strong>Workout:</strong> ${log.workoutType} (${log.intensity}) - ${log.duration} mins</p>
                <p><strong>Burned:</strong> <span class="accent-text" style="font-weight: bold;">${log.calories} kcal</span></p>
                <p><strong>Diet:</strong> ${log.diet}</p>
            `;
            logContainer.appendChild(card);
        });

    } catch (error) {
        logContainer.innerHTML = '<p class="error-msg">Error fetching data. Ensure JSON Server is running in the terminal.</p>';
    }
}

// 2. Submit New Log (POST) with Inline Validation
document.getElementById('activity-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Stop page from reloading

    const type = document.getElementById('log-type').value;
    const duration = document.getElementById('log-duration').value;
    const calories = document.getElementById('log-calories').value;
    const intensity = document.getElementById('log-intensity').value;
    const diet = document.getElementById('log-diet').value;

    // Inline Validation
    let isValid = true;
    document.querySelectorAll('.field-error').forEach(el => el.innerText = '');
    document.getElementById('form-error').classList.add('hidden');

    if (!type) { document.getElementById('err-type').innerText = "* Required"; isValid = false; }
    if (!duration || duration <= 0) { document.getElementById('err-duration').innerText = "* Valid time needed"; isValid = false; }
    if (!calories || calories <= 0) { document.getElementById('err-calories').innerText = "* Valid kcal needed"; isValid = false; }
    if (!intensity) { document.getElementById('err-intensity').innerText = "* Required"; isValid = false; }
    if (!diet.trim()) { document.getElementById('err-diet').innerText = "* Required"; isValid = false; }

    if (!isValid) {
        document.getElementById('form-error').classList.remove('hidden');
        return;
    }

    // Prepare data to send
    const newLog = {
        id: Date.now().toString(),
        workoutType: type,
        duration: parseInt(duration),
        calories: parseInt(calories),
        intensity: intensity,
        diet: diet,
        date: new Date().toISOString().split('T')[0]
    };

    try {
        const btn = document.getElementById('submit-btn');
        const originalText = btn.innerText;
        btn.innerText = "Saving...";

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLog)
        });

        if (!response.ok) throw new Error("Failed to save data");

        // Success: Reset form and refresh logs
        document.getElementById('activity-form').reset();
        fetchAndRenderLogs();
        // Updated text to match new HTML
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Save Daily Record'; 
        
  } catch (error) {
        document.getElementById('form-error').innerText = "Failed to save log to server. Is JSON Server running?";
        document.getElementById('form-error').classList.remove('hidden');
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Save Daily Record'; 
    }
}); 
fetchAndRenderLogs();