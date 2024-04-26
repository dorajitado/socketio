import http from 'http';
import express from 'express';
import SocketIo, { Socket } from  'socket.io';

// Express 애플리케이션을 생성합니다.
const app = express();

// Express 애플리케이션의 뷰 엔진을 설정합니다. 여기서는 Pug를 사용합니다.
app.set("view engine", "pug");

// Pug 템플릿 파일이 위치한 디렉토리 경로를 설정합니다.
app.set("views", __dirname + "/views");

// 정적 파일들을 제공하기 위해 Express에게 정적 파일 미들웨어를 사용하도록 지시합니다.
app.use("/public", express.static(__dirname + "/public"));

// 루트 경로에 접속할 때 "home" 템플릿을 렌더링하는 라우트를 설정합니다.
app.get("/", (_, res) => res.render("home"));

// 모든 경로에 대해서 루트 경로로 리디렉션하는 라우트를 설정합니다.
app.get("/*", (_, res) => res.redirect("/"));

const server = http.createServer(app);
const io = SocketIo(server);

const sockets = [];

io.on('connection', (socket)=>{
    socket.on("room", (roomname, done)=>{
        socket.join(roomname);
        done();
        socket.to(roomname).emit("welcome");
    });
    socket.on("disconnecting", ()=>{
        console.log("Disconnection")
        socket.rooms.forEach(room => socket.to(room).emit("bye"));            
    });
    socket.on("message", (msg, room, fn)=>{
        socket.to(room).emit("message", msg);
        fn();
    })
})


const handleListen = () => console.log(`Listening on http://localhost:3000`);
server.listen(3000, handleListen);
