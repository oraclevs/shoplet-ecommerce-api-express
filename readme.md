# Shoplet E-commerce API
## Built with TypeScript and Express, Nodejs, with both User and Admin features.

## Instruction on how to set up this api
1. Make sure you have node installed.
2. Create a .env file in the src folder and configure with this variables
 ```ts
 PORT = your port number,
MONGO_DB_CONNECTION_URI = your database connection URI,
JWT_SECRET_KEY = Secured JWT secret key

NODEMAILER_USERNAME = Your preferred username(email address)
NODEMAILER_PASSWORD = the password
IPSTACK_API_KEY = your IP stack API secret key
ACCESS_TOKEN_EXPIRE_TIME = "Any time you want in seconds"
REFRESH_TOKEN_EXPIRE_TIME = "Any time you want in seconds"
CLOUDINARY_SECRET_KEY = Cloudinary secret key
CLOUDINARY_API_KEY = Cloudinary public key
CLOUDINARY_CLOUD_NAME = Cloudinary name
STRIPE_API_KEY= Stripe API key
STRIPE_WEBHOOK_SECRET = stripe webhook secret for notification
```

3. Install all the required packages and run the appication
```ts
npm install
npm run dev
```
4. When ready for production, build the application with the command to get you javascript compilation of your application
```ts
npm run build
```

# Feel free to point out any problem or features that the api may need THANKS.


