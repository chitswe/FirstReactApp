/**
 * Created by ChitSwe on 12/23/16.
 */
import React,{PropTypes} from 'react';
import {Card, CardHeader, CardTitle} from 'material-ui/Card';
import {propType} from 'graphql-anywhere';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import ActionSearch from 'material-ui/svg-icons/action/search';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import {white} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import {Link,withRouter} from 'react-router';
import EmployeeDetail from './EmployeeDetail';
class EmployeeCard extends React.Component{
    render (){
        let {id,Name,JobTitle,Active,HiredDate,RetiredDate} = this.props.employee;
        let search = this.props.search;
        let avatarPath = `https://randomuser.me/api/portraits/thumb/women/${id}.jpg`;
        let protraitPath = `https://randomuser.me/api/portraits/women/${id}.jpg`;
        let nameLink = <Link className="link" to={`/EmployeeBrowser/${search? search : '-'}${id || id == 0 ? `/${id}`: ''}`}>{Name}</Link>;

        return (
            <div className="employeeCard col-xs-12 col-sm-6 col-md-4 col-lg-4" >
                <Card>
                    <div className="cardWrapper">
                        <img src={protraitPath} />
                        <div className="">
                            <CardHeader title={nameLink} subtitle={"Id: " + id} avatar={avatarPath}/>
                            <CardTitle title={JobTitle} subtitle={Active? 'Since ' +  (new Date(HiredDate)).formatAsShortDate(): 'Retired ' + (new Date(RetiredDate)).formatAsShortDate()} />

                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

EmployeeCard.fragments={
    employee:gql`
        fragment employeeItem on Employee{
            id
            Name
            JobTitle
            HiredDate
            RetiredDate
            Active
        }
    `
};

EmployeeCard.propTypes={
    employee:propType(EmployeeCard.fragments.employee).isRequired,
    search:PropTypes.string
};





class Grid extends React.Component{
    constructor(){
        super(...arguments);
        this.state={
            searchMode:this.props.search
        }
    }


    render(){
        let theme = this.props.muiTheme;
        let search= this.props.search? this.props.search:'';
        let {employeeList,refetch,loading,onSearchChange} = this.props;
        let toolBar = <Toolbar style={{height:'64px',backgroundColor:theme.palette.primary1Color}}>
            <ToolbarGroup firstChild={true}>
                <IconButton touch={true}>
                    <NavigationMenu color={white} />
                </IconButton>
                <ToolbarTitle style={{color:'#fff'}} text="Employee"/>
            </ToolbarGroup>
            <ToolbarGroup lastChild={true}>
                <IconButton touch={true} onClick={()=>{this.setState({searchMode:true});}}>
                    <ActionSearch color={white} />
                </IconButton>
                {loading? <CircularProgress />:null}
            </ToolbarGroup>
        </Toolbar>;
        let searchBar = <Toolbar style={{height:'64px'}}>
            <ToolbarGroup style={{width:'100%'}} firstChild={true}>
                <IconButton touch={true} onClick={()=>{this.setState({searchMode:false});}}>
                    <NavigationArrowBack/>
                </IconButton>
                <TextField id="searchbox" hintText="Enter search" onChange={(e)=>{onSearchChange(e.target.value)}} value={search} style={{width:'100%'}}/>
                {loading? <CircularProgress />:null}
            </ToolbarGroup>
        </Toolbar>;
        return (
            <div id="employeeList" className="layout">
                <Paper   zDepth={1}>
                    {
                        this.state.searchMode? searchBar:toolBar
                    }
                </Paper>
                <div   className="row arround body">

                    {
                        !loading?
                            employeeList.map(e=>{
                            return (
                                <EmployeeCard key={e.id} employee={e} search={search}/>
                            );
                        }):
                            null
                    }
                </div>
            </div>
        );
    }
}

Grid.propTypes={
    search:PropTypes.string  ,
    employeeList:PropTypes.arrayOf(propType(EmployeeCard.fragments.employee).isRequired),
    loading:PropTypes.bool,
    refetch:PropTypes.func,
    onSearchChange:PropTypes.func
};

const GridWithTheme = muiThemeable()(Grid);


const SideBarItem = ({employee,search})=>{
    let {id,Name}=employee;
    let avatarPath = `https://randomuser.me/api/portraits/thumb/women/${id}.jpg`;
    let nameLink = <Link className="link" to={`/EmployeeBrowser/${search? search : '-'}${id || id == 0 ? `/${id}`: ''}`}>{Name}</Link>;
    return (
        <Link className="link" activeClassName="active" to={`/EmployeeBrowser/${search? search : '-'}${id || id == 0 ? `/${id}`: ''}`}>
            <Card>
                <div>
                    <CardHeader title={Name} subtitle={"Id: " + id} avatar={avatarPath}/>
                </div>
            </Card>
        </Link>
       );
};

class SideBar extends React.Component{
    render(){
        let {employeeList,refetch,search,onSearchChange,loading} = this.props;
        return (
            <div className={`sideBar ${this.props.className}`}>
                <TextField id="searchBox" hintText="Enter search" onChange={(e)=>{onSearchChange(e.target.value);}} value={search} style={{width:'100%'}}/>
                <div className="list">
                    {
                        !loading? employeeList.map((e,i)=>(<SideBarItem key={e.id} search={search} employee={e}/>)):null
                    }
                </div>
            </div>
        );
    }
}

SideBar.propTypes={
    employeeList:PropTypes.arrayOf(propType(EmployeeCard.fragments.employee).isRequired),
    refetch:PropTypes.func,
    search:PropTypes.string,
    onSearchChange:PropTypes.func.isRequired,
    loading:PropTypes.bool.isRequired,
    className:PropTypes.string
}




class DetailBrowser extends React.Component{
    render(){
        let {search,id,employeeList,onSearchChange,refetch,loading,muiTheme}=this.props;
        return (
            <div id="emp_detail_browser" className="layout">
                <Paper  style={{zIndex:'1100'}} zDepth={1}>
                    <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
                        <ToolbarGroup firstChild={true}>
                            <IconButton touch={true}>
                                <NavigationArrowBack color={white} />
                            </IconButton>
                            <ToolbarTitle style={{color:'#fff'}} text="Employee"/>
                        </ToolbarGroup>
                        <ToolbarGroup lastChild={true}>
                            {loading? <CircularProgress />:null}
                        </ToolbarGroup>
                    </Toolbar>
                </Paper>
                <div  className="row">
                    <SideBar className="col-lg-3"  employeeList={employeeList} onSearchChange={onSearchChange} loading={loading} refetch={refetch} search={search} />
                    <EmployeeDetail className="col-lg-9" id={id}/>
                </div>
            </div>
        );
    }
}

DetailBrowser.propTypes = {
    search:PropTypes.string,
    id:PropTypes.number,
    employeeList:PropTypes.arrayOf(propType(EmployeeCard.fragments.employee).isRequired),
    refetch:PropTypes.func,
    onSearchChange:PropTypes.func.isRequired,
    loading:PropTypes.bool.isRequired
}

const ThemeableDetailBrowser  = muiThemeable()(DetailBrowser);

class EmployeeBrowser extends React.Component{
    constructor(){
        super(...arguments);
        let search = this.props.params.search;
        search = search === '-' ? '': search;
        this.state = {
            search:search
        };
    }
    onSearchChange(search){
        this.setState({search:search});
        this.props.data.refetch({search:search});
    }
    render(){
        let {id} = this.props.params;
        let {refetch,employeeList,loading} = this.props.data;
        let component = null;
        id = Number.parseInt(id);
        if(!isNaN(id)){
            let props = {
                search:this.state.search,
                id,
                employeeList,
                refetch,
                loading
            }
            component = <ThemeableDetailBrowser {...props} onSearchChange={this.onSearchChange.bind(this)}/>
        }else{
            let props = {
                search:this.state.search,
                employeeList,
                loading,
                refetch
            }
            component = <GridWithTheme {...props} onSearchChange={this.onSearchChange.bind(this)}/>
        }
        return component;
    }
}

const QUERY = gql`
    query Query($search:String){
      employeeList:employee(search:$search){
        ...employeeItem
      }
    }
    ${EmployeeCard.fragments.employee}
`;


EmployeeBrowser.propTypes={
    data:PropTypes.shape({
        employee:PropTypes.arrayOf(propType(EmployeeCard.fragments.employee).isRequired),
        loading:PropTypes.bool
    })

};



const withData =graphql(QUERY,{
    options:(props)=>{
        let search = props.params.search;
        search = search =='-' ? '':search;
        return {
            returnPartialData:false,
            variables:{
                search
            }
        }
    }
})(withRouter(EmployeeBrowser));

export default withData;



