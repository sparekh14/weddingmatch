async function getMatches(data) {
  try {
    // Assuming 'data' might be used to pass query parameters or a request body
    // For a GET request, data would typically be used for query parameters
    const queryParams = new URLSearchParams(data).toString();
    const response = await fetch(`/api/matches?${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to get matches:", error);
    // Depending on how you want to handle errors, you might re-throw,
    // return a specific error object, or return null/undefined.
    throw error; 
  }
}

export { getMatches }; 