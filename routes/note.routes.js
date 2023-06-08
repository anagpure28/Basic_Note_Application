const express = require("express")
const {NoteModel} = require("../models/note.model")
const {auth} = require("../middleware/auth.middleware")

const noteRouter = express.Router()

//Post
noteRouter.use(auth)
noteRouter.post("/create",async(req,res)=> {
    try {
        const note = new NoteModel(req.body)
        await note.save()
        res.json({msg: "New note has been added",note: req.body})
    } catch (err) {
        res.json({error: "Please Login first!!"})
    }
})

noteRouter.get("/",async(req,res)=> {
    try {
        const notes = await NoteModel.find({userID: req.body.userID})
        res.send(notes)
    } catch (err) {
        res.json({error: err.message})
    }
})

// Patch
noteRouter.patch("/update/:noteID",async(req,res)=> {
    // userID in the user doc === userId in the note doc
    const userIDinUserDoc = req.body.userID
    const {noteID} = req.params;
    try {
        const note = await NoteModel.findOne({_id: noteID})
        const userIDinNoteDoc = note.userID
        if(userIDinUserDoc===userIDinNoteDoc){
            await NoteModel.findByIdAndUpdate({_id: noteID},req.body)
            res.json({msg: `${note.title} had been updated`})
        }else{
            // console.log("userID in User Doc",userIDinUserDoc, "userId in Note Doc", userIDinNoteDoc)
            res.json({msg: "Not Authorized!!"})
        }
    } catch (err) {
        res.json({error: err})
    }
})

//Delete
noteRouter.delete("/delete/:noteID",async(req,res)=> {
     // userID in the user doc === userId in the note doc
     const userIDinUserDoc = req.body.userID
     const {noteID} = req.params;
     try {
         const note = await NoteModel.findOne({_id: noteID})
         const userIDinNoteDoc = note.userID
         if(userIDinUserDoc===userIDinNoteDoc){
             await NoteModel.findByIdAndDelete({_id: noteID},req.body)
             res.json({msg: `${note.title} had been deleted`})
         }else{
             // console.log("userID in User Doc",userIDinUserDoc, "userId in Note Doc", userIDinNoteDoc)
             res.json({msg: "Not Authorized!!"})
         }
     } catch (err) {
         res.json({error: err})
     }
})

module.exports = {
    noteRouter
}