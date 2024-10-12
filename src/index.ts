import {Request,Response} from 'express';
import {runDB} from "./repositories/db";
import {app} from "./app_settings";

const port = process.env.port || 5000
console.log('port',port)
app.get('/', (req:Request, res:Response)=>{
    res.send('DEFAULT GET REQUEST')
})

const startsApp = async () => {
    await runDB();
    console.log('DB')
    app.listen(port, ()=> {
        console.log(`Example app listening on port ${port}`)
    })
}

startsApp();
