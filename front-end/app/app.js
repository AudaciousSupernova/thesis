angular.module('app', [
  'app.profile',
  'app.newsfeed', 
  'app.buy', 
  'app.sell', 
  'app.portfolio',
  'app.auth',
  'ngRoute', 
  'ui.router', 
  'app.services', 
  'app.index', 
  'ngMaterial'
  ])

.config(function ($routeProvider, $stateProvider, $sceProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/', 
      templateUrl: 'app/views/auth.html', 
      controller: 'AuthController',
      authenticate: false
    })
    .state('newsfeed', {
      url: '/newsfeed', 
      templateUrl: 'app/views/newsfeed.html', 
      controller: 'NewsfeedController',
      authenticate: true
    })
    .state('profile', {
      url: '/profile/:id', 
      templateUrl: 'app/views/profile.html', 
      controller: 'ProfileController',
      authenticate: true
    })
    .state('buy', {
      url: '/buy', 
      templateUrl: 'app/views/buy.html', 
      controller: 'BuyController',
      authenticate: true
    })
    .state('sell', {
      url: '/sell', 
      templateUrl: 'app/views/sell.html', 
      controller: 'SellController',
      authenticate: true
    })
    .state('portfolio', {
      url: '/portfolio/:id', 
      templateUrl: 'app/views/portfolio.html', 
      controller: 'PortfolioController',
      authenticate: true
    })
    .state('privacy',{
      url: '/privacy',
      templateUrl: 'privacy.html',
      authenticate: false
    })
    .state('termsOfService',{
      url: '/tos',
      templateUrl: 'termsOfService.html',
      authenticate: false
    })
    .state('userSupport',{
      url: '/usersupport',
      templateUrl: 'userSupport.html',
      authenticate: false
    })
  $urlRouterProvider.otherwise('/')
})