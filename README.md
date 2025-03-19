Crowdcube is a crowdfunding web application that allows users to create, manage, and donate to fundraising campaigns. The app is built using React (Frontend), Node.js/Express (Backend), MongoDB (Database), and Firebase Authentication.
Authentication (Firebase)
Login & Register 
Users can register using email & password.
Login functionality includes email/password and Google authentication.
Firebase Authentication manages user authentication state.
Protected Routes 
Users must log in to access "Add Campaign", "My Campaigns", and "My Donations".
Private Routes ensure that only logged-in users can access these pages.
Logout 
Users can log out, which removes access to private features.
Home Page (/)
Default Landing Page 
Displays total campaigns, total funds raised, and active campaigns.
Features a carousel slider for recent campaigns.
Contains extra sections encouraging users to create or join campaigns.
Campaign Management
All Campaigns (/campaigns)
Displays all available campaigns from the database.
Users can sort campaigns by "Minimum Donation Amount" (ascending/descending).
Each campaign has a "View Details" button.
Campaign Details (/campaigns/:id)
Displays detailed campaign information (title, goal, min donation, deadline, etc.).
Allows users to donate to the campaign.
Shows all donations made for the campaign.
Add Campaign (/add-campaign)
Users can create a new campaign after logging in.
Campaigns are stored in MongoDB with userEmail for ownership verification.
My Campaigns (/my-campaigns)
Displays only the campaigns created by the logged-in user.
Users can edit or delete their campaigns.
My Donations (/my-donations)
Displays a list of all donations made by the logged-in user.
Backend API (Express & MongoDB)
Authentication is managed by Firebase.
CRUD Operations for Campaigns: 
POST /api/campaigns → Create a new campaign.
GET /api/campaigns → Fetch all campaigns.
GET /api/campaigns/:id → Fetch campaign details.
PATCH /api/campaigns/:id → Update campaign (Only creator can edit).
DELETE /api/campaigns/:id → Delete campaign (Only creator can delete).
Donation Functionality: 
POST /api/campaigns/:id/donate → Add a donation.
GET /api/donations/:email → Fetch all donations by a user.
User-specific campaign filtering: 
GET /api/campaigns/user/:email → Fetch campaigns owned by a user.
UI/UX Enhancements
Responsive Design using Tailwind CSS.
Navigation Bar: 
Shows Login & Register when logged out.
Shows Add Campaign, My Campaigns, My Donations, and Logout when logged in.
User Icon displays the user’s name and profile image.
Footer: 
Included on all pages (except 404).
Contains Home, All Campaigns, About, and Contact links.
Error Handling & Alerts: 
Toastify notifications for errors & successes.
SweetAlert for user-friendly messages.
Extra Functionalities
404 Page (Not Found) 
Redirects users if they try to access an invalid route.
Campaign Sorting 
Users can sort campaigns by Minimum Donation Amount.
Google Authentication 
Users can log in via Google in addition to email/password.
Running Campaigns Section 
Shows active campaigns (where the deadline hasn’t passed yet).

