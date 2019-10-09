# ReachFive NodeJS Sandbox

## Requirements

 * Yarn

## Install

Clone this repository from Github

    git clone git@github.com:ReachFive/reachfive-sandbox-nodejs.git
    cd reachfive-sandbox-nodejs

Install dependencies

    yarn

## Configure

1. Copy `.env.example` to `.env`.
2. Open `.env`, and set the values for the following parameters, available from your ReachFive console tenant account:

    * `REACHFIVE_DOMAIN` (_Settings_).
    * `REACHFIVE_JWT`: _HS256_ or _RS256_.
    * `REACHFIVE_CLIENT_ID` (_Settings_ > _Clients_).
    * `REACHFIVE_CLIENT_SECRET` (_Settings_ > _Clients_).

3. In the ReachFive console, set these URLs for your _First-party Identity_ client:

    * **Allowed Origins (CORS)**: `http://localhost:3000`
    * **Allowed Callback URLs**: `http://localhost:3000/login/callback`

4. Create a `public.pem` file containing the RSA public key available in the ReachFive account settings.

## Run

    yarn start

Navigate to `http://localhost:3000` and enjoy the sandbox.

## Author

[ReachFive](https://reachfive.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
