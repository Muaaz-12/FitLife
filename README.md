
---

## Hello and Welcome!
Welcome to **FitLife Premium**, my individual capstone project for the Web Technologies course. 

I built this web application from scratch to help fitness enthusiasts track their daily workouts, calculate health metrics, and book sessions with expert trainers. 

##  What's Inside? 

I have divided the application into two distinct parts: a polished User Panel for the clients, and a secure Admin Dashboard for managing the data.

###  The User Panel (`index.html`)
* **Daily Activity Logger:** A comprehensive form where users can log their workout details. It includes 5 input fields: Workout Type, Duration, Calories Burned, Intensity, and a Diet summary.
* **Instant Inline Validation:** I skipped the annoying default browser alerts. Instead, if a user misses a field, smooth red text appears right under the input field to guide them.
* **Live DOM Updates:** When a new workout is logged (via `POST` request), the list updates instantly on the screen without needing to refresh the page.
* **Smart Filtering:** Users can sort their workout history by category (e.g., HIIT, Weight Lifting, Yoga).
* **Interactive Trainer Booking:** Users can browse trainer profiles and open a modal to book a session. The booking form collects their details, fitness goals, and preferred time slots, finishing with a nice success alert.

### 🛡️ The Admin Panel (`admin.html`)
* **Dashboard Look:** The admin panel has its own distinct styling, complete with an "Admin" badge and a cleaner, data-focused layout so you always know you are in the restricted zone.
* **Live Summary Statistics:** At the top of the dashboard, the app calculates and displays three real-time stats directly from the database: *Total Records, Total Calories Burned, and Average Workout Time*.
* **Full CRUD Control:** Admins can view all user logs in a neat table. They can easily **Edit** a record (using `PATCH`) via a pop-up modal, or **Delete** a record permanently (complete with a safety confirmation prompt).

###  Bonus Feature Included 
* **Persistent Dark Mode:** I built a custom Dark/Light mode toggle for a premium feel. Better yet, it uses `localStorage` to remember your choice, so if you refresh the page or come back later, your theme stays exactly how you left it!

---

##  The Tech Stack
* **HTML5:** Semantic and clean structure (`<nav>`, `<main>`, `<section>`, etc.)
* **CSS3:** Custom styling with CSS Variables, Flexbox, and Grid (No Bootstrap used).
* **JavaScript (ES6+):** Pure Vanilla JS. All API calls use modern `async/await` and `try/catch` blocks instead of `.then()` chains.
* **Backend Data:** JSON Server (`db.json`) used as a local mock REST API handling GET, POST, PATCH, and DELETE requests.

---

## How to Run This Project Locally

To run this project on your machine, you just need Node.js installed to run the backend server. Follow these simple steps:

**Step 1: Start the Backend Database**
1. open file explorer
2. locate project folder
3. type CMD at file address section 
4. Run this command to start the JSON Server:
   ```bash
   npx json-server --watch db.json

   # Website Screenshots

## Home Page
![Home Page](screenshots/Home%20Page.png)

## Activity Logger
![Activity Loger](screenshots/Activity%20Logger.png)

## Health Calculator
![Health Calculator](screenshots/Health%20Calculator.png)

## Trainer Page
![Trainer Page](screenshots/Trainer%20Page.png)

## Admin Page
![Admin Page](screenshots/Admin%20Page.png)

## Dark Mode 
![Dark Mode](screenshots/Dark%20Mode.png)