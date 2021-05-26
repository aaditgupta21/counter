import * as discord from "discord.js";
import * as redis from "redis";

const bot = new discord.Client();
import { TOKEN, CHANNEL, DB_URL, STARTING_NUMBER } from "./config";

const client = redis.createClient(DB_URL);

client.on("connect", function () {
  console.log("Redis client connected");
});

client.get("number", function (err, val) {
  if (err) {
    console.log(err);
    throw err;
  }
  if (val < STARTING_NUMBER) {
    client.set("number", STARTING_NUMBER);
  }
});

bot
  .login(TOKEN)
  .catch((err) => console.log(`Failed to log in with bot token. ${err}`));

bot.on("ready", () => {
  console.log("Bot is ready!");
  bot.user.setActivity("Ready To Count");
});

bot.on("message", (msg) => {
  if (msg.channel.id === CHANNEL) {
    var discord_number = parseInt(msg.content);
    if (discord_number) {
      console.log("wahooo");
      client.get("number", function (err, val) {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log(val);
        if (discord_number === parseInt(val) + 1) {
          msg.channel.messages.fetch({ limit: 1 }).then((messages) => {
            let firstauthor = messages.first().author.id;
            if (firstauthor === msg.author.id) {
              msg.delete();
              msg.author.send("YOU TYPED A MESSAGE TWICE");
            } else {
              client.set("number", String(discord_number));
            }
          });
        } else {
          msg.react("‼");
          console.log("bad number");
          msg.author.send("YOU TYPED A WRONG NUMBER!! GO DELETE IT");
        }
      });
    } else {
      msg.react("‼");
      msg.author.send("YOU TYPED A WRONG NUMBER!! GO DELETE IT");
    }
  }
});
