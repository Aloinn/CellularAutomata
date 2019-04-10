var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

document.addEventListener("click",click);

function click(){
  stepCA();
  //console.table(newmap)
  updateCA();
  render();
}

// BASE STATS
var radius = 8;
var height = 50;
var width = 50;

// RANDOM STATS
var birth = 5; // 1 in how many chance to be born
var birthLimit = 2; // neighbours required to live
var deathLimit = 1; // neighbours required to be reborn
function random(int){
  return(Math.floor((Math.random() * (int+1))));
}
// CREATE MAP
var map = [];
for(var x = 0; x < width; x++){
    map[x] = [];
    for(var y = 0; y < height; y++){
        map[x][y] = 0;
    }
}
var newmap = [];
for(var x = 0; x < width; x++){
    newmap[x] = [];
    for(var y = 0; y < height; y++){
        newmap[x][y] = 0;
    }
}

// BEGIN CELLULAR AUTOMATA
function beginCA(){
  for(var x = 0; x < width; x++){
    for(var y = 0; y < height; y++){
      random(10)<birth ? map[x][y] = 1 : map[x][y] = 0;
    }
  }
}

// RUN CELLULAR AUTOMATA CYCLE
function stepCA(){
  for(var x = 0; x < width; x++){
    for(var y = 0; y < height; y++){
      var nbs = countNeighbours(x,y)
      console.log(nbs);

      // IF ALIVE WITH TOO FEW NEIGHBOURS, THEN KILL CELL
      if(map[x][y] === 1){
        if(nbs < deathLimit)
        {newmap[x][y] = 0;}
        else
        {newmap[x][y] = 1;}
      } else { // IF CELL IS DEAD AND HAS ENOUGH NEIGHBOURS TO RESPAWN
        if(nbs > birthLimit)
        {newmap[x][y] = 1;}
        else
        {newmap[x][y] = 0;}
      }
    }
  }
}

// UPDATE THE MAP
function updateCA(){
  for(var x = 0; x < width; x++){
    for(var y = 0; y < height; y++){
      map[x][y] = newmap[x][y]
    }
  }
}

// function to count neighbours of a coordinate
function countNeighbours(x,y){
  // COUNTS HOW MANY NEIGHBOURS
  var count = 0;
  for(var xx = -1; xx < 2; xx +=1){
    for(var yy = -1; yy < 2; yy +=1){
      // COORDINATE OF NEIGHBOURS
      var nx = x + xx;
      var ny = y + yy;
      // DO NOTHING BECAUSE THIS IS OUR TILE
      if( xx === 0 && yy === 0){}
      // ADD TO NEIGHBOUR IF TILE IS NEAR EDGE OF MAP
      else if(nx < 0 || ny < 0 || nx >= width || ny >= height){
        count ++;
      }
      // OTHERWISE DO A NORMAL CHECK FOR NEIGHBOUR
      else if(map[nx][ny]===1){
        count ++;
      }
    }
  }

  // ONCE THE COUNT IS DONE RETURN THE NUMBER OF NEIGHBOURS
  return count;
}

// RENDER THE MAP 2D ARRAY
function render(){
  for(var x = 0; x < width; x++){
      for(var y = 0; y < height; y++){
          draw(x,y)
      }
  }
}

// DRAW INDIVIDUAL SQUARE BASED ON RADIUS AND COORDINATES
function draw(x,y){
  if(map[x][y]===1)
  {ctx.fillStyle = 'dodgerBlue';}
  else if (map[x][y] === 0)
  {ctx.fillStyle = '#efefef';}
  ctx.fillRect(x*radius, y*radius,  radius-1, radius-1);
}

// MAIN CODE
beginCA();
render();
