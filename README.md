# Holydays

Holydays is a tool designed to maximize your uninterrupted time off work within a specified timeframe.

## How It Works

By inputting the number of scheduled vacation days and a designated time window, Holydays calculates the optimal arrangement to yield the highest ratio of days off to scheduled days off.

The algorithm assumes a standard work schedule without weekends. It combines available public national holidays within your country (inferred by your browser's locale settings) to optimize your time off.

For instance, if you're seeking 10 days off between Jan 1st and March 31st, Holydays will identify the optimal vacation period. In this scenario, it will suggest scheduling from Jan 2nd to Jan 11th, leveraging Jan 1st as a holiday along with the preceding weekend, resulting in a sequence of 13 uninterrupted days off.

## Accessing the Project

You can interact with Holydays in various ways:

- **Production URL**: Access the live application at [Holydays - Live](https://get-holydays.vercel.app/)
- **Locally with Docker**: Use Docker Compose to run the application with `docker compose up`.
- **Locally without Docker**: Install the necessary dependencies specified in the `package.json`. Ensure compatibility with the Node.js version specified in the package.json engines.

### Testing the Project

#### Unit Tests

This project uses Vitest for unit testing. You can run the test suites of the project by running `npm run test` on the command line. For informations on topics such as debugging and IDE integrations you can use the official [Vitest Guide](https://vitest.dev/guide/).

## Feedback and Support

For feedback, issues, or assistance, please create an issue or reach out via [email](mailto:joaombn97@gmail.com).
