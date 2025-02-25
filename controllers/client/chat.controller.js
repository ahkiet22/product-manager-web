const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // SocketIO
  _io.on("connection", (socket) => {
    socket.sentMydata = false;
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      try {
        if (!socket.sentMydata) {
          // Lưu vào database
          const chat = new Chat({
            user_id: userId,
            content: content,
          });
          await chat.save();

          _io.emit("SERVER_RETURN_MESSAGE", {
            userId: userId,
            fullName: fullName,
            content: content,
          });

          // Đánh dấu đã gửi tin nhắn
          socket.sentMydata = true;
        }
      } catch (error) {
        console.error("Error saving message: ", error);
      }
    });
  });
  // End SocketIO

  // Lấy data từ database
  const chats = await Chat.find({
    deleted: false,
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");
    // console.log(infoUser);
    chat.infoUser = infoUser;
  }

  // End Lấy data từ database
  res.render("client/pages/chat/index.pug", {
    pageTitle: "Chat",
    chats: chats,
  });
};
