export const runWithTools = async (ai, model, options, config) => {
  const response = await ai.run(model, options, config);
  return response;
};

export const createD1SchemaTool = {
  name: "createD1Schema",
  description: "Create a new schema in D1 instance",
  parameters: {
    type: "object",
    properties: {
      schemaName: {
        type: "string",
        description: "The name of the schema to create",
      },
      columns: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the column",
            },
            type: {
              type: "string",
              description: "The data type of the column",
            },
          },
          required: ["name", "type"],
        },
        description: "The columns of the schema",
      },
    },
    required: ["schemaName", "columns"],
  },
  function: async ({ schemaName, columns }, env) => {
    const columnDefinitions = columns
      .map((col) => `${col.name} ${col.type}`)
      .join(", ");
    const query = `CREATE TABLE ${schemaName} (${columnDefinitions})`;
    await env.MY_D1_DATABASE.prepare(query).run();
    return `Schema ${schemaName} created successfully.`;
  },
};

export const getWeatherTool = {
  name: "getWeather",
  description: "Return the weather for a latitude and longitude",
  parameters: {
    type: "object",
    properties: {
      latitude: {
        type: "string",
        description: "The latitude for the given location",
      },
      longitude: {
        type: "string",
        description: "The longitude for the given location",
      },
    },
    required: ["latitude", "longitude"],
  },
  function: async ({ latitude, longitude }, env) => {
    const url = `https://api.weatherapi.com/v1/current.json?key=${env.WEATHERAPI_TOKEN}&q=${latitude},${longitude}`;
    const res = await fetch(url).then((res) => res.json());
    return JSON.stringify(res);
  },
};

export const getD1SchemaInfoTool = {
  name: "getD1SchemaInfo",
  description: "Retrieve INFORMATION_SCHEMA on all tables within the D1 instance",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  function: async (_, env) => {
    const query = `SELECT * FROM INFORMATION_SCHEMA.TABLES`;
    const { results } = await env.MY_D1_DATABASE.prepare(query).all();
    return JSON.stringify(results);
  },
};
