`use-force`;
//require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

//Remote

import Discord from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import lodash from "lodash";

//local

const { version } = require("./package.json");
const { TOKEN, ClientID, GuildID } = require("./auth.json");
import { level } from "./leveling.js";

//Database
import { LowSync, JSONFileSync } from "lowdb";

const db = new LowSync(new JSONFileSync("./data.json"));
db.read();
var data = db.data;
db.chain = lodash.chain(db.data);

console.log("Loaded database with a size of " + `${data}`.length + " Bytes");

//Client

const Intent = Discord.Intents.FLAGS;
const Client = new Discord.Client({
  intents: [
    Intent.GUILDS,
    Intent.GUILD_MESSAGES,
    Intent.GUILD_INTEGRATIONS,
    Intent.GUILD_MEMBERS,
    Intent.GUILD_EMOJIS_AND_STICKERS,
  ],
});

//Login
Client.login(TOKEN);

//ready

Client.once("ready", () => {
  console.log("Get oatreal!");
});

//Slash Commands
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows Bot's Network information!"),
  new SlashCommandBuilder()
    .setName("oatreal")
    .setDescription("Tells you that you're oatreal!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(TOKEN);

//Send Slash commands

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(ClientID, GuildID), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();

//Slash command code

Client.on("interactionCreate", async (interaction) => {
  const command = interaction.commandName;

  //ping command
  if (command == "ping") {
    //inital ping message
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    //edit message to show ping info
    interaction.editReply({
      embeds: [
        new Discord.MessageEmbed() //Create Embed
          .setColor(interaction.member.displayHexColor)
          .setTitle("Pong!")
          .setDescription(
            `**WS Ping:** \`${Client.ws.ping}ms\`\n**Reply ping:** \`${
              sent.createdTimestamp - interaction.createdTimestamp
            }ms\``
          )
          .setFooter(
            `${Client.user.username}#${Client.user.discriminator} | Ver: ${version}`,
            Client.user.avatarURL()
          ),
      ],
    });
  } else if (command == "oatreal") {
    interaction.reply("You're Oatreal!");
  }
});

//message code

Client.on("messageCreate", async (message) => {
  //DATABASE TIME
  const users = db.chain.get("users");
  const userData = users.find({ id: message.author.id }).value();

  if (!userData) {
    const defaultUserData = {
      id: message.author.id,
      stats: {
        messages: 0,
        oatmeal: 0,
      },
      leveling: {
        level: 0,
        xp: 0,
        totalXp: 0,
        lastXp: Date.now(),
      },
    };
  }

  if (message.author.id != Client.user.id) {
    //input parsing

    const content = message.content;
    const lContent = content.toLowerCase();
    const text = content.slice(1);
    const args = text.split(" ");
    const command = args.shift().toLowerCase();

    if (lContent.includes("oatmeal")) {
      message.reply("Oatmeal");
    }

    if (lContent.includes("oatreal")) {
      message.reply("You're Oatreal!");
    }

    if (lContent.includes("ping")) {
      const sent = await message.reply({
        content: "Pinging...",
        fetchReply: true,
      });

      message.channel.send({
        embeds: [
          new Discord.MessageEmbed() //Create Embed
            .setColor(message.member.displayHexColor)
            .setTitle("Pong!")
            .setDescription(
              `**WS Ping:** \`${Client.ws.ping}ms\`\n**Reply ping:** \`${
                sent.createdTimestamp - message.createdTimestamp
              }ms\``
            )
            .setFooter(
              `${Client.user.username}#${Client.user.discriminator} | Ver: ${version}`,
              Client.user.avatarURL()
            ),
        ],
      });
    }

    if (lContent.includes("damn")) {
      message.reply("<:damn:882761329050550312>");
    }

    if (content.startsWith("-")) {
      if (command == "stats") {
        const servers = {
          updated: "11:30PM 9-3-21",
          poke: 65,
          dd: 81,
          film: 129,
          table: 131,
          tele: 162,
          eng: 204,
          lol: 219,
          esp: 714,
          cis: 802,
        };

        const oat = message.guild.memberCount;

        const data = [
            formatWar("Official Grand Valley Pokemon Club", oat, servers.poke),
            formatWar("D&D Club GV", oat, servers.dd),
            formatWar("The Network of Filmmakers", oat, servers.film),
            formatWar("GVSU Tabletop Gaming", oat, servers.table),
            formatWar("Grand Valley Television", oat, servers.tele),
            formatWar("GVSU Engineering", oat, servers.eng),
            formatWar("Laker Legends", oat, servers.lol),
            formatWar("GVSU Esports", oat, servers.esp),
            formatWar("GVSU CIS", oat, servers.cis),
          ]

          console.log(data)

        const embed = new Discord.MessageEmbed()
          .setAuthor(
            `WAR STATUS | Requested by ${message.member.displayName}`,
            message.author.avatarURL()
          )
          .setTitle(`Oatmeal Members: ${oat}`)
          .setFields(data)
          .setTimestamp()
          .setFooter(`Last updated: ${servers.updated}`)

          message.reply({embeds: [embed]})
      }
    }
  }
});

//member join code

Client.on("guildMemberAdd", async (member) => {
  const guild = member.guild;
  const channels = await guild.channels.fetch();

  const welcomeChannel = channels.get("882736354897850381");

  welcomeChannel.send(`Welcome <@${member.id}>!`);

  const roles = await guild.roles.fetch();

  const role = roles.get("882739557320257536");

  member.roles.add(role);
});

function formatWar(name, oat, vs) {
  var out = { name: "", value: "", inline: true };
  if (oat > vs) {
    out.value = `${name} has ${vs} members, ${oat - vs} fewer than us!`;
  } else {
    out.value = `${name} has ${vs} members, ${vs - oat} more than us!`;
  }
  out.name = name;
  return out;
}
