// DelhiBikesHub - Main JavaScript File

// Initialize sample data if not exists
function initializeSampleData() {
    // Check if bikes data exists
    if (!localStorage.getItem('delhibikeshub_bikes')) {
        const sampleBikes = [
            {
                id: 1,
                type: "Scooty",
                brand: "Honda",
                model: "Activa 125",
                year: "2019",
                km: "15000",
                price: "45000",
                description: "Well maintained Honda Activa 125 in excellent condition. Single owner, regularly serviced at authorized service center. No major repairs needed. Selling due to relocation.",
                city: "Delhi",
                locality: "Karol Bagh",
                sellerName: "Rahul Sharma",
                sellerPhone: "8252574386",
                sellerEmail: "rahul@example.com",
                date: "2023-05-15T10:30:00Z",
                userId: 1
            },
            {
                id: 2,
                type: "Bike",
                brand: "Hero",
                model: "Splendor Plus",
                year: "2020",
                km: "12000",
                price: "38000",
                description: "Hero Splendor Plus in very good condition. Second owner, well maintained, gives excellent mileage. All documents available.",
                city: "Delhi",
                locality: "Lajpat Nagar",
                sellerName: "Priya Singh",
                sellerPhone: "9876543211",
                sellerEmail: "priya@example.com",
                date: "2023-06-20T14:45:00Z",
                userId: 2
            },
            {
                id: 3,
                type: "Bike",
                brand: "Royal Enfield",
                model: "Classic 350",
                year: "2018",
                km: "25000",
                price: "120000",
                description: "Royal Enfield Classic 350 in perfect condition. Well maintained, serviced regularly. Custom modifications done. Selling as moving abroad.",
                city: "Delhi",
                locality: "Rohini",
                sellerName: "Amit Kumar",
                sellerPhone: "9876543212",
                sellerEmail: "amit@example.com",
                date: "2023-07-10T09:15:00Z",
                userId: 3
            },
            {
                id: 4,
                type: "Scooty",
                brand: "TVS",
                model: "Jupiter",
                year: "2021",
                km: "8000",
                price: "55000",
                description: "TVS Jupiter like new condition. First owner, used occasionally. Complete service history available. Reason for selling: upgraded to car.",
                city: "Delhi",
                locality: "Dwarka",
                sellerName: "Neha Gupta",
                sellerPhone: "9876543213",
                sellerEmail: "neha@example.com",
                date: "2023-08-05T11:20:00Z",
                userId: 4
            },
            {
                id: 5,
                type: "Bike",
                brand: "Bajaj",
                model: "Pulsar 150",
                year: "2017",
                km: "30000",
                price: "40000",
                description: "Bajaj Pulsar 150 in good running condition. Well maintained, recent servicing done. Good mileage bike.",
                city: "Delhi",
                locality: "Shahdara",
                sellerName: "Vikram Mehta",
                sellerPhone: "9876543214",
                sellerEmail: "vikram@example.com",
                date: "2023-08-25T16:10:00Z",
                userId: 5
            },
            {
                id: 6,
                type: "Scooty",
                brand: "Suzuki",
                model: "Access 125",
                year: "2020",
                km: "18000",
                price: "52000",
                description: "Suzuki Access 125 in excellent condition. Single owner, all original parts, well maintained. Selling due to job transfer.",
                city: "Delhi",
                locality: "Connaught Place",
                sellerName: "Anjali Reddy",
                sellerPhone: "9876543215",
                sellerEmail: "anjali@example.com",
                date: "2023-09-12T13:30:00Z",
                userId: 6
            }
        ];

        localStorage.setItem('delhibikeshub_bikes', JSON.stringify(sampleBikes));
    }

    // Check if users data exists
    if (!localStorage.getItem('delhibikeshub_users')) {
        const sampleUsers = [
            {
                id: 1,
                name: "Rahul Sharma",
                phone: "8252574386",
                email: "rahul@example.com",
                password: "password123",
                location: "Karol Bagh",
                joinDate: "2022-03-15T10:30:00Z"
            },
            {
                id: 2,
                name: "Priya Singh",
                phone: "9876543211",
                email: "priya@example.com",
                password: "password123",
                location: "Lajpat Nagar",
                joinDate: "2022-05-20T14:45:00Z"
            }
        ];

        localStorage.setItem('delhibikeshub_users', JSON.stringify(sampleUsers));
    }
}

