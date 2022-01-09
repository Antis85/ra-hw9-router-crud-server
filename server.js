const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors({
    origin: 'https://antis85.github.io',
}));
app.use(koaBody({json: true}));

const avatar = `https://i.pravatar.cc/300?img=0`;
const name = 'Имя Фамилия';
let nextId = 1;
let posts = [
    {
        id: nextId++,
        content: 'Hello, world!!!',
        created: Date.now(),
        avatar,
        name,
    },
];

const router = new Router();

router.get('/posts', async (ctx, next) => {
    return new Promise(resolve => {
        setTimeout(() => {
            ctx.response.body = posts;                                                                                                                                                                                                                                                    
            resolve();
        }, 1000);
    });
});

router.post('/posts', async(ctx, next) => {
    const {id, content} = ctx.request.body;
    if (Number(id) !== 0) {
        posts = posts.map(o => o.id !== id ? o : {...o, content: content});
        ctx.response.status = 204;
        return;
    }
    posts.push({...ctx.request.body, id: nextId++, created: Date.now(), avatar, name});    
    ctx.response.status = 204;    
});

router.delete('/posts/:id', async(ctx, next) => {
    const postId = Number(ctx.params.id);
    const index = posts.findIndex(o => o.id === postId);
    if (index !== -1) {
        posts.splice(index, 1);
    }
    ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 9999;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started @port ' + port));
