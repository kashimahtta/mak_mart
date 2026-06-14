const girlBtn = document.getElementById("girlBtn");
const boyBtn = document.getElementById("boyBtn");
const modeSwitch = document.getElementById("modeSwitch");
const cardsEl = document.getElementById("cards");
const searchForm = document.getElementById("searchForm");
const qInput = document.getElementById("q");
const compareA = document.getElementById("compareA");
const compareB = document.getElementById("compareB");
const compareBtn = document.getElementById("compareBtn");
const comparePanel = document.getElementById("comparePanel");

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

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveImageSrc(item) {
  const normalized = normalizeName(item.name);
  const candidates = [];
  if (item.image) candidates.push(item.image);
  candidates.push(`assets/images/${normalized}.png`);
  candidates.push(`images/${normalized}.png`);
  candidates.push(`assets/images/${normalized}.jpg`);
  candidates.push(`images/${normalized}.jpg`);
  candidates.push(
    `https://source.unsplash.com/400x300/?${encodeURIComponent(item.name)}`,
  );

  const img = document.createElement("img");
  img.alt = item.name;
  img.loading = "lazy";
  let index = 0;
  img.onerror = function () {
    index += 1;
    if (index < candidates.length) {
      img.src = candidates[index];
    }
  };
  img.src = candidates[index];
  return img;
}

function renderCards(items) {
  cardsEl.innerHTML = "";
  if (!items || items.length === 0) {
    cardsEl.innerHTML = "<p>No items found.</p>";
    return;
  }
  items.forEach((it) => {
    const card = document.createElement("article");
    card.className = "card";

    const thumb = document.createElement("div");
    thumb.className = "thumb";
    thumb.appendChild(resolveImageSrc(it));

    const title = document.createElement("h3");
    title.textContent = it.name;

    const meta = document.createElement("div");
    meta.className = "meta";
    const price = document.createElement("span");
    price.textContent = it.price || "Price N/A";
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = it.available ? "In stock" : "Out of stock";

    meta.appendChild(price);
    meta.appendChild(badge);

    card.appendChild(thumb);
    card.appendChild(title);
    card.appendChild(meta);
    cardsEl.appendChild(card);
  });
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

function getAllItems() {
  return [
    ...DATA.girls.map((item, index) => ({ category: "girls", index, item })),
    ...DATA.boys.map((item, index) => ({ category: "boys", index, item })),
  ];
}

function populateCompareOptions() {
  const items = getAllItems();
  compareA.innerHTML = "";
  compareB.innerHTML = "";
  items.forEach((record) => {
    const label = `${record.item.name} (${record.category})`;
    const value = `${record.category}|${record.index}`;
    const optionA = document.createElement("option");
    optionA.value = value;
    optionA.textContent = label;
    compareA.appendChild(optionA);
    const optionB = document.createElement("option");
    optionB.value = value;
    optionB.textContent = label;
    compareB.appendChild(optionB);
  });
  if (compareA.options.length > 1) {
    compareB.selectedIndex = 1;
  }
}

function renderCompare() {
  const valueA = compareA.value;
  const valueB = compareB.value;
  if (!valueA || !valueB) return;
  const [catA, idxA] = valueA.split("|");
  const [catB, idxB] = valueB.split("|");
  const itemA = DATA[catA][Number(idxA)];
  const itemB = DATA[catB][Number(idxB)];
  comparePanel.innerHTML = "";
  [itemA, itemB].forEach((item) => {
    if (!item) return;
    const card = document.createElement("div");
    card.className = "compare-card";
    const img = resolveImageSrc(item);
    const name = document.createElement("h3");
    name.textContent = item.name;
    const price = document.createElement("div");
    price.textContent = item.price || "Price N/A";
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(price);
    comparePanel.appendChild(card);
  });
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = qInput.value.trim().toLowerCase();
  if (!q) {
    renderCards(DATA[current]);
    return;
  }
  const combined = [...DATA.girls, ...DATA.boys];
  const filtered = combined.filter((item) =>
    item.name.toLowerCase().includes(q),
  );
  renderCards(filtered);
});

girlBtn.addEventListener("click", () => {
  current = "girls";
  setTheme("girls");
  renderCards(DATA.girls);
});
boyBtn.addEventListener("click", () => {
  current = "boys";
  setTheme("boys");
  renderCards(DATA.boys);
});
modeSwitch.addEventListener("change", () => {
  const next = modeSwitch.checked ? "boys" : "girls";
  current = next;
  setTheme(next);
  renderCards(DATA[next]);
});

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
    setTheme(category);
    renderCards(DATA[category]);
    populateCompareOptions();
    renderCompare();
    addForm.reset();
    addAvailable.checked = true;
  });
}

if (compareBtn) {
  compareBtn.addEventListener("click", () => {
    renderCompare();
  });
}

loadSavedData();
setTheme(current);
renderCards(DATA[current]);
populateCompareOptions();
renderCompare();
