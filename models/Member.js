var mongoose = require('mongoose');

var MemberSchema = new mongoose.Schema({
     name: String
   , email: String
   , social: {
      twitter: String,
      linkedin: String,
      blog: String
     }
   , type: String
   , description: {
      es: String,
      en: String
     }
   , img : {
      data: Buffer,
      contentType: String
   }
   // , editions: [EditionSchema]
});



exports.Member = mongoose.model('Members', MemberSchema);