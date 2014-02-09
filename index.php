

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />
	<script type="text/javascript"> 
	    
	    // matches[n,0] and [n,1] contain the index of the arrays that 
	    var matches = [[1,2,"Oregon","Stanford",71,70,"Oregon"],
				    [3,4,"Oregon","Washington",66,59,"Oregon"],
				    [5,6,"Stanford","UCLA",72,71,"Stanford"],
				    [-1,-1,"Oregon","Oregon State",51,48,"Oregon"],
				    [-1,-1,"Washington","Washington State",78,66,"Washington"],
				    [-1,-1,"Cal","Stanford",22,58,"Stanford"],
				    [-1,-1,"USC","UCLA",38,42,"UCLA"]];
	    
	    var tournament;
	    
	    /*
	     * Convert the matches array into a tree.
	     */
	    function createTournamentTree()
	    {
		   // generate root node
		   tournament = new MatchNode(matches[0]);
		   // set root node parent matches to be the matches whose indices are matches[0,0]
		   // and matches[0,1]
		   tournament.parentMatch1 = recCreateTournamentTree(matches[0,0]);
		   tournament.parentMatch2 = recCreateTournamentTree(matches[0,1]);
	    }
	    
	    function recCreateTournamentTree(matchIndex)
	    {
		   if (matchIndex === -1)
		   {
			  return null;
		   }
		   else
		   {
			  var node = new MatchNode(matches[matchIndex[);
			  node.parentMatch1 = recCreateTournamentTree(matches[matchIndex,0]);
			  node.parentMatch2 = recCreateTournamentTree(matches[matchIndex,1]);
			  return node;
		   }
	    }
	    
	    function countNodes
	    {
		
         }
	    
	    
	    
	    /*
	     * A node in the tournament tree.
		* 
	     * @paramn array matchArray [int,int,string,string,int,int,string]
	     * matchArray must have the following at each of the indices.s
		* matchArray[0] the index of the array in matches that contains the first parent match of this match or
		* -1 if there wasn't a parent match
		* matchArray[1] the index of the array in matches that contains the second parent match of this match or
		* -1 if there wasn't a parent match
		* matchArray[2] the name of the first team in this match.  If there was a parent match, this is the winner
		* of the first parent match.
		* matchArray[3] the name of the second team in this match.  If there was a parent match, this is the winner
		* of the second parent match.
		* matchArray[4] the first team's score for this match
		* matchArray[5] the second team's score for this match
		* matchArray[6] the name of the team that won this match
	     */
	    function MatchNode(matchArray)
	    {
		   var parentMatch1;
		   var parentMatch2;
		   var team1;
		   var team2;
		   var team1Score;
		   var team2Score;
		   var winner;

		   this.team1 = matchArray[2];
		   this.team2 = matchArray[3];;
		   this.team1Score = matchArray[4];
		   this.team2Score = matchArray[5];
		   this.winner = matchArray[6];
	    }
	   
	    var originXOffset = 20;
	    var originYOffset = 20;
	    var canvas = document.getElementById("bracket");
	    
	    function drawTextBox(x, y, width, height)
	    {
		  if (canvas.getContext) 
		  {
		    var c = canvas.getContext("2d");
		    c.rect(x, y, width, height);
		    c.stroke();
		  }
	    }
	     function draw() {
		    
		}
      }
	</script>
</head>
    <body onload="drawTextBox(20,20,100,30);">
    <div>
	   <canvas id="bracket" width="1000" height="600">
		  
	   </canvas>
    </div>
</body>
    
<?php
/*
include "Tests.php";

$test = new Tests();
$test->runTests();
*/
?>