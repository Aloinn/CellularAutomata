var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//document.addEventListener("click",click);
function generate(){
  CA.run()
}

// LIMITS NUMERIC INPUT BY PUTTING MAX/MIN
document.getElementById("FLOOD").oninput = function () {
    if (this.value > 150) {
        this.value = 150;
    }
}
document.getElementById("STEPS").oninput = function () {
    if (this.value > 25) {
        this.value = 25;
    }
}

// CREATE A TABLE
function createTable(masses) {
  var html = "<table>";


  for(var i in masses) {
      html+="<tr>";
      html+="<td>"+i+"</td>";
      html+="<td>"+masses[i].type+"</td>";
      html+="<td>"+masses[i].count+"</td>";
      html+="<td>"+masses[i].origin+"</td>";

      html+="</tr>";
  }
  html+="</table>";
  document.getElementById("masslist").innerHTML = html;
}

// BASE STATS
var radius = 16;
var height = 25;
var width = 25;

// CHANGE SIZES OF MAP
function big(){
  radius = 8;
  height = 50;
  width = 50;
}

function small(){
  radius = 16;
  height = 25;
  width = 25;
}

function huge(){
  radius = 4;
  height = 100;
  width = 100;
}

// RENDERS THE MAP
function render(){
  var BR = document.getElementById("BR");
  var BL = document.getElementById("BL");
  var DL = document.getElementById("DL");
  var STEPS = document.getElementById("STEPS");
  var FLOOD = document.getElementById("FLOOD");

  BR.innerHTML = CA.birth;
  BL.innerHTML = CA.birthLimit;
  DL.innerHTML = CA.deathLimit;
  STEPS.innerHTML = CA.step;
  FLOOD.innerHTML = CA.flood;

}
// COMMAND WHEN PLAYER PRESSES FILL
function floodFill(){
  CA.correct(CA.countLands());
  CA.render();
}

