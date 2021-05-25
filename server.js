const PROTO_PATH = __dirname + '/notes.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const uuid = require('uuid')

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

const notes = [
    { id: '1', title: 'Note 1', content: 'Content 1' },
    { id: '2', title: 'Note 2', content: 'Content 2' },
]

function listNote(call, callback) {
    callback(null, { notes: notes })
}

function insertNote(call, callback) {
    let note = { ...call.request };
    note.id = uuid.v4();
    callback(null, note)
}

function main() {
    const server = new grpc.Server();
    server.addService(notes_proto.NoteService.service, { listNote: listNote, insertNote: insertNote })
    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log('Server running at http://127.0.0.1:50051');;
    })
}

main();