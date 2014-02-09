<?php

/*
 * Score represents a score associated with a team.
 */
interface IScore
{
    /*
     * Get the Team associated with this score.
     * 
     * @return Team the team associated with this score.
     */
    public function getTeam();
    
    /*
     * Get the score.
     * 
     * @return int the score of the team associated with this score.
     */
    public function getScore();
}
