This repository will contain my coursework for my web development course at Norhteastern University (CS 4550/CS5610).

Stack
=====

As per the course requirements, this site will be built using a MEAN stack. Bootstrap is used for much of the CSS, and the app itself is hosted on Heroku.

Heroku is set up with the following add-ons: mLab MongoDB, PaperTrail


Release Process
===============

This github repository is linked up with the Heroku app, and any changes pushed up to the **Master** branch will be auto-built-and-deployed to Heroku.

Upon being ready for grading, commits tagged with 'assignmentX', where X is the assignment number, will indicate the commit to test.

General development will be done under a **development** branch, and then later merged into master. Particular assignment work will be done under a **feature/assignmentX** branch, and then merged into master.


Running Locally
===============

In order to run the app locally, first clone the code from master onto your desktop. Open up a command prompt and run:

```
git clone https://github.com/aolgin/olgin-adam-webdev.git [destination]
```

Then, navigate to it and install the necessary node modules:

```
cd olgin-adam-webdev
npm install
```

Start up a MongoDB instance using the CLI. Note that this may require you to have a **/data/db** directory at the root of your filesystem:

```
mongod
```

Open up another command prompt and start the node server:

```
node server.js    # using node
nodemon server.js # or using nodemon (for auto-updating based on code changes)
```

Open up a web browser to **localhost:3000**, and the app should open up to the desired front page.


