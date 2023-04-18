require('dotenv').config();

const express = require('express');
const logger = require('morgan'); //shows http requests in the terminal
const createError = require('http-errors');

/* Load configuration */
require('./config/db.config');

const app = express();

app.use(logger('dev')); //morgan's middleware 


/* Error handling */
app.use((req, res, next) => next(createError(404, 'Route not found')));

app.use((error, req, res, next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    error = createError(400, error); //reassigns the value of error
  } else if (error instanceof mongoose.Error.CastError && error.path === '_id') {
    const resourceName = error.model().constructor.modelName;
    error = createError(404, `${resourceName} not found`);
  } else if(!error.status) {
    error = createError(500, error);
  }

  console.error(error);

  const data = {
    message: error.message
  }

  if (error.errors) {
    const errors = Object.keys(error.errors) //each key is the name of the field with validation errors
      .reduce((errors, errorKey) => { //(accumulator, currentValue) - currentValue: key
        errors[errorKey] = error.errors[errorKey].message;
        return errors;
      }, {});
      data.errors = errors;
  }

  res.status(error.status).json(data);
})

/* Port */
const port = process.env.PORT || '3001';
app.listen(port, () => console.info(`Application running at port ${port} 🐻🥦`));