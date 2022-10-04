import polka   from 'polka';
import sirv    from 'sirv';

const port = process.env.PORT;
const root = process.env.ROOT;

const pServer = polka().use(sirv(root)).listen(port, (err) =>
{
   if (err) { throw err; }
   console.log(`> Ready on localhost:${port}`);
});