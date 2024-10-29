import { Storage } from "@google-cloud/storage";
import fs from "fs"; 
import Ffmpeg from "fluent-ffmpeg";  //this is a wrapper around ffmpeg cli tool. 


// 1. GCS file interaction
// 2. Local file interaction

const storage = new Storage(); //instance of cloud storage declared.

const rawVideoBucketName = "raw-vid-170924"; //upload yt videos to this bucket
const processedVideoBucketName = "processed-vid-170924"; //after processing is done, processed version will be uploaded here


const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";


export function setupDirectories(){
    //create local directoriies for raw and processed videos.
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);

}

/**
 * @pram rawVideoName - the name of the file to convert from {@link localRawVideoPath}.
 * @pram processedVideoName - the name of the file to convert to {@link localProcessedVideoPath}.
 * @return a promise that resolves when the video has been converted.
 * 
 */

export function convertVideo(rawVideoName: string, processedVideoName: string){
    //converting the video
    return new Promise <void>((resolve, reject)=>{
        Ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("-vf", "scale=-1:360")
        .on("end", () =>{
            console.log('Processing finished successfully.');
            //res.status(200).send("Processing finished successfully.")
            resolve();
        })
        .on("error", (err) =>{
            console.log(`An error occured: ${err.message}`);
            //res.status(500).send(`Internal Server Error: ${err.message}`); //500 is server error. common error running out of memory
            reject(err);
            
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
    
}

/**
 * @param fileName -the name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @return a promise that resolves when file has been downloaded.
 * await has to be used in async fucntion. async function has to return a promise.
 */

export async function downloadRawVideo(fileName:string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({destination : `${localRawVideoPath}/${fileName}`});
    console.log(
        `gs//${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`

    )
}

/**
 * @param fileName - the name of the file to upload from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @return a promise that has been resolved when upload completed.
 */

export async function uploadProcessedVideo(fileName:string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, 
        {destination: fileName});

    console.log(
        `${localProcessedVideoPath}/${fileName} uploaded to gs//${processedVideoBucketName}/${fileName}.`
    );
    await bucket.file(fileName).makePublic();
}

/**
 * @param filePath given the file path of the file that needs to be deleted
 * @return a promise that resolves when the file has been deleted.
 */

function deleteFile(filePath:string):Promise<void>{
    return new Promise((resolve,rejects)=>{
        if(fs.existsSync(filePath)){
            fs.unlink(filePath, (err)=>{ //unlink() function marks the file as deleted without updating the diskspace.
                if(err){
                    console.log(`failed to delete the file at ${filePath
                    }`, err);
                    rejects(err);
                } else{
                    console.log(`file deleted at ${filePath}`);
                    resolve();
                }
            })
        } else{
            console.log(`File not found at ${filePath}, can't delete`);
        }
    });
}

export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
  }

export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param {string} dirPath Given directory path
 * check the directory exist
 */

function ensureDirectoryExistence(dirPath:string){
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true} );
        console.log(`Directory created at ${dirPath}`);
    }
}

/**
 * store data in a file system or cloud storage solution, not in a database.
 * bucket is like a folder in an object store. 
 */