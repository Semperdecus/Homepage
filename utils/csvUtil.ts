import Papa from "papaparse";

export const fetchAndParseCsv: any = async (filePath: string) => {
  try {
    // Fetch the CSV file
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error("Failed to fetch CSV file");
    }

    const csvData = await response.text();

    // Clean the CSV data: remove trailing semicolons and ensure proper row separation
    const cleanedCsv = csvData
      .split("\n") // Split by lines
      .filter((line) => line.trim() !== "") // Remove empty lines
      .map((line) => line.trim().replace(/;+$/, "")) // Remove trailing semicolons
      .map((line) => line.replace(/"""/g, "\"")) // Fix extra quotes
      .join("\n"); // Rejoin the cleaned lines

    // Parse the cleaned CSV using PapaParse
    return new Promise((resolve, reject) => {
      Papa.parse(cleanedCsv, {
        header: true,          // Treat the first row as header
        skipEmptyLines: true, // Skip empty lines
        dynamicTyping: true,  // Auto-type conversion (e.g. string to number)
        quoteChar: '"',       // Handle quoted fields correctly
        delimiter: ",",       // Specify the delimiter
        newline: "\n",        // Ensure the newline character is correctly handled
        complete: (results) => {
          resolve(results.data); // Resolve the parsed data
        },
        error: (error) => {
          reject(new Error("PapaParse Error: " + error.message)); // Reject on error
        },
      });
    });
  } catch (error) {
    console.error("Error fetching or parsing CSV file:", error);
    throw error;
  }
};
