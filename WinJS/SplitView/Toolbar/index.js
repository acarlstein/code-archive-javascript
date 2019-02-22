WinJS.Namespace.define("Sample", {
    commandList: null,
    outputCommand: WinJS.UI.eventHandler(function (ev) {
        var status = document.querySelector(".status");
        var command = ev.currentTarget;
        if (command.winControl) {
            var label = command.winControl.label || command.winControl.icon || "button";
            var section = command.winControl.section || "";
            var msg = section + " command " + label + " was pressed";
            status.textContent = msg;
        }
    })
});

var dataArray = [
    new WinJS.UI.Command(null, { id: 'cmdEdit', label: 'edit', section: 'primary', type: 'button', icon: 'edit', onclick: Sample.outputCommand }),
    new WinJS.UI.Command(null, { id: 'cmdDelete', label: 'delete', section: 'primary', type: 'button', icon: 'delete', onclick: Sample.outputCommand }),
    new WinJS.UI.Command(null, { id: 'cmdFavorite', label: 'favorite', section: 'primary', type: 'toggle', icon: 'favorite', onclick: Sample.outputCommand }),
    new WinJS.UI.Command(null, { id: 'cmdOpenWith', label: 'open with', section: 'primary', type: 'button', icon: 'openfile', onclick: Sample.outputCommand }),
    new WinJS.UI.Command(null, { id: 'cmdDownload', label: 'download', section: 'primary', type: 'button', icon: 'download', onclick: Sample.outputCommand }),
    new WinJS.UI.Command(null, { id: 'cmdPin', label: 'pin', section: 'primary', type: 'button', icon: 'pin', onclick: Sample.outputCommand }),
    new WinJS.UI.Command(null, { id: 'cmdZoom', label: 'zoom', section: 'primary', type: 'button', icon: 'zoomin', onclick: Sample.outputCommand }),
    new WinJS.UI.Command(null, { id: 'cmdFullscreen', label: 'full screen', section: 'primary', type: 'button', icon: 'fullscreen', onclick: Sample.outputCommand })
];

Sample.commandList = new WinJS.Binding.List(dataArray);

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
        
  }); //WinJS.UI.processAll().done
  
})(); //(function() {

