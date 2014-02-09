<?php

include 'Bracket.php';

class Tests
{    
    public function runTests()
    {
	   // run tests
	   $functions = get_class_methods($this);
	   foreach($functions as $function)
	   {
		  // execute all user functions that include the word 'test'
		  if (strpos($function, 'test') !== false)
		  {
			 if (call_user_func(array($this, $function)) == false)
			 {
				echo $function.' failed.';
			 }
		  }
	   }
    }
    
    /*
     * Count the number of matches for a balanced bracket.
     */
    private function testMatchCountForBalancedBracket()
    {
	   $matchCount = $this->getBalancedTestBracket()->getNumberOfMatches();
	   if ($matchCount != 7)
	   {
		  return false;
	   }
	   else
	   {
		  return true;
	   }
    }
    
    /*
     * Count the number of matches for an unbalanced bracket.
     */
    private function testMatchCountForUnbalancedBracket()
    {
	   $matchCount = $this->getUnbalancedTestBracket()->getNumberOfMatches();
	   if ($matchCount != 5)
	   {
		  return false;
	   }
	   else
	   {
		  return true;
	   }
    }
    
    /*
     * Get a balanced bracket with 8 teams, 4 initial games, 3 rounds, 7 total games
     */
    private function getBalancedTestBracket()
    {
	   // construct new test bracket
	   $oregon = new Team("Oregon");
	   $oregonstate = new Team("Oregon State");
	   $washington = new Team("Washington");
	   $washingtonstate = new Team("Washington State");
	   $cal = new Team("Cal");
	   $stanford = new Team("Stanford");
	   $usc = new Team("USC");
	   $ucla = new Team("UCLA");
	   
	   $match1 = new Match($oregon, 51, $oregonstate, 48, null, null);
	   $match2 = new Match($washington, 79, $washingtonstate, 66, null, null);
	   $match3 = new Match($cal, 22, $stanford, 58, null, null);
	   $match4 = new Match($usc, 38, $ucla, 42, null, null);
	   $match5 = new Match($oregon, 66, $washington, 59, $match1, $match2);
	   $match6 = new Match($stanford, 72, $ucla, 71, $match3, $match4);
	   $match7 = new Match($oregon, 71, $stanford, 70, $match5, $match6);
	   
	   return new Bracket($match7);
    }
    
    /*
     * Get an unbalanced bracket with 2 6 initial teams, 2 games in the first round, 5 games overall, and 3 rounds.
     */
    private function getUnbalancedTestBracket()
    {
	   // construct new test bracket
	   $oregon = new Team("Oregon");
	   $oregonstate = new Team("Oregon State");
	   $washington = new Team("Washington");
	   $cal = new Team("Cal");
	   $stanford = new Team("Stanford");
	   $usc = new Team("USC");
	   
	   $match1 = new Match($oregon, 51, $oregonstate, 48, null, null);
	   $match2 = new Match($cal, 22, $stanford, 58, null, null);
	   $match3 = new Match($oregon, 66, $washington, 59, $match1, null);
	   $match4 = new Match($stanford, 72, $usc, 73, $match2, null);
	   $match5 = new Match($oregon, 71, $usc, 70, $match3, $match4);
	   
	   return new Bracket($match5);
    }
}
