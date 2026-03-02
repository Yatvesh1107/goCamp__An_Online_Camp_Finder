# 🏕️ goCamp

goCamp is a full-stack web application inspired by Yelp. It allows users to discover, create, and review campgrounds. The app integrates user authentication, image uploads, and map-based location services.

## 🚀 Features

- User authentication and authorization
- Create, edit, and delete campgrounds
- Upload campground images using Cloudinary
- View campgrounds on an interactive map using Mapbox
- Leave reviews on campgrounds
- Responsive EJS templating
- Flash messages for user feedback
- Clean and organized UI

## 🛠️ Tech Stack

- **Frontend:** EJS, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Image Storage:** Cloudinary
- **Map Services:** Mapbox
- **Authentication:** Passport.js (Local Strategy)
- **Other Tools:** Express-session, connect-flash, method-override

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/a4cd4a97-9593-458f-9ce9-37b2db0ffc30)

![image](https://github.com/user-attachments/assets/7466db65-01ff-4c21-aa13-322ff4d13eea)

![image](https://github.com/user-attachments/assets/2a3d97e1-37f6-41ab-a591-ad271eabacbb)

![image](https://github.com/user-attachments/assets/8ae5928b-d78a-4e2b-b8c4-3b856c1d0312)

![image](https://github.com/user-attachments/assets/b1e6df1d-4c44-4656-8faf-c79f0f368123)

![image](https://github.com/user-attachments/assets/6193fea2-131e-4274-a6fe-bbe3f47b73b3)


## 🔧 Setup Instructions

### 1. Clone the Repository

``` bash
git clone https://github.com/NikhilMali77/goCamp---An-Online-Camp-finder.git
cd goCamp
```

### 2. Install Dependencies

<pre><code>npm install
</code></pre>

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add the following:

```bash
DATABASE_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAPBOX_TOKEN=your_mapbox_token
SESSION_SECRET=your_secret_key
```

### 4. Run the App

<pre><code>npm start
</code></pre>

Go to: `http://localhost:3000`

> Ensure you add the required `.env` variables to the platform's config.


### 🙌 Made with ❤️ by Nikhil Mali & Truptesh Tare
