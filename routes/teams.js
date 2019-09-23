module.exports = {
    getTeamPage: (req, res) => {
        let queryTeam = "SELECT * FROM `teams` where is_delete=0 ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(queryTeam, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('indexTeam.ejs', {
                title: "Welcome to Socka | View Teams"
                ,teams: result
            });
        });
    },
    getPlayerInTeam: (req, res) => {
        let teamID = req.params.id;
        let queryTeam = "SELECT * FROM teams WHERE id = '" + teamID + "' ";
        let queryPlayerTeam = "SELECT p.first_name as first_name, p.last_name as last_name, t.name as team_name, p.position as position " 
        +"FROM players as p, team_player as tp, teams as t "
        +"WHERE p.user_name=tp.id_player and p.is_delete=0 and t.id=tp.id_team and t.id='"+teamID+"'"; // query database to get all the players IN TEAM

        db.query(queryTeam, (err, result) => {
            if (err) {
                 console.log("Error query"+err);
            }            
        

        // execute query
            db.query(queryPlayerTeam, (err2, result2) => {
                if (err2) {
                    res.redirect('/team');
                }
           
                res.render('seePlayer.ejs', {
                    title: "Welcome to Socka | View Players in Teams"
                   ,team:result[0]
                    ,players:result2        
                });
            });    
        });
    },
    editTeamPage: (req, res) => {
        let teamId = req.params.id;
        let query = "SELECT * FROM teams WHERE id = '" + teamId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-team.ejs', {
                title: "Edit Team"
                ,team: result[0]
                ,message: ''
            });
        });
    },
    editTeam: (req, res) => {
        let teamId = req.params.id;
        let team_name = req.body.team_name;        

        let query = "UPDATE teams SET name = '" + team_name + "' WHERE teams.id = '" + teamId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/team');
        });
    },
    addTeamPage: (req, res) => {
        //untuk membawa data dari backend ke front end.
        res.render('add-team.ejs', {
            title: "Welcome to Socka | Add a new team"
            ,message: ''
        });
    },
    addTeam: (req, res) => {
                
        let message = '';
        let team_name = req.body.team_name;        
        let usernameQuery = "SELECT * FROM teams WHERE name = '" + team_name + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Team already exists';
                res.render('add-team.ejs', {
                    message,
                    title: "Welcome to Socka | Add a Team"
                });
            } else {
                                        
                let query = "INSERT INTO teams (name) VALUES ('" +team_name+"')";
                db.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/team');
                });                
            }
        });
    },
    addPlayertoTeamPage: (req, res) => {
        let message = '';
        let teamID = req.params.id;
        let queryTeam = "SELECT * FROM teams WHERE id = '" + teamID + "' ";
        let queryPlayer = "SELECT * FROM players"; // query database to get all the players IN TEAM

        db.query(queryTeam, (err, result) => {
            if (err) {
                 console.log("Error query"+err);
            }                    
        // execute query
            db.query(queryPlayer, (err2, result2) => {
                if (err2) {
                    res.redirect('/team');
                }
           
                res.render('add-player-team.ejs', {
                    title: "Welcome to Socka | Add a Player to a team"
                    ,message: message
                    ,team:result[0]
                    ,players:result2        
                });
            });    
        });
    },
     addPlayertoTeam: (req, res) => {                
        let message = '';        
        let player = req.body.player;
        let teamID = req.params.id;
        let queryTeam = "SELECT * FROM team_player WHERE id_team = '" + teamID + "' and id_player='"+player+"'";        

        db.query(queryTeam, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Player already exists';
                res.redirect('/team/addPlayer/'+teamID);
            } else {
                 console.log(player);
                let query = "INSERT INTO team_player (id_team, id_player) VALUES ('"+teamID+"', '"+player+"')";
                db.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/team/player/'+teamID);
                });                
            }
        });
    },
    deleteTeam: (req, res) => {
        let teamId = req.params.id;
        //let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
        //let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';
        let deleteTeamQuery ="UPDATE teams SET is_delete = '1' WHERE teams.id = "+ teamId;
            db.query(deleteTeamQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/team');
            });
     
    }
};