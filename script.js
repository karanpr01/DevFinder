const themeBtn = document.querySelector(".theme-toggle")
const darkIcon = document.querySelector(".moon")
const lightIcon = document.querySelector(".sun")
const body = document.body
document.addEventListener("DOMContentLoaded", runAnimation);



//* load save theme for localStorage

const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  body.classList.add("dark")
  darkIcon.classList.add("hide")
  lightIcon.classList.remove("hide")
} else {
  body.classList.remove("dark")
  darkIcon.classList.remove("hide")
  lightIcon.classList.add("hide")
  
}


//* Save theme in localStorage

themeBtn.addEventListener("click", function () {
  const darkMode = body.classList.toggle("dark")

  if (darkMode) {
    localStorage.setItem('theme', 'dark')
    darkIcon.classList.add("hide")
    lightIcon.classList.remove("hide")
    runAnimation()
   
  } else {
    localStorage.setItem('theme', 'light')
    darkIcon.classList.remove("hide")
    lightIcon.classList.add("hide")
    runAnimation()
   
  }
})


//* Gsap Animation

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

  tl.from(".animation-3", {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    ease: "back.out(1.7)",
    stagger: 0.2,
  });
}
















const username = "Aestheticsuraj234"
const Api = `https://api.github.com/users/${username}`


function formatDate(isoString, includeTime = false) {
  const date = new Date(isoString);

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (includeTime) {
    options.hour = "numeric";
    options.minute = "2-digit";
    options.hour12 = true;
  }

  return date.toLocaleString("en-GB", options);
}


async function getData() {
  try {
    const data = await fetch(Api)
    const info = await data.json()

    console.log(info);
 console.log("Created at: " + formatDate(info.created_at));
    console.log("Last Updated at: " + formatDate(info.updated_at,true));
    console.log("Bio : " + info.bio);
    console.log("company:" + info.company);
    console.log("Followers: " + info.followers);
    console.log("Following: " +info.following);
    console.log("Avatar: " + info.avatar_url);
    console.log("Twitter username : " + info.twitter_username);
    console.log(`loaction ${info.location}`);
    console.log(`Public Repo ${info.public_repos}`);
    console.log(`Name:${info.name}`);
    console.log(`Link:${info.html_url}`);
  }
  catch (error){
    console.log(error);
  }
  
}

getData()



