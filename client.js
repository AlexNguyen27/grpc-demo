const PROTO_PATH = __dirname + '/notes.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const notes_proto = grpc.loadPackageDefinition(packageDefinition).notes;

let newNote = {
    title: "New Note",
    content: "New Note content"
}

function main() {
    var client = new notes_proto.NoteService('localhost:50051',
        grpc.credentials.createInsecure());
    client.listNote({}, function (error, notes) {
        if (!error) {
            console.log('successfully fetch List notes')
            console.log(notes)
        } else {
            console.error(error)
        }
    });

    client.insertNote(newNote, (error, note) => {
        if (!error) {
           console.log('New Note created successfully', note)
        } else {
           console.error(error)
        }
    })
}

main();