var CA = {
  // RANDOM STATS
  birth:4, // 1 in how many chance to be born
  birthLimit:4, // neighbours required to live
  deathLimit:3, // neighbours required to be reborn

  // CHANGE VALUES
  changeInput(i){
    switch(i){
      case 0: //BIRTH RATE
        if(this.birth===9)
        {this.birth = 0;}
        else
        {this.birth +=1;}
        break;
      case 1: //BIRTH LIMIT
        if(this.birthLimit===9)
        {this.birthLimit = 0;}
        else
        {this.birthLimit +=1;}
        break;
      case 2: //DEATH LIMIT
        if(this.deathLimit===9)
        {this.deathLimit = 0;}
        else
        {this.deathLimit +=1;}
        break;
    }
    render();

  },

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
        var nbs = this.countNeighbours(this.map,x,y)

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
    copyMap(this.map, this.newmap);
  },

  // FLOOR FILL ALL ACTIVE SQUARES
  countMass(x,y,type){
    // COUNT NUMBER TO GO
    var count = -1;
    var toCheck = [];
    toCheck.push([x,y])
    // CREATE FLOODMAP
    var floodMap = [];
    for(var x = 0; x < width; x++){
        floodMap[x] = [];
        for(var y = 0; y < height; y++){
            floodMap[x][y] = 0;
        }
    }

    copyMap(floodMap, this.map);

    function check(coords){
      var x = coords[0];
      var y = coords[1];
      if(x!=width-1){
        if(floodMap[x+1][y]===type)
        {toCheck.push([x+1,y]); floodMap[x+1][y]=2;}
      }
      if(x!= 0){
        if(floodMap[x-1][y]===type)
      {toCheck.push([x-1,y]); floodMap[x-1][y]=2;}
      }
      if(y!=height-1){
        if(floodMap[x][y+1]===type)
        {toCheck.push([x,y+1]); floodMap[x][y+1]=2;}
      }
      if(y!=0){
        if(floodMap[x][y-1]===type)
        {toCheck.push([x,y-1]); floodMap[x][y-1]=2;}
      }
    }

    while(toCheck.length != 0){
      check(toCheck.pop())
      count +=1;
    }
    return count;
  },

  // FINDS ALL INDIVIDUAL ISLANDS
  countLands(){
    // COUNT NUMBER TO GO
    var count = 0;
    var masses = {};
    var toCheck = [];
    // CREATE FLOODMAP
    var countMap = [];
    for(var x = 0; x < width; x++){
        countMap[x] = [];
        for(var y = 0; y < height; y++){
            countMap[x][y] = 0;
        }
    }

    copyMap(countMap, this.map)

    // CHECKS IF A TILE IS ADJACENT TO SAID TILE AND ADDS IT TO THE LIST
    function check(coords,type){
      var x = coords[0];
      var y = coords[1];
      if(x!=width-1){
        if(countMap[x+1][y]===type)
        {toCheck.push([x+1,y]); countMap[x+1][y]=2;}
      }
      if(x!= 0){
        if(countMap[x-1][y]===type)
      {toCheck.push([x-1,y]); countMap[x-1][y]=2;}
      }
      if(y!=height-1){
        if(countMap[x][y+1]===type)
        {toCheck.push([x,y+1]); countMap[x][y+1]=2;}
      }
      if(y!=0){
        if(countMap[x][y-1]===type)
        {toCheck.push([x,y-1]); countMap[x][y-1]=2;}
      }
    }

    // COUNT HOW MANY TILES ARE CONNECTED TO THE COORDS
    function countMass(type){
      var num = -1;
      while(toCheck.length != 0){
        check(toCheck.pop(),type);
        num +=1;
      } return num;
    }

    // ITERATES THROUGH THE COUNTING MAP
    for(var x = 0; x < width; x++){
        for(var y = 0; y < height; y++){
            if(countMap[x][y]!==2){
              var type = countMap[x][y];
              var name = count.toString()+"-"+(type === 1?'L':'W');

              masses[name] = new Object();

              toCheck.push([x,y]);
              masses[name].origin = [x,y];
              masses[name].count = Math.max(countMass(type),1);
              masses[name].type = (type === 1?'lake':'island');
              count +=1;
            }
        }
    }
    return masses;
  },

  // function to count neighbours of a coordinate
  countNeighbours(map,x,y){
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
  },

  // FILL IN SMALL BODIES
  correct(masses){
    var count = Object.keys(masses).length;
    for(var mass in masses){
      if(masses[mass].type === 'lake' && masses[mass].count < parseInt(document.getElementById("FLOOD").value)+1)
      {this.floodFill(masses[mass].origin);}
      console.log(document.getElementById("FLOOD").value+1)
    }
  },

  // FILL IN A WATER BODY WITH LAND
  floodFill(coords){
    var xx = coords[0];
    var yy = coords[1];

    var toCheck = [];
    toCheck.push([xx,yy])
    // CREATE FLOODMAP

    function check(map,coords){
      var x = coords[0];
      var y = coords[1];

      if(map[x][y]===1)
      {map[x][y]=0;}

      if(x!=width-1){
        if(map[x+1][y]===1)
        {toCheck.push([x+1,y]); map[x+1][y]=0;}
      }
      if(x!= 0){
        if(map[x-1][y]===1)
      {toCheck.push([x-1,y]); map[x-1][y]=0;}
      }
      if(y!=height-1){
        if(map[x][y+1]===1)
        {toCheck.push([x,y+1]); map[x][y+1]=0;}
      }
      if(y!=0){
        if(map[x][y-1]===1)
        {toCheck.push([x,y-1]); map[x][y-1]=2;}
      }
    }
    while(toCheck.length != 0){
      check(this.map,toCheck.pop())
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

  // RENDER THE MAP 2D ARRAY
  render(){
    ctx.clearRect(0,0,400,400);
    for(var x = 0; x < width; x++){
        for(var y = 0; y < height; y++){
            this.draw(x,y)
        }
    }
    createTable(this.countLands());
  },

  // RUN ALL PROCESSES
  run(){
    this.newCA();
    this.beginCA();
    for(var i = 0; i < document.getElementById("STEPS").value; i++){
      this.stepCA();
    }
    this.render();
  }
}

// RETURNS RANDOM INT
function random(int){
  return(Math.floor((Math.random() * (int+1))));
}

// COPY MAP 1 TO MAP 2
function copyMap(map1, map2){
  for(var x = 0; x < width; x++){
    for(var y = 0; y < height; y++){
      map1[x][y] = map2[x][y];
    }
  }
}

// MAIN CODE
CA.run();
render();
