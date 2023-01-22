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
 - sqlite3
 - dotenv-cli
 - nodemon

## Getting Started (Local Testing)

To run locally, clone the repository, navigate into the root of the repository and run the command **"sh setup.sh"** to install the dependencies and create a .env file in the backend folder. It will be empty, you must add the following lines into the .env and fill them with the desired variables.

 - PORT=</port number/>
 - DB_FILE=</Desired database location/>
 - JWT_SECRET=</generate a strong secret/>
 - JWT_EXPIRES_IN=</How long untill the JWT (JSON Web Token) Should expire (in Milliseconds) />
 - SCHEMA=</custom_schema_name/>

Then navigate into the backend directory and run **"sh reset-db.sh"** to load the demo data. Next run **"npm start"** to start the backend database. Finally open a second terminal and navigate to the frontend directory and run **"npm start"** again to start up the frontend server, which can be accessed at the url **"http://localhost:</portNumber/>"**.

You will now be able to run the server anytime you run **"npm start"** in the backend folder and open a second terminal and run **"npm start"** in the frontend.

## Features

 - Sign Up/Log In

## To Do
