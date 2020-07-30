const express = require('express')

const sharp = require('sharp')
const multer = require('multer')
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)){
            return cb(new Error('File type not supported'))
        }

        cb(undefined, true)
    }
})

const cookie = require('js-cookie')
 
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/api/users',  async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        console.log({user, token})
        res.json({ user, token })
        //res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(404).send(e)
    }
})

router.post('/api/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e){
        res.status(500).send()
    }
})

router.post('/api/users/logoutall', auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/api/users/me',auth, async (req, res) => {
    res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     if (_id.match(/^[0-9a-fA-F]{24}$/)) {
//         try {
//             const user = await User.findById(_id)
//             if(!user){
//                 return res.status(404).send()
//             }
//             res.send(user)
//         } catch (e){
//             res.status(500).send(e)
//         }
//       } else {
//           res.status(404).send()
//       }
// })

router.patch('/api/users/me',auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update) )

    if (!isValidOperation){
        return res.status(400).send({error: 'invalid update'})
    }
        try {
            const user = req.user
            updates.forEach((update) => {
                user[update] = req.body[update]
            })

            await user.save()
            // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
            if(!user) {
                return res.status(404).send()
            }
            res.send(user)
        } catch (e){
            res.status(400).send(e)
        }
})

router.delete('/api/users/me',auth, async (req,res) => {
        try {
            await req.user.remove()
            res.send(req.user)
        } catch(e){
            res.status(500).send()
        }
})

router.post('/api/users/me/avatar',auth, upload.single('upload'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save()
    const user = req.user
    res.send(user)
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/api/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/api/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router
