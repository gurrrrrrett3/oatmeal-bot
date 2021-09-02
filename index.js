//requires

const { TOKEN, ClientID, GuildID, CAT_API_KEY } = require("./auth.json");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const Intent = Discord.Intents.FLAGS;
const Client = new Discord.Client({
    intents: [Intent.GUILDS, Intent.GUILD_MESSAGES, Intent.GUILD_INTEGRATIONS],
});

Client.login(TOKEN);

const commands = [
    new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows Bot's Network information!"),
    new SlashCommandBuilder()
    .setName("oatreal")
    .setDescription("Tells you that you're oatreal!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(TOKEN);

(async() => {
    try {
        await rest.put(Routes.applicationGuildCommands(ClientID, GuildID), {
            body: commands,
        });

        console.log("Successfully registered application commands.");
    } catch (error) {
        console.error(error);
    }
})();

Client.on("interactionCreate", async(interaction) => {
    const command = interaction.commandName;

    if (command == "ping") {
        const sent = await interaction.reply({
            content: "Pinging...",
            fetchReply: true,
        });
        interaction.editReply({
            embeds: [
                new Discord.MessageEmbed()
                .setColor(interaction.member.displayHexColor)
                .setTitle("Pong!")
                .setDescription(
                    `Websocket Ping: ${Client.ws.ping}ms, Reply ping: ${
              sent.createdTimestamp - interaction.createdTimestamp
            }ms.`
                ),
            ],
        });
    } else if (command == "oatreal") {
        interaction.reply("You're Oatreal!")
    }
})


    Client.on("messageCreate", (message) => {

        if (message.author.id != Client.user.id) {

            const content = message.content

            if (content.toLowerCase() == "oatmeal") {
                message.reply("Oatmeal")
            }
        }

    })

    Client.on("guildMemberAdd", async (member) => {

        const guild = member.guild
        const channels = await guild.channels.fetch()

        const welcomeChannel = channels.get("882736354897850381")

        welcomeChannel.send(`Welcome <@${member.id}>!`)

        console.log(member)
        

        const roles = await guild.roles.fetch()

        const role = roles.get("882739557320257536")

        member.roles.add(role)

    })