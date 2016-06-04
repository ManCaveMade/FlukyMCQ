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
    $scope.markModelSetup = {
      numQuestions: 1,
      defaultMark: 0,
      choicesPerQuestion: 1,
      totalMarks: 0,
      optionsPerQuestion: 5, //A - E
      knowledgeAreas: []
    };
    
    $scope.markModel = null;
    $scope.importModelText = "Import Mark Model File";

    $scope.markData = null;
    $scope.uploading = false;

    $scope.markStats = {
      average: 0, 
      bestMark: 0,
      worstMark: 0,
      numPassed: 0,
      questionAverage: [] //average per question
    };

    /*
      markData = {
        studentNumber, //string
        rawChoices, //raw data string
        choices, //array of choices [1, 0, 0, 0, 0] for example
        marks, //array of choices multiplied by markModel, correspond to markModel
        totalMarks //sum of marks
      }
      */
      $scope.numCards = 0;
      $scope.importMarksFileName = null;

      $scope.selectedStudent = null;

  	//Functions ------------------------------------------------------
  	$scope.generateModel = function() {
  		//Create the questions array and populate with default values.
  		//If the array is not null, add or remove rows without clearing it.
  		var q;
  		var i;

      $scope.$apply;

      if (!$scope.markModel) {
       $scope.markModel = [];

       for (i = 1; i <= $scope.markModelSetup.numQuestions; ++i) {
  				//q = {num: i, 
  				//	a : $scope.markModelSetup.defaultMark, b:$scope.markModelSetup.defaultMark, c:$scope.markModelSetup.defaultMark, d:$scope.markModelSetup.defaultMark, e:$scope.markModelSetup.defaultMark,
  				//	choices : 1 };

          //5 questions are hardcoded for now
          q = {num: i, 
            choiceMarks: [$scope.markModelSetup.defaultMark, $scope.markModelSetup.defaultMark, $scope.markModelSetup.defaultMark, $scope.markModelSetup.defaultMark, $scope.markModelSetup.defaultMark],
            choiceTotal: 0,
            choices: 1,
            knowledgeArea: 0 };

            $scope.markModel.push(q);
          }
        } else {
          if ($scope.markModelSetup.numQuestions > $scope.markModel.length) {
           for (i = $scope.markModel.length + 1; i <= $scope.markModelSetup.numQuestions; ++i) {
            q = {num: i, 
              choiceMarks: [$scope.markModelSetup.defaultMark, $scope.markModelSetup.defaultMark, $scope.markModelSetup.defaultMark, $scope.markModelSetup.defaultMark, $scope.markModelSetup.defaultMark],
              choiceTotal: 0,
              choices: 1,
              knowledgeArea: 0  };

              $scope.markModel.push(q);
            }
          } else if ($scope.markModelSetup.numQuestions < $scope.markModel.length) {
            for (i = $scope.markModel.length; i > $scope.markModelSetup.numQuestions; --i) {
             $scope.markModel.pop();
           }
         }
       }
     };

     $scope.updateKA = function() {
      var num = $scope.markModelSetup.knowledgeAreas.length;
      $scope.markModelSetup.knowledgeAreas = [];
      for (var i = 1; i <= num; ++i) {
        $scope.markModelSetup.knowledgeAreas.push(i);
      }
     };


  	//Import / Export Model ------------------------------------------------------

  	$scope.exportModel = function() {
  		if (!$scope.markModel) {
  			return;
  		}

  		var jsonString = JSON.stringify({"model": $scope.markModel, "totalMarks": $scope.markModelSetup.totalMarks});

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
          $scope.markModel = tempQuestions.model;
          $scope.markModelSetup.totalMarks = tempQuestions.totalMarks;
          $scope.markModelSetup.numQuestions = tempQuestions.model.length;
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

    $scope.getMarkData = function(studentNumber) {
      //there is definately a faster way of doing this but who cares :)
for (var i = 0; i < $scope.markData.length; ++i) {
  if ($scope.markData[i].studentNumber === studentNumber) {
    return $scope.markData[i];
  }
}
};

var _processMarkData = function (rawText) {
  		//process the card raw data and populates $scope.markData
  		//Returns: number of card processed if successful, ortherwise an error message.

      if (!$scope.markModel) {
        return "Mark Model is not setup yet! Cannot continue...";
      }

      var lines = rawText.split("\n");

      var count = 0;
      var choices = "";
      var choice = "";
      var studNum = "";
      var cpq = $scope.markModelSetup.optionsPerQuestion;
      var q = 0;
      var c = 0;

      $scope.markData = [];

      //populate the marks.choices array
      for (var i = 0; i < lines.length; ++i) {
  			if (lines[i].length > 10) { //line must have quite a few characters
  				count++;

  				choices = lines[i].substring(48);
  				studNum = lines[i].substring(40,48);
  				
          var tempMark = {};
          tempMark.studentNumber = studNum;
          tempMark.rawChoices = choices;
          tempMark.choices = [];

          //loop through each question
  				for (q = 0; q < choices.length; q += cpq) { //choices might not be divisible by cpq (which is wierd)
  					choice = choices.substring(q, q + cpq);
  					//console.log(choice);

            //convert the . and X into 0 and 1 respectively for this question
            var tempChoice = new Array(cpq);
            for (c = 0; c < cpq; ++c) {
              if (choice[c] == '.') {
                tempChoice[c] = 0;
              } else {
                tempChoice[c] = 1;
              } 
            }
            tempMark.choices.push(tempChoice);
          }

          $scope.markData.push(tempMark);
        }
      }

      //populate marks.marks with actual numerical values from our model
      //most of this can be done in the previous loop, but it is not easily extendable or readable then

      var averageTotal = 0;
      var bestMark = 0;
      var worstMark = 9999999;
      var numPassed = 0;
      var questionAverage = new Array($scope.markModel.length);

      for (var markIdx = 0; markIdx < $scope.markData.length; ++markIdx) {
        var tempMark = $scope.markData[markIdx]; //convenient reference
        //we should only read the first numQuestions questions
        //TODO: some students are stupid and use 101, 102, etc. maybe look there for marks instead if required?

        tempMark.marks = [];
        tempMark.totalMark = 0;
        tempMark.lenientTotalMark = 0;

        for (var questionIdx = 0; questionIdx < $scope.markModel.length; ++questionIdx) {
          var sum = 0;
          var lsum = 0;
          var totalAnswers = 0;
          var tooManyChoices = false;

          for (var c = 0; c < $scope.markModel[questionIdx].choiceMarks.length; ++c) {
            sum += tempMark.choices[questionIdx][c] * $scope.markModel[questionIdx].choiceMarks[c];

            if (tempMark.choices[questionIdx][c] !== 0) {
              totalAnswers++;
            }
          }

          //dont allow more than the allowed number of choices
          if (totalAnswers > $scope.markModel[questionIdx].choices) {
            sum = 0;
            tooManyChoices = true;
          }

          if (sum >= 0) {
            lsum = sum; 
          }

          tempMark.totalMark += sum;
          tempMark.lenientTotalMark += lsum;
          
          
          //update overall stats
          if (!questionAverage[questionIdx]) {
            questionAverage[questionIdx] = sum;
          } else {
            questionAverage[questionIdx] += sum;
          }
          

          tempMark.marks.push({"q": questionIdx + 1,"mark": sum, "lenientMark": lsum, "choices": tempMark.choices[questionIdx], "excessChoices": tooManyChoices});
        }

        //update stats
        averageTotal += tempMark.totalMark;

        if (tempMark.totalMark >= ($scope.markModelSetup.totalMarks / 2)) {
          numPassed++;
        }

        if (tempMark.totalMark > bestMark) {
          bestMark = tempMark.totalMark;
        } else if (tempMark.totalMark < worstMark) {
          worstMark = tempMark.totalMark;
        }

      }

      averageTotal = averageTotal / count;

      $scope.markStats = {
        "average": averageTotal, 
        "bestMark": bestMark,
        "worstMark": worstMark,
        "numPassed": numPassed,
        "questionAverage": [],
        "histo": {
          data: {
            series: [],
            data: []
          },
          config: {
            title: '',
            tooltips: true,
            labels: false,
            mouseover: function() {},
            mouseout: function() {},
            click: function() {},
            legend: {
              display: false,
              //could be 'left, right'
              position: 'right'
            }
          }
        }
      };

      for (var i = 0; i < questionAverage.length; ++i) {
        questionAverage[i] = questionAverage[i] / count;
        $scope.markStats.questionAverage[i] = {"q": i + 1, "ave": questionAverage[i], "max": $scope.markModel[i].choiceTotal};
      }

      var ttot = 0;
      //populate the histogram
      for (i = 0; i <= 100; i+=5) {
        ttot = 0;
        //inefficient, but loop through all the totals and if its between i and i+5 then increment
        for (var markIdx = 0; markIdx < $scope.markData.length; ++markIdx) {
          var tempMark = ($scope.markData[markIdx].totalMark / $scope.markModelSetup.totalMarks) * 100;
          if ((tempMark >= i) && (tempMark < (i+5))) {
            ttot++;
          }
        }
        $scope.markStats.histo.data.data.push({x: i, y: [ttot], tooltip: "Between " + i + " and " + (i+5) + "%: " + ttot});
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

        $scope.uploading = true;
        $scope.importMarksFileName = file.name;
        var reader = new FileReader();
        reader.onloadend = function() {
          var text = reader.result;

  				//analyse text
  				$scope.numCards = _processMarkData(text);

          $scope.uploading = false;
          $scope.$apply();
        };
        reader.readAsText(file);
      }
    };

    $scope.downloadMarksJSON = function() {
      if (!$scope.markData) {
        return;
      }

      var jsonString = JSON.stringify($scope.markData);

      var data = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(data, 'FlukyMarks-' + $scope.importMarksFileName + '.json');
    };

    $scope.downloadMarksCSV = function() {
      if (!$scope.markData) {
        return;
      }

      var csvString = '';
      var tempLine = '';
      //build a csv file with the following format:
      //StudNum, TotalMark, ExcessChoices, Q1Mark, Q2Mark, ..., QnMark
      csvString = 'StudentNumber,TotalMark,LenientTotalMark,ExcessChoices';
      for (var i = 1; i <= $scope.markModel.length; ++i) {
        csvString += ',Q' + i;
      }
      csvString += '\n';

      for (var markIdx = 0; markIdx < $scope.markData.length; ++markIdx) {
        var tempMark = $scope.markData[markIdx]; //convenient reference
        var excess = 0;

        var csvLine = '';

        for (var questionIdx = 0; questionIdx < $scope.markModel.length; ++questionIdx) {
          csvLine += ',' + tempMark.marks[questionIdx].mark;
          if (tempMark.marks[questionIdx].excessChoices) {
            excess++;
          }
        }

        //Prepend the totals, etc.
        csvLine = tempMark.studentNumber + ',' + tempMark.totalMark + ',' + tempMark.lenientTotalMark + ',' + excess + csvLine + '\n';
        
        csvString += csvLine;
      }

      var data = new Blob([csvString], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(data, 'FlukyMarks-' + $scope.importMarksFileName + '.csv');
    };


    $scope.generateModel();

  }]);
