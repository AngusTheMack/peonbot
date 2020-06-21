# peonbot

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

4. You can start coding! The entry point is located in `src/main.ts`.
