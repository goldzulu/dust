import bodyParser from "body-parser";
import express from "express";

import { createConnectorAPIHandler } from "@connectors/api/createConnector";
import { deleteConnectorAPIHandler } from "@connectors/api/deleteConnector";
import { resumeConnectorAPIHandler } from "@connectors/api/resumeConnector";
import { stopConnectorAPIHandler } from "@connectors/api/stopConnector";
import logger from "@connectors/logger/logger";
import { authMiddleware } from "@connectors/middleware/auth";

import { getConnectorAPIHandler } from "./api/getConnector";
import { syncConnectorAPIHandler } from "./api/syncConnector";
import { webhookSlackAPIHandler } from "./api/webhooks/webhookSlack";

export function startServer(port: number) {
  const app = express();

  app.use(authMiddleware);
  app.use(bodyParser.json());

  app.post("/connectors/create/:connector_provider", createConnectorAPIHandler);
  app.post("/connectors/stop/:connector_id", stopConnectorAPIHandler);
  app.post("/connectors/resume/:connector_id", resumeConnectorAPIHandler);
  app.delete("/connectors/delete/:connector_id", deleteConnectorAPIHandler);
  app.get("/connectors/:connector_id", getConnectorAPIHandler);
  app.post("/connectors/sync/:connector_id", syncConnectorAPIHandler);

  app.post("/webhooks/:webhook_secret/slack", webhookSlackAPIHandler);

  app.listen(port, () => {
    logger.info(`Connectors API listening on port ${port}`);
  });
}
