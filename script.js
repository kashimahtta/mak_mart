const girlBtn = document.getElementById("girlBtn");
const boyBtn = document.getElementById("boyBtn");
const modeSwitch = document.getElementById("modeSwitch");
const cardsEl = document.getElementById("cards");
const searchForm = document.getElementById("searchForm");
const qInput = document.getElementById("q");
const apiKeyInput = document.getElementById("apiKey");
const cxInput = document.getElementById("cx");

const DATA = {
  girls: [
    { name: "Lipstick", price: "₹299", available: true },
    { name: "Top", price: "₹499", available: true },
    { name: "Frock", price: "₹799", available: false },
    { name: "Serum", price: "₹699", available: true },
  ],
  boys: [
    { name: "T-shirt", price: "₹399", available: true },
    { name: "Comb", price: "₹49", available: true },
    { name: "HotWheels", price: "₹199", available: false },
    { name: "Toothbrush", price: "₹129", available: true },
  ],
};

let current = "girls";
const root = document.documentElement;

function setTheme(kind) {
  document.body.classList.remove("theme-girls", "theme-boys");
  document.body.classList.add(kind === "girls" ? "theme-girls" : "theme-boys");
  if (kind === "girls") {
    girlBtn.classList.add("active");
    boyBtn.classList.remove("active");
    modeSwitch.checked = false;
  } else {
    girlBtn.classList.remove("active");
    boyBtn.classList.add("active");
    modeSwitch.checked = true;
  }
  current = kind;
}

function renderCards(items) {
  cardsEl.innerHTML = "";
  if (!items || items.length === 0) {
    cardsEl.innerHTML = "<p>No items found.</p>";
    return;
  }
  items.forEach((it) => {
    const c = document.createElement("article");
    c.className = "card";
    c.innerHTML = `
      <div class="thumb">${it.image ? `<img src="${it.image}" alt="${it.name}"/>` : it.name.charAt(0)}</div>
      <h3>${it.name}</h3>
      <div class="meta"><span>${it.price || "Price N/A"}</span><span class="badge">${it.available ? "In stock" : "Out of stock"}</span></div>
    `;
    cardsEl.appendChild(c);
  });
}

function showCurrent() {
  setTheme(current);
  renderCards(DATA[current]);
}

girlBtn.addEventListener("click", () => {
  current = "girls";
  showCurrent();
});
boyBtn.addEventListener("click", () => {
  current = "boys";
  showCurrent();
});
modeSwitch.addEventListener("change", () => {
  current = modeSwitch.checked ? "boys" : "girls";
  showCurrent();
});

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = qInput.value.trim();
  if (!q) {
    showCurrent();
    return;
  }

  const key = apiKeyInput.value.trim();
  const cx = cxInput.value.trim();
  if (key && cx) {
    // Use Google Custom Search JSON API if configured. Requires billing/API setup.
    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(key)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const data = await res.json();
      const items = (data.items || [])
        .slice(0, 8)
        .map((it) => ({
          name: it.title,
          price: "Price N/A",
          available: true,
          image:
            it.pagemap && it.pagemap.cse_thumbnail
              ? it.pagemap.cse_thumbnail[0].src
              : null,
        }));
      renderCards(items);
      return;
    } catch (err) {
      console.error("Google fetch failed", err);
    }
  }

  // Fallback: filter local data
  const combined = [...DATA.girls, ...DATA.boys];
  const filtered = combined.filter((i) =>
    i.name.toLowerCase().includes(q.toLowerCase()),
  );
  renderCards(filtered);
});

// initial render
showCurrent();
