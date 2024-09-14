export const getStudentData = async(student, tokenData, authType) => {
    let studentObj = {
        _id: student._id,
        username: student.username,
        password: student.password,
        name: student.name,
        phone: student.phone,
        exam: student.exam,
        department: student.department,
        resetPasswordCode: student.resetPasswordCode,
        accessToken: tokenData,
        auth: authType
    }
    return studentObj
}