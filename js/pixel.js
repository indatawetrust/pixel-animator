const canvas = document.querySelector('canvas'),
      c = canvas.getContext('2d'),
      add = document.querySelector('#add'),
      remove = document.querySelector('#remove'),
      reset = document.querySelector('#reset'),
      start = document.querySelector('#start'),
      colors = ['#1abc9c','#2ecc71','#3498db','#9b59b6','#34495e',
      		'#f1c40f','#e67e22','#e74c3c','#95a5a6','#bdc3c7'];

let interval = null,frames = [],isdown = false,list = [];

const draw = (maps,opacity) => {
  c.clearRect(0,0,200,200);
  
  maps.forEach((map,i) => {
    map.forEach((_,j) => {
      if(maps[i][j]){
      	c.save();
        c.beginPath();
        c.globalAlpha = opacity;
        c.fillRect(i*20,j*20,20,20);
        c.closePath();
      	c.restore();
      }else{
        c.strokeRect(i*20,j*20,20,20);
      }
    });
  });
}

const frame = () => {
  const maps = [];

  for(let i=0;i<10;i++){
    let _ = [];
    for(let j=0;j<10;j++){
      _.push(0);
    }
    maps.push(_);
  }

  return maps;
}

frames.push(frame());

draw(frames[0]);

canvas.addEventListener('mousedown',(e) => {
  isdown = true;

  let [x,y] = [e.clientX-8,e.clientY-8],
      dx = -1, dy = -1;

  while(x > 0){
    x -= 20;
    dx++;
  }
  while(y > 0){
    y -= 20;
    dy++;
  }

  if(list.indexOf(dx + '' + dy) == -1){
    frames[frames.length-1][dx][dy] = !frames[frames.length-1][dx][dy];

    draw(frames[frames.length-1],1);
    list.push(dx + '' + dy);
  }
});

canvas.addEventListener('mousemove',(e) => {
   if(isdown){
    let [x,y] = [e.clientX-8,e.clientY-8],
  	dx = -1, dy = -1;
    
    while(x > 0){
      x -= 20;
      dx++;
    }
    while(y > 0){
      y -= 20;
      dy++;
    }
    
    if(list.indexOf(dx + '' + dy) == -1){
      frames[frames.length-1][dx][dy] = !frames[frames.length-1][dx][dy];

      draw(frames[frames.length-1],1);
      list.push(dx + '' + dy);
    }
  }
});

canvas.addEventListener('mouseup',(e) => {
  isdown = false;
  list = [];
});

canvas.addEventListener('mouseout',(e) => {
  isdown = false;
  list = [];
});

// add frame
add.addEventListener('click',() => {
  frames.push(frame());
  draw(frames[frames.length-2],0.5);
});

// remove frame
remove.addEventListener('click',() => {
  frames.pop()
  if(frames.length){
    draw(frames[frames.length-1],1);
  }else{
    frames.push(frame()); 
    draw(frames[0]);
  }
});

// start animation
start.addEventListener('click',() => {
  let i=-1;
  
  interval = setInterval(() => {
    if(frames.length - 1 == i++)
    i = 0;
    draw(frames[i],1);
  },100);
  
  start.setAttribute('disabled',1);
});

// reset animation
reset.addEventListener('click',() => {
  start.removeAttribute('disabled');

  clearInterval(interval);
  frames = [];
  frames.push(frame());
  draw(frames[0]);
});
