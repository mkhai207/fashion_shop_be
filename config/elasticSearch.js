require("dotenv").config();
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
  auth: process.env.ELASTICSEARCH_USERNAME
    ? {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      }
    : undefined,
});

module.exports = client;
