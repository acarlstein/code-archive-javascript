// The JavaScript Preprocessor "Babel" must be selected in order for this to work

var HelloTitle = React.createClass({
    render: function() {
      return ( <h2>Experimenting with React - 1 - Hello World</h2> );
    }
  });
  ReactDOM.render(<HelloTitle />, document.getElementById("titleHello"));
  
  const ButtonGo = function(){
    return ( <button>Go</button> );
  };
  ReactDOM.render(<ButtonGo />, document.getElementById("buttonGo"));
  
  // Properties are immutable
  const ButtonWithProperty = function(properties){
    return ( <button>{properties.label}</button> );
  };
  ReactDOM.render(<ButtonWithProperty label="Do"/>, 
                  document.getElementById("buttonWithProperty"));
  
  class CounterButton extends React.Component {
    constructor(properties){
      super(properties);
      this.state = {
        counter: 0
      };
      this.handleClick = () => {
        // React setState method is an asynchronous method
        // that schedules an update. There may be a race condition
        this.setState({
          counter: this.state.counter + 1
        })
      };
    }
    render(){
      return (      
        <button onClick={this.handleClick}>
          Click to Increase: {this.state.counter}
        </button>
      );
    }
  }
  ReactDOM.render(<CounterButton />, document.getElementById("counterButton"));
  
  class CounterButtonWithoutRaceCondition extends React.Component {
    constructor(properties){
      super(properties);
      this.state = {
        counter: 0
      };
      this.handleClick = () => {
        // React setState method is an asynchronous method
        // that schedules an update. There may be a race condition.
        // This prevents the race condition.
        this.setState((prevState) => {
          return {
            counter: prevState.counter + 1
          }        
        })
      };
    }
    render(){
      return (      
        <button onClick={this.handleClick}>
          Click to Increase (without Race Condition): {this.state.counter}
        </button>
      );
    }
  }
  ReactDOM.render(<CounterButtonWithoutRaceCondition />, 
                  document.getElementById("counterButtonWithoutRaceCondition"));