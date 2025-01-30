# RNGenius - Your cooperative decision-making app

## Overview

RNGenius is an app designed for decision-making, enabling users to create random option generators, prioritize choices, collaborate with others, and manage their decision-making process effectively. It is built using a React Native front-end and a Java Spring Boot back-end, integrating JWT token rotation for security and providing a scalable architecture for future growth.

## Features

- **Create a new generator**: Users can easily create new decision-making generators.
- **Create a new category & option**: Users can categorize and organize their options (e.g., movie genres, meal types).
- **Generate random options**: The app selects random options from the available choices to assist in decision-making.
- **Delete options and generators**: Users can delete irrelevant or outdated options and generators to keep their lists organized.
- **Exclude options**: Users can temporarily exclude options from the selection process without permanently removing them.
- **Prioritize options**: Users can assign weight to options, enabling more control and personalized decision-making.
- **Invite friends to a generator**: A social feature allowing users to invite others to collaborate in generating decisions.
- **Manage participant rights**: Users can control the permissions of participants (view-only, edit, admin rights).
- **Cross-platform generator access**: Generators are accessible across devices, allowing seamless transitions between platforms.
- **Category prioritization/exclusion**: Users can prioritize or exclude whole categories of options to streamline their decision-making process.
- **Notification badge for new generations**: Users are notified of new generated decisions, improving engagement and real-time updates.
- **QR-code-based invitations**: A modern feature for quickly sharing a generator via QR codes.

## Technology Stack

### Front-End
- **React Native** (+ Expo)  
  - **Native Components**: Provides reusable components and improves the overall user experience.
  - **Lightweight and Efficient**: The app is designed for high performance with minimal resource usage.
  - **Team Expertise**: The team has strong experience with React, ensuring effective state management and rapid development cycles.
  - **Testability**: Expo makes it easy to test and deploy the app using QR codes or mobile emulation.

### Back-End
- **Java Spring Boot** (with JWT token rotation)
  - **Custom Business Logic**: Full control over features like user management and role-based access control (RBAC).
  - **JWT Token Rotation**: Ensures secure and scalable authentication with regularly refreshed tokens.
  - **PostgreSQL**: A relational database that supports complex features such as linking generators to users and tracking results.
  - **Scalability**: Spring Boot provides a robust API structure that can easily scale as the app grows and new features are added.
  - **Testability**: The back-end is thoroughly tested to ensure reliable business logic implementation.

## Development and Maintenance Costs
- **Fast Development**: The use of React Native and Expo speeds up development, allowing for a quick launch.
- **Single Codebase**: The app uses one codebase that can be deployed to both iOS and Android platforms, the backend itself is hosted on a single Azure server.
- **Scalability**: The app’s architecture is scalable, ensuring that future enhancements and maintenance are manageable.

---

Feel free to contribute, suggest improvements, or report issues in the project's repository.
