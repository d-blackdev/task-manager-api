const express = require("express");
const router = new express.Router();
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')


// USER mODEL
const User = require("../model/User");
// Create User

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {

    await user.save();
    const token = await user.generateAuthToken()
    res.status(201).send({user, token});
  } catch (e) {
    res.sendStatus(400);
  }
});
  // LOGIN USER
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({user ,token})
  } catch (e) {
    res.status(400).send()
  }
})
// LOGOUT USER
router.post('/user/logout', auth, async(req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})
// LOGOUT OF ALL SESSIONS
router.post('/user/logoutAll', auth, async(req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save()
    res.send(req.user)
  } catch (error) {
    res.status(500).send()
  }
})

// Get all users
router.get("/user/me", auth,async (req, res) => {
    res.send(req.user)
});
// Get user by id
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//    const users =  await User.findById({_id});
//       if (!users) {
//         return res.status(404).send()
//       }
//       res.send(users)
//   } catch (e) {
//     res.status(500).send();
//   }

// });
// Update user 
router.patch('/users/me', auth,async(req, res) => {
    // const _id = req.user._id
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "password", "email", "age"];
    const isValidUpdate = updates.every(update => {
      return  allowedUpdates.includes(update)
    })
    if (!isValidUpdate) {
        return res.status(400).send({error:"Invalid Update Property"})
    }
    try {
// const user = await User.findById({_id})
        updates.forEach(update => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
       
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
   
})
// /\.(doc|docx|pdf)$/
const upload = multer({

  limits: {
    fileSize: 2000000,
  },
  fileFilter(req,file,cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/) ){
      return cb(new Error('File must be an image of format jpg,jpeg,png'))
    }
    cb(undefined, true)
  }
})
// UPLOAD USER PICTURE
router.post('/users/me/avatar', auth, upload.single('avatars'), async(req, res) => {
  const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
  req.user.avatar = buffer;
  await req.user.save()
  res.send(req.user)
}, (err, req, res, next) => {
    res.status(400).send({error:err.message})
})
//DeleteUserAvatar
router.delete('/users/me/avatar', auth, async (req, res) => {
  try {
    let user = req.user;
  user.avatar = undefined;
    await user.save()
    res.status(200).send()
  } catch (error) {
    res.status(400).send({error:error.message})
  }
  
})
// Getting userProfile Image
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error('No user with such image')
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (error) {
    res.status(404).send({error:error.message});
  }
})

// Delete User Route
router.delete('/user/me', auth,async (req, res) => {
  const _id = req.user.id;
  try {
      const user = await User.deleteOne({_id})
    // if (!user) {
    //     throw new Error('No such user found')
    // }
    // req.user.remove()

    res.send(user)
  } catch (error) {
      res.status(500).send()
  }
})


module.exports = router;
