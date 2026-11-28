//You can edit ALL of the code here
const rootElem = document.getElementById("root");
const searchInput = document.getElementById("search-input");
const matchCount = document.getElementById("match-count");
const episodeSelect = document.getElementById("episode-select");
const statusElement = document.getElementById("status");

let allEpisodes = [];

function populateEpisodeSelect() {
  episodeSelect.replaceChildren(new Option("All episodes", "all"));
  allEpisodes.forEach((episodes) => {
    const label = `${formatEpisodeCode(episodes.season, episodes.number)} - ${episodes.name}`;
    episodeSelect.append(new Option(label, String(episodes.id)));
  });
}

function showStatus(message) {
  statusElement.textContent = message;
}

async function setup() {
  searchInput.addEventListener("input", () => {
    episodeSelect.value = "all";
    render();
  });
  episodeSelect.addEventListener("change", () => {
    searchInput.value = "";
    render();
  });

  showStatus("Loading episodes, please wait...");
  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    allEpisodes = await response.json();
    showStatus("");
    populateEpisodeSelect();
    render();
  } catch (error) {
    showStatus(
      "Sorry, the episode could not be loaded. Please try again later.",
    );
  }
}

function stripHTML(html) {
  return (html || "").replace(/<[^>]*>/g, "");
}

function getVisibleEpisodes() {
  const term = searchInput.value.trim().toLowerCase();
  const selected = episodeSelect.value;
  return allEpisodes.filter((episodes) => {
    if (selected !== "all") return String(episodes.id) === selected;
    return (
      episodes.name.toLowerCase().includes(term) ||
      stripHTML(episodes.summary).toLowerCase().includes(term)
    );
  });
}

function render() {
  const visible = getVisibleEpisodes();
  rootElem.replaceChildren(...visible.map(createEpisodeCard));
  matchCount.textContent = `Displaying ${visible.length}/${allEpisodes.length} episodes`;
}

function formatEpisodeCode(season, number) {
  const pad = (n) => String(n ?? 0).padStart(2, "0");
  return `S${pad(season)}E${pad(number)}`;
}

function createEpisodeCard(episode) {
  const card = document.createElement("article");
  card.className = "episode-card";

  const heading = document.createElement("h2");
  const link = document.createElement("a");
  link.href = episode.url.replace(/^http:/, "https:");
  link.textContent = `${episode.name} - ${formatEpisodeCode(episode.season, episode.number)}`;
  heading.append(link);
  card.append(heading);

  if (episode.image) {
    const img = document.createElement("img");
    img.src = episode.image.medium.replace(/^http:/, "https:");
    img.alt = `Scene from ${episode.name}`;
    card.append(img);
  }

  const summary = document.createElement("div");
  summary.innerHTML = episode.summary || "<p>No summary available.</p>";
  card.append(summary);

  return card;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  const episodeCount = document.createElement("p");
  episodeCount.id = "episode-count";
  episodeCount.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.append(episodeCount);

  const episodeCards = document.createDocumentFragment();
  episodeList.forEach((episode) => {
    episodeCards.append(createEpisodeCard(episode));
  });
  rootElem.append(episodeCards);
}

window.onload = setup;
