// The JavaScript Preprocessor "Babel" must be selected in order for this to work

class Button extends React.Component {
  constructor(properties){
    super(properties);
    this.handleClick = () => {
      this.setState((prevState) => {
        return {
          counter: prevState.counter + 1
        }        
      })
    };
  }
  render(){
    return (      
      <button onClick={this.props.onClickFunction}>
        +1
      </button>
    );
  }
}

const Result = (props) => {
  return(
    <div>Result: {props.counter}</div>
  );
};

class App extends React.Component{
  state = {
    counter: 0
  };
  incrementCounter = () =>{
    this.setState((prevState) => ({
      counter: prevState.counter + 1
    }));
  };

  render(){
    return(
      <div>
        <Button onClickFunction={this.incrementCounter}/>
        <Result counter={this.state.counter}/>
      </div>    
    );
  }
}

ReactDOM.render(<App />, 
                document.getElementById("app"));