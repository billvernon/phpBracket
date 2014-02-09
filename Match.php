<?php

include 'IMatch.php';

class Match implements IMatch
{
    private $_team1;
    private $_team2;
    private $_winner;
    private $_priorMatchForTeam1;
    private $_priorMatchForTeam2;
    private $_score1;
    private $_score2;
    private $_matchID;
    
    /*
     * Get the teams in this match.
     * 
     * @param $team1, $team2 Team the two teams in the match
     * @param $team1Score, $team2Score int the score for each team
     * @param $parentMatches Match the matches from the prior round whose winners are playing in this match
     * 
     * @return an array of the Teams that are in the match
     */
    public function __construct($team1, $team1Score, $team2, $team2Score, $team1PriorMatch, $team2PriorMatch)
    {
	   $this->_team1 = $team1;
	   $this->_team2 = $team2;
	   $this->_winner = ($team1Score > $team2Score) ? $team1 : $team2;
	   $this->_priorMatchForTeam1 = $team1PriorMatch;
	   $this->_priorMatchForTeam2 = $team2PriorMatch;
	   $this->_score1 = $team1Score;
	   $this->_score2 = $team2Score;
	   $this->_matchID = $team1->getName() + $team2->getName();
    }
    
    public function getTeam1()
    {
	   return $this->_team1;
    }
    
    public function getTeam2()
    {
	   return $this->_team2;
    }
    
    public function getPriorMatchForTeam1() {
	   return $this->_priorMatchForTeam1;
    }
    
    public function getPriorMatchForTeam2()
    {
	   return $this->_priorMatchForTeam2;
    }
    
    /*
     * Get the winner of the match.
     * 
     * @return Team the team that won the match
     */
    public function getWinner()
    {
	   return $this->_winner;
    }
   
    /*
     * Get the score for team 1 for this match
     * 
     * @return number - the score
     */
    public function getTeam1Score()
    {
	   return $this->_score1;
    }
    
    /*
     * Get the score for team 2 for this match
     * 
     * @return number - the score
     */
    public function getTeam2Score()
    {
	   return $this->_score2;
    }
    
    /*
     * Get the unique identifier for this match.
     */
    public function getMatchID()
    {
	   return $this->_matchID;
    }
    
    public function equals($match)
    {
	   return ($this->_team1 == $match->getTeam1() && $this->_team2 == $match->getTeam2());
    }
    
    public function isInitialMatch()
    {
	   return (!$this->getPriorMatchForTeam1() && !$this->getPriorMatchForTeam2());
    }
}