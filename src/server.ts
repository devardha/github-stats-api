import express from 'express'
import stats from './routes/stats'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 4000;

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render( "index" );
})

app.use('/api/stats', stats)

app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log('\x1b[36m%s\x1b[0m', 'event', `- Server running`)
});