class Report{
    constructor( 
        coursesCache, 
        studentsCache, 
        testsCache, 
        marksCache
    ){
        this.coursesCache = coursesCache;
        this.studentsCache = studentsCache;
        this.testsCache = testsCache;
        this.marksCache = marksCache;
    }
    generate(){
        const reportData = {students: [] };

        for (const id in this.studentsCache){
            let newStudent = this.generateStudent(id)
            if (newStudent) reportData.students.push(newStudent);
        }
    
        return reportData;
    }

    generateStudent( id ){

        const studentData = this.studentsCache[id];
        let totalAvg = 0;
    
        let newStudent = {
            id: parseInt(id),
            name: studentData.name,
            totalAverage: 9999,
            courses: this.generateClass(id)
        }
    
        //Ignore students that have no grades
        if (!newStudent.courses) return;
    
        for (let i = 0; i < newStudent.courses.length; i++){
            totalAvg += newStudent.courses[i].courseAverage;   
        }
    
        totalAvg = Math.floor( (totalAvg * 100) / newStudent.courses.length) / 100;
         
        newStudent.totalAverage = totalAvg;
        
        return newStudent;
    }

    generateClass(studentId){

        //Creates a whole course
        let answer = [];
        let tempGradesCache = this.generateWeightedGrades(studentId);
    
        for( const classId in tempGradesCache){
            let data = {
                "id": parseInt(classId),
                "name": this.coursesCache[classId].name,
                "teacher": this.coursesCache[classId].teacher,
                "courseAverage": tempGradesCache[classId]/100
            }
    
            answer.push(data);
        }
    
        return answer;
    }

    generateWeightedGrades( studentId ){

        //Creates weighted scores
        //If the weight is >100 then return error
        let tempGradesCache = {};
    
        let studentMarks = this.marksCache[studentId];
    
        if (!studentMarks) return;
    
        for (let i = 0; i < studentMarks.length; i++){
            
            let testIdToFind = studentMarks[i].testId;
            let test = this.testsCache[testIdToFind];
            let grade = test.weight * studentMarks[i].mark;
            
            if (!tempGradesCache[test.course_id]) {
                tempGradesCache[test.course_id] = grade
            } else tempGradesCache[test.course_id] += grade   
        }
    
        return tempGradesCache;
    
    }

}//end


// function generateStudentReport(
//     coursesCache, 
//     studentsCache, 
//     testsCache, 
//     marksCache
// ){

//     const reportData = {students: [] };

//     for (const id in studentsCache){
//         let newStudent = generateStudent(id)
//         if (newStudent) reportData.students.push(newStudent);
//     }
    
//     return reportData;
// }

// function generateStudent( id ){

//     const studentData = studentsCache[id];
//     let totalAvg = 0;

//     let newStudent = {
//         id: parseInt(id),
//         name: studentData.name,
//         totalAverage: 9999,
//         courses: generateClass(id)
//     }

//     //Ignore students that have no grades
//     if (!newStudent.courses) return;

//     for (let i = 0; i < newStudent.courses.length; i++){
//         totalAvg += newStudent.courses[i].courseAverage;   
//     }

//     totalAvg = Math.floor( (totalAvg * 100) / newStudent.courses.length) / 100;
     
//     newStudent.totalAverage = totalAvg;
    
//     return newStudent;
// }


// function generateClass(studentId){
//     //Creates a whole course

//     let answer = [];
//     let gradesCache = generateWeightedGrades(studentId);

//     for( const classId in gradesCache){
//         let data = {
//             "id": parseInt(classId),
//             "name": coursesCache[classId].name,
//             "teacher": coursesCache[classId].teacher,
//             "courseAverage": gradesCache[classId]/100
//         }

//         answer.push(data);
//     }

//     return answer;
// }


//returns course: combined weighted scores
//function getStudentCourseAverage( studentId ){
// function generateWeightedGrades( studentId ){

//     //Creates weighted scores
//     //If the weight is >100 then return error
//     let gradesCache = {};

//     let studentMarks = marksCache[studentId];

//     if (!studentMarks) return;

//     for (let i = 0; i < studentMarks.length; i++){
        
//         let testIdToFind = studentMarks[i].testId;
//         let test = testsCache[testIdToFind];
//         let grade = test.weight * studentMarks[i].mark;
        
//         if (!gradesCache[test.course_id]) {
//             gradesCache[test.course_id] = grade
//         } else gradesCache[test.course_id] += grade   
//     }

//     return gradesCache;

// }


module.exports = Report;