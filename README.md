# Ugenity #

## To get started: ##
- Run the following commands:
    - npm install
    - node app.js

- Open your browser and navigate to [http://localhost:3000/](http://localhost:3000/) and
  [http://localhost:3000/users](http://localhost:3000/users)
    - The app adds two users each time you run it, so your Users collection might end up filling up nicely if you run
      it a few times.  If you want, you can have it add more users by looking at the bottom of app.js and seeing where
      it saves the users to the database.
    - Only the first 30 users will appear on screen; to get the next ones, try
      [http://localhost:3000/users?page=2](http://localhost:3000/users?page=2)

- If you want to look at app_1_justExpress.js, that's a version of the app without mongoose, and is essentially just a
  simplified version that just uses express and a single jade template under views\index.jade.  It's about as simple an
  example as one could come up with for express; everything between the "configure app" and "end of configure app"
  comments can be ignored for now, they're the bare-bones setup for getting the express app running.



## Behind the scenes ##

This is a really thin app that essentially brings together the components we were looking for:

- **[express](http://expressjs.com/)**   
  A fully featured quick-and-easy tool to build and run restful services

- **[mongoose](http://mongoosejs.com/)**   
  There are a few MongoDB object database managers out there, but I just went with Mongoose because it met all of our
  needs, is very stable, has a lot of backers, and supports nice-to-have features such as validation and object schemas.

To this list, I thought I'd add the following:

- **[mocha](http://visionmedia.github.io/mocha/)**   
  A fast, easy-to-use headless unit test framework that is descriptive and readable, and more intuitive and easier
  to use than other javascript test frameworks.

- **[should](https://github.com/visionmedia/should.js/)**   
  A readable assertion framework to be used alongside any test framework that allows assertions to be written in a
  human-readable format

And a couple others that aren't as important right now, and we may very well not need at all:

- **[less-middleware](https://github.com/emberfeather/less.js-middleware)**   
  An on-the-fly [LESS](http://lesscss.org/) compiler that makes our css needs very simple

- **[jade](http://jade-lang.com/)**   
  A template library for HTML that has a few nice features, but I'm not terribly attached to
