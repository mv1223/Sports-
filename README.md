# Sports Registration System

A modern, responsive web application for sports user registration with sign in/sign up functionality and profile management.

## Features

### 🔐 Authentication
- **Sign Up**: Create new accounts with sports-specific details
- **Sign In**: Secure login with email and password
- **Sign Out**: Safe logout functionality

### 👤 User Profile Management
- **Essential Sports Details**: Age, primary sport, experience level
- **Contact Information**: Email, phone number, location
- **Personal Bio**: Custom user description
- **Profile Editing**: Update all user information anytime

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Beautiful Interface**: Modern gradient design with smooth animations
- **User-Friendly**: Intuitive navigation and form validation
- **Real-time Feedback**: Success/error notifications

### 💾 Data Persistence
- **Local Storage**: Data persists between browser sessions
- **No Backend Required**: Fully client-side application
- **Secure**: Password protection and data validation

## Sports Information Collected

The system collects the following essential details for sports users:

### Required Fields
- **Name**: First and last name
- **Email**: Unique email address for login
- **Password**: Secure password (minimum 6 characters)
- **Age**: Must be between 13-100 years
- **Primary Sport**: Football, Basketball, Tennis, Swimming, Running, Cricket, Badminton, Volleyball, or Other
- **Experience Level**: Beginner, Intermediate, Advanced, or Professional

### Optional Fields
- **Phone Number**: Contact information
- **Location**: City and country
- **Bio**: Personal description and interests

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for development server)

### Installation

1. **Clone or Download** the project files to your local machine

2. **Navigate** to the project directory:
   ```bash
   cd sports-registration-system
   ```

3. **Install Dependencies** (optional):
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Simple File Opening
1. Open `index.html` directly in your web browser
2. The application will work immediately with all features

#### Option 2: Local Development Server (Recommended)
1. **Start the development server**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

2. **Open your browser** and navigate to `http://localhost:3000`

## Usage Guide

### For New Users

1. **Sign Up**:
   - Click "Sign Up" button
   - Fill in all required fields
   - Select your primary sport and experience level
   - Add optional contact information and bio
   - Click "Create Account"

2. **Sign In**:
   - Use your email and password to sign in
   - Access your personalized dashboard

### For Existing Users

1. **View Profile**:
   - After signing in, see your complete profile
   - All information is displayed in an organized dashboard

2. **Edit Profile**:
   - Click "Edit Profile" button
   - Modify any information you want to change
   - Click "Update Profile" to save changes
   - Click "Cancel" to discard changes

3. **Sign Out**:
   - Click "Sign Out" to securely log out
   - Return to the welcome screen

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and form structure
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **Local Storage**: Client-side data persistence
- **Font Awesome**: Icons for better UX

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Structure
```
sports-registration-system/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── package.json        # Project configuration
└── README.md          # This file
```

## Customization

### Adding New Sports
To add new sports to the dropdown:
1. Open `index.html`
2. Find the sport `<select>` elements
3. Add new `<option>` tags with sport names

### Styling Changes
- Modify `styles.css` for visual customization
- Colors, fonts, and layout can be easily adjusted
- Responsive breakpoints can be modified

### Functionality Extensions
- Add new user fields in the HTML forms
- Update validation in `script.js`
- Extend the user object structure as needed

## Security Notes

- **Passwords**: Currently stored in plain text in localStorage (for demo purposes)
- **Production Use**: Implement proper password hashing and server-side authentication
- **Data Privacy**: Consider GDPR compliance for real applications

## Sample Data

The application includes sample users for testing:
- **Email**: john@example.com, **Password**: password123
- **Email**: jane@example.com, **Password**: password123

To enable sample data, uncomment the last line in `script.js`.

## Troubleshooting

### Common Issues

1. **Forms not submitting**: Check that all required fields are filled
2. **Sign in not working**: Verify email and password are correct
3. **Data not saving**: Ensure localStorage is enabled in your browser
4. **Styling issues**: Clear browser cache and reload

### Browser Console
- Open browser developer tools (F12)
- Check the Console tab for any JavaScript errors
- Most issues will be logged there

## Future Enhancements

Potential improvements for future versions:
- Server-side authentication and database storage
- Password reset functionality
- Email verification
- Social media login integration
- Advanced user search and filtering
- Event management features
- Team formation capabilities

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Ensure all files are properly downloaded and accessible

---

**Enjoy using the Sports Registration System!** 🏃‍♂️⚽🏀🎾
