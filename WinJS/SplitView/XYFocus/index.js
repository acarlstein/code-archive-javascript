(function() {
    // Wire XYFocus up to the arrow keys
    WinJS.UI.XYFocus.keyCodeMap.up.push(WinJS.Utilities.Key.upArrow);
    WinJS.UI.XYFocus.keyCodeMap.down.push(WinJS.Utilities.Key.downArrow);
    WinJS.UI.XYFocus.keyCodeMap.left.push(WinJS.Utilities.Key.leftArrow);
    WinJS.UI.XYFocus.keyCodeMap.right.push(WinJS.Utilities.Key.rightArrow);
  
    WinJS.UI.processAll().done(function () {
  
        var splitView = document.querySelector(".splitView").winControl;
        new WinJS.UI._WinKeyboard(splitView.paneElement); // Temporary workaround: Draw keyboard focus visuals on NavBarCommands
  
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
        
       
      
       
    });
    
  })();