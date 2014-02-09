<?php

include 'IScore.php';

/*
 * Score represents a score associated with a team.
 */
class Score implements IScore
{ 
    private $_team;
    private $_score;
    
    public function __construct($team, $score)
    {
	   $this->_team = $team;
	   $this->_score = $score;
    }
    /*
     * Get the Team associated with this score.
     * 
     * @return Team the team associated with this score.
     */
    public function getTeam()
    {
	   return $this->_team;
    }
    
    /*
     * Get the score.
     * 
     * @return int the score of the team associated with this score.
     */
    public function getScore()
    {
	   return $this->_score;
    }
}