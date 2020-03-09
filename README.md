# ReachFive NodeJS Sandbox

## Requirements

 * Node

## Install

Clone this repository from Github

    git clone git@github.com:ReachFive/reachfive-sandbox-nodejs.git
    cd reachfive-sandbox-nodejs

Install dependencies

    npm install

## Configure

Copy `.env.example` to `.env` and replace the values for `REACHFIVE_DOMAIN`, `REACHFIVE_JWT`,`REACHFIVE_CLIENT_ID`, and `REACHFIVE_CLIENT_SECRET`.

`REACHFIVE_DOMAIN` is available in your ReachFive account settings.

Create a `public.pem` file with your public RSA key available in your ReachFive account settings.

To acquire `REACHFIVE_CLIENT_ID`, and `REACHFIVE_CLIENT_SECRET` credentials, you need to create a new Identity API Client in "Clients" section.
To make it works correctly, you also have to add the following values in the client settings:
 * `http://localhost:3000` in **Allowed Origins**
 * `http://localhost:3000/login/callback` in **Allowed Callback URLs**

## Run

    npm start

You can now see the app running at `http://localhost:3000`.

## Author

[ReachFive](https://reachfive.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
