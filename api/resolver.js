var key = require('../utils/key');
var request = require('request');
var _ = require('underscore');
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var style = '\
<style>\
  body{\
    font-family: Arial, Helvetica, sans-serif;\
  }\
  .row{\
    overflow-x: scroll;\
    white-space:nowrap\
  }\
  .row div{\
    display:inline-block;\
    padding: 0px 10px 0px 10px;\
    mix-width: 100px;\
  }\
  .row img{\
    display: block;\
    margin: 0 auto;\
    width: 50px; \
    height: 50px; \
  }\
  a, a:hover, a:visited{\
    font-size: 14px;\
    color:#999;\
    text-decoration: none;\
  }\
  h3{\
    margin-bottom:0px;\
  }\
</style>';

// The API that returns the in-email representation.
module.exports = function(req, res) {
  var url = req.query.url.trim();
  var matches = url.match(/([0-9]+)(\/?)$/);
  if (!matches) {
    res.status(400).send('Invalid URL format');
    return;
  }

  var id = matches[1];

  var response = request({
    url: 'https://www.metaweather.com/api/location/' + encodeURIComponent(id) + '/',
    gzip: true,
    json: true,
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }

    var html = '';
    var res_week = response.body.consolidated_weather;
    for (i = 0; i < res_week.length; i++){
      entry = res_week[i];
      var day = '';
      if(i == 0){
        day = 'Today';
      }else if(i == 1){
        day = 'Tomorrow';
      }else{
        var date = new Date(entry.applicable_date)
        day = days[date.getDay()] + ', ' + date.getMonth() + '/' + date.getDate();
      }
      temp = (parseFloat(entry.the_temp) * 9 / 5 + 32).toFixed(1).toString() + '&#8457;';
      html += '<div><h4>' + day + '</h4><img src="https://www.metaweather.com/static/img/weather/' + entry.weather_state_abbr + '.svg" alt="' + entry.weather_state_name + '"><br>' + temp + '</div>';
    }

    res.json({
      body: style + '<h3>Weather in ' + response.body.title + ', ' + response.body.parent.title + '<br><a target="_blank" href="' + url + '"><small>' + url + '</small></a></h3><div class="row">' + html + '</div>'
        // Add raw:true if you're returning content that you want the user to be able to edit
    });
  });
};