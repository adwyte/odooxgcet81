<div align="center">

# RentPe

### Enterprise Rental Management Platform

A modern, scalable rental management system built with FastAPI and React.  
Streamline your rental operations with integrated payments, invoicing, and scheduling.

[![Python](https://img.shields.io/badge/python-3.13+-3776ab.svg?style=flat-square&logo=python&logoColor=white)](https://www.python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

[Features](#features) • [Installation](#installation) • [Documentation](#api-documentation) • [Contributing](#contributing)

</div>

---

## Demo

<div align="center">

[![RentPe Demo](https://drive.google.com/thumbnail?id=1MKjsFGA0lwCLa7TOiROyoCctdf8GmR4f&sz=w1280)](https://drive.google.com/file/d/1MKjsFGA0lwCLa7TOiROyoCctdf8GmR4f/view?usp=sharing)

*Click the image above to watch the demo video*

</div>

---

## Overview

RentPe is a comprehensive rental management solution designed for businesses that need to manage product rentals, customer relationships, and financial transactions in one unified platform. Built with modern technologies and best practices, it provides a robust foundation for rental operations of any scale.

## Features

### Core Functionality

| Module | Capabilities |
|--------|-------------|
| **Authentication** | JWT-based auth, OAuth 2.0 (Google), role-based access control |
| **Product Management** | Catalog management, inventory tracking, availability scheduling |
| **Order Processing** | Cart system, quotations, order lifecycle management |
| **Payments** | Razorpay integration, digital wallet, coupon/discount system |
| **Invoicing** | Automated invoice generation, email delivery, payment tracking |
| **Calendar** | Google Calendar sync, rental schedule management |
| **Administration** | User management, analytics dashboard, transaction monitoring |

### User Roles

- **Customer** — Browse products, place orders, manage wallet
- **Vendor** — List products, manage inventory, process orders
- **Admin** — Full system access, user management, analytics

## Technology Stack

### Backend
- **Framework:** FastAPI (Python 3.13+)
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Migrations:** Alembic
- **Authentication:** JWT + OAuth 2.0
- **Payments:** Razorpay SDK

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v6

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── core/         # Configuration
│   │   ├── db/           # Database models & session
│   │   ├── services/     # Business logic
│   │   └── main.py       # Application entry
│   ├── alembic/          # Database migrations
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/          # API client layer
    │   ├── components/   # Reusable components
    │   ├── context/      # State management
    │   ├── pages/        # Page components
    │   └── App.tsx       # Route definitions
    └── package.json
```

## Installation

### Prerequisites

- Python 3.13+
- Node.js 18+
- PostgreSQL 15+
- Razorpay account
- Google Cloud project (optional, for OAuth)

### Backend Setup

```bash
# Clone repository
git clone https://github.com/adwyte/odooxgcet81.git
cd odooxgcet81/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/rentpe
SECRET_KEY=your-secret-key
RAZORPAY_KEY_ID=rzp_xxx
RAZORPAY_KEY_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=rzp_xxx
```

## API Documentation

Interactive API documentation is available when the backend is running:

| Interface | URL |
|-----------|-----|
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

### Key Endpoints

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # Authentication
GET    /api/products               # Product listing
POST   /api/orders                 # Create order
POST   /api/payment/create-order   # Initialize payment
POST   /api/payment/validate-coupon # Validate discount code
GET    /api/wallet                 # Wallet balance
GET    /api/admin/coupons          # Coupon management (admin)
```

## Database Schema

```
users ─────────┬──────> wallets ──────> wallet_transactions
               │
               ├──────> orders ───────> order_lines ──────> products
               │
               ├──────> quotations
               │
               └──────> invoices

coupons (standalone)
```

## Deployment

### Docker

```bash
docker-compose up -d
```

### Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend (with Gunicorn)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**[Documentation](https://github.com/adwyte/odooxgcet81/wiki)** • **[Report Bug](https://github.com/adwyte/odooxgcet81/issues)** • **[Request Feature](https://github.com/adwyte/odooxgcet81/issues)**

</div>
