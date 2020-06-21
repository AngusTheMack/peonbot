import { postTweet, getLastTweets } from './bot';
import {
    morningTweet,
    eveningTweet,
    getRandomTweet,
    randomIntFromInterval,
} from './getTweet';
import { APIGatewayEvent } from 'aws-lambda';
import moment from 'moment';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'af-south-1' });
export const handler = async (event: APIGatewayEvent): Promise<string> => {
    const trigger = JSON.stringify(event, null, 2);
    console.log(`Event:  ${trigger}`);
    if (trigger.includes('morning')) {
        return await postTweet(morningTweet).then(link => {
            return link;
        });
    } else if (trigger.includes('evening')) {
        return await postTweet(eveningTweet).then(link => {
            return link;
        });
    } else {
        const now = moment().utcOffset('+0200');
        const newMoment = now.set({
            hours: parseInt(now.format('HH')) + randomIntFromInterval(3, 6),
            minutes: parseInt(now.format('mm')) + randomIntFromInterval(0, 60),
        });
        const cron = `cron(${newMoment.format('mm')} ${newMoment.format(
            'HH',
        )} * * ? *)`;
        const events = new AWS.EventBridge();
        events.putRule(
            { Name: 'random', ScheduleExpression: cron },
            (err: AWS.AWSError, data: AWS.EventBridge.PutRuleResponse) => {
                if (err) {
                    console.log(`ERROR: ${err}`);
                } else {
                    console.log(
                        `Scheduled next tweet to: ${newMoment.format()}`,
                    );
                }
            },
        );
        return await getLastTweets(5).then(async tweets => {
            const newTweet = getRandomTweet(tweets);
            return await postTweet(newTweet).then(link => {
                return link;
            });
        });
    }
};
