# Artisan Management System Backend

A comprehensive backend API for managing artisans, distributors, products, orders, raw materials, and inventory in an artisan marketplace system.

## Features

- **User Management**: User registration, authentication, and profile management
- **Artisan Profiles**: Complete artisan profile management with skills and regions
- **Distributor Management**: Distributor profiles with distribution areas
- **Product Management**: Product catalog with categories, pricing, and stock management
- **Order Management**: Order processing, status tracking, and payment management
- **Raw Material Orders**: Raw material ordering system for artisans
- **Material Management**: Raw material catalog and stock management
- **Inventory Management**: Comprehensive inventory tracking for artisans

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Artisans
- `POST /api/artisans` - Create artisan profile
- `GET /api/artisans` - Get all artisans
- `GET /api/artisans/:id` - Get artisan by ID
- `PUT /api/artisans/:id` - Update artisan
- `DELETE /api/artisans/:id` - Delete artisan
- `POST /api/artisans/:id/skills` - Add skill
- `DELETE /api/artisans/:id/skills` - Remove skill

### Distributors
- `POST /api/distributors` - Create distributor profile
- `GET /api/distributors` - Get all distributors
- `GET /api/distributors/:id` - Get distributor by ID
- `PUT /api/distributors/:id` - Update distributor
- `DELETE /api/distributors/:id` - Delete distributor

### Products
- `POST /api/products` - Create product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/artisan/:artisanId` - Get products by artisan
- `PATCH /api/products/:id/stock` - Update product stock

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `GET /api/orders/buyer/:buyerId` - Get orders by buyer
- `GET /api/orders/artisan/:artisanId` - Get orders by artisan
- `PATCH /api/orders/:id/status` - Update order status

### Raw Material Orders
- `POST /api/raw-material-orders` - Create raw material order
- `GET /api/raw-material-orders` - Get all raw material orders
- `GET /api/raw-material-orders/:id` - Get raw material order by ID
- `PUT /api/raw-material-orders/:id` - Update raw material order
- `DELETE /api/raw-material-orders/:id` - Delete raw material order

### Materials
- `POST /api/materials` - Create material
- `GET /api/materials` - Get all materials
- `GET /api/materials/:id` - Get material by ID
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material
- `GET /api/materials/category/:category` - Get materials by category
- `PATCH /api/materials/:id/stock` - Update material stock

### Inventory
- `POST /api/inventory` - Create inventory
- `GET /api/inventory` - Get all inventories
- `GET /api/inventory/:id` - Get inventory by ID
- `PUT /api/inventory/:id` - Update inventory
- `DELETE /api/inventory/:id` - Delete inventory
- `GET /api/inventory/artisan/:artisanId` - Get inventory by artisan
- `POST /api/inventory/:id/products` - Add product to inventory
- `POST /api/inventory/:id/raw-materials` - Add raw material to inventory

## Data Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ['artisan', 'customer', 'distributor', 'admin']),
  phone: String,
  address: Object,
  isVerified: Boolean
}
```

### Artisan Profile
```javascript
{
  userId: ObjectId (ref: User),
  bio: String,
  region: String (required),
  skills: [String],
  bankDetails: Object
}
```

### Product
```javascript
{
  name: String (required),
  description: String (required),
  category: String (required),
  artisanId: ObjectId (ref: User),
  price: Number (required),
  stock: Number (required),
  images: [String],
  status: String (enum: ['active', 'out_of_stock', 'discontinued'])
}
```

### Order
```javascript
{
  orderNumber: String (required, unique),
  buyerId: ObjectId (ref: User),
  artisanId: ObjectId (ref: User),
  items: [OrderItem],
  totalAmount: Number (required),
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  shippingAddress: Object,
  paymentStatus: String (enum: ['pending', 'completed', 'failed'])
}
```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/artisan_management
```

## Error Handling

The API uses consistent error response format:

```javascript
{
  success: false,
  message: "Error description"
}
```

## Success Response

Successful responses follow this format:

```javascript
{
  success: true,
  message: "Success message",
  data: {} // Response data
}
```

## Development

1. Install nodemon for development:
```bash
npm install -g nodemon
```

2. Run in development mode:
```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License