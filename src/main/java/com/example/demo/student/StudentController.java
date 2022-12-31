package com.example.demo.student;

import java.util.Arrays;
import java.util.List;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(path="api/v1/students")
@AllArgsConstructor
public class StudentController {

	private final StudentService studentService;
	@GetMapping
	public List<Student> getAllstudents() {


		/*
	 List<Student> students = Arrays.<Student>asList(
			 new Student(1L,
					 "Jamila",
					 "jamila@amigoscod.com",
					 Gender.FEMALE),

		new Student(2L,
				"Alex",
				"alex@amigoscod.com",
				Gender.MALE)

	 );

	 return students;
	 */

		return studentService.getAllStudents();
		
	}

	@PostMapping
	public void addStudent(@Valid @RequestBody Student student) {
        studentService.addStudent(student);
	}

	@DeleteMapping(path = "{studentId}")
	public void deleteStudent(@PathVariable ("studentId") Long studentId) {
		studentService.deleteStudent(studentId);
	}
}
