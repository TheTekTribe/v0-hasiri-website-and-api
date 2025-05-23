# Hasiri API Documentation

This document provides comprehensive documentation for the Hasiri API, which can be used by any frontend application (web, mobile, etc.) to interact with the Hasiri platform.

## Base URL

\`\`\`
https://your-domain.com/api
\`\`\`

## Authentication

The API uses JWT tokens for authentication. To authenticate, include the token in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`

### Authentication Endpoints

#### Register a new user

\`\`\`
POST /auth/register
\`\`\`

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name",
  "phone": "+1234567890"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com"
    }
  },
  "message": "Registration successful. Please check your email for verification."
}
\`\`\`

#### Login

\`\`\`
POST /auth/login
\`\`\`

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com"
    },
    "profile": {
      "id": "user-uuid",
      "name": "User Name",
      "email": "user@example.com",
      "phone": "+1234567890",
      "role": "customer"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_at": 1678900000
    }
  }
}
\`\`\`

#### Logout

\`\`\`
POST /auth/logout
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Logged out successfully"
}
\`\`\`

## Products

### Get all products

\`\`\`
GET /products
\`\`\`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category ID
- `featured`: Filter featured products (true/false)
- `search`: Search term for product name or description
- `sort_by`: Field to sort by (default: created_at)
- `sort_order`: Sort order (asc/desc, default: desc)

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "product-uuid",
      "name": "Product Name",
      "slug": "product-slug",
      "description": "Product description",
      "price": 1200,
      "sale_price": null,
      "stock_quantity": 45,
      "category_id": "category-uuid",
      "image_url": "/images/product.jpg",
      "featured": true,
      "is_active": true,
      "categories": {
        "id": "category-uuid",
        "name": "Category Name",
        "slug": "category-slug"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
\`\`\`

### Get a single product

\`\`\`
GET /products/{slug}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "product-uuid",
    "name": "Product Name",
    "slug": "product-slug",
    "description": "Product description",
    "price": 1200,
    "sale_price": null,
    "stock_quantity": 45,
    "category_id": "category-uuid",
    "image_url": "/images/product.jpg",
    "featured": true,
    "is_active": true,
    "categories": {
      "id": "category-uuid",
      "name": "Category Name",
      "slug": "category-slug"
    }
  }
}
\`\`\`

### Create a product (Admin only)

\`\`\`
POST /products
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "New Product",
  "slug": "new-product",
  "description": "Product description",
  "price": 1500,
  "sale_price": 1200,
  "stock_quantity": 50,
  "category_id": "category-uuid",
  "image_url": "/images/new-product.jpg",
  "featured": false,
  "is_active": true
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "new-product-uuid",
    "name": "New Product",
    "slug": "new-product",
    "description": "Product description",
    "price": 1500,
    "sale_price": 1200,
    "stock_quantity": 50,
    "category_id": "category-uuid",
    "image_url": "/images/new-product.jpg",
    "featured": false,
    "is_active": true
  },
  "message": "Product created successfully"
}
\`\`\`

### Update a product (Admin only)

\`\`\`
PUT /products/{slug}
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "Updated Product",
  "description": "Updated description",
  "price": 1800,
  "stock_quantity": 40
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "product-uuid",
    "name": "Updated Product",
    "slug": "product-slug",
    "description": "Updated description",
    "price": 1800,
    "stock_quantity": 40,
    "category_id": "category-uuid",
    "image_url": "/images/product.jpg",
    "featured": true,
    "is_active": true
  },
  "message": "Product updated successfully"
}
\`\`\`

### Delete a product (Admin only)

\`\`\`
DELETE /products/{slug}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Product deleted successfully"
}
\`\`\`

## Categories

### Get all categories

\`\`\`
GET /categories
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "category-uuid",
      "name": "Category Name",
      "slug": "category-slug",
      "description": "Category description",
      "image_url": "/images/category.jpg"
    }
  ]
}
\`\`\`

### Get a single category

\`\`\`
GET /categories/{slug}
\`\`\`

**Query Parameters:**
- `include_products`: Include products in the category (true/false)
- `page`: Page number for products (default: 1)
- `limit`: Items per page for products (default: 10)

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "category-uuid",
    "name": "Category Name",
    "slug": "category-slug",
    "description": "Category description",
    "image_url": "/images/category.jpg",
    "products": [
      {
        "id": "product-uuid",
        "name": "Product Name",
        "slug": "product-slug",
        "description": "Product description",
        "price": 1200,
        "image_url": "/images/product.jpg"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
\`\`\`

### Create a category (Admin only)

\`\`\`
POST /categories
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description",
  "image_url": "/images/new-category.jpg"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "new-category-uuid",
    "name": "New Category",
    "slug": "new-category",
    "description": "Category description",
    "image_url": "/images/new-category.jpg"
  },
  "message": "Category created successfully"
}
\`\`\`

### Update a category (Admin only)

\`\`\`
PUT /categories/{slug}
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "Updated Category",
  "description": "Updated description"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "category-uuid",
    "name": "Updated Category",
    "slug": "category-slug",
    "description": "Updated description",
    "image_url": "/images/category.jpg"
  },
  "message": "Category updated successfully"
}
\`\`\`

### Delete a category (Admin only)

\`\`\`
DELETE /categories/{slug}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Category deleted successfully"
}
\`\`\`

## Homepage Content

### Get homepage content

\`\`\`
GET /homepage
\`\`\`

**Query Parameters:**
- `include_disabled`: Include disabled sections and images (true/false, default: false)

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "sections": [
      {
        "id": "section-uuid",
        "section_type": "hero",
        "title": "Hero Section",
        "subtitle": "Subtitle text",
        "content": {},
        "is_enabled": true,
        "display_order": 0
      }
    ],
    "carousel": [
      {
        "id": "carousel-uuid",
        "image_url": "/images/carousel.jpg",
        "title": "Carousel Title",
        "subtitle": "Carousel subtitle",
        "cta_text": "Learn More",
        "cta_link": "/learn",
        "display_order": 0,
        "is_enabled": true
      }
    ],
    "featuredProducts": [
      {
        "id": "product-uuid",
        "name": "Product Name",
        "slug": "product-slug",
        "price": 1200,
        "image_url": "/images/product.jpg"
      }
    ]
  }
}
\`\`\`

### Get homepage sections

\`\`\`
GET /homepage/sections
\`\`\`

**Query Parameters:**
- `include_disabled`: Include disabled sections (true/false, default: false)

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "section-uuid",
      "section_type": "hero",
      "title": "Hero Section",
      "subtitle": "Subtitle text",
      "content": {},
      "is_enabled": true,
      "display_order": 0
    }
  ]
}
\`\`\`

### Create a homepage section (Admin only)

\`\`\`
POST /homepage/sections
\`\`\`

**Request Body:**
\`\`\`json
{
  "section_type": "features",
  "title": "Features Section",
  "subtitle": "Our key features",
  "content": {},
  "is_enabled": true,
  "display_order": 1
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "new-section-uuid",
    "section_type": "features",
    "title": "Features Section",
    "subtitle": "Our key features",
    "content": {},
    "is_enabled": true,
    "display_order": 1
  },
  "message": "Homepage section created successfully"
}
\`\`\`

### Reorder homepage sections (Admin only)

\`\`\`
PATCH /homepage/sections
\`\`\`

**Request Body:**
\`\`\`json
[
  {
    "id": "section-uuid-1",
    "display_order": 0
  },
  {
    "id": "section-uuid-2",
    "display_order": 1
  }
]
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Homepage sections reordered successfully"
}
\`\`\`

### Get carousel images

\`\`\`
GET /homepage/carousel
\`\`\`

**Query Parameters:**
- `include_disabled`: Include disabled images (true/false, default: false)

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "carousel-uuid",
      "image_url": "/images/carousel.jpg",
      "title": "Carousel Title",
      "subtitle": "Carousel subtitle",
      "cta_text": "Learn More",
      "cta_link": "/learn",
      "display_order": 0,
      "is_enabled": true
    }
  ]
}
\`\`\`

### Create a carousel image (Admin only)

\`\`\`
POST /homepage/carousel
\`\`\`

**Request Body:**
\`\`\`json
{
  "image_url": "/images/new-carousel.jpg",
  "title": "New Carousel",
  "subtitle": "New carousel subtitle",
  "cta_text": "Shop Now",
  "cta_link": "/products",
  "display_order": 1,
  "is_enabled": true
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "new-carousel-uuid",
    "image_url": "/images/new-carousel.jpg",
    "title": "New Carousel",
    "subtitle": "New carousel subtitle",
    "cta_text": "Shop Now",
    "cta_link": "/products",
    "display_order": 1,
    "is_enabled": true
  },
  "message": "Carousel image created successfully"
}
\`\`\`

## User Profile

### Get current user profile

\`\`\`
GET /users/me
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "State",
      "postal_code": "12345",
      "country": "Country"
    },
    "role": "customer"
  }
}
\`\`\`

### Update current user profile

\`\`\`
PUT /users/me
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "Updated Name",
  "phone": "+9876543210",
  "address": {
    "street": "456 New St",
    "city": "Newtown",
    "state": "State",
    "postal_code": "67890",
    "country": "Country"
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "name": "Updated Name",
    "email": "user@example.com",
    "phone": "+9876543210",
    "address": {
      "street": "456 New St",
      "city": "Newtown",
      "state": "State",
      "postal_code": "67890",
      "country": "Country"
    },
    "role": "customer"
  },
  "message": "User profile updated successfully"
}
\`\`\`

## Orders

### Get user orders

\`\`\`
GET /orders
\`\`\`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by order status
- `admin`: Get all orders (admin only, true/false)

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "order-uuid",
      "user_id": "user-uuid",
      "status": "pending",
      "shipping_address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "State",
        "postal_code": "12345",
        "country": "Country"
      },
      "billing_address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "State",
        "postal_code": "12345",
        "country": "Country"
      },
      "payment_method": "card",
      "shipping_method": "standard",
      "subtotal": 2400,
      "shipping_cost": 100,
      "tax": 120,
      "total": 2620,
      "created_at": "2023-01-01T12:00:00Z",
      "order_items": [
        {
          "id": "item-uuid",
          "product_id": "product-uuid",
          "quantity": 2,
          "unit_price": 1200,
          "total_price": 2400
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
\`\`\`

### Get a single order

\`\`\`
GET /orders/{id}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "user_id": "user-uuid",
    "status": "pending",
    "shipping_address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "State",
      "postal_code": "12345",
      "country": "Country"
    },
    "billing_address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "State",
      "postal_code": "12345",
      "country": "Country"
    },
    "payment_method": "card",
    "shipping_method": "standard",
    "subtotal": 2400,
    "shipping_cost": 100,
    "tax": 120,
    "total": 2620,
    "created_at": "2023-01-01T12:00:00Z",
    "order_items": [
      {
        "id": "item-uuid",
        "product_id": "product-uuid",
        "quantity": 2,
        "unit_price": 1200,
        "total_price": 2400
      }
    ]
  }
}
\`\`\`

### Create an order

\`\`\`
POST /orders
\`\`\`

**Request Body:**
\`\`\`json
{
  "shipping_address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "State",
    "postal_code": "12345",
    "country": "Country"
  },
  "billing_address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "State",
    "postal_code": "12345",
    "country": "Country"
  },
  "payment_method": "card",
  "shipping_method": "standard",
  "items": [
    {
      "product_id": "product-uuid",
      "quantity": 2
    }
  ]
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "new-order-uuid",
    "user_id": "user-uuid",
    "status": "pending",
    "subtotal": 2400,
    "shipping_cost": 100,
    "tax": 120,
    "total": 2620,
    "created_at": "2023-01-01T12:00:00Z",
    "items": [
      {
        "id": "item-uuid",
        "product_id": "product-uuid",
        "quantity": 2,
        "unit_price": 1200,
        "total_price": 2400
      }
    ]
  },
  "message": "Order created successfully"
}
\`\`\`

### Update an order status (Admin only)

\`\`\`
PUT /orders/{id}
\`\`\`

**Request Body:**
\`\`\`json
{
  "status": "shipped"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "status": "shipped",
    "updated_at": "2023-01-02T12:00:00Z"
  },
  "message": "Order updated successfully"
}
\`\`\`

## Error Responses

All API endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
\`\`\`

Common HTTP status codes:
- `400`: Bad Request - The request was invalid
- `401`: Unauthorized - Authentication is required or failed
- `403`: Forbidden - The user doesn't have permission
- `404`: Not Found - The requested resource doesn't exist
- `500`: Internal Server Error - Something went wrong on the server
\`\`\`

Let's create a README file:
