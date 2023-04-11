import express, { response } from "express";
import { createUser,getUserByName,updateUserPassword,createUserFiles,getAllFiles,getFilesById} from "./usersFunctions.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import multer from 'multer';


const router =express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


async function genHashedPassword(pwd){
    const NO_OF_ROUNDS = 10;
    const salt =await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedPassword =await bcrypt.hash(pwd,salt);
    return(salt,hashedPassword);
    
    }
    
   router.post('/cultureos/signup',async function (req, res) {
 
     const {user,pwd,email}= req.body;
    
    const hashedPassword = await genHashedPassword(pwd);
   
    try{
  const result = await createUser({_id:user,pwd:hashedPassword,email:email});
  //res.send(result);
  res.status(200).send({message:"Registration Successful"})
  
    }catch(ex){
      console.log("asgahsgah")
        if(ex.code===11000){
        res.status(400).send({message:"Username already exists "})
      }
        
     
    }
  
}

   )



  router.put('/cultureos/update-password/:_id',async function (req, res) {
    const {_id} = req.params;
    console.log(req.params,_id);
    const {pwd}= req.body;


   
   const hashedPassword = await genHashedPassword(pwd);
  
   try{
 const result = await updateUserPassword(_id,{pwd:hashedPassword});
 res.send(result);
   }catch(ex){
     console.log("asgahsgah"+ex)
       if(ex.code===11000){
       res.status(400).send({message:"Username already exists "})
     }
   }
 
})



   router.post('/cultureos/login',async function (req, res) {
 
    const {user,pwd}= req.body;

const userFromDb = await getUserByName(user);
console.log(userFromDb);
if(!userFromDb){
  res.status(401).send({message:"Invalid Credentials"})
} else{
 const storedPassword = userFromDb.pwd;
 const isPasswordMatch = await bcrypt.compare(pwd,storedPassword);
 console.log(isPasswordMatch);
 if(isPasswordMatch){
  const token = jwt.sign({id:userFromDb._id},process.env.SECRET_KEY)
console.log('hi',token)
  const decoded = jwt.verify(token, 'my_secret_key');
   console.log(decoded);
  res.send({message:"Login Successful",token:token,user:user})
 } else{
  res.status(401).send({message:"Invalid Credentials"})
 }
}
  })
 
  router.get('/cultureos/validateuser/:key',async function(req,res){
    console.log("hello")
    const {key} = req.params;
    console.log(key);
    const decoded = jwt.verify(key, 'my_secret_key');
    
    res.send({message:"Successful",user:decoded})
  })

  router.post('/cultureos/upload',upload.fields([{ name: 'pdf', maxCount: 1 }, { userId: 'userId', maxCount: 1 }]),async function (req, res) {
    const userId = req.body.userId;
    const pdfBuffer = req.files['pdf'][0].buffer;
    
    try{
    const result = await createUserFiles(userId,pdfBuffer);
    res.send(`PDF file uploaded with ID: ${result.insertedId}`);
    }catch(err){
      console.error(err);
      res.status(500).send('An error occurred while uploading the PDF file');
    }

  })
  router.get('/cultureos/files',async function (req, res) {
    
    console.log(req.query);
  
   const data = await getAllFiles(req)
      res.send(data)
    })

    router.get('/cultureos/files/:userId', async function (req, res) {
      const {userId} = req.params;
      console.log(req.params,userId);
      
      const files= await getFilesById(userId)
      
      files ? res.send(files) : res.status(400).send({msg : "no files"});
    })
 
  
  





         









     export const usersRouter=router;


