(function() {
    // Wire XYFocus up to the arrow keys
    WinJS.UI.XYFocus.keyCodeMap.up.push(WinJS.Utilities.Key.upArrow);
    WinJS.UI.XYFocus.keyCodeMap.down.push(WinJS.Utilities.Key.downArrow);
    WinJS.UI.XYFocus.keyCodeMap.left.push(WinJS.Utilities.Key.leftArrow);
    WinJS.UI.XYFocus.keyCodeMap.right.push(WinJS.Utilities.Key.rightArrow);
  
    function setUpNavigation(){
      console.log("setUpNavigation()");     
      var contentText = document.querySelector(".contenttext"); 
      var contentTextSaved = contentText.innerHTML;
      var splitViewCommands =  document.querySelectorAll('[data-win-control="WinJS.UI.SplitViewCommand"]');
   
      for (var commandKey in splitViewCommands){      
        var dataset = splitViewCommands[commandKey].dataset;
        if(dataset !== undefined){
          var dataset = Object.assign({}, dataset);
          var winOptions = dataset.winOptions;
         
          // Better this than using Eval which can become unsafe.
          // Need to change regular expression to accept http and https wihtout adding double double quotes.
          winOptions = winOptions.replace((/([\w]+)(:)/g), "\"$1\"$2").replace((/'/g), "\"");
          console.log("winOptions: " + winOptions);
          winOptions = JSON.parse(winOptions);
          console.log("url: " + winOptions.url);
          if (winOptions.default !== undefined && winOptions.default){
            if (winOptions.url !== undefined){
              var url = "http://" + winOptions.url;
              console.log("Loading default url: " + url);
              WinJS.UI.Fragments.renderCopy(url, contentText);
            }else{
              if (contentText.innerHTML != contentTextSaved){
                contentText.innerHTML = contentTextSaved;
              }
            }
          }      
          
          if (winOptions.url !== undefined){          
            splitViewCommands[commandKey].addEventListener("click", function(){      
              var url = "http://" + winOptions.url;
              console.log("Loading click: " + url);
              WinJS.UI.Fragments.renderCopy(url, contentText);
            });
          }
        }
      }
      
    }
    
    WinJS.UI.processAll().done(function () {
  
        // Set up SplitView and XYFocus with keyboard on SplitView
        var splitView = document.querySelector(".splitView").winControl;
        new WinJS.UI._WinKeyboard(splitView.paneElement); // Temporary workaround: Draw keyboard focus visuals on NavBarCommands
  
        // Set up toggle focus on Toggle Split View
        var startItem = document.querySelector('.start');
        var toggleSplitViewFocus = function() {
            var obj = document.getElementById("splitViewFocusToggle").winControl;
            console.log("SplitView Button Focus toggled. Current status: " + (obj.checked ? "on" : "off"));
            if (obj.checked){
              startItem.focus();    
            }else{
              startItem.blur();    
            }
        }
        
        var splitViewFocusToggle = document.querySelector("#splitViewFocusToggle");
        splitViewFocusToggle.addEventListener("change", toggleSplitViewFocus);
        
        setUpNavigation();
       
       
    });
    
  })();