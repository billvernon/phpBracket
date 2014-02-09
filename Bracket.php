<?php

include 'Match.php';
include 'Score.php';
include 'Team.php';

class Bracket
{
    private $championship;
    
    /*
     * Initialize this tournament bracket.
     * 
     * @param mixed[][] - the data needed to construct the bracket 
     */
    public function __construct($_championship)
    {
	   $this->championship = $_championship;
    }
    
    public function initBracket($array)
    {
	   
    }
    
    public function recInitBracket($node, $array)
    {
	   
    }
    /*
     * Return the number of matches in the tournament
     * 
     * @return int the number of matches in the tournament
     */
    public function getNumberOfMatches()
    {
	   $matchCount = 0;
	   
	   if ($this->championshipMatch == null)
	   {
		  return 0;
	   }
	   else
	   {
		  $matchCount ++;
	       $matchCount += $this->recursiveGetNumberOfMatches($this->championshipMatch->getPriorMatchForTeam1()) +
				       $this->recursiveGetNumberOfMatches($this->championshipMatch->getPriorMatchForTeam2());
		  
		  return $matchCount;
	   }
    }
    
    private function recursiveGetNumberOfMatches($match)
    {
	   $matchCount = 0;
	   
	   if ($match == null)
	   {
		  return 0;
	   }
	   else
	   {
		  $matchCount ++;
	       $matchCount += $this->recursiveGetNumberOfMatches($match->getPriorMatchForTeam1()) +
				       $this->recursiveGetNumberOfMatches($match->getPriorMatchForTeam2());
		  
		  return $matchCount;
	   }
    }
    
    /*
     * Get the number of rounds in the tournament.
     * 
     * @return int the number of rounds in the tournament.
     */
    public function getNumberOfRounds()
    {
	   $matches = $championship->getMatches();
	   
	   return max(array(1,
					$this->recursiveGetNumberOfRounds($matches[0]),
					$this->recursiveGetNumberOfRounds($matches[1])));
    }
    
    /*
     * Get the championship Match object for this Bracket.
     */
    public function getChampionshipMatch()
    {
	   return $championship;
    }
    
    private function recursiveGetNumberOfRounds($match)
    {
	   if ($match == null){}
    }
    
    /*
     * Construct a tree out of Match objects.
     * 
     * @param matchData is a two dimensional array where each of the arrays in the 
     * array store information about a particular match.  
     * 
     * array[i][0] The index of the array in the match array that contains the first parent match
     *          of this match or-1 if there wasn't a parent match
     * array[i][1] The index of the array in the match array that contains the second parent match 
     *          of this match or -1 if there wasn't a parent match
     * array[i][2] The name of the first team in this match.  If there was a parent match, 
     *          This is the winner of the first parent match.
     * array[i][3] The name of the second team in this match.  If there was a parent match, 
     *          This is the winner of the second parent match.
     * array[i][4] The first team's score for this match
     * array[i][5] The second team's score for this match
     * array[i][6] The name of the team that won this match
     */
    private function constructTournament($matches)
    {
	   // Construct the root node of the championshp tree and also construct
	   // the two subtrees of the root node.
	   $this->championship = new Match($matches[0][2], $matches[0][4], $matches[0][3],
			                   $matches[0][5], $this->recConstructTournament($matches[0][0], $matches),
			                   $this->recConstructTournament($matches[0][1]));
			 //public function __construct($team1, $team1Score, $team2, $team2Score, $team1PriorMatch, $team2PriorMatch)
    }
    
    /*
     * Recursive helper to constructTournament.
     * 
     * @param number $index - the index in $matches containing the match data to construct
     *                        this Match object from
     * @param number $matches - a 2D array of match data
     * 
     * @return Match - a subtree rooted at a Match object constructed from the 
     *                 data at $matches[$index]
     */
    private function recConstructTournament($index, $matches)
    {
	   if ($index == -1)
	   {
		  return null;
	   }
	   
	   if ($index >= count($matches))
	   {
		  return null;
	   }
	  
	   return new Match($matches[$index][2], $matches[$index][4], $matches[$index][3],
			          $matches[$index][5], $this->recConstructTournament($matches[$index][0], $matches),
			          $this->recConstructTournament($matches[$index][1], $matches));
    }
    
    /*
     * Compare two brackets to see if they are equal.  The brackets are equal if all the fields, excluding
     * the scores, are equal
     * 
     * @param mixed[][] $matches1, $matches2 - 2D arrays of match data as described in constructTournament()
     * 
     * @return boolean - true if the brackets are equal, false otherwise
     */
    public static function compareBracketArrays($matches1, $matches2)
    {
	   if (count($matches1) != count($matches2))
	   {
		  return false;
	   }
	   
	   // only need $matches1 count since 
	   $matches1Count = count($matches1);

	   for ($i = 0; $i < $matches1Count; $i ++)
	   {
		 if ($matches1[i][0] != $matches2[i][0] ||
			$matches1[i][1] != $matches2[i][1] ||
			$matches1[i][2] != $matches2[i][2] ||
			$matches1[i][3] != $matches2[i][3] ||
			$matches1[i][4] != $matches2[i][4])
		 {
			return false;
		 }
	   }
	   
	   return true;
    }
    
    /*
     * Validate this bracket against an initial bracket.  This bracket is valid
     * if it can be constructed from the initial bracket.
     * 
     * @param mixed[][] $initialBracket - the initial bracket data to validate this bracket against
     *
     * @return bool - whether or not the bracket is valid when compared
     *                to an initial bracket
     */
    public function validateAgainstInitialBracket($initialData)
    {
	   $initialBracket = new Bracket($initialData);
	   
	   $rootNode = $initialBracket->getChampionshipMatch();
	   
	   
    }
}
