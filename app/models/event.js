const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schgema
const eventSchema = new Schema({
    name: String,
    slug: {
        type: String,
        unique: true
    },
    description: String
});

//middleware 
// make sure that the slug is created from name
eventSchema.pre('save', function(next){
    this.slug = slugify(this.name);
    next();
})

//create the model
const eventModel = mongoose.model('Event', eventSchema)

//export the model
module.exports = eventModel;

//function to slugify
function slugify(text){
    return text.toString().toLowerCase()
        .replace(/\s+/g, '')       // Replaces spaces with -
        .replace(/[^\w\-]+/g, '')  //Remove all non-wod chars
        .replace(/\-\-+/g, '-')    // Replace multiple - with single -
        .replace(/^-+/, '')        // Trim - from start of next
        .replace(/-+$/, '');       // Trim - from end of text
}