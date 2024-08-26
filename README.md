# currency-conversion

This repository includes:

- backend service (express)
- frontend service (angular)
- mongodb (optional)

To run this app locally run docker_build.ps1 and after docker_run.ps1

Redirection of backend calls from frontend to backend is configured in nginx.conf<br>
Environment variables are configured in docker-compose.yml<br>
To fetch exchanges rates from https://exchangeratesapi.io/, uncomment environment variables in docker-compose.yml and add your api_key:

      # CONVERSION_RATES_SOURCE: exchange-rates-api
      # API_KEY: <your_api_key>

For more configuration options look at backend\Readme.md
