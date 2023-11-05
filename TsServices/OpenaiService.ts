export class Openaiservice {
    constructor() {

    }

    async test() {
        const response = await fetch(process.env.PY_API_BASE + '/test')
        return response.json();
    }
}