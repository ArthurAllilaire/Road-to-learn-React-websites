// import logo from './logo.svg';
//Commands: // Runs the app in http://localhost:3000
// npm start
// Runs the tests
// npm test
// Builds the app for production
// npm run build

import './App.css';
import React from 'react';
//Api url values
const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      result:null,
      query: DEFAULT_QUERY,
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
  }
  onSearchChange(event){
    this.setState({query: event.target.value});
  }
  handleSubmit(event){
    const { query } = this.state;
    console.log(query)
    this.fetchSearchTopstories(query, DEFAULT_PAGE);
    event.preventDefault();
  }
  setSearchTopstories(result){
    this.setState({result});
  }
  fetchSearchTopstories(query, page){
    //Added page feature
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }
  componentDidMount() {
    const { query } = this.state;
    this.fetchSearchTopstories(query, DEFAULT_PAGE);
  }
  render(){
    const {result,query} = this.state;
    //Aim is set result.page = page but if false return 0, but if result doesn't exist you get an error as you call undefined.page. So first check that result is not undefined (by checking for a truthy value) then return result.page 
    const page = (result && result.page) || 0;
    return(
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.handleSubmit} />
        </div>
        <TableWithNull list={result} query={query}/>
        <div className = "interactions">
          <Button onClick={() => this.fetchSearchTopstories(query, page +1)}>
            More
          </Button>
        </div>
      </div>
    )
  }
}
const Search = ({ value, onChange, onSubmit }) => {
    return (
      <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange} />
        <button type="submit">Submit</button>
      </form>
    );
}

function Table (props){
    let {list,query} = props.props;
    list = list.hits;
    let filtList = list.filter(
      function(item){
        let words = item.title.toLowerCase().split(" ")
        return !this || words.indexOf(this.toLowerCase()) !== -1
      },
      //Set this equal to query
      query
    );
    return (
      <div className="table">
        { filtList.map(function(item) {
          return (
            <div key={item.title.toString()} className="table-row">
              <span style={{width:"40%"}}><a href={item.url}>{item.title}</a></span>
              <span style={{width:"30%"}}>{item.author}</span>
              <span style={{width:"15%"}}>{item.num_comments}</span>
              <span style={{width:"15%"}}>{item.points}</span>
            </div>
          )})
        }
      </div>
    )
}
function withNull(Component){
  return function(props){
    return props.list
    ? <Component props = { props }/>
    : null
  }
}
const TableWithNull = withNull(Table);

const Button = ({onClick, children}) => 
  <button onClick={onClick} type="button">
    {children}
  </button>

export default App;
