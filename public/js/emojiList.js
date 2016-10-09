/**
 * Appends a list of emoji PNG images to the Emoji List
 */

var fileNames = ["1f600.png", "1f601.png", "1f602.png", "1f603.png", "1f604.png", "1f605.png", "1f606.png", "1f607.png", "1f609.png", "1f60a.png", "1f60b.png", "1f60c.png", "1f60d.png", "1f60e.png", "1f60f.png", "1f610.png", "1f611.png", "1f612.png", "1f613.png", "1f614.png", "1f615.png", "1f616.png", "1f618.png", "1f619.png", "1f61a.png", "1f61b.png", "1f61c.png", "1f61d.png", "1f61e.png", "1f61f.png", "1f620.png", "1f621.png", "1f622.png", "1f623.png", "1f624.png", "1f625.png", "1f627.png", "1f628.png", "1f629.png", "1f62a.png", "1f62b.png", "1f62c.png", "1f62d.png", "1f62e.png", "1f62f.png", "1f630.png", "1f631.png", "1f635.png", "1f637.png", "1f639.png", "1f63b.png", "263a.png", "270c.png", "1f44c.png", "1f44d.png", "1f494.png", "1f495.png", "1f496.png", "2665.png", "2764.png"];

var emojiListContainer = document.getElementById("emojiListContainer");

for(var i = 0; i < 60; i++) {
  var emoji = document.createElement("img");
  emoji.src = "/emojis/" + fileNames[i];
  emoji.className = "emojiImage";
  emojiListContainer.appendChild(emoji);
}
