import * as discord from "discord.js";
import * as redis from "redis";
import { success, fail } from "./functions";
const bot = new discord.Client();
import { TOKEN, CHANNEL, DB_URL, STARTING_NUMBER } from "./config";

const client = redis.createClient(DB_URL);

client.on("connect", function () {
  success("Redis client connected");
});

client.get("number", function (err, val) {
  if (err) {
    console.log(err);
    throw err;
  }
  if (val < STARTING_NUMBER || val == null) {
    client.set("number", STARTING_NUMBER);
  }
});

bot
  .login(TOKEN)
  .catch((err) => fail(`Failed to log in with bot token. ${err}`));

bot.on("ready", () => {
  success("Bot is ready!");
  bot.user.setActivity("Ready To Count");
});

bot.on("message", (msg) => {
  const command = msg.content.split(" ").slice(0, 2);
  const channel = msg.channel as discord.TextChannel;

  if (command[0] === ".count") {
    const number = parseInt(command[1]);
    if (isNaN(number)) {
      fail("pp");
    } else {
      client.set("number", String(command[1]));
      channel.send(`Number Updated!`);
    }
  }
  if (msg.channel.id === CHANNEL) {
    var discord_number = parseInt(msg.content);
    if (discord_number) {
      success("Found Discord Number");
      client.get("number", function (err, val) {
        if (err) {
          console.log(err);
          throw err;
        }
        success("Redis Number " + val);
        if (discord_number === parseInt(val) + 1) {
          client.set("number", String(discord_number));
        } else {
          msg.react("‼");
          fail("bad number");
          msg.author.send("YOU TYPED A WRONG NUMBER!! GO DELETE IT");
        }
      });
    } else {
      msg.react("‼");
      msg.author.send("YOU TYPED A WRONG NUMBER!! GO DELETE IT");
    }
  }
});
