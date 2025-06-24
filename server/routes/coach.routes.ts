import { Router } from 'express'
import getCoachResponse from '../services/coach.service'

const router = Router()

router.post('/', async (req, res) => {
    const { prompt } = req.body
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' })
    }
     
    const response = await getCoachResponse(prompt)
    res.send({ response })
})

export default router