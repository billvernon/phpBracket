//<editor-fold desc="Properties">

/*
 * Margin between team/score text and the rendered container box.
 * 
 * @type number
 */
var textMargin = 5;

/*
 * Minimum horizontal distance between team/score text box and the rendering 
 * canvas edge.
 * 
 * @type number
 */
var xCanvasMargin = 10;

/*
 * Minimum vertical distance between team/score text box and the rendering 
 * canvas edge.
 * 
 * @type Number
 */
var yCanvasMargin = 10;

/*
 * The minimum number of spaces to insert between the team name and score in
 * the rendered team/score text.
 * 
 */
var minSpacesBetweenTeamAndScore = 5;

/*
 * Minimum horizontal distance between rendered team/score boxes
 * 
 * @type number
 */
var minXDistBetweenBoxes = 40;

/*
 * Minimum vertical distance between rendered team/score boxes
 * 
 * @type nmber
 */
var minYDistBetweenBoxes = 30;

/*
 * Minimum vertical distance between the team/score boxes of two different, but
 * adjacently displayed, matches.
 * 
 * @type number
 */
var minYDistBetweenMatches = 60;

/*
 * Minimum vertical distance between the lines that connect to the winner's box
 * from a match.
 * 
 * @type number
 */
var minYDistBetweenConnectingLines = 10;

/*
 * ID of the div that contains the rendering canvas.
 * 
 * @type string
 */
var containerDivID = "bracket";

/*
 * ID of the rendering canvas.
 * 
 * @type string
 */
var canvasID = "bracketCanvas";

/*
 * Width of the team/score text box
 * 
 * @type number
 */
var textBoxWidth;

/*
 * Height of the team/score textBox
 * 
 * @type number
 */
var textBoxHeight;

/*
 * Minimum number of pixels between the end of the team name string
 * and the start of the score string as displayed in a team/score box.
 * 
 * @type number
 */
var minPixelsBetweenTeamAndScore = 30;

/*
 * Font to render the text in
 * 
 * @type string
 */
var font = "16px Arial";

/*
 * Whether the bracket is in static mode or interactive mode.  When this property
 * is set to "INTERACTIVE", the bracket will display the teams in each match as 
 * buttons that when clicked, propagate that team up to the next match.  "STATIC"
 * will display the bracket as a simple bracket without any interactivity
 * 
 * @type string
 * @value "INTERACTIVE" or "STATIC"
 */
var bracketType = "INTERACTIVE";

/*
 * Define connecting line colors.
 * 
 * neutralColor is used for a match that has not been played yet
 * hitColor is used for a match that has been played that the user got right
 * missColor is used for a match that has been played that the user got wrong
 */
var neutralColor = "black";
var hitColor = "green";
var missColor = "red";

/*
 * 2 dimensional array containing the information necessary to construct the bracket.
 * 
 * @type mixed arra[][] - two dimensional array where each of the arrays in the 
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
 * array[i][7] The seed number of team1
 * array[i][8] The seed number of team2
 * 
 * example:
 * 
 * matches = [[1,2,"Oregon","Stanford",71,70,"Oregon", 1, 16],
 *            [3,4,"Oregon","Washington",66,59,"Oregon", 2, 5],
 *            [5,6,"Stanford","UCLA",72,71,"Stanford", 6, 2],
 *            [-1,-1,"Oregon","Oregon State",51,48,"Oregon", 1, 3],
 *            [-1,-1,"Washington","Washington State",78,66,"Washington", 3, 1],
 *            [-1,-1,"Cal","Stanford",22,58,"Stanford", 7, 13],
 *            [-1,-1,"USC","UCLA",38,42,"UCLA", 12, 14]];
 * 
 * matches[0][0] contains the index of matches[1], matches[0][1] contains the index of matches[2],
 * Oregon and Washington are the two teams in this match, 71 and 70 are the respective scores, 
 * and Oregon is the winner of the match.
 */
var bracketData= [[1,2,"Oregon","Stanford",71,70,"Oregon", 1, 4],
           [3,4,"Oregon","Washington",66,59,"Oregon", 1, 7],
           [5,6,"Stanford","UCLA",72,71,"Stanford", 4, 2],
           [-1,-1,"Oregon","Oregon State",51,48,"Oregon", 1, 8],
           [-1,-1,"Washington","Washington State",78,66,"Washington", 7, 6],
           [-1,-1,"Cal","Stanford",22,58,"Stanford", 5, 4],
           [-1,-1,"USC","UCLA",38,42,"UCLA", 3, 2]];
/*
 * Master bracket for the tournament.  Has same format as bracketData.
 */
var masterBracketData;

//<editor-fold desc="MatchNode">

/*
 *  Contains the information necessary to represent a tournament in tree form.
 *  
 *  @property MatchNode parentMatch1 - The match that team1 came from or null if a leaf.
 *  @property MatchNode parentMatch2 - The match that team 2 came from or null if a leaf.
 *  @property string team1Name - Team1's name.
 *  @property string team2Name - Team2's name.
 *  @property number team1Score - Team1's score in this match.
 *  @property number team2Score - Team2's score in this match.
 *  @property string winnerName - The name of the winner of the match.
 *  @property id - a unique id that identifies this node
 *  @property isDummy - identifies if this node is just a filler used to perfect the tree
 *  @property parentNode - points to the parent node of this node
 */
function MatchNode()
{
    this.parentMatch1 = null;
    this.parentMatch2 = null;
    this.team1Name = "";
    this.team2Name = "";
    this.team1Score = -1;
    this.team2Score = -1;
    this.winnerName = "";
    this.id = "";
    this.isDummy = true;
    this.parentNode = null;
    this.team1Seed = 0;
    this.team2Seed = 0;
}

/*
 * Is this node a leaf?
 * 
 * @returns {boolean}
 */
MatchNode.prototype.isLeaf = function()
{
    return (!this.parentMatch1 && !this.parentMatch2);
};

/*
 * Check if this node represents an actual match or not.  A MatchNode is
 * considered empty when both team1Name and team2Name are empty strings.
 * 
 * @returns {Boolean} Does the node actually represent an actual match.
 */
MatchNode.prototype.isEmpty = function()
{
    return (this.team1Name === "" && this.team2Name === "");
};

//</editor-fold>

//<editor-fold desc="MatchTree">

