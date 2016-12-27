/**
 * Created by ChitSwe on 12/22/16.
 */
import React from 'react';
import {Route,IndexRoute} from 'react-router';
import Layout from './layout';
import Home from './components/home';
import EmployeeBrowser from './components/EmployeeBrowser';
import EmployeeList from './components/EmployeeBrowser/EmployeeList'

export default (
    <Route component={Layout} path="/">
        <IndexRoute component={Home}/>
        <Route path="/EmployeeBrowser/:search(/:id)" component={EmployeeBrowser}>
        </Route>
    </Route>
);

