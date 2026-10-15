import net from "node:net";

// Local-only SMTP sink. No forwarding, credentials, DNS lookup or real recipient delivery.
export async function startSmtpSink() {
  const messages = [];
  const sockets = new Set();
  const server = net.createServer((socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    socket.on("error", () => {});
    socket.setEncoding("utf8");
    socket.write("220 localhost test SMTP\r\n");
    let buffer = "";
    let data = null;
    socket.on("data", (chunk) => {
      buffer += chunk;
      let end;
      while ((end = buffer.indexOf("\r\n")) !== -1) {
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        if (data) {
          if (line === ".") {
            messages.push(data.join("\r\n"));
            data = null;
            socket.write("250 accepted by test sink\r\n");
          } else data.push(line.replace(/^\.\./, "."));
        } else if (/^(EHLO|HELO) /i.test(line))
          socket.write("250-localhost\r\n250 SIZE 1048576\r\n");
        else if (line === "DATA") {
          data = [];
          socket.write("354 send message\r\n");
        } else if (line === "QUIT") socket.end("221 bye\r\n");
        else if (/^(MAIL FROM:|RCPT TO:|RSET|NOOP)/i.test(line))
          socket.write("250 ok\r\n");
        else socket.write("500 unsupported test command\r\n");
      }
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    messages,
    transportOptions: {
      host: "127.0.0.1",
      port: server.address().port,
      secure: false,
      ignoreTLS: true,
      connectionTimeout: 2000,
      socketTimeout: 3000,
    },
    async close() {
      for (const socket of sockets) socket.destroy();
      await new Promise((resolve) => server.close(resolve));
    },
  };
}
