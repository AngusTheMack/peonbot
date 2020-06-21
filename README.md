# peonbot

[This is a really dumb bot](https://twitter.com/peonbot) that posts qoutes from the [Warcraft III Peon](https://wow.gamepedia.com/Quotes_of_Warcraft_III/Orc_Horde). It is invoked by a lambda function at random times during the day, but it will post `Ready for work` at 9 AM, and `Jobs done` at 5 PM.

## Getting started

1. Install dependencies

```bash
$ yarn
```

2. Add twitter consumer keys and access tokens to `src/config.ts` as follows:

```typescript
module.exports = {
    consumer_key: '...',
    consumer_secret: '...',
    access_token: '...',
    access_token_secret: '...',
};
```

3. Launch the dev mode

```bash
$ yarn dev
```

4. You can start coding! The entry point is located in `src/index.ts`.
