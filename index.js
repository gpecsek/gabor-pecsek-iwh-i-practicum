const express = require("express");
const axios = require("axios");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// Set up the headers for the API calls
const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json"
};

// API base URL
const BASE_URL = "https://api.hubapi.com/crm/v3/objects";

// Fetch and display Video Game Custom Object
app.get("/", async (req, res) => {
  const customObject = `${BASE_URL}/2-142915099?properties=name,publisher,price`;
  try {
    const resp = await axios.get(customObject, { headers });
    const data = resp.data.results;

    // Sort the data by name in ascending order
    const sortedData = data.sort((a, b) => {
      const nameA = a.properties.name.toLowerCase();
      const nameB = b.properties.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    res.render("homepage", { title: "Custom Object | HubSpot APIs", data });
  } catch (error) {
    console.error(error);
  }
});

// Render the form to create a new custom object
app.get("/update-cobj", async (req, res) => {
  res.render("updates", { title: "Update Custom Object Form | Integrating With HubSpot I Practicum" });
});

// Handle the form submission to create a new custom object and redirect to the homepage
app.post("/update-cobj", async (req, res) => {
  const { name, publisher, price } = req.body;
  const customObject = `${BASE_URL}/2-142915099`;
  const data = {
    properties: {
      name,
      publisher,
      price
    }
  };
  try {
    await axios.post(customObject, data, { headers });
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
