$(document).ready(function(){
  //original html code
  var origHTML = $("body").html();
  
  //Circles and crosses
  var cross = "<i class='fa fa-times' aria-hidden='true' style='font-size: 120px; position: relative; bottom: 5px;'></i>";
  
  var circle = "<i class='fa fa-circle-o' aria-hidden='true' style='font-size: 100px; position: relative; top: 10px;'></i>";
  
  //Initialize game state
  var gameState = [[2,2,2],[2,2,2],[2,2,2]];
  
  //Has game ended?
  var gameEnded = false;
  
  //Boxes filled (checks if game has ended)
  var boxesFilled = 0;

  //Initialize mode
  var AImode = true;
 
  //Initialize player 1
  var p = 0 
  
  //Shapes and players
  var shapeArr = [cross, circle];
  var playerArr = ["Player 1", "Player 2"];
  
  //Returns true if there's a winner
  function gotWinner(n){
    //check rows
    for (var i = 0; i < 3; i++){
      var rowWin = true;
      
      for (var j = 0; j < 3; j++){
        if (gameState[i][j] != n){rowWin = false; break;}
      }
      if (rowWin){break;}
    }
    if (rowWin){return rowWin;}
    
    //check cols
    for (var a = 0; a < 3; a++){
      var colWin = true;
      
      for (var b = 0; b < 3; b++){
        if (gameState[b][a] != n){colWin = false; break;}
      }
      if (colWin){break;}
    }
    if (colWin){return colWin;}
    
    //check diags
    if (gameState[0][0] == n && gameState[1][1] == n && gameState[2][2] == n){
      return true;
      
    } else if (gameState[0][2] == n && gameState[1][1] == n && gameState[2][0] == n){return true;}
  }
  
  //Returns winning coords
  function winningMove(n, m){ //n is self-code, m is enemy code
    var canWin = false;
    var out = [9, 9]; //stores winning coordinates if can win
    
    //check rows
    for (var i = 0; i < 3; i++){
      var countOwn = 0; //set own shape count
      var countNull = 0; //set blank count
      out[0] = 9; //reset row
      out[1] = 9; //reset col
      
      for (var j = 0; j < 3; j++){
        if (gameState[i][j] == m){break;} //if enemy shape present
        else if (gameState[i][j] == n){countOwn += 1;} //add to count
        else if (gameState[i][j] == 2){countNull += 1; out[0] = i; out[1] = j;}//store winning coords
      }
      if (countOwn == 2 && countNull == 1){canWin = true; return out;}//return winning coords if can win
    }
    
    //check cols
    for (var a = 0; a < 3; a++){
      var countOwn = 0; //set own shape count
      var countNull = 0; //set blank count
      out[0] = 9; //reset row
      out[1] = 9; //reset col
      
      for (var b = 0; b < 3; b++){
        if (gameState[b][a] == m){break;} //if enemy shape present
        else if (gameState[b][a] == n){countOwn += 1;} //add to count
        else if (gameState[b][a] == 2){countNull += 1; out[0] = b; out[1] = a;}//store winning coord
      }
      if (countOwn == 2 && countNull == 1){canWin = true; return out;}//return winning coords if can win
    }
    
    //check first diag
    var countOwn = 0; //set own shape count
    var countNull = 0; //set blank count
    out[0] = 9; //reset row
    out[1] = 9; //reset col
      
    for (var c = 0; c < 3; c++){
      if (gameState[c][c] == m){break;} //if enemy shape present
      else if (gameState[c][c] == n){countOwn += 1;} //add to count
      else if (gameState[c][c] == 2){countNull += 1; out[0] = c; out[1] = c;}//store winning coords
    }
    if (countOwn == 2 && countNull == 1){canWin = true; return out;}//return winning coords if can win
    
    //check second diag
    var countOwn = 0; //set own shape count
    var countNull = 0; //set blank count
    out[0] = 9; //reset row
    out[1] = 9; //reset col
    
    for (var d = 0; d < 3; d++){
      if (gameState[d][2-d] == m){break;} //if enemy shape present
      else if (gameState[d][2-d] == n){countOwn += 1;} //add to count
      else if (gameState[d][2-d] == 2){countNull += 1; out[0] = d; out[1] = 2-d;}//store winning coords
    }
    if (countOwn == 2 && countNull == 1){canWin = true; return out;}//return winning coords if can win
    if (!canWin) {return [9, 9];}
  }
  
  //Returns AI move coordinates
  function AImove(){
    //Move for first or second round
    if (boxesFilled < 2){
      if (gameState[1][1] == 2){return [1, 1];}
      else {
        while (true){
          var rand = Math.floor(Math.random()*4);
          if (rand == 0 && gameState[0][0] == 2){return [0, 0];}
          else if (rand == 1 && gameState[0][2] == 2){return [0, 2];}
          else if (rand == 2 && gameState[2][0] == 2){return [2, 0];}
          else if (rand == 3 && gameState[2][2] == 2){return [2, 2];} 
        }
      }
    } else if (boxesFilled == 3 && gameState[1][1] == 1 && winningMove(0, 1)[0] == 9){
      var count;
      var potOut;
      var final = [];
      //top row, left col 00
      //top row, right col 02
      for (var j = 0; j < 3; j = j + 2){
        count = 0
        potOut = [];
        
        for (var i = 0; i < 3; i++){
          if (gameState[0][i] == 0 || gameState[i][j] == 0){count += 1;}
          if (gameState[0][i] == 2){potOut.push([0, i]); console.log(potOut);} //check top row
          if (gameState[i][j] == 2){potOut.push([i, j]);} //check cols
        }
        if (gameState[0][0] == 0 && j == 0){count -= 1;} //handle corner overcounts
        if (gameState[0][2] == 0 && j == 2){count -= 1;}
        
        if (count > 1){
          final = final.concat(potOut);
          console.log("here")
        }
      }
      //bot row, right col 22
      //bot row, left col 20
      for (var b = 0; b < 3; b = b + 2){
        count = 0
        potOut = [];
        
        for (var a = 0; a < 3; a++){
          if (gameState[2][a] == 0 || gameState[a][b] == 0){count += 1;}
          if (gameState[2][a] == 2){potOut.push([2, a]);} //check bot row
          if (gameState[a][b] == 2){potOut.push([a, b]);} //check cols
        }
        if (gameState[2][0] == 0 && b == 0){count -= 1;} //handle corner overcounts
        if (gameState[2][2] == 0 && b == 2){count -= 1;}
        
        if (count > 1){
          final = final.concat(potOut);
        }
      }
      console.log(final);
      var nmax = final.length;
      var rand = Math.floor(Math.random()*nmax);
      
      //handle diagonal cases
      if (final.length != 0){
        return final[rand];
      } else {
        var k = 1 
        while (k != 2){
          var m = Math.floor(Math.random()*3);
          var n = Math.floor(Math.random()*3);
          if (gameState[m][n] == 2){k = 2; return [m, n];}
        }
        
      } 
    } else {
      //handle obvious cases
      var winCoords = winningMove(1, 0); //finds winning coords
      var loseCoords = winningMove(0, 1); //find losing coords
      
      if (winCoords[0] != 9){return winCoords;} //if can win
      else if (loseCoords[0] != 9){return loseCoords;} //if going to lose, block
      else {
        //if no obvious move, anyhow whack
        var hantamChoices = [];
        for (var i = 0; i < 3; i++){
          for (var j = 0; j < 3; j++){
            if (gameState[i][j] == 2){hantamChoices.push([i, j]);}
          }
        }
        var nmax = hantamChoices.length;
        var rand = Math.floor(Math.random()*nmax);
        return hantamChoices[rand];
      }
    }
  }
  
  //AI makes a move, display changes accordingly
  function updateAIMove(){
    var coords = AImove(p+1);
    var row = coords[0];
    var col = coords[1];
    
    //Alter gameState
    gameState[row][col] = p+1;
    
    //Display shape
    row = row + "";
    col = col + "";
    $("#"+row+col).html(shapeArr[p+1]);
      
    //Update
    boxesFilled += 1;
  }
  
  //Human makes move, display changes based on clicked button
  //returns boolean based on validity of move
  function updatePlayerMove(ev){
    //Retrive box location in string form
    var whichBox = ev.target.id;
    
    if (whichBox !== ""){
      //Retrive box location
      var row = parseInt(whichBox[0]);
      var col = parseInt(whichBox[1]);
      
      if (whichBox.length != 2 || gameState[row][col] != 2){
        $(".player").html("Invalid Move!");
        return false;
      } else {
        //Alter gameState
        gameState[row][col] = p;
    
        //Display shape
        $("#"+whichBox).html(shapeArr[p]);
      
        //Update
        boxesFilled += 1;
        return true;
      }
    } else {
      $(".player").html("Invalid Move!");
      return false;
    }
  }
  
  //If someone won or game is over, stop game,
  //update display and gameEnded status
  //also returns string to display in final page
  function checkGame(k){
    var winningStr = "";
    
    if (gotWinner(k)){
      $(".player").html(playerArr[k]+" wins!");
      winningStr = playerArr[k] + " won!";
      gameEnded = true;
        
      //Check if game over
      } else if (boxesFilled == 9) {
        $(".player").html("Game Over!");
        winningStr = "Draw."
        gameEnded = true;
      }
    return winningStr;
  }
  
  //To prevent player from meddling during AI turn
  var AIturn = false;
  
  //Display restart or back to main menu options after game ends
  function gameEndFunction(winner){
    //Display end game window
    document.getElementById("precursor").classList.toggle("show");
    document.getElementById("main").classList.toggle("show");
    var s0 = "<p class='winner'>"+winner+"</p>";
    var s1 = "<div class='restart'>Restart</div><br>";
    var s2 = "<div class='back'>Back to Main Menu</div>";
    $("#precursor").html(s0+s1+s2);
    
    
    //Restart branch
    $(".restart").on("click", function(){
     //Re-Initialize game state
     gameState = [[2,2,2],[2,2,2],[2,2,2]];
     gameEnded = false;
     boxesFilled = 0;
     p = 0;
      
     //Re-display and reset game board
     document.getElementById("precursor").classList.toggle("show");
     document.getElementById("main").classList.toggle("show"); 
     for (var h = 0; h < 3; h++){
       for (var k = 0; k < 3; k++){
         var idStr = ""+h+k;
         $("#"+idStr).html("");
       }
     }
     //Coin flip 
     var randInt = Math.floor(Math.random()*2); 
      
     //AImode 
     if (AImode){
       console.log("RandInt is " + randInt);
       
       if (randInt == 1){ //AI goes first
         AIturn = true; 
         $(".player").html("Computer's"+" turn!");
         setTimeout(function(){
           updateAIMove(); 
           var sOut = checkGame(p+1); 
           AIturn = false;
           $(".player").html(playerArr[p]+"'s"+" turn!");
         }, 1000);
         
       } else { //Player goes first
         AIturn = false;
         $(".player").html(playerArr[p]+"'s"+" turn!");
       }
     //Non-AI mode  
     } else {
       if (randInt == 1){p = 1;}
       $(".player").html(playerArr[p]+"'s"+" turn!"); 
     }
    });
    
    //Back to Main Menu branch
    $(".back").on("click", function(){
      //Reset all
      gameState = [[2,2,2],[2,2,2],[2,2,2]];
      gameEnded = false;
      boxesFilled = 0;
      p = 0;
      playerArr = ["Player 1", "Player 2"];
      
      //Display original HTML
      $("body").html(origHTML);
    });
  }
  
  
  //All the action happens here
  
  
  //Main page: Single player branch activator
  $(".one").on("click", function(){
    //Display form to fill name
    var str = "<p class='playerOneName'>Enter Name:</p><br>";
    var str2 = "<form><input type='text' name='playerOne' id='p1'></form><br>";
    var str3 = "<div class='single startSingleP' id='p1'>Start!</div>";
    $(".wrapper2").html(str+str2+str3);
    
    //Start button activator
    $(".startSingleP").on("click", function(){
      //retrieve player name
      var nameStr = document.getElementById("p1").value;
      //if name is valid, show main game page
      if (nameStr.length > 0){
        playerArr[0] = nameStr
        playerArr[1] = "Computer";
        
        //Flip coin
        var randInt = Math.floor(Math.random()*2);
        
        if (randInt == 0){ //AI starts first then player
          $(".player").html(playerArr[1]+"'s"+" turn!");
          document.getElementById("precursor").classList.toggle("show");
          document.getElementById("main").classList.toggle("show");
          AIturn = true;
          setTimeout(function(){
            updateAIMove();
            var sOut = checkGame(p+1);
            $(".player").html(playerArr[p]+"'s"+" turn!");
            AIturn = false;
          }, 1000);
          
        } else { //Player starts first
          $(".player").html(playerArr[p]+"'s"+" turn!");
          document.getElementById("precursor").classList.toggle("show");
          document.getElementById("main").classList.toggle("show");
        }
      }
    });
  });
  
  //Main page: Double player branch
  $(".two").on("click", function(){
    AImode = false; //set AImode to false
    AIturn = false; //in case prev round was Single player
    
    //Display forms for both players
    var a = "<p class='playerOneNameDbl'>First player name:</p><br>";
    var b = "<form class='dbl'><input type='text' name='playerOne' id='p1dbl'></form><br>";
    var c = "<p class='playerTwoNameDbl'>Second player name:</p><br>";
    var d = "<form class='dbl2'><input type='text' name='playerOne' id='p2dbl'></form><br>";
    var e = "<div class='single startDblP' id='p1'>Start!</div>";
    $(".wrapper2").html(a+b+c+d+e);
    
    //Double player start button activator
    $(".startDblP").on("click", function(){
      var p1name = document.getElementById("p1dbl").value;
      var p2name = document.getElementById("p2dbl").value;
      
      //Only runs with valid names
      if (p1name.length > 0 && p2name.length > 0){
        playerArr[0] = p1name;
        playerArr[1] = p2name;
        
        //Flip coin
        var randInt = Math.floor(Math.random()*2);
        if (randInt == 1){p = 1;} //alter state according to flip
        
        $(".player").html(playerArr[p]+"'s"+" turn!");
        document.getElementById("precursor").classList.toggle("show");
        document.getElementById("main").classList.toggle("show");
        emptyBoxes = $(".wrapper").html();
      }
    });
  });

  $(".box").on("click", function(event){
    
    //Box only responds if game is ongoing and it is not AI's turn
    if (!gameEnded && !AIturn){
      
      var whichBox = event.target.id; //Retrive box location in string form
      var validMove = updatePlayerMove(event); //returns true for valid move
      
      //only proceed to next step only if valid move was made
      if (validMove){
        var sOut = checkGame(p); //check if game has ended
        if (gameEnded){setTimeout(function(){gameEndFunction(sOut);}, 2000);}
        
        //if game is ongoing, AI makes a move
        if (AImode && !gameEnded) {
          $(".player").html("Computer's turn!"); //display comp turn
          AIturn = true; //reset state
          setTimeout(function(){ //everything happens after 1s
            updateAIMove(); //AI makes a move
            var sOut = checkGame(p+1); //updates game, display and returns 'winning string'
            
            if (gameEnded){ //if game ends after comp
              AIturn = true; //prevent player from pressing 
              setTimeout(function(){gameEndFunction(sOut);}, 2000);}
            
            if (!gameEnded){
              AIturn = false; 
              $(".player").html(playerArr[p]+"'s"+" turn!");}
          }, 1000);
          
        } else {
          //if not in AI mode, p state is altered. We wait for 2nd player to move
          if (p == 0){p = 1;}
          else {p = 0;}
          if (!gameEnded){$(".player").html(playerArr[p]+"'s"+" turn!");}
        }  
      }
  }    
  });
});