const Post = require("../models/Post");

exports.getAllPosts = async (req, res, next) => {
  try {
    const [posts, _] = await Post.findAll();
    res.status(200).json({ count: posts.length, posts });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    let postId = Number(req.params.id);
    let [post, _] = await Post.findById(postId);
    res.status(200).json({ post: post[0] });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createNewPost = async (req, res, next) => {
  try {
    let { title, body } = req.body;
    let post = new Post(title, body);
    post = await post.save();
    res.status(201).json({ message: "Post created" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    let postId = Number(req.params.id);
    let { title, body } = req.body;
 
    const [result, _] = await Post.updateById(postId, title, body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
 
    res.status(200).json({ message: "Post updated" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    let postId = Number(req.params.id);
 
    const [result, _] = await Post.deleteById(postId);
 
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
 
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
