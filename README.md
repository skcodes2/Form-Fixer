# Form Fixer

**Form Fixer** is an AI-powered fitness companion mobile app built with Expo and React Native. It helps users create, track, and optimize workout routines, access video tutorials, plan meals, and even perform pose estimation using a custom TensorFlow Lite model.

---

## Table of Contents

* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Running the App](#running-the-app)
* [Project Structure](#project-structure)
* [Key Modules](#key-modules)

  * [Fetchers (API Clients)](#fetchers-api-clients)
  * [App Tabs & Screens](#app-tabs--screens)
  * [Workout Plan Module](#workout-plan-module)
  * [Onboarding Flow](#onboarding-flow)
  * [Pose Estimation](#pose-estimation)
  * [Context Providers](#context-providers)
* [Building & Deployment](#building--deployment)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## Features

* **User Authentication**: Secure signup, login, and password recovery flows
* **Onboarding**: Multi-step onboarding to customize user preferences
* **Workout Plans**: Create, modify, and track routines with detailed exercise data
* **Pose Estimation**: Real-time pose detection using a TensorFlow Lite model
* **Video Tutorials**: In-app video playback for exercise demonstrations
* **Meal Planning**: Integrate with Spoonacular API to fetch recipes and nutrition data
* **Global Theming**: Consistent styling via React Context

---

## Prerequisites

* **Node.js** v16 or higher
* **Yarn** or **npm**
* **Expo CLI** (`npm install -g expo-cli`)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/form-fixer.git
   cd form-fixer
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

---

## Configuration

1. Create a copy of the example environment file:

   ```bash
   cp app/.env.example app/.env
   ```

2. Populate the following variables in `app/.env`:

   ```dotenv
   EXPO_PUBLIC_HOST="http://localhost:3000"
   SPOONACULAR_API_KEY="your_spoonacular_api_key"
   ```

---

## Running the App

Start the Expo development server:

```bash
npx expo start
```

You can then run the app on:

* Android emulator
* iOS simulator
* Expo Go (Android/iOS)

---

## Project Structure

```
├── .gitignore
├── babel.config.js
├── eas.json
├── metro.config.js
├── tsconfig.json
├── build_instructions.txt
├── package.json
├── Fetchers/         # API client modules
├── app/              # Main application code
│   ├── (tabs)/       # Bottom tab screens
│   ├── WorkoutPlan/  # Plan & Routine classes and components
│   ├── hooks/        # React contexts and hooks
│   ├── onboarding/   # Onboarding flow screens
│   └── ...
├── assets/           # Fonts & images
└── types/            # TypeScript interfaces
```

---

## Key Modules

### Fetchers (API Clients)

* `Fetchers/Auth` – wrappers for authenticated requests (`GET`, `POST`, `PUT`, `DELETE`)
* `Fetchers/NoAuth` – wrappers for public endpoints

### App Tabs & Screens

* **Home** – Dashboard and activity overview
* **MealPlan** – Recipe browsing and nutrition tracking
* **WorkoutPlan** – Manage workout routines and exercises
* **Video** – Exercise demos and tutorials
* **Settings** – Account settings and preferences

### Workout Plan Module

Located in `app/WorkoutPlan`, this module provides:

* `ExerciseData.ts` – Static exercise definitions
* `Plan.ts` – `Plan` class managing multiple `Routine` instances
* Components for listing and updating exercises

### Onboarding Flow

Multi-step onboarding in `app/onboarding`:

1. Profile picture upload
2. Select help preferences
3. Customize interests
4. Gender selection

### Pose Estimation

* `poseModel.tflite` – TensorFlow Lite model for real-time pose detection
* Integrated in the Camera screen under `(tabs)/Video.tsx`

### Context Providers

* **GlobalStyleContext** – Centralized theming (colors, fonts, sizes)
* **UserContext** – Authentication state and user data
* **WorkoutPlanContext** – In-memory state for the current workout plan

---

## Building & Deployment

Follow `build_instructions.txt` for generating production-ready binaries.

Example for Android (EAS):

```bash
eas build -p android
```

Then convert the `.aab` to `.apks` and extract the `.apk`:

1. Generate a keystore
2. Run `bundletool` to build universal APKs
3. Extract and distribute

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "Add awesome feature"`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

Please follow the existing code style and include meaningful commit messages.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

