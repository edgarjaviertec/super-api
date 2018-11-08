import express from "express";
import bodyParser from "body-parser";
import errorhandler from './errorhandler';
import sequelize from './db';
import config from './config';
import router from './routes/routes';
import { join } from "path";
import exphbs from "express-handlebars"
const app = express();

app
    .use(bodyParser.json())
    .set('views', join(__dirname, './views'))
    .engine('.hbs', exphbs({
        defaultLayout: 'main',
        extname: '.hbs',
        layoutsDir: join(__dirname, './views/layouts'),
        partialsDir: join(__dirname, './views/partials')
    }))
    .set('view engine', '.hbs')
    .use(router)
    .use(errorhandler);

sequelize.sync().then(runServer);

function runServer() {
    app.listen(config.port, () => {
        console.log(`API REST corriendo en http://localhost:${config.port}`)
    });
}