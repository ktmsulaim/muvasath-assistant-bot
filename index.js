require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");

const api = new axios.create({
  baseURL: process.env.BASE_URL,
});

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.hears(["Hi", "hi"], (ctx) => ctx.reply("Hey there!"));

function splitMessage(response) {
  if(response) {
    const max_size = 4096;
    var amount_sliced = response.length / max_size;
    var start = 0
    var end = max_size
    var message
    var messagesArray = []
    for (let i = 0; i < amount_sliced; i++) {
      message = response.slice(start, end) 
      messagesArray.push(message)
      start = start + max_size
      end = end + max_size
    }

    return messagesArray;
  }
}

function handleSplitMessage(ctx, data) {
  if(data.length > 4096) {
    const messages = splitMessage(data);
    messages.forEach((message) => {
      if(message) {
        ctx.reply(message);
      }
    })
  } else {
    ctx.reply(data);
  }
}

bot.command("batch_wise_members_total_amount", async (ctx) => {
  try {
    const response = await api.get("/campaigns/stats/batchWise");
    const data = response.data;

    if(data) {
      handleSplitMessage(ctx, data);
    }

  } catch (error) {
    console.log(error);
    ctx.reply("Sorry! some thing went wrong!");
  }
});

bot.command("batch_wise_members_total_amount_not_received", async (ctx) => {
  try {
    const response = await api.get("/campaigns/stats/batchWise/notReceived");
    const data = response.data;
    if(data) {
      if(data.length > 4096) {
        handleSplitMessage(ctx, data);
      } else {
        ctx.reply(data);
      }
    }
  } catch (error) {
    console.log(error);
    ctx.reply("Sorry! some thing went wrong!");
  }
});

bot.command("toppers", async (ctx) => {
  try {
    const response = await api.get("/campaigns/stats/toppers");
    const data = response.data;

    if(data) {
      handleSplitMessage(ctx, data);
    }

  } catch (error) {
    console.log(error);
    ctx.reply("Sorry! some thing went wrong!");
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
