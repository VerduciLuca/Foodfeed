class RedditService {
    constructor() {
        this.subredditData = {
            recipes: ['r/Recipes','r/Cooking','r/AskCulinary','r/EatCheapAndHealthy',],
            foodporn: ['r/Foodporn', 'r/Dessertporn', 'r/Food'],
            vegan: ['r/Vegan', 'r/PlantBasedDiet', 'r/VeganRecipes'],
            gourmet: ['r/Gourmet', 'r/FineDining'],
            regional: ['r/ItalianFood','r/MexicanFood','r/JapaneseFood','r/IndianFood','r/FrenchCooking',],
            beginner: ['r/cookingforbeginners', 'r/budgetfood', 'r/cookingvideos'],
            professional: ['r/Chefit','r/ArtOfCooking','r/AskChefs','r/kitchenConfidential',]
        };
    }

    async getPosts(selectedInterests) {
        const fetchPromises = [];
        for (const interest of selectedInterests) {
            const subreddits = this.subredditData[interest];
            for (const subreddit of subreddits) {
                fetchPromises.push(fetch(`https://www.reddit.com/${subreddit}.json`));
            }
        }

        const responses = await Promise.all(fetchPromises);
        const jsonPromises = responses.map((response) => response.json());

        const postDataArrays = await Promise.all(jsonPromises);

        return postDataArrays.flatMap((postData) => postData.data.children);
    }
}


