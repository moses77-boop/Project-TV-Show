//You can edit ALL of the code here
const rootElem = document.getElementById("root");
const searchInput = document.getElementById("search-input");
const matchCount = document.getElementById("match-count");

let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();
  searchInput.addEventListener("input", render);
  render();
}

function stripHTML(html) {
  return (html || "").replace(/<[^>]*>/g, "");
}

function getVisibleEpisodes() {
  const term = searchInput.value.trim().toLowerCase();
  return allEpisodes.filter(
    (episodes) =>
      episodes.name.toLowerCase().includes(term) ||
      stripHTML(episodes.summary).toLowerCase().includes(term),
  );
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
