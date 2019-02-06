// The JavaScript Preprocessor "Babel" must be selected in order for this to work



class Button extends React.Component {
  constructor(properties){
    super(properties);
    this.handleClick = () => {
      this.props.onClickFunction(this.props.incrementValue);
    };
  }
  render(){
    // When we use the wrapper or bind method, we are creating a new function for every render button  
    // We can void this in this way:
    return (      
      <button onClick={this.handleClick}>
        +{this.props.incrementValue}
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
  incrementCounter = (incrementValue) =>{
    this.setState((prevState) => ({
      counter: prevState.counter + incrementValue
    }));
  };

  render(){
    return(
      <div>
        <Button incrementValue={1} onClickFunction={this.incrementCounter}/>
        <Button incrementValue={5} onClickFunction={this.incrementCounter}/>
        <Button incrementValue={10} onClickFunction={this.incrementCounter}/>
        <Button incrementValue={25} onClickFunction={this.incrementCounter}/>
        <Button incrementValue={100} onClickFunction={this.incrementCounter}/>        
        <Result counter={this.state.counter}/>
      </div>    
    );
  }
}

ReactDOM.render(<App />, 
                document.getElementById("app"));