import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ status: 'OK' })
})

export const healthRoutes = router
