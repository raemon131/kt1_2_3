const db = require("../config/db");

class Post {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }

  async save() {
    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();
    let createdDate = `${yyyy}-${mm}-${dd}`;

    let sql = `INSERT INTO posts(title,body,created_at) VALUES('${this.title}', '${this.body}', '${createdDate}')`;

    const [newPost, _] = await db.execute(sql);
    return newPost;
  }

 
  static findAll() {
    let sql = "SELECT * FROM posts;";
    return db.execute(sql);
  }

  static findById(id) {
    let sql = `SELECT * FROM posts WHERE id=${id}`;
    return db.execute(sql);
  }

  static updateById(id, title, body) {
    let sql = `UPDATE posts SET title='${title}', body='${body}' WHERE id=${id}`;
    return db.execute(sql);
  }

  static deleteById(id) {
    let sql = `DELETE FROM posts WHERE id=${id}`;
    return db.execute(sql);
  }
}

module.exports = Post;
