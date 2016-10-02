angular.module('omniMood', []);

var omniMood = angular.module('omniMood');

omniMood.controller('titleController', ['$scope', function ($scope) {
  $scope.title = 'Omni Mood';
}
]);