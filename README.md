This task was very good for me because I used hooks very little before, so I like tasks that are based more on logic, especially backend systems. Building the backend was very easy for me. I wrote the code in a production-ready style.

In this project, I created action-based authentication and used Nodemailer because sending OTPs to teachers through email is a practical approach. There was one issue: any user could register in the system. To solve this, I implemented a teacher secret code system so students could not register and their data would not be stored in the database.

In the second route, I created a content route and also added a verify-video route. In this route, I checked the user role so only the principal could approve content. If the principal rejected the content, they had to provide a reason.

For Cloudinary, I used a buffer function to upload and save the URL. I also defined the file size using Cloudinary methods. When the page loads for the first time and the video is loading, I used the Cloudinary poster feature for better performance and preview handling.

For video watching, I used a slug-based system. Overall, the backend part was almost completely easy for me.

On the frontend side, I had to think more about how to structure things. I decided to keep the UI simple and clean. I used a service-based architecture where all API fetching is handled inside service files. Then, inside hooks, I stored and managed all content data. I also implemented role-based routing so users are redirected to the correct dashboard depending on whether they are a principal or a teacher.

I used Context API so user data could be accessed across all pages. Redux could also have been used for global state management, but I felt it would make the project unnecessarily complex for this case.

The dashboard counting system is currently based on the data length. Another approach could have been using the backend count method for better optimization.

For video watching, I kept it open-source/public so anyone can watch the content. I also used skeleton loaders with 5 placeholder boxes using arrays in a simple way.

I tried to keep the project professional and scalable.

For the email setup, I created a principal login because the default role in the database is set to teacher. Only the developer or I can change the role directly from the database because it is connected to my DB.

Principal:
test123@gmail.com

Teacher:
test456@gmail.com 

School Secret Code:
school@123

This project follows a clean and scalable architecture similar to the assignment requirements in the Technical Assignment document.

⚠️ One important issue currently is that on Vercel, video uploads above around 4.4MB–4.8MB cause errors because of serverless function request limits. Even though the uploaded video is ultimately stored in Cloudinary, the file still passes through the Vercel server first. To properly support large video uploads, I would need to implement a direct Cloudinary upload approach using Cloudinary upload APIs/docs instead of routing large files through the Vercel backend. Otherwise, uploading videos larger than 5MB will result in an error.

Live Website:
https://gurb-pac-xi.vercel.app/

GitHub Repository:
https://github.com/AmarJeetSharma6802/gurbPac


LinkedIn Profile:
Amarjeet Sharma LinkedIn