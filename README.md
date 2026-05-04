# AI Impact Reporting Generator

A Node.js, Express, and MySQL sustainability reporting app for product impact summaries. Users enter a product ID, generate an impact report, view the completed report on a separate report page, and return home to create another report.

## Features

- Home page for entering a product ID
- Separate generated report page with a Back to Home button
- Product report history stored in the browser
- Demo/sample products from ID `1` to `150`
- MySQL seed file with sample product and impact data
- Built-in fallback demo catalog when MySQL is not connected
- Impact metrics for plastic saved, carbon avoided, sourcing context, confidence score, and recommendations
- Responsive vanilla HTML, CSS, and JavaScript UI

## Tech Stack

- Node.js
- Express.js
- MySQL with `mysql2`
- Vanilla HTML, CSS, and JavaScript
- `dotenv` for environment variables

## Project Structure

```text
config/                 Database connection
controllers/            API controller logic and demo fallback data
public/                 Frontend UI
routes/                 Express routes
services/               Impact calculation service
database.sql            MySQL schema and demo seed data
server.js               Express app entry point
```

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file from `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_impact
PORT=4000
```

Import `database.sql` into MySQL. It creates the database, tables, and sample data for product IDs `1` to `150`.

Start the server:

```bash
npm start
```

Open the app:

```text
http://localhost:4000
```

## Demo Products

Use any product ID from `1` to `150`.

Examples:

```text
1, 2, 3, 16, 80, 150
```

If MySQL is not connected, these demo IDs still work through the fallback catalog in `controllers/impactController.js`.

## API

Health check:

```http
GET /api/health
```

Product details:

```http
GET /api/products/:product_id
```

Generate impact report:

```http
POST /api/impact
Content-Type: application/json

{
  "product_id": 16
}
```

## Notes

- `node_modules/` is intentionally ignored and should be recreated with `npm install`.
- `.env` is ignored so local database credentials are not committed.
- `.env.example` is included as a safe template.

## Author

Jatin
