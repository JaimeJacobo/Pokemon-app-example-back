const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: { type: String, required: true },
    pokedex: [{ type: Schema.Types.ObjectId, ref: 'Pokemon' }],
  },
  { versionKey: false }
)

const User = mongoose.model('User', userSchema)

module.exports = User
