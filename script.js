var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

document.addEventListener("click",click);

function click(){
  CA.newCA();
  CA.beginCA();
  for(var i = 0; i < 10; i++){
    CA.stepCA();
    CA.updateCA();
  }
  render();
}

// BASE STATS
var radius = 16;
var height = 25;
var width = 25;

var CA = {
  // RANDOM STATS
  birth:4, // 1 in how many chance to be born
  birthLimit:4, // neighbours required to live
  deathLimit:3, // neighbours required to be reborn
  // MAP
  map:[],
  newmap:[],
  // CREATE MAP
  newCA(){
    // CREATE MAP
    for(var x = 0; x < width; x++){
        this.map[x] = [];
        for(var y = 0; y < height; y++){
            this.map[x][y] = 0;
        }
    }
    // CREATE NEW MAP
    for(var x = 0; x < width; x++){
        this.newmap[x] = [];
        for(var y = 0; y < height; y++){
            this.newmap[x][y] = 0;
        }
    }
  },

  // BEGIN CELLULAR AUTOMATA
  beginCA(){
    for(var x = 0; x < width; x++){
      for(var y = 0; y < height; y++){
        random(10)<this.birth ? this.map[x][y] = 1 : this.map[x][y] = 0;
      }
    }
  },

  // RUN CELLULAR AUTOMATA CYCLE
  stepCA(){
    for(var x = 0; x < width; x++){
      for(var y = 0; y < height; y++){
        var nbs = countNeighbours(this.map,x,y)
        console.log(nbs);

        // IF ALIVE WITH TOO FEW NEIGHBOURS, THEN KILL CELL
        if(this.map[x][y] === 1){
          if(nbs < this.deathLimit)
          {this.newmap[x][y] = 0;}
          else
          {this.newmap[x][y] = 1;}
        } else { // IF CELL IS DEAD AND HAS ENOUGH NEIGHBOURS TO RESPAWN
          if(nbs > this.birthLimit)
          {this.newmap[x][y] = 1;}
          else
          {this.newmap[x][y] = 0;}
        }
      }
    }
  },

  // UPDATE CELLULAR AUTOMATA MAP
  updateCA(){
    for(var x = 0; x < width; x++){
      for(var y = 0; y < height; y++){
        this.map[x][y] = this.newmap[x][y]
      }
    }
  },

  // DRAW INDIVIDUAL SQUARE BASED ON RADIUS AND COORDINATES
  draw(x,y){
    if(this.map[x][y]===1)
    {ctx.fillStyle = 'dodgerBlue';}
    else if (this.map[x][y] === 0)
    {ctx.fillStyle = 'limegreen';}
    ctx.fillRect(x*radius, y*radius,  radius-1, radius-1);
  },
}

// function to count neighbours of a coordinate
function countNeighbours(map,x,y){
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
          CA.draw(x,y)
      }
  }
}

// RETURNS RANDOM INT
function random(int){
  return(Math.floor((Math.random() * (int+1))));
}

// MAIN CODE
CA.newCA();
CA.beginCA();
render();
