angular.module('app.index', [])

.controller('IndexController', function($scope, $rootScope, $location, $http, Newsfeed, Root, Auth, User) {
  $scope.currentUserInfo = false;
  $scope.searchResults;
  $scope.searchQuery = ""

  $scope.viewHome = function () {
    $location.path('/newsfeed');
  }
  $scope.viewProfile = function () {
    $location.path('/profile/' + $scope.currentUserInfo.id);
  }

  $scope.viewPortfolio = function () {
    $location.path('/portfolio/' + $scope.currentUserInfo.id);
  }

  $scope.logout = function () {
    return $http({
      method: 'GET',
      url: '/api/logout'
    }).then(function successCallback(response) {
      $scope.currentUserInfo = false;
      console.log('loggedOut')
      $location.path('/');
      }, function errorCallback(response) {
        console.log('something happened. you aren\'t logged out!')
      });
  }

  $scope.findUsersByPartial = function(){
    if($scope.searchQuery.length){
      User.getUserByPartial($scope.searchQuery)
      .then(function(response){
        $scope.searchResults = response;
      })    
    } else {
      $scope.searchResults = [];
    }
  }

  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      Root.addUserInfo($rootScope.user);
      $scope.currentUserInfo = Root.currentUserInfo.data;
      console.log("check it out", $scope.currentUserInfo);
    }
  })



  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});
