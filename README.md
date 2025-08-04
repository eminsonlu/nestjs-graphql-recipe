# GraphQL NestJS Recipe App

## Description

This is a [NestJS](https://github.com/nestjs/nest) Recipe management application built with GraphQL and designed with TDD.

## Features

- 🍳 Recipe management (CRUD operations)
- 🔐 User authentication and authorization
- 📊 GraphQL API with type-safe queries and mutations
- 🧪 Comprehensive test coverage
- 🏗️ Clean architecture with TDD approach

## Tech Stack

- **Framework**: NestJS
- **API**: GraphQL
- **Database**: Postgres
- **Testing**: Jest
- **Package Manager**: pnpm

## Prerequisites

- Node.js
- pnpm

## Project Setup

```bash
$ pnpm install
```

## Running the Application

```bash
# development
$ pnpm run start

# watch mode (recommended for development)
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

The GraphQL playground will be available at `http://localhost:3000/graphql`

## Testing

```bash
# unit tests
$ pnpm run test
```

## Project Structure

```
src/
├── app.module.ts           # Main application module
├── main.ts                 # Application entry point
├── graphql.ts              # GraphQL configuration
├── common/                 # Shared utilities and common functionality
├── config/                 # Configuration files
├── models/                 # Data models
├── modules/                # Feature modules
├── schema/                 # GraphQL schema definitions
│   ├── base.graphql        # Base GraphQL schema
│   ├── recipe.graphql      # Recipe schema
│   └── user.graphql        # User schema
└── shared/                 # Shared resources and utilities
```

## License

This project is licensed under the MIT License.