/* eslint-disable no-console */
import moment from 'moment';

import Settings from './Settings';

const LOG_LEVELS = {
  error: 5,
  warn: 4,
  debug: 3,
  info: 2,
  trace: 1,
  none: 0,
};

const canLog = level => LOG_LEVELS[Settings.logLevel] && LOG_LEVELS[level] >= LOG_LEVELS[Settings.logLevel];

const log = (alias, method, logLevel, ...args) => {
  console[method](`${logLevel} [${moment().format()}] ${alias} -`, ...args);
};

export default class Logger {
  constructor(alias) {
    this.alias = alias;
  }

  debug = (...args) => canLog('debug') && log(this.alias, 'log', 'DEBUG', ...args);
  error = (...args) => canLog('error') && log(this.alias, 'error', 'ERROR', ...args);
  info = (...args) => canLog('info') && log(this.alias, 'info', 'INFO', ...args);
  trace = (...args) => canLog('trace') && log(this.alias, 'log', 'TRACE', ...args);
  warn = (...args) => canLog('warn') && log(this.alias, 'warn', 'WARN', ...args);
}
