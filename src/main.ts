import { postTweet, getLastTweets } from './bot';
import { morningTweet, eveningTweet, getRandomTweet } from './getTweet';
if (process.argv[2] === 'am') {
    postTweet(morningTweet);
} else if (process.argv[2] === 'pm') {
    postTweet(eveningTweet);
} else {
    getLastTweets(5).then(tweets => {
        const newTweet = getRandomTweet(tweets);
        postTweet(newTweet);
    });
}