/*
 * MatchTree is a tree representation of the tournament.  The tree is constructed
 * from MatchNodes where each MatchNode represents a specific match in the
 * tournament. MatchTree is a perfect tree with gaps in the original tournament 
 * being filled in with empty MatchNodes in order to facilitate positioning the 
 * matches for rendering.
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
 * 
 * example:
 * 
 * matches = [[1,2,"Oregon","Stanford",71,70,"Oregon"],
 *            [3,4,"Oregon","Washington",66,59,"Oregon"],
 *            [5,6,"Stanford","UCLA",72,71,"Stanford"],
 *            [-1,-1,"Oregon","Oregon State",51,48,"Oregon"],
 *            [-1,-1,"Washington","Washington State",78,66,"Washington"],
 *            [-1,-1,"Cal","Stanford",22,58,"Stanford"],
 *            [-1,-1,"USC","UCLA",38,42,"UCLA"]];
 * 
 * matches[0][0] contains the index of matches[1], matches[0][1] contains the index of matches[2],
 * Oregon and Washington are the two teams in this match, 71 and 70 are the respective scores, 
 * and Oregon is the winner of the match.
 * 
 * @returns MatchTree The match tree representing the tournament.
 */
function MatchTree(matchData)
{
    this.matchData = (!matchData) ? bracketData : matchData;
    this.matchNodes = new Array();
    this.rootNode = this.createMatchTree();
    this.perfectMatchTree();
    this.generatePositionalData();
    this.yShiftTree();
    if (bracketType === "INTERACTIVE")
    {
        this.addButtons();
    }
    
    return this;
}

/*
 * Construct the match tree from the match data array.
 * 
 * @returns MatchNode - The root node of the match tree.
 */
MatchTree.prototype.createMatchTree = function()
{
    var rootNode = new MatchNode();
    rootNode.team1Name = this.matchData[0][2];
    rootNode.team2Name = this.matchData[0][3];
    rootNode.team1Score = this.matchData[0][4];
    rootNode.team2Score = this.matchData[0][5];
    rootNode.winnerName = this.matchData[0][6];
    rootNode.team1Seed = this.matchData[0][7];
    rootNode.team2Seed = this.matchData[0][8];
    rootNode["winnerSeed"] = (this.team1Name === this.winnerName) ? this.matchData[0][7] : this.matchData[0][8];
    rootNode.id = "1";
    rootNode.isDummy = false;
     
    // call the recursive function to create the parent matches
    rootNode.parentMatch1 = this.recCreateMatchTree(this.matchData[0][0], 2, rootNode);
    rootNode.parentMatch2 = this.recCreateMatchTree(this.matchData[0][1], 3, rootNode);
    
    this.matchNodes[0] = rootNode;

    return rootNode;
};

/*
 * Recursive helper function for createMatchTree().
 * 
 * @param number index - The index of a match in the match data array.
 * @param idNumber - a unique number that identifies this node
 * 
 * @returns MatchNode - The sub-tree rooted at returned node.
 */
MatchTree.prototype.recCreateMatchTree = function(index, idNumber, parentNode)
{
    if (!this.matchData[index])
    {
        return;
    }
    
    // if a leaf
    if (index === -1)
    {
        return null;
    }
    else
    {
        var node = new MatchNode();
        node.team1Name = this.matchData[index][2];
        node.team2Name = this.matchData[index][3];
        node.team1Score = this.matchData[index][4];
        node.team2Score = this.matchData[index][5];
        node.winnerName = this.matchData[index][6];
        node.team1Seed = this.matchData[index][7];
        node.team2Seed = this.matchData[index][8];
        node.parentMatch1 = this.recCreateMatchTree(this.matchData[index][0], 2 * idNumber, node);
        node.parentMatch2 = this.recCreateMatchTree(this.matchData[index][1], 2 * idNumber + 1, node);
        node.isDummy = false;
        node.id = idNumber.toString();
        node.parentNode = parentNode;
        
        this.matchNodes[index] = node;

        return node;
    }
};

/*
 * Fills out the tree rooted at rootNode such that each node has 2 children and the leaves are
 * all on the same level.
 */
MatchTree.prototype.perfectMatchTree = function()
{    
    // height as number of nodes
    var treeHeight = this.getHeight();
    
    // tree is balanced already
    if (this.rootNode.isLeaf())
    {
        return;
    }
    
    if (!this.rootNode.parentMatch1)
    {
       this.rootNode.parentMatch1 = new MatchNode();
    }
    
    this.recPerfectMatchTree(this.rootNode.parentMatch1, treeHeight - 1);

    if (!this.rootNode.parentMatch2)
    {
       this.rootNode.parentMatch2 = new MatchNode();
    }
    
    this.recPerfectMatchTree(this.rootNode.parentMatch2, treeHeight - 1);
};

/*
 * Recursive helper for perfectMatchTree()
 * 
 * @param MatchNode node - the root of a subtree
 * @param MatchNode levelsToBottom - the number of levels to the lowest
 *                                   level of the tree from this level
 */
MatchTree.prototype.recPerfectMatchTree = function(node, levelsToBottom)
{
    // base condition, bottom has been reached so no new nodes need to be added
    if (levelsToBottom === 1)
    {
        return;
    }
    
    // add new nodes, if needed, and recurse through subtrees in order to 
    // perfect the subtrees
    if (!node.parentMatch1)
    {
       node.parentMatch1 = new MatchNode();
    }
    
    this.recPerfectMatchTree(node.parentMatch1, levelsToBottom - 1);

    if (!node.parentMatch2)
    {
       node.parentMatch2 = new MatchNode();
    }
    
    this.recPerfectMatchTree (node.parentMatch2, levelsToBottom - 1);
};
 
/*
 * Get the height, in nodes, of the tree
 * 
 * @returns {Number} the height of the tree
 */
MatchTree.prototype.getHeight = function()
{
    if (!this.rootNode)
    {
        return 0;
    }
    
    if (this.rootNode.isLeaf())
    {
        return 1;
    }
    
    return 1 + Math.max(this.recGetHeight(this.rootNode.parentMatch1),
                        this.recGetHeight(this.rootNode.parentMatch2));
};

/*
 * Recursive helper to getHeight().
 * 
 * @param {MatchNode} node - the root node of a subtree
 * @returns {Number} - the height of the subtree rooted at node
 */
MatchTree.prototype.recGetHeight = function(node)
{
    if (!node)
    {
        return 0;
    }
    
    return 1 + Math.max(this.recGetHeight(node.parentMatch1),
                        this.recGetHeight(node.parentMatch2));
};

/*
 * Append a new data structure, ResultBox, to each node in the MatchNode tree.
 * The ResultBox allows each node to store positional information about where
 * to render each of the teams and scores on the canvas.
 */
