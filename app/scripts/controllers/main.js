'use strict';

/**
 * @ngdoc function
 * @name flukyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flukyApp
 */
 angular.module('flukyApp')
 .controller('FlukyCtrl', ['$scope', 'FileSaver', 'Blob', 'Upload', function ($scope, FileSaver, Blob, Upload) {

    //$scope.optionsPerQuestion = 5;
    $scope.numQuestions = 10;
    $scope.defaultMark = 0;
    $scope.choicesPerQuestion = 5;

    $scope.questionOptions = [{name: "..."}];
    $scope.questions = null;
    $scope.importModelText = "Import Model Grid";

    $scope.marks = null;
    $scope.numCards = 0;
    $scope.importMarksFileName = null;

  	//Functions ------------------------------------------------------
  	$scope.generateModel = function() {
  		//Create the questions array and populate with default values.
  		//If the array is not null, add or remove rows without clearing it.
  		var q;
  		var i;

  		if (!$scope.questions) {
  			$scope.questions = [];
  			for (i = 1; i <= $scope.numQuestions; ++i) {
  				q = {num: i, 
  					a : $scope.defaultMark, b:$scope.defaultMark, c:$scope.defaultMark, d:$scope.defaultMark, e:$scope.defaultMark,
  					choices : 1 };
  					$scope.questions.push(q);
  				}
  			} else {
  				if ($scope.numQuestions > $scope.questions.length) {
  					for (i = $scope.questions.length + 1; i <= $scope.numQuestions; ++i) {
  						q = {num: i, 
  							a : $scope.defaultMark, b:$scope.defaultMark, c:$scope.defaultMark, d:$scope.defaultMark, e:$scope.defaultMark,
  							choices : 1 };

  							$scope.questions.push(q);
  						}
  					} else if ($scope.numQuestions < $scope.questions.length) {
  						for (i = $scope.questions.length; i > $scope.numQuestions; --i) {
  							$scope.questions.pop();
  						}
  					}

  				}

  			};

  	//Import / Export Model ------------------------------------------------------

  	$scope.exportModel = function() {
  		if (!$scope.questions) {
  			return;
  		}

  		var jsonString = JSON.stringify($scope.questions);

  		var data = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });
  		FileSaver.saveAs(data, 'FlukyModel.json');
  	};

  	$scope.importModel = function(file, errFiles) {
  		if (file) {

  			if (!FileReader) {
  				//hit
  				alert('The File APIs are not fully supported by your browser.');
  				console.error("No FileReader!");
  				return;
  			}

  			$scope.importModelText = "Please wait...";
  			var reader = new FileReader();
  			reader.onloadend = function() {
  				var text = reader.result;
   				var tempQuestions = JSON.parse(text);
   				if (tempQuestions) {
   					$scope.questions = tempQuestions;
   				} else {
   					alert("Something went wrong, please try again.");
   				}
   				$scope.importModelText = "Import Model Grid";
   				$scope.$apply();
			};
  			reader.readAsText(file);
  		}
  	};

  	//Import / Export Mark Data ---------------------------------------------------

  	var _processMarkData = function (rawText) {
  		//process the card raw data
  		//Returns: number of card processed if successful, ortherwise an error message.

  		var lines = rawText.split("\n");
  		var count = 0;
  		var choices = "";
  		var choice = "";
  		var studNum = "";
  		var cpq = $scope.choicesPerQuestion;
  		var q = 0;
  		var c = 0;
  		var tempChoice = new Array(cpq);
  		var tempMark = {};

  		$scope.marks = [];

  		for (var i = 0; i < lines.length; ++i) {
  			if (lines[i].length > 10) { //line must have quite a few characters
  				count++;

  				choices = lines[i].substring(48);
  				studNum = lines[i].substring(40,48);
  				
  				tempMark.studentNumber = studNum;
  				tempMark.rawChoices = choices;
  				tempMark.choices = [];
  				tempMark.marks = []; //this will be populated later

  				for (q = 0; q < choices.length; q += cpq) { //choices might not be divisible by cpq (which is wierd)
  					choice = choices.substring(q, q + cpq);
  					//console.log(choice);
  					//create a boolean array which we can "multiply" with our model later
  					for (c = 0; c < cpq; ++c) {
  						choice[c] === '.' ?	tempChoice[c] = false : tempChoice[c] = true;
  					}
  					tempMark.choices.push(tempChoice);
  				}

  				$scope.marks.push(tempMark);
  			}
  		}

  		return count;
  	};

  	$scope.importMarks = function(file, errFiles) {
  		if (file) {

  			if (!FileReader) {
  				//hit
  				alert('The File APIs are not fully supported by your browser.');
  				console.error("No FileReader!");
  				return;
  			}

  			$scope.importMarksFileName = file.name;
  			var reader = new FileReader();
  			reader.onloadend = function() {
  				var text = reader.result;

  				//analyse text
  				$scope.numCards = _processMarkData(text);

   				//$scope.importMarksFileName = "";
   				//$scope.$apply();
			};
  			reader.readAsText(file);
  		}
  	};

  }]);
