# User Registration Form

This is a simple web app to take inputs from user and save their data to db but 
if a user tries to register more than thrice from same IP, a captcha should be presented for each subsequent request.
you can find working example [here](https://registrationform.z22.web.core.windows.net/).
It uses nodejs with express framework backed by mongodb for storing data.

## Getting Started

There are two ways you can run this project on your local system,
1. With node and local mongodb server

   `git clone https://github.com/devnrj07/user-registration-1.git`

    `cd server`

     `npm install`

     `npm start`
     
2. With Docker 

    `git clone https://github.com/devnrj07/user-registration-1.git`

    `cd server`

    `docker-compose up`

## Running the tests

cd into the directory after cloning and type

`npm test`


## How to try it (locally)?

Open client/index.html with a live-server(ex. vs-code live-server) and this will fire up a browser tab or open it yourself http://localhost:{port}

```
GET /api/captcha/status -> track the ips and get the status for rendering captcha

POST /api/users/verify -> hit the google recaptcha server with client side generated token.

POST /api/users/add -> JSON data to inserted to the test_user collection.


```

## Built With

* [Express](https://www.npmjs.com/package/express) - the popular web framework
* [Mongoose](https://www.npmjs.com/package/mongoose) - popular MongoDB object modeling tool
* [Joi](https://hapi.dev/) - for server-side validation
* [Lodash](https://lodash.com/) - for seamless object manipulation
* [bcrypt](https://www.npmjs.com/package/bcrypt) - for # the password
* [axios](https://www.npmjs.com/package/axios) - for making http requests 
* [dotenv](https://www.npmjs.com/package/dotenv) - for managing secrets
* [request-ip](https://www.npmjs.com/package/request-ip) - for getting client network info.

## Authors

* **devnrj07** - *portfolio* - [mywebsite]()

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


