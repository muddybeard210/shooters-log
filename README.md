[![Stories in Ready](https://badge.waffle.io/gsmatth/shooters-log.png?label=ready&title=Ready)](https://waffle.io/gsmatth/shooters-log)

[![Throughput Graph](https://graphs.waffle.io/gsmatth/shooters-log/throughput.svg)](https://waffle.io/gsmatth/shooters-log/metrics/throughput)
#Shooters-Log RESTful API  

#Overview
* This RESTful API provides the necessary back-end infrastructure and functionality to create, read, update and delete data related to competitive shooting matches.  
* Currently, data for shooting matches is manually recorded after each shot during an event.  The score is typically recorded using a pencil and a paper document like the scorecard below.    

  ![scorecard750x580](https://cloud.githubusercontent.com/assets/13153982/16515546/69d733b0-3f27-11e6-9653-1148ff7f485a.png)


* After a match is completed, the recorded data is then manually transferred to other documents for later retrieval and analysis. This is a burdensome process that can be greatly reduced or eliminated through the adoption of automation.  Examples of other documents that are manually updated include the following:  
  - Aggregate Score Card.  This document or spreadsheet is created by the range master after an event when all the individual shooter score cards are handed in.  It lists all the match and aggregate scores for each shooter in a match.  This information is forwarded to the NRA, so that the NRA can track, and if necessary, change a shooters qualification level.  
  - Load Development Book.  This book contains very detailed information on the components  that make up a specific load.  It lists all the specific components of a load(primer, brass, bullet, powder) as well as very precise measurements (lengths, weights, environment, distance)
  - Round Count Book.  This book lists the number of rounds that have been fired through a specific barrel as well as a reference to the load for those rounds.  The load book provides the shooter with a means to track the life of a barrel. Once a barrel has exceeded its life, the barrel is less accurate and needs to be replaced.  
  - Detailed Data Card (image below). This is a more detailed version of the scorecard.  It includes called shot score values as well as clock values for both the actual and called shots.  It also contains  data related to the shooters rifle, ammunition, and match environment( barometric pressure, temperature, light direction, wind direction..)  

      ![plotsheet750x451](https://cloud.githubusercontent.com/assets/13153982/16572213/f8172d6a-421a-11e6-9458-cae56012a6f3.png)

*   This API provides a means to reduce the redundancy  for the shooter and the range master.  It provides an infrastructure and data persistence that can be easily consumed by applications (both client and web based) using the reliable and proven standards of a RESTful API. By providing this API and supporting infrastructure, we are encouraging developers to create applications that can provide value to the shooting community and a source of income for themselves.


****
#Current Version (0.7.0)
* The current version of this program is designed to create, read, update,  delete and return data that used to produce a scorecard for a National Rifle Association (NRA) Mid-Range High Power rifle match.  
* This API was designed to be extensible, so that multiple match types and scorecards/data-books can be supported in the future.

****
#Future Releases
* V 1.0.0 scheduled for 08/18/2016 will include the following enhancements:  
  - store and return  detailed data cards  
  - store and return load development books  
  - store and return round count books  
  - store and return aggregate score cards  

****

#Way to contribute
* Reporting Bugs: Open up an issue through this git repository and select "bug" as the label
* Recommending Enhancements: Open up an issue through this git repository and select "enhancement" as the label  
* Issues are reviewed weekly


*****
#Architecture

This API is structured on a Model View Controller(MVC) architecture pattern.  The base technologies are node.js server, node.http module, express middleware, and a mongo database. This architecture is currently deployed in a two tier environment(staging, production), leveraging the heroku platform.

Middleware:  
  * The express router middleware provides the base routing capability.  
  * A custom handle-errors module implements and extends the http-errors npm middleware package.  
  * An auth middleware module leverages two npm modules (bcrypt, jsonwebtoken) and the node.crypto module to provide user sign-up and user sign-in functionality as well as session authentication/authorization.  
  * The mongoose npm module is used for interaction with the mongo database  

![architecture5](https://cloud.githubusercontent.com/assets/13153982/16576405/e330cb62-4243-11e6-947d-6c44c2d131e3.png)

View:  Individual resources (user, match......) have dedicated router files located in the route folder. In addition to providing an interface to the complimentary controller files, these files also parse the json content in the incoming request (where applicable) and create and populate a req.body property using the npm package parse-body. For details about the input and output of routes, see the Routes section below.

Controller: Individual resources (user, match, load...) have dedicated controller files.  These files are the interface between the routers (view) and the model files and mongo database(model).  The controllers take in a request from a route and call the necessary functions to interact with the model.  They then return a response to the route once a request has been processed in the model:
  * model:  The controller files call the constructor methods in the "model" files to construct new resource objects in memory.
  * mongoose:  The controller files leverage the required mongoose client module to create new schemas in the mongo database and to execute CRUD operations on mongo documents. Currently supported resources include:  
      - user  
      - competition  
      - match  
      - shot  
      - rifle  
      - barrel  
      - load  

Model:  Individual resources (user, match...) have dedicated model files. These files provide the constructors and the mongoose schema creation syntax. For a detailed breakdown of models and the model properties, see the schema section below.  

****

#Schema
###MVP Schema Diagram  

###Currently Deployed Schema Diagram

![schema5](https://cloud.githubusercontent.com/assets/13153982/16572261/a1531c7c-421b-11e6-9016-8f9aba4abc42.png)


*****
#Routes
###POST /api/signup
Example: https://shooters-log-staging.heroapp.com/signup

Required Data:
* Provide username and password as JSON

This route will create a new user by providing a username and password in the body of the request.  Creating a new user is required to store and access data later.  This route must be completed before attempting to use the `api/signin` route.

A token will be returned that will only be used for the `api/signin` route.
after signing-in, you will receive a new token that will be a reference for all future routes.

Example response (token):
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFkMzY0MzZlNzNiMmI1MmNiYmNjZTQ2MWY5YTk1OGIwODYxZTZmYjIyMmUzMWU2MDNiNWJjNzQzMDBlYjA1NTEiLCJpYXQiOjE0NjY5NjY2NzR9.2xOVdorLQP-LtnmYCaRTX2V8enOTX-p3SJNF_8Gyoew`
  ```

###GET /api/signin

Example: https://shooters-log-staging.herokuapp.com/api/signin

Required Data:
* Authorization header
* Provide username and password as JSON

This route will require an authorization header that needs to include the `username:password` of the specific user to be authenticated.  Signing in will return a brand new token that will be used for future user ID reference.

Example response:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImE0N2Y4NjQ5MzY5ZGI3YjVhYjQxOWE3OWI2OTVmYzZiYzUwYjBkZWFlZTUzOTAzYTliZDFiYTM5ZjU4NDkyZTAiLCJpYXQiOjE0NjY5NjMzMDZ9.1jA6zUfTW8m19AUEPn0TburTTiJARUzuMh93Ver4Bq8
```

###GET /api/scorecard/:competitionID
Example:https://shooters-log-staging.herokuapp.com/api/scorecard/5775cdcd8023621100ee87f6

Required Data:
* CompetitionId parameter

This route will return a scorecard that contains a competition, the matches associated with that competition, and the shots for each of the matches.

* Authorization Header
  * `Bearer <response token from signin>`

A scorecard will be returned in JSON format once a user's token is verified.  The scorecard will contain a competition object, an array of "matches" containing match objects with a shared  competitionId, and an array of shots arrays.  Each shot array will contain individual shot data objects.

Example response("shots" truncated for brevity):
  ```
  {
    "competition": {
      "_id": "5775cdcd8023621100ee87f6",
      "location": "Rio Salado",
      "action": "BAT",
      "caliber": 308,
      "userId": "5775cd1b8023621100ee87f5",
      "__v": 0
    },
    "matches": [
      {
        "_id": "5775ce208023621100ee87f7",
        "matchNumber": 2,
        "targetNumber": 6,
        "distanceToTarget": 500,
        "relay": 1,
        "userId": "5775a9aa3f776111007d6b40",
        "competitionId": "5775cdcd8023621100ee87f6",
        "__v": 0
      },
      {
        "_id": "5775ce5c8023621100ee87f8",
        "matchNumber": 1,
        "targetNumber": 6,
        "distanceToTarget": 500,
        "relay": 1,
        "userId": "5775a9aa3f776111007d6b40",
        "competitionId": "5775cdcd8023621100ee87f6",
        "__v": 0
      },
      {
        "_id": "5775ce7c8023621100ee87f9",
        "matchNumber": 3,
        "targetNumber": 6,
        "distanceToTarget": 500,
        "relay": 1,
        "userId": "5775a9aa3f776111007d6b40",
        "competitionId": "5775cdcd8023621100ee87f6",
        "__v": 0
      }
    ],
    "shots": [
      [],
      [],
      [
        {
          "_id": "5775cf858023621100ee87fa",
          "userId": "5775cd1b8023621100ee87f5",
          "matchId": "5775ce7c8023621100ee87f9",
          "xValue": false,
          "score": "9",
          "__v": 0
        },
        {
          "_id": "5775cfa48023621100ee87fb",
          "userId": "5775cd1b8023621100ee87f5",
          "matchId": "5775ce7c8023621100ee87f9",
          "xValue": true,
          "score": "10",
          "__v": 0
        },
  ```


###GET /api/competition/:competitionId/matches
Example:https://shooters-log-staging.herokuapp.com/api/competition/5775cdcd8023621100ee87f6/matches

Required Data:
  * CompetitionId parameter

This route will return all matches that have the provided competitionId

  * Authorization Header
    * `Bearer <response token from signin>`

An array of matches will be returned in JSON format once a user's token is verified.  The individual match objects will contain the properties of a match. All matches will have the same values for properties with the exception of the "matchNumber" and the "_id" properties.

Example response:
  ```
    [
  {
    "_id": "5775ce208023621100ee87f7",
    "matchNumber": 2,
    "targetNumber": 6,
    "distanceToTarget": 500,
    "relay": 1,
    "userId": "5775a9aa3f776111007d6b40",
    "competitionId": "5775cdcd8023621100ee87f6",
    "__v": 0
  },
  {
    "_id": "5775ce5c8023621100ee87f8",
    "matchNumber": 1,
    "targetNumber": 6,
    "distanceToTarget": 500,
    "relay": 1,
    "userId": "5775a9aa3f776111007d6b40",
    "competitionId": "5775cdcd8023621100ee87f6",
    "__v": 0
  },
  {
    "_id": "5775ce7c8023621100ee87f9",
    "matchNumber": 3,
    "targetNumber": 6,
    "distanceToTarget": 500,
    "relay": 1,
    "userId": "5775a9aa3f776111007d6b40",
    "competitionId": "5775cdcd8023621100ee87f6",
    "__v": 0
  }
]
  ```

###POST /api/competition

example: https://shooters-log-staging.herokuapp.com/api/competition

Required data:

* Required in the body of request:
  * location: 'example location'
  * action: 'example action'
  * caliber: 'example caliber'
  * dateOf: 'example date' - this date does not have a specific format and is up to the user to pick how they want this data to be presented.

* Authorization:
  * needs to be done in the following way: `Bearer <response token from signin>`

This route will create a new competition that will include the location of the range and action that the shooter is using for the particular competition.  userId is required and is used to tie the user to the new competition.

Example response:
```
{
  "__v": 0,
  "location": "Rio Salado",
  "action": "BAT",
  "caliber": "308",
  "dateOf": "Nov 09, 2016"
  "userId": "5770305229a8f22e2e5cecb5",
  "_id": "5770307e29a8f22e2e5cecb6"
}
```

###GET /api/competition/:competitionID

Example: https://shooters-log-staging.herokuapp.com/api/competition/5770307e29a8f22e2e5cecb6

* Required in the query:
  * Specific competition id which is provided when you complete a post request to `api/competition`

* Authorization:
  * You will provide the same authorization token that is given when signing up originally.

This route will display the same data the is provided when creating a new competition to use a reference.

Example response:

```
{
  "_id": "5770307e29a8f22e2e5cecb6",
  "location": "Rio Salado",
  "action": "BAT",
  "userId": "5770305229a8f22e2e5cecb5",
  "__v": 0
}
```

###PUT /api/competition/:competitionID

Example: https://shooters-log-staging.herokuapp.com/api/competition/5770307e29a8f22e2e5cecb6

* Required in the body:
  * location: 'new location'
  * action: 'new action'
* Authorization
  * needs to be done in the following way: `Bearer <response token from signin>`
* Required in the query:
  * Specific competition id which is provided when you complete a post request to `api/competition`

This route will allow you to update the location and action being used for a specific competition.

Example response:
```
{
  "_id": "5770307e29a8f22e2e5cecb6",
  "location": "New Places",
  "action": "New Actions",
  "userId": "5770305229a8f22e2e5cecb5",
  "__v": 0
}
```

###Delete /api/competition/:competitionID

Example: https://shooters-log-staging.herokuapp.com/api/competition/5770307e29a8f22e2e5cecb6

* Required in the query:
  * Specific competition id which is provided when you complete a post request to `api/competition`

This route will allow you to delete specific competitions by their id.

Example response:
You will only receive a status code 204 when a successful deletion occurs.

###POST /api/competition/:competitionID/match

Example: https://shooters-log-staging.herokuapp.com/api/competition/577039ec29a8f22e2e5cecb7/match

* Required in the body:
  * matchNumber: 1 - Must be a number
  * targetNumber: 17 - Must be a number
  * distanceToTarget: 600 - Must be a number

* Authorization
  * needs to be done in the following way: `Bearer <response token from signin>`

This route will allow you to create new matches that correlate to specific competitions.

Example response:


****
#Testing

###Testing Framework
mocha test runner  
chai (expect)  
bluebird promise library  
eslint  
###Continuous Integration
travis-ci is integrated into this project through the use of the included .travis.yml file.  All pull requests initiated in git will launch travis, which in turn runs the included mocha tests and the eslint tests.  Pull requests are not merged until all travis-ci tests pass.