// Mobile menu toggle
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Load featured bikes on homepage
function loadFeaturedBikes() {
    const featuredBikesContainer = document.getElementById('featuredBikes');
    if (!featuredBikesContainer) return;

    const bikes = JSON.parse(localStorage.getItem('delhibikeshub_bikes')) || [];
    const featuredBikes = bikes.slice(0, 6); // Show first 6 bikes as featured

    if (featuredBikes.length === 0) {
        featuredBikesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No bikes available</h3>
                <p>Be the first to list a bike for sale!</p>
            </div>
        `;
        return;
    }

    featuredBikesContainer.innerHTML = featuredBikes.map(bike => `
        <div class="bike-card">
            <div class="bike-image">
                <img src="images/bike${(bike.id % 3) + 1}.jpg" alt="${bike.brand} ${bike.model}">
            </div>
            <div class="bike-info">
                <h3>${bike.brand} ${bike.model}</h3>
                <div class="bike-meta">
                    <span><i class="fas fa-road"></i> ${bike.km} km</span>
                    <span><i class="fas fa-calendar-alt"></i> ${bike.year}</span>
                </div>
                <div class="bike-price">₹${formatPrice(bike.price)}</div>
                <div class="bike-location">
                    <i class="fas fa-map-marker-alt"></i> ${bike.locality}, Delhi
                </div>
                <a href="details.html?id=${bike.id}" class="btn" style="width: 100%; text-align: center;">
                    <i class="fas fa-eye"></i> View Details
                </a>
            </div>
        </div>
    `).join('');
}

// Load all bikes on bikes page
function loadAllBikes() {
    const allBikesContainer = document.getElementById('allBikes');
    if (!allBikesContainer) return;

    const bikes = JSON.parse(localStorage.getItem('delhibikeshub_bikes')) || [];

    if (bikes.length === 0) {
        allBikesContainer.innerHTML = '';
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('bikesCount').textContent = 'No bikes found';
        return;
    }

    // Display all bikes initially
    displayFilteredBikes(bikes);
}

// Display filtered bikes
function displayFilteredBikes(bikes) {
    const allBikesContainer = document.getElementById('allBikes');
    const noResults = document.getElementById('noResults');
    const bikesCount = document.getElementById('bikesCount');

    if (bikes.length === 0) {
        allBikesContainer.innerHTML = '';
        noResults.style.display = 'block';
        bikesCount.textContent = 'No bikes found';
        return;
    }

    noResults.style.display = 'none';
    bikesCount.textContent = `${bikes.length} Bikes Found`;

    allBikesContainer.innerHTML = bikes.map(bike => `
        <div class="bike-card">
            <div class="bike-image">
                <img src="images/bike${(bike.id % 3) + 1}.jpg" alt="${bike.brand} ${bike.model}">
            </div>
            <div class="bike-info">
                <h3>${bike.brand} ${bike.model}</h3>
                <div class="bike-meta">
                    <span><i class="fas fa-road"></i> ${bike.km} km</span>
                    <span><i class="fas fa-calendar-alt"></i> ${bike.year}</span>
                    <span><i class="fas fa-motorcycle"></i> ${bike.type}</span>
                </div>
                <div class="bike-price">₹${formatPrice(bike.price)}</div>
                <div class="bike-location">
                    <i class="fas fa-map-marker-alt"></i> ${bike.locality}, Delhi
                </div>
                <a href="details.html?id=${bike.id}" class="btn" style="width: 100%; text-align: center;">
                    <i class="fas fa-eye"></i> View Details
                </a>
            </div>
        </div>
    `).join('');
}

// Setup filters on bikes page
function setupFilters() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const sortSelect = document.getElementById('sortBy');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
}

// Apply filters to bike listings
function applyFilters() {
    const bikes = JSON.parse(localStorage.getItem('delhibikeshub_bikes')) || [];

    // Get selected bike types
    const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked'))
        .map(cb => cb.value);

    // Get selected brands
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
        .map(cb => cb.value);

    // Get selected locations
    const selectedLocations = Array.from(document.querySelectorAll('input[name="location"]:checked'))
        .map(cb => cb.value);

    // Get price range
    const minPrice = document.getElementById('minPrice').value || 0;
    const maxPrice = document.getElementById('maxPrice').value || 500000;

    // Filter bikes
    let filteredBikes = bikes.filter(bike => {
        // Filter by type
        if (selectedTypes.length > 0 && !selectedTypes.includes(bike.type)) {
            return false;
        }

        // Filter by brand
        if (selectedBrands.length > 0 && !selectedBrands.includes(bike.brand)) {
            return false;
        }

        // Filter by location
        if (selectedLocations.length > 0 && !selectedLocations.includes(bike.locality)) {
            return false;
        }

        // Filter by price
        const price = parseInt(bike.price);
        if (price < minPrice || price > maxPrice) {
            return false;
        }

        return true;
    });

    // Apply sorting
    const sortBy = document.getElementById('sortBy').value;
    filteredBikes = sortBikes(filteredBikes, sortBy);

    // Display filtered bikes
    displayFilteredBikes(filteredBikes);
}

// Clear all filters
function clearFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    // Check default bike type checkboxes
    document.querySelectorAll('input[name="type"]').forEach(cb => {
        cb.checked = true;
    });

    // Reset price range
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('priceSlider').value = 500000;
    document.getElementById('currentMaxPrice').textContent = '₹5,00,000';

    // Reset sort
    document.getElementById('sortBy').value = 'newest';

    // Apply filters (which will show all bikes)
    applyFilters();
}

// Setup sorting on bikes page
function setupSorting() {
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
}

// Sort bikes based on selected option
function sortBikes(bikes, sortBy) {
    const sortedBikes = [...bikes];

    switch (sortBy) {
        case 'price-low':
            sortedBikes.sort((a, b) => parseInt(a.price) - parseInt(b.price));
            break;
        case 'price-high':
            sortedBikes.sort((a, b) => parseInt(b.price) - parseInt(a.price));
            break;
        case 'newest':
        default:
            sortedBikes.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }

    return sortedBikes;
}

// Load bike details on details page
function loadBikeDetails() {
    // Get bike ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bikeId = parseInt(urlParams.get('id'));

    if (!bikeId) {
        // Redirect to bikes page if no ID
        window.location.href = 'bikes.html';
        return;
    }

    const bikes = JSON.parse(localStorage.getItem('delhibikeshub_bikes')) || [];
    const bike = bikes.find(b => b.id === bikeId);

    if (!bike) {
        // Redirect to bikes page if bike not found
        window.location.href = 'bikes.html';
        return;
    }

    // Update page title
    document.title = `${bike.brand} ${bike.model} - DelhiBikesHub`;

    // Update bike details
    document.getElementById('bikeTitle').textContent = `${bike.brand} ${bike.model}`;
    document.getElementById('bikePrice').textContent = `₹${formatPrice(bike.price)}`;
    document.getElementById('bikeKm').textContent = `${bike.km} km`;
    document.getElementById('bikeYear').textContent = bike.year;
    document.getElementById('bikeLocation').textContent = `${bike.locality}, Delhi`;
    document.getElementById('bikeOwner').textContent = "First Owner";
    document.getElementById('bikeDescription').textContent = bike.description;

    // Update specifications
    document.getElementById('specBrand').textContent = bike.brand;
    document.getElementById('specModel').textContent = bike.model;
    document.getElementById('specType').textContent = bike.type;
    document.getElementById('specFuel').textContent = "Petrol";
    document.getElementById('specEngine').textContent = bike.type === "Scooty" ? "125 cc" : "150 cc";
    document.getElementById('specColor').textContent = "Black";

    // Update seller info
    document.getElementById('sellerName').textContent = bike.sellerName;
    document.getElementById('sellerLocation').textContent = `${bike.locality}, Delhi`;

    // Setup image gallery
    const imageThumbs = document.getElementById('imageThumbs');
    const imagesCount = Math.min(5, 3 + (bike.id % 3)); // Generate 3-5 images

    let thumbsHTML = '';
    for (let i = 1; i <= imagesCount; i++) {
        const imgNum = (bike.id + i) % 3 + 1;
        const activeClass = i === 1 ? 'active' : '';
        thumbsHTML += `
            <div class="thumb-img ${activeClass}" data-index="${i}">
                <img src="images/bike${imgNum}.jpg" alt="${bike.brand} ${bike.model} - Image ${i}">
            </div>
        `;
    }

    imageThumbs.innerHTML = thumbsHTML;

    // Setup click events for thumbnails
    document.querySelectorAll('.thumb-img').forEach((thumb, index) => {
        thumb.addEventListener('click', function () {
            const imgNum = (bike.id + index + 1) % 3 + 1;
            document.getElementById('mainImage').src = `images/bike${imgNum}.jpg`;

            // Update active thumbnail
            document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Load similar bikes on details page
function loadSimilarBikes() {
    const similarBikesContainer = document.getElementById('similarBikes');
    if (!similarBikesContainer) return;

    // Get current bike ID
    const urlParams = new URLSearchParams(window.location.search);
    const currentBikeId = parseInt(urlParams.get('id'));

    const bikes = JSON.parse(localStorage.getItem('delhibikeshub_bikes')) || [];

    // Filter out current bike and get 3 random other bikes
    const otherBikes = bikes.filter(b => b.id !== currentBikeId);
    const similarBikes = otherBikes
        .sort(() => 0.5 - Math.random()) // Shuffle array
        .slice(0, 3); // Take first 3

    if (similarBikes.length === 0) {
        similarBikesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No similar bikes found</h3>
                <p>Check back later for more listings</p>
            </div>
        `;
        return;
    }

    similarBikesContainer.innerHTML = similarBikes.map(bike => `
        <div class="bike-card">
            <div class="bike-image">
                <img src="images/bike${(bike.id % 3) + 1}.jpg" alt="${bike.brand} ${bike.model}">
            </div>
            <div class="bike-info">
                <h3>${bike.brand} ${bike.model}</h3>
                <div class="bike-meta">
                    <span><i class="fas fa-road"></i> ${bike.km} km</span>
                    <span><i class="fas fa-calendar-alt"></i> ${bike.year}</span>
                </div>
                <div class="bike-price">₹${formatPrice(bike.price)}</div>
                <div class="bike-location">
                    <i class="fas fa-map-marker-alt"></i> ${bike.locality}, Delhi
                </div>
                <a href="details.html?id=${bike.id}" class="btn" style="width: 100%; text-align: center;">
                    <i class="fas fa-eye"></i> View Details
                </a>
            </div>
        </div>
    `).join('');
}

// Format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Initialize the application
function initApp() {
    initializeSampleData();
    setupMobileMenu();

    // Check which page we're on and call appropriate functions
    const path = window.location.pathname;
    const page = path.split('/').pop();

    if (page === 'index.html' || page === '' || page === 'DelhiBikesHub/') {
        // Homepage
        loadFeaturedBikes();
    } else if (page === 'bikes.html') {
        // All Bikes page
        loadAllBikes();
        setupFilters();
        setupSorting();
    } else if (page === 'details.html') {
        // Bike Details page
        loadBikeDetails();
        loadSimilarBikes();
    }
    // Other pages have their own initialization in their respective files
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);