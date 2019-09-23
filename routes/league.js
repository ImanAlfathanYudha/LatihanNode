const fs = require('fs');

module.exports = {
	getLeaguesPage: (req, res) => {
        let queryTeam = "SELECT * FROM league ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(queryTeam, (err, result) => {
            if (err) {
                res.redirect('/league');
            }
            res.render('indexLeague.ejs', {
                title: "Welcome to Socka | View Leagues"
                ,leagues: result
            });
        });
    },
    getMatchInLeague: (req, res) => {
        let leagueID = req.params.id;
        let queryLeague = "SELECT * FROM league WHERE id = '" + leagueID + "' ";
        let queryMatch = "SELECT t.name as team1, (Select t2.name from teams as t2 where lt.id_team2=t2.id) as team2, lt.match_time,lt.stadion,lt.match_status "
        +"FROM league_team as lt, teams as t, league as l "
        +"WHERE lt.id_team1=t.id and lt.id_league=l.id and l.id="+leagueID
        +" order by lt.match_time asc"; // query database to get all the players IN TEAM

        db.query(queryLeague, (err, result) => {
            if (err) {
                 console.log("Error query"+err);
            }            
        

        // execute query
            db.query(queryMatch, (err2, result2) => {
                if (err2) {
                    res.redirect('/team');
                }
           
                res.render('seeMatch.ejs', {
                    title: "Welcome to Socka | View Match"
                   ,league:result[0]
                    ,matches:result2        
                });
            });    
        });
    },
    addMatchPage: (req, res) => {
        let message = '';
        let leagueID = req.params.id;
        let queryLeague = "SELECT * FROM league WHERE id = '" + leagueID + "' ";
        let queryTeam = "SELECT * FROM teams"; // query database to get all the players IN TEAM

        db.query(queryTeam, (err, result) => {
            if (err) {
                 console.log("Error query"+err);
            }                    
        // execute query
            db.query(queryLeague, (err2, result2) => {
                if (err2) {
                    res.redirect('/league');
                }
           
                res.render('add-match.ejs', {
                    title: "Welcome to Socka | Add a Player to a team"
                    ,message: message
                    ,league:result2[0]
                    ,teams:result
                });
            });    
        });
    },
     addMatch: (req, res) => {                
        let message = '';        
        let team1 = req.body.team1;
        let team2 = req.body.team2;
        let leagueID = req.params.id;
        //let queryTeam = "SELECT * FROM team_player WHERE id_team = '" + teamID + "' and id_player='"+player+"'";        
        let query = "INSERT INTO league_team (id_team1, id_team2, id_league) VALUES ('"+team1+"', '"+team2+"', '"+leagueID+"')";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/league/match/'+leagueID);
        }); 
    },
};