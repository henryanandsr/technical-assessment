# Villa Booking Website
This project is a villa booking website that allows users to explore available villas, view details, and make reservations. The website includes multiple pages, such as a homepage, a list of available villas, individual villa pages, and a booking confirmation page.

## Features
* Homepage
    * Display an attractive homepage with high-quality images and a welcome message.
    * Search/filter option for users to find villas based on location, price range, and amenities.
* Villa Listings
    * List available villas based on the user's search criteria.
    * Each villa listing includes an image, title, brief description, price per night, and a "Book Now" button.
    * Implement pagination or infinite scroll for a better user experience.
* Villa Details
    * Display detailed pages with high-quality images, a detailed description, amenities, and a map of the villa location.
* Booking Process
    * Implement a booking process with options to select dates, the number of guests, and additional preferences.
    * Provide a summary of booking details before confirming.
    * Display a confirmation message after a successful booking.
* User Authentication
    * Allow users to create accounts and log in.
    * Authenticated users can view their booking history and manage their profiles.
* Responsive Design
    * Ensure the website is responsive, allowing users to access and book villas from various devices.
* Security
    * Implement secure authentication and data validation to protect user information.

Technologies Used
- Front-end Framework: React - NextTs
- Back-end Framework: Node.js - Express
- Database: MongoDB
- Authentication: JWT
- Styling: CSS-in-JS
- Map Integration: Leaflet
- API Documentation: Swagger

## Run
Clone this repository
```
git clone https://github.com/henryanandsr/technical-assessment
cd technical-assessment
```
### Using yarn or npm
Install Dependencies for both client and server and run it
```
cd client/villa-reservation-client
yarn install
yarn run build
yarn run start

cd server
yarn install
yarn run build
yarn run start
```

### Using docker
```
docker-compose up
```

## Live Demo
You can view a live demo of the project at [Live Demo](https://technical-assessment-eta.vercel.app).

## API Documentation
You can view API Documentation at [API Documentation](https://technical-assessment-production.up.railway.app/api-docs/)