MatchTree.prototype.generatePositionalData = function()
{
    this.rootNode["resultBox1"] = new ResultBox(this.rootNode.team1Name, this.rootNode.team1Seed, this.rootNode.team1Score, minSpacesBetweenTeamAndScore, this.matchData);
    this.rootNode["resultBox2"] = new ResultBox(this.rootNode.team2Name, this.rootNode.team2Seed, this.rootNode.team2Score, minSpacesBetweenTeamAndScore, this.matchData);
    
    if (this.rootNode.isLeaf())
    {
        // determine positioning
        this.rootNode.resultBox1.x = xCanvasMargin;
        this.rootNode.resultBox1.y = yCanvasMargin;
        this.rootNode.resultBox2.x = xCanvasMargin;
        this.rootNode.resultBox2.y = yCanvasMargin + this.rootNode.resultBox2.height + 
                                     minYDistBetweenBoxes;
        // only the root node has the winnerBox property
        this.rootNode["winnerBox"] = new ResultBox(this.rootNode.winnerName, this.rootNode.winnerSeed, -1, minSpacesBetweenTeamAndScore, this.matchData);
        this.rootNode.winnerBox.x = this.rootNode.resultBox1.x + this.rootNode.resultBox1.width + 
                                    minXDistBetweenBoxes;
        this.rootNode.winnerBox.y = (this.rootNode.resultBox1.y + this.rootNode.resultBox2.y) / 2;
    }
    else
    {
        // Work through the subtrees such that the upper subtrees are visited first.  
        // When a position for the lower ResultBox of a leaf is discovered, pass it's 
        // y coordinate back up and then back down to the next leaf down.
        // The y coordinate is then used by the next match displayed to determine
        // the y coordinate of the upper ResultBox.  The recursive function is first
        // passed -1 as this value as the placement of the first upper ResultBox will
        // be determined by the parameters set by xCanvasMargin and yCanvasMargin.
        
        // determine the y value of the lower ResultBox of the last visited leaf.
        var yPos1 = this.recGeneratePositionalData(this.rootNode.parentMatch1, -1);
        // visit the subtree rooted at parentMatch2 while passing yPos1 down to the
        // uppermost leaf belonging to that tree.
        this.recGeneratePositionalData(this.rootNode.parentMatch2, yPos1);

        // this node's team/score boxes should be half way between the parent games'
        // team/score boxes and have at least the minimum required distance between
        // them horizontally
        this.rootNode.resultBox1.x = this.rootNode.parentMatch1.resultBox1.x +
                                     this.rootNode.parentMatch1.resultBox1.width + 
                                     minXDistBetweenBoxes;
        this.rootNode.resultBox1.y = (this.rootNode.parentMatch1.resultBox1.y + 
                                      this.rootNode.parentMatch1.resultBox2.y) / 2;
        this.rootNode.resultBox2.x = this.rootNode.parentMatch2.resultBox1.x +
                                     this.rootNode.parentMatch2.resultBox2.width +
                                     minXDistBetweenBoxes;
        this.rootNode.resultBox2.y = (this.rootNode.parentMatch2.resultBox1.y + 
                                      this.rootNode.parentMatch2.resultBox2.y) / 2;
        this.rootNode["winnerBox"] = new ResultBox(this.rootNode.winnerName, this.rootNode.winnerSeed, -1, minSpacesBetweenTeamAndScore, this.matchData);
        this.rootNode.winnerBox.x = this.rootNode.resultBox1.x + this.rootNode.resultBox1.width + minXDistBetweenBoxes;
        this.rootNode.winnerBox.y = (this.rootNode.resultBox1.y + this.rootNode.resultBox2.y) / 2;
    }
};

/*
 * Recursive helper to generatePositionalData()
 * 
 * @param MatchNode node - Root node of the subtree being visited.
 * @param number siblingYPos - The y position of the lower result box of the 
 *                             last leaf visited.
 * @returns number - The y position of the lower result box of the last leaf visited.
 */
MatchTree.prototype.recGeneratePositionalData = function(node, siblingYPos)
{
    if (!node)
    {
        return;   
    }
    
    node["resultBox1"] = new ResultBox(node.team1Name, node.team1Seed, node.team1Score, minSpacesBetweenTeamAndScore, this.matchData);
    node["resultBox2"] = new ResultBox(node.team2Name, node.team2Seed, node.team2Score, minSpacesBetweenTeamAndScore, this.matchData);
    
    // found a leaf
    if (node.isLeaf())
    {
        // if y pos = -1, then this is the upper most match
        if (siblingYPos === -1)
        {
            node.resultBox1.x = xCanvasMargin;
            node.resultBox1.y = yCanvasMargin;
            node.resultBox2.x = xCanvasMargin;
            node.resultBox2.y = yCanvasMargin + node.resultBox1.y + node.resultBox1.height +
                                minYDistBetweenBoxes;
        }
        else
        {
            node.resultBox1.x = xCanvasMargin;
            node.resultBox1.y = siblingYPos + node.resultBox1.height + minYDistBetweenMatches;
            node.resultBox2.x = xCanvasMargin;
            node.resultBox2.y = node.resultBox1.y + node.resultBox1.height + minYDistBetweenBoxes;
        }
        
        return node.resultBox2.y;
    }
    else
    {
        // Work through the subtrees such that the upper subtrees are visited first.  
        // When a position for the lower ResultBox of a leaf is discovered, pass it's 
        // y coordinate back up and then back down to the next leaf down.
        // The y coordinate is then used by the next match displayed to determine
        // the y coordinate of the upper ResultBox.  The recursive function is first
        // passed -1 as this value as the placement of the first upper ResultBox will
        // be determined by the parameters set by xCanvasMargin and yCanvasMargin.
        
        // determine the y value of the lower ResultBox of the last visited leaf.
        var yPos1 = this.recGeneratePositionalData(node.parentMatch1, siblingYPos);
        // visit the subtree rooted at parentMatch2 while passing yPos1 down to the
        // uppermost leaf belonging to that tree.
        var yPos2 = this.recGeneratePositionalData(node.parentMatch2, yPos1);
        
        // this node's team/score boxes should be half way between the parent games'
        // team/score boxes and have at least the minimum required distance between
        // them horizontally
        node.resultBox1.x = node.parentMatch1.resultBox1.x + node.parentMatch1.resultBox1.width +
                            minXDistBetweenBoxes;
        node.resultBox1.y = Math.floor(.5 * (node.parentMatch1.resultBox1.y + node.parentMatch1.resultBox2.y));
        node.resultBox2.x = node.parentMatch2.resultBox1.x + node.parentMatch2.resultBox1.width + 
                            minXDistBetweenBoxes;
        node.resultBox2.y = Math.floor(.5 * (node.parentMatch2.resultBox1.y + node.parentMatch2.resultBox2.y));
        
        return yPos2;
    }
};

/*
 * Find the Y position of the uppermost team/score box.  generatePositionalData() 
 * must have been called in order to set the positional data requried for this
 * function to work.
 * 
 * @returns number the uppermost y position of the tree as it is rendered
 */
MatchTree.prototype.getYPositionOfUppermostNode = function()
{
   if (this.rootNode.isLeaf())
   {
       return this.rootNode.resultBox1.y;
   }
   
   return Math.min(this.recGetYPositionOfUppermostNode(this.rootNode.parentMatch1),
                   this.recGetYPositionOfUppermostNode(this.rootNode.parentMatch2));
};

/*
 * Recursive helper for getYPositionOfUppermostNode()
 * 
 * @param MatchNode node - The root node of the subtree being visited.
 * @returns number - The minimum y position of the uppermost ResultBox 
 *                   in the subtree rooted at node.
 */
