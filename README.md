# README #

Make sure that you have nodejs v8 installed on your laptop

## Setup Guide ##

### First Setup ###
1. clone this repository
2. If you don't have gulp, run **npm -g install gulp**
3. If you don't have bower, run **npm -g install bower**
4. go to project folder, run **npm install**
5. still at the project folder, run **bower install** 

## Build Environment Config ##
gulp build-config --env=[development/staging/production]

## Running a development server ##
Once you have gulp all ready to go you can start developing.
To do this you just need to start a local development server

### Start a development server ###
To start a development server just type.
```
#!nodejs
gulp serve

### Run eslint CLI ###
To run eslint checker
#!nodejs
node_modules/eslint/bin/eslint.js src/app
```
This should automatically open up a browser window with the template running.

## Creating a production build ##

### Running a production server ###
Before you run a production build you can test your production files first by running a local production server.
Just run the command
```
#!nodejs
gulp serve:dist
```
The local server that runs will now be running a built version of your site.

### Running a production build ###
Once you are happy with your site you can initiate a build that will create a copy of the template that you can FTP to your web server.
Just run the command
```
#!nodejs
gulp build --config=[staging/production]
```
This will initiate a build, once it has finished you will find your built files in a folder called dist that will have been created for you.


## Development Guide ##
make your own branch to develop, based on master branch
### Making Your Development Branch ###
* Make sure you're on master branch, by running
```
#!nodejs
git branch
```
* Make your development branch and change to that branch
```
#!nodejs
git checkout -b dev-indra
```
3. Now if you run the **git branch** again, you will see that you're on your own branch

### Pull Code ###
* To get updated code from master branch, run
```
#!nodejs
git pull origin master
```
* Enter your git password

### Push Code ###
* After you develop on your own branch, you can push to your remote branch using
```
#!nodejs
git push origin dev-indra
```
* Enter your git password
* Make pull request on bitbucket to master branch


## Template Documentation ##
to see the demo of the original template, go to
[Demo Template](http://ng.eastarcreative.com/demo)

to see the docs of the original template, go to
[Template Documentation](http://ng.eastarcreative.com/docs)# sicantik-ui
# sicantik-ui
