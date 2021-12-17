import { DiscordEvents } from "../../interfaces";

export const event: DiscordEvents = {
    name: "ready",
    run: async (client) => {
        console.log(`${client.discord.user?.tag} is online!`);

        console.log("Discord Commands:", [...client.discordCommands.values()].map((v) => `[${v.group}] ${v.name} - ${v.description}`), "\n");

    }
};