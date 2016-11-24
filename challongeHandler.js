/**
 * challongeHandler.js
 *
 * Detect and report challonge tournaments.
 */
(function() {
  
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs();


    /**
    * @commandpath tournament - Display the last tournament.
    */
    if (command.equalsIgnoreCase('tournament')) {

      if ($.inidb.get('challonge', 'key') === undefined) {
        $.say('Please make sure you\'ve set your Challonge API Key using !challongeKey');
        return;
      }

          var url = 'https://api.challonge.com/v1/tournaments.json?api_key=' + $.inidb.get('challonge', 'key') + '&state=all',
          HttpResponse = Packages.com.gmt2001.HttpResponse,
          HttpRequest = Packages.com.gmt2001.HttpRequest,
          HashMap = Packages.java.util.HashMap,
          responseData = HttpRequest.getData(HttpRequest.RequestType.GET, url, "", new HashMap()),
          jsonObj = JSON.parse(responseData.content),
          jsonName = jsonObj[0].tournament.name;
          jsonUrl = jsonObj[0].tournament.full_challonge_url;
          jsonState = jsonObj[0].tournament.state;
          jsonProgress = jsonObj[0].tournament.progress_meter;
          jsonGame = jsonObj[0].tournament.game_name;
          jsonCount = jsonObj[0].tournament.participants_count;
          jsonType = jsonObj[0].tournament.tournament_type;
          jsonDate = jsonObj[0].tournament.start_at;


        if (jsonState != 'complete') {
          jsonState = 'Progress: ' + jsonProgress;
        } else {
          jsonState = "(Finished)"
        }

        if (jsonDate === null || jsonObj[0].tournament.name === undefined) {
          $.say('No Pending Tournaments!');
          return;
        }

        if (jsonProgress === 0) {
          jsonState = 'Date: ' + jsonDate;
        }

       $.say('Latest Tournament: ' + jsonGame  + ' - Settings: ' + jsonCount + ' Player ' + jsonType + ' - ' + jsonState + ' - ' + jsonUrl);
    }

      if (command.equalsIgnoreCase('challongekey')) {
        $.say("Challonge API Key set! Key: " + args[0]);
        $.inidb.set('challonge', 'key', args[0]);
      } else if (command.equalsIgnoreCase('challongekey') && args[0] === undefined) {
        $.say("Usage: !challongekey <API Key in your challonge settings>");
        return;
      }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./handlers/challongeHandler.js')) {
            $.registerChatCommand('./handlers/challongeHandler.js', 'tournament');
            $.registerChatCommand('./handlers/challongeHandler.js', 'challongekey', 1);
        }
    });

})();
