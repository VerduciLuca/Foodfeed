document.addEventListener('DOMContentLoaded', function () {
    const interestsForm = document.getElementById('interests-form');
    const submitButton = document.getElementById('submit-button');
    const feedContainer = document.getElementById('feed-container');
    const redditService = new RedditService();
    const favourites = []

    const menuBtns = document.getElementById('menu-btns')
    const menuButton = document.querySelector('.menu');
    const dropdown = document.querySelector('.dropdown');

    menuButton.addEventListener('click', function () {
        dropdown.classList.toggle('active');
    });


    const savedInterests = localStorage.getItem('selectedInterests');
    if (savedInterests) {
        interestsForm.style.display = 'none';
        loadFeed();
    }

    submitButton.addEventListener('click', async function () {
        const selectedInterests = Array.from(
            interestsForm.querySelectorAll('input[name="interest"]:checked')
        ).map((checkbox) => checkbox.value);
    
        if (selectedInterests.length === 0) {
            alert('Choose at least one option');
            return false;
        } else {
            interestsForm.style.display = 'none';
            localStorage.setItem('selectedInterests', JSON.stringify(selectedInterests));
            loadFeed();
        }
    });
    

    async function loadFeed() {
        try {
            const savedInterests = JSON.parse(localStorage.getItem('selectedInterests'));
            const shuffledPosts = shuffleArray(await redditService.getPosts(savedInterests));
            createFeed(shuffledPosts, feedContainer);
        } catch (error) {
            console.error('Errore:', error);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    function addFavourite(post,favBtn){
        if (!favourites.includes(post)) {
            favourites.push(post)
            console.log(favourites);
            favBtn.textContent = favStar(post);
        }
        else {favourites.splice(post,1)
            favBtn.textContent = favStar(post);}
        
    }

    function favStar(post) {
        if (!favourites.includes(post)) {
            return '☆'
        }
        else return '★'
    }

    async function createFeed(posts, container) {
        menuBtns.classList.remove('invisible')
        const feedList = document.createElement('ul');

        for (const post of posts) {
            console.log(post.data);
            const postItem = document.createElement('li');
            postItem.classList.add('post-item');
            const title = document.createElement('h3');
            title.textContent = post.data.title;

            const divisor = document.createElement('hr')

            const author = document.createElement('p');
            author.textContent = 'Autore: ' + post.data.author;

            const subreddit = document.createElement('p');
            subreddit.textContent = 'Subreddit: ' + post.data.subreddit;

            const thumbnail = document.createElement('img');
            thumbnail.src = post.data.thumbnail;

            const fav = document.createElement('button')
            fav.classList.add('favBtn')
            fav.textContent = favStar();
            fav.addEventListener('click', function() {
                addFavourite(post.data, fav);
            });
            


            postItem.appendChild(title);
            postItem.appendChild(divisor);
            postItem.appendChild(author);
            postItem.appendChild(subreddit);
            postItem.appendChild(thumbnail);
            postItem.appendChild(fav);

            feedList.appendChild(postItem);
        }

        container.innerHTML = '';
        container.appendChild(feedList);
        container.classList.remove('hidden');
        
    }
});