MatchTree.prototype.recGetYPositionOfUppermostNode = function(node)
{
    if (!node)
    {
        return;
    }
    
    // don't consider empty nodes
    if (node.isEmpty() && node.isLeaf())
    {
       return 1000000000;
    }
    
    if (node.isEmpty())
    {
        return Math.min(this.recGetYPositionOfUppermostNode(node.parentMatch1),
                        this.recGetYPositionOfUppermostNode(node.parentMatch2));
    }
    
    if (node.isLeaf())
    {
        return node.resultBox1.y;
    }
    
    return Math.min(this.recGetYPositionOfUppermostNode(node.parentMatch1),
                    this.recGetYPositionOfUppermostNode(node.parentMatch2),
                    node.resultBox1.y);
};

/*
 * Shift all y values of the team/score boxes in the tree by the appropriate 
 * number of pixels such that the upper most team/score box will be at yCanvasMargin
 */
MatchTree.prototype.yShiftTree = function()
{
    var yToShift = this.getYPositionOfUppermostNode() - yCanvasMargin;
    
    if (this.rootNode.isEmpty())
    {
        return;
    }
    
    this.rootNode.resultBox1.y = this.rootNode.resultBox1.y - yToShift;
    this.rootNode.resultBox2.y = this.rootNode.resultBox2.y - yToShift;
    
    this.recYShiftTree(this.rootNode.parentMatch1, yToShift);
    this.recYShiftTree(this.rootNode.parentMatch2, yToShift);
};

/*
 * Recursive helper to yShiftTree.
 * 
 * @param MatchNode node - The root node of the subtree being visited.
 * @param number yToShift - The number of pixels to shift the ResultBoxes of
 *                          this subtree by.
 */
MatchTree.prototype.recYShiftTree = function(node, yToShift)
{
    if (!node)
    {
        return;
    }
    
    if (node.isEmpty())
    {
        return;
    }
    
    node.resultBox1.y -= yToShift;
    node.resultBox2.y -= yToShift;
    
    if (node.isLeaf())
    {
        return;
    }
    
    this.recYShiftTree(node.parentMatch1, yToShift);
    this.recYShiftTree(node.parentMatch2, yToShift);
};

/*
 * Add buttons to the rendered bracket for interactive mode.
 */
MatchTree.prototype.addButtons = function()
{
    if (!this.rootNode)
    {
        return;
    }
    
    if (!this.rootNode.isDummy)
    {
        // add new properties, button1 and button2 for team1 and team2 so that buttons can be rendered in interactive mode
        this.rootNode["button1"] = new Button(new Rect(this.rootNode.resultBox1.x, this.rootNode.resultBox1.y,
                                             this.rootNode.resultBox1.height, this.rootNode.resultBox1.width),
                                             this.rootNode.team1Name, this.rootNode.team1Seed, this.rootNode.id + "1");
        this.rootNode["button2"] = new Button(new Rect(this.rootNode.resultBox2.x, this.rootNode.resultBox2.y,
                                             this.rootNode.resultBox2.height, this.rootNode.resultBox2.width),
                                             this.rootNode.team2Name, this.rootNode.team2Seed, this.rootNode.id + "2");         
        this.rootNode["winnerButton"] = new Button(new Rect(this.rootNode.winnerBox.x, this.rootNode.winnerBox.y,
                                             this.rootNode.winnerBox.height, this.rootNode.winnerBox.width),
                                             this.rootNode.winnerName, this.rootNode.winnerSeed, this.rootNode.id + "0");
    }
    
    this.recAddButtons(this.rootNode.parentMatch1);
    this.recAddButtons(this.rootNode.parentMatch2);
};

MatchTree.prototype.recAddButtons = function(node)
{
    if (!node)
    {
        return;
    }
    
    if (!node.isDummy)
    {
        // add new properties, button1 and button2 for team1 and team2 so that buttons can be rendered in interactive mode
        node["button1"] = new Button(new Rect(node.resultBox1.x, node.resultBox1.y,
                                             node.resultBox1.height, node.resultBox1.width),
                                             node.team1Name, node.team1Seed, node.id.toString() + "1");
        node["button2"] = new Button(new Rect(node.resultBox2.x, node.resultBox2.y,
                                             node.resultBox2.height, node.resultBox2.width),
                                             node.team2Name, node.team2Seed, node.id.toString() + "2");    
    }
    
    this.recAddButtons(node.parentMatch1);
    this.recAddButtons(node.parentMatch2);
};

MatchTree.prototype.shiftButtons = function(xOffset, yOffset)
{
    // if no buttons to move
    if (bracketType !== "INTERACTIVE" || !this.rootNode)
    {
        return;
    }
    
    this.rootNode.winnerButton.offset(xOffset, yOffset);
    
    this.recShiftButtons(this.rootNode, xOffset, yOffset);
};

MatchTree.prototype.recShiftButtons = function(node, xOffset, yOffset)
{
    if (!node)
    {
        return;
    }
    
    node.button1.offset(xOffset, yOffset);
    node.button2.offset(xOffset, yOffset);
    
    this.recShiftButtons(node.parentMatch1, xOffset, yOffset);
    this.recShiftButtons(node.parentMatch2, xOffset, yOffset);
};

/*
 * Draw the buttons for the tree.
 */
MatchTree.prototype.drawButtons = function()
{
    if (!this.rootNode)
    {
        return;
    }
    
    if (this.rootNode.button1 && !this.rootNode.isDummy)
    {
        this.rootNode.button1.draw();
        this.rootNode.button2.draw();
        this.rootNode.winnerButton.draw();
    }
    
    this.recDrawButtons(this.rootNode.parentMatch1);
    this.recDrawButtons(this.rootNode.parentMatch2);
    
    if (this.rootNode.parentMatch1)
    {
        if (!this.rootNode.parentMatch1.isDummy)
        {
            this.drawLinesBetweenResultBoxes(this.rootNode.parentMatch1.resultBox1, 
                                             this.rootNode.parentMatch1.resultBox2,
                                             this.rootNode.resultBox1, neutralColor);
        }
    }
        
    if (this.rootNode.parentMatch2)
    {
        if (!this.rootNode.parentMatch2.isDummy)
        {
            this.drawLinesBetweenResultBoxes(this.rootNode.parentMatch2.resultBox1, 
                                             this.rootNode.parentMatch2.resultBox2,
                                             this.rootNode.resultBox2, neutralColor);
        }
    }
 
    this.drawLinesBetweenResultBoxes(this.rootNode.resultBox1, this.rootNode.resultBox2,
                                     this.rootNode.winnerBox, neutralColor);
};

/*
 * Recursive helper for drawButtons()
 * 
 * @param MatchNode node - A node rooting a subtree in the MatchTree
 */
