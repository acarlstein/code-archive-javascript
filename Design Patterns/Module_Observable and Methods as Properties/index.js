var Book = (function(){
    // Private
    var _name;
    var _price;
    var priceChanging = [];
    var priceChanged = [];
 
    var updatePriceChanging = function(_this, value){
        for (var i = 0; i < priceChanging.length; ++i){
            if (!priceChanging[i](this, value)){
                return true;
            }
        }
        return false;
    }
 
    var updatePriceChanged = function(_this){
        for (var i = 0; i < priceChanged.length; ++i){
            priceChanged[i](_this);
        }
    }
 
    //Public
    return {
        factory(name, price){
            _name = name;
            _price = price;
            return this;
        }
        ,name: function(){
            return _name;
        }
        , price: function(value){
            if (value !== undefined
                && value != _price){
                var isPriceTooHigh = updatePriceChanging(this, value)
                if (isPriceTooHigh){
                    return _price;
                }
                _price = value;    
                updatePriceChanged(this);
            }                
            return _price;
        }
        ,onPriceChanging: function(callback){
            priceChanging.push(callback);
        }
        , onPriceChanged: function(callback){
            priceChanged.push(callback);
        }
 
    }
 
})();
 
var book = Book.factory('Lord Of the Rings', 23.99);
 
console.log(book.name());
console.log(book.price());
 
book.onPriceChanging(function(book, price){
    console.log('Changing book price to $' + price);
    if (price > 100){
        console.log('-> [X] Price ($' + price + ") is too high. No changing price");
        return false;
    }
    return true;
});
 
book.onPriceChanged(function(book){
    console.log("The book '" + book.name() + ' changed price to $' + book.price());
});
 
book.price(19.99);
book.price(200.00);
book.price(99.01);