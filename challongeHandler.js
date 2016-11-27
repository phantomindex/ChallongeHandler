/**
 * challongeHandler.js
 *
 * Display, Join, Create, and Delete challonge tournaments.
 */
(function() {
    var HttpResponse,
        HttpRequest,
        HashMap,
        apiKey,
        tournament,
        responseData,
        jsonObj,
        jsonLength,
        latestID,
        jsonID;

    if ($.inidb.exists('challonge', 'key')) {
        loadChallongeData();
        startCycle();
    }

    /**
     * @function loadChallengeData
     * @return Retrieves data on the lastest tournament
     */
    function loadChallongeData(event) {

        HttpResponse = Packages.com.gmt2001.HttpResponse;
        HttpRequest = Packages.com.gmt2001.HttpRequest;
        HashMap = Packages.java.util.HashMap;
        apiKey = $.inidb.get('challonge', 'key');
        tournament = 'https://api.challonge.com/v1/tournaments.json?api_key=' + apiKey + '&state=all';
        responseData = HttpRequest.getData(HttpRequest.RequestType.GET, tournament, "", new HashMap());
        jsonObj = JSON.parse(responseData.content);
        jsonLength = (jsonObj.length - 1);
        latestID = '/' + jsonObj[jsonLength].tournament.url;

        if ($.inidb.exists('challonge', 'tournamentid')) {
          jsonID = '/' + $.inidb.get('challonge', 'tournamentid');
        } else {
          jsonID = '/' + jsonObj[jsonLength].tournament.url;
        }
    }

    /**
     * @function getLatest
     * @return Retrieves data on the lastest tournament
     */
    function getLatest(sender) {

        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, tournament, "", new HashMap()),
            jsonObj = JSON.parse(responseData.content),
            jsonLength = (jsonObj.length - 1),
            jsonName = jsonObj[jsonLength].tournament.name,
            jsonUrl = jsonObj[jsonLength].tournament.full_challonge_url,
            jsonState = jsonObj[jsonLength].tournament.state,
            jsonProgress = jsonObj[jsonLength].tournament.progress_meter,
            jsonGame = jsonObj[jsonLength].tournament.game_name,
            jsonCount = jsonObj[jsonLength].tournament.participants_count,
            jsonCapCount = jsonObj[jsonLength].tournament.signup_cap,
            jsonType = jsonObj[jsonLength].tournament.tournament_type,
            jsonTeams = jsonObj[jsonLength].tournament.teams,
            jsonDate = jsonObj[jsonLength].tournament.start_at,
            jsonStarted = jsonObj[jsonLength].tournament.started_at,
            jsonCompleted = jsonObj[jsonLength].tournament.completed_at,
            jsonSignUrl = jsonObj[jsonLength].tournament.sign_up_url,
            jsonSignUp = jsonObj[jsonLength].tournament.open_signup,
            jsonID = '/' + jsonObj[jsonLength].tournament.url,
            jsonWinner = ' Champion: ' + latestChampion();

        if (jsonState == 'underway' && jsonProgress >= 0) {
            jsonState = 'Progress: ' + jsonProgress + '/100%';
        }

        if (jsonSignUp != false) {
            jsonUrl = jsonSignUrl;
        }

        if (jsonTeams != 'true') {
            jsonTeams = '';
        } else {
            jsonTeams = 'Team ';
        }

        if (jsonDate === null || jsonLength === undefined) {
            $.say('No Pending Tournaments!');
            //$.say($.lang.get('challongeHandler.tournament.404');
            return;
        }
        if (jsonState != 'complete') {
            jsonWinner = '';
        }

        if (jsonCapCount === null) {
            jsonCapCount = jsonCount;
        }

        if (jsonState == 'pending') {
            jsonState = 'Date: ' + getDateFrom(jsonDate);
        }
        $.say('Latest Tournament: ' + jsonGame + ' - ' + jsonTeams + toTitleCase(jsonType) + ' - (' + jsonCount + '/' + jsonCapCount + ' Challengers) ' + jsonState + jsonWinner + ' - ' + jsonUrl);
        //$.say($.lang.get('challongeHandler.tournament.message', jsonGame, jsonTeams, toTitleCase(jsonType), jsonCount, jsonCapCount, jsonState, jsonWinner, jsonUrl));
    }

    /**
     * @function getCurrent
     * @return Retrieves data on the current tournament
     */
    function getCurrent(sender) {

        var current = 'https://api.challonge.com/v1/tournaments' + jsonID + '.json?api_key=' + apiKey + '&state=all',
            responseData = HttpRequest.getData(HttpRequest.RequestType.GET, current, "", new HashMap()),
            jsonObj = JSON.parse(responseData.content),
            jsonUrl = jsonObj.tournament.full_challonge_url,
            jsonState = jsonObj.tournament.state,
            jsonProgress = jsonObj.tournament.progress_meter,
            jsonGame = jsonObj.tournament.game_name,
            jsonCount = jsonObj.tournament.participants_count,
            jsonCapCount = jsonObj.tournament.signup_cap,
            jsonType = jsonObj.tournament.tournament_type,
            jsonTeams = jsonObj.tournament.teams,
            jsonDate = jsonObj.tournament.start_at,
            jsonStarted = jsonObj.tournament.started_at,
            jsonCompleted = jsonObj.tournament.completed_at;
            jsonSignUrl = jsonObj.tournament.sign_up_url,
            jsonSignUp = jsonObj.tournament.open_signup,
            jsonWinner = ' Champion: ' + currentChampion();

        if (jsonState == 'underway' && jsonProgress >= 0) {
            jsonState = 'Progress: ' + jsonProgress + '/100%';
        }

        if (jsonSignUp != false) {
            jsonUrl = jsonSignUrl;
        }

        if (jsonTeams != 'true') {
            jsonTeams = '';
        } else {
            jsonTeams = 'Team ';
        }

        if (jsonDate === null || jsonLength === undefined) {
            $.say('No Pending Tournaments!');
            //$.say($.lang.get('challongeHandler.tournament.404');
            return;
        }
        if (jsonState != 'complete') {
            jsonWinner = '';
        }
        if (jsonCapCount === null) {
          jsonCapCount = jsonCount;
        }

        if (jsonState == 'pending') {
            jsonState = 'Date: ' + getDateFrom(jsonDate);
        }

        $.say('Current Tournament: ' + jsonGame + ' - ' + jsonTeams + toTitleCase(jsonType) + ' - (' + jsonCount + '/' + jsonCapCount + ' Challengers) ' + jsonState + jsonWinner + ' - ' + jsonUrl);
        //$.say($.lang.get('challongeHandler.tournament.message', jsonGame, jsonTeams, toTitleCase(jsonType), jsonCount, jsonCapCount, jsonState, jsonWinner, jsonUrl));
    }
    /**
     * @function setTournamentID
     * @param key
     * @return set which tournament you want
     */
    function setTournamentID(tourID) {
        if (tourID === undefined) {
            $.say("Usage: !challongeid <Tournament ID> ");
            //$.say($.lang.get('challongeHandler.tourID.404');
            return;
        } else if (tourID === 'clear') {
          $.say("Tournament ID cleared");
          $.inidb.del('challonge', 'tournamentid');
          return;
        } else {
          $.say("Tournament ID set! Key: " + tourID);
          //$.say($.lang.get('challongeHandler.tourID.success', key);
          $.inidb.set('challonge', 'tournamentid', tourID);
          return;
        }
    }
    /**
     * @function setChallongeKey
     * @param key
     * @return sets the API key
     */
    function setChallongeKey(key) {
        if (key === undefined) {
            $.say("Usage: !challongekey <API Key in your challonge settings>");
            //$.say($.lang.get('challongeHandler.key.404');
            return;
        }

        $.say("Challonge API Key set! Key: " + key);
        //$.say($.lang.get('challongeHandler.key.success', key);
        $.inidb.set('challonge', 'key', key);
        return;
    }

    /**
     * @function registerChallenger
     * @param action
     * @return registers sender to the latest tournament
     */
    function registerChallenger(sender, action) {
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, tournament, "", new HashMap()),
            jsonObj = JSON.parse(responseData.content),
            jsonLength = (jsonObj.length - 1),
            jsonSignUrl = jsonObj[jsonLength].tournament.sign_up_url,
            jsonSignUp = jsonObj[jsonLength].tournament.open_signup,
            jsonID = jsonObj[jsonLength].tournament.url;

        if (jsonSignUp === false && action === undefined) {
            $.say("Please specify a challonge username to register: !signup <challongename>");
            return;
            //$.say($.lang.get('challongeHandler.signup.404');
        } else if (action === undefined) {
            $.say("Signup: " + jsonSignUrl);
            return;
            //$.say($.lang.get('challongeHandler.signup.link');
        } else {
            var posturl = 'https://api.challonge.com/v1/tournaments' + jsonID + '/participants.json';
            $.say($.whisperPrefix(sender) + 'has registered to the tournament as: ' + action + '!');
            //$.say($.lang.get('challongeHandler.signup.registered');
            return;
        }
    }

    /**
     * @function tournamentStarted
     * @return Checks to see if the tournament started
     */
    function tournamentStarted(event) {
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, tournament, "", new HashMap()),
            jsonObj = JSON.parse(responseData.content),
            jsonLength = (jsonObj.length - 1),
            jsonState = jsonObj[jsonLength].tournament.state,
            jsonProgress = jsonObj[jsonLength].tournament.progress_meter,
            jsonName = jsonObj[jsonLength].tournament.name,
            jsonUrl = jsonObj[jsonLength].tournament.full_challonge_url,
            jsonGame = jsonObj[jsonLength].tournament.game_name;

        if (jsonState == 'underway') {
            $.say("Tournament: " + jsonName + " for " + jsonGame + " has just started! Checkout the bracket at: " + jsonUrl);
            return "success";
            //$.say($.lang.get('challongeHandler.tournament.started');
        }
    }

    /**
     * @function tournamentReset
     * @return Checks to see if the tournament was reset
     */
    function tournamentReset(event) {
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, tournament, "", new HashMap()),
            jsonObj = JSON.parse(responseData.content),
            jsonLength = (jsonObj.length - 1),
            jsonState = jsonObj[jsonLength].tournament.state,
            jsonProgress = jsonObj[jsonLength].tournament.progress_meter,
            jsonName = jsonObj[jsonLength].tournament.name,
            jsonUrl = jsonObj[jsonLength].tournament.full_challonge_url,
            jsonGame = jsonObj[jsonLength].tournament.game_name;

        if (jsonState == 'pending') {
            $.say("Tournament: " + jsonName + " for " + jsonGame + " was reset! Sign up at: " + jsonUrl);
            return "success";
            //$.say($.lang.get('challongeHandler.tournament.started');
        }
    }

    /**
     * @function tournamentEnded
     * @return Checks to see if the tournament ended
     */
    function tournamentEnded(event) {
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, tournament, "", new HashMap()),
            jsonObj = JSON.parse(responseData.content),
            jsonLength = (jsonObj.length - 1),
            jsonState = jsonObj[jsonLength].tournament.state,
            jsonName = jsonObj[jsonLength].tournament.name,
            jsonUrl = jsonObj[jsonLength].tournament.full_challonge_url,
            jsonGame = jsonObj[jsonLength].tournament.game_name;

        if (jsonState == 'complete') {
            $.say("Tournament: " + jsonName + " for " + jsonGame + " has just ended! (" + $.userPrefix(reportChampion()) + ") is our new Champion! Checkout the results: " + jsonUrl);
            return "success";
            //$.say($.lang.get('challongeHandler.tournament.ended');
        }
    }

    /**
     * @function playerID
     * @return Changes participant id to username or name
     */
    function playerID(string) {
        var participants = 'https://api.challonge.com/v1/tournaments' + jsonID + '/participants.json?api_key=' + apiKey,
            responseData = HttpRequest.getData(HttpRequest.RequestType.GET, participants, "", new HashMap()),
            jsonObj = JSON.parse(responseData.content),
            jsonChampion,
            jsonLength = (jsonObj.length - 1);

        for (jsonLength in jsonObj) {
            if (jsonObj[jsonLength].participant.id == string) {
                if (jsonObj[jsonLength].participant.username === null) {
                    Player = toTitleCase(jsonObj[jsonLength].participant.name);
                } else {
                    Player = toTitleCase(jsonObj[jsonLength].participant.username);
                }
            }
        }
        return Player;
    }

    /**
     * @function reportMatch
     * @return checks if a match has ended and reports it in chat
     */
    function reportMatch(event) {
        var matches = 'https://api.challonge.com/v1/tournaments' + jsonID + '/matches.json?api_key=' + apiKey,
            responseData = HttpRequest.getData(HttpRequest.RequestType.GET, matches, "", new HashMap()),
            jsonObj = JSON.parse(responseData.content),
            jsonLength = (jsonObj.length - 1),
            matchID,
            jsonState = jsonObj[jsonLength].match.state,
            jsonUnderwar = jsonObj[jsonLength].match.underway_at,
            jsonWinner,
            jsonLoser;


        for (var i in jsonObj) {
            if (jsonObj[i].match.state == 'complete') {
                matchID = jsonObj[i].match.id.toString();
                jsonWinner = jsonObj[i].match.winner_id;
                jsonLoser = jsonObj[i].match.loser_id;
                //$.consoleLn(matchID + ' ' + jsonWinner + ' ' + jsonLoser);
            }
        }

        if (!$.inidb.exists('playedMatches', (matchID + '_' + jsonObj[jsonLength].match.state))) {
            $.say("The match between " + playerID(jsonWinner) + ' and ' + playerID(jsonLoser) + " is over! " + playerID(jsonWinner) + " wins!");
            $.inidb.set('playedMatches', (matchID + '_' + jsonObj[jsonLength].match.state), true);
            return 'success';
        }

    }

    /**
     * @function currentChampion
     * @return checks if a match has ended and reports it in chat
     */
    function currentChampion(string) {
        var participants = 'https://api.challonge.com/v1/tournaments' + jsonID + '/participants.json?api_key=' + apiKey,
            responseData = HttpRequest.getData(HttpRequest.RequestType.GET, participants, "", new HashMap()),
            jsonObj = JSON.parse(responseData.content),
            jsonChampion,
            jsonLength = (jsonObj.length - 1);

        for (jsonLength in jsonObj) {
            if (jsonObj[jsonLength].participant.final_rank == '1') {
                if (jsonObj[jsonLength].participant.username === null) {
                    jsonChampion = jsonObj[jsonLength].participant.name;
                } else {
                    jsonChampion = jsonObj[jsonLength].participant.username;
                }
            }
        }
        return toTitleCase(jsonChampion);
    }

    /**
     * @function latestChampion
     * @return checks if a match has ended and reports it in chat
     */
    function latestChampion(string) {
        var participants = 'https://api.challonge.com/v1/tournaments' + latestID + '/participants.json?api_key=' + apiKey,
            responseData = HttpRequest.getData(HttpRequest.RequestType.GET, participants, "", new HashMap()),
            jsonObj = JSON.parse(responseData.content),
            jsonChampion,
            jsonLength = (jsonObj.length - 1);

        for (jsonLength in jsonObj) {
            if (jsonObj[jsonLength].participant.final_rank == '1') {
                if (jsonObj[jsonLength].participant.username === null) {
                    jsonChampion = jsonObj[jsonLength].participant.name;
                } else {
                    jsonChampion = jsonObj[jsonLength].participant.username;
                }
            }
        }
        return toTitleCase(jsonChampion);
    }
    /**
     * @function getDateFrom
     * @return converts date string to proper format
     */
     function getDateFrom(date) {
         var dateFormat = new java.text.SimpleDateFormat("dd-M-yyyy @ h:mm a z"),
             newDate = dateFormat.format(new Date(date));

         return newDate;
     }

    /**
     * @function toTitleCase
     * @return Capitalize the first letter of each word
     */
    function toTitleCase(string) {
        return string.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];
        if (command.equalsIgnoreCase('latest')) {
                if (!$.inidb.exists('challonge', 'key')) {
                    $.say('You need to set your Challonge API Key using: !challongekey <api key>');
                    //$.say($.lang.get('challongeHandler.key.missing');
                    return;
                } else {
                    getLatest()
                }

            }

        if (command.equalsIgnoreCase('tournament')) {
            if (!$.inidb.exists('challonge', 'key')) {
                $.say('You need to set your Challonge API Key using: !challongekey <api key>');
                //$.say($.lang.get('challongeHandler.key.missing');
                return;
            } else {
                getCurrent()
            }

        }

        if (command.equalsIgnoreCase('challongekey')) {
            setChallongeKey(action)
        }
        if (command.equalsIgnoreCase('challongeid')) {
            setTournamentID(action)
        }

        if (command.equalsIgnoreCase('signup')) {
            registerChallenger(sender, action)
        }
    });


    function startCycle() {
        var intervalStart = setInterval(function() {
            if (tournamentStarted() == 'success') {
                matchCycle();
                endCycle();
                resetCycle();
                clearTimeout(intervalStart);
            }
        }, 30000);
    }

    function resetCycle() {
        var intervalReset = setInterval(function() {
            if (tournamentReset() == 'success') {
                startCycle();
                clearTimeout(intervalReset);
            }
        }, 30000);
    }

    function endCycle() {
        var intervalEnd = setInterval(function() {
            if (tournamentEnded() == 'success') {
                startCycle();
                resetCycle();
                clearTimeout(intervalEnd);
            }
        }, 30000);
    }

    function matchCycle() {
        var intervalMatch = setInterval(function() {
            if (reportMatch() == 'success') {
                resetCycle();
            }
        }, 30000);
    }

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./handlers/challongeHandler.js')) {
            $.registerChatCommand('./handlers/challongeHandler.js', 'latest');
            $.registerChatCommand('./handlers/challongeHandler.js', 'tournament');
            $.registerChatCommand('./handlers/challongeHandler.js', 'challongekey', 1);
            $.registerChatCommand('./handlers/challongeHandler.js', 'challongeid', 1);
            $.registerChatCommand('./handlers/challongeHandler.js', 'signup');
        }
    });

})();
