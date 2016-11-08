module.exports = function (app) {
  app.directive('mediaList', function () {
    return {
      scope: {
        medias: '='
      },
      templateUrl: './templates/media_list.html'
    };
  });
};