MatchTree.prototype.recDrawButtons = function(node)
{
    if (!node)
    {
        return;
    }
    
    if (node.button1 && !node.isDummy)
    {
        node.button1.draw();
        node.button2.draw();                        
    }
    
    this.recDrawButtons(node.parentMatch1);
    this.recDrawButtons(node.parentMatch2);
    
    if (node.parentMatch1)
    {
        if (!node.parentMatch1.isDummy)
        {
            this.drawLinesBetweenResultBoxes(node.parentMatch1.resultBox1, 
                                             node.parentMatch1.resultBox2,
                                             node.resultBox1, neutralColor);
        }
    }
    
    if (node.parentMatch2)
    {
        if (!node.parentMatch2.isDummy)
        {
            this.drawLinesBetweenResultBoxes(node.parentMatch2.resultBox1, 
                                             node.parentMatch2.resultBox2,
                                             node.resultBox2, neutralColor);
        }
    }
};

/*
 * Get the node containing the button with a specific id.
 * 
 * @param string buttonID - the ID of the button to find
 * @return MatchNode - the MatchNode that contains the button found or null if
 *                     the button was not found
 */
MatchTree.prototype.getNodeContainingButton = function(buttonID)
{
    if (!this.rootNode)
    {
        return null;
    }
    
    if (this.rootNode.winnerButton.id === buttonID || this.rootNode.button1.id === buttonID
        || this.rootNode.button2.id === buttonID)
    {
        return this.rootNode;
    }
    
    if (this.rootNode.parentMatch1)
    {
        var node = this.recGetNodeContainingButton(this.rootNode.parentMatch1, buttonID);
    }
    
    if (node)
    {
        return node;
    }
    
    if (this.rootNode.parentMatch2)
    {
        node = this.recGetNodeContainingButton(this.rootNode.parentMatch2, buttonID);
    }
    
    return node;
};

/*
 * Recursive helper to getNodeContainingButton()
 */
MatchTree.prototype.recGetNodeContainingButton = function (node, buttonID)
{
    var matchingNode;
    
    if (!node)
    {
        return null;
    }
    
    if (node.button1.id === buttonID || 
        node.button2.id === buttonID)
    {
        return node;
    }
    
    if (node.parentMatch1)
    {
        matchingNode = this.recGetNodeContainingButton(node.parentMatch1, buttonID);
        if (matchingNode)
        {
            return matchingNode;
        }
    }
    
    if (node.parentMatch2)
    {
        matchingNode = this.recGetNodeContainingButton(node.parentMatch2, buttonID);
    }
    
    return matchingNode;
};

/*
 * Add each button's team to the corresponding MatchNode's team in the match tree.
 */
MatchTree.prototype.syncTreeWithUserBracket = function()
{
    // sync match data array
    this.matchData[0][6] = getDOMButton(this.rootNode.winnerButton.id).html();
    this.matchData[0][2] = getDOMButton(this.rootNode.button1.id).html();
    this.matchData[0][3] = getDOMButton(this.rootNode.button2.id).html();
    
    for (var i = 1; i < this.matchNodes.length; i ++)
    {
        // set team names if needed
        if (this.matchNodes[i].parentMatch1)
        {
            this.matchData[i][2] = getDOMButton(this.matchNodes[i].button1.id).html();
            this.matchData[i][3] = getDOMButton(this.matchNodes[i].button2.id).html();
            
            // Determine who the winner of the match is.  The winner of the match
            // will be the team that was promoted to the next round.
            if (this.matchNodes[i].id === this.matchNodes[i].parentNode.parentMatch1.id)
            {
                this.matchData[i][6] = getDOMButton(this.matchNodes[i].parentNode.button1.id).html();
            }
            else
            {
                this.matchData[i][6] = getDOMButton(this.matchNodes[i].parentNode.button2.id).html();
            }
        }
    }
    
    // sync match tree nodes
    this.rootNode.winnerName = getDOMButton(this.rootNode.winnerButton.id).html();
    this.rootNode.team1Name = getDOMButton(this.rootNode.button1.id).html();
    this.rootNode.team2Name = getDOMButton(this.rootNode.button2.id).html();
    
    // sync subtrees
    if (this.rootNode.parentMatch1)
    {
        this.recSyncWithUserBracket(this.rootNode.parentMatch1);
        this.recSyncWithUserBracket(this.rootNode.parentMatch2);
    }
};

MatchTree.prototype.recSyncWithUserBracket = function(node)
{
    if (!node)
    {
        return;
    }
    
    node.team1Name = getDOMButton(node.button1.id);
    node.team2Name = getDOMButton(node.button2.id);
    
    // sync subtrees
    if (node.parentMatch1)
    {
        this.recSyncWithUserBracket(node.parentMatch1);
        this.recSyncWithUserBracket(node.parentMatch2);
    }
};

/*
 * Create a button for the bracket.
 * 
 * @param Rect frame - the size and coordinates of a button
 * @param string team - the team name to be shown on the button
 * @param string - the DOM id of the button
 * @returns Button
 */
function Button(frame, team, seedNumber, id)
{
    // size and location of the button
    this.frame = frame;
    this.team = team;
    this.id = id;
    this.buttonCode = "<button id=\"" + "(" + seedNumber + ") " + this.id + "\" class=\"bracketButton\">" + 
                       this.team + "</button>";
}

/*
 * Change the origin of the button by an offset.
 * 
 * @param Number xOffset - The value to x shift the button by.
 * @param {type} yOffset - The value to y shift the button by.
 */
Button.prototype.offset = function(xOffset, yOffset)
{
    this.frame.x += xOffset;
    this.frame.y += yOffset;
};

/*
 * Render the button according to the button properties.
 */
Button.prototype.draw = function()
{
    $(this.buttonCode).appendTo("#" + containerDivID);
    var button = $("#" + this.id);
    button.bind("click", handleButtonClick);
    button.css("left", this.frame.x);
    button.css("top", this.frame.y);
    button.css("width", this.frame.width);
    button.css("height", this.frame.height);
};

/*
 * Draw each team/score box in this MatchTree.
 */
