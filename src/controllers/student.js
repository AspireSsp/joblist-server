const { Student, User } = require("../models/user");
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

exports.studentSignUp = async(req, res)=>{
    const { name, email, password, mobile } = req.body;
  if (!name || !email || !password || !mobile) {
    return res.status(422).json({ Error: "Plz fill all the field properly.." });
  }
  try {
    console.log("sanjany--->1")
    const StudentExist = await Student.findOne({ email: email });
    console.log("sanjany--->2")
    if (StudentExist) {
        return res.status(422).json({ Error: "Student exist" });
    }
    console.log("sanjany--->3", req.body)
    const student = new Student(req.body);
    const newStudent = await student.save();
    const token = await newStudent.generateAuthToken();
    console.log(token);
    res.status(200).json({ success: true, Student : newStudent, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.studentSignIn = async(req, res)=>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ error: "fill proper details" });
        }
        const student = await Student.findOne({ email }).select("+password");
        if (student) {
          const isMatch = await bcrypt.compare(password, student.password);
    
          const token = await student.generateAuthToken();
    
          if (!isMatch) {
            console.log("password not match");
            res.status(400).json({ error: "invailid login details" });
          } else {
            console.log("user is logged in");
            res.status(200).json({ message: "login sucessfull", user : student, token });
          }
        } else {
          res.status(400).json({ error: "Student error" });
        }
    } catch (error) {
      res.status(404).json({message: error.message});
    }
}


exports.getAllStudents = async (req, res)=>{
  try {
    const student = await Student.find({status: true});
    res.status(200).json(student);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}

exports.getStudentById = async (req, res)=>{
  try {
    const student = await Student.findById(req.params.id);
    if(student ){
      res.status(200).json(student);
    }else{
      res.status(404).json({success : false, message : "Student not found"})
    }
  } catch (error) {
    res.status(404).json({message: error.message});
  }
  

}

exports.deleteStudentById = async (req, res)=>{
  try {
    const id = req.params.id;
    const student = await Student.findByIdAndUpdate(id, {status : false} );
    console.log(student);
    res.status(200).json({ success: true, message : "student deleted successfully"});
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}


exports.updateStudentbyId = async (req, res)=>{
    try {
        const id = req.params.id;
        console.log(id);
        const body = req.body;
        const newStudent = await Student.findByIdAndUpdate(id, body);
        console.log(newStudent);
        if(newStudent){
            res.status(200).json({sucess : true, messsage : "student updated successfully...!"});
        }else{
            res.status(200).json({sucess : false, messsage : "some error occured while updating student"});
        }
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

exports.getStudentPreferenceById = async (req, res)=>{
    try {
        const id = req.params.id;
        const myPref = await Student.findById(id);
        console.log(myPref);
        if(myPref){
            res.status(200).json({sucess : true, preferences : myPref.preferences, workMode : myPref.workMode});
        }else{
            res.status(200).json({sucess : false, messsage : "some error occured.."});
        }
    } catch (error) {
        res.status(404).json({message: error.message});
    }

}