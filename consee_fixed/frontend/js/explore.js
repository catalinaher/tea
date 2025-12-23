const artistInput = document.getElementById("artistInput");
const cityInput = document.getElementById("cityInput");
const dateInput = document.getElementById("dateInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");
const status = document.getElementById("status");
const featuredSlides = document.getElementById("featuredSlides");

searchBtn.onclick = search;
[artistInput, cityInput, dateInput].forEach(i =>
  i.addEventListener("keydown", e => e.key === "Enter" && search())
);

loadFeatured();

/* ======================
   SEARCH (via Vercel API)
====================== */

async function search() {
  const artist = artistInput.value.trim();
  if (!artist) return;

  status.textContent = "Loading events...";
  results.innerHTML = "";

  const params = new URLSearchParams({ artist });

  const city = cityInput.value.trim();
  const date = dateInput.value;

  if (city) params.append("city", city);
  if (date) params.append("date", date);

  const res = await fetch(`/api/events/search?${params.toString()}`);
  const data = await res.json();

  const events = data.events || [];

  status.textContent =
    events.length > 0
      ? `${events.length} events found`
      : "No events match your search.";

  events.forEach(e => {
    const card = document.createElement("div");
    card.className = "reviewCard";
    card.innerHTML = `
      <h3>${e.artist}</h3>
      <div class="meta">${e.venue} · ${e.city}</div>
      <div class="text">${e.date}</div>
      <a href="${e.url}" target="_blank" class="badge">View</a>
    `;
    results.appendChild(card);
  });
}

/* ======================
   FEATURED ARTISTS
   (via Vercel API)
====================== */

async function loadFeatured() {
  const artists = [
    "Taylor Swift",
    "Drake",
    "SZA",
    "Bad Bunny",
    "Olivia Rodrigo"
  ];

  for (const name of artists) {
    const res = await fetch(`/api/events/search?artist=${encodeURIComponent(name)}`);
    const data = await res.json();
    const events = data.events || [];

    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    slide.innerHTML = `
      <div class="slideCard"
        style="background-image:url('${events[0]?.image || ""}');
               background-size:cover;
               background-position:center;">
        <div class="slideTitle">${name}</div>
        <div class="slideMeta">${events.length} upcoming</div>
      </div>
    `;

    slide.onclick = () => {
      artistInput.value = name;
      search();
      window.scrollTo({ top: 300, behavior: "smooth" });
    };

    featuredSlides.appendChild(slide);
  }

  new Swiper("#featuredSwiper", {
    slidesPerView: 1.2,
    spaceBetween: 14,
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
      700: { slidesPerView: 2.5 },
      1000: { slidesPerView: 3.5 }
    }
  });
}
