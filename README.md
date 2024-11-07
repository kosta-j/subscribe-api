# subscribe-api

Subscription service for the landing pages testing

`npm install -g pnpm`

`pnpm install`

`docker build -t subscription-api .`

`docker run -d -p 3000:3000 --env-file .env subscription-api`
