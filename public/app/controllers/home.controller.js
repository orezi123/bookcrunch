"use strict";
angular.module("defaultApp")
  .controller("homeCtrl", ["$scope", "$state", "$rootScope", "$mdToast", "$stateParams", "UserService", "BookService", "$location", function($scope, $state, $rootScope, $mdToast, $stateParams, UserService, BookService, $location) {
    $scope.loadSlideshow = function() {
      $("#slides").slidesjs({
        width: 1024,
        height: 250,
        play: {
          active: false,
          effect: "slide",
          interval: 3000,
          auto: true,
          swap: true,
          pauseOnHover: true,
          restartDelay: 2500
        },
        pagination: {
          active: false,
          effect: "slide"
        },
        navigation: {
          active: false,
          effect: "slide"
        }
      });
    }
    $scope.loginUser = function(userData) {
      UserService.login(userData).then(function(res) {
        $scope.progressLoad = true;
        $scope.isLoggedIn = false;
        if (res.data.message === "Authentication failed. User not found.") {
          $mdToast.show(
            $mdToast.simple()
            .content("Username or password mismatch")
            .hideDelay(3000)
          );
          $scope.progressLoad = false;
          $scope.isLoggedIn = false;
        } else if (res.data.message === "Authentication failed.") {
          $mdToast.show(
            $mdToast.simple()
            .content("Username or password mismatch")
            .hideDelay(3000)
          );
          $scope.progressLoad = false;
          $scope.isLoggedIn = false;
        } else {
          //set token in localstorage
          localStorage.setItem("userToken", res.data.token);
          if (localStorage.getItem("userToken")) {
            $scope.userDetails = userData;
            $scope.response = res;
            $scope.progressLoad = false;
            $scope.isLoggedIn = true;
            $scope.userInformation = res.data.user;
            $location.url("/nav/home");
            window.location.reload()
          }
        }
      });
    };

    //create a new user
    $scope.signUp = function(newUser) {
      $scope.progressLoad = true;
      $scope.isNewUser = false;
      UserService.createUser(newUser).then(function(res) {
        if (res.data.message === "user email taken") {
          $mdToast.show(
            $mdToast.simple()
            .content("Email already exists")
            .hideDelay(3000)
          );
        } else if (res.data.message === "Check parameters!") {
          $mdToast.show(
            $mdToast.simple()
            .content("Check for errors")
            .hideDelay(3000)
          );
        } else {
          $scope.userDetails = res;
          $scope.progressLoad = false;
          $scope.isNewUser = true;
          $location.url("/nav/home");
        }
      });
    };

    $scope.getAllBooks = function() {
      BookService.getAllBooks().then(function(res) {
        $scope.books = res.data;
        console.log("books", res.data);
      });
    };

    $scope.logout = function() {
      $scope.isLoggedIn = true;
      localStorage.removeItem("userToken");
      if (localStorage.getItem("userToken")) {
        $scope.isLoggedIn = true;
      } else {
        $scope.isLoggedIn = false;
        window.location.reload().then(function() {
          $mdToast.show(
            $mdToast.simple()
            .content("You've been logged out!")
            .hideDelay(3000)
          );
        });
      }
    };

    $rootScope.signupCheck = function() {
      if (localStorage.getItem('userToken')) {
        UserService.decodeUser();
        $rootScope.signedIn = true;
      }
      $rootScope.signedIn = false;
    };
  }]);