MatchTree.prototype.drawTree = function()
{    
    if (!this.rootNode)
    {
        return;
    }
    
    if (bracketType === "STATIC")
    {
        var masterBracketTree = new MatchTree(masterBracketData); 
        
        var lineColor1;
        var lineColor2;
        
        if (this.rootNode.team1Name === masterBracketTree.rootNode.team1Name)
        {
            lineColor1 = hitColor;
        }
        else if(masterBracketTree.teamHasLost(this.rootNode.team1Name))
        {
            lineColor1 = missColor;
        }
        else if (masterBracketTree.rootNode.team1Name === "")
        {
            lineColor1 = neutralColor;
        }
        else
        {
            lineColor1 = missColor;
        }
        
        if (this.rootNode.team2Name === masterBracketTree.rootNode.team2Name)
        {
            lineColor2 = hitColor;
        }
        else if(masterBracketTree.teamHasLost(this.rootNode.team2Name))
        {
            lineColor2 = missColor;
        }
        else if (masterBracketTree.rootNode.team2Name === "")
        {
            lineColor2 = neutralColor;
        }
        else
        {
            lineColor2 = missColor;
        }
        
        this.recDrawTree(this.rootNode.parentMatch1, 
                                      masterBracketTree.rootNode.parentMatch1);
        this.recDrawTree(this.rootNode.parentMatch2,
                                      masterBracketTree.rootNode.parentMatch2);
                                      
        this.rootNode.resultBox1.draw(lineColor1);
        this.rootNode.resultBox2.draw(lineColor2);
        
        var winnerColor;
        
        // if there is a winner
        // determine winner box color
        if (this.rootNode.winnerName && this.rootNode.winnerName !== "")
        {
            if (masterBracketTree.rootNode.winnerName === this.rootNode.winnerName)
            {
                winnerColor = hitColor;
            }
            else
            {
                winnerColor = missColor;
            }
        }
        else
        {
            winnerColor = neutralColor;
        }
        
        this.rootNode.winnerBox.draw();

        this.drawLinesBetweenResultBoxes(this.rootNode.resultBox1, this.rootNode.resultBox2,
                                         this.rootNode.winnerBox, neutralColor);

        if (this.rootNode.isLeaf())
        {
            return;
        }

        this.recDrawTree(this.rootNode.parentMatch1, masterBracketTree.rootNode.parentMatch1);
        this.recDrawTree(this.rootNode.parentMatch2, masterBracketTree.rootNode.parentMatch2);

        if (this.rootNode.parentMatch1)
        {
            if (!this.rootNode.parentMatch1.isEmpty())
            {
                this.drawLinesBetweenResultBoxes(this.rootNode.parentMatch1.resultBox1, 
                                                 this.rootNode.parentMatch1.resultBox2,
                                                 this.rootNode.resultBox1, neutralColor);
            }
        }
        
        if (this.rootNode.parentMatch2)
        {
            if (!this.rootNode.parentMatch2.isEmpty())
            {
                this.drawLinesBetweenResultBoxes(this.rootNode.parentMatch2.resultBox1, 
                                                 this.rootNode.parentMatch2.resultBox2,
                                                 this.rootNode.resultBox2, neutralColor);
            }
        }
    }
    else if (bracketType === "INTERACTIVE")
    {
        this.drawButtons();
    }
};

/*
 * Recursive helper to drawTree()
 * 
 * @param MatchNode node - The root node of the subtree being visited.
 */
MatchTree.prototype.recDrawTree = function(node, masterSubtree)
{
    if (!node)
    {
        return;
    }
    if (node.isEmpty())
    {
        return;
    }
    
    // hack to be able to use teamHasLost on a subtree rooted at masterSubtree
    var temp = new MatchTree();
    temp.rootNode = masterSubtree;
    masterSubtree = temp;
    
    var lineColor1;
    var lineColor2;
        
    if (!node.isLeaf())
    {   
        if (node.team1Name === masterSubtree.rootNode.team1Name)
        {
            lineColor1 = hitColor;
        }
        else if(masterSubtree.teamHasLost(node.team1Name))
        {
            lineColor1 = missColor;
        }
        else if (masterSubtree.rootNode.team1Name === "")
        {
            lineColor1 = neutralColor;
        }
        else
        {
            lineColor1 = missColor;
        }
        
        if (node.team2Name === masterSubtree.rootNode.team2Name)
        {
            lineColor2 = hitColor;
        }
        else if(masterSubtree.teamHasLost(node.team2Name))
        {
            lineColor2 = missColor;
        }
        else if (masterSubtree.rootNode.team2Name === "")
        {
            lineColor2 = neutralColor;
        }
        else
        {
            lineColor2 = missColor;
        }
    }
    else
    {
        lineColor1 = hitColor;
        lineColor2 = hitColor;
    }
    
    node.resultBox1.draw(lineColor1);
    node.resultBox2.draw(lineColor2);
    
    if (node.isLeaf())
    {
        return;
    }
    
    this.recDrawTree(node.parentMatch1, masterSubtree.rootNode.parentMatch1);
    this.recDrawTree(node.parentMatch2, masterSubtree.rootNode.parentMatch2);
    
    if (!node.parentMatch1.isEmpty() && node.parentMatch1)
    {
        this.drawLinesBetweenResultBoxes(node.parentMatch1.resultBox1, 
                                         node.parentMatch1.resultBox2,
                                         node.resultBox1, neutralColor);
    }
    
    if (!node.parentMatch2.isEmpty() && node.parentMatch2)
    {
        this.drawLinesBetweenResultBoxes(node.parentMatch2.resultBox1, 
                                         node.parentMatch2.resultBox2,
                                         node.resultBox2, neutralColor);
    }
};

/*
 * Determine if a team has lost in the master bracket.
 * 
 * @param string team - name of the team to check
 */
MatchTree.prototype.teamHasLost = function(team)
{
    var hasLost = false;

    if (!this.rootNode)
    {
        return false;
    }
    
    // if this MatchNode contains team and the match has been played
    if ((this.rootNode.team1Name === team || this.rootNode.team2Name === team) && this.rootNode.winnerName !== "")
    {
        // if the team lost
        if (this.rootNode.winnerName !== team)
        {
            hasLost = true;
        }
    }
    else
    {
        hasLost = this.recTeamHasLost(team, this.rootNode.parentMatch1);
        if (!hasLost)
        {
            hasLost = this.recTeamHasLost(team, this.rootNode.parentMatch2);
        }
     }
    
    return hasLost;
};

/*
 * Recursive helper for teamHasLost()
 * 
 * @param string team - name of the team to check
 * @param MatchNode node- the root node of a subtree
 * 
 * @type @new;_L1149
 */
MatchTree.prototype.recTeamHasLost = function(team, node)
{
    var hasLost = false;

    if (!node)
    {
        return false;
    }
    
    // if this MatchNode contains team and the match has been played
    if ((node.team1Name === team || node.team2Name === team) && node.winnerName !== "")
    {
        // if the team lost
        if (node.winnerName !== team)
        {
            hasLost = true;
        }
    }
    else
    {
        hasLost = this.recTeamHasLost(team, node.parentMatch1);
        if (!hasLost)
        {
            hasLost = this.recTeamHasLost(team, node.parentMatch2);
        }
     }
    
    return hasLost;
};

/*
 * Compare two matches.
 * 
 * @param MatchNode node - the node to compare this node to
 * @returns boolean - True if the winners of the matches being compared are the
 *                    same, false if the winners are different.
 */
MatchNode.prototype.compare = function(node)
{
    return (this.winnerName === node.winnerName);
};

/*
 * Draw lines between the participants in a match and the winner.
 * 
 * @param ResultBox resultBox1
 * @param ResultBox resultBox2
 * @param ResultBox winnerBox
 * @param string color - the CSS color for the lines connecting boxes
 */
