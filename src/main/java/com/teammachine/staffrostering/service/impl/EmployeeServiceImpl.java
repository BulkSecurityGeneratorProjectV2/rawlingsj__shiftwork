package com.teammachine.staffrostering.service.impl;

import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teammachine.staffrostering.config.DBQueries;
import com.teammachine.staffrostering.domain.Employee;
import com.teammachine.staffrostering.domain.filters.specs.EmployeeSpecs;
import com.teammachine.staffrostering.repository.EmployeeRepository;
import com.teammachine.staffrostering.service.EmployeeService;

/**
 * Service Implementation for managing Employee.
 */
@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

	private final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	@PersistenceContext
	private EntityManager entityManager;

	@Inject
	private EmployeeRepository employeeRepository;

	/**
	 * Save a employee.
	 * 
	 * @param employee
	 *            the entity to save
	 * @return the persisted entity
	 */
	public Employee save(Employee employee) {
		log.debug("Request to save Employee : {}", employee);
		Employee result = employeeRepository.save(employee);
		return result;
	}

	/**
	 * Get all the employees.
	 * 
	 * @return the list of entities
	 */
	@Transactional(readOnly = true)
	public List<Employee> findAll() {
		log.debug("Request to get all Employees");
		List<Employee> result = employeeRepository.findAll();
		return result;
	}

	/**
	 * Get one employee by id.
	 *
	 * @param id
	 *            the id of the entity
	 * @return the entity
	 */
	@Transactional(readOnly = true)
	public Employee findOne(Long id) {
		log.debug("Request to get Employee : {}", id);
		Employee employee = employeeRepository.findOne(id);
		return employee;
	}

	/**
	 * Delete the employee by id.
	 * 
	 * @param id
	 *            the id of the entity
	 */
	public void delete(Long id) {
		log.debug("Request to delete Employee : {}", id);
		employeeRepository.delete(id);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Employee> filterEmployee(Employee employee) {

		log.debug("Request to filter employees with values: {}", employee);
		TypedQuery<Employee> empQueryFilter = entityManager.createQuery(DBQueries.EMPLOYEE_FILTER_QUERY,
				Employee.class);

		empQueryFilter.setParameter("name", employee.getName());
		empQueryFilter.setParameter("code", employee.getCode());
		return empQueryFilter.getResultList();
	}

	
	public List<Employee> findByCodeOrName(String like) {
		log.debug("Request to filter employees with value: {}", like);
		Specification<Employee> findBySearchItem = EmployeeSpecs.findByNameOrCode(like);
		return employeeRepository.findAll(findBySearchItem);
	}

}
