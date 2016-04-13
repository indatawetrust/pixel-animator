'use strict';

var canvas = document.querySelector('#frame'),
    colorSelector = document.querySelector('#colors'),
    c = canvas.getContext('2d'),
    _c = colorSelector.getContext('2d'),
    add = document.querySelector('#add'),
    remove = document.querySelector('#remove'),
    reset = document.querySelector('#reset'),
    start = document.querySelector('#start'),
    colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#bdc3c7'];

var interval = null,
    frames = [],
    isdown = false,
    list = [],
    selectColor = colors[0];

var draw = function draw(maps, opacity) {
  c.clearRect(0, 0, 200, 200);

  maps.forEach(function (map, i) {
    map.forEach(function (_, j) {
      if (maps[i][j].select) {
        c.save();
        c.beginPath();
        c.globalAlpha = opacity;
        c.fillStyle = maps[i][j].color;
        c.fillRect(i * 20, j * 20, 20, 20);
        c.closePath();
        c.restore();
      }

      c.strokeRect(i * 20, j * 20, 20, 20);
    });
  });
};

// color selector
colors.forEach(function (color, i) {
  _c.fillStyle = color;
  _c.fillRect(i * 20, 0, 20, 20);
});

colorSelector.addEventListener('mousedown', function (e) {
  _c.clearRect(0, 0, 200, 20);

  colors.forEach(function (color, i) {
    _c.fillStyle = color;
    _c.fillRect(i * 20, 0, 20, 20);
  });

  var x = e.clientX - 8,
      dx = -1;

  while (x > 0) {
    x -= 20;
    dx++;
  }
  _c.lineWidth = 4;
  _c.strokeRect(dx * 20, 0, 20, 20);
  selectColor = colors[dx];
});

var frame = function frame() {
  var maps = [];

  for (var i = 0; i < 10; i++) {
    var _ = [];
    for (var j = 0; j < 10; j++) {
      _.push({
        select: 0,
        color: '#fff',
        opacity: 1
      });
    }
    maps.push(_);
  }

  return maps;
};

frames.push(frame());

draw(frames[0]);

canvas.addEventListener('mousedown', function (e) {
  isdown = true;

  var x = e.clientX - 8;
  var y = e.clientY - 8;
  var dx = -1;var dy = -1;
  while (x > 0) {
    x -= 20;
    dx++;
  }
  while (y > 0) {
    y -= 20;
    dy++;
  }

  if (list.indexOf(dx + '' + dy) == -1) {
    frames[frames.length - 1][dx][dy].select = !frames[frames.length - 1][dx][dy].select;
    frames[frames.length - 1][dx][dy].color = selectColor;

    draw(frames[frames.length - 1], 1);
    list.push(dx + '' + dy);
  }
});

canvas.addEventListener('mousemove', function (e) {
  if (isdown) {
    var x = e.clientX - 8;
    var y = e.clientY - 8;
    var dx = -1;var dy = -1;
    while (x > 0) {
      x -= 20;
      dx++;
    }
    while (y > 0) {
      y -= 20;
      dy++;
    }

    if (list.indexOf(dx + '' + dy) == -1) {
      frames[frames.length - 1][dx][dy].select = !frames[frames.length - 1][dx][dy].select;
      frames[frames.length - 1][dx][dy].color = selectColor;

      draw(frames[frames.length - 1], 1);
      list.push(dx + '' + dy);
    }
  }
});

canvas.addEventListener('mouseup', function (e) {
  isdown = false;
  list = [];
});

canvas.addEventListener('mouseout', function (e) {
  isdown = false;
  list = [];
});

add.addEventListener('click', function () {
  frames.push(frame());
  draw(frames[frames.length - 2], 0.5);
});

remove.addEventListener('click', function () {
  clearInterval(interval);
  frames.pop();

  if (frames.length) {
    draw(frames[frames.length - 1], 1);
  } else {
    frames.push(frame());
    draw(frames[0]);
  }
});

start.addEventListener('click', function () {
  var i = -1;

  interval = setInterval(function () {
    if (frames.length - 1 == i++) i = 0;
    draw(frames[i], 1);
  }, 100);

  start.setAttribute('disabled', 1);
});

reset.addEventListener('click', function () {
  start.removeAttribute('disabled');

  clearInterval(interval);
  frames = [];
  frames.push(frame());
  draw(frames[0]);
});