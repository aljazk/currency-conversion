# currency-conversion

Converts amounts between any supported currency pair.<br>
Conversion rates can be provided from https://exchangeratesapi.io/ (environment variable "exchange-rates-api") or from hardcoded values (environment variable "demo")

# Environment variables

PORT: Port that application will listen to (Default: 3000).

### Conversion rates source

CONVERSION_RATES_SOURCE: Defines source of conversion rates (demo, exchange-rates-api).
API_KEY: If "exchange-rates-api" CONVERSION_RATES_SOURCE is used, API_KEY is needed.

### Database

DATABASE_URI: URI for mongodb (e.g. mongodb://localhost:27017/)
DATABASE_NAME: Name of the database, that conversion calculations history will get stored to (Default: currency-conversion).
DATABASE_COLLECTION_NAME: Name of collection, that conversion calculations history will get stored to (Default: conversion-history).

# Swagger

Swagger is running on /docs endpoint

# Commands

All commands are in package.json. Run with npm run <command-name><br>
"start": "npm run build && node dist/index.js", // Starts the service<br>
"dev": "ts-node-dev src/index.ts", // Starts the service in dev/watch mode<br>
"build": "tsc -p tsconfig.build.json", // Builds javascript<br>
"test": "jest", // Runs tests<br>
"docker": "docker build -t currency-conversion-backend .", // Builds docker image<br>
"swagger": "tsoa spec" // Builds swagger.json<br>
