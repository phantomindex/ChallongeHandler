/**
 * challongeHandler.js
 *
 * Display, Join, Create, and Delete challonge tournaments.
 */
(function() {
    var HttpResponse = Packages.com.gmt2001.HttpResponse,
        HttpRequest = Packages.com.gmt2001.HttpRequest,
        HashMap = Packages.java.util.HashMap,
        apiKey = $.inidb.get('challonge', 'key'),
        tournament = 'https://api.challonge.com/v1/tournaments.json?api_key=' + apiKey + '&state=all',
        responseData = HttpRequest.getData(HttpRequest.RequestType.GET, tournament, "", new HashMap()),
        jsonObj = JSON.parse(responseData.content),
        jsonLength = (jsonObj.length - 1),
        jsonID = jsonObj[jsonLength].tournament.url,
        interval;
        startCycle();
        resetCycle();


    /**
     * @function getChallengeData
     * @return Retrieves data on the lastest tournament
     */
    function getChallongeData(sender) {

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
            jsonWinner = ' Champion: ' + $.userPrefix(reportWinner());

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

        if (jsonState == 'pending') {
            jsonState = 'Date: ' + Date(jsonDate);
        }
        $.say('Latest Tournament: ' + jsonGame + ' - ' + jsonTeams + toTitleCase(jsonType) + ' - (' + jsonCount + '/' + jsonCapCount + ' Challengers) ' + jsonState + jsonWinner + ' - ' + jsonUrl);
        //$.say($.lang.get('challongeHandler.tournament.message', jsonGame, jsonTeams, toTitleCase(jsonType), jsonCount, jsonCapCount, jsonState, jsonWinner, jsonUrl));
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
            var posturl = 'https://api.challonge.com/v1/tournaments/' + jsonID + '/participants.json';
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
                $.say("Tournament: " + jsonName + " for " + jsonGame + " has just ended! (" + $.userPrefix(reportWinner()) + ") is our new Champion! Checkout the results: " + jsonUrl);
                return "success";
                //$.say($.lang.get('challongeHandler.tournament.ended');
            }
    }

    /**
     * @function reportMatch
     * @return checks if a match has ended and reports it in chat
     */
    function reportMatch(event) {

    }

    /**
     * @function reportMatch
     * @return checks if a match has ended and reports it in chat
     */
    function reportWinner(string) {
        var participants = 'https://api.challonge.com/v1/tournaments/' + jsonID + '/participants.json?api_key=' + apiKey,
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
        return jsonChampion;
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

        if (command.equalsIgnoreCase('tournament')) {
            if (!$.inidb.exists('challonge', 'key')) {
                $.say('You need to set your Challonge API Key using: !challongekey <api key>');
                //$.say($.lang.get('challongeHandler.key.missing');
                return;
            }
            getChallongeData()
        }

        if (command.equalsIgnoreCase('challongekey')) {
            setChallongeKey(action)
        }

        if (command.equalsIgnoreCase('signup')) {
            registerChallenger(sender, action)
        }
    });


function startCycle() {
    var intervalStart = setInterval(function() {
      if (tournamentStarted() == 'success') {
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

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./handlers/challongeHandler.js')) {
            $.registerChatCommand('./handlers/challongeHandler.js', 'tournament');
            $.registerChatCommand('./handlers/challongeHandler.js', 'challongekey', 1);
            $.registerChatCommand('./handlers/challongeHandler.js', 'signup');
        }
    });

})();
