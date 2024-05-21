import express from 'express';
import mysql from 'mysql';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'feed_app',
});

app.get('/', (req, res) => {
  return res.status(200).json({
    error: true,
    message: 'OK',
    data: [],
  });
});

app.get('/posts', (req, res) => {
  connection.getConnection((err, conn) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: 'Failed to connect to the database',
        data: [],
      });
    }

    conn.query('SELECT * FROM posts', [], (err, results) => {
      if (err) {
        throw err;
      }

      conn.release();
      return res.status(200).json({
        error: false,
        message: 'Posts Found',
        data: results,
      });
    });
  });
});

app.post('/post/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({
      error: true,
      message: 'Invalid Param. ID is required',
      data: [],
    });
  } else {
    connection.getConnection((err, conn) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: 'Failed to connect to the database',
          data: [],
        });
      }

      conn.query('SELECT * FROM posts WHERE id = ?', [id], (err, results) => {
        if (err) {
          throw err;
        }

        if (Object.keys(results).length <= 0) {
          conn.release();
          return res.status(404).json({
            error: true,
            message: 'Post Not Found',
            data: [],
          });
        } else {
          conn.query(
            'UPDATE `posts` SET `isLoved`= ? WHERE id = ?',
            [!results[0].isLoved, id],
            (e, r) => {
              if (e) {
                throw e;
              }
              conn.release();
              return res.status(200).json({
                error: false,
                message: 'Post Updated',
                data: results,
              });
            }
          );
        }
      });
    });
  }
});

app.listen(PORT, () => {
  console.log('Server is running: http://localhost:3000');
});
