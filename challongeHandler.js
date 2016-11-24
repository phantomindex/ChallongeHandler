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
        url;


    /**
     * @function getChallengeData
     * @return Retrieves data on the lastest tournament
     */
    function getChallongeData(sender) {

            url = 'https://api.challonge.com/v1/tournaments.json?api_key=' + apiKey + '&state=all',
            responseData = HttpRequest.getData(HttpRequest.RequestType.GET, url, "", new HashMap()),
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
            jsonSignUp = jsonObj[jsonLength].tournament.sign_up_url;

        if (jsonState != 'complete') {
            jsonState = 'Progress: ' + jsonProgress;
        } else {
            jsonState = "(Finished)"
        }

        if (jsonsignUp != null) {
          jsonUrl = jsonsignUp;
        }

        if (jsonTeams != 'true') {
          jsonTeams = '';
        } else {
          jsonTeams = 'Team ';
        }

        if (jsonDate === null || jsonLength === undefined) {
            $.say('No Pending Tournaments!');
            //$.say($.lang.get('challongeHandler.tournament.none');
            return;
        }

        if (jsonProgress === 0) {
            jsonState = 'Date: ' + Date(jsonDate);
        }
        $.say('Latest Tournament: ' + jsonGame + ' - ' + jsonTeams + toTitleCase(jsonType) + ' - ('  + jsonCount + '/' + jsonCapCount + ' Challengers) '  + jsonState + ' - ' + jsonUrl);
        //$.say($.lang.get('challongeHandler.tournament.message', jsonGame, jsonTeams, toTitleCase(jsonType), jsonCount, jsonCapCount, jsonState, jsonUrl));
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
     * @param sender
     * @return registers sender to the latest tournament
     */
    function registerChallenger(sender) {

    }

    /**
     * @function tournamentStarted
     * @return Checks to see if the tournament started
     */
    function tournamentStarted(event) {

    }

    /**
     * @function tournamentEnded
     * @return Checks to see if the tournament ended
     */
    function tournamentEnded(event) {

    }

    /**
     * @function toTitleCase
     * @return Capitalize the first letter of each word
     */
    function toTitleCase(string) {
      return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
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
            registerChallenger(sender)
        }
    });

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
