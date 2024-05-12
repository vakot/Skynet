import SkynetCategories from '@bot/libs/categories'
import { Category } from '@bot/models/category'
import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/category/:id', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    let category

    if (mongoose.isValidObjectId(req.params.id)) {
      category = await Category.findById(req.params.id)
    } else {
      category = SkynetCategories.find((category) => category._id === req.params.id)
    }

    if (!category) {
      return res.status(404).send('unknown category')
    }

    return res.status(200).json(category)
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.patch('/category/:id', async (req, res) => {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).json('unresolved category')
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(403).send('unresolved category id')
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body)

    if (!category) {
      return res.status(404).send('unknown category')
    }

    return res.status(200).json(category)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
