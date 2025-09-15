# etw2

A work-in-progress full-stack JavaScript project that aims to display news on an interactive map.  
The goal is to create an application where users can see events (e.g., plane crashes, disasters, or breaking news) represented with markers at their geographical locations.

## Features (Planned & Current)
- **Backend (server)**  
  - REST API built with Express  
  - MongoDB integration via Mongoose  
  - User authentication with JWT and bcrypt  
  - Middleware for security (Helmet, CORS, cookie-parser, morgan)

- **Frontend (client2)**  
  - React 19 with Redux and Redux-Saga for state management  
  - React Router for navigation  
  - Google Maps integration to plot news events  
  - Testing setup with React Testing Library and Jest DOM  

- **Planned functionality**  
  - Add and fetch news events with location data  
  - Display events on a map with interactive markers  
  - Filter and search news by type or date  
