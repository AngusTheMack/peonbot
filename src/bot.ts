import Twit, { Twitter } from 'twit';
import moment from 'moment';
import { mapToVideos } from './getTweet';
import { IncomingMessage } from 'http';
const twit = new Twit(require('./config'));

interface MediaResponse {
    media_id: number;
    media_id_string: string;
    media_key: string;
    size: number;
    expires_after_secs: number;
    processing_info: { state: string; check_after_secs: number };
}

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

const getMediaStatus = async (mediaId: string): Promise<MediaResponse> => {
    const params = { command: 'STATUS', media_id: mediaId };
    return twit.get('media/upload', params).then(response => {
        return response.data as MediaResponse;
    });
};

const postMetadata = async (content: string, data: MediaResponse) => {
    let metaParams = {
        media_id: data.media_id_string,
        alt_text: { text: content },
    };
    twit.post('media/metadata/create', metaParams)
        .then(() => console.log('Uploaded metadata'))
        .catch(error => {
            console.log(`ERROR: ${error}`);
        });
};

const pollForSucceededState = async (
    mediaInfo: MediaResponse,
): Promise<MediaResponse> => {
    const endTime = moment().valueOf() + 30 * 1000;
    const checkState = (resolve: Function, reject: Function) => {
        Promise.resolve(getMediaStatus(mediaInfo.media_id_string)).then(
            result => {
                const now = moment().valueOf();
                if (result.processing_info.state === 'succeeded') {
                    resolve(result);
                } else if (now < endTime) {
                    setTimeout(
                        checkState,
                        mediaInfo.processing_info.check_after_secs * 1000,
                        resolve,
                        reject,
                    );
                } else {
                    reject(
                        new Error(
                            `Polling for media ${mediaInfo.media_id_string} reached timeout`,
                        ),
                    );
                }
            },
        );
    };
    return new Promise(checkState);
};

const uploadVideoPromise = (pathToVideo: string): Promise<MediaResponse> => {
    return new Promise((resolve, reject) => {
        twit.postMediaChunked(
            { file_path: pathToVideo },
            (error: Error, data: Object, _: IncomingMessage) => {
                if (error) return reject(error);
                resolve(data as MediaResponse);
            },
        );
    });
};

const uploadVideo = async (content: string, pathToVideo: string) => {
    return await uploadVideoPromise(pathToVideo).then(async mediaInfo => {
        console.log(`Sent upload request for ${mediaInfo.media_id_string}`);
        console.log(`Polling upload status for ${mediaInfo.media_id_string}`);
        await pollForSucceededState(mediaInfo)
            .then(() => {
                console.log(
                    `Upload completed for: ${mediaInfo.media_id_string}`,
                );
            })
            .then(() => postMetadata(content, mediaInfo))
            .catch(error => console.log(`ERROR: ${error}`));
        return mediaInfo;
    });
};

const postTweetwithId = async (
    content: string,
    data: MediaResponse,
): Promise<string> => {
    const params = { status: content, media_ids: [data.media_id_string] };
    console.log(
        `Posting with content: ${params.status} media id:${params.media_ids}`,
    );
    return await twit
        .post('statuses/update', params)
        .then(response => {
            const myData = response.data as Twitter.Status;
            return `https://twitter.com/peonbot/status/${myData.id_str}`;
        })
        .catch((error: Twitter.Errors) => {
            console.log(error);
            return `Failed to post Tweet with media_id ${data.media_id_string}`;
        });
};

export const postTweetWithVideo = async (content: string) => {
    const pathToVideo = mapToVideos.get(content) || '';
    console.log(`Posting ${content} with video ${pathToVideo}`);

    const mediaInfo = await uploadVideo(content, pathToVideo);
    return postTweetwithId(content, mediaInfo);
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
