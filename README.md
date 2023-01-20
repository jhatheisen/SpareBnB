# SpareBnB

![homepage](https://user-images.githubusercontent.com/106848904/213801860-edde9800-ae0e-4c6c-b368-598f115c20c5.png)
![image_2023-01-20_130412475](https://user-images.githubusercontent.com/106848904/213804882-9692cef2-c60b-4424-8578-41bebe5b947d.png)


## Live Website
https://sparebnb.onrender.com/

## Summary

This project is a demonstration of my understanding on how to develop a **frontend** professional website with **React**, as well as my ability to develop endpoints for the **backend** of a website. Showing my knowlege of database management and manipulation through a **live API**.

## Technologies Used

The frontend of this project was built with **React, Redux, and Css**.

Icons were sourced from **FontAwesome** and the fonts were sourced from **Google Fonts**.

The backend of this project was built with **JavaScript** and uses **sqlite3** for  local testing of the database, and **PostgreSQL** for the live API.

## Backend Dependencies

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
