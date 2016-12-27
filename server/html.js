/**
 * Created by ChitSwe on 12/22/16.
 */
import React, { PropTypes } from 'react';


const scriptUrl = "/bundle.js";
const Html = ({ content, state }) => (
    <html lang="en">
    <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/style/flexboxgrid.min.css"  />
        <link rel="stylesheet" href="/style/style.css"/>
        <title>Hello</title>
    </head>
    <body>
    <div id="content" dangerouslySetInnerHTML={{ __html: content }} />

    <script
        dangerouslySetInnerHTML={{ __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};` }}
        charSet="UTF-8"
    />
    <script src={scriptUrl} charSet="UTF-8" />
    </body>
    </html>
);

Html.propTypes = {
    content: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Html;