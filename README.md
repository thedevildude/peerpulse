# PeerPulse Backend

Welcome to the PeerPulse backend repository! This repository contains the backend codebase for the PeerPulse social media platform. PeerPulse is a blend of Web2 and Web3 aiming to provide a seamless and engaging social media experience for college students.

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

## Features

- **User Authentication**: Secure user authentication using JSON Web Tokens (JWT).
- **Dynamic Routing**: Navigation using React Router for smooth and efficient page transitions.
- **Error Handling**: Comprehensive error handling with Sentry for efficient issue detection and debugging.
- **Form Handling**: Form validation and submission using React Hook Form with Zod schema validation.
- **Media Upload**: Ability to upload media files such as images and videos.

## Getting Started

To get started with the PeerPulse frontend development environment, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Open-Tech-Devs/peerpulse.git
   ```

2. Install dependencies:

   ```bash
   cd peerpulse
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```dotenv
    TEST_DATABASE_URL=
    DATABASE_NAME=
    DATABASE_PASSWORD=
    LOCAL_DATABASE_URL=
    SMTP_HOST=
    SMTP_PORT=
    SMTP_USERNAME=
    SMTP_PASSWORD=
    SMTP_SENDER=
    JWT_SECRET=

    # Azure Blob Storage
    SAS_URL=
    SAS_TOKEN=
    ACCOUNT_NAME=""
    CONTAINER_NAME=""
   ```

4. Set up a local PostgreSQL database and run the migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:

   ```bash
    npm run serve
   ```

6. Open your browser and navigate to `http://localhost:5000` to start the server.

## Contributing

We welcome contributions from the community! To contribute to PeerPulse, please follow these guidelines:

- Fork the repository and create a new branch for your feature or fix.
- Make your changes and ensure that the codebase passes linting and tests.
- Please write clear and concise commit messages and PR descriptions.
- Refrain yourself from creating PRs without an associated issue for bug fixes or features.

By contributing to this project, you agree to abide by the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support Us

If you find PeerPulse useful, consider supporting us by:

- Making a donation to help fund the project's development.
- Spreading the word and sharing PeerPulse with others in your network.

Your support is greatly appreciated!

---

**© 2024 Open Tech Devs**
