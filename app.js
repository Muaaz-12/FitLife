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

// 4. Trainer Modal Logic (Opening and Closing Popups)
function openTrainerModal(name, specialty, exp, skills, style, timing, imgSrc) {
    document.getElementById('tm-name').innerText = name;
    document.getElementById('tm-spec').innerText = specialty;
    document.getElementById('tm-exp').innerText = exp;
    document.getElementById('tm-skills').innerText = skills;
    document.getElementById('tm-style').innerText = style;
    document.getElementById('tm-timing').innerText = timing;
    document.getElementById('tm-img').style.backgroundImage = `url('${imgSrc}')`;
    
    document.getElementById('trainerModal').style.display = 'flex';
}

// Close the modal when the 'X' is clicked
document.getElementById('close-trainer').addEventListener('click', () => {
    document.getElementById('trainerModal').style.display = 'none';
});

// Close the modal if the user clicks outside the modal box
window.addEventListener('click', (e) => {
    const modal = document.getElementById('trainerModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});