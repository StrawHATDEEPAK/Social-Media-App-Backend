# How To Deploy on local Server

First install the dependencies using- `npm install`<br>

## Setup the environment variables

Make a new file with name - `.env`<br> Copy the contents of the .env.exmaple file and paste it in `.env` and the fill the following details: <br>

`PORT, MONGO_URI, JWT_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, GMAIL, GMAIL_PASSWORD, GMAIL_HELP, GMAIL_HELP_PASSWORD, TWITTER_API_KEY, ACCESS_TOKEN, ACCESS_TOKEN_SECRET`<br>

**PORT**- PORT is the port number of the backend server.<br>
**MONGO_URI**- It is the mongodb cluster uri.<br>
**JWT_KEY**- It is the jwt secret string used to encrypt the jwt.<br>
**CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET**- These are the cloudinary credentials. You can get them from `https://cloudinary.com`<br>
**GMAIL**- It is the GMAIL address of the sender. The GMAIL will be sent to users who signup using GMAIL for GMAIL verification.<br>
**GMAIL_PASSWORD**- It is the gmail app password of the sender GMAIL address. It is _NOT_ the password of the google account. You need to turn on two-factor authentication for the gmail account, then make a new app and then get the app password.<br>
**GMAIL_HELP**- It is the GMAIL address of the helpline. This is the GMAIL account which will be notified with airdrop requests.<br>
**GMAIL_HELP_PASSWORD**- It is the gmail app password of the helpline GMAIL address. It is _NOT_ the password of the google account. You need to turn on two-factor authentication for the gmail account, then make a new app and then get the app password.<br>
**TWITTER_API_KEY, ACCESS_TOKEN, ACCESS_TOKEN_SECRET**- These are the twitter credentials. You can get them from `https://developer.twitter.com`<br>

## Start the backend server

Now to start the backend server run the command- `npm start`. <br>Your backend will now run on the PORT specified in the .env file.<br>
