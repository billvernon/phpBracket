<?php

include 'ITeam.php';

class Team implements ITeam
{
    private $_name;
    
    public function __construct($name)
    {
	   $this->_name = $name;
    }
    
    /*
     * Get the team name.
     * 
     * @return string the name of the team this object represents
     */
    public function getName()
    {
	   return $this->_name;
    }
}

