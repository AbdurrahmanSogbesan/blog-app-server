# Blog App API Documentation

This API provides endpoints for a blog application that includes user authentication, user status management, and post management. Users can sign up, log in, get and update their status, as well as perform various operations on blog posts such as retrieving all posts, creating a new post, deleting a post, updating a post, and retrieving a single post. Each post consists of a title, content, and an optional image.

## Prerequisites

- Node.js and npm installed on your system
- MongoDB database connection

## Getting Started

1. Clone the repository:

```shell
git clone <repository-url>
cd <repository-directory>
```

2. Install the dependencies:

```shell
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and provide the following environment variables:

```
MONGO_USER=<your-mongodb-username>
MONGO_PASSWORD=<your-mongodb-password>
MONGO_DEFAULT_DB=<your-mongodb-default-database>
```

4. Start the server:

```shell
npm start
```

By default, the server will listen on port `8080` unless the `PORT` environment variable is set.

## Endpoints

### Authentication

- `POST /auth/signup` - Register a new user.
- `POST /auth/login` - Log in an existing user.

### User Status

- `GET /feed/status` - Retrieve the user's status.
- `PUT /feed/status` - Update the user's status.

### Blog Posts

- `GET /feed/posts` - Retrieve all blog posts.
- `POST /feed/post` - Create a new blog post.
- `GET /feed/post/:postId` - Retrieve a specific blog post.
- `PUT /feed/post/:postId` - Update a specific blog post.
- `DELETE /feed/post/:postId` - Delete a specific blog post.

### Images

- Static images are served at `/images/<image-filename>`.

## Error Handling

The API implements error handling middleware to handle and return appropriate error responses. Any encountered errors will be logged to the console.

## Cross-Origin Resource Sharing (CORS)

To prevent Cross-Origin Resource Sharing (CORS) issues, the API sets appropriate headers to allow access from any origin (`*`) and supports common HTTP methods (`OPTIONS`, `GET`, `POST`, `PUT`, `PATCH`, `DELETE`). The API also allows the `Content-Type` and `Authorization` headers.

## Database

The API connects to a MongoDB database using the following connection string format:

```
mongodb+srv://<username>:<password>@cluster0.4uhxiz2.mongodb.net/<database>?retryWrites=true&w=majority
```

Ensure that you have provided the correct database credentials in the `.env` file.

## WebSockets (Socket.io)

The API utilizes Socket.io to enable real-time communication through WebSockets. The server establishes a connection with Socket.io when it starts listening. Any client connections will be logged to the console.

## Contributing

Contributions are welcome! If you have any suggestions, improvements, or bug fixes, please feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
