# Split-it! [![CircleCI](https://circleci.com/gh/k3ntako/split-it.svg?style=svg)](https://circleci.com/gh/k3ntako/split-it)

An expense splitting CLI program.

## Getting Started

1. Make sure you have Node 12 installed

- You can download it [here](https://nodejs.org/en/).

2. Install dependencies

```
  $ npm i
```

3. Install [PostgreSQL 11](https://www.postgresql.org/download/)

- Mac users: [Postgres.app](https://postgresapp.com/) is significantly easier.
- This program was developed using Postgres 11.

4. Create database

- Make sure Postgres is running its defaults (host: `localhost` and port: `5432`).

```
  $ npm run dbCreate
```

5. Run migrations

```
  $ npm run dbMigrate
```

6. Build the program

- This has to be run every time a change is made

```
  $ npm run tsc
```

7. Start the program

- If you would like to do steps 3 and 4 together, you could run `npm run tsc_start` instead. This will ensure that you have the latest build, however, it will take longer for the program to start.

```
  $ npm start
```

## Testing

Run tests:

```
  $ npm test
```
