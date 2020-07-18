
gp=undefined
window.addEventListener("gamepadconnected", function(e) {
  gp = navigator.getGamepads()[e.gamepad.index];
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
});
window.addEventListener("gamepaddisconnected", function(e) {
  console.log("Gamepad disconnected from index %d: %s",
    e.gamepad.index, e.gamepad.id);
});
readGamepad=()=>{
  if (gp) {
    if (gp.buttons[0].pressed) {
      //console.log('space');
    }
    for (let i =0; i < gp.buttons.length; i++) {
      if (gp.buttons[i].pressed) {
        console.log(`pressing button ${i}`);
        console.log(gp.timestamp)
      }
    }
  }
}
