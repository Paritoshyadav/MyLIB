const mongoose = require('mongoose')
const coverImageBasePath = 'uploads/bookcovers'
const Path = require('path')

const bookSchema =  new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        
    },
    publishDate:{
        type: Date,
        required:true


    },
    pageCount:{
        type: Number,
        required:true
    },
    createdAt:{
        type: Date,
        required:true,
        default:Date.now
    },
    CoverImageName:{
        type: String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Author'
    }


})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.CoverImageName !=null){
        return Path.join('/', coverImageBasePath,this.CoverImageName)
    }
})

module.exports = mongoose.model('Book',bookSchema)  
module.exports.coverImageBasePath = coverImageBasePath