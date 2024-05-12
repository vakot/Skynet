import SkynetCategories from '@bot/libs/categories'
import { Category } from '@bot/models/category'
import { parseIds } from '@bot/utils/helpers/parseIds'
import express from 'express'
import { FilterQuery } from 'mongoose'

const router = express.Router()

router.get('/category', async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).send('incompatible method')
    }

    const { ids: categoryIds } = req.query

    const filter: FilterQuery<typeof Category> = {}

    const { objectIds, globalIds } = parseIds(
      (typeof categoryIds === 'string' ? [categoryIds] : categoryIds) as string[] | undefined
    )

    if (objectIds.length) {
      filter._id = { $in: objectIds }
    }

    const categories = await Category.find(filter)
    const skynetCategories = globalIds.length
      ? SkynetCategories.filter(({ _id }) => globalIds.includes(_id))
      : SkynetCategories

    return res.status(200).json([...skynetCategories, ...categories])
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.post('/category', async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('incompatible method')
    }

    if (!req.body) {
      return res.status(400).send('unresolved category')
    }

    const category = await Category.create(req.body)

    if (!category) {
      return res.status(422).send('unable to create category')
    }

    return res.status(200).json(category)
  } catch (error) {
    return res.status(500).send(error)
  }
})

export default router
