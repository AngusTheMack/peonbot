import Twit, { Twitter } from 'twit';
import { IncomingMessage } from 'http';
import moment from 'moment';
const twit = new Twit(require('./config'));

export const postTweet = (content: string) => {
    console.log(`Posting: ${content}`);
    twit.post('statuses/update', { status: content }, getTweetResponse);
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

const isDataTweet = (data: Object | Twitter.Status): data is Twitter.Status => {
    return (data as Twitter.Status).id_str !== undefined;
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

const getTweetResponse = (
    error: Error,
    data: Object,
    response: IncomingMessage,
) => {
    if (error) {
        console.log(`ERROR: ${error}`);
    } else {
        if (isDataTweet(data)) {
            const myData = data as Twitter.Status;
            const link = `https://twitter.com/peonbot/status/${myData.id_str}`;
            console.log(`Successfully created tweet, available at: ${link}`);
        } else {
            console.log('Could not cast data to tweet');
            console.log(data);
        }
    }
};

const getResultArray = (result: Object): Twitter.Status[] => {
    const tweetArray: Twitter.Status[] = [];
    if (Array.isArray(result)) {
        result.forEach(tweet => {
            tweetArray.push(tweet as Twitter.Status);
        });
    }
    return tweetArray;
};
