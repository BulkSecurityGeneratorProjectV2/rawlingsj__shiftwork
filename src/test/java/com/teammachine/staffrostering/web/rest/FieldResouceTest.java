package com.teammachine.staffrostering.web.rest;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import com.teammachine.staffrostering.ShiftworkApp;
import com.teammachine.staffrostering.domain.Employee;
import com.teammachine.staffrostering.domain.filters.EmployeeFilter;
import com.teammachine.staffrostering.repository.EmployeeRepository;
import com.teammachine.staffrostering.service.EmployeeService;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = ShiftworkApp.class)
@WebAppConfiguration
@IntegrationTest
public class FieldResouceTest {

	private static final String DEFAULT_CODE = "AAAAA";

	private static final Boolean DEFAULT_IS_SICK = false;
	private static final String DEFAULT_NAME = "ShiftWorkers";

	@Inject
	private EmployeeRepository employeeRepository;

	@Inject
	private MappingJackson2HttpMessageConverter jacksonMessageConverter;

	@Inject
	private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

	@Inject
	private EmployeeService employeeService;

	private MockMvc restEmployeeMockMvc;

	private Employee employee;

	private EmployeeFilter employeeFilter;

	@PostConstruct
	public void setup() {
		MockitoAnnotations.initMocks(this);
		FieldResource fieldResource = new FieldResource();
		ReflectionTestUtils.setField(fieldResource, "employeeService", employeeService);
		this.restEmployeeMockMvc = MockMvcBuilders.standaloneSetup(fieldResource)
				.setCustomArgumentResolvers(pageableArgumentResolver).setMessageConverters(jacksonMessageConverter)
				.build();
	}

	@Before
	public void initTest() {

		employeeFilter = new EmployeeFilter();
		employeeFilter.setCode(DEFAULT_CODE);
		employeeFilter.setName(DEFAULT_NAME);

		employee = new Employee();
		employee.setCode(DEFAULT_CODE);
		employee.setIsSick(DEFAULT_IS_SICK);
		employee.setName(DEFAULT_NAME);
	}

	@Test
	@Transactional
	public void filterEmployeeByNameOrCode() throws Exception {
		// Initialize the database
		employeeRepository.saveAndFlush(employee);

		// Get all the employees
		restEmployeeMockMvc.perform(get("/api/employees/filter?like=shift")).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
				.andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
	}

	@Test
	@Transactional
	public void findEmpByNameOrCodeNoContent() throws Exception {
		// Initialize the database
		employeeRepository.saveAndFlush(employee);

		// Get all the employees
		restEmployeeMockMvc.perform(get("/api/employees/filter?like=test")).andExpect(status().isNoContent());
	}

}
