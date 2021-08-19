const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  
  console.log("routeKey:" + event.routeKey);

  try {
    switch (event.routeKey) {
      case "DELETE /prosjekter/{id}":
        await dynamo
          .delete({
            TableName: "prosjekter",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Slettet prosjekt med id ${event.pathParameters.id}`;
        break;
      case "GET /prosjekter/{id}":
        body = await dynamo
          .get({
            TableName: "prosjekter",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
          body = body.Item;
        break;
      case "GET /prosjekter":
        body = await dynamo.scan({ TableName: "prosjekter" }).promise();
        body = body.Items;
        break;
      case "PUT /prosjekter":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "prosjekter",
            Item: {
              id: requestJSON.id,
              prosjekt: requestJSON.prosjekt,
              beskrivelse: requestJSON.beskrivelse,
              kunde: requestJSON.kunde,
              teknologi: requestJSON.teknologi
            }
          })
          .promise();
        body = `Lagt til/ oppdatert prosjekt med id: ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Ugyldig Rute: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
