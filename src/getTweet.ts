export const morningTweet = 'Ready to work.';
export const eveningTweet = 'Jobs done';

const qoutes = [
    'Yes?',
    'Hmmm?',
    'What you want?',
    'Something need doing?',
    'I can do that.',
    'Be happy to.',
    'Work, work.',
    'Okie dokie.',
    'OK!',
    "Kill 'em!",
    "I'll try...",
    'Why not?!',
    'Whaaat?',
    'Me busy. Leave me alone!!',
    'No time for play.',
    'Me not that kind of orc!',
];

export const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomTweet = (lastTweets: string[]): string => {
    while (true) {
        const possibleTweet =
            qoutes[randomIntFromInterval(0, qoutes.length - 1)];
        if (lastTweets.includes(possibleTweet) === false) {
            return possibleTweet;
        }
    }
};
