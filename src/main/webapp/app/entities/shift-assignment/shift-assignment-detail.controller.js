(function() {
    'use strict';

    angular
        .module('shiftworkApp')
        .controller('ShiftAssignmentDetailController', ShiftAssignmentDetailController);

    ShiftAssignmentDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'ShiftAssignment', 'Shift', 'Employee', 'Task'];

    function ShiftAssignmentDetailController($scope, $rootScope, $stateParams, entity, ShiftAssignment, Shift, Employee, Task) {
        var vm = this;
        vm.shiftAssignment = entity;
        
        var unsubscribe = $rootScope.$on('shiftworkApp:shiftAssignmentUpdate', function(event, result) {
            vm.shiftAssignment = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
