# 小鹤双拼练习 (Xiaohe Shuangpin Practice)

This is a web-based typing practice tool designed to help users improve their speed and accuracy with the Xiaohe Shuangpin input method.

## Features

- **Multiple Practice Modes**: Choose from targeted key drills, single character practice, or phrase/poem practice.
- **Real-time Feedback**: Instantaneous WPM and accuracy tracking.
- **Post-session Analysis**: Get a summary of your performance, including a list of characters you struggled with ("stuck points").
- **Minimalist UI**: A clean, modern interface with automatic light and dark mode.
- **Rich Content**: Practice with a vast collection of classical Chinese poetry.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation & Running

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the project directory**:
    ```bash
    cd typing-practice
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Prepare Practice Data**:
    This one-time command consolidates all the poetry text into a single file for the app to use.
    ```bash
    npm run prepare:data
    ```
5.  **Start the development server**:
    ```bash
    npm run dev
    ```
6.  Open your browser and navigate to the URL provided (usually `http://localhost:5173`).

Enjoy your practice!
