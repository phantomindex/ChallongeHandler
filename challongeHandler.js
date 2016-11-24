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
            jsonDate = jsonObj[jsonLength].tournament.start_at;


        if (jsonState != 'complete') {
            jsonState = 'Progress: ' + jsonProgress;
        } else {
            jsonState = "(Finished)"
        }

        if (jsonDate === null || jsonObj[jsonLength].tournament.name === undefined) {
            $.say('No Pending Tournaments!');
            return;
        }

        if (jsonProgress === 0) {
            jsonState = 'Date: ' + Date(jsonDate);
        }
        $.say('Latest Tournament: ' + jsonGame + ' - ' + jsonType + ' - ('  + jsonCount + '/' + jsonCapCount + ' Challengers) ' + jsonState + ' - ' + jsonUrl);
    }

    /**
     * @function setChallongeKey
     * @param key
     * @return sets the API key
     */
    function setChallongeKey(key) {
        if (key === undefined) {
            $.say("Usage: !challongekey <API Key in your challonge settings>");
            return;
        }

        $.say("Challonge API Key set! Key: " + key);
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
