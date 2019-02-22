function generateItems(numberOfTimes) {
    var itemArray = [
        { title: "Marvelous Mint", text: "Gelato", picture: "/images/fruits/60Mint.png" },
        { title: "Succulent Strawberry", text: "Sorbet", picture: "/images/fruits/60Strawberry.png" },
        { title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "/images/fruits/60Banana.png" },
        { title: "Lavish Lemon Ice", text: "Sorbet", picture: "/images/fruits/60Lemon.png" },
        { title: "Creamy Orange", text: "Sorbet", picture: "/images/fruits/60Orange.png" },
        { title: "Very Vanilla", text: "Ice Cream", picture: "/images/fruits/60Vanilla.png" },
        { title: "Banana Blast", text: "Low-fat frozen yogurt", picture: "/images/fruits/60Banana.png" },
        { title: "Lavish Lemon Ice", text: "Sorbet", picture: "/images/fruits/60Lemon.png" }
    ];

    // Generate items by looping through itemArray by the numberOfTimes given
    var items = [];
    for (var i = 0; i < numberOfTimes; i++) {
        itemArray.forEach(function (item) {
            items.push(item);
        });
    }

    return items;
};

// Generate 16 items
var items = generateItems(2);
var data = new WinJS.Binding.List(items);

var groupedData = data.createGrouped(function (item) {
    return item.title.toUpperCase().charAt(0);
}, function (item) {
    return {
        title: item.title.toUpperCase().charAt(0)
    };
}, function (left, right) {
    return left.charCodeAt(0) - right.charCodeAt(0);
});

WinJS.Namespace.define("Sample.ListView", {
    generate: generateItems,
    data: groupedData,
    eh: {
        footerVisibility: WinJS.UI.eventHandler(function (ev) {
            var visible = ev.detail.visible;
            if (visible) {
                WinJS.Utilities.removeClass(Sample.ListView.progress, "hide");
                WinJS.UI.Animation.fadeIn(Sample.ListView.status);

                // Simulate XHR by just setting a timeout and updating the observable binding list
                WinJS.Promise.timeout(100).then(function () {
                    var items = Sample.ListView.generate(2);
                    items.forEach(function (item) {
                        Sample.ListView.data.push(item);
                    });
                });
            } else {
                WinJS.Utilities.addClass(Sample.ListView.progress, "hide");
            }
        })
    }
});

// Cache ListView and Header elements
Sample.ListView.listView = document.querySelector(".listView");
Sample.ListView.header = document.querySelector(".header");
Sample.ListView.progress = document.querySelector(".footer .progress");
Sample.ListView.status = document.querySelector(".footer .status");

// Data bind header element and split pane element
WinJS.Binding.processAll(Sample.ListView.header, Sample.ListView).then(function () {
    return WinJS.Binding.processAll(Sample.ListView.splitPane, Sample.ListView);
}).then(function () {
    // Process UI to initialize WinJS controls 
    return WinJS.UI.processAll();
});

var msToTime = function(duration) {
  var milliseconds = parseInt((duration % 1000)/100);
  var seconds = parseInt((duration / 1000) % 60);
  var minutes = parseInt((duration / (1000*60)) % 60);
  var hours = parseInt((duration / (1000*60*60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
};
