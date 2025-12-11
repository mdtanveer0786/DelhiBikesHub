# DelhiBikesHub - Buy & Sell Used Bikes & Scooties in Delhi

A complete frontend marketplace website for buying and selling used bikes and scooties in Delhi, built with HTML, CSS, and JavaScript only.

## Features

1. **Responsive Design** - Works on all devices (desktop, tablet, mobile)
2. **Multi-Page Website** - 7 complete pages with full functionality
3. **Local Storage** - All data is stored in browser's localStorage
4. **User Authentication** - Login/Signup system
5. **Bike Listings** - Add, view, edit, delete bike listings
6. **Advanced Filtering** - Filter bikes by brand, type, price, location
7. **Delhi Localities** - Focus on Delhi areas with locality filters
8. **Modern UI** - Clean, attractive design with smooth animations

## Pages

1. **Homepage** (`index.html`) - Hero section, search, popular localities, featured bikes
2. **All Bikes** (`bikes.html`) - Browse all bikes with filtering and sorting
3. **Bike Details** (`details.html`) - View bike details with image gallery
4. **Add Bike** (`add.html`) - Form to list a bike for sale
5. **Login** (`login.html`) - User login page
6. **Signup** (`signup.html`) - User registration page
7. **Dashboard** (`dashboard.html`) - User profile and listing management

## How to Use

1. **Open the Website**: Open `index.html` in your browser
2. **Browse Bikes**: Click "All Bikes" to see available listings
3. **Search & Filter**: Use search bar or filters to find specific bikes
4. **View Details**: Click on any bike to see full details
5. **Sell Your Bike**: Click "Sell Bike" to create a listing (requires login)
6. **Create Account**: Sign up to access all features
7. **Dashboard**: Manage your listings and profile

## Data Storage

The website uses `localStorage` to store:
- User accounts (`delhibikeshub_users`)
- Bike listings (`delhibikeshub_bikes`)
- Current user session (`delhibikeshub_currentUser`)

All data persists across browser sessions.

## Browser Compatibility

Works on all modern browsers:
- Chrome 60+
- Firefox 60+
- Safari 11+
- Edge 79+

## Project Structure

DelhiBikesHub/
├── index.html # Homepage
├── bikes.html # All Bikes Page
├── details.html # Bike Details Page
├── add.html # Add Bike Page
├── login.html # Login Page
├── signup.html # Signup Page
├── dashboard.html # User Dashboard
├── styles.css # Main CSS file
├── script.js # Main JavaScript file
└── README.md # This file


## Design Elements

- **Color Scheme**: Blue (#1E88E5), White, Light Grey
- **Typography**: Clean, modern sans-serif fonts
- **Layout**: Flexbox and CSS Grid for responsive design
- **Animations**: Smooth hover effects and transitions
- **Icons**: Font Awesome for consistent iconography

## JavaScript Functionality

1. **Data Management**: CRUD operations for bikes and users
2. **Filtering/Sorting**: Real-time filtering and sorting of bike listings
3. **Form Validation**: Client-side validation for forms
4. **Image Handling**: Image upload preview functionality
5. **User Authentication**: Login/logout system with session management
6. **Responsive Menu**: Mobile-friendly hamburger menu

## Setup Instructions

1. Download all files to a folder
2. Open `index.html` in a web browser
3. No server or backend setup required

## Sample Data

The website comes pre-loaded with sample data:
- 6 sample bike listings
- 2 sample user accounts

**Test Credentials:**
- Email: `rahul@example.com`, Password: `password123`
- Email: `priya@example.com`, Password: `password123`

## Features Implementation Details

### Bike Filtering
- Filter by bike type (Bike/Scooty)
- Filter by brand (Hero, Honda, Bajaj, etc.)
- Filter by price range (slider and input fields)
- Filter by Delhi localities (12+ areas)
- Sort by newest, price low-high, price high-low

### User Dashboard
- View your listings
- Edit/Delete listings
- Update profile information
- Account settings

### Bike Details Page
- Image gallery with thumbnail navigation
- Complete bike specifications
- Seller contact information
- Similar bikes recommendation

## Limitations

1. **No Backend**: All data is stored locally in the browser
2. **No Real Images**: Uses placeholder images
3. **No Server Validation**: Form validation is client-side only
4. **Single Browser**: Data doesn't sync across browsers/devices

## Future Enhancements

1. Add backend with database for real data persistence
2. Implement image upload to cloud storage
3. Add search functionality with autocomplete
4. Implement messaging system between buyers and sellers
5. Add review and rating system
6. Implement payment gateway integration
7. Add email notifications

## Credits

- **Design**: Custom design for DelhiBikesHub
- **Icons**: Font Awesome (v6.4.0)
- **Colors**: Material Design Color Palette
- **Development**: Pure HTML, CSS, JavaScript

## License

This project is for educational purposes. Feel free to use and modify.