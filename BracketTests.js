//<editor-fold desc="MatchNode tests">
module("MatchNode tests");

test("Test isEmpty() on an empty node.", function()
{
    var node = new MatchNode();
    ok(node.isEmpty(), "MatchNode should have been empty");
});

test("Test isEmpty() on an non-empty node.", function()
{
    var node = new MatchNode();
    node.team1Name = "foo";
    node.team2Name = "bar";
    ok(!node.isEmpty(), "MatchNode should not have been empty");
    node.team1Name = "";
    ok(!node.isEmpty(), "MatchNode should not have been empty");
});

test("Test empty() on a non-empty node.", function()
{
    var node = new MatchNode();
    node.team1Name = "foo";
    node.team2Name = "bar";
    node.empty();
    ok(node.isEmpty(), "MatchNode should have been empty");
});

test("Test isLeaf()", function()
{
    var node = new MatchNode();
    ok(node.isLeaf());
    node.parentMatch1 = new MatchNode();
    ok(!node.isLeaf());
    node.parentMatch2 = new MatchNode();
    node.parentMatch1 = null;
    ok(!node.isLeaf());
    node.parentMatch1 = new MatchNode();
    ok(!node.isLeaf());
});
//</editor-fold>

//<editor-fold desc="MatchTree tests">
module("MatchTree tests");

test("Test MatchTree construction", function()
{
    var tree = new MatchTree(getBalancedTestBracketArray());
    
    ok(tree.rootNode.parentMatch1.team1Name === "Oregon");
    ok(tree.rootNode.parentMatch2.parentMatch1.team1Name === "Cal");
    ok(!tree.rootNode.parentMatch2.parentMatch2.parentMatch2);
    ok(!tree.rootNode.parentMatch1.parentMatch2.isEmpty());
});

test("Test MatchTree construction with unbalanced tree.", function()
{
    var tree = new MatchTree(getUnbalancedTestBracketArray());
    
    ok(tree.rootNode.parentMatch1.parentMatch1.team1Name === "Oregon");
    ok(!tree.rootNode.parentMatch1.parentMatch1.parentMatch1);
    ok(tree.rootNode.parentMatch2.parentMatch2.isEmpty());
    ok(tree.rootNode.parentMatch1.parentMatch2.isEmpty());
    ok(tree.rootNode.team1Name === "Oregon");
    ok(tree.rootNode.parentMatch1.team2Name === "Washington");
});

test("Check getHeight()", function(){
     var tree = new MatchTree(getUnbalancedTestBracketArray());
     ok(tree.getHeight() === 3);
     
     tree = new MatchTree(getBalancedTestBracketArray());
     ok(tree.getHeight() === 3);
});

test("Check teamHasLost()", function()
{
   var tree = new MatchTree(getBalancedTestBracketArray());
   ok(tree.teamHasLost("Oregon State"));
   ok(!tree.teamHasLost("Oregon"));
   tree = new MatchTree(incompleteBracket);
   ok(!tree.teamHasLost("Oregon"));
   ok(tree.teamHasLost("Oregon State"));
});

module("Draw tree");
/*
test("Draw tree", function()
{
    var tree = new MatchTree(getUnbalancedTestBracketArray());
    bracketType = "INTERACTIVE";
    tree.drawButtons();
    ok(true);
});*/


//</editor-fold>

/*
 * Get an array representation of this bracket:
 * 
 * 1 Oregon       51
 *                  Oregon      66
 * 8 Oregon State 48
 * 
 *                                  Oregon     71
 * 
 * 7 Washington   78
 *                  Washington  59
 * 6 WSU          66
 * 
 *                                                  Oregon
 * 
 * 5 Cal          22
 *                  Stanford    72
 * 4 Stanford     58
 * 
 *                                  Stanford   70
 * 
 * 3 USC          38
 *                  UCLA        71
 * 2 UCLA         42
 */        
function getBalancedTestBracketArray()
{
    return [[1,2,"Oregon","Stanford",71,70,"Oregon", 1, 4],
           [3,4,"Oregon","Washington",66,59,"Oregon", 1, 7],
           [5,6,"Stanford","UCLA",72,71,"Stanford", 4, 2],
           [-1,-1,"Oregon","Oregon State",51,48,"Oregon", 1, 8],
           [-1,-1,"Washington","Washington State",78,66,"Washington", 7, 6],
           [-1,-1,"Cal","Stanford",22,58,"Stanford", 5, 4],
           [-1,-1,"USC","UCLA",38,42,"UCLA", 3, 2]];
}

var balancedInitialBracket = [[1,2, "", "", -1, -1, ""],
                              [3,4, "", "", -1, -1, ""],
                              [5,6, "", "", -1, -1, ""],
                              [-1,-1,"Oregon","Oregon State",51,48,"Oregon"],
                              [-1,-1,"Washington","Washington State",78,66,"Washington"],
                              [-1,-1,"Cal","Stanford",22,58,"Stanford"],
                              [-1,-1,"USC","UCLA",38,42,"UCLA"]];
                          
var unbalancedInitialBracket = [[1,2, "", "", -1, -1, ""],
                              [3,4, "", "", -1, -1, ""],
                              [5,6, "", "UCLA", -1, -1, ""],
                              [-1,-1,"Oregon","Oregon State",51,48,"Oregon"],
                              [-1,-1,"Washington","Washington State",78,66,"Washington"],
                              [-1,-1,"Cal","Stanford",22,58,"Stanford"]];
                              /*[-1,-1,"USC","UCLA",38,42,"UCLA"]*/
                          
var incompleteBracket = [[1,2, "", "", -1, -1, ""],
                         [3,4, "Oregon", "Washington", -1, -1, "Oregon"],
                         [5,6,"Stanford","UCLA",72,71,"Stanford"],
                         [-1,-1,"Oregon","Oregon State",51,48,"Oregon"],
                         [-1,-1,"Washington","Washington State",78,66,"Washington"],
                         [-1,-1,"Cal","Stanford",22,58,"Stanford"],
                         [-1,-1,"USC","UCLA",38,42,"UCLA"]];
/*
 * Get an array representation of this bracket:
 * 
 * Oregon       51
 *                  Oregon      66
 * Oregon State 48
 * 
 *                                  Oregon     71
 * 
 * 
 *                  Washington  59
 *
 * 
 *                                                  Oregon
 * 
 * Cal          22
 *                  Stanford    72
 * Stanford     58
 * 
 *                                  Stanford   70
 * 
 * 
 *                  UCLA        71
 * 
 */    
function getUnbalancedTestBracketArray()
{
    return [[1,2,"Oregon","Stanford",71,70,"Oregon"],
           [3,-1,"Oregon","Washington",66,59,"Oregon"],
           [4,-1,"Stanford","UCLA",72,71,"Stanford"],
           [-1,-1,"Oregon","Oregon State",51,48,"Oregon"],
           [-1,-1,"Cal","Stanford",22,58,"Stanford"]];
}