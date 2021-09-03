`use-force`
//require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

//Remote

import Discord from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

//local

const { version } = require("./package.json")
const { TOKEN, ClientID, GuildID } = require("./auth.json");

//Client

const Intent = Discord.Intents.FLAGS;
const Client = new Discord.Client({
  intents: [
    Intent.GUILDS,
    Intent.GUILD_MESSAGES,
    Intent.GUILD_INTEGRATIONS,
    Intent.GUILD_MEMBERS,
  ],
});

//Login
Client.login(TOKEN);

//ready

Client.once("ready", () => {
    console.log("Get oatreal!")
})

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
          .setFooter(`${Client.user.username}#${Client.user.discriminator} | Ver: ${version}`, Client.user.avatarURL()),
      ],
    });
  } else if (command == "oatreal") {
    interaction.reply("You're Oatreal!");
  }
});

//message code

Client.on("messageCreate", (message) => {
  if (message.author.id != Client.user.id) {
    const content = message.content;

    if (content.toLowerCase().includes("oatmeal")) {
      message.reply("Oatmeal");
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
