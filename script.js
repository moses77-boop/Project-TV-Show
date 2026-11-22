//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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
  link.href = episode.url;
  link.textContent = `${episode.name} - ${formatEpisodeCode(episode.season, episode.number)}`;
  heading.append(link);
  card.append(heading);

  if (episode.image) {
    const img = document.createElement("img");
    img.src = episode.image.medium;
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
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
