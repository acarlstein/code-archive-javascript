// The JavaScript Preprocessor "Babel" must be selected in order for this to work

// Use class component when you need to manage the state of the object and personalized events handlers. 

const UserCard = (props) => {
  return (
    // If you wish to use a CSS class, use className.
    // If you wish to set the CSS inline pass a javascript object with {{}}
    // Also, you can apply both at the same time if you wish.

    <div className="user-card">
      <img src={props.avatar} />      
      <div style={{display: 'inline-block', marginLeft: 10, marginRight: 10}}>
        <div className="user-card-title" 
          style={{fontWeight: 'bold'}}>
          {props.name}
        </div>
        <div>
          {props.company}
        </div>
      </div>
    </div>

  );
}

const CardList = (props) => {
  return (
    <div>      
      <UserCard avatar="http://placehold.it/75/0022AA/FFFFFF"
                name="User name 0" 
                company="Company X"/>  
      <UserCard avatar="http://placehold.it/75/0022AA/FFFFFF"
                name="User name 1" 
                company="Company A"/>   
    </div>
  );
}

var app = document.getElementById("app");
ReactDOM.render(<CardList />, app);
