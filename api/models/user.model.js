const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validations = require('../utils/validations');

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    minlength: [3, 'Mínimo 3 caracteres'],
    maxlength: [10, 'Máximo 10 caracteres'],
    lowercase: true,
    match: [/^[a-z0-9]+$/, 'Solo letras minúsuculas o números, sin espacios'],
    unique: true, 
  },
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: [3, 'Mínimo 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    match: [/^\S+@\S+\.\S+$/, 'Por favor, introduce un email válido']
  },
  password: {
    type: String,
    required: [true, 'Por favor, establece una contraseña'],
    trim: true,
    minlength: [8, 'Mínimo 8 caracteres']
  }, 
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria']
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    }
  },
  imageUrl: {
    type: String,
    validate: {
      validator: validations.isValidUrl,
      message: 'La url de la imagen no es válida'
    }
    //TODO: default img
  },
  privacy: {
    type: Boolean,
    default: false,
    required: true,
    validate: {
      validator: validations.isAccepted,
      message: 'Tienes que aceptar la política de privacidad para crear tu cuenta'
    }
  },
  points: {
    type: Number,
    default: 5
  },
  confirm: {
    type: Boolean,
    default: process.env.USER_CONFIRMATION_REQUIRED === 'false'
  }
}, { 
  timestamps: true,
  toJSON: { //intercepts and manipulates the response in json format
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.confirm;
      delete ret.privacy;
      return ret;
    }
  }
});

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10)
      .then(salt => {
        return bcrypt.hash(this.password, salt)
          .then(hash => {
            this.password = hash;
            next();
          })
      })
      .catch(error => next(error));
  } else {
    next();
  }
});

userSchema.index({ location: '2dsphere' });

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual("favs", {
  ref: "Fav",
  localField: "_id",
  foreignField: "user",
  justOne: false
});

userSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "user",
  justOne: false
});

userSchema.virtual("visits", {
  ref: "Visit",
  localField: "_id",
  foreignField: "user",
  justOne: false
});

const User = mongoose.model('User', userSchema);
module.exports = User;