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

// We could pass the properties as 
// {props.cards.map(card => <UserCard name={} company={} avatar={} />)} 
// However, there is an easier way to do this by using the spread operator ...
// This will make all the properties of the user card object available as properties (props) 
const CardList = (props) => {
  return (
    <div>      
      {props.cards.map(card => <UserCard {...card} />)} 
    </div>
  );
}

let data = [
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
];

var app = document.getElementById("app");
ReactDOM.render(<CardList cards={data}/>, app);
