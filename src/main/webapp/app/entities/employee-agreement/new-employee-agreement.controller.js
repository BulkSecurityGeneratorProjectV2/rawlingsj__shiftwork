var nScope = "";

(function () {
	'use strict';

	angular
	.module('shiftworkApp')
	.controller('NewEmployeeAgreementController', NewEmployeeAgreementController);

	NewEmployeeAgreementController.$inject = ['$scope', '$window', 'WeekendDefinition', 'Contract', 'BooleanContractLine'];

	function NewEmployeeAgreementController($scope, $window, WeekendDefinition, Contract, BooleanContractLine) {
		
		nScope = $scope;
		
		var vm = this;
		
		vm.contractLines = [{
				"value" : "SINGLE_ASSIGNMENT_PER_DAY",
				"name" : "single assignment per day",
				"description" : "An employee can be assigned only one assignment per day"
			}, {
				"value": "TOTAL_ASSIGNMENTS",
				"name" : "total assignments",
				"description" : "No. of total assignments can be assigned to employee"
			}, {
				"value": "CONSECUTIVE_WORKING_DAYS",
				"name" : "consecutive working days",
				"description" : "Consecutive working days"
			}, {
				"value": "CONSECUTIVE_FREE_DAYS",
				"name" : "consecutive free days",
				"description" : "Consecutive free days"
			}, {
				"value": "CONSECUTIVE_WORKING_WEEKENDS",
				"name" : "consecutive working weekends",
				"description" : "Consecutive working weekends"
			}, {
				"value": "TOTAL_WORKING_WEEKENDS_IN_FOUR_WEEKS",
				"name" : "total working weekends in four weeks",
				"description" : "Total working weekends in four weeks"
			}, {
				"value": "COMPLETE_WEEKENDS",
				"name" : "complete weekends",
				"description" : "Each employee with this contract setting needs to work every day in a weekend or not at all."
			}, {
				"value": "IDENTICAL_SHIFT_TYPES_DURING_WEEKEND",
				"name" : "identical shift types during weekend",
				"description" : "Each weekend shift for the same weekend of the same employee must be the same shift type. For example, if an employee is assigned to a morning shift on Saturday, they should expect to also be assigned to a morning shift on Sunday."
			}, {
				"value": "NO_NIGHT_SHIFT_BEFORE_FREE_WEEKEND",
				"name" : "no night shift before free weekend",
				"description" : "No night shift before free weekend"
			}, {
				"value": "ALTERNATIVE_SKILL_CATEGORY",
				"name" : "alternative skill category",
				"description" : "Alternative skill category"
			}
		];
		
		for(var index = 0; index < vm.contractLines.length; index++ ) {
			vm.contractLines[index].weight = 3;
			vm.contractLines[index].value = 3;
			vm.contractLines[index].defaultMaxWeight = 7;
			vm.contractLines[index].defaultMaxValue = 7;
		}
		
		vm.boolContractLines = angular.copy(vm.contractLines);
		vm.minMaxContractLines = angular.copy(vm.contractLines);
		vm.weekenddefinitions = WeekendDefinition.query();
		
		vm.existingContracts = [];     
		Contract.query(function(result) {
			vm.existingContracts = result;
		}); 
		
		console.log("In NewEmployeeAgreementController");

		$scope.finishedWizard = function () {
			
			if(!vm.newEmployeeAgreemment.existingContract) {
				
				console.log("Saving New Contract First");
				
				Contract.save(vm.newEmployeeAgreemment.newContract, function() {
					vm.saveContractLines();
					vm.selectedContract = vm.newEmployeeAgreemment.newContract;
				});
				
			}
			else {
				
				vm.selectedContract = vm.newEmployeeAgreemment.existingContract;
				vm.selectedContract = vm.newEmployeeAgreemment.newContract;
				
			}
			
		};
		
		vm.saveContractLines = function() {
			
			for(var index = 0; index < vm.boolContractLines.length; index++ ) {
				var boolContract = vm.boolContractLines[index];
				if(boolContract.selected == true) {
					var param = {
						type: "boolean",
						contract: vm.selectedContract,
						enabled: boolContract.selected,
						weight: boolContract.weight,
						contractLineType: boolContract.value
					};
					console.log(param);
					BooleanContractLine.save(param);
				}
			}
			
		};
		
		vm.verifyDuplicate = function(code) {
            vm.duplicateMsg = false;
            angular.forEach(vm.existingContracts, function(contract, key){
                if(contract.code === code) {
					vm.duplicateMsg = true;
					return vm.duplicateMsg;
                }
            });
            return vm.duplicateMsg;
        }      
		
		$scope.slider = {
			model : 3,
			max : 7,
			options : {
				floor : 1,
				ceil : 10
			}
		};
		
		$scope.scrollToWizardTop = function() {
			$window.scrollTo(0, angular.element('wizard').offsetTop);   
		};
		
	}

})();