# Hasiri API

This repository contains the backend API for the Hasiri website, built with Next.js API routes and Supabase.

## Features

- RESTful API endpoints for products, categories, homepage content, users, and orders
- Authentication and authorization with JWT tokens
- Database schema and stored procedures
- Comprehensive API documentation
- Middleware for authentication and error handling

## API Endpoints

The API provides the following endpoints:

- **Authentication**
  - Register: `POST /api/auth/register`
  - Login: `POST /api/auth/login`
  - Logout: `POST /api/auth/logout`

- **Products**
  - List products: `GET /api/products`
  - Get product: `GET /api/products/{slug}`
  - Create product: `POST /api/products`
  - Update product: `PUT /api/products/{slug}`
  - Delete product: `DELETE /api/products/{slug}`

- **Categories**
  - List categories: `GET /api/categories`
  - Get category: `GET /api/categories/{slug}`
  - Create category: `POST /api/categories`
  - Update category: `PUT /api/categories/{slug}`
  - Delete category: `DELETE /api/categories/{slug}`

- **Homepage Content**
  - Get homepage content: `GET /api/homepage`
  - Get homepage sections: `GET /api/homepage/sections`
  - Create homepage section: `POST /api/homepage/sections`
  - Reorder homepage sections: `PATCH /api/homepage/sections`
  - Get carousel images: `GET /api/homepage/carousel`
  - Create carousel image: `POST /api/homepage/carousel`

- **User Profile**
  - Get current user profile: `GET /api/users/me`
  - Update current user profile: `PUT /api/users/me`

- **Orders**
  - List orders: `GET /api/orders`
  - Get order: `GET /api/orders/{id}`
  - Create order: `POST /api/orders`
  - Update order status: `PUT /api/orders/{id}`

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up environment variables:
   \`\`\`
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   \`\`\`
4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Database Setup

1. Create the necessary tables in your Supabase project using the SQL in `db/schema.sql`
2. Create the stored procedure for orders using the SQL in `db/create_order_procedure.sql`

## Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
