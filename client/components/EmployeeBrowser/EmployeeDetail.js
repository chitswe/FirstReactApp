import React,{PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Card, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {propType} from 'graphql-anywhere';
import Calendar from 'material-ui/DatePicker/Calendar';
import ImageTimer from 'material-ui/svg-icons/image/timer';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {white} from 'material-ui/styles/colors';
import {Tabs, Tab} from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';

class RawLogItem extends React.Component {
    constructor(){
        super(...arguments);
        this.state={};
    }
    render(){
            let {muiTheme,LDate,LTime,EditedTime,AppliedTime,active}=this.props;
            let boxShadow = active? {boxShadow:"rgba(200, 0, 200, 1) 0px 3px 10px, rgba(0, 200, 200, 1) 0px 3px 10px"}:null;
            return(
                <div className="raw-log-card">
                    <Card style= {boxShadow}>
                        <div className="ldate" style={{backgroundColor: muiTheme.palette.primary1Color,color: white}}><span>{LDate.formatAsShortDate()}</span></div>
                        <div className="row">
                            <div className="ltime">
                                <div className="icon"><span style={{backgroundColor: muiTheme.palette.accent1Color}}><ImageTimer color={white}/></span></div>
                                <div className="time"><span>{LTime ? LTime.formatAsShortTime() : ''}</span></div>
                            </div>
                            <div className="edited-time">
                                <div className="icon"><span style={{backgroundColor: muiTheme.palette.accent1Color}}><EditorModeEdit color={white}/></span></div>
                                <div className="time"><span>{EditedTime ? EditedTime.formatAsShortTime() : ''}</span></div>
                            </div>
                            <div className="applied-time">
                                <div className="icon"><span style={{backgroundColor: muiTheme.palette.accent1Color}}><NavigationCheck color={white}/></span></div>
                                <div className="time"><span>{AppliedTime ? AppliedTime.formatAsShortTime() : ''}</span></div>
                            </div>
                        </div>
                    </Card>
                </div>
        );

    }
}

RawLogItem.fragments={
    log:gql`
        fragment logItem on RawLog{
            LDate
            LTime
            EditedTime
            AppliedTime
        }
`
};





class RawOutLogCard extends React.Component{
    constructor(){
        super(...arguments);
        this.state={
            selectedDate:null
        };
    }
    componentDidUpdate(prevProps,prevState) {
        // only scroll into view if the active item changed last render
        if (this.state.selectedDate !== prevState.selectedDate) {
            this.ensureActiveItemVisible();
        }
    }

    ensureActiveItemVisible() {
        var itemComponent = this.refs.activeItem;
        if (itemComponent) {
            var domNode = ReactDOM.findDOMNode(itemComponent);
            this.scrollElementIntoViewIfNeeded(domNode);
        }
    }

    scrollElementIntoViewIfNeeded(domNode) {
        var containerDomNode = ReactDOM.findDOMNode(this);
        domNode.scrollIntoView()
    }
    handleOnTouchTapDay(){
        setTimeout(()=>{let selected = this.refs.calendar.getSelectedDate(); this.setState({selectedDate:selected.toDateOnlyJSON()});}, 300);
    }
    renderItem(l,i){
        let log = {
            LTime: l.LTime?new Date(l.LTime):null,
            LDate:new Date(l.LDate),
            EditedTime:l.EditedTime?new Date(l.EditedTime):null,
            AppliedTime:l.AppliedTime? new Date(l.AppliedTime):null,
            muiTheme:this.props.muiTheme
        };
        let active =this.state.selectedDate == log.AppliedTime.toDateOnlyJSON();
        if(active) {
            log.ref = "activeItem";
        }
        log.key = i;
        log.active = active;
        return (<RawLogItem {...log}/>);
    }
    render(){
        let {loading,refetch,OutLog} = this.props;
        return (
            <div className="outlog-card">
                <div className="row wrapper arround">
                    {!loading? OutLog.map(this.renderItem.bind(this)):null}
                </div>
                <Calendar ref="calendar" firstDayOfWeek={0}  onTouchTapDay={this.handleOnTouchTapDay.bind(this)}/>
            </div>
        );
    }
}



RawOutLogCard.propTypes={
    loading:PropTypes.bool,
    refetch:PropTypes.func,
    OutLog:PropTypes.arrayOf(propType(RawLogItem.fragments.log))
};

const RawOutLogCardWithTheme = muiThemeable()(RawOutLogCard);

class RawInLogCard extends React.Component{
    constructor(){
        super(...arguments);
        this.state={
            selectedDate:null
        };
    }
    componentDidUpdate(prevProps,prevState) {
        // only scroll into view if the active item changed last render
        if (this.state.selectedDate !== prevState.selectedDate) {
            this.ensureActiveItemVisible();
        }
    }

    ensureActiveItemVisible() {
        var itemComponent = this.refs.activeItem;
        if (itemComponent) {
            var domNode = ReactDOM.findDOMNode(itemComponent);
            this.scrollElementIntoViewIfNeeded(domNode);
        }
    }

    scrollElementIntoViewIfNeeded(domNode) {
        var containerDomNode = ReactDOM.findDOMNode(this);
        domNode.scrollIntoView()
    }
    handleOnTouchTapDay(){
        setTimeout(()=>{let selected = this.refs.calendar.getSelectedDate(); this.setState({selectedDate:selected.toDateOnlyJSON()});}, 300);
    }
    renderItem(l,i){
        let log = {
            LTime: l.LTime?new Date(l.LTime):null,
            LDate:new Date(l.LDate),
            EditedTime:l.EditedTime?new Date(l.EditedTime):null,
            AppliedTime:l.AppliedTime? new Date(l.AppliedTime):null,
            muiTheme:this.props.muiTheme
        };
        let active =this.state.selectedDate == log.AppliedTime.toDateOnlyJSON();
        if(active) {
            log.ref = "activeItem";
        }
        log.key = i;
        log.active = active;
        return (<RawLogItem {...log}/>);
    }
    render(){
        let {loading,refetch,InLog} = this.props;
        return (
            <div className="inlog-card">
                <Calendar ref="calendar" firstDayOfWeek={0}  onTouchTapDay={this.handleOnTouchTapDay.bind(this)}/>
                <div className="row wrapper arround">
                    {!loading? InLog.map(this.renderItem.bind(this)):null}
                </div>
            </div>
        );
    }
}



RawInLogCard.propTypes={
    loading:PropTypes.bool,
    refetch:PropTypes.func,
    InLog:PropTypes.arrayOf(propType(RawLogItem.fragments.log))
};

const RawInLogCardWithTheme = muiThemeable()(RawInLogCard);




class EmployeeDetail extends React.Component{
    getCardContent(employee,loading,refetch){
        let avatarPath = `https://randomuser.me/api/portraits/thumb/women/${employee.id}.jpg`;
        let portraitPath = `https://randomuser.me/api/portraits/women/${employee.id}.jpg`;
        return (
            <Card style={{paddingBottom: '15px', marginBottom: '10px'}}>
                <CardHeader title={employee.Name} subtitle={"Id: " + employee.id} avatar={avatarPath}/>
                <Tabs>
                    <Tab label="In">
                        <RawInLogCardWithTheme loading={loading} refetch={refetch} InLog={employee.InLog}/>
                    </Tab>
                    <Tab label="Out">
                        <RawOutLogCardWithTheme loading={loading} refetch={refetch} OutLog={employee.OutLog}/>
                    </Tab>
                </Tabs>
            </Card>
        );
    }
    render(){
        let {employee,loading,refetch,error}=this.props.data;
        if(error)
            console.log(`Error exist ${error}`);
        let cardContent = !loading ? this.getCardContent(employee,loading,refetch):<CircularProgress style={{marginTop:'30%',marginLeft:'45%',marginRight:'auto' }} mode="indeterminate" />;

        return (
            <div id="employeeDetailCard" className={`${this.props.className}`}>
                {cardContent}
            </div>
        );

    }
}
EmployeeDetail.fragments={
    employee:gql`
    
    fragment employeeDetail on Employee{
        id
        Name
        JobTitle
        RetiredDate
        HiredDate
        Active
        InLog{
            ...logItem
        }
        OutLog{
            ...logItem
        }
    }
     ${RawLogItem.fragments.log}
`
}
const DETAIL_QUERY = gql`
    query Query($id:Int!){
        employee:employeeById(id:$id){
            ...employeeDetail
        }
    }
    
        ${EmployeeDetail.fragments.employee}       
`;

EmployeeDetail.propTypes={
    id:PropTypes.number,
    data:PropTypes.shape({
        employee:propType(EmployeeDetail.fragments.employee),
        refetch: PropTypes.func,
        loading:PropTypes.bool.isRequired
    }),
    className:PropTypes.string
};

export default  graphql(DETAIL_QUERY,{
    options:(props)=>{
        return {
            variables:{
                id:props.id
            }
        }
    }
})(EmployeeDetail);