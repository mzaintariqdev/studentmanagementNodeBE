# Student management Backend

This is a Node Expressjs Backend Project for Student Management system in which Authentication, Role level access, Email system and along with that proper Mongodb Aggregation is added.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/mzaintariqdev/studentmanagementNodeBE.git
    ```

2. Navigate to the project directory:

    ```bash
    cd your-project
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the development server:

    ```bash
    npm start
    ```
 This command will start the server using `nodemon` for automatic restarting.

use following command to generate a Jwt Secret key on windows

node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
