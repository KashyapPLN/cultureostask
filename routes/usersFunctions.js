import { client } from "../index.js";


export async function createUser(data) {
    return await client.db("cultureos").collection("signupData").insertOne(data);
}


export async function updateUserPassword(_id,data) {
    return await client.db("cultureos").collection("signupData").updateOne({ _id: _id }, { $set: data });
}

export async function getUserByName(userName) {
    return await client.db("cultureos").collection("signupData").findOne({ _id:userName });
}

export async function createUserFiles(userId,pdfBuffer) {
    return await client.db("cultureos").collection("userData").insertOne({userId: userId, pdf: pdfBuffer });
}
export async function getAllFiles(req) {
    return await client.db("cultureos").collection("userData").find(req.query).toArray();
}
export async function getFilesById(userId) {
    return await client.db("cultureos").collection("userData").find({ userId: userId }).toArray();
}

