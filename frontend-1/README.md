# Frontend Stock Analysis Application

This project is a frontend application for visualizing stock data. It allows users to select a stock from a dropdown menu, view its candlestick chart, and see the 45-day moving average overlay along with the trend analysis.

## Project Structure

- **public/index.html**: The main HTML file that serves as the entry point for the application.
- **src/index.js**: The entry point for the React application, rendering the `App` component.
- **src/App.js**: The main application component that manages the state and renders the UI components.
- **src/api.js**: Contains functions to interact with the backend API for fetching stock data and shortlisted stocks.
- **src/components/Dropdown.js**: A component for selecting a stock from the list of shortlisted stocks.
- **src/components/CandlestickChart.js**: A component that renders the candlestick chart for the selected stock.
- **src/components/MAOverlay.js**: A component that overlays the 45-day moving average on the candlestick chart.
- **src/components/TrendTag.js**: A component that displays the trend (rising or falling) with a color tag.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```
   cd frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Usage

- Use the dropdown to select a stock from the shortlisted stocks.
- The candlestick chart will display the selected stock's data.
- The 45-day moving average will be overlaid in blue on the chart.
- The trend (rising or falling) will be displayed with a color tag.

## Dependencies

- React
- Charting library (e.g., Chart.js or similar)
- Axios for API requests

## License

This project is licensed under the MIT License.