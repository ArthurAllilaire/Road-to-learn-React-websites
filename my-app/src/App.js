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
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

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
    this.fetchSearchTopstories(query);
    event.preventDefault();
  }
  setSearchTopstories(result){
    this.setState({result});
  }
  fetchSearchTopstories(query){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }
  componentDidMount() {
    const { query } = this.state;
    this.fetchSearchTopstories(query);
  }
  render(){
    const {result,query} = this.state;
    return(
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.handleSubmit} />
        </div>
        <TableWithNull list={result} query={query}/>
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

export default App;
