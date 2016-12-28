/**
 * Created by ChitSwe on 12/19/16.
 */
import Express,{Router} from 'express';
import bodyParser from 'body-parser';
import './common/dateUtils';
import db from './server/models';
//import  './server/database/integration/index';
import { apolloExpress, graphiqlExpress } from 'apollo-server';
import { makeExecutableSchema } from 'graphql-tools';
import Schema from './server/data/schema';
import Resolver from './server/data/resolver';
import {default as migration} from './server/database/migrations';
import React from 'react';
import ReactDOM from 'react-dom/server';
import routes from './client/routes';
import createApolloClient from './common/createApolloClient';
import { createNetworkInterface } from 'apollo-client';
import { match, RouterContext } from 'react-router';
import 'isomorphic-fetch';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import injectTapEventPlugin from 'react-tap-event-plugin';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
injectTapEventPlugin();
import Html from './server/html';
const app = new Express();
const apiRouter = new Router();
const port = 3131;
const graphqlUrl=`http://localhost:${port}/graphql`;
const proxyPort = 3132;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/graphql', apolloExpress( (req) => {
    return {
        schema: makeExecutableSchema({
            typeDefs: Schema,
            resolvers:Resolver,
            allowUndefinedInResolve: true,
        }),
        context: {  }
    }
}));
// graphiql endpoint
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}));
apiRouter.get('/employee',(req,res)=>{
    db.Employee.findAll().then(data=>{
        res.json(
            data
        );
    }).catch(error=>{
        console.log(error);
        res.status(500).send(error.toString());
    })
});
app.use(Express.static('public'));
app.use('/api',apiRouter);
app.use((req, res) => {
    match({ routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
            res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
            console.error('ROUTER ERROR:', error); // eslint-disable-line no-console
            res.status(500);
        } else if (renderProps) {
            const client = createApolloClient({
                ssrMode: true,
                networkInterface: createNetworkInterface({
                    uri: graphqlUrl,
                    opts: {
                        credentials: 'same-origin',
                        // transfer request headers to networkInterface so that they're
                        // accessible to proxy server
                        // Addresses this issue: https://github.com/matthew-andrews/isomorphic-fetch/issues/83
                        headers: req.headers,
                    },
                }),
            });

            const muiTheme = getMuiTheme({userAgent: req.headers['user-agent']});
            const component = (
                <MuiThemeProvider muiTheme={muiTheme}>
                    <ApolloProvider client={client}>
                        <RouterContext {...renderProps} />
                    </ApolloProvider>
                </MuiThemeProvider>
            );

            renderToStringWithData(component).then((content) => {
                const data = client.store.getState().apollo.data;
                res.status(200);

                const html = (<Html
                    content={content}
                    state={{ apollo: { data } }}
                />);
                res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
                res.end();
            }).catch(e => console.error('RENDERING ERROR:', e)); // eslint-disable-line no-console
        } else {
            res.status(404).send('Not found');
        }
    });
});
/*
const webpackConfig = {
    context: __dirname + "/client",
    entry: "./browser",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loaders: ["babel-loader"]
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compressor: {
        //         warnings: false
        //     }
        // })
    ],
    devtool: 'source-map'
};
*/
if(app.settings.env !=='production') {
    console.log('Start webpack bundling');
    webpack(webpackConfig, function (err, stats) {
        if (err)
            console.log(err);
        else {
            console.log('Bundling finished.');
                migration.then((migrations) => {
                app.listen(port, () => {
                    console.log(`Server is running on port ${port}`);
                });
            });
        }
    });
}else{
    console.log('Production mod and skip bundling.');
    migration.then((migrations) => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    });
}

