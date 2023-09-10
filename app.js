document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submit-button");
    const interestsForm = document.getElementById("interests-form");
    const feedContainer = document.getElementById("feed-container");
    const redditService = new RedditService();

    const savedInterests = localStorage.getItem("selectedInterests");
    if (savedInterests) {
        interestsForm.style.display = "none"; 
        loadFeed();
    }

    submitButton.addEventListener("click", async function () {
        const selectedInterests = Array.from(
            interestsForm.querySelectorAll('input[name="interest"]:checked')
        ).map((checkbox) => checkbox.value);

        interestsForm.style.display = "none";
        localStorage.setItem("selectedInterests", JSON.stringify(selectedInterests));

        loadFeed();
    });

    async function loadFeed() {
        try {
            const savedInterests = JSON.parse(localStorage.getItem("selectedInterests"));
            const shuffledPosts = shuffleArray(await redditService.getPostsForInterests(savedInterests));
            createFeed(shuffledPosts, feedContainer);
        } catch (error) {
            console.error("Errore:", error);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async function createFeed(posts, container) {
        const feedList = document.createElement("ul");

        for (const post of posts) {
            console.log(post.data);
            const postItem = document.createElement("li");
            postItem.classList.add("post-item");
            const title = document.createElement("h3");
            title.textContent = post.data.title;

            const author = document.createElement("p");
            author.textContent = `Autore: ${post.data.author}`;

            const subreddit = document.createElement("p");
            subreddit.textContent = `Subreddit: ${post.data.subreddit}`;

            const thumbnail = document.createElement("img");
            thumbnail.src = post.data.thumbnail;

            postItem.appendChild(title);
            postItem.appendChild(author);
            postItem.appendChild(subreddit);
            postItem.appendChild(thumbnail);

            feedList.appendChild(postItem);
        }

        container.innerHTML = "";
        container.appendChild(feedList);
        container.classList.remove("hidden");
    }
});