MatchTree.prototype.drawLinesBetweenResultBoxes = function(resultBox1, resultBox2, winnerBox, color)
{
    // draw horizontal from result box 1
    drawLine(resultBox1.x + resultBox1.width, resultBox1.y + resultBox1.height / 2,
             resultBox1.x + resultBox1.width + minXDistBetweenBoxes / 2, 
             resultBox1.y + resultBox1.height / 2, color);
    // draw vertical from result box 1
    drawLine(resultBox1.x + resultBox1.width + minXDistBetweenBoxes / 2, 
             resultBox1.y + resultBox1.height / 2,
             resultBox1.x + resultBox1.width + minXDistBetweenBoxes / 2, 
             .5 * (resultBox2.y + resultBox1.y + resultBox1.height) - .5 * minYDistBetweenConnectingLines, color);
    // draw vertical from result box 2
    drawLine(resultBox2.x + resultBox2.width + minXDistBetweenBoxes / 2, 
             resultBox2.y + resultBox2.height / 2,
             resultBox2.x + resultBox2.width + minXDistBetweenBoxes / 2, 
             .5 * (resultBox2.y + resultBox1.y + resultBox1.height) + .5 * minYDistBetweenConnectingLines, color);

    // draw horizontal from result box 2
    drawLine(resultBox2.x + resultBox2.width, resultBox2.y + resultBox2.height / 2,
             resultBox2.x + resultBox2.width + minXDistBetweenBoxes / 2, resultBox2.y + resultBox2.height / 2, color);
    // draw line to winner box
    drawLine(winnerBox.x, winnerBox.y + winnerBox.height / 2 - .5 * minYDistBetweenConnectingLines, resultBox1.x + resultBox1.width + 
             minXDistBetweenBoxes / 2, winnerBox.y + winnerBox.height / 2 - .5 * minYDistBetweenConnectingLines, color);
    drawLine(winnerBox.x, winnerBox.y + winnerBox.height / 2 + .5 * minYDistBetweenConnectingLines, resultBox1.x + resultBox1.width + 
             minXDistBetweenBoxes / 2, winnerBox.y + winnerBox.height / 2 + .5 * minYDistBetweenConnectingLines, color);
};

/*
 * ResultBox stores the information needed to display team/score information
 * surrounded by a bounding rectangle.
 * 
 * @property {number} x - x coordinate on the canvas of the upper left corner of the 
 *                 rendered team/score box
 * @property {number} y - y coordinate on the canvas of the upper left corner of the 
 *                 rendered team/score box
 * @property {number} textMargin - minimum distance in pixels between the 
 *                                 rendered team/score string and the surrounding
 *                                 rectangle
 *                                 
 * @param {string} teamName - the team name
 * @param {number} score - the score
 * @param {number} minPixels - the minimum number of pixels to display between
 *                             the team name and the score
 * @returns {ResultBox}
 */
function ResultBox(teamName, seedNumber, score, minPixels, matchData)
{
    var x = 0;
    var y = 0;
    var width;
    var height;
    this.teamName = "(" + seedNumber + ") " + teamName;
    this.score = (score === -1) ? "" : score.toString();

    if (!textBoxHeight)
    {
        var rect = maxBoundingRectOfStrings(matchData);
        textBoxWidth = rect.width;
        textBoxHeight = rect.height;
    }
    
    this.width = textBoxWidth;
    this.height = textBoxHeight;
}

/*
 * Draw a box and team/score text using the properties set in
 * ResultBox.  Set the box and text at the origin specified by x and y
 * in ResultBox  .
 * 
 * @param string color - the CSS style color to render the result box in
 */
ResultBox.prototype.draw = function(color)
{
    var c=document.getElementById(canvasID);
    var context = c.getContext("2d");
    context.strokeStyle = color;
    context.font = font;
    context.textBaseline = "middle";
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.fillText(this.teamName, this.x + textMargin, Math.floor(this.y + textBoxHeight / 2));
    var scoreWidth = getTextWidth(this.score);
    context.fillText(this.score,this.x + textBoxWidth - textMargin - scoreWidth, 
                     Math.floor(this.y + textBoxHeight / 2));
};

/*
 * Get the font size of text rendered in the canvas containing div.
 * 
 * @returns {number} the size of the font as rendered in the div that contains
 * the bracket
 */
function getFontSize()
{
  $( "<span id=\"fontSize\">" + "foo" + "</span>" ).appendTo( "#" + containerDivID);
  var div = document.getElementById("fontSize");
  var fontSize = parseInt(getComputedStyle(div)['font-size']);
  $("#fontSize").remove();
  return fontSize;
}

/*
 * Get the font of text rendered in the canvas containing div.
 * 
 * @returns number - the size of the font as rendered in the div that contains
 *                   the bracket
 */
function getFont()
{
  $( "<span id=\"fontSize\">" + "foo" + "</span>" ).appendTo( "#" + containerDivID);
  var div = document.getElementById("fontSize");
  var font = getComputedStyle(div);
  $("#fontSize").remove();
  return font;
}

/*
 * Measure text width in pixels as it would be displayed when displayed
 * in a specific DOM element.  The style of the text measured is determined by
 * the style that applies to the div that contains the tournament bracket.
 * 
 * @param string the string to measure
 * 
 * @return int the width of the string in pixels
 */
function getTextWidth(string)
{
    $( "<span id=\"textDimension\">" + string + "</span>" ).appendTo( "#" + containerDivID);
    var ruler = document.getElementById("textDimension");
    var width = ruler.offsetWidth;
    $("#textDimension").remove();
    return width;
}

/*
 * Measure text width in pixels as it would be displayed when displayed
 * in a specific DOM element.  The style of the text measured is determined by
 * the style that applies to the div that contains the tournament bracket.
 * 
 * @param string the string to measure
 * 
 * @return int the height of the string in pixels
 */
function getTextHeight(string)
{
    $( "<span id=\"textDimension\">" + string + "</span>" ).appendTo( "#" + containerDivID);
    var ruler = document.getElementById("textDimension");
    var height = ruler.offsetHeight;
    $("#textDimension").remove();
    return height;
}

/*
 * Store position and size information of a rectangle
 */
function Rect()
{
    var x;
    var y;
    var height;
    var width;
}

/*
 * Store position and size information of a rectangle.
 * 
 * @param number x - the x position of the rendered rectangle
 * @param number y - the y position of the rendered rectangle
 * @param number height - the height of the rendered rectangle
 * @param number width - the width of the rendered rectangle
 */
function Rect(x, y, height, width)
{
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
}
/*
 * Get the dimensions of the rectangle that surrounds the given string with
 * the given margin between the string and the rectangle.
 * 
 * @param {string} string - the string the rectangle will surroud
 * @param {number} margin - the margin between the string and the rectangle
 * 
 * @return {Rect} the dimensions of the bounding rectangle
 */
