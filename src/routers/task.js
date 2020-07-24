const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.get('/tasks',auth,  async (req,res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const tasks = await Task.find({ owner: req.user._id })
        //OR
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
        //res.send(tasks)
    } catch(e){
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            //const task = await Task.findById(_id)
            const task = await Task.findOne({ _id, owner: req.user._id })

            if(!task){
                return res.status(404).send()
            }
            return res.send(task)
        } catch(e) {
            res.status(500).send(e)
        }
      } else {
          res.status(404).send()
     }
})

router.post('/tasks',auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.send(task)
    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation){
        return res.status(400).send({error: 'Invalid update'})
    }

    const _id = req.params.id
    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            const task = await Task.findOne({ _id, owner: req.user._id })

            if(!task){
                return res.status(404).send()
            }

            updates.forEach((update) => {
                task[update] = req.body[update]
            })
            await task.save()

            res.send(task)
        } catch(e) {
            res.status(400).send(e)
        }
      } else {
          res.status(404).send()
      }

})

router.delete('/tasks/:id',auth, async (req,res) => {
    const _id = req.params.id

    if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            const task = await Task.findOneAndDelete({_id, owner: req.user._id })

            if(!task){
                return res.status(404).send()
            }

            res.send(task)
        } catch(e){
            res.status(500).send()
        }
      } else {
          res.status(404).send()
      }

})

module.exports = router
