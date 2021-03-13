// import logo from './logo.svg';
//Commands: // Runs the app in http://localhost:3000
// npm start
// Runs the tests
// npm test
// Builds the app for production
// npm run build

import './App.css';
import React from 'react';
// //Api url values
// const DEFAULT_QUERY = 'redux';
// const PATH_BASE = 'https://hn.algolia.com/api/v1';
// const PATH_SEARCH = '/search';
// const PARAM_SEARCH = 'query=';

const list = [
{
title: 'React',
url: 'https://facebook.github.io/react/',
author: 'Jordan Walke',
num_comments: 3,
points: 4,
objectID: 0,
},
{
title: 'Redux',
url: 'https://github.com/reactjs/redux',
author: 'Dan Abramov, Andrew Clark',
num_comments: 2,
points: 5,
objectID: 1,
}
];

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list,
      query: "",
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  onSearchChange(event){
    this.setState({query: event.target.value});
  }
  handleSubmit(event){
    event.preventDefault();
    if (this.state.query !== ""){
      this.setState({query: "Thanks for submitting!"})
    }
  }
  render(){
    const {list,query} = this.state;
    return(
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.handleSubmit}>
            <Search />
          </Search>
        </div>
        <Table list={list} query={query} />
      </div>
    )
  }
}
const Search = (props) => {
    const { value, onChange, onSubmit, children } = props;
    return (
      <form onSubmit={onSubmit}>
        {children} <input type="text" value={value} onChange={onChange} />
      </form>
    );
}

function Table (props){
    const {list,query} = props;
    let filtList = list.filter(
      function(item){
        return !this || item.title.toLowerCase() === this.toLowerCase()
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

export default App;
