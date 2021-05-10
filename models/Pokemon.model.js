const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pokemonSchema = new Schema(
  {
    name: { type: String, required: true },
    sprite: { type: String, required: true },
  },
  { versionKey: false }
)

const Pokemon = mongoose.model('Pokemon', pokemonSchema)

module.exports = Pokemon
