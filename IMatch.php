<?php

interface IMatch
{
    /*
     * Get the teams in this match.
     */
    public function getTeam1();
    public function getTeam2();
    
    /*
     * Get the previous round's match whose winner is returned for getTeam1()
     * 
     * @return Match the previous round's match whose winner is returned for getTeam1()
     */
    public function getPriorMatchForTeam1();
    
    /*
     * Get the previous round's match whose winner is returned for getTeam2().
     * 
     * @return Match the previous round's match whose winner is returned for getTeam2()
     */
    public function getPriorMatchForTeam2();
    
    /*
     * Get the winner of the match.
     * 
     * @return Team the team that won the match
     */
    public function getWinner();
   
    /*
     * Get the score for team 1 for this match
     * 
     * @return number - the score
     */
    public function getTeam1Score();
    {
	   return $this->_score;
    }
    
    /*
     * Get the score for team 2 for this match
     * 
     * @return number - the score
     */
    public function getTeam2Score();
    
    /*
     * Get the unique identifier for this match.
     */
    public function getMatchID();
    
    /*
     * Is this match is equal to another match.  Two matches are equal if
     * they have the same teams for team1 and team2.
     * 
     * @param Match $match - the match to compare this match to.
     * 
     * @
     */
    public function equals($match);
    
    /*
     * Return if this Match is an initial match.
     */
    public function isInitialMatch();
}