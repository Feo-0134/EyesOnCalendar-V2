var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var daySchema = new Schema({
  day: Number,
  workType: {
    type: String,
    enum: ["W", "WE", "V", "PH", "T", "oc", "OC", "DV","MS","NS"]
  },
  workDay: {
    type: Number,
    enum: [0, 1, 2, 3]
  }
});

var personSchema = new Schema({
  id: {
    type: String,
    unique: true,
    dropDups: true
  },
  name: String,
  region: String,
  days: [daySchema]
});

var monthSchema = new Schema({
  year: Number,
  month: Number,
  people: [personSchema],
  section: String
});

monthSchema.index({ year: 1, month: 1}, { unique: true });
// monthSchema.index({ month: 1, "people.id": 1 }, { unique: true });
module.exports = {
  Month: mongoose.model("Month", monthSchema),
  Person: mongoose.model("Person", personSchema)
};
