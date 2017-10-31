# ReachFive NodeJS Sandbox

## Requirements

 * Yarn

## Install

Clone this repository from Github

    git clone git@github.com:ReachFive/reachfive-sandbox-nodejs.git
    cd reachfive-sandbox-nodejs

Install dependencies

    yarn install

## Configure

Copy `.env.example` to `.env` and replace the values for `REACH5_DOMAIN`, `REACH5_CLIENT_ID`, and `REACH5_CLIENT_SECRET` with your ReachFive credentials.

Those values are available in your ReachFive account settings.

To work correctly, your also have to add the following values in your account settings:
 * `localhost` in **Allowed Origins**
 * `http://localhost:3000/login/callback` in **Allowed Callback URLs**

## Run

    yarn start

You can now see the app running at `http://localhost:3000`.

## Author

[ReachFive](https://reach5.co)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.