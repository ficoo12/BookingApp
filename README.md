# BookingApp

A MERN stack booking platform for small and medium-sized apartment owners. It gives owners a dashboard to manage their listings, pricing, and reservations, while guests get a simple flow to search, view, and book an apartment.

## Live demo

- **Admin dashboard:** https://admindashboard06.netlify.app
- **Guest app:** https://apartmani013.netlify.app/

Feel free to log in and try the admin panel with the credentials below — all data in it is placeholder content used only for development and demo purposes.

```
username: admin
password: admin123
```

The frontends are deployed on Netlify's free tier, and the backend API is deployed on Render.

## What's included

This is a full MVP built across three apps sharing one backend.

### Admin dashboard

A React dashboard where owners manage their properties end to end: adding and editing apartment listings with photos and amenities, building reusable price lists that drive per-night quotes, and a calendar view of all reservations. Access is protected behind JWT-based authentication with automatic access token refresh.

### Guest webapp

A guest-facing booking flow built in React: search apartments by date range and guest count, browse listing details and photos, and complete a reservation with contact details — ending in a confirmation page. It talks to the same public API endpoints the backend exposes for availability, apartment details, and pricing.

### Backend

A Node.js/Express REST API backed by MongoDB (via Mongoose) that powers both frontends: apartment CRUD, price lists with per-period pricing, reservation and availability logic, contact messages, and JWT-based auth (with refresh token rotation) for the admin panel. Image uploads are handled with Multer.

## Tech stack

- **Frontend:** React, React Router, Vite, Tailwind CSS, TanStack Query (admin)
- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, Multer
- **Deployment:** Netlify (admin + webapp), Render (backend), MongoDB Atlas (database)
