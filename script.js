const API_KEY = "41fd13ba905941f4a2a62f8b3e31a963";
const url = "https://newsapi.org/v2/everything?q=";

// Load news on page load
window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        // Fetch news from the API
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await res.json();

        // Handle API errors or invalid responses
        if (data.status !== "ok" || !data.articles) {
            console.error("Error fetching news:", data.message || "Unknown error");
            showErrorMessage(data.message || "Failed to fetch news articles.");
            return;
        }

        // Bind articles to UI
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        showErrorMessage("An error occurred while fetching news. Please try again.");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear existing content
    cardsContainer.innerHTML = "";

    if (!articles || articles.length === 0) {
        showErrorMessage("No news articles found.");
        return;
    }

    // Populate articles into cards
    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // Populate card fields
    newsImg.src = article.urlToImage || "default-image.jpg";
    newsTitle.innerHTML = article.title || "No title available";
    newsDesc.innerHTML = article.description || "No description available";

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });
    newsSource.innerHTML = `${article.source.name || "Unknown Source"} · ${date}`;

    // Add event listener for opening the news URL
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function showErrorMessage(message) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

// Handle navigation clicks
let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Handle search
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) {
        showErrorMessage("Please enter a search term.");
        return;
    }
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
