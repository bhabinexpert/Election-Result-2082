# Nepal Election 2082 Results Dashboard

A full-stack web application for visualizing and analyzing Nepal's 2082 election results. Built with React, Express, and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19.x-61dafb)

## Features

- **Interactive Dashboard** - Overview statistics with charts for party distribution, province breakdown, and gender analysis
- **Candidate Explorer** - Browse all candidates with search, filters, and pagination
- **Candidate Profiles** - Detailed view with constituency comparison and Wikipedia photo integration
- **Advanced Filtering** - Filter by province, district, constituency, party, and gender
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Real-time Data** - RESTful API with MongoDB aggregation for efficient data retrieval

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization charts
- **React Router 7** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose 9** - ODM for MongoDB
- **Morgan** - HTTP request logger

## Project Structure

```
ElectionResult2082/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   └── electionController.js
│   │   ├── models/
│   │   │   └── ElectionResult.js  # Mongoose schema
│   │   ├── routes/
│   │   │   └── electionRoutes.js  # API endpoints
│   │   └── index.js               # Server entry point
│   ├── .env
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API service layer
│   │   ├── utils/                 # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account (or local MongoDB instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ElectionResult2082.git
   cd ElectionResult2082
   ```

2. **Set up the Backend**
   ```bash
   cd Backend
   npm install
   ```

   Create a `.env` file with your environment variables (see `.env.example`).

3. **Set up the Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```

   Create a `.env` file with your environment variables (see `.env.example`).

### Running the Application

1. **Start the Backend**
   ```bash
   cd Backend
   npm run dev
   ```
   Server runs at `http://localhost:5000`

2. **Start the Frontend**
   ```bash
   cd Frontend
   npm run dev
   ```
   App runs at `http://localhost:5173`

## API Endpoints

Base URL: `/api/elections`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Paginated election results with filters |
| GET | `/:id` | Single candidate by ID with constituency peers |
| GET | `/filters` | Available filter options for dropdowns |
| GET | `/stats/overview` | Overview statistics (totals) |
| GET | `/stats/by-party` | Vote stats grouped by party |
| GET | `/stats/by-province` | Vote stats grouped by province |
| GET | `/stats/by-district` | Vote stats grouped by district |
| GET | `/stats/by-gender` | Vote stats grouped by gender |
| GET | `/stats/by-constituency` | Vote stats grouped by constituency |
| GET | `/stats/top-candidates` | Top candidates by votes |

Analytics Base URL: `/api/analytics`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/views` | Track one page view for a visitor (`path`, `visitorId`) |
| GET | `/views` | Get page view stats (`path`, optional `visitorId`) |

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `search` | string | Search by candidate name |
| `sortBy` | string | Sort field (default: votes) |
| `order` | string | Sort order: asc/desc |
| `province_id` | number | Filter by province |
| `district_id` | number | Filter by district |
| `constituency` | string | Filter by constituency |
| `party` | string | Filter by party |
| `gender` | string | Filter by gender |

## Deployment

### Backend

1. Set environment variables in your hosting platform's dashboard (refer to `.env.example`)
2. Build command: `npm install`
3. Start command: `npm start`

### Frontend

1. Set environment variables in your hosting platform's dashboard (refer to `.env.example`)
2. Build command: `npm run build`
3. Output directory: `dist`

## Screenshots

### Dashboard
The main dashboard displays overview statistics, party distribution charts, province breakdown, and top candidates.

### Candidates Page
Grid layout with large candidate photos, search functionality, and filtering options.

### Candidate Profile
Detailed candidate view with Wikipedia photo, election statistics, and constituency comparison chart.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- Election data sourced from Nepal Election Commission
- Candidate photos fetched from Wikipedia API
- Built with modern open-source technologies

---

Made with enthusiasm by Vabin for Nepal's democracy.
