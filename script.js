
const events = [
    {
        id: 1,
        name: "Coding Competition",
        category: "Technical",
        date: "15 November 2026",
        venue: "Computer Lab",
        description: "Show your programming skills and compete with other students."
    },
    {
        id: 2,
        name: "Annual Cultural Fest",
        category: "Cultural",
        date: "18 November 2026",
        venue: "College Auditorium",
        description: "Enjoy music, dance, drama and cultural performances."
    },
    {
        id: 3,
        name: "Football Tournament",
        category: "Sports",
        date: "20 November 2026",
        venue: "College Sports Ground",
        description: "Participate in an exciting inter-college football tournament."
    },
    {
        id: 4,
        name: "AI Technology Workshop",
        category: "Technical",
        date: "22 November 2026",
        venue: "Seminar Hall",
        description: "Learn about Artificial Intelligence and emerging technologies."
    },
    {
        id: 5,
        name: "Talent Show",
        category: "Cultural",
        date: "24 November 2026",
        venue: "College Auditorium",
        description: "Showcase your talents through singing, dancing and acting."
    },
    {
        id: 6,
        name: "Badminton Championship",
        category: "Sports",
        date: "26 November 2026",
        venue: "Indoor Sports Hall",
        description: "Participate in the college badminton championship."
    }
];

const eventList = document.getElementById("eventList");
const eventSelect = document.getElementById("eventSelect");
const form = document.getElementById("registrationForm");
const message = document.getElementById("message");
const registrationList = document.getElementById("registrationList");

// Load saved registrations
let registrations =
    JSON.parse(localStorage.getItem("eventRegistrations")) || [];

// Display event cards
function displayEvents(category = "All") {

    eventList.replaceChildren();

    const filteredEvents = events.filter(function(event) {
        return category === "All" || event.category === category;
    });

    filteredEvents.forEach(function(event) {

        const card = document.createElement("div");
        card.className = "event-card";

        const title = document.createElement("h3");
        title.textContent = event.name;

        const categoryTag = document.createElement("span");
        categoryTag.className = "category";
        categoryTag.textContent = event.category;

        const date = document.createElement("p");
        date.textContent = "Date: " + event.date;

        const venue = document.createElement("p");
        venue.textContent = "Venue: " + event.venue;

        const description = document.createElement("p");
        description.textContent = event.description;

        const button = document.createElement("button");
        button.textContent = "Register for Event";

        button.addEventListener("click", function() {
            eventSelect.value = String(event.id);
            document.getElementById("registration").scrollIntoView({
                behavior: "smooth"
            });
        });

        card.append(
            title,
            categoryTag,
            date,
            venue,
            description,
            button
        );

        eventList.appendChild(card);
    });
}

// Populate event dropdown
function populateEventSelect() {

    events.forEach(function(event) {

        const option = document.createElement("option");

        option.value = String(event.id);
        option.textContent = event.name;

        eventSelect.appendChild(option);
    });
}

// Register for an event
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const eventId = Number(eventSelect.value);

    if (name.length < 2) {
        showMessage("Please enter a valid name.", "red");
        return;
    }

    const selectedEvent = events.find(function(event) {
        return event.id === eventId;
    });

    if (!selectedEvent) {
        showMessage("Please select an event.", "red");
        return;
    }

    // Prevent duplicate registration
    const alreadyRegistered = registrations.some(function(registration) {
        return registration.email.toLowerCase() === email.toLowerCase()
            && registration.eventId === eventId;
    });

    if (alreadyRegistered) {
        showMessage("You have already registered for this event.", "red");
        return;
    }

    const registration = {
        name: name,
        email: email,
        eventId: eventId,
        eventName: selectedEvent.name,
        date: selectedEvent.date,
        venue: selectedEvent.venue
    };

    registrations.push(registration);

    saveRegistrations();
    displayRegistrations();

    showMessage("Registration successful!", "green");

    form.reset();
});

// Display registrations
function displayRegistrations() {

    registrationList.replaceChildren();

    if (registrations.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No event registrations yet.";
        registrationList.appendChild(empty);
        return;
    }

    registrations.forEach(function(registration, index) {

        const card = document.createElement("div");
        card.className = "registration-card";

        const name = document.createElement("h3");
        name.textContent = registration.eventName;

        const student = document.createElement("p");
        student.textContent = "Student: " + registration.name;

        const email = document.createElement("p");
        email.textContent = "Email: " + registration.email;

        const date = document.createElement("p");
        date.textContent = "Date: " + registration.date;

        const venue = document.createElement("p");
        venue.textContent = "Venue: " + registration.venue;

        const button = document.createElement("button");
        button.className = "cancel-btn";
        button.textContent = "Cancel Registration";

        button.addEventListener("click", function() {
            cancelRegistration(index);
        });

        card.append(name, student, email, date, venue, button);

        registrationList.appendChild(card);
    });
}

// Cancel registration
function cancelRegistration(index) {

    registrations.splice(index, 1);

    saveRegistrations();
    displayRegistrations();

    showMessage("Registration cancelled.", "green");
}

// Save registrations in browser
function saveRegistrations() {
    localStorage.setItem(
        "eventRegistrations",
        JSON.stringify(registrations)
    );
}

// Show message
function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}

// Filter events
document.querySelectorAll(".filter-btn").forEach(function(button) {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter-btn").forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayEvents(button.dataset.category);
    });
});

// Initialize project
populateEventSelect();
displayEvents();
displayRegistrations();
