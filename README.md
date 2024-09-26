# URL Shortener - Server

This is the backend service for the URL Shortener application. It handles creating short URLs, redirecting users to long URLs, and managing URL storage and expiration in MongoDB.

## Features

- Generate short URLs for long URLs.
- Redirect users to long URLs using short URLs.
- Optionally set expiration dates for URLs.
- API-based backend using Node.js, Express, and MongoDB.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 14+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Docker](https://www.docker.com/) (Optional for containerized setup)

## Getting Started

### 1. Clone the repository

git clone https://github.com/your-username/url-shortener-server.git
cd url-shortener-server

### 2. Install dependencies

npm install

### 3. Set up environment variables

MONGO_URI=mongodb://localhost:27017/urlShortener
TEST_MONGO_URI=mongodb://localhost:27017/urlShortenerTest
BASE_URL=http://localhost:5001
CLIENT_BASE_URL=http://localhost:3000
PORT=5001

### 4. Start the server

npm start

### 5. Run the server with Docker (Optional)

docker build -t url-shortener-server .
docker run -p 3000:3000 --env-file .env url-shortener-server

### 6. Run the Tests

npm test

## **Server-Side Architecture and Design Choices**

### 1. **Overview**

The backend of the URL Shortener app is built using **Node.js** and **Express**. It’s responsible for generating short URLs, handling redirections, and managing URL data using **MongoDB**. Everything is containerized with **Docker**, ensuring a consistent setup across environments and making deployment easy.

### 2. **Tech Stack**

- **Node.js & Express**: The backend server manages all core operations, such as creating short URLs, redirecting users to long URLs, and interacting with the database.
- **MongoDB**: A NoSQL database that stores URL mappings, expiration dates, and related metadata.
- **Mongoose**: A library that helps manage MongoDB data with schemas and easier data access.
- **Docker**: Used to containerize the backend service, so it runs the same across different environments.

### 3. **Core Features**

#### 3.1 **Short URL Generation**

- **Base62 Encoding**: The app uses Base62 (a-z, A-Z, 0-9) to generate short, unique codes for each long URL. This keeps the short URLs compact and easy to share.
- **No Duplicates**: If the same long URL is submitted more than once, the app returns the existing short URL, preventing duplicates.

#### 3.2 **Redirection**

- **How It Works**: When someone visits a short URL (e.g., `http://localhost:3000/abc123`), the backend looks up the code (`abc123`) in MongoDB and redirects the user to the corresponding long URL.
- **Expired URLs**: If a URL has expired (based on the expiration date set during creation), the app returns a `410 Gone` status to indicate that the link is no longer available.

#### 3.3 **API Endpoints**

- **POST /shorten**: Accepts a long URL and returns a shortened URL, with an optional expiration date.
- **GET /:urlCode**: Redirects the user to the long URL associated with the given short code.
- **Error Handling**: The server returns meaningful status codes such as `404` (URL not found) and `410` (URL expired) to indicate the result of the request.

### 4. **Database Design**

The MongoDB database stores the following information:

- **longUrl**: The original, long URL provided by the user.
- **shortUrl**: The shortened version of the URL (composed of the base URL and the short code).
- **urlCode**: The unique identifier (short code) used to access the short URL.
- **createdAt**: The timestamp when the URL was created.
- **expiresAt**: The expiration date, after which the short URL is no longer valid.
- **clicks**: The number of times the shortened version of the URL were clicked

### 5. **Scalability and Performance**

- **TTL (Time-To-Live) Index**: Automatically removes expired URLs from the database after their `expiresAt` date has passed, helping to clean up the database.
- **Index on `urlCode`**: Ensures fast lookups when users try to access a short URL for redirection.

#### 5.1 **Horizontal Scaling with Docker**

- **Containerization**: Using Docker to containerize the backend ensures that it runs consistently across all environments. If traffic increases, you can easily scale by running multiple Docker containers and distributing the load using a load balancer.

### 6. **Deployment Strategy**

- **Docker-Based Deployment**: The app is containerized using Docker, making it easy to deploy on any platform that supports Docker, such as **AWS**, **Google Cloud**, or **Azure**.
