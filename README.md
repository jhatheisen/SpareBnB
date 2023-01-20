# SpareBnB

![homepage](https://user-images.githubusercontent.com/106848904/213801860-edde9800-ae0e-4c6c-b368-598f115c20c5.png)
![detailspage](https://user-images.githubusercontent.com/106848904/213801899-8f814c03-d12f-472e-a8ec-6818eb11df58.png)


## Live Website
https://sparebnb.onrender.com/

## Summary

This project is a demonstration of my understanding on how to develop a frontend professional website with **react**, as well as my ability to develop endpoints for the **backend** of a website. Showing my knowlege of database management and manipulation through a **live API**.

## Languages Used
The frontend of this project was built with **react, redux, html, and css**

The backend of this project was built with **JavaScript** and uses **sqlite3** for  local testing of the database, and **PostgreSQL** for the live API.

## Dependencies

All dependencies must be installed into the backend directory of this project, all these dependencies were installed in Ubuntu's command line using **"npm install </dependency/>"**...

 - cookie-parser
 - cors
 - csurf
 - dotenv
 - express
 - express-async-errors
 - helmet
 - jsonwebtoken
 - morgan
 - per-env
 - sequelize@6
 - sequelize-cli@6
 - pg

These dependencies were installed as dev-dependencies using **"npm install -D </dependency/>"**...

 - sqlite3
 - dotenv-cli
 - nodemon

## Getting Started (Local Testing)

To run locally, open your CLI (Command Line Interface) and navigate into the backend directory. Install all of the dependencies in the previous section. Create a **".env"** file and fill it with all of the following variables...

 - PORT= </port number/>
 - DB_FILE= </Desired database location/>
 - JWT_SECRET= </generate a strong secret/>
 - JWT_EXPIRES_IN= </How long untill the JWT (JSON Web Token) Should expire (in Milliseconds) />
 - SCHEMA= </custom_schema_name/>

Finally run **"npm start"** to start up the server, which can be accessed at the url **"http://localhost:</portNumber/>"**.

To access the database directly use the command **"sqlite3 directory/databaseFile.db"**.

## Features

 - Sign Up/Log In

## To Do
