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

export const mapToVideos = new Map([
    [qoutes[0], './Resources/yes.mp4'],
    [qoutes[1], './Resources/hmmm.mp4'],
    [qoutes[2], './Resources/whatyouwant.mp4'],
    [qoutes[3], './Resources/somethingneeddoing.mp4'],
    [qoutes[4], './Resources/icandothat.mp4'],
    [qoutes[5], './Resources/behappyto.mp4'],
    [qoutes[6], './Resources/workwork.mp4'],
    [qoutes[7], './Resources/okiedokie.mp4'],
    [qoutes[8], './Resources/okay.mp4'],
    [qoutes[9], './Resources/killem.mp4'],
    [qoutes[10], './Resources/illtry.mp4'],
    [qoutes[11], './Resources/whynot.mp4'],
    [qoutes[12], './Resources/what.mp4'],
    [qoutes[13], './Resources/mebusy.mp4'],
    [qoutes[14], './Resources/notimeforplay.mp4'],
    [qoutes[15], './Resources/menotthatkindoforc.mp4'],
    [morningTweet, './Resources/readytowork.mp4'],
    [eveningTweet, './Resources/jobsdone.mp4'],
]);

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
