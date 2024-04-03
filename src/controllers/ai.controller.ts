import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { aiService, postService } from "../services";

const getExplanationStream = catchAsync(async (req, res) => {
  const { postId } = req.body;
  const post = await postService.getPostById(postId);
  if (!post) {
    res.status(httpStatus.NOT_FOUND).send("Post not found");
    return;
  }
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Transfer-Encoding": "chunked",
  });

  const stream = await aiService.getExplanationStream(post.title, post.content);
  for await (const chunk of stream) {
    res.write(chunk.choices[0].delta.content + "\n");
  }
  console.log("Stream ended");
  res.end();
});

export default {
  getExplanationStream,
};
