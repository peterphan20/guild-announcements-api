# Guild Announcement Page API

## Description

This is the API for the guild announcement page, which allows a user to get all the necessary information concerning the Eldrige guild.

## Technologies

- Fastify
- PostgreSQL

## Installation

Enter your project directory

`cd project-directory`

Clone the repository

`git clone https://github.com/peterphan20/guild-announcements-page-api.git`

Move into the created directory

`cd guild-announcement-api`

Install dependencies

`npm install`

Setup and populate your .env by following .env.example

`touch .env`

## Usage

This API supports basic CRUD operations for handling announcement related changes as well as authentication
for protecting specific routes.

- Specific routes that requires authentication: article's POST, DELETE and EDIT routes
- Comments routes: POST, DELETE, and, EDIT
- Users routes: DELETE

### Get all articles

- Send a GET request to `https://guild-announcements-page.herokuapp.com/articles`

### Get one article

- Send a GET request to `https://guild-announcements-page.herokuapp.com/articles/:id`

### Create an article

- Send a POST request to `https://guild-announcements-page.herokuapp.com/articles`

```
// Example request body
{
  "title": "hello world",
  "content": "lorem ipsum"
  "imageURL": "https://rb.gy/gbrkdr",
  "authorID": "1"
}
```

### Update an article

- Send a PUT request to `https://guild-announcements-page.herokuapp.com/articles/:id`

```
// Example request body
{
  "username": "good morning world",
  "content": "lorem ipsum"
  "imageURL": "https://rb.gy/gbrkdr",
  "authorID": "1"
}
```

### Delete an article

- Send a DELETE request to `https://guild-announcements-page.herokuapp.com/articles/:id`

## Authentication

Authentication is available at the following routes

- A username must be 6-50 characters long, and can include numbers, uppercase and lowercase letters.
  The username will be lowercased upon storage, and must be unique.
- A password must be 6-200 characters long, and can include uppercase and lowercase letters,
  numbers, and the following special characters: !@#$%^&\*

### Create an Account

- Send a POST request to `https://guild-announcements-page.herokuapp.com/auth/create`

```
// Example request body
{
  "username": "EldridgeRocks",
  "password": "iloveEldridgeGuild"
}
```

### Login a User

- Send a POST request to `https://guild-announcements-page.herokuapp.com/auth/login`

```
// Example request body
{
  "username": "EldridgeRocks",
  "password": "iloveEldridgeGuild"
}
```

## Contributing

This project is not accepting contributions. You are welcome to use as a template.

## License

MIT License
