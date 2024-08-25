# wasserstoff-FullstackInternTask

# Auction Management and User Authentication System

This repository contains two microservices: **User Management and Authentication** and **Auction Management and Bidding**. These services work together to manage users and handle auctions, including bidding and determining winners.

## Overview

This system is designed to handle user authentication and auction management. It consists of two microservices:

1. **User Management and Authentication Service**: Manages user data, authentication, and authorization.
2. **Auction Management and Bidding Service**: Handles auction creation, bidding, and determining auction winners.

## User Management and Authentication Service

### Features
- **Admin Access**: An admin can access all user data and manage users.
- **Static API Secret**: Admin authentication is handled using a static API secret.
- **CRUD Operations**: CRUD operations for user management.
- **Token-Based Authentication**: Users log in with credentials, and a token is issued that is used for authentication during bidding.

## Auction Management and Bidding Service

### Features
- **CRUD Operations on Auctions**: Admins can create, read, update, and delete auctions.
- **Auction Details**: Auctions include start time, end time, start price, item name, and the ID of the user who won the auction.
- **View Ongoing Auctions**: Users can view all auctions that are currently ongoing.
- **Bidding**: Users can place bids on auctions using their authentication token.
- **Determine Auction Winner**: Once an auction ends, the user with the highest bid is declared the winner.

## Setup and Installation

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/auction-system.git
    cd auction-system
    ```

2. Install dependencies for both services:

    ```bash
    cd user-auth-service
    npm install

    cd ../auction-service
    npm install
    ```

3. Start the services:

    ```bash
    cd user-auth-service
    nodemon

    cd ../auction-service
    nodemon
    ```

### Environment Variables

Create a `.env` file in the root of each service with the following variables:

For `user-auth-service`:
```bash
PORT=4000
MONGODB_URI=mongodb://localhost:27017/user-microservice
JWT_SECRET=your_jwt_secret
ADMIN_API_KEY=your_static_api_secret

For `auction-management-service`:
```bash
PORT=4002
MONGODB_URI=mongodb://localhost:27017/auction-access
JWT_SECRET=your_jwt_secret
ADMIN_API_KEY=your_static_api_secret
