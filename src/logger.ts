import winston, { Logger } from 'winston';
import {
  ElasticsearchTransformer,
  ElasticsearchTransport,
  LogData,
  TransformedData,
} from 'winston-elasticsearch';

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
};

export const winstonLogger = (
  elasticsearchNode: string,
  name: string,
  level: string
): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true,
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false,
      },
    },
  };
  const esTransportElasticSearch = new ElasticsearchTransport(
    options.elasticsearch
  );
  const esTrasportConsole = new winston.transports.Console(options.console);

  const logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [esTrasportConsole, esTransportElasticSearch],
  });
  return logger;
};
