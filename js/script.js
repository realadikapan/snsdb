// Firebase setup and Firestore initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc4J-dxWxGd7faBk6vBjY-YykxcnXiHT0",
  authDomain: "websns-56176.firebaseapp.com",
  projectId: "websns-56176",
  storageBucket: "websns-56176.appspot.com",
  messagingSenderId: "378355817321",
  appId: "1:378355817321:web:bde2639311a53cbae23bf8",
  measurementId: "G-NRR0HD4JVB"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetching news from Firebase Firestore and displaying it
async function fetchNews() {
  const newsContainer = document.getElementById("news-container");
  const newsCollection = collection(db, "news");
  const newsSnapshot = await getDocs(newsCollection);

  newsContainer.innerHTML = ""; // Clear any existing content

  newsSnapshot.forEach((doc) => {
    const newsData = doc.data();
    const newsElement = document.createElement("div");
    newsElement.classList.add("news-item");
    newsElement.innerHTML = `
      <h3>${newsData.title}</h3>
      <p>${newsData.description.substring(0, 100)}...</p>
    `;
    newsElement.onclick = () => openNewsModal(doc.id);
    newsContainer.appendChild(newsElement);
  });
}

// Open the news modal
function openNewsModal(newsId) {
  const modal = document.getElementById("newsModal");
  const modalDetails = document.getElementById("modal-details");

  getDocs(collection(db, "news")).then((snapshot) => {
    snapshot.forEach((doc) => {
      if (doc.id === newsId) {
        const data = doc.data();
        modalDetails.innerHTML = `
          <h3>${data.title}</h3>
          <p>${data.description}</p>
          <p>${new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
        `;
        modal.style.display = "block";
      }
    });
  });
}

// Close the news modal
function closeNewsModal() {
  const modal = document.getElementById("newsModal");
  modal.style.display = "none";
}

// Close modal if clicked outside
window.onclick = function (event) {
  const modal = document.getElementById("newsModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Fetching and displaying the schedule
async function fetchSchedule(classNumber) {
  const scheduleDetails = document.getElementById("schedule-details");
  const classDocRef = doc(db, "schedule", classNumber);
  const classDocSnap = await getDoc(classDocRef);

  if (classDocSnap.exists()) {
    const scheduleData = classDocSnap.data();
    let scheduleHTML = `<h3>Расписание для ${classNumber} класса</h3><table><tr><th>День</th><th>Предмет</th><th>Время</th></tr>`;
    
    scheduleData.lessons.forEach((lesson) => {
      scheduleHTML += `
        <tr><td>${lesson.day}</td><td>${lesson.subject}</td><td>${lesson.time}</td></tr>
      `;
    });

    scheduleHTML += "</table>";
    scheduleDetails.innerHTML = scheduleHTML;
  } else {
    scheduleDetails.innerHTML = "<p>Расписание не найдено</p>";
  }
}

// Show the schedule for the selected class
function showSchedule() {
  const selectedClass = document.getElementById("class-select").value;
  fetchSchedule(selectedClass);
}

// Initialize and fetch news and schedule when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  fetchNews(); // Load news when page loads
  document.getElementById("class-select").value = "1"; // Default class is 1
  showSchedule(); // Show schedule for class 1 by default
});
