// The JavaScript Preprocessor "Babel" must be selected in order for this to work
class ButtonDeleteUser extends React.Component {
  handleDelete = param => e => {
    // param is the argument you passed to the function
    // e is the event object that returned
    var name = param;
    console.log(name);
  };
  render(){
    return (
      <button id="button-remove-user" 
              className="btn btn-danger"
              onClick={this.handleDelete(this.props.name)}>
        <i className="fa fa-trash-o"></i>
      </button>
    );
  }
}
const UserCard = (props) => {
  return (
    <div className="user-card">      
      <ButtonDeleteUser name={props.name}/>
      <img src={props.avatar} />      
      <div>
        <div className="user-card-title">
          {props.name}
        </div>
        <div>
          {props.company}
        </div>
      </div>
    </div>

  );
}

const UserCardList = (props) => {
  return (
    <div>      
      {props.cards.map(card => <UserCard {...card} />)} 
    </div>
  );
}

class FormAddUser extends React.Component{
  state={name: ''};
  handleSubmit = (event) => {
    event.preventDefault(); 
    var name = this.state.name; //this.nameInput.value;
    var apiGetUser = "https://api.github.com/users/" + name;
    axios.get(apiGetUser).then(resp => {
      this.props.onSubmit(resp.data);
    });    
  };
  render(){
    return (
      <form id="form-add-user" onSubmit={this.handleSubmit}>
        <input type="text" 
               value={this.state.name}
               onChange={(event) => this.setState({name: event.target.value})}
               placeholder="User name" 
               required/>
        <button type="submit"> Add User </button>
      </form>
    );
  }
}

class App extends React.Component { 
  state ={
    userCards: [
      {
        name: "User name 1",
        company: "Company A",
        avatar: "http://placehold.it/75/0022AA/FFFFFF"
      },
      {
        name: "User name 2",
        company: "Company B",
        avatar: "http://placehold.it/75/22AA00/FFFFFF"
      },
      {
        name: "User name 3",
        company: "Company C",
        avatar: "http://placehold.it/75/AA2200/FFFFFF"
      }, 
    ]
  };

  // Since React components have one way direction, 
  // we need to pass a reference to a function in order to extract the infrmation we need.
  addNewUserCard = (userCardInfo) => {
    console.log(userCardInfo);
  };
  render(){
    return (
      <div>
        <FormAddUser onSubmit={this.addNewUserCard} />
        <UserCardList cards={this.state.userCards}/>
      </div>
    );
  }
}

var app = document.getElementById("app");
ReactDOM.render(<App />, app);
