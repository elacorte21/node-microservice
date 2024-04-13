# REST with Node, Express and Mongo DB 

## A RESTful API using Node, Express, and MongoDB
API endpoints for creating data, reading data, updating data, and deleting data (CRUD).\
`express` a popular web framework for Node.js.\
`mongoose` an Object Data Modeling (ODM) library for MongoDB and Node.js.\
`nodemon` to restart our server every time we save our file.\
`dotenv` to manage .env file.\
`bcrypt` to hash and compare passwords.\
`jsonwebtoken` to implement JSON Web Tokens.

### Dependencies

```
npm install express mongoose nodemon dotenv bcrypt jsonwebtoken
```

### `.env`
```
DATABASE_URL=
JWT_SECRET=
```

## Available Scripts
Scripts in the project directory:

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### API routes
POST `/users` create a new user\
GET `/users` get all users\
GET `/users/:id` get a single user by ID\
PUT `/users/:id` update an existing user\
DELETE `/users/:id` delete a user by ID\
POST `/users/auth` generate a JWT token