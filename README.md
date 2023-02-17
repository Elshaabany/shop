# Description
A RESTful API shop backend project using Node.js and express.


### Project features

- pagination
- password hashing using [bcrypt](https://www.npmjs.com/package/bcrypt)
- Authentication and Authorization using [JWT](https://www.npmjs.com/package/jsonwebtoken)
- input validation using [express-validator](https://www.npmjs.com/package/express-validator)
- send mails using [sendgrid](https://sendgrid.com) and [nodemailer](https://www.npmjs.com/package/nodemailer)

### Project roles

  This project has three roles: Unregistered user, Registered user and Admin

  - **Unregistered user**
  1. get all products
  2. get specific product data

  - **Registered user**
  1. do what unregistered users can do
  2. CRUD on their cart
  3. CRUD on their orders

  - **Admin**
  1. do what registered users can do
  2. CRUD on their products
  3. get and change the status for any order

To login as Admin use these credentials
```
{
    "email": "admin@mail.com",
    "password": "Admin_1234"
}
```

To test this application I used [Postman](https://www.postman.com/)

## How to use

- import ["*shop.postman_collection.json*"](https://drive.google.com/file/d/1X17gFI5OWK_NIQJU2pirxcnxkX5_VHy3/view?usp=sharing) from the project's root directory to Postman
- signup or sign in

    ![image](https://user-images.githubusercontent.com/29892175/191251138-2f33ddfa-a669-4d96-8745-26d043503346.png)
- copy the returned token from the response

     ![image](https://user-images.githubusercontent.com/29892175/191236658-1a47c611-d09e-43de-a01c-964da270b1a9.png)
- paste it on the logged user variable

     ![image](https://user-images.githubusercontent.com/29892175/191237207-f5344239-50cf-4271-ae68-9929a748e27b.png)
- make sure to send the request body with valid data if the request has a body

    ![image](https://user-images.githubusercontent.com/29892175/191247091-0c658707-4b63-42fa-83b0-adfda41ffaba.png)

- make sure to send request params or query string values with valid data if the request requires them

    ![image](https://user-images.githubusercontent.com/29892175/191235093-4924b27f-7b30-4d15-8f66-f0a08b01a2b8.png)


## How to run
```git clone https://github.com/Elshaabany/shop.git```

```cd shop```

```npm install```

create .env file at the project's root directory.
insert these variables with your values on the .env file.
```
MongodbURI=;insert your mongo URI
JWT_Secret=;insert your JWT Secret of choice
sendGrid_api_key=;insert your send grid api key
senderMail=;insert your verified send grid mail
```
```npm start```
