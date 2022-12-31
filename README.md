# Simple VRT Report
This script generates a simple visual regression testing report as an HTML document.

## How to Run
1. Clone the repository.
2. Install dependencies with `npm install`.
3. Confirm the images for each step to compare have the same file name and are a `.png` file type.
4. Add the images from the first execution to the `first-results` folder.
5. Add the images from the second execution to the `second-results` folder.
6. Run with `node index.js.`

This script will override the report.html file each time it is executed!
