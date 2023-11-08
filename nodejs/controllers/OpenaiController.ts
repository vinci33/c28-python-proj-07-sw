import { Request, Response } from 'express'

export class OpenaiController {
    constructor() {

    }

    test = async (req: Request, res: Response) => {
        const resp = await fetch(process.env.PY_API_BASE + '/test')
        console.log(resp);
        res.json(resp);

    }
}