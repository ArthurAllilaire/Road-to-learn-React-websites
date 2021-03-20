// import logo from './logo.svg';
//Commands: // Runs the app in http://localhost:3000
// npm start
// Runs the tests
// npm test
// Builds the app for production
// npm run build
/* Result from api
   {hits: Array(20), nbHits: 15365, page: 0, nbPages: 50, hitsPerPage: 20, …}
      exhaustiveNbHits: true
      hits: (20) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
      hitsPerPage: 20
      nbHits: 15365
      nbPages: 50
      page: 0
      params: "advancedSyntax=true&analytics=true&analyticsTags=backend&page=0&query=redux"
      processingTimeMS: 5
      query: "redux" 
    */

import './App.css';
import React from 'react';
//Api url values
const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = "10";
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      results:null,
      query: DEFAULT_QUERY,
      filter: "",
      searchKey: DEFAULT_QUERY
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
  }
  onSearchChange(event){
    this.setState({query: event.target.value});
  }
  onFilterChange(event){
    this.setState({filter: event.target.value});
  }
  handleSubmit(event){
    const { query, results} = this.state;
    this.setState({searchKey: query});
    if(!results[query]){this.fetchSearchTopstories(query, DEFAULT_PAGE)}
    event.preventDefault();
  }
  setSearchTopstories(result){
    const {hits, page} = result;
    const{searchKey} = this.state;
    //If first page empty array otherwise old hits
    const oldHits = page === 0 ? [] : this.state.results[searchKey].hits
    const updatedHits = [...oldHits, ...hits]
    //use function as rely on previous state
    this.setState(prevState =>
      ({
        //have to first make results same as previous results before updating searchKey due to shallow merging - which would have got rid of everything else.
        results: {...prevState.results, [searchKey]: {hits: updatedHits, page}}
      }));
  }
  fetchSearchTopstories(searchKey, page){
    //Added page feature
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchKey}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }
  componentDidMount() {
    const { searchKey } = this.state;
    this.fetchSearchTopstories(searchKey, DEFAULT_PAGE);
  }
  render(){
    const {results, query, filter, searchKey} = this.state;
    //to avoid errors check that all objects needed to reach page and list are truthy (not undefined or null) otherwise set it to 0 
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    return(
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.handleSubmit} label="Get results from api"/>
          <Search value={filter} onChange={this.onFilterChange} label="Filter results from API"/>
        </div>
        <Table list={list} filter={filter}/>
        <div className = "interactions">
          <Button onClick={() => this.fetchSearchTopstories(searchKey, page +1)}>
            More
          </Button>
        </div>
      </div>
    )
  }
}
const Search = ({ value, onChange, onSubmit, label }) => {
    return (
      <form onSubmit={onSubmit}>
        <label style={{padding:"4%"}}>{label}</label>
        <input type="text" value={value} onChange={onChange} />
        {onSubmit ? <button type="submit">Submit</button>: null }
      </form>
    );
}

function Table (props){
    let {list,filter} = props;
    let filtList = list.filter(
      function(item){
        if(item.url === null || item.url === ""){ 
          return false;
        }
        let words = item.title;
        const regex = new RegExp(`${this}`,"i")
        return regex.test(words)
      },
      //Set this equal to query
      filter
    );
    return (
      <div className="table">
        { filtList.map(function(item) {
          return (
            <div key={item.objectId} className="table-row">
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
// No longer needed, implemented during cache checks 
// function withNull(Component){
//   return function(props){
//     return props.list
//     ? (<Component  {...props}/>)
//     : null
//   }
// }
// const TableWithNull = withNull(Table);

const Button = ({onClick, children}) => 
  <button onClick={onClick} type="button">
    {children}
  </button>

export default App;
