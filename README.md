# SeriesInsight

## How to Run the Code

1. **Open a new terminal** and navigate to the server folder:
    ```sh
    cd server
    ```

2. **Start the server** by typing:
    ```sh
    npm start
    ```

3. **Access the application** by opening the following URL in your web browser:
    [http://localhost:12012/](http://localhost:12012/)

## Configuration Note

In the `mail.js` file, you need to add your own email and password. Here is an example:

```javascript
let mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "yourmail@gmail.com",    // Your email
        pass: "dijg sofk eotk ekkr",   // Generated app password
    },
});
```

- You need to create an "app password" with your email for this to work, here's a guide on how you can do it:

https://support.google.com/accounts/answer/185833
