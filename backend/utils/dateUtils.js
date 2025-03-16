const moment = require('moment-timezone');

const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss', timezone = 'UTC') => {
  return moment(date).tz(timezone).format(format);
};

const addDays = (date, days) => {
  return moment(date).add(days, 'days').toDate();
};

const isFutureDate = (date) => {
  return moment(date).isAfter(moment());
};

module.exports = { formatDate, addDays, isFutureDate };