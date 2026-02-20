# Simple Portfolio CMS (React + MongoDB)

This is now a simplified setup:
- Public portfolio pages
- One private admin route
- Admin login with password only
- Data stored in MongoDB

## 1) Configure env
Copy `.env.example` to `.env` and fill values:

- `MONGO_URI` your MongoDB connection string
- `ADMIN_PASSWORD` password for admin panel
- `JWT_SECRET` any strong random string
- `PORT` backend port (default 5000)
- `VITE_ADMIN_SLUG` hidden admin path (frontend route)
- `CLOUDINARY_CLOUD_NAME` Cloudinary cloud name
- `CLOUDINARY_API_KEY` Cloudinary API key
- `CLOUDINARY_API_SECRET` Cloudinary API secret

## 2) Install and run
```bash
npm install
npm run dev
```
This runs:
- backend: `http://localhost:5000`
- frontend: `http://localhost:5173`

## 3) Open app
- Public site: `http://localhost:5173`
- Admin login page: `http://localhost:5173/admin-login`
- Private admin URL: `http://localhost:5173/<VITE_ADMIN_SLUG>`

Flow:
1. Open `/admin-login`
2. Enter `ADMIN_PASSWORD`
3. You can edit profile/projects/skills/education/social links
4. You can upload avatar/resume/project media files from file pickers (URL fields auto-fill)
5. Click **Save All Changes**

## Notes
- Data is stored in MongoDB collection created by the app.
- No SQL/Supabase files are required anymore.
# Portfolio
