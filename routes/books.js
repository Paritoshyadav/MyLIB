const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const path =require('path')
const fs = require('fs')
// const uploadPath = path.join('public',Book.coverImageBasePath)
const Author = require('../models/author')
// const multer=require('multer')
const imageMimeTypes =['image/jpeg','image/bmp','image/gif']
// const upload = multer({  Use multer pakage to upload data in sever
//     dest: uploadPath,
//     fileFilter: (req,file,callback) =>{
//         callback(null,imageMimeTypes.includes(file.mimetype))
//     }
// })

router.get('/',async(req,res)=>{
    let query = Book.find()
    if (req.query.title !=null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title,'i'))
    }
    if (req.query.publishedAfter !=null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    if (req.query.publishedBefore !=null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    try{
        const books = await query.exec()
        res.render('books/index',{
            books:books,
            searchOption: req.query
            
        })
    } catch{
        res.redirect('/')
    }

    })

router.get('/new',async(req,res)=>{
    renderNewpage(res,new Book())
    
})

router.post('/',  async (req,res)=>{
    // const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate:new Date(req.body.publishDate),
        pageCount:req.body.pageCount,
        description:req.body.description
    })
    saveCover(book,req.body.cover)
    
    console.log(await Book.find({}));
    
    
    
    try{
        const newBook = await book.save()
        res.redirect('books')
        
        
    }catch{
        // if(book.CoverImageName != null){
        //     removeBookCover(book.CoverImageName)
        // }
        
        renderNewpage(res,book,true)
    }
    
        
    })

    async function renderNewpage(res,book,hasError=false){
        try{
            const authors = await Author.find({})
        
        const params ={
            authors:authors,
            book:book
        }
        if (hasError) params.errormsg ="Error Creating book"
        res.render('books/new',params)
    }
        
        catch{
            res.redirect('/books')
            
        }
    }

    function saveCover(book,encodedCover){
        if(encodedCover ==  null) return
        const cover =  JSON.parse(encodedCover)
        if(cover != null && imageMimeTypes.includes(cover.type)){
            book.CoverImage = new Buffer.from(cover.data,'base64')
            book.coverImagetype = cover.type
        }

    }

    // function removeBookCover(fileName){
    //     fs.unlink(path.join(uploadPath,fileName),err=>{
    //         if (err) Console.error(err)
    //     })

    // }
   

module.exports=router