# MovieLens Data Explorer

This is a simple website that visualizes data from the MovieLens dataset. It tells a story about how movie recommendation systems work, from understanding the raw data to building and improving a prediction model.

## What's Inside?

The project is broken down into interactive chapters:

*   **Chapter 1: The Data**
    *   See what the MovieLens dataset looks like.
    *   Explore how many users and movies there are.
    *   Look at the distribution of ratings (how many 5-star vs 1-star reviews).

*   **Chapter 2: Baseline vs. Model**
    *   Compare a simple guess (Baseline) against a machine learning model.
    *   See which one predicts user ratings better.

*   **Chapter 3: Tuning the Model**
    *   Explore how changing different settings (hyperparameters) affects the model's accuracy.
    *   Interactive charts show the trade-offs between different configurations.

## How to Run It

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```

3.  **Open your browser:**
    Visit [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Technologies Used

*   **Next.js** (for the website structure)
*   **Recharts** (for the charts and graphs)
*   **Tailwind CSS** (for styling)
