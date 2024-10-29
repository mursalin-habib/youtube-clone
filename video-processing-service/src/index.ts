import express from "express";
import { isVideoNew, setVideo } from "./firestore";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";


setupDirectories();

//download files from google cloud storage, then process videos locally and then upload to google cloud storage.
const app = express();
app.use(express.json()); //middlewire

app.post("/process-video", async (req, res) =>{
    let data;
    try{
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if(!data.name){
            throw new Error('Invalid message payload received.');
        }
    } catch(error){
        console.error(error);
        return res.status(400).send('Bad Request: Missing filename.');
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];

    if (!isVideoNew(videoId)){
        return res.status(400).send('Bad Request: video already processing or processed.');
    } else {
        await setVideo(videoId, {
            id: videoId,
            uid: videoId.split('-')[0],
            status: 'processing'
        })
    }

    //download raw video from Cloud Storage
    await downloadRawVideo(inputFileName);

    //convert video to 360p
    try{
        await convertVideo(inputFileName, outputFileName);
    } catch(err){
        await Promise.all([ deleteRawVideo(inputFileName),deleteProcessedVideo(outputFileName)]);
       
        console.error(err);
        return res.status(500).send('Internal Server Error: Video processing failed.');
    }

    //upload processed video to Cloud Storage
    await uploadProcessedVideo(outputFileName);

    setVideo(videoId, {
        status: 'processed',
        filename: outputFileName
    });

    await Promise.all([ deleteRawVideo(inputFileName),deleteProcessedVideo(outputFileName)]);


    return res.status(200).send('Processing finished successfully.');

    //get path of the input video file from the request body
    // const inputFilePath = req.body.inputFilePath;
    // const outputFilePath = req.body.outputFilePath;

    // if(!inputFilePath || !outputFilePath){
    //     res.status(400).send("Bad Request: Missing file path."); //400 is client error for giving wrong request 
    // }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/**
 * cloud pub-sub is a message queue
 * propriotory service(not open source). google's message queue
 * reason for using pubsub is to receive notif and send notif to cloud run when file is uploaded to cloud storage bucket
 * can directly push notif to crs via post request. crs wont need to read from bucket to see if new file was uploaded.
 * dont need to do any pulling
 * pubsub has a durability layer. if message cant be sent, retry later.
 * managed service, no need to worry about scaling
 * topic recieves messages. 
 * subscription is a resource created for a topic. can have many subscription for a topic
 * if same message needs to be sent to multiple service like cloudrun, database etc. multiple subscription is used.
 * many subscription for same topic
 * its called fan out?
 * a subscription can only have a single endpoint.
 * will need to create many subscriptions if you have many endpoints
 * 
 */