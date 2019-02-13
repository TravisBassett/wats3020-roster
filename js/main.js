/* JS for WATS 3020 Roster Project */

// This Creates a base class called `Person` that takes the parameters `name`
// and `email` and makes those available as attributes. The username is assigned
// the corret value by splitting the email value at the @ sign, and taking the 
// first part of the array split by that funtion.

class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.username = email.split('@')[0];
    }
}

// Class Student extends the Person class by adding a property called this.attendance.
// Student contains a Student specific method called calculate attendance. This works
// by checking the length of the attendance array. If it is less than 0 a value of 0% 
// is returned. If it is more than 0 it loops through the attendance records stored in
// this.attendance array and creates a percentage value indicating how many attendance
// records are positive.

class Student extends Person {
    constructor(name, email) {
        super(name, email);
        this.attendance = [];
    }
    calculateAttendance() {
        if (this.attendance.length > 0) {
            let counter = 0;
            for (let mark of this.attendance) {
                counter += mark;
            }
            let attendancePercentage = (counter / this.attendance.length) * 100;
            return `${attendancePercentage.toFixed(2)}%`;
        } else {
            return '0%'
        }
    }
}

// Class teacher extends the Person class, simply to include an honorific.

class Teacher extends Person {
    constructor(name, email, honorific) {
        super(name, email);
        this.honorific = honorific;
    }
}

// Class course stores information about the course attendance is being 
// recorded for.
class Course {
    constructor(courseCode, courseTitle, courseDescription) {
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }

    // The addStudent method asks for name and email of students enrolled in
    // the course. It then pushes a new Student object onto the Students array, 
    // and updates the view/roster.

    addStudent() {
        let name = prompt("Enter student full name:", "Howard Perot");
        let email = prompt("Enter student email:", "howard@seattlu.edu");
        let newStudent = new Student(name, email);
        this.students.push(newStudent);
        updateRoster(this);
    }

    // The setTeacher method prompts the user for teacher name, email and honorific.
    // If then creates a new value for the teacher class using this informatio, and 
    // updates the view/roster

    setTeacher() {
        let name = prompt("Enter full teacher name:", "Tyler Brooks");
        let email = prompt("Enter teacher email", "tbrooks@seattleu.edu");
        let honorific = prompt("Enter honorific:", "Prof");
        this.teacher = new Teacher(name, email, honorific);
        updateRoster(this);
    }

    // The markAttendance method pushes either a 1 for present or 0 for absent 
    // to the attendance array for that student. It inclues a default value of 
    // present. After the operation is updates the view/roster.

    markAttendance(username, status = "present") {
        let foundStudent = this.findStudent(username);
        if (status === "present") {
            foundStudent.attendance.push(1);
        } else {
            foundStudent.attendance.push(0);
        }
        updateRoster(this);
    }

    // findStudent takes in a username and looks
    // for that username on student objects contained in the `this.students`
    // Array.
    findStudent(username) {
        let foundStudent = this.students.find(function (student, index) {
            return student.username == username;
        });
        return foundStudent;
    }
}

// The following code prompts the user for values for course code,
// course title, and course description. It then assings these vlues into
// the myCourse object.

let courseCode = prompt("Enter the course code: ", "WATS 3020");

let courseTitle = prompt("Enter the course title: ", "Intro to JavasScript");

let courseDescription = prompt("Enter the course description: ", "Learning JS");

let myCourse = new Course(courseCode, courseTitle, courseDescription);


///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher) {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function (e) {
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})

// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function (e) {
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course) {
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher) {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students) {
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);

        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-username', student.username);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-username', student.username);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
}

function setupAttendanceButtons() {
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons) {
        button.addEventListener('click', function (e) {
            console.log(`Marking ${e.target.dataset.username} present.`);
            myCourse.markAttendance(e.target.dataset.username);
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons) {
        button.addEventListener('click', function (e) {
            console.log(`Marking ${e.target.dataset.username} absent.`);
            myCourse.markAttendance(e.target.dataset.username, 'absent');
            updateRoster(myCourse);
        });
    }
}