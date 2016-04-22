(function() {
    'use strict';

    angular
        .module('shiftworkApp')
        .controller('EmployeeDayOnRequestDialogController', EmployeeDayOnRequestDialogController);

    EmployeeDayOnRequestDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'entity', 'EmployeeDayOnRequest', 'ShiftDate', 'Employee'];

    function EmployeeDayOnRequestDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, entity, EmployeeDayOnRequest, ShiftDate, Employee) {
        var vm = this;
        vm.employeeDayOnRequest = entity;
        vm.shiftdates = ShiftDate.query({filter: 'employeedayonrequest-is-null'});
        $q.all([vm.employeeDayOnRequest.$promise, vm.shiftdates.$promise]).then(function() {
            if (!vm.employeeDayOnRequest.shiftDate || !vm.employeeDayOnRequest.shiftDate.id) {
                return $q.reject();
            }
            return ShiftDate.get({id : vm.employeeDayOnRequest.shiftDate.id}).$promise;
        }).then(function(shiftDate) {
            vm.shiftdates.push(shiftDate);
        });
        vm.employees = Employee.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        var onSaveSuccess = function (result) {
            $scope.$emit('shiftworkApp:employeeDayOnRequestUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.employeeDayOnRequest.id !== null) {
                EmployeeDayOnRequest.update(vm.employeeDayOnRequest, onSaveSuccess, onSaveError);
            } else {
                EmployeeDayOnRequest.save(vm.employeeDayOnRequest, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
