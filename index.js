require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");

const api = new axios.create({
  baseURL: process.env.BASE_URL,
});

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.hears(["Hi", "hi"], (ctx) => ctx.reply("Hey there!"));

bot.command("batch_wise_members_total_amount", async (ctx) => {
  try {
    const response = await api.get("/campaigns/stats/batchWise");

    ctx.reply(response.data);
  } catch (error) {
    ctx.reply("Sorry! some thing went wrong!");
  }
});

bot.command("batch_wise_members_total_amount_not_received", async (ctx) => {
  try {
    const response = await api.get("/campaigns/stats/batchWise/notReceived");

    ctx.reply(response.data);
  } catch (error) {
    ctx.reply("Sorry! some thing went wrong!");
  }
});

bot.command("toppers", async (ctx) => {
  try {
    const response = await api.get("/campaigns/stats/toppers");

    ctx.reply(response.data);
  } catch (error) {
    ctx.reply("Sorry! some thing went wrong!");
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
