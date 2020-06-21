import Twit, { Twitter } from 'twit';
import moment from 'moment';
const twit = new Twit(require('./config'));

const getResultArray = (result: Record<string, any>): Twitter.Status[] => {
    const tweetArray: Twitter.Status[] = [];
    if (Array.isArray(result)) {
        result.forEach(tweet => {
            tweetArray.push(tweet as Twitter.Status);
        });
    }
    return tweetArray;
};

export const getTimeSinceLastPost = (tweetTime: string): string => {
    const now = moment();
    const createdAt = moment(tweetTime, 'ddd MMM DD HH:mm:ss ZZ YYYY');
    const diff = now.diff(createdAt);
    const minutes = now.diff(createdAt, 'minutes');
    const duration = moment.duration(diff);
    if (minutes >= 60) {
        return `${duration.humanize()} ago`;
    } else {
        return `${duration.minutes()} minutes ago`;
    }
};

export const postTweet = async (content: string): Promise<string> => {
    console.log(`Posting: ${content}`);
    return await twit
        .post('statuses/update', { status: content })
        .then(response => {
            const myData = response.data as Twitter.Status;
            return `https://twitter.com/peonbot/status/${myData.id_str}`;
        });
};

export const getLastTweets = async (howMany: number): Promise<string[]> => {
    return await twit
        .get('statuses/user_timeline', { count: howMany })
        .then(response => {
            const tweets = getResultArray(response.data);
            return tweets.map(tweet => {
                const myTweet = tweet as Twitter.Status;
                const diff = getTimeSinceLastPost(myTweet.created_at);
                console.log(`Last tweet found: ${myTweet.text} from ${diff}`);
                return myTweet.text || '';
            });
        });
};
