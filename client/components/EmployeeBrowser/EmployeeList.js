/**
 * Created by ChitSwe on 12/24/16.
 */
import React,{PropTypes} from 'react';
import {Card, CardHeader} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
const ListItem = ({employee})=>{
    let {id,Name}=employee;
    let avatarPath = `https://randomuser.me/api/portraits/thumb/women/${id}.jpg`;
    return (<Card>
        <div>
            <CardHeader title={Name} subtitle={"Id: " + id} avatar={avatarPath}/>
        </div>
    </Card>);
};

class SideBar extends React.Component{
    render(){
        let {data,search,onSearchChange} = this.props;
        let{employeeList,refetch} = data;
        if(!employeeList) {
            refetch(search);
        }
        return (
            <div>
                <TextField id="searchbox" onChange={(e)=>{onSearchChange(e.target.value);refetch({search:e.target.value});}} value={search} style={{width:'100%'}}/>
                <div>
                    {
                        employeeList? employeeList.map((e,i)=>(<ListItem key={e.id} employee={e}/>)):null
                    }
                </div>
            </div>
        );
    }
}

const QUERY  = gql`
    query Query($search:String){
        employeeList:employee(search:$search){
            id
            Name
        }
    }
`;

const options = {
    options:({search})=>({
        variables:{search:search==='-'? null: search},
        returnPartialData:false
    })
}
const SideBarWithData= graphql(QUERY,options)(SideBar);

class EmployeeList extends React.Component{
    constructor(){
        super(...arguments);
    }
    render(){
        let avatarPath = `https://randomuser.me/api/portraits/thumb/women/${id}.jpg`;
        return (
            <div>
                <SideBarWithData  search={this.props.search}/>
                <div>
                    <CardHeader title={Name} subtitle={"Id: " + id} avatar={avatarPath}/>
                </div>
            </div>
        );
    }
}



export default EmployeeList;


