const themeBtn = document.querySelector(".theme-toggle");
const darkIcon = document.querySelector(".moon");
const lightIcon = document.querySelector(".sun");
const body = document.body;
document.addEventListener("DOMContentLoaded", runAnimation);

const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchbtn");
const container = document.querySelector(".container");

//* Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add("dark");
  darkIcon.classList.add("hide");
  lightIcon.classList.remove("hide");
} else {
  body.classList.remove("dark");
  darkIcon.classList.remove("hide");
  lightIcon.classList.add("hide");
}

//* Save theme in localStorage
themeBtn.addEventListener("click", function () {
  const darkMode = body.classList.toggle("dark");

  if (darkMode) {
    localStorage.setItem('theme', 'dark');
    darkIcon.classList.add("hide");
    lightIcon.classList.remove("hide");
  } else {
    localStorage.setItem('theme', 'light');
    darkIcon.classList.remove("hide");
    lightIcon.classList.add("hide");
  }

  runAnimation();
});

//* GSAP Animation
function runAnimation() {
  const tl = gsap.timeline();

  tl.from(".animation", {
    y: -20,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.2,
  });

  tl.from(".animation-2", {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.2,
  });
}

//* Search GitHub Users
searchBtn.addEventListener("click", function () {
  async function getData() {
    try {
      const name = input.value.trim();
      if (!name) {
        showError("Please enter a username to search.");
        return;
      }

      container.innerHTML = "<p>Loading...</p>";

      const apiUrl = `https://api.github.com/search/users?q=${name}`;
      const response = await fetch(apiUrl);
      console.log(response.status,data);
      

      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        // Couldn't parse JSON (possibly due to GitHub rate limit headers only)
        showError(`
    ⛔ GitHub API blocked the request.<br>
    You might have hit the rate limit.<br>
    Try again later or use a personal access token via backend.
  `);
        return;
      }

      // Check for rate limiting message
      if (response.status === 403 && data.message && data.message.toLowerCase().includes("rate limit")) {
        showError(`
    ⛔ API Rate Limit Exceeded<br>
    Try again after an hour or add a GitHub token via secure backend.
  `);
        return;
      }
      // API Rate limit exceeded
      if (response.status === 403 && data.message && data.message.includes("rate limit")) {
        showError(`
          ⛔ API Rate Limit Exceeded<br>
          Try again after an hour or add a GitHub token via secure backend.
        `);
        return;
      }

      const userDetails = data.items;

      if (!userDetails || userDetails.length === 0) {
        showError("No users found. Please try another name.");
        return;
      }

      container.innerHTML = "";

      for (const user of userDetails) {
        const profileRes = await fetch(`https://api.github.com/users/${user.login}`);
        const profileData = await profileRes.json();

        const card = document.createElement("div");
        card.classList.add("user-card", "animation-3");

        card.innerHTML = `
          <div class="user-details">
            <img src="${profileData.avatar_url}" alt="${profileData.login}">
            <div class="user-profile">
              <h2>${profileData.name || "No Name Available"}</h2>
              <p><strong>@${profileData.login}</strong></p>
              <p class="bio">${profileData.bio || "No Bio Available"}</p>
            </div>
          </div>
          <p><i class="ri-map-pin-line"></i> ${profileData.location || "No Location"}</p>
          <p><i class="ri-twitter-fill"></i> ${profileData.twitter_username || "No Twitter"}</p>
          <div class="stats">
            <span>Repos: ${profileData.public_repos}</span><br>
            <span>Followers: ${profileData.followers}</span>
            <span>Following: ${profileData.following}</span>
          </div>
          <button>
            <a href="${profileData.html_url}" target="_blank">View GitHub Profile</a>
          </button>
        `;

        container.appendChild(card);
      }

      // Animate new cards
      gsap.from(".animation-3", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.2,
      });
    } catch (err) {
      console.error("Error:", err);
      showError("🚨 Something went wrong. Please check your internet connection.");
    }
  }

  getData();
});

//* Error Handler
function showError(message) {
  container.innerHTML = `
    <div class="error-box">
      <h2>Error</h2>
      <p>${message}</p>
    </div>
  `;
}



// Check api limit
// fetch("https://api.github.com/rate_limit")
//   .then(res => res.json())
//   .then(data => console.log("Remaining:", data.rate.remaining, "Reset at:", new Date(data.rate.reset * 1000)))
//   .catch(err => console.error(err));
