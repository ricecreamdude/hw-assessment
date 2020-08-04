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

    let [coursesCache, studentsCache, testsCache, marksCache] = await dataService.createAppCache( filePaths );
    
    testReport = new Report( coursesCache, studentsCache, testsCache, marksCache );
});

describe("Generate", () => {
    test("Should have the correct data structure / types", () => {
        let testVal = testReport.generate().students;
        expect(testVal.length).toBeDefined();
    });

});

describe("Generate Student", () => {
    test("should have the correct data structure / types", () => {
        let testVal = testReport.generateStudent("1");

        expect(typeof testVal).toBe("object");
        expect(typeof testVal.name).toBe("string");
        expect(typeof testVal.id).toBe("number");
        expect(typeof testVal.totalAverage).toBe("number");
        expect(testVal.courses.length).toBeDefined();
    });

    test("should return empty for non existing student", () => {
        let testVal = testReport.generateStudent("bad");
        expect(testVal).toEqual(undefined);
    });
})

describe("Generate Class", () => {
    test("should have valid data structure/types", () => {
        let testVal = testReport.generateClass("1")[0];

        expect(typeof testVal.id).toEqual("number");
        expect(testVal.id).toBeDefined();
        expect(testVal.name).toBeDefined();
        expect(testVal.teacher).toBeDefined();
        expect(testVal.courseAverage).toBeDefined();

    });
    test("should return empty array for no class data", () => {
        let testVal = testReport.generateClass("bad");

        expect(testVal).toEqual([]);
    });
})

describe("Generate Weighted Grades", () => {

    test('should return an object', () => {
        let testVal = testReport.generateWeightedGrades("1");
        expect(typeof testVal).toBe("object")
    });

    test('should contain numbers', () => {

        let testVal = testReport.generateWeightedGrades("1");
        expect( typeof testVal["1"] ).toBe("number");
    })

    test('should equal provided test values', ()=>{
        let testVal = testReport.generateWeightedGrades("1");
        expect( testVal["1"] ).toBe(9010);
        expect( testVal["2"] ).toBe(5180);
        expect( testVal["3"] ).toBe(7420);
    })

    test('should return undefined if no marks found', () =>{
        let testVal = testReport.generateWeightedGrades("bad");
        expect(testVal).toBe(undefined);
    })


})

describe("Validate Class Weight", () => {

    test('Should return true if class weights add to up 100', () => {
        expect( testReport.validateClassWeight() ).toBe(true);
    });

    test('Should return an error if weight !== 100', () => {
        testReport.testsCache["1"].weight = 40;

        try{
            testReport.validateClassWeight();
        }catch(err){
            expect(err).toBe("Invalid Weight Detected");
        }
        
        
    });
})