function getBoundingRectOfStrings(string, margin)
{
    var width = 2 * margin + getTextWidth(string);
    var height = 2 * margin + getTextHeight(string);
    var rect = new Rect();
    rect.width = width;
    rect.height = height;
}

/*
 * Get the max bounding rect of all the bounding rects of the team/score strings.
 * 
 * @param {2D array} matchData - the 2 dimensional match data array as described
 *                   in MatchTree.
 * @param {number} minSpacePixels - the minimum number of pixels between the team name and the 
 *                 score
 */
function maxBoundingRectOfStrings(matchData)
{
    var maxWidth = 0;
    var maxHeight = 0;
    
    for (var i = 0; i < matchData.length; i ++)
    {
        var width = getTextWidth(matchData[i][2] + matchData[i][4].toString()) + minPixelsBetweenTeamAndScore;
        maxWidth = (width > maxWidth) ? width : maxWidth;
        width = getTextWidth(matchData[i][3] + matchData[i][5].toString()) + minPixelsBetweenTeamAndScore;
        maxWidth = (width > maxWidth) ? width : maxWidth;
        
        var height = getTextHeight(matchData[i][2] + matchData[i][4].toString());
        maxHeight = (height > maxHeight) ? height : maxHeight;
        height = getTextHeight(matchData[i][3] + matchData[i][5].toString());
        maxHeight = (height > maxHeight) ? height : maxHeight;
    }
    
    var rect = new Rect();
    rect.width = maxWidth + 2 * textMargin;
    rect.height = maxHeight + 2 * textMargin;
    
    return rect;
}

/*
 * Draw a line from x1,y1 to x2,y2
 * 
 * @param {number} x1 - starting x coordinate
 * @param {number} y1 - starting y coordinate
 * @param {number} x2 - ending x coordinate
 * @param {number} y2 - ending y coordinate
 * @param string color - the color of the line
 */
function drawLine(x1, y1, x2, y2, color)
{
    var canvas = document.getElementById(canvasID);
    var context = canvas.getContext("2d");
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

/*
 * Event handler for a button click.  Promotes a team to the next round in the 
 * tournament and if needed resets the rest of the bracket above the round
 * that the team was promoted to.
 */
function handleButtonClick()
{
    promoteTeam(this.id);
}

function promoteTeam(buttonID)
{
    var matchTree = new MatchTree(null);
    var buttonNode = matchTree.getNodeContainingButton(buttonID);
    var thisButton = getDOMButton(buttonID);
    var nextButton;
    
    if (buttonNode.parentNode)
    {
        if (buttonNode === buttonNode.parentNode.parentMatch1)
        {
            nextButton = getDOMButton(buttonNode.parentNode.button1.id);
        }
        else
        {
            nextButton = getDOMButton(buttonNode.parentNode.button2.id);
        }
        
        if (nextButton.html() !== "" && nextButton.html() !== thisButton.html())
        {
            clearPathToWinnerButton(nextButton.attr("id"));
        }

        nextButton.html(thisButton.html());
    }
    // else buttonNode is the root node of the match tree
    else
    {
        nextButton = getDOMButton(buttonNode.winnerButton.id);
        nextButton.html(thisButton.html());
    }
}

/*
 * Starting at a specific button, clear all buttons 
 */
function clearPathToWinnerButton(buttonID)
{
    var matchTree = new MatchTree(null);
    var buttonNode = matchTree.getNodeContainingButton(buttonID);
    
    recClearPathToWinnerButton(buttonNode);
}

function recClearPathToWinnerButton(node)
{
    var button;
    
    if (!node)
    {
        return;
    }
    
    if (!node.parentNode)
    {
        button = getDOMButton(node.winnerButton.id);
        button.html("");
    }
    else
    {
        if (node === node.parentNode.parentMatch1)
        {
            button = getDOMButton(node.parentNode.button1.id);
            button.html("");
        }
        else
        {
            button = getDOMButton(node.parentNode.button2.id);
            button.html("");
        }
        
        recClearPathToWinnerButton(node.parentNode);
    }
}
    
    // find the button and then clear all button text up through the winner button
    
 function getDOMButton(id)
 {
    return $("#" + id);
 }

/*
 * Validate whether or not a bracket is valid.  For a bracket to be valid, all
 * entries must be filled in.
 */
function validateBracket()
{
    var matchTree = new MatchTree();
    var button;
    
    button = getDOMButton(matchTree.rootNode.winnerButton.id);
    
    if (button.html() === "")
    {
        return false;
    }
    
    button = getDOMButton(matchTree.rootNode.button1.id);

    if (button.html() === "")
    {
        return false;
    }
    
    button = getDOMButton(matchTree.rootNode.button2.id);
    
    if (button.html() === "")
    {
        return false;
    }
    
    if (matchTree.rootNode.parentMatch1)
    {
        // check sub-brackets for validity
        return (recValidateBracket(matchTree.rootNode.parentMatch1) &&
                recValidateBracket(matchTree.rootNode.parentMatch2));
    }
    
    return true;
}

function recValidateBracket(node)
{
    var button = getDOMButton(node.button1.id);

    if (button.html() === "")
    {
        return false;
    }
    
    button = getDOMButton(node.button2.id);
    
    if (button.html() === "")
    {
        return false;
    }
    
    if (node.parentMatch1)
    {
        // check sub-brackets for validity
        return (recValidateBracket(node.parentMatch1) &&
                recValidateBracket(node.parentMatch2));
    }
    
    return true;
}

/*
 * Save the bracket to the server.
 * 
 * @return bool - Return true if the bracket successfully saved, false if not.
 */
function saveBracket()
{
    // check that bracket is filled out completely
    if (!validateBracket())
    {
        return false;
    }
    
    var matchTree = new MatchTree();
    
    // sync the match tree with the teams the user chose
    matchTree.syncTreeWithUserBracket();
    
    return JSON.stringify(matchTree.matchData);
}

function clearButtons()
{
    if (bracketType !== "INTERACTIVE")
    {
        return;
    }
    
    var matchTree = new MatchTree(masterBracketData);
    var button = getDOMButton("10");
    button.html("");
    
    if (matchTree.rootNode.parentMatch1)
    {
        button = getDOMButton("11");
        button.html("");
        recClearButtons(matchTree.rootNode.parentMatch1);
    }
    
    if (matchTree.rootNode.parentMatch2)
    {
        button = getDOMButton("12");
        button.html("");
        recClearButtons(matchTree.rootNode.parentMatch2);
    }
}

function recClearButtons(node)
{
    if (!node)
    {
        return;
    }
    
    if (node.parentMatch1)
    {
        button = getDOMButton(node.id + "1");
        button.html("");
        recClearButtons(node.parentMatch1);
    }
    
    if (node.parentMatch2)
    {
        button = getDOMButton(node.id + "2");
        button.html("");
        recClearButtons(node.parentMatch2);
    }
}