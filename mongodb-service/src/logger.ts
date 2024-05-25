import { logLevel } from 'kafkajs';
import pino from 'pino';

const transport = pino.transport({
  target: 'pino-pretty'
});

export const logger = pino(transport);

const toPinoLogLevel = (level: number) => {
  switch (level) {
    case logLevel.ERROR:
      return 'error';
    case logLevel.NOTHING:
      return 'error';
    case logLevel.WARN:
      return 'warn';
    case logLevel.INFO:
      return 'info';
    case logLevel.DEBUG:
      return 'debug';
    default:
      return 'info';
  }
};

export const PinoLogCreator = (logLevel: number) => {
  const pinoLevel = toPinoLogLevel(logLevel);

  return ({ level, log }: any) => {
    const { message, ...extra } = log;
    logger[pinoLevel]({
      level: toPinoLogLevel(level),
      message,
      extra
    });
  };
};
