import axios from "axios";

const API_URL = "https://openlibrary.org/";

export const fetchBooksByTitle = async (query: string) => {
  const response = await axios.get(
    `${API_URL}search.json?q=${query}+&limit=10`
  );
  return response.data;
};
