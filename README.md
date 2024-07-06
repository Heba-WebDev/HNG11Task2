
# _HNG11 Stage 2 task_ 🤓

This project is a simple API built with NestJS, Typescript, Postgres and it's designed to handle users and organizations management.


## _Features_ 👩‍💻
  - User registration and login
  - Organization creation and membership management
  - Secure authentication using JWT tokens


## _Endpoints_ ⛳

### Register User
 - Endpoint: POST /auth/register
 - Description: Register a new user with the provided credentials.

### Login User
 - Endpoint: POST /auth/login
 - Description: Authenticate a user and generate a JWT token.

### Get User Details
 - Endpoint: GET /api/users/:id
 - Description: Retrieve the user details (or a user in their organisation) by ID (requires authentication).

### Create Organization
 - Endpoint: POST /api/organisations
 - Description: Create a new organization.

### Add Member to Organization
 - Endpoint: POST /api/organisations/:orgId/users
 - Description: Add a user as a member to an organization.

### Get All Organizations
 - Endpoint: GET /api/organisations
 - Description: Retrieve all organizations where the user is a member (requires authentication).

### Get Organization Details
 - Endpoint: GET /api/organisations/:orgId
 - Description: Retrieve an organization details by ID (requires authentication).


## Installation 🖥️

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up your environment variables (e.g., database connection, etc.).
4. Run the application using `npm run start:dev`.


# License 💳

This project is licensed under the MIT License.
