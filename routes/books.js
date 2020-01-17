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
    
    
    
    
    
    try{
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
        
        
    }catch{
        // if(book.CoverImageName != null){
        //     removeBookCover(book.CoverImageName)
        // }
        
        renderNewpage(res,book,true)
    }
    
        
    })






    /////////////////////ID//////////////////

    router.get('/:id',async (req,res)=>{
        try{
          const book = await Book.findById(req.params.id).populate('author').exec()
          res.render('books/show',{book:book})

        }catch{
            res.render('/')

        }
    })


    router.get('/:id/edit', async (req,res)=>{
        try{
            const book = await Book.findById(req.params.id)
            
            renderEditpage(res,book)
            
            
        }catch{
            res.redirect('/')

        }
        
        
        
    })


    router.put('/:id',  async (req,res)=>{
       let book

       try{
           book = await Book.findById(req.params.id)
           book.title = req.body.title
           book.author = req.body.author
           book.publishDate = new Date(req.body.publishDate)
           book.pageCount = req.body.pageCount
           book.description = req.body.description
           if(req.body.cover != null && req.body.cover !== ''){
               saveCover(book,req.body.cover)
           }
           await book.save()
           res.redirect(`books/${newBook.id}`)

       }catch{
           if (book !=null){
               renderEditpage(res,book,true)
           } else{
               res.redirect('/')
           }

       }
    })
    

    router.delete('/:id', async (req,res)=>{
        let book
        try{
            book = await Book.findById(req.params.id)
            await book.remove()
            res.redirect('/books')

        }catch(err){
            console.log(err);
            
            if(book != null){
                res.render('books/show',{
                    book:book,
                    errormsg:'could not remove book'
                })
            }else{
                res.redirect('/')
            }

        }


    })

    





    
    
    
    
    
    
    
    
    
    /////////////functions/////////////////////
    
    async function renderNewpage(res,book,hasError=false){
        renderFormpage(res,book,'new',hasError)

    }

    function saveCover(book,encodedCover){
        
        try{
            if(encodedCover ==  null) return
        const cover =  JSON.parse(encodedCover)
        
        if(cover != null && imageMimeTypes.includes(cover.type)){
            book.CoverImage = new Buffer.from(cover.data,'base64')
            book.coverImagetype = cover.type
        }

    }catch{
        console.log("Error creating book");
        


        }

        }
        
    async function renderEditpage(res,book,form,hasError=false){
        renderFormpage(res,book,'edit',hasError)

    }


    async function renderFormpage(res,book,form,hasError=false){
        try{
            const authors = await Author.find({})
        
        const params ={
            authors:authors,
            book:book
        }
        if (hasError){
            if(form === 'edit'){
                params.errormsg ="Error Updating book" 
            }else{
                params.errormsg ="Error Creating book"

            }
        }
        res.render(`books/${form}`,params)
        
    }
        
        catch{
            res.redirect('/')
            
        }
    }



    // function removeBookCover(fileName){
    //     fs.unlink(path.join(uploadPath,fileName),err=>{
    //         if (err) Console.error(err)
    //     })

    // }
   

module.exports=router