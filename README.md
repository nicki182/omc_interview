# OMC Interview Project
It utilizes **pnpm** as the package manager and **Prisma** as the ORM for database interactions. Additionally, **Redis** is used as a caching mechanism to improve performance.

## Features

- **pnpm**: Fast, disk space-efficient package manager.
- **Prisma**: Type-safe database client for seamless integration with your database.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v20 or later)
- pnpm (v8 or later)

### Installation

1. Clone the repository:
    ```
    git clone https://github.com/your-username/omc_interview.git
    cd omc_interview
    ```

2. Install dependencies using pnpm:
    ```
    pnpm install
    ```

### Database Setup

1. Configure your database connection in the `.env` file:
    ```env
    DATABASE_URL="your-database-url"
    ```

2. Run Prisma migrations:
    ```
    pnpm prisma migrate dev
    ```

### Running the Project

Start the development server:
```
pnpm bs:dev
```

## Features

- **pnpm**: Fast, disk space-efficient package manager.
- **Prisma**: Type-safe database client for seamless integration with your database.
- **Redis**: High-performance in-memory data store for caching.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v20 or later)
- pnpm (v8 or later)

### Installation

1. Clone the repository:
    ```
    git clone https://github.com/your-username/omc_interview.git
    cd omc_interview
    ```

2. Install dependencies using pnpm:
    ```
    pnpm install
    ```

### Database Setup

1. Configure your database connection in the `.env` file:
    ```env
    DATABASE_URL="your-database-url"
    ```

2. Run Prisma migrations:
    ```
    pnpm prisma migrate dev
    ```

### Redis Setup

Ensure Redis is installed and running on your system. Configure the Redis connection in the `.env` file:
```env
REDIS_URL="your-redis-url"
```

### Running the Project

Start the development server:
```bash
pnpm bs:dev
```

## Testing

The project uses **Jest** for unit and integration tests.

### Running Tests

Execute the test suite:
```
pnpm test
```

## Useful Commands

- **Generate Prisma Client**:
  ```
  pnpm prisma generate
  ```
- **Run Migrations**:
  ```
  pnpm prisma migrate dev
  ```

## License

This project is licensed under the MIT License.

## Useful Commands

- **Generate Prisma Client**:
  ```
  pnpm prisma generate
  ```
- **Run Migrations**:
  ```
  pnpm prisma migrate dev
  ```

## License

This project is licensed under the MIT License.
