// Cleaned script for Mak Mart — removes Google API inputs and fixes structure
const girlBtn = document.getElementById("girlBtn");
const boyBtn = document.getElementById("boyBtn");
const modeSwitch = document.getElementById("modeSwitch");
const cardsEl = document.getElementById("cards");
const searchForm = document.getElementById("searchForm");
const qInput = document.getElementById("q");

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
const STORAGE_KEY = "mak_mart_data_v1";

function loadSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (obj.girls) DATA.girls = obj.girls;
    if (obj.boys) DATA.boys = obj.boys;
  } catch (e) {
    console.warn("Failed to load saved data", e);
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
  } catch (e) {
    console.warn("Failed to save", e);
  }
}

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
    // choose image: explicit image URL if provided, otherwise use Unsplash source by query
    const imgSrc = it.image
      ? it.image
      : `https://source.unsplash.com/400x300/?${encodeURIComponent(it.name)}`;
    c.innerHTML = `
      <div class="thumb"><img src="${imgSrc}" alt="${it.name}" loading="lazy"/></div>
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

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = qInput.value.trim();
  if (!q) {
    showCurrent();
    return;
  }
  const combined = [...DATA.girls, ...DATA.boys];
  const filtered = combined.filter((i) =>
    i.name.toLowerCase().includes(q.toLowerCase()),
  );
  renderCards(filtered);
});

// Add-item form handling
const addForm = document.getElementById("addForm");
const addName = document.getElementById("addName");
const addPrice = document.getElementById("addPrice");
const addCategory = document.getElementById("addCategory");
const addAvailable = document.getElementById("addAvailable");
const addImage = document.getElementById("addImage");

if (addForm) {
  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = addName.value.trim();
    if (!name) return;
    const price = addPrice.value.trim() || "Price N/A";
    const available = !!addAvailable.checked;
    const image =
      addImage && addImage.value.trim() ? addImage.value.trim() : null;
    const category = addCategory.value === "boys" ? "boys" : "girls";
    const item = { name, price, available, image };
    DATA[category].push(item);
    saveData();
    current = category;
    showCurrent();
    addForm.reset();
    addAvailable.checked = true;
  });
}

// load saved items then render
loadSavedData();
showCurrent();
