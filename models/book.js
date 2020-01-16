const mongoose = require('mongoose')
// const coverImageBasePath = 'uploads/bookcovers'
// const Path = require('path')

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
    CoverImage:{
        type: Buffer,
        required:true
    },
    coverImagetype:{
        type:String,
        required:true

    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Author'
    }


})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.CoverImage !=null && this.coverImagetype != null){
        // return Path.join('/', coverImageBasePath,this.CoverImageName)
        return `data:${this.coverImagetype};charset=utf-8;base64,${this.CoverImage.toString('base64')}`
    }
})


module.exports = mongoose.model('Book',bookSchema)  
// module.exports.coverImageBasePath = coverImageBasePath