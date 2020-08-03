const Report = require('../scripts/Report');
const dataService = require('../scripts/dataService');

let testReport; 

beforeEach( async () => {
  
    let filePaths = [
        "data/courses.csv",
        "data/students.csv", 
        "data/tests.csv", 
        "data/marks.csv",
        'output.json'
    ]

    let [coursesCache, studentsCache, testsCache, marksCache] = await dataService.createAppCache( filePaths )
    
    testReport = new Report( coursesCache, studentsCache, testsCache, marksCache );

});

xdescribe("Generate", () => {
    test("Returns all weighted courses for student", () => {});
    test("Ignores students with no marks", () => {});
});

describe("Generate Student", () => {
    test("", () => {});
})

xdescribe("Generate Class", () => {
    test("", () => {});
    test("", () => {});
})

describe("Generate Weighted Grades", () => {
    // test("Should return an error if weight > 100", () => {

    //     testReport.testsCache["1"].weight = 40;

    //     let testData = testReport.generateWeightedGrades("1");
    //     // console.log(testData)
    // });
})

describe("Validate Class Weight", () => {

    test('Should return true if valid weights', () => {

    });

    test('Should return an error if weight > 100', () => {
        testReport.testsCache["1"].weight = 40;

        try{
            testReport.validateClassWeight();
        }catch(err){
            expect(err).toBe("Invalid Weight Detected");
        }
        
        
    });
})
