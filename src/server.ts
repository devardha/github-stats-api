import express from 'express'
import stats from './routes/stats'
import path from 'path'
import dotenv from 'dotenv'
import schema from './graphql/schema'
import { ApolloServer } from 'apollo-server-express'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000;

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use(express.static(__dirname + '/public'));

// Setup Apollo Server
const apollo = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
});

apollo.applyMiddleware({
    app,
    path: '/api/graphql'
});

app.get('/', (req, res) => {
    res.render( "index" );
})

app.use('/api/stats', stats)

app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log('\x1b[36m%s\x1b[0m', 'event', `- Server running`)
});