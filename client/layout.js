/**
 * Created by ChitSwe on 12/22/16.
 */
import React,{PropTypes} from 'react';
import {Link} from 'react-router';

class Layout extends React.Component{
    render(){
        return (

            <div>
                {this.props.children}
            </div>
        );
    }
}

Layout.PropTypes = {
    children:PropTypes.element
};
export default Layout;

