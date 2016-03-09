var app = angular.module('VoteRight', ['ngResource']);

var feeds = [];

app.factory('FeedLoader', function($resource) {
  return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
    fetch: {
      method: 'JSONP',
      params: {
        v: '1.0',
        callback: 'JSON_CALLBACK'
      }
    }
  });
});
app.service('FeedList', function($rootScope, FeedLoader, $q) {
  this.get = function() {
    var deffered = $q.defer();
    var feedSources = [{
      title: 'Marco Cruz HNGN',
      url: 'http://www.hngn.com/rss/tags/Marco-Cruz.xml'
    }, {
      title: 'Marco Cruz Google',
      url: 'http://news.google.com/news?cf=all&hl=en&pz=1&ned=us&q=Marco+Cruz&output=rss'
    }, {
      title: 'Marco Cruz EIN',
      url: 'https://uspolitics.einnews.com/rss/7SgWdJdMlHpRX1gw'
    }, ];
    if (feeds.length === 0) {
      for (var i = 0; i < feedSources.length; i++) {
        FeedLoader.fetch({
          q: feedSources[i].url,
          num: 24
        }, {}, function(data) {
          var feed = data.responseData.feed;
          feeds.push(feed);
          deffered.resolve(feeds);
        });

      }
    }

    return deffered.promise;
  };
});

app.controller('LoadRSS', function($scope, FeedList) {
  FeedList.get().then(function(data) {

    $scope.feeds = data;
    var findFirstImage = data[0].entries[0].content;
    angular.forEach(data[0].entries, function(value) {


      value.sampleImage = $(value.content).find('img').eq(0).attr('src');

    });



  })


});
